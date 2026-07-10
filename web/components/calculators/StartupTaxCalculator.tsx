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
import { calculateStartupTax } from "@/lib/finance/startupTax";
import { inr, percent } from "@/lib/finance/format";
import { getTool } from "@/lib/config/tools";
import { startupTaxInfo } from "@/lib/tool-page-content";

export function StartupTaxCalculator() {
  const t = useT();
  const tool = getTool("startup-tax")!;

  const [profit, setProfit] = useState(50_00_000);
  const [dpiitEligible, setDpiitEligible] = useState(true);
  const [slab, setSlab] = useState(30);

  const exampleSteps = useMemo(
    () => [
      t("Tool_startup_tax_ExampleStep_1"),
      t("Tool_startup_tax_ExampleStep_2"),
      t("Tool_startup_tax_ExampleStep_3"),
      t("Tool_startup_tax_ExampleStep_4"),
      t("Tool_startup_tax_ExampleStep_5"),
    ],
    [t],
  );

  const { summaryCards, scenarios, result } = useMemo(() => {
    const result = calculateStartupTax({ profit, dpiitEligible, taxSlabPercent: slab });
    const without = calculateStartupTax({ profit, dpiitEligible: false, taxSlabPercent: slab });
    const half = calculateStartupTax({
      profit: Math.round(profit / 2),
      dpiitEligible,
      taxSlabPercent: slab,
    });

    return {
      result,
      summaryCards: [
        {
          label: t("Tool_startup_tax_Result_Tax"),
          value: inr(result.totalTax),
          footnote: t("Tool_startup_tax_Result_TaxFootnote", percent(result.taxSlabPercent)),
          variant: "primary" as const,
        },
        {
          label: t("Tool_startup_tax_Result_Deduction"),
          value: inr(result.deduction80Iac),
          footnote: t("Tool_startup_tax_Result_DeductionFootnote"),
          variant: "secure" as const,
        },
        {
          label: t("Tool_startup_tax_Result_Saved"),
          value: inr(result.taxSaved),
          footnote: t("Tool_startup_tax_Result_SavedFootnote"),
        },
      ],
      scenarios: [
        {
          name: t("Tool_startup_tax_Scenario_NoDpiit"),
          primaryLabel: t("Tool_startup_tax_Result_Tax"),
          primaryValue: inr(without.totalTax),
          secondaryLabel: t("Tool_startup_tax_Result_Deduction"),
          secondaryValue: inr(without.deduction80Iac),
          variant: "worst" as const,
        },
        {
          name: t("Common_Scenario_Base"),
          primaryLabel: t("Tool_startup_tax_Result_Tax"),
          primaryValue: inr(result.totalTax),
          secondaryLabel: t("Tool_startup_tax_Result_Saved"),
          secondaryValue: inr(result.taxSaved),
          variant: "base" as const,
        },
        {
          name: t("Tool_startup_tax_Scenario_Half"),
          primaryLabel: t("Tool_startup_tax_Result_Tax"),
          primaryValue: inr(half.totalTax),
          secondaryLabel: t("Tool_startup_tax_Result_Deduction"),
          secondaryValue: inr(half.deduction80Iac),
          variant: "best" as const,
        },
      ],
    };
  }, [profit, dpiitEligible, slab, t]);

  return (
    <ToolPageShell
      title={t(tool.titleKey)}
      subtitle={t("Tool_startup_tax_Subtitle")}
      description={t(tool.descriptionKey)}
      icon={tool.icon}
      educate={
        <>
          <div className="fy-info-box">
            <strong>{t("Common_WhatYouLearn")}</strong>
            <p>{t("Tool_startup_tax_LearnText")}</p>
          </div>
          <FormulaCard
            title={t("Common_Formula")}
            code={
              "DPIIT + 80-IAC → taxable = 0 (illustrative)\nElse tax = profit × slab% × 1.04\nAngel tax: abolished for DPIIT"
            }
            note={t("Tool_startup_tax_FormulaNote")}
          />
        </>
      }
      below={<ToolInfoPanel info={startupTaxInfo(t)} />}
    >
      <div className="fy-form-card">
        <h3>{t("Common_YourInputs")}</h3>
        <div className="fy-field">
          <label>{t("Tool_startup_tax_LabelProfit")}</label>
          <input
            type="number"
            min={0}
            step={10000}
            inputMode="decimal"
            value={profit}
            onChange={(e) => setProfit(Math.max(0, Number(e.target.value) || 0))}
          />
        </div>
        <div className="fy-field">
          <label>{t("Tool_startup_tax_LabelDpiit")}</label>
          <select
            value={dpiitEligible ? "yes" : "no"}
            onChange={(e) => setDpiitEligible(e.target.value === "yes")}
          >
            <option value="yes">{t("Tool_startup_tax_Dpiit_Yes")}</option>
            <option value="no">{t("Tool_startup_tax_Dpiit_No")}</option>
          </select>
          <p className="fy-field-hint">{t("Tool_startup_tax_DpiitHint")}</p>
        </div>
        <div className="fy-field">
          <label>{t("Tool_startup_tax_LabelSlab")}</label>
          <input
            type="number"
            min={0}
            max={42}
            step={1}
            inputMode="decimal"
            value={slab}
            onChange={(e) => setSlab(Math.min(42, Math.max(0, Number(e.target.value) || 0)))}
          />
        </div>
        <button type="button" className="fy-btn-calc">
          {t("Common_Calculate")}
        </button>
      </div>

      <div className="fy-info-box">
        <strong>{t("Tool_startup_tax_AngelTitle")}</strong>
        <p>
          {result.angelTaxNote === "abolished_dpiit"
            ? t("Tool_startup_tax_Angel_Abolished")
            : t("Tool_startup_tax_Angel_Na")}
        </p>
      </div>

      <ResultSummaryCards cards={summaryCards} />
      <ScenarioCompare
        title={t("Tool_startup_tax_ScenarioTitle")}
        subtitle={t("Tool_startup_tax_ScenarioSubtitle")}
        scenarios={scenarios}
      />
      <WorkedExample
        title={t("Tool_startup_tax_ExampleTitle")}
        subtitle={t("Tool_startup_tax_ExampleSubtitle")}
        steps={exampleSteps}
      />
    </ToolPageShell>
  );
}
