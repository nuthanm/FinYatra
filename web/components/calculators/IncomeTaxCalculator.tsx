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
import { compareIncomeTax, type TaxAge } from "@/lib/finance/incomeTax";
import { inr, percent } from "@/lib/finance/format";
import { getTool } from "@/lib/config/tools";
import { incomeTaxInfo } from "@/lib/tool-page-content";

export function IncomeTaxCalculator() {
  const t = useT();
  const tool = getTool("income-tax")!;

  const [grossIncome, setGrossIncome] = useState(1_200_000);
  const [deductions, setDeductions] = useState(150_000);
  const [age, setAge] = useState<TaxAge>("below60");
  const [isSalaried, setIsSalaried] = useState(true);

  const exampleSteps = useMemo(
    () => [
      t("Tool_income_tax_ExampleStep_1"),
      t("Tool_income_tax_ExampleStep_2"),
      t("Tool_income_tax_ExampleStep_3"),
      t("Tool_income_tax_ExampleStep_4"),
      t("Tool_income_tax_ExampleStep_5"),
    ],
    [t],
  );

  const { summaryCards, scenarios, verdict } = useMemo(() => {
    const result = compareIncomeTax({
      grossIncome: Math.max(0, grossIncome),
      deductions: Math.max(0, deductions),
      age,
      isSalaried,
    });

    const betterLabel =
      result.better === "new" ? t("Tool_income_tax_Regime_New") : t("Tool_income_tax_Regime_Old");

    return {
      verdict: t("Tool_income_tax_Verdict", betterLabel, inr(result.savings)),
      summaryCards: [
        {
          label: t("Tool_income_tax_Result_NewTax"),
          value: inr(result.new.totalTax),
          footnote: t("Tool_income_tax_Result_Effective", percent(result.new.effectiveRate)),
          variant: result.better === "new" ? ("primary" as const) : ("default" as const),
        },
        {
          label: t("Tool_income_tax_Result_OldTax"),
          value: inr(result.old.totalTax),
          footnote: t("Tool_income_tax_Result_Effective", percent(result.old.effectiveRate)),
          variant: result.better === "old" ? ("primary" as const) : ("default" as const),
        },
        {
          label: t("Tool_income_tax_Result_Savings"),
          value: inr(result.savings),
          footnote: t("Tool_income_tax_Result_SavingsFootnote", betterLabel),
          variant: "secure" as const,
        },
      ],
      scenarios: [
        {
          name: t("Tool_income_tax_Regime_Old"),
          primaryLabel: t("Tool_income_tax_Result_Tax"),
          primaryValue: inr(result.old.totalTax),
          secondaryLabel: t("Tool_income_tax_Result_Taxable"),
          secondaryValue: inr(result.old.taxableIncome),
          variant: result.better === "old" ? "best" : "worst",
        },
        {
          name: t("Common_Scenario_Base"),
          primaryLabel: t("Tool_income_tax_Result_Savings"),
          primaryValue: inr(result.savings),
          secondaryLabel: t("Tool_income_tax_BetterRegime"),
          secondaryValue: betterLabel,
          variant: "base",
        },
        {
          name: t("Tool_income_tax_Regime_New"),
          primaryLabel: t("Tool_income_tax_Result_Tax"),
          primaryValue: inr(result.new.totalTax),
          secondaryLabel: t("Tool_income_tax_Result_Taxable"),
          secondaryValue: inr(result.new.taxableIncome),
          variant: result.better === "new" ? "best" : "worst",
        },
      ],
    };
  }, [grossIncome, deductions, age, isSalaried, t]);

  return (
    <ToolPageShell
      title={t(tool.titleKey)}
      subtitle={t("Tool_income_tax_Subtitle")}
      description={t(tool.descriptionKey)}
      icon={tool.icon}
      educate={
        <>
          <div className="fy-info-box">
            <strong>{t("Common_WhatYouLearn")}</strong>
            <p>{t("Tool_income_tax_LearnText")}</p>
          </div>
          <FormulaCard
            title={t("Common_Formula")}
            code={"taxable = income − std. deduction − deductions\ntax = slab(taxable) − rebate + 4% cess"}
            note={t("Tool_income_tax_FormulaNote")}
          />
        </>
      }
      below={<ToolInfoPanel info={incomeTaxInfo(t)} />}
    >
      <div className="fy-form-card">
        <h3>{t("Common_YourInputs")}</h3>
        <div className="fy-field">
          <label>{t("Tool_income_tax_LabelGross")}</label>
          <input
            type="number"
            min={0}
            step={1000}
            inputMode="decimal"
            value={grossIncome}
            onChange={(e) => setGrossIncome(Math.max(0, Number(e.target.value) || 0))}
          />
        </div>
        <div className="fy-field">
          <label>{t("Tool_income_tax_LabelDeductions")}</label>
          <input
            type="number"
            min={0}
            step={1000}
            inputMode="decimal"
            value={deductions}
            onChange={(e) => setDeductions(Math.max(0, Number(e.target.value) || 0))}
          />
          <p className="fy-field-hint">{t("Tool_income_tax_DeductionsHint")}</p>
        </div>
        <div className="fy-field">
          <label>{t("Tool_income_tax_LabelAge")}</label>
          <select value={age} onChange={(e) => setAge(e.target.value as TaxAge)}>
            <option value="below60">{t("Tool_income_tax_Age_Below60")}</option>
            <option value="senior">{t("Tool_income_tax_Age_Senior")}</option>
            <option value="superSenior">{t("Tool_income_tax_Age_SuperSenior")}</option>
          </select>
        </div>
        <div className="fy-field">
          <label>
            <input type="checkbox" checked={isSalaried} onChange={(e) => setIsSalaried(e.target.checked)} />{" "}
            {t("Tool_income_tax_LabelSalaried")}
          </label>
          <p className="fy-field-hint">{t("Tool_income_tax_SalariedHint")}</p>
        </div>
        <button type="button" className="fy-btn-calc">
          {t("Common_Calculate")}
        </button>
      </div>

      <div className="fy-info-box fy-tax-verdict">
        <strong>{t("Tool_income_tax_VerdictTitle")}</strong>
        <p>{verdict}</p>
      </div>

      <ResultSummaryCards cards={summaryCards} />
      <ScenarioCompare
        title={t("Tool_income_tax_ScenarioTitle")}
        subtitle={t("Tool_income_tax_ScenarioSubtitle")}
        scenarios={scenarios}
      />
      <WorkedExample
        title={t("Tool_income_tax_ExampleTitle")}
        subtitle={t("Tool_income_tax_ExampleSubtitle")}
        steps={exampleSteps}
      />
    </ToolPageShell>
  );
}
