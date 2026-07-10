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
import { calculateTdsOnSalary } from "@/lib/finance/tdsOnSalary";
import type { TaxAge, TaxRegime } from "@/lib/finance/incomeTax";
import { inr } from "@/lib/finance/format";
import { getTool } from "@/lib/config/tools";
import { tdsOnSalaryInfo } from "@/lib/tool-page-content";

export function TdsOnSalaryCalculator() {
  const t = useT();
  const tool = getTool("tds-on-salary")!;

  const [annualGross, setAnnualGross] = useState(1_200_000);
  const [deductions, setDeductions] = useState(150_000);
  const [regime, setRegime] = useState<TaxRegime>("new");
  const [age, setAge] = useState<TaxAge>("below60");

  const exampleSteps = useMemo(
    () => [
      t("Tool_tds_on_salary_ExampleStep_1"),
      t("Tool_tds_on_salary_ExampleStep_2"),
      t("Tool_tds_on_salary_ExampleStep_3"),
      t("Tool_tds_on_salary_ExampleStep_4"),
      t("Tool_tds_on_salary_ExampleStep_5"),
    ],
    [t],
  );

  const { summaryCards, scenarios } = useMemo(() => {
    const result = calculateTdsOnSalary({ annualGross, deductions, regime, age });
    const oldR = calculateTdsOnSalary({ annualGross, deductions, regime: "old", age });
    const newR = calculateTdsOnSalary({ annualGross, deductions, regime: "new", age });
    const higher = calculateTdsOnSalary({
      annualGross: annualGross * 1.2,
      deductions,
      regime,
      age,
    });

    return {
      summaryCards: [
        {
          label: t("Tool_tds_on_salary_Result_Monthly"),
          value: inr(result.monthlyTds),
          footnote: t("Tool_tds_on_salary_Result_MonthlyFootnote"),
          variant: "primary" as const,
        },
        {
          label: t("Tool_tds_on_salary_Result_Annual"),
          value: inr(result.annualTax),
          footnote: t(
            "Tool_tds_on_salary_Result_AnnualFootnote",
            t(`Tool_tds_on_salary_Regime_${result.regime}`),
          ),
        },
        {
          label: t("Tool_tds_on_salary_Result_Taxable"),
          value: inr(result.taxableIncome),
          footnote: t("Tool_tds_on_salary_Result_TaxableFootnote", inr(result.standardDeduction)),
          variant: "secure" as const,
        },
      ],
      scenarios: [
        {
          name: t("Tool_tds_on_salary_Scenario_New"),
          primaryLabel: t("Tool_tds_on_salary_Result_Monthly"),
          primaryValue: inr(newR.monthlyTds),
          secondaryLabel: t("Tool_tds_on_salary_Result_Annual"),
          secondaryValue: inr(newR.annualTax),
          variant: newR.betterRegime === "new" ? ("best" as const) : ("base" as const),
        },
        {
          name: t("Tool_tds_on_salary_Scenario_Old"),
          primaryLabel: t("Tool_tds_on_salary_Result_Monthly"),
          primaryValue: inr(oldR.monthlyTds),
          secondaryLabel: t("Tool_tds_on_salary_Result_Annual"),
          secondaryValue: inr(oldR.annualTax),
          variant: oldR.betterRegime === "old" ? ("best" as const) : ("base" as const),
        },
        {
          name: t("Tool_tds_on_salary_Scenario_Higher"),
          primaryLabel: t("Tool_tds_on_salary_Result_Monthly"),
          primaryValue: inr(higher.monthlyTds),
          secondaryLabel: t("Tool_tds_on_salary_LabelGross"),
          secondaryValue: inr(annualGross * 1.2),
          variant: "worst" as const,
        },
      ],
    };
  }, [annualGross, deductions, regime, age, t]);

  return (
    <ToolPageShell
      title={t(tool.titleKey)}
      subtitle={t("Tool_tds_on_salary_Subtitle")}
      description={t(tool.descriptionKey)}
      icon={tool.icon}
      educate={
        <>
          <div className="fy-info-box">
            <strong>{t("Common_WhatYouLearn")}</strong>
            <p>{t("Tool_tds_on_salary_LearnText")}</p>
          </div>
          <FormulaCard
            title={t("Common_Formula")}
            code={"Annual tax (regime slabs)\nMonthly TDS ≈ annual tax ÷ 12\n(Section 192 style)"}
            note={t("Tool_tds_on_salary_FormulaNote")}
          />
        </>
      }
      below={<ToolInfoPanel info={tdsOnSalaryInfo(t)} />}
    >
      <div className="fy-form-card">
        <h3>{t("Common_YourInputs")}</h3>
        <div className="fy-field">
          <label>{t("Tool_tds_on_salary_LabelGross")}</label>
          <input
            type="number"
            min={0}
            step={10000}
            inputMode="decimal"
            value={annualGross}
            onChange={(e) => setAnnualGross(Math.max(0, Number(e.target.value) || 0))}
          />
        </div>
        <div className="fy-field">
          <label>{t("Tool_tds_on_salary_LabelDeductions")}</label>
          <input
            type="number"
            min={0}
            step={5000}
            inputMode="decimal"
            value={deductions}
            onChange={(e) => setDeductions(Math.max(0, Number(e.target.value) || 0))}
          />
          <p className="fy-field-hint">{t("Tool_tds_on_salary_DeductionsHint")}</p>
        </div>
        <div className="fy-field">
          <label>{t("Tool_tds_on_salary_LabelRegime")}</label>
          <select value={regime} onChange={(e) => setRegime(e.target.value as TaxRegime)}>
            <option value="new">{t("Tool_tds_on_salary_Regime_new")}</option>
            <option value="old">{t("Tool_tds_on_salary_Regime_old")}</option>
          </select>
        </div>
        <div className="fy-field">
          <label>{t("Tool_tds_on_salary_LabelAge")}</label>
          <select value={age} onChange={(e) => setAge(e.target.value as TaxAge)}>
            <option value="below60">{t("Tool_tds_on_salary_Age_below60")}</option>
            <option value="senior">{t("Tool_tds_on_salary_Age_senior")}</option>
            <option value="superSenior">{t("Tool_tds_on_salary_Age_superSenior")}</option>
          </select>
        </div>
        <button type="button" className="fy-btn-calc">
          {t("Common_Calculate")}
        </button>
      </div>

      <ResultSummaryCards cards={summaryCards} />
      <ScenarioCompare
        title={t("Tool_tds_on_salary_ScenarioTitle")}
        subtitle={t("Tool_tds_on_salary_ScenarioSubtitle")}
        scenarios={scenarios}
      />
      <WorkedExample
        title={t("Tool_tds_on_salary_ExampleTitle")}
        subtitle={t("Tool_tds_on_salary_ExampleSubtitle")}
        steps={exampleSteps}
      />
    </ToolPageShell>
  );
}
