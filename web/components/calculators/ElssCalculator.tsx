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
import { calculateElss, elssYearlyRows } from "@/lib/finance/elss";
import { inr, percent } from "@/lib/finance/format";
import { getTool } from "@/lib/config/tools";
import { elssInfo, standardGrowthColumns } from "@/lib/tool-page-content";

export function ElssCalculator() {
  const t = useT();
  const tool = getTool("elss")!;

  const [monthly, setMonthly] = useState(12_500);
  const [returnPct, setReturnPct] = useState(12);
  const [years, setYears] = useState(10);

  const breakdownColumns = useMemo(() => standardGrowthColumns(t), [t]);

  const exampleSteps = useMemo(
    () => [
      t("Tool_elss_ExampleStep_1"),
      t("Tool_elss_ExampleStep_2"),
      t("Tool_elss_ExampleStep_3"),
      t("Tool_elss_ExampleStep_4"),
      t("Tool_elss_ExampleStep_5"),
    ],
    [t],
  );

  const { summaryCards, scenarios, breakdownRows } = useMemo(() => {
    const result = calculateElss(monthly, returnPct, years);
    const conservative = calculateElss(monthly, 10, years);
    const aggressive = calculateElss(monthly, 15, years);
    const annual80c = Math.min(monthly * 12, 150_000);

    return {
      summaryCards: [
        {
          label: t("Tool_elss_Result_Maturity"),
          value: inr(result.maturity),
          footnote: t("Common_Footnote_RatePa", percent(returnPct)),
          variant: "primary" as const,
        },
        {
          label: t("Tool_elss_Result_PostTax"),
          value: inr(result.postTaxValue),
          footnote: t("Tool_elss_Result_TaxFootnote", inr(result.ltcgTax)),
          variant: "secure" as const,
        },
        {
          label: t("Tool_elss_Result_80c"),
          value: inr(annual80c),
          footnote: t("Tool_elss_Result_80cFootnote"),
        },
      ],
      scenarios: [
        {
          name: t("Tool_elss_Scenario_Conservative"),
          primaryLabel: t("Tool_elss_Result_Maturity"),
          primaryValue: inr(conservative.maturity),
          secondaryLabel: t("Tool_elss_Result_PostTax"),
          secondaryValue: inr(conservative.postTaxValue),
          variant: "worst",
        },
        {
          name: t("Common_Scenario_Base"),
          primaryLabel: t("Tool_elss_Result_Maturity"),
          primaryValue: inr(result.maturity),
          secondaryLabel: t("Common_Label_Return"),
          secondaryValue: percent(returnPct),
          variant: "base",
        },
        {
          name: t("Tool_elss_Scenario_Aggressive"),
          primaryLabel: t("Tool_elss_Result_Maturity"),
          primaryValue: inr(aggressive.maturity),
          secondaryLabel: t("Tool_elss_Result_PostTax"),
          secondaryValue: inr(aggressive.postTaxValue),
          variant: "best",
        },
      ],
      breakdownRows: elssYearlyRows(monthly, returnPct, years).map((r) => ({
        cells: {
          year: t("Common_YearN", r.year),
          invested: inr(r.invested),
          value: inr(r.value),
          gain: inr(r.gain),
        },
      })),
    };
  }, [monthly, returnPct, years, t]);

  return (
    <ToolPageShell
      title={t(tool.titleKey)}
      subtitle={t("Tool_elss_Subtitle")}
      description={t(tool.descriptionKey)}
      icon={tool.icon}
      educate={
        <>
          <div className="fy-info-box">
            <strong>{t("Common_WhatYouLearn")}</strong>
            <p>{t("Tool_elss_LearnText")}</p>
          </div>
          <FormulaCard
            title={t("Common_Formula")}
            code={"FV = SIP × ((1+r)^n − 1) / r\nLTCG = 12.5% above ₹1.25L"}
            note={t("Tool_elss_FormulaNote")}
          />
        </>
      }
      below={<ToolInfoPanel info={elssInfo(t)} />}
    >
      <div className="fy-form-card">
        <h3>{t("Common_YourInputs")}</h3>
        <div className="fy-field">
          <label>{t("Tool_elss_LabelMonthly")}</label>
          <input
            type="number"
            min={0}
            step={500}
            inputMode="decimal"
            value={monthly}
            onChange={(e) => setMonthly(Math.max(0, Number(e.target.value) || 0))}
          />
          <p className="fy-field-hint">{t("Tool_elss_MonthlyHint")}</p>
        </div>
        <div className="fy-field">
          <label>{t("Common_Label_RatePa")}</label>
          <input
            type="number"
            min={0}
            step={0.5}
            inputMode="decimal"
            value={returnPct}
            onChange={(e) => setReturnPct(Math.max(0, Number(e.target.value) || 0))}
          />
        </div>
        <div className="fy-field">
          <label>{t("Common_Label_Years")}</label>
          <input
            type="number"
            min={3}
            max={40}
            step={1}
            inputMode="numeric"
            value={years}
            onChange={(e) => setYears(Math.max(3, Number(e.target.value) || 3))}
          />
          <p className="fy-field-hint">{t("Tool_elss_LockinHint")}</p>
        </div>
        <button type="button" className="fy-btn-calc">
          {t("Common_Calculate")}
        </button>
      </div>

      <ResultSummaryCards cards={summaryCards} />
      <ScenarioCompare title={t("Tool_elss_ScenarioTitle")} subtitle={t("Tool_elss_ScenarioSubtitle")} scenarios={scenarios} />
      <BreakdownTable title={t("Tool_elss_BreakdownTitle")} columns={breakdownColumns} rows={breakdownRows} />
      <WorkedExample title={t("Tool_elss_ExampleTitle")} subtitle={t("Tool_elss_ExampleSubtitle")} steps={exampleSteps} />
    </ToolPageShell>
  );
}
