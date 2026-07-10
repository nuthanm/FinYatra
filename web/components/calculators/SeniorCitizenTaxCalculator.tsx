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
  calculateSeniorCitizenTax,
  type SeniorTaxCategory,
} from "@/lib/finance/seniorCitizenTax";
import { inr } from "@/lib/finance/format";
import { getTool } from "@/lib/config/tools";
import { seniorCitizenTaxInfo } from "@/lib/tool-page-content";

export function SeniorCitizenTaxCalculator() {
  const t = useT();
  const tool = getTool("senior-citizen-tax")!;

  const [income, setIncome] = useState(480_000);
  const [category, setCategory] = useState<SeniorTaxCategory>("senior");

  const exampleSteps = useMemo(
    () => [
      t("Tool_senior_citizen_tax_ExampleStep_1"),
      t("Tool_senior_citizen_tax_ExampleStep_2"),
      t("Tool_senior_citizen_tax_ExampleStep_3"),
      t("Tool_senior_citizen_tax_ExampleStep_4"),
      t("Tool_senior_citizen_tax_ExampleStep_5"),
    ],
    [t],
  );

  const { summaryCards, scenarios, result } = useMemo(() => {
    const result = calculateSeniorCitizenTax({ income, category });
    const senior = calculateSeniorCitizenTax({ income, category: "senior" });
    const superSenior = calculateSeniorCitizenTax({ income, category: "super-senior" });
    const regular = calculateSeniorCitizenTax({ income, category: "regular" });

    return {
      result,
      summaryCards: [
        {
          label: t("Tool_senior_citizen_tax_Result_Tax"),
          value: inr(result.taxAfterRebate),
          footnote: t(
            "Tool_senior_citizen_tax_Result_TaxFootnote",
            inr(result.basicExemption),
          ),
          variant: "primary" as const,
        },
        {
          label: t("Tool_senior_citizen_tax_Result_Rebate"),
          value: inr(result.rebate87A),
          footnote: result.rebateEligible
            ? t("Tool_senior_citizen_tax_Result_RebateOk")
            : t("Tool_senior_citizen_tax_Result_RebateNo"),
          variant: "secure" as const,
        },
        {
          label: t("Tool_senior_citizen_tax_Result_Saving"),
          value: inr(result.savingVsRegular),
          footnote: t(
            "Tool_senior_citizen_tax_Result_SavingFootnote",
            inr(result.regularTaxAfterRebate),
          ),
        },
      ],
      scenarios: [
        {
          name: t("Tool_senior_citizen_tax_Scenario_Regular"),
          primaryLabel: t("Tool_senior_citizen_tax_Result_Tax"),
          primaryValue: inr(regular.taxAfterRebate),
          secondaryLabel: t("Tool_senior_citizen_tax_Result_Exemption"),
          secondaryValue: inr(regular.basicExemption),
          variant: "worst",
        },
        {
          name: t("Tool_senior_citizen_tax_Scenario_Senior"),
          primaryLabel: t("Tool_senior_citizen_tax_Result_Tax"),
          primaryValue: inr(senior.taxAfterRebate),
          secondaryLabel: t("Tool_senior_citizen_tax_Result_Exemption"),
          secondaryValue: inr(senior.basicExemption),
          variant: "base",
        },
        {
          name: t("Tool_senior_citizen_tax_Scenario_Super"),
          primaryLabel: t("Tool_senior_citizen_tax_Result_Tax"),
          primaryValue: inr(superSenior.taxAfterRebate),
          secondaryLabel: t("Tool_senior_citizen_tax_Result_Exemption"),
          secondaryValue: inr(superSenior.basicExemption),
          variant: "best",
        },
      ],
    };
  }, [income, category, t]);

  return (
    <ToolPageShell
      title={t(tool.titleKey)}
      subtitle={t("Tool_senior_citizen_tax_Subtitle")}
      description={t(tool.descriptionKey)}
      icon={tool.icon}
      educate={
        <>
          <div className="fy-info-box">
            <strong>{t("Common_WhatYouLearn")}</strong>
            <p>{t("Tool_senior_citizen_tax_LearnText")}</p>
          </div>
          <FormulaCard
            title={t("Common_Formula")}
            code={
              "Exemption: Regular ₹2.5L · Senior ₹3L · Super ₹5L\nTaxable = income − exemption\n87A rebate if income ≤ ₹5L (old-regime style)"
            }
            note={t("Tool_senior_citizen_tax_FormulaNote")}
          />
        </>
      }
      below={<ToolInfoPanel info={seniorCitizenTaxInfo(t)} />}
    >
      <div className="fy-form-card">
        <h3>{t("Common_YourInputs")}</h3>
        <div className="fy-field">
          <label>{t("Tool_senior_citizen_tax_LabelIncome")}</label>
          <input
            type="number"
            min={0}
            step={10000}
            inputMode="decimal"
            value={income}
            onChange={(e) => setIncome(Math.max(0, Number(e.target.value) || 0))}
          />
        </div>
        <div className="fy-field">
          <label>{t("Tool_senior_citizen_tax_LabelCategory")}</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as SeniorTaxCategory)}
          >
            <option value="senior">{t("Tool_senior_citizen_tax_Cat_Senior")}</option>
            <option value="super-senior">{t("Tool_senior_citizen_tax_Cat_Super")}</option>
            <option value="regular">{t("Tool_senior_citizen_tax_Cat_Regular")}</option>
          </select>
          <p className="fy-field-hint">{t("Tool_senior_citizen_tax_CategoryHint")}</p>
        </div>
        <button type="button" className="fy-btn-calc">
          {t("Common_Calculate")}
        </button>
      </div>

      <div className="fy-info-box">
        <strong>{t("Tool_senior_citizen_tax_VerdictTitle")}</strong>
        <p>
          {t(
            "Tool_senior_citizen_tax_VerdictNote",
            inr(result.taxAfterRebate),
            inr(result.savingVsRegular),
          )}
        </p>
      </div>

      <ResultSummaryCards cards={summaryCards} />
      <ScenarioCompare
        title={t("Tool_senior_citizen_tax_ScenarioTitle")}
        subtitle={t("Tool_senior_citizen_tax_ScenarioSubtitle")}
        scenarios={scenarios}
      />
      <WorkedExample
        title={t("Tool_senior_citizen_tax_ExampleTitle")}
        subtitle={t("Tool_senior_citizen_tax_ExampleSubtitle")}
        steps={exampleSteps}
      />
    </ToolPageShell>
  );
}
