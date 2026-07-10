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
import { calculateTwoWheelerLoan } from "@/lib/finance/twoWheelerLoan";
import { emi } from "@/lib/finance/compound";
import { inr, percent } from "@/lib/finance/format";
import { emiYearly } from "@/lib/finance/projections";
import { getTool } from "@/lib/config/tools";
import { twoWheelerLoanInfo } from "@/lib/tool-page-content";

export function TwoWheelerLoanCalculator() {
  const t = useT();
  const tool = getTool("two-wheeler-loan")!;

  const [onRoadPrice, setOnRoadPrice] = useState(120_000);
  const [downPayment, setDownPayment] = useState(24_000);
  const [rate, setRate] = useState(11);
  const [years, setYears] = useState(3);

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
      t("Tool_two_wheeler_loan_ExampleStep_1"),
      t("Tool_two_wheeler_loan_ExampleStep_2"),
      t("Tool_two_wheeler_loan_ExampleStep_3"),
      t("Tool_two_wheeler_loan_ExampleStep_4"),
      t("Tool_two_wheeler_loan_ExampleStep_5"),
    ],
    [t],
  );

  const { summaryCards, scenarios, breakdownRows } = useMemo(() => {
    const result = calculateTwoWheelerLoan({
      onRoadPrice,
      downPayment,
      annualRatePercent: rate,
      years,
    });
    const shorter = Math.max(1, Math.round(years * 0.75));
    const longer = Math.min(5, Math.round(years * 1.25) || years + 1);

    return {
      summaryCards: [
        {
          label: t("Tool_two_wheeler_loan_Result_Emi"),
          value: inr(result.monthlyEmi),
          footnote: t("Tool_two_wheeler_loan_Result_EmiFootnote", years),
          variant: "primary" as const,
        },
        {
          label: t("Tool_two_wheeler_loan_Result_Loan"),
          value: inr(result.loanAmount),
          footnote: t("Tool_two_wheeler_loan_Result_LoanFootnote", percent(result.downPaymentPercent)),
        },
        {
          label: t("Tool_two_wheeler_loan_Result_Interest"),
          value: inr(result.totalInterest),
          footnote: t("Common_Footnote_RatePa", percent(rate)),
          variant: "volatile" as const,
        },
      ],
      scenarios: [
        {
          name: t("Tool_two_wheeler_loan_Scenario_Shorter"),
          primaryLabel: t("Tool_two_wheeler_loan_Result_Emi"),
          primaryValue: inr(emi(result.loanAmount, rate, Math.round(shorter * 12))),
          secondaryLabel: t("Common_Label_TenureYears"),
          secondaryValue: String(shorter),
          variant: "best",
        },
        {
          name: t("Common_Scenario_Base"),
          primaryLabel: t("Tool_two_wheeler_loan_Result_Emi"),
          primaryValue: inr(result.monthlyEmi),
          secondaryLabel: t("Tool_two_wheeler_loan_Result_Interest"),
          secondaryValue: inr(result.totalInterest),
          variant: "base",
        },
        {
          name: t("Tool_two_wheeler_loan_Scenario_Longer"),
          primaryLabel: t("Tool_two_wheeler_loan_Result_Emi"),
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
  }, [onRoadPrice, downPayment, rate, years, t]);

  return (
    <ToolPageShell
      title={t(tool.titleKey)}
      subtitle={t("Tool_two_wheeler_loan_Subtitle")}
      description={t(tool.descriptionKey)}
      icon={tool.icon}
      educate={
        <>
          <div className="fy-info-box">
            <strong>{t("Common_WhatYouLearn")}</strong>
            <p>{t("Tool_two_wheeler_loan_LearnText")}</p>
          </div>
          <FormulaCard
            title={t("Common_Formula")}
            code={"Loan = On-road price − Down payment\nEMI = P × r × (1+r)^n / ((1+r)^n − 1)"}
            note={t("Tool_two_wheeler_loan_FormulaNote")}
          />
        </>
      }
      below={<ToolInfoPanel info={twoWheelerLoanInfo(t)} />}
    >
      <div className="fy-form-card">
        <h3>{t("Common_YourInputs")}</h3>
        <div className="fy-field">
          <label>{t("Tool_two_wheeler_loan_LabelPrice")}</label>
          <input
            type="number"
            min={0}
            step={1000}
            inputMode="decimal"
            value={onRoadPrice}
            onChange={(e) => setOnRoadPrice(Math.max(0, Number(e.target.value) || 0))}
          />
          <p className="fy-field-hint">{t("Tool_two_wheeler_loan_PriceHint")}</p>
        </div>
        <div className="fy-field">
          <label>{t("Tool_two_wheeler_loan_LabelDown")}</label>
          <input
            type="number"
            min={0}
            step={1000}
            inputMode="decimal"
            value={downPayment}
            onChange={(e) => setDownPayment(Math.max(0, Number(e.target.value) || 0))}
          />
        </div>
        <div className="fy-field">
          <label>{t("Common_Label_RatePa")}</label>
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
          <label>{t("Common_Label_TenureYears")}</label>
          <input
            type="number"
            min={1}
            max={5}
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

      <ResultSummaryCards cards={summaryCards} />
      <ScenarioCompare
        title={t("Tool_two_wheeler_loan_ScenarioTitle")}
        subtitle={t("Tool_two_wheeler_loan_ScenarioSubtitle")}
        scenarios={scenarios}
      />
      <BreakdownTable title={t("Tool_two_wheeler_loan_BreakdownTitle")} columns={breakdownColumns} rows={breakdownRows} />
      <WorkedExample
        title={t("Tool_two_wheeler_loan_ExampleTitle")}
        subtitle={t("Tool_two_wheeler_loan_ExampleSubtitle")}
        steps={exampleSteps}
      />
    </ToolPageShell>
  );
}
