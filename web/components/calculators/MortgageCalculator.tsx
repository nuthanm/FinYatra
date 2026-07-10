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
import { emi } from "@/lib/finance/compound";
import { inr, percent } from "@/lib/finance/format";
import { emiYearly } from "@/lib/finance/projections";
import { getTool } from "@/lib/config/tools";
import { mortgageInfo } from "@/lib/tool-page-content";

export function MortgageCalculator() {
  const t = useT();
  const tool = getTool("mortgage")!;

  const [propertyValue, setPropertyValue] = useState(5000000);
  const [downPayment, setDownPayment] = useState(1000000);
  const [annualRate, setAnnualRate] = useState(8.5);
  const [years, setYears] = useState(20);

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
      t("Tool_mortgage_ExampleStep_1"),
      t("Tool_mortgage_ExampleStep_2"),
      t("Tool_mortgage_ExampleStep_3"),
      t("Tool_mortgage_ExampleStep_4"),
      t("Tool_mortgage_ExampleStep_5"),
    ],
    [t],
  );

  const { summaryCards, scenarios, breakdownRows, loanAmount } = useMemo(() => {
    const safeValue = Math.max(0, propertyValue);
    const safeDown = Math.min(Math.max(0, downPayment), safeValue);
    const principal = Math.max(0, safeValue - safeDown);
    const safeRate = Math.max(0, annualRate);
    const safeYears = Math.max(0, years);
    const n = Math.round(safeYears * 12);

    if (principal <= 0 || n <= 0) {
      return { summaryCards: [], scenarios: [], breakdownRows: [], loanAmount: 0 };
    }

    const monthlyEmi = emi(principal, safeRate, n);
    const totalPayment = monthlyEmi * n;
    const totalInterest = Math.max(0, totalPayment - principal);
    const shorterMonths = Math.max(1, Math.round(n * 0.8));
    const longerMonths = Math.round(n * 1.2);

    return {
      loanAmount: principal,
      summaryCards: [
        {
          label: t("Tool_mortgage_Result_LoanAmount"),
          value: inr(principal),
          footnote: t("Tool_mortgage_Result_LoanFootnote", percent((principal / safeValue) * 100)),
        },
        {
          label: t("Tool_mortgage_Result_MonthlyEmi"),
          value: inr(monthlyEmi),
          footnote: t("Tool_mortgage_Result_EmiFootnote", safeYears),
          variant: "primary" as const,
        },
        {
          label: t("Tool_mortgage_Result_TotalInterest"),
          value: inr(totalInterest),
          footnote: t("Common_Footnote_RatePa", percent(safeRate)),
          variant: "volatile" as const,
        },
      ],
      scenarios: [
        {
          name: t("Tool_mortgage_Scenario_Shorter"),
          primaryLabel: t("Tool_emi_Result_MonthlyEmi"),
          primaryValue: inr(emi(principal, safeRate, shorterMonths)),
          secondaryLabel: t("Common_Label_TenureYears"),
          secondaryValue: t("Tool_mortgage_TenureYears", (shorterMonths / 12).toFixed(1)),
          variant: "best",
        },
        {
          name: t("Common_Scenario_Base"),
          primaryLabel: t("Tool_emi_Result_MonthlyEmi"),
          primaryValue: inr(monthlyEmi),
          secondaryLabel: t("Common_Label_TenureYears"),
          secondaryValue: t("Tool_mortgage_TenureYears", safeYears),
          variant: "base",
        },
        {
          name: t("Tool_mortgage_Scenario_Longer"),
          primaryLabel: t("Tool_emi_Result_MonthlyEmi"),
          primaryValue: inr(emi(principal, safeRate, longerMonths)),
          secondaryLabel: t("Common_Label_TenureYears"),
          secondaryValue: t("Tool_mortgage_TenureYears", (longerMonths / 12).toFixed(1)),
          variant: "worst",
        },
      ],
      breakdownRows: emiYearly(principal, safeRate, safeYears).map((r) => ({
        cells: {
          year: t("Common_YearN", r.year),
          principal: inr(r.principalPaid),
          interest: inr(r.interestPaid),
          balance: inr(r.balance),
        },
      })),
    };
  }, [propertyValue, downPayment, annualRate, years, t]);

  return (
    <ToolPageShell
      title={t(tool.titleKey)}
      subtitle={t("Tool_mortgage_Subtitle")}
      description={t(tool.descriptionKey)}
      icon={tool.icon}
      educate={
        <>
          <div className="fy-info-box">
            <strong>{t("Common_WhatYouLearn")}</strong>
            <p>{t("Tool_mortgage_LearnText")}</p>
          </div>
          <FormulaCard
            title={t("Common_Formula")}
            code="Loan = Property value − Down payment\nEMI = P × r × (1+r)^n / ((1+r)^n − 1)"
            note={t("Tool_mortgage_FormulaNote")}
          />
        </>
      }
      below={<ToolInfoPanel info={mortgageInfo(t)} />}
    >
      <div className="fy-form-card">
        <h3>{t("Common_YourInputs")}</h3>
        <div className="fy-field">
          <label>{t("Tool_mortgage_LabelProperty")}</label>
          <input
            type="number"
            min={0}
            inputMode="decimal"
            value={propertyValue}
            onChange={(e) => setPropertyValue(Math.max(0, Number(e.target.value) || 0))}
          />
        </div>
        <div className="fy-field">
          <label>{t("Tool_mortgage_LabelDownPayment")}</label>
          <input
            type="number"
            min={0}
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
            value={annualRate}
            onChange={(e) => setAnnualRate(Math.max(0, Number(e.target.value) || 0))}
          />
        </div>
        <div className="fy-field">
          <label>{t("Common_Label_Years")}</label>
          <input
            type="number"
            min={0}
            step={1}
            inputMode="numeric"
            value={years}
            onChange={(e) => setYears(Math.max(0, Number(e.target.value) || 0))}
          />
        </div>
        {loanAmount > 0 ? (
          <p className="fy-field-hint">{t("Tool_mortgage_LoanHint", inr(loanAmount))}</p>
        ) : null}
        <button type="button" className="fy-btn-calc">
          {t("Common_Calculate")}
        </button>
      </div>

      <ResultSummaryCards cards={summaryCards} />
      <ScenarioCompare
        title={t("Tool_mortgage_ScenarioTitle")}
        subtitle={t("Tool_mortgage_ScenarioSubtitle")}
        scenarios={scenarios}
      />
      <BreakdownTable title={t("Tool_mortgage_BreakdownTitle")} columns={breakdownColumns} rows={breakdownRows} />
      <WorkedExample
        title={t("Tool_mortgage_ExampleTitle")}
        subtitle={t("Tool_mortgage_ExampleSubtitle")}
        steps={exampleSteps}
      />
    </ToolPageShell>
  );
}
