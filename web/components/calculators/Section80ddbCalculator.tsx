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
  calculateSection80ddb,
  SECTION_80DDB_LIMIT,
  SECTION_80DDB_SENIOR_LIMIT,
} from "@/lib/finance/section80ddb";
import { inr, percent } from "@/lib/finance/format";
import { getTool } from "@/lib/config/tools";
import { section80ddbInfo } from "@/lib/tool-page-content";

export function Section80ddbCalculator() {
  const t = useT();
  const tool = getTool("80ddb-medical-expense")!;

  const [medicalExpense, setMedicalExpense] = useState(60_000);
  const [isSenior, setIsSenior] = useState(false);
  const [taxSlab, setTaxSlab] = useState(30);

  const exampleSteps = useMemo(
    () => [
      t("Tool_80ddb_medical_expense_ExampleStep_1"),
      t("Tool_80ddb_medical_expense_ExampleStep_2"),
      t("Tool_80ddb_medical_expense_ExampleStep_3"),
      t("Tool_80ddb_medical_expense_ExampleStep_4"),
      t("Tool_80ddb_medical_expense_ExampleStep_5"),
    ],
    [t],
  );

  const { summaryCards, scenarios } = useMemo(() => {
    const input = { medicalExpense, isSenior, taxSlabPercent: taxSlab };
    const result = calculateSection80ddb(input);
    const nonSenior = calculateSection80ddb({ ...input, isSenior: false });
    const senior = calculateSection80ddb({ ...input, isSenior: true });

    return {
      summaryCards: [
        {
          label: t("Tool_80ddb_medical_expense_Result_Eligible"),
          value: inr(result.eligibleDeduction),
          footnote: t("Tool_80ddb_medical_expense_Result_EligibleFootnote", inr(result.limit)),
          variant: "primary" as const,
        },
        {
          label: t("Tool_80ddb_medical_expense_Result_Saving"),
          value: inr(result.estimatedTaxSaving),
          footnote: t("Tool_80ddb_medical_expense_Result_SavingFootnote", percent(taxSlab, 0)),
          variant: "secure" as const,
        },
        {
          label: t("Tool_80ddb_medical_expense_Result_Excess"),
          value: inr(result.excessExpense),
          footnote: t("Tool_80ddb_medical_expense_Result_ExcessFootnote"),
        },
      ],
      scenarios: [
        {
          name: t("Tool_80ddb_medical_expense_Scenario_NonSenior", inr(SECTION_80DDB_LIMIT)),
          primaryLabel: t("Tool_80ddb_medical_expense_Result_Eligible"),
          primaryValue: inr(nonSenior.eligibleDeduction),
          secondaryLabel: t("Tool_80ddb_medical_expense_Result_Saving"),
          secondaryValue: inr(nonSenior.estimatedTaxSaving),
          variant: "worst" as const,
        },
        {
          name: t("Common_Scenario_Base"),
          primaryLabel: t("Tool_80ddb_medical_expense_Result_Eligible"),
          primaryValue: inr(result.eligibleDeduction),
          secondaryLabel: t("Tool_80ddb_medical_expense_Result_Saving"),
          secondaryValue: inr(result.estimatedTaxSaving),
          variant: "base" as const,
        },
        {
          name: t("Tool_80ddb_medical_expense_Scenario_Senior", inr(SECTION_80DDB_SENIOR_LIMIT)),
          primaryLabel: t("Tool_80ddb_medical_expense_Result_Eligible"),
          primaryValue: inr(senior.eligibleDeduction),
          secondaryLabel: t("Tool_80ddb_medical_expense_Result_Saving"),
          secondaryValue: inr(senior.estimatedTaxSaving),
          variant: "best" as const,
        },
      ],
    };
  }, [medicalExpense, isSenior, taxSlab, t]);

  return (
    <ToolPageShell
      title={t(tool.titleKey)}
      subtitle={t("Tool_80ddb_medical_expense_Subtitle")}
      description={t(tool.descriptionKey)}
      icon={tool.icon}
      educate={
        <>
          <div className="fy-info-box">
            <strong>{t("Common_WhatYouLearn")}</strong>
            <p>{t("Tool_80ddb_medical_expense_LearnText")}</p>
          </div>
          <FormulaCard
            title={t("Common_Formula")}
            code={"Limit = ₹40K / ₹1L (senior)\nDeduction = min(expense, limit)\nSaving ≈ deduction × slab%"}
            note={t("Tool_80ddb_medical_expense_FormulaNote")}
          />
        </>
      }
      below={<ToolInfoPanel info={section80ddbInfo(t)} />}
    >
      <div className="fy-form-card">
        <h3>{t("Common_YourInputs")}</h3>
        <div className="fy-field">
          <label>{t("Tool_80ddb_medical_expense_LabelExpense")}</label>
          <input
            type="number"
            min={0}
            step={1000}
            inputMode="decimal"
            value={medicalExpense}
            onChange={(e) => setMedicalExpense(Math.max(0, Number(e.target.value) || 0))}
          />
        </div>
        <div className="fy-field">
          <label>{t("Tool_80ddb_medical_expense_LabelSenior")}</label>
          <select
            value={isSenior ? "yes" : "no"}
            onChange={(e) => setIsSenior(e.target.value === "yes")}
          >
            <option value="no">{t("Tool_80ddb_medical_expense_Senior_No")}</option>
            <option value="yes">{t("Tool_80ddb_medical_expense_Senior_Yes")}</option>
          </select>
        </div>
        <div className="fy-field">
          <label>{t("Tool_80ddb_medical_expense_LabelSlab")}</label>
          <input
            type="number"
            min={0}
            max={42}
            step={1}
            inputMode="decimal"
            value={taxSlab}
            onChange={(e) => setTaxSlab(Math.max(0, Number(e.target.value) || 0))}
          />
        </div>
        <button type="button" className="fy-btn-calc">
          {t("Common_Calculate")}
        </button>
      </div>

      <ResultSummaryCards cards={summaryCards} />
      <ScenarioCompare
        title={t("Tool_80ddb_medical_expense_ScenarioTitle")}
        subtitle={t("Tool_80ddb_medical_expense_ScenarioSubtitle")}
        scenarios={scenarios}
      />
      <WorkedExample
        title={t("Tool_80ddb_medical_expense_ExampleTitle")}
        subtitle={t("Tool_80ddb_medical_expense_ExampleSubtitle")}
        steps={exampleSteps}
      />
    </ToolPageShell>
  );
}
