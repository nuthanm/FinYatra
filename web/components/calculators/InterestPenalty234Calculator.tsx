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
import { calculateInterestPenalty234 } from "@/lib/finance/interestPenalty234";
import { inr } from "@/lib/finance/format";
import { getTool } from "@/lib/config/tools";
import { interestPenalty234Info } from "@/lib/tool-page-content";

export function InterestPenalty234Calculator() {
  const t = useT();
  const tool = getTool("interest-penalty-234")!;

  const [taxDue, setTaxDue] = useState(1_00_000);
  const [monthsLate, setMonthsLate] = useState(3);
  const [instalments, setInstalments] = useState(1);

  const exampleSteps = useMemo(
    () => [
      t("Tool_interest_penalty_234_ExampleStep_1"),
      t("Tool_interest_penalty_234_ExampleStep_2"),
      t("Tool_interest_penalty_234_ExampleStep_3"),
      t("Tool_interest_penalty_234_ExampleStep_4"),
      t("Tool_interest_penalty_234_ExampleStep_5"),
    ],
    [t],
  );

  const { summaryCards, scenarios } = useMemo(() => {
    const result = calculateInterestPenalty234({
      taxDue,
      monthsLate,
      instalmentShortfalls: instalments,
    });
    const fewer = calculateInterestPenalty234({
      taxDue,
      monthsLate: Math.max(0, monthsLate - 2),
      instalmentShortfalls: instalments,
    });
    const more = calculateInterestPenalty234({
      taxDue,
      monthsLate: monthsLate + 2,
      instalmentShortfalls: instalments,
    });

    return {
      summaryCards: [
        {
          label: t("Tool_interest_penalty_234_Result_Total"),
          value: inr(result.totalInterest),
          footnote: t("Tool_interest_penalty_234_Result_TotalFootnote"),
          variant: "volatile" as const,
        },
        {
          label: t("Tool_interest_penalty_234_Result_234A"),
          value: inr(result.interest234A),
          footnote: t("Tool_interest_penalty_234_Result_234AFootnote", monthsLate),
        },
        {
          label: t("Tool_interest_penalty_234_Result_234B"),
          value: inr(result.interest234B),
          footnote: t("Tool_interest_penalty_234_Result_234BFootnote"),
          variant: "primary" as const,
        },
      ],
      scenarios: [
        {
          name: t("Tool_interest_penalty_234_Scenario_Fewer"),
          primaryLabel: t("Tool_interest_penalty_234_Result_Total"),
          primaryValue: inr(fewer.totalInterest),
          secondaryLabel: t("Tool_interest_penalty_234_LabelMonths"),
          secondaryValue: String(Math.max(0, monthsLate - 2)),
          variant: "best" as const,
        },
        {
          name: t("Common_Scenario_Base"),
          primaryLabel: t("Tool_interest_penalty_234_Result_Total"),
          primaryValue: inr(result.totalInterest),
          secondaryLabel: t("Tool_interest_penalty_234_Result_234C"),
          secondaryValue: inr(result.interest234C),
          variant: "base" as const,
        },
        {
          name: t("Tool_interest_penalty_234_Scenario_More"),
          primaryLabel: t("Tool_interest_penalty_234_Result_Total"),
          primaryValue: inr(more.totalInterest),
          secondaryLabel: t("Tool_interest_penalty_234_LabelMonths"),
          secondaryValue: String(monthsLate + 2),
          variant: "worst" as const,
        },
      ],
    };
  }, [taxDue, monthsLate, instalments, t]);

  return (
    <ToolPageShell
      title={t(tool.titleKey)}
      subtitle={t("Tool_interest_penalty_234_Subtitle")}
      description={t(tool.descriptionKey)}
      icon={tool.icon}
      educate={
        <>
          <div className="fy-info-box">
            <strong>{t("Common_WhatYouLearn")}</strong>
            <p>{t("Tool_interest_penalty_234_LearnText")}</p>
          </div>
          <FormulaCard
            title={t("Common_Formula")}
            code={
              "234A/B ≈ tax × 1% × months\n234C ≈ (tax/4) × 1% × shortfalls\ntotal = A + B + C"
            }
            note={t("Tool_interest_penalty_234_FormulaNote")}
          />
        </>
      }
      below={<ToolInfoPanel info={interestPenalty234Info(t)} />}
    >
      <div className="fy-form-card">
        <h3>{t("Common_YourInputs")}</h3>
        <div className="fy-field">
          <label>{t("Tool_interest_penalty_234_LabelTax")}</label>
          <input
            type="number"
            min={0}
            step={10000}
            inputMode="decimal"
            value={taxDue}
            onChange={(e) => setTaxDue(Math.max(0, Number(e.target.value) || 0))}
          />
        </div>
        <div className="fy-field">
          <label>{t("Tool_interest_penalty_234_LabelMonths")}</label>
          <input
            type="number"
            min={0}
            max={36}
            step={1}
            inputMode="numeric"
            value={monthsLate}
            onChange={(e) => setMonthsLate(Math.max(0, Number(e.target.value) || 0))}
          />
          <p className="fy-field-hint">{t("Tool_interest_penalty_234_MonthsHint")}</p>
        </div>
        <div className="fy-field">
          <label>{t("Tool_interest_penalty_234_LabelInstalments")}</label>
          <input
            type="number"
            min={0}
            max={4}
            step={1}
            inputMode="numeric"
            value={instalments}
            onChange={(e) =>
              setInstalments(Math.min(4, Math.max(0, Number(e.target.value) || 0)))
            }
          />
          <p className="fy-field-hint">{t("Tool_interest_penalty_234_InstalmentsHint")}</p>
        </div>
        <button type="button" className="fy-btn-calc">
          {t("Common_Calculate")}
        </button>
      </div>

      <ResultSummaryCards cards={summaryCards} />
      <ScenarioCompare
        title={t("Tool_interest_penalty_234_ScenarioTitle")}
        subtitle={t("Tool_interest_penalty_234_ScenarioSubtitle")}
        scenarios={scenarios}
      />
      <WorkedExample
        title={t("Tool_interest_penalty_234_ExampleTitle")}
        subtitle={t("Tool_interest_penalty_234_ExampleSubtitle")}
        steps={exampleSteps}
      />
    </ToolPageShell>
  );
}
