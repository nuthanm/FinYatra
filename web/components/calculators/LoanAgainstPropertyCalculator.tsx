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
import { calculateLoanAgainstProperty } from "@/lib/finance/loanAgainstProperty";
import { inr, percent } from "@/lib/finance/format";
import { getTool } from "@/lib/config/tools";
import { loanAgainstPropertyInfo } from "@/lib/tool-page-content";

export function LoanAgainstPropertyCalculator() {
  const t = useT();
  const tool = getTool("loan-against-property")!;

  const [propertyValue, setPropertyValue] = useState(5_000_000);
  const [ltv, setLtv] = useState(55);
  const [rate, setRate] = useState(10.5);
  const [years, setYears] = useState(10);

  const exampleSteps = useMemo(
    () => [
      t("Tool_loan_against_property_ExampleStep_1"),
      t("Tool_loan_against_property_ExampleStep_2"),
      t("Tool_loan_against_property_ExampleStep_3"),
      t("Tool_loan_against_property_ExampleStep_4"),
      t("Tool_loan_against_property_ExampleStep_5"),
    ],
    [t],
  );

  const { summaryCards, scenarios, detail } = useMemo(() => {
    const result = calculateLoanAgainstProperty({
      propertyValue,
      ltvPercent: ltv,
      annualRatePercent: rate,
      years,
    });
    const lowerLtv = calculateLoanAgainstProperty({
      propertyValue,
      ltvPercent: Math.max(0, ltv - 10),
      annualRatePercent: rate,
      years,
    });
    const higherLtv = calculateLoanAgainstProperty({
      propertyValue,
      ltvPercent: Math.min(100, ltv + 10),
      annualRatePercent: rate,
      years,
    });

    return {
      detail: result,
      summaryCards: [
        {
          label: t("Tool_loan_against_property_Result_MaxLoan"),
          value: inr(result.maxLoan),
          footnote: t("Tool_loan_against_property_Result_MaxLoanFootnote", percent(ltv, 0)),
          variant: "primary" as const,
        },
        {
          label: t("Tool_loan_against_property_Result_Emi"),
          value: inr(result.monthlyEmi),
          footnote: t("Tool_loan_against_property_Result_EmiFootnote", years),
        },
        {
          label: t("Tool_loan_against_property_Result_Interest"),
          value: inr(result.totalInterest),
          footnote: t("Common_Footnote_RatePa", percent(rate)),
          variant: "volatile" as const,
        },
      ],
      scenarios: [
        {
          name: t("Tool_loan_against_property_Scenario_LowerLtv"),
          primaryLabel: t("Tool_loan_against_property_Result_MaxLoan"),
          primaryValue: inr(lowerLtv.maxLoan),
          secondaryLabel: t("Tool_loan_against_property_Result_Emi"),
          secondaryValue: inr(lowerLtv.monthlyEmi),
          variant: "best",
        },
        {
          name: t("Common_Scenario_Base"),
          primaryLabel: t("Tool_loan_against_property_Result_Emi"),
          primaryValue: inr(result.monthlyEmi),
          secondaryLabel: t("Common_Label_TenureYears"),
          secondaryValue: String(years),
          variant: "base",
        },
        {
          name: t("Tool_loan_against_property_Scenario_HigherLtv"),
          primaryLabel: t("Tool_loan_against_property_Result_MaxLoan"),
          primaryValue: inr(higherLtv.maxLoan),
          secondaryLabel: t("Tool_loan_against_property_Result_Emi"),
          secondaryValue: inr(higherLtv.monthlyEmi),
          variant: "worst",
        },
      ],
    };
  }, [propertyValue, ltv, rate, years, t]);

  return (
    <ToolPageShell
      title={t(tool.titleKey)}
      subtitle={t("Tool_loan_against_property_Subtitle")}
      description={t(tool.descriptionKey)}
      icon={tool.icon}
      educate={
        <>
          <div className="fy-info-box">
            <strong>{t("Common_WhatYouLearn")}</strong>
            <p>{t("Tool_loan_against_property_LearnText")}</p>
          </div>
          <FormulaCard
            title={t("Common_Formula")}
            code={"Max loan = Property value × LTV%\nEMI = P × r × (1+r)^n / ((1+r)^n − 1)"}
            note={t("Tool_loan_against_property_FormulaNote")}
          />
        </>
      }
      below={<ToolInfoPanel info={loanAgainstPropertyInfo(t)} />}
    >
      <div className="fy-form-card">
        <h3>{t("Common_YourInputs")}</h3>
        <div className="fy-field">
          <label>{t("Tool_loan_against_property_LabelProperty")}</label>
          <input
            type="number"
            min={0}
            step={100000}
            inputMode="decimal"
            value={propertyValue}
            onChange={(e) => setPropertyValue(Math.max(0, Number(e.target.value) || 0))}
          />
        </div>
        <div className="fy-field">
          <label>{t("Tool_loan_against_property_LabelLtv")}</label>
          <input
            type="number"
            min={0}
            max={100}
            step={1}
            inputMode="decimal"
            value={ltv}
            onChange={(e) => setLtv(Math.max(0, Number(e.target.value) || 0))}
          />
          <p className="fy-field-hint">{t("Tool_loan_against_property_LtvHint")}</p>
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
            max={20}
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
        <strong>{t("Tool_loan_against_property_ValueTitle")}</strong>
        <p>
          {t(
            "Tool_loan_against_property_ValueBody",
            inr(propertyValue),
            percent(ltv, 0),
            inr(detail.maxLoan),
          )}
        </p>
      </div>

      <ResultSummaryCards cards={summaryCards} />
      <ScenarioCompare
        title={t("Tool_loan_against_property_ScenarioTitle")}
        subtitle={t("Tool_loan_against_property_ScenarioSubtitle")}
        scenarios={scenarios}
      />
      <WorkedExample
        title={t("Tool_loan_against_property_ExampleTitle")}
        subtitle={t("Tool_loan_against_property_ExampleSubtitle")}
        steps={exampleSteps}
      />
    </ToolPageShell>
  );
}
