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
import { applyFdTds, fdMaturity, fdYearlyRows, type FdCompounding } from "@/lib/finance/fd";
import { inr, percent } from "@/lib/finance/format";
import { getTool } from "@/lib/config/tools";
import { fixedDepositInfo, standardGrowthColumns } from "@/lib/tool-page-content";

const COMPOUND_OPTIONS: { value: FdCompounding; labelKey: string }[] = [
  { value: 1, labelKey: "Tool_fixed_deposit_Compound_Annual" },
  { value: 2, labelKey: "Tool_fixed_deposit_Compound_Half" },
  { value: 4, labelKey: "Tool_fixed_deposit_Compound_Quarterly" },
  { value: 12, labelKey: "Tool_fixed_deposit_Compound_Monthly" },
];

export function FixedDepositCalculator() {
  const t = useT();
  const tool = getTool("fixed-deposit")!;

  const [principal, setPrincipal] = useState(500_000);
  const [rate, setRate] = useState(7.25);
  const [years, setYears] = useState(3);
  const [compounds, setCompounds] = useState<FdCompounding>(4);
  const [senior, setSenior] = useState(false);
  const [includeTds, setIncludeTds] = useState(true);

  const breakdownColumns = useMemo(() => standardGrowthColumns(t), [t]);

  const exampleSteps = useMemo(
    () => [
      t("Tool_fixed_deposit_ExampleStep_1"),
      t("Tool_fixed_deposit_ExampleStep_2"),
      t("Tool_fixed_deposit_ExampleStep_3"),
      t("Tool_fixed_deposit_ExampleStep_4"),
      t("Tool_fixed_deposit_ExampleStep_5"),
    ],
    [t],
  );

  const { summaryCards, scenarios, breakdownRows } = useMemo(() => {
    const p = Math.max(0, principal);
    const r = Math.max(0, rate);
    const y = Math.max(0, years);
    let result = fdMaturity(p, r, y, compounds);
    if (includeTds) result = applyFdTds(result, senior);

    const bank = fdMaturity(p, 6.5, y, compounds);
    const nbfc = fdMaturity(p, 8.5, y, compounds);

    return {
      summaryCards: [
        {
          label: t("Tool_fixed_deposit_Result_Principal"),
          value: inr(p),
          footnote: t("Tool_fixed_deposit_Result_PrincipalFootnote"),
        },
        {
          label: t("Tool_fixed_deposit_Result_Maturity"),
          value: inr(includeTds ? result.netMaturity : result.maturity),
          footnote: t("Common_Footnote_RatePa", percent(r)),
          variant: "primary" as const,
        },
        {
          label: t("Tool_fixed_deposit_Result_Interest"),
          value: inr(includeTds ? result.netInterest : result.interest),
          footnote: includeTds && result.tds > 0 ? t("Tool_fixed_deposit_Result_TdsFootnote", inr(result.tds)) : t("Tool_fixed_deposit_Result_InterestFootnote", percent(result.effectiveRate)),
          variant: "secure" as const,
        },
      ],
      scenarios: [
        {
          name: t("Tool_fixed_deposit_Scenario_Bank"),
          primaryLabel: t("Tool_fixed_deposit_Result_Maturity"),
          primaryValue: inr(bank.maturity),
          secondaryLabel: t("Common_Label_Return"),
          secondaryValue: "6.5%",
          variant: "worst",
        },
        {
          name: t("Common_Scenario_Base"),
          primaryLabel: t("Tool_fixed_deposit_Result_Maturity"),
          primaryValue: inr(result.maturity),
          secondaryLabel: t("Common_Label_Return"),
          secondaryValue: percent(r),
          variant: "base",
        },
        {
          name: t("Tool_fixed_deposit_Scenario_Nbfc"),
          primaryLabel: t("Tool_fixed_deposit_Result_Maturity"),
          primaryValue: inr(nbfc.maturity),
          secondaryLabel: t("Common_Label_Return"),
          secondaryValue: "8.5%",
          variant: "best",
        },
      ],
      breakdownRows: fdYearlyRows(p, r, y, compounds).map((row) => ({
        cells: {
          year: typeof row.year === "number" && row.year % 1 !== 0 ? t("Tool_fixed_deposit_YearPartial", row.year.toFixed(1)) : t("Common_YearN", Math.floor(row.year)),
          invested: inr(p),
          value: inr(row.value),
          gain: inr(row.interest),
        },
      })),
    };
  }, [principal, rate, years, compounds, senior, includeTds, t]);

  return (
    <ToolPageShell
      title={t(tool.titleKey)}
      subtitle={t("Tool_fixed_deposit_Subtitle")}
      description={t(tool.descriptionKey)}
      icon={tool.icon}
      educate={
        <>
          <div className="fy-info-box">
            <strong>{t("Common_WhatYouLearn")}</strong>
            <p>{t("Tool_fixed_deposit_LearnText")}</p>
          </div>
          <FormulaCard
            title={t("Common_Formula")}
            code="A = P × (1 + r/n)^(n×t)"
            note={t("Tool_fixed_deposit_FormulaNote")}
          />
        </>
      }
      below={<ToolInfoPanel info={fixedDepositInfo(t)} />}
    >
      <div className="fy-form-card">
        <h3>{t("Common_YourInputs")}</h3>
        <div className="fy-field">
          <label>{t("Tool_fixed_deposit_LabelPrincipal")}</label>
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
            step={0.05}
            inputMode="decimal"
            value={rate}
            onChange={(e) => setRate(Math.max(0, Number(e.target.value) || 0))}
          />
        </div>
        <div className="fy-field">
          <label>{t("Common_Label_Years")}</label>
          <input
            type="number"
            min={0.25}
            step={0.25}
            inputMode="decimal"
            value={years}
            onChange={(e) => setYears(Math.max(0, Number(e.target.value) || 0))}
          />
        </div>
        <div className="fy-field">
          <label>{t("Tool_fixed_deposit_LabelFrequency")}</label>
          <select value={compounds} onChange={(e) => setCompounds(Number(e.target.value) as FdCompounding)}>
            {COMPOUND_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {t(opt.labelKey)}
              </option>
            ))}
          </select>
        </div>
        <div className="fy-field">
          <label>
            <input type="checkbox" checked={senior} onChange={(e) => setSenior(e.target.checked)} />{" "}
            {t("Tool_fixed_deposit_LabelSenior")}
          </label>
        </div>
        <div className="fy-field">
          <label>
            <input type="checkbox" checked={includeTds} onChange={(e) => setIncludeTds(e.target.checked)} />{" "}
            {t("Tool_fixed_deposit_LabelTds")}
          </label>
          <p className="fy-field-hint">{t("Tool_fixed_deposit_TdsHint")}</p>
        </div>
        <button type="button" className="fy-btn-calc">
          {t("Common_Calculate")}
        </button>
      </div>

      <ResultSummaryCards cards={summaryCards} />
      <ScenarioCompare
        title={t("Tool_fixed_deposit_ScenarioTitle")}
        subtitle={t("Tool_fixed_deposit_ScenarioSubtitle")}
        scenarios={scenarios}
      />
      <BreakdownTable title={t("Tool_fixed_deposit_BreakdownTitle")} columns={breakdownColumns} rows={breakdownRows} />
      <WorkedExample
        title={t("Tool_fixed_deposit_ExampleTitle")}
        subtitle={t("Tool_fixed_deposit_ExampleSubtitle")}
        steps={exampleSteps}
      />
    </ToolPageShell>
  );
}
