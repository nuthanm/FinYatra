"use client";

import { useMemo, useState } from "react";
import { useT } from "@/components/providers/I18nProvider";
import {
  BreakdownTable,
  FormulaCard,
  ResultSummaryCards,
  ScenarioCompare,
  ToolInfoPanel,
  ToolPageShell,
  WorkedExample,
} from "@/components/calculator/CalculatorUi";
import { calculateEducationLoan } from "@/lib/finance/educationLoan";
import { inr } from "@/lib/finance/format";
import { emiYearly } from "@/lib/finance/projections";
import { getTool } from "@/lib/config/tools";
import { educationLoanInfo } from "@/lib/tool-page-content";

export function EducationLoanCalculator() {
  const t = useT();
  const tool = getTool("education-loan")!;

  const [principal, setPrincipal] = useState(1_500_000);
  const [rate, setRate] = useState(9);
  const [courseYears, setCourseYears] = useState(4);
  const [repaymentYears, setRepaymentYears] = useState(8);
  const [taxSlab, setTaxSlab] = useState(30);

  const breakdownColumns = useMemo(
    () => [
      { key: "year", header: t("Common_Year"), alignRight: false as const },
      { key: "principal", header: t("Common_Col_Principal") },
      { key: "interest", header: t("Common_Col_Interest") },
      { key: "balance", header: t("Common_Col_Balance") },
    ],
    [t],
  );

  const exampleSteps = useMemo(
    () => [
      t("Tool_education_loan_ExampleStep_1"),
      t("Tool_education_loan_ExampleStep_2"),
      t("Tool_education_loan_ExampleStep_3"),
      t("Tool_education_loan_ExampleStep_4"),
      t("Tool_education_loan_ExampleStep_5"),
    ],
    [t],
  );

  const { summaryCards, scenarios, breakdownRows, detail } = useMemo(() => {
    const result = calculateEducationLoan({
      principal: Math.max(0, principal),
      annualRatePercent: Math.max(0, rate),
      courseYears: Math.max(0, courseYears),
      repaymentYears: Math.max(0, repaymentYears),
      taxSlabPercent: taxSlab,
    });
    const shorter = Math.max(1, Math.round(repaymentYears * 0.75));
    const longer = Math.round(repaymentYears * 1.25);
    const shortResult = calculateEducationLoan({
      principal,
      annualRatePercent: rate,
      courseYears,
      repaymentYears: shorter,
      taxSlabPercent: taxSlab,
    });
    const longResult = calculateEducationLoan({
      principal,
      annualRatePercent: rate,
      courseYears,
      repaymentYears: longer,
      taxSlabPercent: taxSlab,
    });

    return {
      detail: result,
      summaryCards: [
        {
          label: t("Tool_education_loan_Result_Emi"),
          value: inr(result.monthlyEmi),
          footnote: t("Tool_education_loan_Result_EmiFootnote", repaymentYears),
          variant: "primary" as const,
        },
        {
          label: t("Tool_education_loan_Result_RepayPrincipal"),
          value: inr(result.repaymentPrincipal),
          footnote: t("Tool_education_loan_Result_RepayPrincipalFootnote", inr(result.accruedInterestDuringCourse)),
        },
        {
          label: t("Tool_education_loan_Result_TaxSaving"),
          value: inr(result.estimatedAnnualTaxSaving80e),
          footnote: t("Tool_education_loan_Result_TaxSavingFootnote"),
          variant: "secure" as const,
        },
      ],
      scenarios: [
        {
          name: t("Tool_education_loan_Scenario_Shorter"),
          primaryLabel: t("Tool_education_loan_Result_Emi"),
          primaryValue: inr(shortResult.monthlyEmi),
          secondaryLabel: t("Common_Label_TenureYears"),
          secondaryValue: String(shorter),
          variant: "best",
        },
        {
          name: t("Common_Scenario_Base"),
          primaryLabel: t("Tool_education_loan_Result_Emi"),
          primaryValue: inr(result.monthlyEmi),
          secondaryLabel: t("Tool_education_loan_Result_TotalInterest"),
          secondaryValue: inr(result.totalInterestOverall),
          variant: "base",
        },
        {
          name: t("Tool_education_loan_Scenario_Longer"),
          primaryLabel: t("Tool_education_loan_Result_Emi"),
          primaryValue: inr(longResult.monthlyEmi),
          secondaryLabel: t("Common_Label_TenureYears"),
          secondaryValue: String(longer),
          variant: "worst",
        },
      ],
      breakdownRows: emiYearly(result.repaymentPrincipal, Math.max(0, rate), Math.max(0, repaymentYears)).map(
        (r) => ({
          cells: {
            year: t("Common_YearN", r.year),
            principal: inr(r.principalPaid),
            interest: inr(r.interestPaid),
            balance: inr(r.balance),
          },
        }),
      ),
    };
  }, [principal, rate, courseYears, repaymentYears, taxSlab, t]);

  return (
    <ToolPageShell
      title={t(tool.titleKey)}
      subtitle={t("Tool_education_loan_Subtitle")}
      description={t(tool.descriptionKey)}
      icon={tool.icon}
      educate={
        <>
          <div className="fy-info-box">
            <strong>{t("Common_WhatYouLearn")}</strong>
            <p>{t("Tool_education_loan_LearnText")}</p>
          </div>
          <FormulaCard
            title={t("Common_Formula")}
            code={"Accrued = P × rate × courseYears\nRepay P = P + Accrued → EMI\n80E ≈ first-year interest × slab"}
            note={t("Tool_education_loan_FormulaNote")}
          />
        </>
      }
      below={<ToolInfoPanel info={educationLoanInfo(t)} />}
    >
      <div className="fy-form-card">
        <h3>{t("Common_YourInputs")}</h3>
        <div className="fy-field">
          <label>{t("Tool_education_loan_LabelPrincipal")}</label>
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
            step={0.05}
            inputMode="decimal"
            value={rate}
            onChange={(e) => setRate(Math.max(0, Number(e.target.value) || 0))}
          />
        </div>
        <div className="fy-field">
          <label>{t("Tool_education_loan_LabelCourse")}</label>
          <input
            type="number"
            min={0}
            max={10}
            step={1}
            inputMode="numeric"
            value={courseYears}
            onChange={(e) => setCourseYears(Math.max(0, Number(e.target.value) || 0))}
          />
          <p className="fy-field-hint">{t("Tool_education_loan_CourseHint")}</p>
        </div>
        <div className="fy-field">
          <label>{t("Tool_education_loan_LabelRepay")}</label>
          <input
            type="number"
            min={1}
            max={15}
            step={1}
            inputMode="numeric"
            value={repaymentYears}
            onChange={(e) => setRepaymentYears(Math.max(1, Number(e.target.value) || 1))}
          />
        </div>
        <div className="fy-field">
          <label>{t("Tool_education_loan_LabelSlab")}</label>
          <select value={taxSlab} onChange={(e) => setTaxSlab(Number(e.target.value))}>
            <option value={5}>5%</option>
            <option value={10}>10%</option>
            <option value={15}>15%</option>
            <option value={20}>20%</option>
            <option value={30}>30%</option>
          </select>
        </div>
        <button type="button" className="fy-btn-calc">
          {t("Common_Calculate")}
        </button>
      </div>

      <div className="fy-info-box fy-tax-verdict">
        <strong>{t("Tool_education_loan_TaxTitle")}</strong>
        <p>
          {t(
            "Tool_education_loan_TaxBody",
            inr(detail.firstYearInterest),
            inr(detail.estimatedAnnualTaxSaving80e),
          )}
        </p>
      </div>

      <ResultSummaryCards cards={summaryCards} />
      <ScenarioCompare
        title={t("Tool_education_loan_ScenarioTitle")}
        subtitle={t("Tool_education_loan_ScenarioSubtitle")}
        scenarios={scenarios}
      />
      <BreakdownTable
        title={t("Tool_education_loan_BreakdownTitle")}
        subtitle={t("Tool_education_loan_BreakdownSubtitle")}
        columns={breakdownColumns}
        rows={breakdownRows}
      />
      <WorkedExample
        title={t("Tool_education_loan_ExampleTitle")}
        subtitle={t("Tool_education_loan_ExampleSubtitle")}
        steps={exampleSteps}
      />
    </ToolPageShell>
  );
}
