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
  calculateSection80u,
  SECTION_80U_LIMIT,
  SECTION_80U_SEVERE_LIMIT,
} from "@/lib/finance/section80u";
import { inr, percent } from "@/lib/finance/format";
import { getTool } from "@/lib/config/tools";
import { section80uInfo } from "@/lib/tool-page-content";

export function Section80uCalculator() {
  const t = useT();
  const tool = getTool("80u-disability-deduction")!;

  const [isSevere, setIsSevere] = useState(false);
  const [taxSlab, setTaxSlab] = useState(30);

  const exampleSteps = useMemo(
    () => [
      t("Tool_80u_disability_deduction_ExampleStep_1"),
      t("Tool_80u_disability_deduction_ExampleStep_2"),
      t("Tool_80u_disability_deduction_ExampleStep_3"),
      t("Tool_80u_disability_deduction_ExampleStep_4"),
      t("Tool_80u_disability_deduction_ExampleStep_5"),
    ],
    [t],
  );

  const { summaryCards, scenarios } = useMemo(() => {
    const result = calculateSection80u({ isSevere, taxSlabPercent: taxSlab });
    const normal = calculateSection80u({ isSevere: false, taxSlabPercent: taxSlab });
    const severe = calculateSection80u({ isSevere: true, taxSlabPercent: taxSlab });

    return {
      summaryCards: [
        {
          label: t("Tool_80u_disability_deduction_Result_Eligible"),
          value: inr(result.eligibleDeduction),
          footnote: t(
            "Tool_80u_disability_deduction_Result_EligibleFootnote",
            isSevere
              ? t("Tool_80u_disability_deduction_Severe_Yes")
              : t("Tool_80u_disability_deduction_Severe_No"),
          ),
          variant: "primary" as const,
        },
        {
          label: t("Tool_80u_disability_deduction_Result_Saving"),
          value: inr(result.estimatedTaxSaving),
          footnote: t("Tool_80u_disability_deduction_Result_SavingFootnote", percent(taxSlab, 0)),
          variant: "secure" as const,
        },
        {
          label: t("Tool_80u_disability_deduction_Result_Limit"),
          value: inr(result.limit),
          footnote: t("Tool_80u_disability_deduction_Result_LimitFootnote"),
        },
      ],
      scenarios: [
        {
          name: t("Tool_80u_disability_deduction_Scenario_Normal", inr(SECTION_80U_LIMIT)),
          primaryLabel: t("Tool_80u_disability_deduction_Result_Eligible"),
          primaryValue: inr(normal.eligibleDeduction),
          secondaryLabel: t("Tool_80u_disability_deduction_Result_Saving"),
          secondaryValue: inr(normal.estimatedTaxSaving),
          variant: "worst" as const,
        },
        {
          name: t("Common_Scenario_Base"),
          primaryLabel: t("Tool_80u_disability_deduction_Result_Eligible"),
          primaryValue: inr(result.eligibleDeduction),
          secondaryLabel: t("Tool_80u_disability_deduction_Result_Saving"),
          secondaryValue: inr(result.estimatedTaxSaving),
          variant: "base" as const,
        },
        {
          name: t("Tool_80u_disability_deduction_Scenario_Severe", inr(SECTION_80U_SEVERE_LIMIT)),
          primaryLabel: t("Tool_80u_disability_deduction_Result_Eligible"),
          primaryValue: inr(severe.eligibleDeduction),
          secondaryLabel: t("Tool_80u_disability_deduction_Result_Saving"),
          secondaryValue: inr(severe.estimatedTaxSaving),
          variant: "best" as const,
        },
      ],
    };
  }, [isSevere, taxSlab, t]);

  return (
    <ToolPageShell
      title={t(tool.titleKey)}
      subtitle={t("Tool_80u_disability_deduction_Subtitle")}
      description={t(tool.descriptionKey)}
      icon={tool.icon}
      educate={
        <>
          <div className="fy-info-box">
            <strong>{t("Common_WhatYouLearn")}</strong>
            <p>{t("Tool_80u_disability_deduction_LearnText")}</p>
          </div>
          <FormulaCard
            title={t("Common_Formula")}
            code={"Deduction = ₹75K / ₹1.25L (severe)\nSaving ≈ deduction × slab%"}
            note={t("Tool_80u_disability_deduction_FormulaNote")}
          />
        </>
      }
      below={<ToolInfoPanel info={section80uInfo(t)} />}
    >
      <div className="fy-form-card">
        <h3>{t("Common_YourInputs")}</h3>
        <div className="fy-field">
          <label>{t("Tool_80u_disability_deduction_LabelSevere")}</label>
          <select
            value={isSevere ? "yes" : "no"}
            onChange={(e) => setIsSevere(e.target.value === "yes")}
          >
            <option value="no">{t("Tool_80u_disability_deduction_Severe_No")}</option>
            <option value="yes">{t("Tool_80u_disability_deduction_Severe_Yes")}</option>
          </select>
        </div>
        <div className="fy-field">
          <label>{t("Tool_80u_disability_deduction_LabelSlab")}</label>
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
        title={t("Tool_80u_disability_deduction_ScenarioTitle")}
        subtitle={t("Tool_80u_disability_deduction_ScenarioSubtitle")}
        scenarios={scenarios}
      />
      <WorkedExample
        title={t("Tool_80u_disability_deduction_ExampleTitle")}
        subtitle={t("Tool_80u_disability_deduction_ExampleSubtitle")}
        steps={exampleSteps}
      />
    </ToolPageShell>
  );
}
