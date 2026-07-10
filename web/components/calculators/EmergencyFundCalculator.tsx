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
import { calculateEmergencyFund } from "@/lib/finance/emergencyFund";
import { inr } from "@/lib/finance/format";
import { getTool } from "@/lib/config/tools";
import { emergencyFundInfo } from "@/lib/tool-page-content";

const COVER_OPTIONS = [3, 6, 12] as const;

export function EmergencyFundCalculator() {
  const t = useT();
  const tool = getTool("emergency-fund")!;

  const [monthlyExpense, setMonthlyExpense] = useState(40_000);
  const [monthsOfCover, setMonthsOfCover] = useState(6);
  const [existingSavings, setExistingSavings] = useState(50_000);
  const [monthlySavings, setMonthlySavings] = useState(10_000);

  const exampleSteps = useMemo(
    () => [
      t("Tool_emergency_fund_ExampleStep_1"),
      t("Tool_emergency_fund_ExampleStep_2"),
      t("Tool_emergency_fund_ExampleStep_3"),
      t("Tool_emergency_fund_ExampleStep_4"),
      t("Tool_emergency_fund_ExampleStep_5"),
    ],
    [t],
  );

  const { summaryCards, scenarios } = useMemo(() => {
    const base = { monthlyExpense, monthsOfCover, existingSavings, monthlySavings };
    const result = calculateEmergencyFund(base);
    const cover3 = calculateEmergencyFund({ ...base, monthsOfCover: 3 });
    const cover6 = calculateEmergencyFund({ ...base, monthsOfCover: 6 });
    const cover12 = calculateEmergencyFund({ ...base, monthsOfCover: 12 });

    const monthsLabel =
      result.monthsToReach == null
        ? t("Tool_emergency_fund_Result_MonthsNone")
        : result.monthsToReach === 0
          ? t("Tool_emergency_fund_Result_MonthsDone")
          : t("Tool_emergency_fund_Result_MonthsValue", String(result.monthsToReach));

    return {
      summaryCards: [
        {
          label: t("Tool_emergency_fund_Result_Target"),
          value: inr(result.target),
          footnote: t("Tool_emergency_fund_Result_TargetFootnote", String(monthsOfCover)),
          variant: "primary" as const,
        },
        {
          label: t("Tool_emergency_fund_Result_Gap"),
          value: inr(result.gap),
          footnote: t("Tool_emergency_fund_Result_GapFootnote", inr(existingSavings)),
          variant: result.gap > 0 ? ("volatile" as const) : ("secure" as const),
        },
        {
          label: t("Tool_emergency_fund_Result_Months"),
          value: monthsLabel,
          footnote:
            monthlySavings > 0
              ? t("Tool_emergency_fund_Result_MonthsFootnote", inr(monthlySavings))
              : t("Tool_emergency_fund_Result_MonthsHint"),
        },
      ],
      scenarios: [
        {
          name: t("Tool_emergency_fund_Scenario_3"),
          primaryLabel: t("Tool_emergency_fund_Result_Target"),
          primaryValue: inr(cover3.target),
          secondaryLabel: t("Tool_emergency_fund_Result_Gap"),
          secondaryValue: inr(cover3.gap),
          variant: "worst",
        },
        {
          name: t("Tool_emergency_fund_Scenario_6"),
          primaryLabel: t("Tool_emergency_fund_Result_Target"),
          primaryValue: inr(cover6.target),
          secondaryLabel: t("Tool_emergency_fund_Result_Gap"),
          secondaryValue: inr(cover6.gap),
          variant: "base",
        },
        {
          name: t("Tool_emergency_fund_Scenario_12"),
          primaryLabel: t("Tool_emergency_fund_Result_Target"),
          primaryValue: inr(cover12.target),
          secondaryLabel: t("Tool_emergency_fund_Result_Gap"),
          secondaryValue: inr(cover12.gap),
          variant: "best",
        },
      ],
    };
  }, [monthlyExpense, monthsOfCover, existingSavings, monthlySavings, t]);

  return (
    <ToolPageShell
      title={t(tool.titleKey)}
      subtitle={t("Tool_emergency_fund_Subtitle")}
      description={t(tool.descriptionKey)}
      icon={tool.icon}
      educate={
        <>
          <div className="fy-info-box">
            <strong>{t("Common_WhatYouLearn")}</strong>
            <p>{t("Tool_emergency_fund_LearnText")}</p>
          </div>
          <FormulaCard
            title={t("Common_Formula")}
            code={"target = monthlyExpense × monthsOfCover\nmonthsToReach = ceil(gap ÷ monthlySavings)"}
            note={t("Tool_emergency_fund_FormulaNote")}
          />
        </>
      }
      below={<ToolInfoPanel info={emergencyFundInfo(t)} />}
    >
      <div className="fy-form-card">
        <h3>{t("Common_YourInputs")}</h3>
        <div className="fy-field">
          <label>{t("Tool_emergency_fund_LabelExpense")}</label>
          <input
            type="number"
            min={0}
            step={1000}
            inputMode="decimal"
            value={monthlyExpense}
            onChange={(e) => setMonthlyExpense(Math.max(0, Number(e.target.value) || 0))}
          />
        </div>
        <div className="fy-field">
          <label>{t("Tool_emergency_fund_LabelMonths")}</label>
          <select
            value={monthsOfCover}
            onChange={(e) => setMonthsOfCover(Number(e.target.value) || 6)}
          >
            {COVER_OPTIONS.map((m) => (
              <option key={m} value={m}>
                {t("Tool_emergency_fund_MonthsOption", String(m))}
              </option>
            ))}
          </select>
          <p className="fy-field-hint">{t("Tool_emergency_fund_MonthsHint")}</p>
        </div>
        <div className="fy-field">
          <label>{t("Tool_emergency_fund_LabelExisting")}</label>
          <input
            type="number"
            min={0}
            step={5000}
            inputMode="decimal"
            value={existingSavings}
            onChange={(e) => setExistingSavings(Math.max(0, Number(e.target.value) || 0))}
          />
        </div>
        <div className="fy-field">
          <label>{t("Tool_emergency_fund_LabelSavings")}</label>
          <input
            type="number"
            min={0}
            step={1000}
            inputMode="decimal"
            value={monthlySavings}
            onChange={(e) => setMonthlySavings(Math.max(0, Number(e.target.value) || 0))}
          />
          <p className="fy-field-hint">{t("Tool_emergency_fund_SavingsHint")}</p>
        </div>
        <button type="button" className="fy-btn-calc">
          {t("Common_Calculate")}
        </button>
      </div>

      <ResultSummaryCards cards={summaryCards} />
      <ScenarioCompare
        title={t("Tool_emergency_fund_ScenarioTitle")}
        subtitle={t("Tool_emergency_fund_ScenarioSubtitle")}
        scenarios={scenarios}
      />
      <WorkedExample
        title={t("Tool_emergency_fund_ExampleTitle")}
        subtitle={t("Tool_emergency_fund_ExampleSubtitle")}
        steps={exampleSteps}
      />
    </ToolPageShell>
  );
}
