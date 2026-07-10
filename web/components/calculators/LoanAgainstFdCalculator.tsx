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
import { calculateLoanAgainstFd, LAF_DEFAULT_LTV } from "@/lib/finance/loanAgainstFd";
import { inr, percent } from "@/lib/finance/format";
import { getTool } from "@/lib/config/tools";
import { loanAgainstFdInfo } from "@/lib/tool-page-content";

export function LoanAgainstFdCalculator() {
  const t = useT();
  const tool = getTool("loan-against-fd")!;

  const [fdAmount, setFdAmount] = useState(10_00_000);
  const [ltv, setLtv] = useState(LAF_DEFAULT_LTV);
  const [rate, setRate] = useState(9);
  const [months, setMonths] = useState(36);

  const exampleSteps = useMemo(
    () => [
      t("Tool_loan_against_fd_ExampleStep_1"),
      t("Tool_loan_against_fd_ExampleStep_2"),
      t("Tool_loan_against_fd_ExampleStep_3"),
      t("Tool_loan_against_fd_ExampleStep_4"),
      t("Tool_loan_against_fd_ExampleStep_5"),
    ],
    [t],
  );

  const { summaryCards, scenarios } = useMemo(() => {
    const result = calculateLoanAgainstFd({
      fdAmount,
      ltvPercent: ltv,
      annualRatePercent: rate,
      tenureMonths: months,
    });
    const lower = calculateLoanAgainstFd({
      fdAmount,
      ltvPercent: Math.max(0, ltv - 10),
      annualRatePercent: rate,
      tenureMonths: months,
    });
    const higher = calculateLoanAgainstFd({
      fdAmount,
      ltvPercent: Math.min(100, ltv + 5),
      annualRatePercent: rate,
      tenureMonths: months,
    });

    return {
      summaryCards: [
        {
          label: t("Tool_loan_against_fd_Result_MaxLoan"),
          value: inr(result.maxLoan),
          footnote: t("Tool_loan_against_fd_Result_MaxLoanFootnote", percent(ltv, 0)),
          variant: "primary" as const,
        },
        {
          label: t("Tool_loan_against_fd_Result_Emi"),
          value: inr(result.monthlyEmi),
          footnote: t("Tool_loan_against_fd_Result_EmiFootnote", months),
        },
        {
          label: t("Tool_loan_against_fd_Result_Interest"),
          value: inr(result.totalInterest),
          footnote: t("Common_Footnote_RatePa", percent(rate)),
          variant: "volatile" as const,
        },
      ],
      scenarios: [
        {
          name: t("Tool_loan_against_fd_Scenario_LowerLtv"),
          primaryLabel: t("Tool_loan_against_fd_Result_MaxLoan"),
          primaryValue: inr(lower.maxLoan),
          secondaryLabel: t("Tool_loan_against_fd_Result_Emi"),
          secondaryValue: inr(lower.monthlyEmi),
          variant: "best" as const,
        },
        {
          name: t("Common_Scenario_Base"),
          primaryLabel: t("Tool_loan_against_fd_Result_Emi"),
          primaryValue: inr(result.monthlyEmi),
          secondaryLabel: t("Tool_loan_against_fd_LabelLtv"),
          secondaryValue: percent(ltv, 0),
          variant: "base" as const,
        },
        {
          name: t("Tool_loan_against_fd_Scenario_HigherLtv"),
          primaryLabel: t("Tool_loan_against_fd_Result_MaxLoan"),
          primaryValue: inr(higher.maxLoan),
          secondaryLabel: t("Tool_loan_against_fd_Result_Emi"),
          secondaryValue: inr(higher.monthlyEmi),
          variant: "worst" as const,
        },
      ],
    };
  }, [fdAmount, ltv, rate, months, t]);

  return (
    <ToolPageShell
      title={t(tool.titleKey)}
      subtitle={t("Tool_loan_against_fd_Subtitle")}
      description={t(tool.descriptionKey)}
      icon={tool.icon}
      educate={
        <>
          <div className="fy-info-box">
            <strong>{t("Common_WhatYouLearn")}</strong>
            <p>{t("Tool_loan_against_fd_LearnText")}</p>
          </div>
          <FormulaCard
            title={t("Common_Formula")}
            code={"maxLoan = FD × LTV%\nEMI on maxLoan at loan rate"}
            note={t("Tool_loan_against_fd_FormulaNote")}
          />
        </>
      }
      below={<ToolInfoPanel info={loanAgainstFdInfo(t)} />}
    >
      <div className="fy-form-card">
        <h3>{t("Common_YourInputs")}</h3>
        <div className="fy-field">
          <label>{t("Tool_loan_against_fd_LabelFd")}</label>
          <input
            type="number"
            min={0}
            step={10000}
            inputMode="decimal"
            value={fdAmount}
            onChange={(e) => setFdAmount(Math.max(0, Number(e.target.value) || 0))}
          />
        </div>
        <div className="fy-field">
          <label>{t("Tool_loan_against_fd_LabelLtv")}</label>
          <input
            type="number"
            min={0}
            max={100}
            step={1}
            inputMode="decimal"
            value={ltv}
            onChange={(e) => setLtv(Math.max(0, Number(e.target.value) || 0))}
          />
          <p className="fy-field-hint">{t("Tool_loan_against_fd_LtvHint")}</p>
        </div>
        <div className="fy-field">
          <label>{t("Tool_loan_against_fd_LabelRate")}</label>
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
          <label>{t("Tool_loan_against_fd_LabelTenure")}</label>
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
        <button type="button" className="fy-btn-calc">
          {t("Common_Calculate")}
        </button>
      </div>

      <ResultSummaryCards cards={summaryCards} />
      <ScenarioCompare
        title={t("Tool_loan_against_fd_ScenarioTitle")}
        subtitle={t("Tool_loan_against_fd_ScenarioSubtitle")}
        scenarios={scenarios}
      />
      <WorkedExample
        title={t("Tool_loan_against_fd_ExampleTitle")}
        subtitle={t("Tool_loan_against_fd_ExampleSubtitle")}
        steps={exampleSteps}
      />
    </ToolPageShell>
  );
}
