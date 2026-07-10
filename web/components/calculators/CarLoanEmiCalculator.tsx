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
import { calculateCarLoan } from "@/lib/finance/carLoan";
import { emi } from "@/lib/finance/compound";
import { inr, percent } from "@/lib/finance/format";
import { emiYearly } from "@/lib/finance/projections";
import { getTool } from "@/lib/config/tools";
import { carLoanEmiInfo } from "@/lib/tool-page-content";

export function CarLoanEmiCalculator() {
  const t = useT();
  const tool = getTool("car-loan-emi")!;

  const [carPrice, setCarPrice] = useState(1_000_000);
  const [downPayment, setDownPayment] = useState(200_000);
  const [rate, setRate] = useState(9.5);
  const [years, setYears] = useState(5);
  const [insurance, setInsurance] = useState(25_000);
  const [prepay, setPrepay] = useState(50_000);

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
      t("Tool_car_loan_emi_ExampleStep_1"),
      t("Tool_car_loan_emi_ExampleStep_2"),
      t("Tool_car_loan_emi_ExampleStep_3"),
      t("Tool_car_loan_emi_ExampleStep_4"),
      t("Tool_car_loan_emi_ExampleStep_5"),
    ],
    [t],
  );

  const { summaryCards, scenarios, breakdownRows, detail } = useMemo(() => {
    const result = calculateCarLoan({
      carPrice: Math.max(0, carPrice),
      downPayment: Math.max(0, downPayment),
      annualRatePercent: Math.max(0, rate),
      years: Math.max(0, years),
      insuranceAmount: Math.max(0, insurance),
      prepaymentAfterYear1: Math.max(0, prepay),
    });
    const shorter = Math.max(1, Math.round(years * 0.75));
    const longer = Math.round(years * 1.25);

    return {
      detail: result,
      summaryCards: [
        {
          label: t("Tool_car_loan_emi_Result_Emi"),
          value: inr(result.monthlyEmi),
          footnote: t("Tool_car_loan_emi_Result_EmiFootnote", years),
          variant: "primary" as const,
        },
        {
          label: t("Tool_car_loan_emi_Result_Loan"),
          value: inr(result.loanAmount),
          footnote: t("Tool_car_loan_emi_Result_LoanFootnote", percent(result.downPaymentPercent)),
        },
        {
          label: t("Tool_car_loan_emi_Result_Interest"),
          value: inr(result.totalInterest),
          footnote: t("Common_Footnote_RatePa", percent(rate)),
          variant: "volatile" as const,
        },
      ],
      scenarios: [
        {
          name: t("Tool_car_loan_emi_Scenario_Shorter"),
          primaryLabel: t("Tool_car_loan_emi_Result_Emi"),
          primaryValue: inr(emi(result.loanAmount, rate, Math.round(shorter * 12))),
          secondaryLabel: t("Common_Label_TenureYears"),
          secondaryValue: String(shorter),
          variant: "best",
        },
        {
          name: t("Common_Scenario_Base"),
          primaryLabel: t("Tool_car_loan_emi_Result_Emi"),
          primaryValue: inr(result.monthlyEmi),
          secondaryLabel: t("Tool_car_loan_emi_Result_Interest"),
          secondaryValue: inr(result.totalInterest),
          variant: "base",
        },
        {
          name: t("Tool_car_loan_emi_Scenario_Longer"),
          primaryLabel: t("Tool_car_loan_emi_Result_Emi"),
          primaryValue: inr(emi(result.loanAmount, rate, Math.round(longer * 12))),
          secondaryLabel: t("Common_Label_TenureYears"),
          secondaryValue: String(longer),
          variant: "worst",
        },
      ],
      breakdownRows: emiYearly(result.loanAmount, Math.max(0, rate), Math.max(0, years)).map((r) => ({
        cells: {
          year: t("Common_YearN", r.year),
          principal: inr(r.principalPaid),
          interest: inr(r.interestPaid),
          balance: inr(r.balance),
        },
      })),
    };
  }, [carPrice, downPayment, rate, years, insurance, prepay, t]);

  return (
    <ToolPageShell
      title={t(tool.titleKey)}
      subtitle={t("Tool_car_loan_emi_Subtitle")}
      description={t(tool.descriptionKey)}
      icon={tool.icon}
      educate={
        <>
          <div className="fy-info-box">
            <strong>{t("Common_WhatYouLearn")}</strong>
            <p>{t("Tool_car_loan_emi_LearnText")}</p>
          </div>
          <FormulaCard
            title={t("Common_Formula")}
            code={"Loan = Price − Down + Insurance\nEMI = P × r × (1+r)^n / ((1+r)^n − 1)"}
            note={t("Tool_car_loan_emi_FormulaNote")}
          />
        </>
      }
      below={<ToolInfoPanel info={carLoanEmiInfo(t)} />}
    >
      <div className="fy-form-card">
        <h3>{t("Common_YourInputs")}</h3>
        <div className="fy-field">
          <label>{t("Tool_car_loan_emi_LabelPrice")}</label>
          <input
            type="number"
            min={0}
            step={10000}
            inputMode="decimal"
            value={carPrice}
            onChange={(e) => setCarPrice(Math.max(0, Number(e.target.value) || 0))}
          />
        </div>
        <div className="fy-field">
          <label>{t("Tool_car_loan_emi_LabelDown")}</label>
          <input
            type="number"
            min={0}
            step={5000}
            inputMode="decimal"
            value={downPayment}
            onChange={(e) => setDownPayment(Math.max(0, Number(e.target.value) || 0))}
          />
        </div>
        <div className="fy-field">
          <label>{t("Tool_car_loan_emi_LabelInsurance")}</label>
          <input
            type="number"
            min={0}
            step={1000}
            inputMode="decimal"
            value={insurance}
            onChange={(e) => setInsurance(Math.max(0, Number(e.target.value) || 0))}
          />
          <p className="fy-field-hint">{t("Tool_car_loan_emi_InsuranceHint")}</p>
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
            max={8}
            step={1}
            inputMode="numeric"
            value={years}
            onChange={(e) => setYears(Math.max(1, Number(e.target.value) || 1))}
          />
        </div>
        <div className="fy-field">
          <label>{t("Tool_car_loan_emi_LabelPrepay")}</label>
          <input
            type="number"
            min={0}
            step={5000}
            inputMode="decimal"
            value={prepay}
            onChange={(e) => setPrepay(Math.max(0, Number(e.target.value) || 0))}
          />
          <p className="fy-field-hint">{t("Tool_car_loan_emi_PrepayHint")}</p>
        </div>
        <button type="button" className="fy-btn-calc">
          {t("Common_Calculate")}
        </button>
      </div>

      {detail.interestSavedByPrepay > 0 && (
        <div className="fy-info-box fy-tax-verdict">
          <strong>{t("Tool_car_loan_emi_PrepayTitle")}</strong>
          <p>
            {t(
              "Tool_car_loan_emi_PrepayBody",
              inr(detail.revisedEmiAfterPrepay),
              inr(detail.interestSavedByPrepay),
            )}
          </p>
        </div>
      )}

      <ResultSummaryCards cards={summaryCards} />
      <ScenarioCompare
        title={t("Tool_car_loan_emi_ScenarioTitle")}
        subtitle={t("Tool_car_loan_emi_ScenarioSubtitle")}
        scenarios={scenarios}
      />
      <BreakdownTable title={t("Tool_car_loan_emi_BreakdownTitle")} columns={breakdownColumns} rows={breakdownRows} />
      <WorkedExample
        title={t("Tool_car_loan_emi_ExampleTitle")}
        subtitle={t("Tool_car_loan_emi_ExampleSubtitle")}
        steps={exampleSteps}
      />
    </ToolPageShell>
  );
}
