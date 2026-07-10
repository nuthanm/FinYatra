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
import { futureValue } from "@/lib/finance/compound";
import { inr, percent } from "@/lib/finance/format";
import { lumpsumYearly } from "@/lib/finance/projections";
import { getTool } from "@/lib/config/tools";
import { lumpsumInfo, standardGrowthColumns } from "@/lib/tool-page-content";

export function LumpsumCalculator() {
  const t = useT();
  const tool = getTool("lumpsum")!;

  const [principal, setPrincipal] = useState(500000);
  const [annualRate, setAnnualRate] = useState(12);
  const [years, setYears] = useState(10);

  const breakdownColumns = useMemo(() => standardGrowthColumns(t), [t]);

  const exampleSteps = useMemo(
    () => [
      t("Tool_lumpsum_ExampleStep_1"),
      t("Tool_lumpsum_ExampleStep_2"),
      t("Tool_lumpsum_ExampleStep_3"),
      t("Tool_lumpsum_ExampleStep_4"),
      t("Tool_lumpsum_ExampleStep_5"),
    ],
    [t],
  );

  const { summaryCards, scenarios, breakdownRows } = useMemo(() => {
    const safePrincipal = Math.max(0, principal);
    const safeRate = Math.max(0, annualRate);
    const safeYears = Math.max(0, years);
    const future = futureValue(safePrincipal, safeRate, safeYears);
    const conservative = futureValue(safePrincipal, 8, safeYears);
    const aggressive = futureValue(safePrincipal, 15, safeYears);

    return {
      summaryCards: [
        {
          label: t("Tool_lumpsum_Result_Invested"),
          value: inr(safePrincipal),
          footnote: t("Tool_lumpsum_Result_InvestedFootnote"),
        },
        {
          label: t("Tool_lumpsum_Result_FutureValue"),
          value: inr(future),
          footnote: t("Common_Footnote_RatePa", percent(safeRate)),
          variant: "primary" as const,
        },
        {
          label: t("Tool_lumpsum_Result_Gains"),
          value: inr(future - safePrincipal),
          footnote: t("Common_Footnote_AfterYears", safeYears),
          variant: "volatile" as const,
        },
      ],
      scenarios: [
        {
          name: t("Tool_lumpsum_Scenario_Conservative"),
          primaryLabel: t("Common_Label_FutureValue"),
          primaryValue: inr(conservative),
          secondaryLabel: t("Common_Label_Return"),
          secondaryValue: "8%",
          variant: "worst",
        },
        {
          name: t("Common_Scenario_Base"),
          primaryLabel: t("Common_Label_FutureValue"),
          primaryValue: inr(future),
          secondaryLabel: t("Common_Label_Return"),
          secondaryValue: percent(safeRate),
          variant: "base",
        },
        {
          name: t("Tool_lumpsum_Scenario_Aggressive"),
          primaryLabel: t("Common_Label_FutureValue"),
          primaryValue: inr(aggressive),
          secondaryLabel: t("Common_Label_Return"),
          secondaryValue: "15%",
          variant: "best",
        },
      ],
      breakdownRows: lumpsumYearly(safePrincipal, safeRate, safeYears).map((r) => ({
        cells: {
          year: t("Common_YearN", r.year),
          invested: inr(r.invested),
          value: inr(r.value),
          gain: inr(r.gain),
        },
      })),
    };
  }, [principal, annualRate, years, t]);

  return (
    <ToolPageShell
      title={t(tool.titleKey)}
      subtitle={t("Tool_lumpsum_Subtitle")}
      description={t(tool.descriptionKey)}
      icon={tool.icon}
      educate={
        <>
          <div className="fy-info-box">
            <strong>{t("Common_WhatYouLearn")}</strong>
            <p>{t("Tool_lumpsum_LearnText")}</p>
          </div>
          <FormulaCard
            title={t("Common_Formula")}
            code="FV = PV × (1 + r)^years"
            note={t("Tool_lumpsum_FormulaNote")}
          />
        </>
      }
      below={<ToolInfoPanel info={lumpsumInfo(t)} />}
    >
      <div className="fy-form-card">
        <h3>{t("Common_YourInputs")}</h3>
        <div className="fy-field">
          <label>{t("Tool_lumpsum_LabelPrincipal")}</label>
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
        <button type="button" className="fy-btn-calc">
          {t("Common_Calculate")}
        </button>
      </div>

      <ResultSummaryCards cards={summaryCards} />
      <ScenarioCompare
        title={t("Tool_lumpsum_ScenarioTitle")}
        subtitle={t("Tool_lumpsum_ScenarioSubtitle")}
        scenarios={scenarios}
      />
      <BreakdownTable title={t("Tool_lumpsum_BreakdownTitle")} columns={breakdownColumns} rows={breakdownRows} />
      <WorkedExample
        title={t("Tool_lumpsum_ExampleTitle")}
        subtitle={t("Tool_lumpsum_ExampleSubtitle")}
        steps={exampleSteps}
      />
    </ToolPageShell>
  );
}
