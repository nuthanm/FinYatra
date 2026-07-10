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
  calculateSection80eEducationLoan,
  SECTION_80E_MAX_YEARS,
} from "@/lib/finance/section80eEducationLoan";
import { inr, percent } from "@/lib/finance/format";
import { getTool } from "@/lib/config/tools";
import { section80eEducationLoanInfo } from "@/lib/tool-page-content";

export function Section80eEducationLoanCalculator() {
  const t = useT();
  const tool = getTool("80e-education-loan-interest")!;

  const [interest, setInterest] = useState(80_000);
  const [slab, setSlab] = useState(30);
  const [yearsSince, setYearsSince] = useState(2);

  const exampleSteps = useMemo(
    () => [
      t("Tool_80e_education_loan_interest_ExampleStep_1"),
      t("Tool_80e_education_loan_interest_ExampleStep_2"),
      t("Tool_80e_education_loan_interest_ExampleStep_3"),
      t("Tool_80e_education_loan_interest_ExampleStep_4"),
      t("Tool_80e_education_loan_interest_ExampleStep_5"),
    ],
    [t],
  );

  const { summaryCards, scenarios, result } = useMemo(() => {
    const result = calculateSection80eEducationLoan({
      interestPaid: interest,
      taxSlabPercent: slab,
      yearsSinceRepaymentStart: yearsSince,
    });
    const lower = calculateSection80eEducationLoan({
      interestPaid: interest,
      taxSlabPercent: Math.max(0, slab - 10),
      yearsSinceRepaymentStart: yearsSince,
    });
    const outside = calculateSection80eEducationLoan({
      interestPaid: interest,
      taxSlabPercent: slab,
      yearsSinceRepaymentStart: SECTION_80E_MAX_YEARS,
    });

    return {
      result,
      summaryCards: [
        {
          label: t("Tool_80e_education_loan_interest_Result_Deduction"),
          value: inr(result.deduction),
          footnote: t(
            "Tool_80e_education_loan_interest_Result_DeductionFootnote",
            result.withinWindow
              ? t("Tool_80e_education_loan_interest_Window_Yes")
              : t("Tool_80e_education_loan_interest_Window_No"),
          ),
          variant: "primary" as const,
        },
        {
          label: t("Tool_80e_education_loan_interest_Result_Saving"),
          value: inr(result.taxSaving),
          footnote: t("Common_Footnote_RatePa", percent(slab)),
          variant: "secure" as const,
        },
        {
          label: t("Tool_80e_education_loan_interest_Result_YearsLeft"),
          value: String(result.windowYearsLeft),
          footnote: t(
            "Tool_80e_education_loan_interest_Result_YearsLeftFootnote",
            SECTION_80E_MAX_YEARS,
          ),
        },
      ],
      scenarios: [
        {
          name: t("Tool_80e_education_loan_interest_Scenario_LowerSlab"),
          primaryLabel: t("Tool_80e_education_loan_interest_Result_Saving"),
          primaryValue: inr(lower.taxSaving),
          secondaryLabel: t("Tool_80e_education_loan_interest_Result_Deduction"),
          secondaryValue: inr(lower.deduction),
          variant: "worst" as const,
        },
        {
          name: t("Common_Scenario_Base"),
          primaryLabel: t("Tool_80e_education_loan_interest_Result_Saving"),
          primaryValue: inr(result.taxSaving),
          secondaryLabel: t("Tool_80e_education_loan_interest_Result_Deduction"),
          secondaryValue: inr(result.deduction),
          variant: "base" as const,
        },
        {
          name: t("Tool_80e_education_loan_interest_Scenario_Outside"),
          primaryLabel: t("Tool_80e_education_loan_interest_Result_Saving"),
          primaryValue: inr(outside.taxSaving),
          secondaryLabel: t("Tool_80e_education_loan_interest_Result_Deduction"),
          secondaryValue: inr(outside.deduction),
          variant: "best" as const,
        },
      ],
    };
  }, [interest, slab, yearsSince, t]);

  return (
    <ToolPageShell
      title={t(tool.titleKey)}
      subtitle={t("Tool_80e_education_loan_interest_Subtitle")}
      description={t(tool.descriptionKey)}
      icon={tool.icon}
      educate={
        <>
          <div className="fy-info-box">
            <strong>{t("Common_WhatYouLearn")}</strong>
            <p>{t("Tool_80e_education_loan_interest_LearnText")}</p>
          </div>
          <FormulaCard
            title={t("Common_Formula")}
            code={"Deduction = full interest (no cap)\nSaving = interest × slab%\n8-year window from repayment"}
            note={t("Tool_80e_education_loan_interest_FormulaNote")}
          />
        </>
      }
      below={<ToolInfoPanel info={section80eEducationLoanInfo(t)} />}
    >
      <div className="fy-form-card">
        <h3>{t("Common_YourInputs")}</h3>
        <div className="fy-field">
          <label>{t("Tool_80e_education_loan_interest_LabelInterest")}</label>
          <input
            type="number"
            min={0}
            step={1000}
            inputMode="decimal"
            value={interest}
            onChange={(e) => setInterest(Math.max(0, Number(e.target.value) || 0))}
          />
        </div>
        <div className="fy-field">
          <label>{t("Tool_80e_education_loan_interest_LabelSlab")}</label>
          <input
            type="number"
            min={0}
            max={42}
            step={1}
            inputMode="decimal"
            value={slab}
            onChange={(e) => setSlab(Math.max(0, Number(e.target.value) || 0))}
          />
        </div>
        <div className="fy-field">
          <label>{t("Tool_80e_education_loan_interest_LabelYears")}</label>
          <input
            type="number"
            min={0}
            max={20}
            step={1}
            inputMode="numeric"
            value={yearsSince}
            onChange={(e) => setYearsSince(Math.max(0, Number(e.target.value) || 0))}
          />
          <p className="fy-hint">{t("Tool_80e_education_loan_interest_YearsHint")}</p>
        </div>
        <button type="button" className="fy-btn-calc">
          {t("Common_Calculate")}
        </button>
      </div>

      {!result.withinWindow && (
        <div className="fy-info-box">
          <strong>{t("Tool_80e_education_loan_interest_OutsideTitle")}</strong>
          <p>{t("Tool_80e_education_loan_interest_OutsideNote")}</p>
        </div>
      )}

      <ResultSummaryCards cards={summaryCards} />
      <ScenarioCompare
        title={t("Tool_80e_education_loan_interest_ScenarioTitle")}
        subtitle={t("Tool_80e_education_loan_interest_ScenarioSubtitle")}
        scenarios={scenarios}
      />
      <WorkedExample
        title={t("Tool_80e_education_loan_interest_ExampleTitle")}
        subtitle={t("Tool_80e_education_loan_interest_ExampleSubtitle")}
        steps={exampleSteps}
      />
    </ToolPageShell>
  );
}
