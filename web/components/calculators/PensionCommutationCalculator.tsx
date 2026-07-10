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
import { calculatePensionCommutation } from "@/lib/finance/pensionCommutation";
import { inr, percent } from "@/lib/finance/format";
import { getTool } from "@/lib/config/tools";
import { pensionCommutationInfo } from "@/lib/tool-page-content";

export function PensionCommutationCalculator() {
  const t = useT();
  const tool = getTool("pension-commutation")!;

  const [monthlyPension, setMonthlyPension] = useState(50_000);
  const [commutationPercent, setCommutationPercent] = useState(40);
  const [commutationFactor, setCommutationFactor] = useState(9.81);

  const exampleSteps = useMemo(
    () => [
      t("Tool_pension_commutation_ExampleStep_1"),
      t("Tool_pension_commutation_ExampleStep_2"),
      t("Tool_pension_commutation_ExampleStep_3"),
      t("Tool_pension_commutation_ExampleStep_4"),
      t("Tool_pension_commutation_ExampleStep_5"),
    ],
    [t],
  );

  const { summaryCards, scenarios } = useMemo(() => {
    const result = calculatePensionCommutation({
      monthlyPension,
      commutationPercent,
      commutationFactor,
    });
    const low = calculatePensionCommutation({
      monthlyPension,
      commutationPercent: Math.max(10, commutationPercent * 0.5),
      commutationFactor,
    });
    const high = calculatePensionCommutation({
      monthlyPension,
      commutationPercent: 40,
      commutationFactor,
    });

    return {
      summaryCards: [
        {
          label: t("Tool_pension_commutation_Result_LumpSum"),
          value: inr(result.lumpSum),
          footnote: t(
            "Tool_pension_commutation_Result_LumpSumFootnote",
            percent(result.commutationPercent, 0),
          ),
          variant: "primary" as const,
        },
        {
          label: t("Tool_pension_commutation_Result_Reduced"),
          value: inr(result.reducedMonthly),
          footnote: t("Tool_pension_commutation_Result_ReducedFootnote"),
        },
        {
          label: t("Tool_pension_commutation_Result_BreakEven"),
          value: `${result.breakEvenYears.toFixed(1)} yr`,
          footnote: t("Tool_pension_commutation_Result_BreakEvenFootnote"),
          variant: "secure" as const,
        },
      ],
      scenarios: [
        {
          name: t("Tool_pension_commutation_Scenario_Low"),
          primaryLabel: t("Tool_pension_commutation_Result_LumpSum"),
          primaryValue: inr(low.lumpSum),
          secondaryLabel: t("Tool_pension_commutation_Result_Reduced"),
          secondaryValue: inr(low.reducedMonthly),
          variant: "best" as const,
        },
        {
          name: t("Common_Scenario_Base"),
          primaryLabel: t("Tool_pension_commutation_Result_LumpSum"),
          primaryValue: inr(result.lumpSum),
          secondaryLabel: t("Tool_pension_commutation_Result_Reduced"),
          secondaryValue: inr(result.reducedMonthly),
          variant: "base" as const,
        },
        {
          name: t("Tool_pension_commutation_Scenario_Max"),
          primaryLabel: t("Tool_pension_commutation_Result_LumpSum"),
          primaryValue: inr(high.lumpSum),
          secondaryLabel: t("Tool_pension_commutation_Result_Reduced"),
          secondaryValue: inr(high.reducedMonthly),
          variant: "worst" as const,
        },
      ],
    };
  }, [monthlyPension, commutationPercent, commutationFactor, t]);

  return (
    <ToolPageShell
      title={t(tool.titleKey)}
      subtitle={t("Tool_pension_commutation_Subtitle")}
      description={t(tool.descriptionKey)}
      icon={tool.icon}
      educate={
        <>
          <div className="fy-info-box">
            <strong>{t("Common_WhatYouLearn")}</strong>
            <p>{t("Tool_pension_commutation_LearnText")}</p>
          </div>
          <FormulaCard
            title={t("Common_Formula")}
            code={
              "commuted = pension × %\nlump = commuted × 12 × factor\nreduced = pension − commuted"
            }
            note={t("Tool_pension_commutation_FormulaNote")}
          />
        </>
      }
      below={<ToolInfoPanel info={pensionCommutationInfo(t)} />}
    >
      <div className="fy-form-card">
        <h3>{t("Common_YourInputs")}</h3>
        <div className="fy-field">
          <label>{t("Tool_pension_commutation_LabelPension")}</label>
          <input
            type="number"
            min={0}
            step={1000}
            inputMode="decimal"
            value={monthlyPension}
            onChange={(e) => setMonthlyPension(Math.max(0, Number(e.target.value) || 0))}
          />
        </div>
        <div className="fy-field">
          <label>{t("Tool_pension_commutation_LabelPercent")}</label>
          <input
            type="number"
            min={0}
            max={40}
            step={1}
            inputMode="decimal"
            value={commutationPercent}
            onChange={(e) =>
              setCommutationPercent(Math.min(40, Math.max(0, Number(e.target.value) || 0)))
            }
          />
          <p className="fy-field-hint">{t("Tool_pension_commutation_PercentHint")}</p>
        </div>
        <div className="fy-field">
          <label>{t("Tool_pension_commutation_LabelFactor")}</label>
          <input
            type="number"
            min={0}
            step={0.01}
            inputMode="decimal"
            value={commutationFactor}
            onChange={(e) => setCommutationFactor(Math.max(0, Number(e.target.value) || 0))}
          />
          <p className="fy-field-hint">{t("Tool_pension_commutation_FactorHint")}</p>
        </div>
        <button type="button" className="fy-btn-calc">
          {t("Common_Calculate")}
        </button>
      </div>

      <ResultSummaryCards cards={summaryCards} />
      <ScenarioCompare
        title={t("Tool_pension_commutation_ScenarioTitle")}
        subtitle={t("Tool_pension_commutation_ScenarioSubtitle")}
        scenarios={scenarios}
      />
      <WorkedExample
        title={t("Tool_pension_commutation_ExampleTitle")}
        subtitle={t("Tool_pension_commutation_ExampleSubtitle")}
        steps={exampleSteps}
      />
    </ToolPageShell>
  );
}
