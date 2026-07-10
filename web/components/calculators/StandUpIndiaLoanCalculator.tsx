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
import {
  calculateStandUpIndiaLoan,
  STAND_UP_INDIA_DEFAULT_RATE,
  STAND_UP_INDIA_MAX,
  STAND_UP_INDIA_MIN,
} from "@/lib/finance/standUpIndiaLoan";
import { inr, percent } from "@/lib/finance/format";
import { getTool } from "@/lib/config/tools";
import { standUpIndiaLoanInfo } from "@/lib/tool-page-content";

export function StandUpIndiaLoanCalculator() {
  const t = useT();
  const tool = getTool("stand-up-india-loan")!;

  const [amount, setAmount] = useState(25_00_000);
  const [rate, setRate] = useState(STAND_UP_INDIA_DEFAULT_RATE);
  const [months, setMonths] = useState(84);

  const exampleSteps = useMemo(
    () => [
      t("Tool_stand_up_india_loan_ExampleStep_1"),
      t("Tool_stand_up_india_loan_ExampleStep_2"),
      t("Tool_stand_up_india_loan_ExampleStep_3"),
      t("Tool_stand_up_india_loan_ExampleStep_4"),
      t("Tool_stand_up_india_loan_ExampleStep_5"),
    ],
    [t],
  );

  const { summaryCards, scenarios, result } = useMemo(() => {
    const result = calculateStandUpIndiaLoan({
      loanAmount: amount,
      annualRatePercent: rate,
      tenureMonths: months,
    });
    const minLoan = calculateStandUpIndiaLoan({
      loanAmount: STAND_UP_INDIA_MIN,
      annualRatePercent: rate,
      tenureMonths: months,
    });
    const maxLoan = calculateStandUpIndiaLoan({
      loanAmount: STAND_UP_INDIA_MAX,
      annualRatePercent: rate,
      tenureMonths: months,
    });

    return {
      result,
      summaryCards: [
        {
          label: t("Tool_stand_up_india_loan_Result_Eligible"),
          value: inr(result.eligibleAmount),
          footnote: t(
            "Tool_stand_up_india_loan_Result_EligibleFootnote",
            inr(STAND_UP_INDIA_MIN),
            inr(STAND_UP_INDIA_MAX),
          ),
          variant: "primary" as const,
        },
        {
          label: t("Tool_stand_up_india_loan_Result_Emi"),
          value: inr(result.monthlyEmi),
          footnote: t("Tool_stand_up_india_loan_Result_EmiFootnote", months),
        },
        {
          label: t("Tool_stand_up_india_loan_Result_Interest"),
          value: inr(result.totalInterest),
          footnote: t("Common_Footnote_RatePa", percent(rate)),
          variant: "volatile" as const,
        },
      ],
      scenarios: [
        {
          name: t("Tool_stand_up_india_loan_Scenario_Min"),
          primaryLabel: t("Tool_stand_up_india_loan_Result_Emi"),
          primaryValue: inr(minLoan.monthlyEmi),
          secondaryLabel: t("Tool_stand_up_india_loan_Result_Eligible"),
          secondaryValue: inr(minLoan.eligibleAmount),
          variant: "worst" as const,
        },
        {
          name: t("Common_Scenario_Base"),
          primaryLabel: t("Tool_stand_up_india_loan_Result_Emi"),
          primaryValue: inr(result.monthlyEmi),
          secondaryLabel: t("Tool_stand_up_india_loan_Result_Interest"),
          secondaryValue: inr(result.totalInterest),
          variant: "base" as const,
        },
        {
          name: t("Tool_stand_up_india_loan_Scenario_Max"),
          primaryLabel: t("Tool_stand_up_india_loan_Result_Emi"),
          primaryValue: inr(maxLoan.monthlyEmi),
          secondaryLabel: t("Tool_stand_up_india_loan_Result_Eligible"),
          secondaryValue: inr(maxLoan.eligibleAmount),
          variant: "best" as const,
        },
      ],
    };
  }, [amount, rate, months, t]);

  return (
    <ToolPageShell
      title={t(tool.titleKey)}
      subtitle={t("Tool_stand_up_india_loan_Subtitle")}
      description={t(tool.descriptionKey)}
      icon={tool.icon}
      educate={
        <>
          <div className="fy-info-box">
            <strong>{t("Common_WhatYouLearn")}</strong>
            <p>{t("Tool_stand_up_india_loan_LearnText")}</p>
          </div>
          <FormulaCard
            title={t("Common_Formula")}
            code={"₹10L–₹1Cr for SC/ST/women\neligible = clamp(amount)\nEMI on eligible"}
            note={t("Tool_stand_up_india_loan_FormulaNote")}
          />
        </>
      }
      below={<ToolInfoPanel info={standUpIndiaLoanInfo(t)} />}
    >
      <div className="fy-form-card">
        <h3>{t("Common_YourInputs")}</h3>
        <div className="fy-field">
          <label>{t("Tool_stand_up_india_loan_LabelAmount")}</label>
          <input
            type="number"
            min={0}
            step={100000}
            inputMode="decimal"
            value={amount}
            onChange={(e) => setAmount(Math.max(0, Number(e.target.value) || 0))}
          />
        </div>
        <div className="fy-field">
          <label>{t("Tool_stand_up_india_loan_LabelRate")}</label>
          <input
            type="number"
            min={0}
            step={0.1}
            inputMode="decimal"
            value={rate}
            onChange={(e) => setRate(Math.max(0, Number(e.target.value) || 0))}
          />
        </div>
        <div className="fy-field">
          <label>{t("Tool_stand_up_india_loan_LabelTenure")}</label>
          <input
            type="number"
            min={1}
            max={240}
            step={1}
            inputMode="numeric"
            value={months}
            onChange={(e) => setMonths(Math.max(1, Number(e.target.value) || 1))}
          />
        </div>
        <button type="button" className="fy-btn-calc">
          {t("Common_Calculate")}
        </button>
      </div>

      {(result.belowMin || result.aboveMax) && (
        <div className="fy-info-box">
          <strong>{t("Tool_stand_up_india_loan_BandTitle")}</strong>
          <p>
            {result.belowMin
              ? t("Tool_stand_up_india_loan_BandBelow", inr(STAND_UP_INDIA_MIN))
              : t("Tool_stand_up_india_loan_BandAbove", inr(STAND_UP_INDIA_MAX))}
          </p>
        </div>
      )}

      <div className="fy-info-box">
        <strong>{t("Tool_stand_up_india_loan_SchemeTitle")}</strong>
        <p>{t("Tool_stand_up_india_loan_SchemeNote")}</p>
      </div>

      <ResultSummaryCards cards={summaryCards} />
      <ScenarioCompare
        title={t("Tool_stand_up_india_loan_ScenarioTitle")}
        subtitle={t("Tool_stand_up_india_loan_ScenarioSubtitle")}
        scenarios={scenarios}
      />
      <WorkedExample
        title={t("Tool_stand_up_india_loan_ExampleTitle")}
        subtitle={t("Tool_stand_up_india_loan_ExampleSubtitle")}
        steps={exampleSteps}
      />
    </ToolPageShell>
  );
}
