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
  calculateNriHomeLoan,
  NRI_HOME_DEFAULT_FOIR,
  NRI_HOME_DEFAULT_RATE,
} from "@/lib/finance/nriHomeLoan";
import { inr } from "@/lib/finance/format";
import { getTool } from "@/lib/config/tools";
import { nriHomeLoanInfo } from "@/lib/tool-page-content";

export function NriHomeLoanCalculator() {
  const t = useT();
  const tool = getTool("nri-home-loan")!;

  const [income, setIncome] = useState(2_50_000);
  const [existing, setExisting] = useState(20_000);
  const [requested, setRequested] = useState(50_00_000);
  const [rate, setRate] = useState(NRI_HOME_DEFAULT_RATE);
  const [years, setYears] = useState(20);
  const [foir, setFoir] = useState(NRI_HOME_DEFAULT_FOIR);

  const exampleSteps = useMemo(
    () => [
      t("Tool_nri_home_loan_ExampleStep_1"),
      t("Tool_nri_home_loan_ExampleStep_2"),
      t("Tool_nri_home_loan_ExampleStep_3"),
      t("Tool_nri_home_loan_ExampleStep_4"),
      t("Tool_nri_home_loan_ExampleStep_5"),
    ],
    [t],
  );

  const { summaryCards, scenarios, result } = useMemo(() => {
    const result = calculateNriHomeLoan({
      monthlyIncomeInr: income,
      existingEmis: existing,
      requestedLoan: requested,
      annualRatePercent: rate,
      tenureYears: years,
      foirPercent: foir,
    });
    const lowerRate = calculateNriHomeLoan({
      monthlyIncomeInr: income,
      existingEmis: existing,
      requestedLoan: requested,
      annualRatePercent: Math.max(0, rate - 1),
      tenureYears: years,
      foirPercent: foir,
    });
    const higherIncome = calculateNriHomeLoan({
      monthlyIncomeInr: income * 1.2,
      existingEmis: existing,
      requestedLoan: requested,
      annualRatePercent: rate,
      tenureYears: years,
      foirPercent: foir,
    });

    return {
      result,
      summaryCards: [
        {
          label: t("Tool_nri_home_loan_Result_MaxLoan"),
          value: inr(result.maxLoan),
          footnote: t(
            "Tool_nri_home_loan_Result_MaxLoanFootnote",
            inr(result.eligibleEmi),
          ),
          variant: "primary" as const,
        },
        {
          label: t("Tool_nri_home_loan_Result_Emi"),
          value: inr(result.monthlyEmi),
          footnote: t("Tool_nri_home_loan_Result_EmiFootnote", years),
        },
        {
          label: t("Tool_nri_home_loan_Result_Sanction"),
          value: inr(result.sanctionedEstimate),
          footnote: result.withinEligibility
            ? t("Tool_nri_home_loan_Result_Within")
            : t("Tool_nri_home_loan_Result_Over"),
          variant: result.withinEligibility
            ? ("secure" as const)
            : ("volatile" as const),
        },
      ],
      scenarios: [
        {
          name: t("Tool_nri_home_loan_Scenario_LowerRate"),
          primaryLabel: t("Tool_nri_home_loan_Result_MaxLoan"),
          primaryValue: inr(lowerRate.maxLoan),
          secondaryLabel: t("Tool_nri_home_loan_Result_Emi"),
          secondaryValue: inr(lowerRate.monthlyEmi),
          variant: "best" as const,
        },
        {
          name: t("Common_Scenario_Base"),
          primaryLabel: t("Tool_nri_home_loan_Result_Emi"),
          primaryValue: inr(result.monthlyEmi),
          secondaryLabel: t("Tool_nri_home_loan_Result_MaxLoan"),
          secondaryValue: inr(result.maxLoan),
          variant: "base" as const,
        },
        {
          name: t("Tool_nri_home_loan_Scenario_HigherIncome"),
          primaryLabel: t("Tool_nri_home_loan_Result_MaxLoan"),
          primaryValue: inr(higherIncome.maxLoan),
          secondaryLabel: t("Tool_nri_home_loan_Result_Emi"),
          secondaryValue: inr(higherIncome.monthlyEmi),
          variant: "worst" as const,
        },
      ],
    };
  }, [income, existing, requested, rate, years, foir, t]);

  return (
    <ToolPageShell
      title={t(tool.titleKey)}
      subtitle={t("Tool_nri_home_loan_Subtitle")}
      description={t(tool.descriptionKey)}
      icon={tool.icon}
      educate={
        <>
          <div className="fy-info-box">
            <strong>{t("Common_WhatYouLearn")}</strong>
            <p>{t("Tool_nri_home_loan_LearnText")}</p>
          </div>
          <FormulaCard
            title={t("Common_Formula")}
            code={"eligible EMI = income × FOIR% − existing EMIs\nmax loan from EMI · EMI on sanctioned"}
            note={t("Tool_nri_home_loan_FormulaNote")}
          />
        </>
      }
      below={<ToolInfoPanel info={nriHomeLoanInfo(t)} />}
    >
      <div className="fy-form-card">
        <h3>{t("Common_YourInputs")}</h3>
        <div className="fy-field">
          <label>{t("Tool_nri_home_loan_LabelIncome")}</label>
          <input
            type="number"
            min={0}
            step={5000}
            inputMode="decimal"
            value={income}
            onChange={(e) => setIncome(Math.max(0, Number(e.target.value) || 0))}
          />
          <p className="fy-field-hint">{t("Tool_nri_home_loan_IncomeHint")}</p>
        </div>
        <div className="fy-field">
          <label>{t("Tool_nri_home_loan_LabelExisting")}</label>
          <input
            type="number"
            min={0}
            step={1000}
            inputMode="decimal"
            value={existing}
            onChange={(e) => setExisting(Math.max(0, Number(e.target.value) || 0))}
          />
        </div>
        <div className="fy-field">
          <label>{t("Tool_nri_home_loan_LabelRequested")}</label>
          <input
            type="number"
            min={0}
            step={100000}
            inputMode="decimal"
            value={requested}
            onChange={(e) => setRequested(Math.max(0, Number(e.target.value) || 0))}
          />
        </div>
        <div className="fy-field">
          <label>{t("Tool_nri_home_loan_LabelRate")}</label>
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
          <label>{t("Tool_nri_home_loan_LabelTenure")}</label>
          <input
            type="number"
            min={1}
            max={30}
            step={1}
            inputMode="numeric"
            value={years}
            onChange={(e) => setYears(Math.max(1, Number(e.target.value) || 1))}
          />
        </div>
        <div className="fy-field">
          <label>{t("Tool_nri_home_loan_LabelFoir")}</label>
          <input
            type="number"
            min={0}
            max={100}
            step={1}
            inputMode="decimal"
            value={foir}
            onChange={(e) => setFoir(Math.max(0, Number(e.target.value) || 0))}
          />
        </div>
        <button type="button" className="fy-btn-calc">
          {t("Common_Calculate")}
        </button>
      </div>

      <div className="fy-info-box">
        <strong>{t("Tool_nri_home_loan_VerdictTitle")}</strong>
        <p>
          {result.withinEligibility
            ? t(
                "Tool_nri_home_loan_VerdictOk",
                inr(result.sanctionedEstimate),
                inr(result.monthlyEmi),
              )
            : t(
                "Tool_nri_home_loan_VerdictOver",
                inr(result.requestedLoan),
                inr(result.maxLoan),
              )}
        </p>
      </div>

      <ResultSummaryCards cards={summaryCards} />
      <ScenarioCompare
        title={t("Tool_nri_home_loan_ScenarioTitle")}
        subtitle={t("Tool_nri_home_loan_ScenarioSubtitle")}
        scenarios={scenarios}
      />
      <WorkedExample
        title={t("Tool_nri_home_loan_ExampleTitle")}
        subtitle={t("Tool_nri_home_loan_ExampleSubtitle")}
        steps={exampleSteps}
      />
    </ToolPageShell>
  );
}
