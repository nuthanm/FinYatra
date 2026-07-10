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
import { calculatePersonalLoan } from "@/lib/finance/personalLoan";
import { emi } from "@/lib/finance/compound";
import { inr, percent } from "@/lib/finance/format";
import { emiYearly } from "@/lib/finance/projections";
import { getTool } from "@/lib/config/tools";
import { personalLoanEmiInfo } from "@/lib/tool-page-content";

export function PersonalLoanEmiCalculator() {
  const t = useT();
  const tool = getTool("personal-loan-emi")!;

  const [principal, setPrincipal] = useState(500_000);
  const [rate, setRate] = useState(14);
  const [years, setYears] = useState(3);
  const [feePercent, setFeePercent] = useState(2);

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
      t("Tool_personal_loan_emi_ExampleStep_1"),
      t("Tool_personal_loan_emi_ExampleStep_2"),
      t("Tool_personal_loan_emi_ExampleStep_3"),
      t("Tool_personal_loan_emi_ExampleStep_4"),
      t("Tool_personal_loan_emi_ExampleStep_5"),
    ],
    [t],
  );

  const { summaryCards, scenarios, breakdownRows, detail } = useMemo(() => {
    const result = calculatePersonalLoan({
      principal: Math.max(0, principal),
      annualRatePercent: Math.max(0, rate),
      years: Math.max(0, years),
      processingFeePercent: Math.max(0, feePercent),
    });
    const shorter = Math.max(1, Math.round(years * 0.75));
    const longer = Math.round(years * 1.25);
    const shorterEmi = emi(principal, rate, Math.round(shorter * 12));
    const longerEmi = emi(principal, rate, Math.round(longer * 12));

    return {
      detail: result,
      summaryCards: [
        {
          label: t("Tool_personal_loan_emi_Result_Emi"),
          value: inr(result.monthlyEmi),
          footnote: t("Tool_personal_loan_emi_Result_EmiFootnote", years),
          variant: "primary" as const,
        },
        {
          label: t("Tool_personal_loan_emi_Result_Interest"),
          value: inr(result.totalInterest),
          footnote: t("Common_Footnote_RatePa", percent(rate)),
          variant: "volatile" as const,
        },
        {
          label: t("Tool_personal_loan_emi_Result_TotalPayment"),
          value: inr(result.totalPayment),
          footnote: t("Tool_personal_loan_emi_Result_PaymentFootnote"),
          variant: "secure" as const,
        },
      ],
      scenarios: [
        {
          name: t("Tool_personal_loan_emi_Scenario_Shorter"),
          primaryLabel: t("Tool_personal_loan_emi_Result_Emi"),
          primaryValue: inr(shorterEmi),
          secondaryLabel: t("Common_Label_TenureYears"),
          secondaryValue: String(shorter),
          variant: "best",
        },
        {
          name: t("Common_Scenario_Base"),
          primaryLabel: t("Tool_personal_loan_emi_Result_Emi"),
          primaryValue: inr(result.monthlyEmi),
          secondaryLabel: t("Tool_personal_loan_emi_Result_Interest"),
          secondaryValue: inr(result.totalInterest),
          variant: "base",
        },
        {
          name: t("Tool_personal_loan_emi_Scenario_Longer"),
          primaryLabel: t("Tool_personal_loan_emi_Result_Emi"),
          primaryValue: inr(longerEmi),
          secondaryLabel: t("Common_Label_TenureYears"),
          secondaryValue: String(longer),
          variant: "worst",
        },
      ],
      breakdownRows: emiYearly(Math.max(0, principal), Math.max(0, rate), Math.max(0, years)).map((r) => ({
        cells: {
          year: t("Common_YearN", r.year),
          principal: inr(r.principalPaid),
          interest: inr(r.interestPaid),
          balance: inr(r.balance),
        },
      })),
    };
  }, [principal, rate, years, feePercent, t]);

  return (
    <ToolPageShell
      title={t(tool.titleKey)}
      subtitle={t("Tool_personal_loan_emi_Subtitle")}
      description={t(tool.descriptionKey)}
      icon={tool.icon}
      educate={
        <>
          <div className="fy-info-box">
            <strong>{t("Common_WhatYouLearn")}</strong>
            <p>{t("Tool_personal_loan_emi_LearnText")}</p>
          </div>
          <FormulaCard
            title={t("Common_Formula")}
            code={"EMI = P × r × (1+r)^n / ((1+r)^n − 1)\nFee = P × fee%\nEffective cost ≈ EMI×n + Fee"}
            note={t("Tool_personal_loan_emi_FormulaNote")}
          />
        </>
      }
      below={<ToolInfoPanel info={personalLoanEmiInfo(t)} />}
    >
      <div className="fy-form-card">
        <h3>{t("Common_YourInputs")}</h3>
        <div className="fy-field">
          <label>{t("Tool_personal_loan_emi_LabelPrincipal")}</label>
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
            max={7}
            step={0.5}
            inputMode="decimal"
            value={years}
            onChange={(e) => setYears(Math.max(0.5, Number(e.target.value) || 0.5))}
          />
        </div>
        <div className="fy-field">
          <label>{t("Tool_personal_loan_emi_LabelFee")}</label>
          <input
            type="number"
            min={0}
            max={10}
            step={0.1}
            inputMode="decimal"
            value={feePercent}
            onChange={(e) => setFeePercent(Math.max(0, Number(e.target.value) || 0))}
          />
          <p className="fy-field-hint">{t("Tool_personal_loan_emi_FeeHint")}</p>
        </div>
        <button type="button" className="fy-btn-calc">
          {t("Common_Calculate")}
        </button>
      </div>

      {detail.processingFeeAmount > 0 && (
        <div className="fy-info-box fy-tax-verdict">
          <strong>{t("Tool_personal_loan_emi_FeeTitle")}</strong>
          <p>
            {t(
              "Tool_personal_loan_emi_FeeBody",
              inr(detail.processingFeeAmount),
              inr(detail.effectiveTotalCost),
            )}
          </p>
        </div>
      )}

      <ResultSummaryCards cards={summaryCards} />
      <ScenarioCompare
        title={t("Tool_personal_loan_emi_ScenarioTitle")}
        subtitle={t("Tool_personal_loan_emi_ScenarioSubtitle")}
        scenarios={scenarios}
      />
      <BreakdownTable title={t("Tool_personal_loan_emi_BreakdownTitle")} columns={breakdownColumns} rows={breakdownRows} />
      <WorkedExample
        title={t("Tool_personal_loan_emi_ExampleTitle")}
        subtitle={t("Tool_personal_loan_emi_ExampleSubtitle")}
        steps={exampleSteps}
      />
    </ToolPageShell>
  );
}
