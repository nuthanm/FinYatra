"use client";

import { useMemo, useState } from "react";
import { useT } from "@/components/providers/I18nProvider";
import {
  FormulaCard,
  ResultSummaryCards,
  ScenarioCompare,
  ToolInfoPanel,
  ToolPageShell,
  WorkedExample,
} from "@/components/calculator/CalculatorUi";
import { compareFlatVsReducing } from "@/lib/finance/flatVsReducing";
import { inr, percent } from "@/lib/finance/format";
import { getTool } from "@/lib/config/tools";
import { flatVsReducingRateInfo } from "@/lib/tool-page-content";

export function FlatVsReducingRateCalculator() {
  const t = useT();
  const tool = getTool("flat-vs-reducing-rate")!;

  const [principal, setPrincipal] = useState(500_000);
  const [rate, setRate] = useState(12);
  const [years, setYears] = useState(3);

  const exampleSteps = useMemo(
    () => [
      t("Tool_flat_vs_reducing_rate_ExampleStep_1"),
      t("Tool_flat_vs_reducing_rate_ExampleStep_2"),
      t("Tool_flat_vs_reducing_rate_ExampleStep_3"),
      t("Tool_flat_vs_reducing_rate_ExampleStep_4"),
      t("Tool_flat_vs_reducing_rate_ExampleStep_5"),
    ],
    [t],
  );

  const { summaryCards, scenarios, rateScenarios, result } = useMemo(() => {
    const cmp = compareFlatVsReducing(principal, rate, years);
    const lower = compareFlatVsReducing(principal, Math.max(0, rate - 2), years);
    const higher = compareFlatVsReducing(principal, rate + 2, years);

    return {
      result: cmp,
      summaryCards: [
        {
          label: t("Tool_flat_vs_reducing_rate_Result_FlatEmi"),
          value: inr(cmp.flatEmi),
          footnote: t("Tool_flat_vs_reducing_rate_Result_FlatEmiFootnote", inr(cmp.flatTotalInterest)),
          variant: "volatile" as const,
        },
        {
          label: t("Tool_flat_vs_reducing_rate_Result_ReducingEmi"),
          value: inr(cmp.reducingEmi),
          footnote: t("Tool_flat_vs_reducing_rate_Result_ReducingEmiFootnote", inr(cmp.reducingTotalInterest)),
          variant: "primary" as const,
        },
        {
          label: t("Tool_flat_vs_reducing_rate_Result_InterestDiff"),
          value: inr(cmp.interestDifference),
          footnote: t("Tool_flat_vs_reducing_rate_Result_InterestDiffFootnote", inr(cmp.emiDifference)),
          variant: "secure" as const,
        },
      ],
      scenarios: [
        {
          name: t("Tool_flat_vs_reducing_rate_Scenario_Flat"),
          primaryLabel: t("Tool_flat_vs_reducing_rate_Result_FlatEmi"),
          primaryValue: inr(cmp.flatEmi),
          secondaryLabel: t("Common_Col_Interest"),
          secondaryValue: inr(cmp.flatTotalInterest),
          variant: "worst",
        },
        {
          name: t("Common_Scenario_Base"),
          primaryLabel: t("Tool_flat_vs_reducing_rate_Result_InterestDiff"),
          primaryValue: inr(cmp.interestDifference),
          secondaryLabel: t("Tool_flat_vs_reducing_rate_LabelEmiDiff"),
          secondaryValue: inr(cmp.emiDifference),
          variant: "base",
        },
        {
          name: t("Tool_flat_vs_reducing_rate_Scenario_Reducing"),
          primaryLabel: t("Tool_flat_vs_reducing_rate_Result_ReducingEmi"),
          primaryValue: inr(cmp.reducingEmi),
          secondaryLabel: t("Common_Col_Interest"),
          secondaryValue: inr(cmp.reducingTotalInterest),
          variant: "best",
        },
      ],
      rateScenarios: [
        {
          name: t("Tool_flat_vs_reducing_rate_Scenario_LowerRate"),
          primaryLabel: t("Tool_flat_vs_reducing_rate_Result_InterestDiff"),
          primaryValue: inr(lower.interestDifference),
          secondaryLabel: t("Common_Label_Return"),
          secondaryValue: percent(Math.max(0, rate - 2)),
          variant: "best" as const,
        },
        {
          name: t("Common_Scenario_Base"),
          primaryLabel: t("Tool_flat_vs_reducing_rate_Result_InterestDiff"),
          primaryValue: inr(cmp.interestDifference),
          secondaryLabel: t("Common_Label_Return"),
          secondaryValue: percent(rate),
          variant: "base" as const,
        },
        {
          name: t("Tool_flat_vs_reducing_rate_Scenario_HigherRate"),
          primaryLabel: t("Tool_flat_vs_reducing_rate_Result_InterestDiff"),
          primaryValue: inr(higher.interestDifference),
          secondaryLabel: t("Common_Label_Return"),
          secondaryValue: percent(rate + 2),
          variant: "worst" as const,
        },
      ],
    };
  }, [principal, rate, years, t]);

  return (
    <ToolPageShell
      title={t(tool.titleKey)}
      subtitle={t("Tool_flat_vs_reducing_rate_Subtitle")}
      description={t(tool.descriptionKey)}
      icon={tool.icon}
      educate={
        <>
          <div className="fy-info-box">
            <strong>{t("Common_WhatYouLearn")}</strong>
            <p>{t("Tool_flat_vs_reducing_rate_LearnText")}</p>
          </div>
          <FormulaCard
            title={t("Common_Formula")}
            code={
              "Flat interest = P × rate × years\nFlat EMI = (P + flat interest) / months\nReducing EMI = standard amortising EMI"
            }
            note={t("Tool_flat_vs_reducing_rate_FormulaNote")}
          />
        </>
      }
      below={<ToolInfoPanel info={flatVsReducingRateInfo(t)} />}
    >
      <div className="fy-form-card">
        <h3>{t("Common_YourInputs")}</h3>
        <div className="fy-field">
          <label>{t("Tool_flat_vs_reducing_rate_LabelPrincipal")}</label>
          <input
            type="number"
            min={0}
            step={10000}
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
            value={rate}
            onChange={(e) => setRate(Math.max(0, Number(e.target.value) || 0))}
          />
          <p className="fy-field-hint">{t("Tool_flat_vs_reducing_rate_RateHint")}</p>
        </div>
        <div className="fy-field">
          <label>{t("Common_Label_Years")}</label>
          <input
            type="number"
            min={0.25}
            max={30}
            step={0.25}
            inputMode="decimal"
            value={years}
            onChange={(e) => setYears(Math.max(0, Number(e.target.value) || 0))}
          />
        </div>
        <button type="button" className="fy-btn-calc">
          {t("Common_Calculate")}
        </button>
      </div>

      <div className="fy-info-box fy-tax-verdict">
        <strong>{t("Tool_flat_vs_reducing_rate_VerdictTitle")}</strong>
        <p>
          {t(
            "Tool_flat_vs_reducing_rate_VerdictNote",
            inr(result.interestDifference),
            inr(result.emiDifference),
            percent(rate),
          )}
        </p>
      </div>

      <ResultSummaryCards cards={summaryCards} />
      <ScenarioCompare
        title={t("Tool_flat_vs_reducing_rate_ScenarioTitle")}
        subtitle={t("Tool_flat_vs_reducing_rate_ScenarioSubtitle")}
        scenarios={scenarios}
      />
      <ScenarioCompare
        title={t("Tool_flat_vs_reducing_rate_RateScenarioTitle")}
        subtitle={t("Tool_flat_vs_reducing_rate_RateScenarioSubtitle")}
        scenarios={rateScenarios}
      />
      <WorkedExample
        title={t("Tool_flat_vs_reducing_rate_ExampleTitle")}
        subtitle={t("Tool_flat_vs_reducing_rate_ExampleSubtitle")}
        steps={exampleSteps}
      />
    </ToolPageShell>
  );
}
