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
import { calculateSwpTax } from "@/lib/finance/swpTax";
import { inr, percent } from "@/lib/finance/format";
import { getTool } from "@/lib/config/tools";
import { swpTaxInfo } from "@/lib/tool-page-content";

export function SwpTaxCalculator() {
  const t = useT();
  const tool = getTool("swp-tax")!;

  const [withdrawal, setWithdrawal] = useState(25_000);
  const [costPerUnit, setCostPerUnit] = useState(80);
  const [nav, setNav] = useState(120);
  const [holdingMonths, setHoldingMonths] = useState(18);
  const [slab, setSlab] = useState(30);

  const exampleSteps = useMemo(
    () => [
      t("Tool_swp_tax_ExampleStep_1"),
      t("Tool_swp_tax_ExampleStep_2"),
      t("Tool_swp_tax_ExampleStep_3"),
      t("Tool_swp_tax_ExampleStep_4"),
      t("Tool_swp_tax_ExampleStep_5"),
    ],
    [t],
  );

  const { summaryCards, scenarios } = useMemo(() => {
    const result = calculateSwpTax({
      withdrawalAmount: withdrawal,
      costPerUnit,
      nav,
      holdingMonths,
      taxSlabPercent: slab,
    });
    const shortTerm = calculateSwpTax({
      withdrawalAmount: withdrawal,
      costPerUnit,
      nav,
      holdingMonths: 6,
      taxSlabPercent: slab,
    });
    const longTerm = calculateSwpTax({
      withdrawalAmount: withdrawal,
      costPerUnit,
      nav,
      holdingMonths: 24,
      taxSlabPercent: slab,
    });

    return {
      summaryCards: [
        {
          label: t("Tool_swp_tax_Result_Gain"),
          value: inr(result.gain),
          footnote: t(
            "Tool_swp_tax_Result_GainFootnote",
            result.unitsRedeemed.toFixed(2),
          ),
          variant: "primary" as const,
        },
        {
          label: t("Tool_swp_tax_Result_Tax"),
          value: inr(result.taxAmount),
          footnote: t(
            "Tool_swp_tax_Result_TaxFootnote",
            percent(result.taxRatePercent),
            result.isLongTerm
              ? t("Tool_swp_tax_Term_Ltcg")
              : t("Tool_swp_tax_Term_Stcg"),
          ),
          variant: "volatile" as const,
        },
        {
          label: t("Tool_swp_tax_Result_Net"),
          value: inr(result.netProceeds),
          footnote: t("Tool_swp_tax_Result_NetFootnote", inr(result.costBasis)),
          variant: "secure" as const,
        },
      ],
      scenarios: [
        {
          name: t("Tool_swp_tax_Scenario_Stcg"),
          primaryLabel: t("Tool_swp_tax_Result_Tax"),
          primaryValue: inr(shortTerm.taxAmount),
          secondaryLabel: t("Tool_swp_tax_Result_Gain"),
          secondaryValue: inr(shortTerm.gain),
          variant: "worst" as const,
        },
        {
          name: t("Common_Scenario_Base"),
          primaryLabel: t("Tool_swp_tax_Result_Tax"),
          primaryValue: inr(result.taxAmount),
          secondaryLabel: t("Tool_swp_tax_Result_Net"),
          secondaryValue: inr(result.netProceeds),
          variant: "base" as const,
        },
        {
          name: t("Tool_swp_tax_Scenario_Ltcg"),
          primaryLabel: t("Tool_swp_tax_Result_Tax"),
          primaryValue: inr(longTerm.taxAmount),
          secondaryLabel: t("Tool_swp_tax_Result_Net"),
          secondaryValue: inr(longTerm.netProceeds),
          variant: "best" as const,
        },
      ],
    };
  }, [withdrawal, costPerUnit, nav, holdingMonths, slab, t]);

  return (
    <ToolPageShell
      title={t(tool.titleKey)}
      subtitle={t("Tool_swp_tax_Subtitle")}
      description={t(tool.descriptionKey)}
      icon={tool.icon}
      educate={
        <>
          <div className="fy-info-box">
            <strong>{t("Common_WhatYouLearn")}</strong>
            <p>{t("Tool_swp_tax_LearnText")}</p>
          </div>
          <FormulaCard
            title={t("Common_Formula")}
            code={
              "Units = withdrawal / NAV\nCost = units × cost/unit\nCG tax on (withdrawal − cost)"
            }
            note={t("Tool_swp_tax_FormulaNote")}
          />
        </>
      }
      below={<ToolInfoPanel info={swpTaxInfo(t)} />}
    >
      <div className="fy-form-card">
        <h3>{t("Common_YourInputs")}</h3>
        <div className="fy-field">
          <label>{t("Tool_swp_tax_LabelWithdrawal")}</label>
          <input
            type="number"
            min={0}
            step={1000}
            inputMode="decimal"
            value={withdrawal}
            onChange={(e) => setWithdrawal(Math.max(0, Number(e.target.value) || 0))}
          />
        </div>
        <div className="fy-field">
          <label>{t("Tool_swp_tax_LabelCost")}</label>
          <input
            type="number"
            min={0}
            step={0.01}
            inputMode="decimal"
            value={costPerUnit}
            onChange={(e) => setCostPerUnit(Math.max(0, Number(e.target.value) || 0))}
          />
        </div>
        <div className="fy-field">
          <label>{t("Tool_swp_tax_LabelNav")}</label>
          <input
            type="number"
            min={0}
            step={0.01}
            inputMode="decimal"
            value={nav}
            onChange={(e) => setNav(Math.max(0, Number(e.target.value) || 0))}
          />
        </div>
        <div className="fy-field">
          <label>{t("Tool_swp_tax_LabelHolding")}</label>
          <input
            type="number"
            min={0}
            max={120}
            step={1}
            inputMode="numeric"
            value={holdingMonths}
            onChange={(e) => setHoldingMonths(Math.max(0, Number(e.target.value) || 0))}
          />
        </div>
        <div className="fy-field">
          <label>{t("Tool_swp_tax_LabelSlab")}</label>
          <input
            type="number"
            min={0}
            max={42}
            step={1}
            inputMode="decimal"
            value={slab}
            onChange={(e) => setSlab(Math.max(0, Number(e.target.value) || 0))}
          />
          <p className="fy-hint">{t("Tool_swp_tax_SlabHint")}</p>
        </div>
        <button type="button" className="fy-btn-calc">
          {t("Common_Calculate")}
        </button>
      </div>

      <ResultSummaryCards cards={summaryCards} />
      <ScenarioCompare
        title={t("Tool_swp_tax_ScenarioTitle")}
        subtitle={t("Tool_swp_tax_ScenarioSubtitle")}
        scenarios={scenarios}
      />
      <WorkedExample
        title={t("Tool_swp_tax_ExampleTitle")}
        subtitle={t("Tool_swp_tax_ExampleSubtitle")}
        steps={exampleSteps}
      />
    </ToolPageShell>
  );
}
