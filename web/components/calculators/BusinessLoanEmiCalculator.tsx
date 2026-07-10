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
import { calculateBusinessLoan } from "@/lib/finance/businessLoan";
import { inr, percent } from "@/lib/finance/format";
import { emiYearly } from "@/lib/finance/projections";
import { getTool } from "@/lib/config/tools";
import { businessLoanEmiInfo } from "@/lib/tool-page-content";

export function BusinessLoanEmiCalculator() {
  const t = useT();
  const tool = getTool("business-loan-emi")!;

  const [principal, setPrincipal] = useState(1_000_000);
  const [rate, setRate] = useState(12);
  const [years, setYears] = useState(5);
  const [moratoriumMonths, setMoratoriumMonths] = useState(6);

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
      t("Tool_business_loan_emi_ExampleStep_1"),
      t("Tool_business_loan_emi_ExampleStep_2"),
      t("Tool_business_loan_emi_ExampleStep_3"),
      t("Tool_business_loan_emi_ExampleStep_4"),
      t("Tool_business_loan_emi_ExampleStep_5"),
    ],
    [t],
  );

  const { summaryCards, scenarios, breakdownRows, detail } = useMemo(() => {
    const result = calculateBusinessLoan({
      principal: Math.max(0, principal),
      annualRatePercent: Math.max(0, rate),
      years: Math.max(0, years),
      moratoriumMonths: Math.max(0, moratoriumMonths),
    });
    const shorter = Math.max(1, Math.round(years * 0.75));
    const longer = Math.round(years * 1.25);
    const shortResult = calculateBusinessLoan({
      principal,
      annualRatePercent: rate,
      years: shorter,
      moratoriumMonths,
    });
    const longResult = calculateBusinessLoan({
      principal,
      annualRatePercent: rate,
      years: longer,
      moratoriumMonths,
    });

    return {
      detail: result,
      summaryCards: [
        {
          label: t("Tool_business_loan_emi_Result_Emi"),
          value: inr(result.monthlyEmi),
          footnote: t("Tool_business_loan_emi_Result_EmiFootnote", years),
          variant: "primary" as const,
        },
        {
          label: t("Tool_business_loan_emi_Result_RepayPrincipal"),
          value: inr(result.repaymentPrincipal),
          footnote: t(
            "Tool_business_loan_emi_Result_RepayPrincipalFootnote",
            inr(result.accruedInterestDuringMoratorium),
          ),
        },
        {
          label: t("Tool_business_loan_emi_Result_Interest"),
          value: inr(result.totalInterestOverall),
          footnote: t("Common_Footnote_RatePa", percent(rate)),
          variant: "volatile" as const,
        },
      ],
      scenarios: [
        {
          name: t("Tool_business_loan_emi_Scenario_Shorter"),
          primaryLabel: t("Tool_business_loan_emi_Result_Emi"),
          primaryValue: inr(shortResult.monthlyEmi),
          secondaryLabel: t("Common_Label_TenureYears"),
          secondaryValue: String(shorter),
          variant: "best",
        },
        {
          name: t("Common_Scenario_Base"),
          primaryLabel: t("Tool_business_loan_emi_Result_Emi"),
          primaryValue: inr(result.monthlyEmi),
          secondaryLabel: t("Tool_business_loan_emi_Result_Interest"),
          secondaryValue: inr(result.totalInterestOverall),
          variant: "base",
        },
        {
          name: t("Tool_business_loan_emi_Scenario_Longer"),
          primaryLabel: t("Tool_business_loan_emi_Result_Emi"),
          primaryValue: inr(longResult.monthlyEmi),
          secondaryLabel: t("Common_Label_TenureYears"),
          secondaryValue: String(longer),
          variant: "worst",
        },
      ],
      breakdownRows: emiYearly(result.repaymentPrincipal, Math.max(0, rate), Math.max(0, years)).map((r) => ({
        cells: {
          year: t("Common_YearN", r.year),
          principal: inr(r.principalPaid),
          interest: inr(r.interestPaid),
          balance: inr(r.balance),
        },
      })),
    };
  }, [principal, rate, years, moratoriumMonths, t]);

  return (
    <ToolPageShell
      title={t(tool.titleKey)}
      subtitle={t("Tool_business_loan_emi_Subtitle")}
      description={t(tool.descriptionKey)}
      icon={tool.icon}
      educate={
        <>
          <div className="fy-info-box">
            <strong>{t("Common_WhatYouLearn")}</strong>
            <p>{t("Tool_business_loan_emi_LearnText")}</p>
          </div>
          <FormulaCard
            title={t("Common_Formula")}
            code={"Accrued = P × rate × (moratoriumMonths / 12)\nRepay P = P + Accrued → EMI"}
            note={t("Tool_business_loan_emi_FormulaNote")}
          />
        </>
      }
      below={<ToolInfoPanel info={businessLoanEmiInfo(t)} />}
    >
      <div className="fy-form-card">
        <h3>{t("Common_YourInputs")}</h3>
        <div className="fy-field">
          <label>{t("Tool_business_loan_emi_LabelPrincipal")}</label>
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
          <label>{t("Common_Label_TenureYears")}</label>
          <input
            type="number"
            min={1}
            max={15}
            step={1}
            inputMode="numeric"
            value={years}
            onChange={(e) => setYears(Math.max(1, Number(e.target.value) || 1))}
          />
        </div>
        <div className="fy-field">
          <label>{t("Tool_business_loan_emi_LabelMoratorium")}</label>
          <input
            type="number"
            min={0}
            max={36}
            step={1}
            inputMode="numeric"
            value={moratoriumMonths}
            onChange={(e) => setMoratoriumMonths(Math.max(0, Number(e.target.value) || 0))}
          />
          <p className="fy-field-hint">{t("Tool_business_loan_emi_MoratoriumHint")}</p>
        </div>
        <button type="button" className="fy-btn-calc">
          {t("Common_Calculate")}
        </button>
      </div>

      {detail.accruedInterestDuringMoratorium > 0 && (
        <div className="fy-info-box fy-tax-verdict">
          <strong>{t("Tool_business_loan_emi_MoratoriumTitle")}</strong>
          <p>
            {t(
              "Tool_business_loan_emi_MoratoriumBody",
              inr(detail.accruedInterestDuringMoratorium),
              inr(detail.repaymentPrincipal),
            )}
          </p>
        </div>
      )}

      <ResultSummaryCards cards={summaryCards} />
      <ScenarioCompare
        title={t("Tool_business_loan_emi_ScenarioTitle")}
        subtitle={t("Tool_business_loan_emi_ScenarioSubtitle")}
        scenarios={scenarios}
      />
      <BreakdownTable
        title={t("Tool_business_loan_emi_BreakdownTitle")}
        subtitle={t("Tool_business_loan_emi_BreakdownSubtitle")}
        columns={breakdownColumns}
        rows={breakdownRows}
      />
      <WorkedExample
        title={t("Tool_business_loan_emi_ExampleTitle")}
        subtitle={t("Tool_business_loan_emi_ExampleSubtitle")}
        steps={exampleSteps}
      />
    </ToolPageShell>
  );
}
