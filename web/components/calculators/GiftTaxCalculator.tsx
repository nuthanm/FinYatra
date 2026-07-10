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
  calculateGiftTax,
  GIFT_EXEMPTION_THRESHOLD,
} from "@/lib/finance/giftTax";
import { inr, percent } from "@/lib/finance/format";
import { getTool } from "@/lib/config/tools";
import { giftTaxInfo } from "@/lib/tool-page-content";

export function GiftTaxCalculator() {
  const t = useT();
  const tool = getTool("gift-tax")!;

  const [giftAmount, setGiftAmount] = useState(200_000);
  const [fromRelative, setFromRelative] = useState(false);
  const [taxSlab, setTaxSlab] = useState(30);

  const exampleSteps = useMemo(
    () => [
      t("Tool_gift_tax_ExampleStep_1"),
      t("Tool_gift_tax_ExampleStep_2"),
      t("Tool_gift_tax_ExampleStep_3"),
      t("Tool_gift_tax_ExampleStep_4"),
      t("Tool_gift_tax_ExampleStep_5"),
    ],
    [t],
  );

  const { summaryCards, scenarios, result } = useMemo(() => {
    const result = calculateGiftTax({ giftAmount, fromRelative, taxSlabPercent: taxSlab });
    const asRelative = calculateGiftTax({ giftAmount, fromRelative: true, taxSlabPercent: taxSlab });
    const belowThreshold = calculateGiftTax({
      giftAmount: Math.min(giftAmount, GIFT_EXEMPTION_THRESHOLD),
      fromRelative: false,
      taxSlabPercent: taxSlab,
    });

    return {
      result,
      summaryCards: [
        {
          label: t("Tool_gift_tax_Result_Taxable"),
          value: inr(result.taxableAmount),
          footnote: result.fromRelative
            ? t("Tool_gift_tax_Result_RelativeFootnote")
            : result.isTaxable
              ? t("Tool_gift_tax_Result_TaxableFootnote", inr(GIFT_EXEMPTION_THRESHOLD))
              : t("Tool_gift_tax_Result_BelowFootnote", inr(GIFT_EXEMPTION_THRESHOLD)),
          variant: "primary" as const,
        },
        {
          label: t("Tool_gift_tax_Result_Tax"),
          value: inr(result.estimatedTax),
          footnote: t("Tool_gift_tax_Result_TaxFootnote", percent(taxSlab)),
          variant: "volatile" as const,
        },
        {
          label: t("Tool_gift_tax_Result_Gift"),
          value: inr(result.giftAmount),
          footnote: t("Tool_gift_tax_Result_GiftFootnote"),
        },
      ],
      scenarios: [
        {
          name: t("Tool_gift_tax_Scenario_Relative"),
          primaryLabel: t("Tool_gift_tax_Result_Tax"),
          primaryValue: inr(asRelative.estimatedTax),
          secondaryLabel: t("Tool_gift_tax_Result_Taxable"),
          secondaryValue: inr(asRelative.taxableAmount),
          variant: "best",
        },
        {
          name: t("Common_Scenario_Base"),
          primaryLabel: t("Tool_gift_tax_Result_Tax"),
          primaryValue: inr(result.estimatedTax),
          secondaryLabel: t("Tool_gift_tax_Result_Taxable"),
          secondaryValue: inr(result.taxableAmount),
          variant: "base",
        },
        {
          name: t("Tool_gift_tax_Scenario_Below"),
          primaryLabel: t("Tool_gift_tax_Result_Tax"),
          primaryValue: inr(belowThreshold.estimatedTax),
          secondaryLabel: t("Tool_gift_tax_Result_Gift"),
          secondaryValue: inr(belowThreshold.giftAmount),
          variant: "best",
        },
      ],
    };
  }, [giftAmount, fromRelative, taxSlab, t]);

  return (
    <ToolPageShell
      title={t(tool.titleKey)}
      subtitle={t("Tool_gift_tax_Subtitle")}
      description={t(tool.descriptionKey)}
      icon={tool.icon}
      educate={
        <>
          <div className="fy-info-box">
            <strong>{t("Common_WhatYouLearn")}</strong>
            <p>{t("Tool_gift_tax_LearnText")}</p>
          </div>
          <FormulaCard
            title={t("Common_Formula")}
            code={"Relative → exempt\nNon-relative > ₹50k → full gift taxable\nTax ≈ Taxable × slab"}
            note={t("Tool_gift_tax_FormulaNote")}
          />
        </>
      }
      below={<ToolInfoPanel info={giftTaxInfo(t)} />}
    >
      <div className="fy-form-card">
        <h3>{t("Common_YourInputs")}</h3>
        <div className="fy-field">
          <label>{t("Tool_gift_tax_LabelAmount")}</label>
          <input
            type="number"
            min={0}
            step={5000}
            inputMode="decimal"
            value={giftAmount}
            onChange={(e) => setGiftAmount(Math.max(0, Number(e.target.value) || 0))}
          />
        </div>
        <div className="fy-field">
          <label>{t("Tool_gift_tax_LabelRelative")}</label>
          <select
            value={fromRelative ? "yes" : "no"}
            onChange={(e) => setFromRelative(e.target.value === "yes")}
          >
            <option value="yes">{t("Tool_gift_tax_Relative_Yes")}</option>
            <option value="no">{t("Tool_gift_tax_Relative_No")}</option>
          </select>
          <p className="fy-field-hint">{t("Tool_gift_tax_RelativeHint")}</p>
        </div>
        <div className="fy-field">
          <label>{t("Tool_gift_tax_LabelSlab")}</label>
          <select value={taxSlab} onChange={(e) => setTaxSlab(Number(e.target.value))}>
            <option value={5}>5%</option>
            <option value={10}>10%</option>
            <option value={20}>20%</option>
            <option value={30}>30%</option>
          </select>
        </div>
        <button type="button" className="fy-btn-calc">
          {t("Common_Calculate")}
        </button>
      </div>

      <div className="fy-info-box">
        <strong>{t("Tool_gift_tax_VerdictTitle")}</strong>
        <p>
          {result.fromRelative
            ? t("Tool_gift_tax_Verdict_Relative")
            : result.isTaxable
              ? t("Tool_gift_tax_Verdict_Taxable", inr(result.estimatedTax), percent(taxSlab))
              : t("Tool_gift_tax_Verdict_Exempt", inr(GIFT_EXEMPTION_THRESHOLD))}
        </p>
      </div>

      <ResultSummaryCards cards={summaryCards} />
      <ScenarioCompare
        title={t("Tool_gift_tax_ScenarioTitle")}
        subtitle={t("Tool_gift_tax_ScenarioSubtitle")}
        scenarios={scenarios}
      />
      <WorkedExample
        title={t("Tool_gift_tax_ExampleTitle")}
        subtitle={t("Tool_gift_tax_ExampleSubtitle")}
        steps={exampleSteps}
      />
    </ToolPageShell>
  );
}
