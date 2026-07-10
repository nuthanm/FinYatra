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
  calculatePmVishwakarma,
  PM_VISHWAKARMA_DEFAULT_RATE,
  PM_VISHWAKARMA_MAX_CREDIT,
  PM_VISHWAKARMA_TOOLKIT_GRANT,
} from "@/lib/finance/pmVishwakarma";
import { inr, percent } from "@/lib/finance/format";
import { getTool } from "@/lib/config/tools";
import { pmVishwakarmaInfo } from "@/lib/tool-page-content";

export function PmVishwakarmaCalculator() {
  const t = useT();
  const tool = getTool("pm-vishwakarma")!;

  const [loanAmount, setLoanAmount] = useState(1_00_000);
  const [rate, setRate] = useState(PM_VISHWAKARMA_DEFAULT_RATE);
  const [months, setMonths] = useState(36);
  const [trainingDays, setTrainingDays] = useState(15);

  const exampleSteps = useMemo(
    () => [
      t("Tool_pm_vishwakarma_ExampleStep_1"),
      t("Tool_pm_vishwakarma_ExampleStep_2"),
      t("Tool_pm_vishwakarma_ExampleStep_3"),
      t("Tool_pm_vishwakarma_ExampleStep_4"),
      t("Tool_pm_vishwakarma_ExampleStep_5"),
    ],
    [t],
  );

  const { summaryCards, scenarios, result } = useMemo(() => {
    const result = calculatePmVishwakarma({
      loanAmount,
      annualRatePercent: rate,
      tenureMonths: months,
      trainingDays,
    });
    const noLoan = calculatePmVishwakarma({
      loanAmount: 0,
      annualRatePercent: rate,
      tenureMonths: months,
      trainingDays,
    });
    const maxLoan = calculatePmVishwakarma({
      loanAmount: PM_VISHWAKARMA_MAX_CREDIT,
      annualRatePercent: rate,
      tenureMonths: months,
      trainingDays,
    });

    return {
      result,
      summaryCards: [
        {
          label: t("Tool_pm_vishwakarma_Result_Benefit"),
          value: inr(result.totalBenefitCash),
          footnote: t(
            "Tool_pm_vishwakarma_Result_BenefitFootnote",
            inr(PM_VISHWAKARMA_TOOLKIT_GRANT),
          ),
          variant: "primary" as const,
        },
        {
          label: t("Tool_pm_vishwakarma_Result_Emi"),
          value: inr(result.monthlyEmi),
          footnote: t("Tool_pm_vishwakarma_Result_EmiFootnote", months),
        },
        {
          label: t("Tool_pm_vishwakarma_Result_Interest"),
          value: inr(result.totalInterest),
          footnote: t("Common_Footnote_RatePa", percent(rate)),
          variant: "volatile" as const,
        },
      ],
      scenarios: [
        {
          name: t("Tool_pm_vishwakarma_Scenario_GrantOnly"),
          primaryLabel: t("Tool_pm_vishwakarma_Result_Benefit"),
          primaryValue: inr(noLoan.totalBenefitCash),
          secondaryLabel: t("Tool_pm_vishwakarma_Result_Emi"),
          secondaryValue: inr(0),
          variant: "worst" as const,
        },
        {
          name: t("Common_Scenario_Base"),
          primaryLabel: t("Tool_pm_vishwakarma_Result_Emi"),
          primaryValue: inr(result.monthlyEmi),
          secondaryLabel: t("Tool_pm_vishwakarma_Result_Benefit"),
          secondaryValue: inr(result.totalBenefitCash),
          variant: "base" as const,
        },
        {
          name: t("Tool_pm_vishwakarma_Scenario_MaxCredit"),
          primaryLabel: t("Tool_pm_vishwakarma_Result_Emi"),
          primaryValue: inr(maxLoan.monthlyEmi),
          secondaryLabel: t("Tool_pm_vishwakarma_Result_Interest"),
          secondaryValue: inr(maxLoan.totalInterest),
          variant: "best" as const,
        },
      ],
    };
  }, [loanAmount, rate, months, trainingDays, t]);

  return (
    <ToolPageShell
      title={t(tool.titleKey)}
      subtitle={t("Tool_pm_vishwakarma_Subtitle")}
      description={t(tool.descriptionKey)}
      icon={tool.icon}
      educate={
        <>
          <div className="fy-info-box">
            <strong>{t("Common_WhatYouLearn")}</strong>
            <p>{t("Tool_pm_vishwakarma_LearnText")}</p>
          </div>
          <FormulaCard
            title={t("Common_Formula")}
            code={
              "Grant ₹15,000 + stipend ₹500/day\nCredit ≤ ₹3L at ~5%\nEMI on capped credit"
            }
            note={t("Tool_pm_vishwakarma_FormulaNote")}
          />
        </>
      }
      below={<ToolInfoPanel info={pmVishwakarmaInfo(t)} />}
    >
      <div className="fy-form-card">
        <h3>{t("Common_YourInputs")}</h3>
        <div className="fy-field">
          <label>{t("Tool_pm_vishwakarma_LabelLoan")}</label>
          <input
            type="number"
            min={0}
            step={10000}
            inputMode="decimal"
            value={loanAmount}
            onChange={(e) => setLoanAmount(Math.max(0, Number(e.target.value) || 0))}
          />
        </div>
        <div className="fy-field">
          <label>{t("Tool_pm_vishwakarma_LabelRate")}</label>
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
          <label>{t("Tool_pm_vishwakarma_LabelTenure")}</label>
          <input
            type="number"
            min={1}
            max={120}
            step={1}
            inputMode="numeric"
            value={months}
            onChange={(e) => setMonths(Math.max(1, Number(e.target.value) || 1))}
          />
        </div>
        <div className="fy-field">
          <label>{t("Tool_pm_vishwakarma_LabelDays")}</label>
          <input
            type="number"
            min={0}
            max={60}
            step={1}
            inputMode="numeric"
            value={trainingDays}
            onChange={(e) => setTrainingDays(Math.max(0, Number(e.target.value) || 0))}
          />
        </div>
        <button type="button" className="fy-btn-calc">
          {t("Common_Calculate")}
        </button>
      </div>

      {result.capped && (
        <div className="fy-info-box">
          <strong>{t("Tool_pm_vishwakarma_CappedTitle")}</strong>
          <p>
            {t(
              "Tool_pm_vishwakarma_CappedNote",
              inr(result.loanAmount),
              inr(PM_VISHWAKARMA_MAX_CREDIT),
            )}
          </p>
        </div>
      )}

      <ResultSummaryCards cards={summaryCards} />
      <ScenarioCompare
        title={t("Tool_pm_vishwakarma_ScenarioTitle")}
        subtitle={t("Tool_pm_vishwakarma_ScenarioSubtitle")}
        scenarios={scenarios}
      />
      <WorkedExample
        title={t("Tool_pm_vishwakarma_ExampleTitle")}
        subtitle={t("Tool_pm_vishwakarma_ExampleSubtitle")}
        steps={exampleSteps}
      />
    </ToolPageShell>
  );
}
