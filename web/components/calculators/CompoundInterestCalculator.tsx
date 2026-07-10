"use client";

import { useMemo, useState } from "react";
import { useT } from "@/components/providers/I18nProvider";
import {
  BreakdownTable,
  FormulaCard,
  ResultSummaryCards,
  ScenarioCompare,
  ToolInfoPanel,
  ToolPageShell,
  WorkedExample,
} from "@/components/calculator/CalculatorUi";
import { compoundInterest, ruleOf72 } from "@/lib/finance/compound";
import { inr, percent } from "@/lib/finance/format";
import { compoundYearly } from "@/lib/finance/projections";
import { getTool } from "@/lib/config/tools";
import { compoundInterestInfo, standardGrowthColumns } from "@/lib/tool-page-content";

const COMPOUND_OPTIONS = [
  { value: 1, labelKey: "Tool_interest_Compound_Annual" },
  { value: 4, labelKey: "Tool_interest_Compound_Quarterly" },
  { value: 12, labelKey: "Tool_interest_Compound_Monthly" },
  { value: 365, labelKey: "Tool_interest_Compound_Daily" },
] as const;

export function CompoundInterestCalculator() {
  const t = useT();
  const tool = getTool("interest")!;

  const [principal, setPrincipal] = useState(100000);
  const [annualRate, setAnnualRate] = useState(8);
  const [years, setYears] = useState(10);
  const [compoundsPerYear, setCompoundsPerYear] = useState(12);

  const breakdownColumns = useMemo(() => standardGrowthColumns(t), [t]);

  const exampleSteps = useMemo(
    () => [
      t("Tool_interest_ExampleStep_1"),
      t("Tool_interest_ExampleStep_2"),
      t("Tool_interest_ExampleStep_3"),
      t("Tool_interest_ExampleStep_4"),
      t("Tool_interest_ExampleStep_5"),
    ],
    [t],
  );

  const { summaryCards, scenarios, breakdownRows } = useMemo(() => {
    const safePrincipal = Math.max(0, principal);
    const safeRate = Math.max(0, annualRate);
    const safeYears = Math.max(0, years);
    const n = compoundsPerYear;
    const maturity = compoundInterest(safePrincipal, safeRate, safeYears, n);
    const annualOnly = compoundInterest(safePrincipal, safeRate, safeYears, 1);
    const quarterly = compoundInterest(safePrincipal, safeRate, safeYears, 4);
    const doubleYears = ruleOf72(safeRate);

    return {
      summaryCards: [
        {
          label: t("Tool_interest_Result_Principal"),
          value: inr(safePrincipal),
          footnote: t("Tool_interest_Result_PrincipalFootnote"),
        },
        {
          label: t("Tool_interest_Result_Maturity"),
          value: inr(maturity),
          footnote: t("Tool_interest_Result_MaturityFootnote", percent(safeRate)),
          variant: "primary" as const,
        },
        {
          label: t("Tool_interest_Result_Rule72"),
          value: doubleYears > 0 ? t("Tool_interest_Result_Rule72Value", doubleYears.toFixed(1)) : "—",
          footnote: t("Tool_interest_Result_Rule72Footnote"),
          variant: "volatile" as const,
        },
      ],
      scenarios: [
        {
          name: t("Tool_interest_Scenario_Annual"),
          primaryLabel: t("Common_Label_FutureValue"),
          primaryValue: inr(annualOnly),
          secondaryLabel: t("Tool_interest_LabelFrequency"),
          secondaryValue: t("Tool_interest_Compound_Annual"),
          variant: "worst",
        },
        {
          name: t("Common_Scenario_Base"),
          primaryLabel: t("Common_Label_FutureValue"),
          primaryValue: inr(maturity),
          secondaryLabel: t("Tool_interest_LabelFrequency"),
          secondaryValue: t(COMPOUND_OPTIONS.find((o) => o.value === n)?.labelKey ?? "Tool_interest_Compound_Monthly"),
          variant: "base",
        },
        {
          name: t("Tool_interest_Scenario_Quarterly"),
          primaryLabel: t("Common_Label_FutureValue"),
          primaryValue: inr(quarterly),
          secondaryLabel: t("Tool_interest_LabelFrequency"),
          secondaryValue: t("Tool_interest_Compound_Quarterly"),
          variant: "best",
        },
      ],
      breakdownRows: compoundYearly(safePrincipal, safeRate, safeYears, n).map((r) => ({
        cells: {
          year: t("Common_YearN", r.year),
          invested: inr(r.invested),
          value: inr(r.value),
          gain: inr(r.gain),
        },
      })),
    };
  }, [principal, annualRate, years, compoundsPerYear, t]);

  return (
    <ToolPageShell
      title={t(tool.titleKey)}
      subtitle={t("Tool_interest_Subtitle")}
      description={t(tool.descriptionKey)}
      icon={tool.icon}
      educate={
        <>
          <div className="fy-info-box">
            <strong>{t("Common_WhatYouLearn")}</strong>
            <p>{t("Tool_interest_LearnText")}</p>
          </div>
          <FormulaCard
            title={t("Common_Formula")}
            code="A = P × (1 + r/n)^(n×t)"
            note={t("Tool_interest_FormulaNote")}
          />
        </>
      }
      below={<ToolInfoPanel info={compoundInterestInfo(t)} />}
    >
      <div className="fy-form-card">
        <h3>{t("Common_YourInputs")}</h3>
        <div className="fy-field">
          <label>{t("Tool_interest_LabelPrincipal")}</label>
          <input
            type="number"
            min={0}
            inputMode="decimal"
            value={principal}
            onChange={(e) => setPrincipal(Math.max(0, Number(e.target.value) || 0))}
          />
        </div>
        <div className="fy-field">
          <label>{t("Common_Label_RatePa")}</label>
          <input
            type="number"
            min={0}
            step={0.1}
            inputMode="decimal"
            value={annualRate}
            onChange={(e) => setAnnualRate(Math.max(0, Number(e.target.value) || 0))}
          />
        </div>
        <div className="fy-field">
          <label>{t("Common_Label_Years")}</label>
          <input
            type="number"
            min={0}
            step={1}
            inputMode="numeric"
            value={years}
            onChange={(e) => setYears(Math.max(0, Number(e.target.value) || 0))}
          />
        </div>
        <div className="fy-field">
          <label>{t("Tool_interest_LabelFrequency")}</label>
          <select value={compoundsPerYear} onChange={(e) => setCompoundsPerYear(Number(e.target.value))}>
            {COMPOUND_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {t(opt.labelKey)}
              </option>
            ))}
          </select>
        </div>
        <button type="button" className="fy-btn-calc">
          {t("Common_Calculate")}
        </button>
      </div>

      <ResultSummaryCards cards={summaryCards} />
      <ScenarioCompare
        title={t("Tool_interest_ScenarioTitle")}
        subtitle={t("Tool_interest_ScenarioSubtitle")}
        scenarios={scenarios}
      />
      <BreakdownTable title={t("Tool_interest_BreakdownTitle")} columns={breakdownColumns} rows={breakdownRows} />
      <WorkedExample
        title={t("Tool_interest_ExampleTitle")}
        subtitle={t("Tool_interest_ExampleSubtitle")}
        steps={exampleSteps}
      />
    </ToolPageShell>
  );
}
