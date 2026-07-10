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
  calculateSection80tta,
  SECTION_80TTA_LIMIT,
  SECTION_80TTB_LIMIT,
} from "@/lib/finance/section80tta";
import { inr, percent } from "@/lib/finance/format";
import { getTool } from "@/lib/config/tools";
import { section80ttaInfo } from "@/lib/tool-page-content";

export function Section80ttaCalculator() {
  const t = useT();
  const tool = getTool("section-80tta")!;

  const [savingsInterest, setSavingsInterest] = useState(15_000);
  const [isSenior, setIsSenior] = useState(false);
  const [taxSlab, setTaxSlab] = useState(30);

  const exampleSteps = useMemo(
    () => [
      t("Tool_section_80tta_ExampleStep_1"),
      t("Tool_section_80tta_ExampleStep_2"),
      t("Tool_section_80tta_ExampleStep_3"),
      t("Tool_section_80tta_ExampleStep_4"),
      t("Tool_section_80tta_ExampleStep_5"),
    ],
    [t],
  );

  const { summaryCards, scenarios } = useMemo(() => {
    const input = { savingsInterest, isSenior, taxSlabPercent: taxSlab };
    const result = calculateSection80tta(input);
    const asNonSenior = calculateSection80tta({ ...input, isSenior: false });
    const asSenior = calculateSection80tta({ ...input, isSenior: true });

    return {
      summaryCards: [
        {
          label: t("Tool_section_80tta_Result_Eligible"),
          value: inr(result.eligibleDeduction),
          footnote: t(
            "Tool_section_80tta_Result_EligibleFootnote",
            result.sectionLabel,
            inr(result.limit),
          ),
          variant: "primary" as const,
        },
        {
          label: t("Tool_section_80tta_Result_Saving"),
          value: inr(result.estimatedTaxSaving),
          footnote: t("Tool_section_80tta_Result_SavingFootnote", percent(taxSlab, 0)),
          variant: "secure" as const,
        },
        {
          label: t("Tool_section_80tta_Result_Taxable"),
          value: inr(result.taxableInterest),
          footnote: t("Tool_section_80tta_Result_TaxableFootnote"),
          variant: result.taxableInterest > 0 ? ("volatile" as const) : ("default" as const),
        },
      ],
      scenarios: [
        {
          name: t("Tool_section_80tta_Scenario_80tta", inr(SECTION_80TTA_LIMIT)),
          primaryLabel: t("Tool_section_80tta_Result_Eligible"),
          primaryValue: inr(asNonSenior.eligibleDeduction),
          secondaryLabel: t("Tool_section_80tta_Result_Saving"),
          secondaryValue: inr(asNonSenior.estimatedTaxSaving),
          variant: "worst",
        },
        {
          name: t("Common_Scenario_Base"),
          primaryLabel: t("Tool_section_80tta_Result_Eligible"),
          primaryValue: inr(result.eligibleDeduction),
          secondaryLabel: t("Tool_section_80tta_Result_Saving"),
          secondaryValue: inr(result.estimatedTaxSaving),
          variant: "base",
        },
        {
          name: t("Tool_section_80tta_Scenario_80ttb", inr(SECTION_80TTB_LIMIT)),
          primaryLabel: t("Tool_section_80tta_Result_Eligible"),
          primaryValue: inr(asSenior.eligibleDeduction),
          secondaryLabel: t("Tool_section_80tta_Result_Saving"),
          secondaryValue: inr(asSenior.estimatedTaxSaving),
          variant: "best",
        },
      ],
    };
  }, [savingsInterest, isSenior, taxSlab, t]);

  return (
    <ToolPageShell
      title={t(tool.titleKey)}
      subtitle={t("Tool_section_80tta_Subtitle")}
      description={t(tool.descriptionKey)}
      icon={tool.icon}
      educate={
        <>
          <div className="fy-info-box">
            <strong>{t("Common_WhatYouLearn")}</strong>
            <p>{t("Tool_section_80tta_LearnText")}</p>
          </div>
          <FormulaCard
            title={t("Common_Formula")}
            code={"80TTA limit = ₹10,000\n80TTB (senior) = ₹50,000\nSaving ≈ eligible × slab%"}
            note={t("Tool_section_80tta_FormulaNote")}
          />
        </>
      }
      below={<ToolInfoPanel info={section80ttaInfo(t)} />}
    >
      <div className="fy-form-card">
        <h3>{t("Common_YourInputs")}</h3>
        <div className="fy-field">
          <label>{t("Tool_section_80tta_LabelInterest")}</label>
          <input
            type="number"
            min={0}
            step={500}
            inputMode="decimal"
            value={savingsInterest}
            onChange={(e) => setSavingsInterest(Math.max(0, Number(e.target.value) || 0))}
          />
          <p className="fy-field-hint">{t("Tool_section_80tta_InterestHint")}</p>
        </div>
        <div className="fy-field">
          <label>{t("Tool_section_80tta_LabelSenior")}</label>
          <select
            value={isSenior ? "yes" : "no"}
            onChange={(e) => setIsSenior(e.target.value === "yes")}
          >
            <option value="no">{t("Tool_section_80tta_Senior_No")}</option>
            <option value="yes">{t("Tool_section_80tta_Senior_Yes")}</option>
          </select>
        </div>
        <div className="fy-field">
          <label>{t("Tool_section_80tta_LabelSlab")}</label>
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
        title={t("Tool_section_80tta_ScenarioTitle")}
        subtitle={t("Tool_section_80tta_ScenarioSubtitle")}
        scenarios={scenarios}
      />
      <WorkedExample
        title={t("Tool_section_80tta_ExampleTitle")}
        subtitle={t("Tool_section_80tta_ExampleSubtitle")}
        steps={exampleSteps}
      />
    </ToolPageShell>
  );
}
