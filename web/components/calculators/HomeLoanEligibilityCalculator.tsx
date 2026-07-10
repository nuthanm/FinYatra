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
import { calculateHomeLoanEligibility } from "@/lib/finance/homeLoanEligibility";
import { inr, percent } from "@/lib/finance/format";
import { getTool } from "@/lib/config/tools";
import { homeLoanEligibilityInfo } from "@/lib/tool-page-content";

export function HomeLoanEligibilityCalculator() {
  const t = useT();
  const tool = getTool("home-loan-eligibility")!;

  const [monthlyIncome, setMonthlyIncome] = useState(100_000);
  const [existingEmis, setExistingEmis] = useState(15_000);
  const [rate, setRate] = useState(8.5);
  const [years, setYears] = useState(20);
  const [foir, setFoir] = useState(50);

  const exampleSteps = useMemo(
    () => [
      t("Tool_home_loan_eligibility_ExampleStep_1"),
      t("Tool_home_loan_eligibility_ExampleStep_2"),
      t("Tool_home_loan_eligibility_ExampleStep_3"),
      t("Tool_home_loan_eligibility_ExampleStep_4"),
      t("Tool_home_loan_eligibility_ExampleStep_5"),
    ],
    [t],
  );

  const { summaryCards, scenarios, detail } = useMemo(() => {
    const result = calculateHomeLoanEligibility({
      monthlyIncome,
      existingEmis,
      annualRatePercent: rate,
      years,
      foirPercent: foir,
    });
    const stricter = calculateHomeLoanEligibility({
      monthlyIncome,
      existingEmis,
      annualRatePercent: rate,
      years,
      foirPercent: Math.max(0, foir - 10),
    });
    const longer = calculateHomeLoanEligibility({
      monthlyIncome,
      existingEmis,
      annualRatePercent: rate,
      years: Math.min(30, years + 5),
      foirPercent: foir,
    });

    return {
      detail: result,
      summaryCards: [
        {
          label: t("Tool_home_loan_eligibility_Result_MaxLoan"),
          value: inr(result.maxLoan),
          footnote: t("Tool_home_loan_eligibility_Result_MaxLoanFootnote", years),
          variant: "primary" as const,
        },
        {
          label: t("Tool_home_loan_eligibility_Result_EligibleEmi"),
          value: inr(result.eligibleEmi),
          footnote: t("Tool_home_loan_eligibility_Result_EligibleEmiFootnote", percent(foir, 0)),
        },
        {
          label: t("Tool_home_loan_eligibility_Result_SampleEmi"),
          value: inr(result.sampleEmi),
          footnote: t("Common_Footnote_RatePa", percent(rate)),
          variant: "secure" as const,
        },
      ],
      scenarios: [
        {
          name: t("Tool_home_loan_eligibility_Scenario_Stricter"),
          primaryLabel: t("Tool_home_loan_eligibility_Result_MaxLoan"),
          primaryValue: inr(stricter.maxLoan),
          secondaryLabel: t("Tool_home_loan_eligibility_Result_EligibleEmi"),
          secondaryValue: inr(stricter.eligibleEmi),
          variant: "best",
        },
        {
          name: t("Common_Scenario_Base"),
          primaryLabel: t("Tool_home_loan_eligibility_Result_MaxLoan"),
          primaryValue: inr(result.maxLoan),
          secondaryLabel: t("Tool_home_loan_eligibility_Result_SampleEmi"),
          secondaryValue: inr(result.sampleEmi),
          variant: "base",
        },
        {
          name: t("Tool_home_loan_eligibility_Scenario_Longer"),
          primaryLabel: t("Tool_home_loan_eligibility_Result_MaxLoan"),
          primaryValue: inr(longer.maxLoan),
          secondaryLabel: t("Common_Label_TenureYears"),
          secondaryValue: String(Math.min(30, years + 5)),
          variant: "worst",
        },
      ],
    };
  }, [monthlyIncome, existingEmis, rate, years, foir, t]);

  return (
    <ToolPageShell
      title={t(tool.titleKey)}
      subtitle={t("Tool_home_loan_eligibility_Subtitle")}
      description={t(tool.descriptionKey)}
      icon={tool.icon}
      educate={
        <>
          <div className="fy-info-box">
            <strong>{t("Common_WhatYouLearn")}</strong>
            <p>{t("Tool_home_loan_eligibility_LearnText")}</p>
          </div>
          <FormulaCard
            title={t("Common_Formula")}
            code={
              "Eligible EMI = Income × FOIR% − Existing EMIs\nP = EMI × ((1+r)^n − 1) / (r × (1+r)^n)"
            }
            note={t("Tool_home_loan_eligibility_FormulaNote")}
          />
        </>
      }
      below={<ToolInfoPanel info={homeLoanEligibilityInfo(t)} />}
    >
      <div className="fy-form-card">
        <h3>{t("Common_YourInputs")}</h3>
        <div className="fy-field">
          <label>{t("Tool_home_loan_eligibility_LabelIncome")}</label>
          <input
            type="number"
            min={0}
            step={1000}
            inputMode="decimal"
            value={monthlyIncome}
            onChange={(e) => setMonthlyIncome(Math.max(0, Number(e.target.value) || 0))}
          />
        </div>
        <div className="fy-field">
          <label>{t("Tool_home_loan_eligibility_LabelExisting")}</label>
          <input
            type="number"
            min={0}
            step={500}
            inputMode="decimal"
            value={existingEmis}
            onChange={(e) => setExistingEmis(Math.max(0, Number(e.target.value) || 0))}
          />
          <p className="fy-field-hint">{t("Tool_home_loan_eligibility_ExistingHint")}</p>
        </div>
        <div className="fy-field">
          <label>{t("Tool_home_loan_eligibility_LabelFoir")}</label>
          <input
            type="number"
            min={0}
            max={100}
            step={1}
            inputMode="decimal"
            value={foir}
            onChange={(e) => setFoir(Math.max(0, Number(e.target.value) || 0))}
          />
          <p className="fy-field-hint">{t("Tool_home_loan_eligibility_FoirHint")}</p>
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
          <label>{t("Common_Label_TenureYears")}</label>
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
        <button type="button" className="fy-btn-calc">
          {t("Common_Calculate")}
        </button>
      </div>

      <div className="fy-info-box fy-tax-verdict">
        <strong>{t("Tool_home_loan_eligibility_FoirTitle")}</strong>
        <p>
          {t(
            "Tool_home_loan_eligibility_FoirBody",
            inr(monthlyIncome),
            percent(foir, 0),
            inr(existingEmis),
            inr(detail.eligibleEmi),
          )}
        </p>
      </div>

      <ResultSummaryCards cards={summaryCards} />
      <ScenarioCompare
        title={t("Tool_home_loan_eligibility_ScenarioTitle")}
        subtitle={t("Tool_home_loan_eligibility_ScenarioSubtitle")}
        scenarios={scenarios}
      />
      <WorkedExample
        title={t("Tool_home_loan_eligibility_ExampleTitle")}
        subtitle={t("Tool_home_loan_eligibility_ExampleSubtitle")}
        steps={exampleSteps}
      />
    </ToolPageShell>
  );
}
