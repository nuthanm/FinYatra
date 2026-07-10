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
  calculateMutualFundTax,
  type MfFundType,
} from "@/lib/finance/mutualFundTax";
import { inr, percent } from "@/lib/finance/format";
import { getTool } from "@/lib/config/tools";
import { mutualFundTaxInfo } from "@/lib/tool-page-content";

const FUND_TYPES: MfFundType[] = ["equity", "debt"];

export function MutualFundTaxCalculator() {
  const t = useT();
  const tool = getTool("mutual-fund-tax")!;

  const [fundType, setFundType] = useState<MfFundType>("equity");
  const [buyValue, setBuyValue] = useState(5_00_000);
  const [sellValue, setSellValue] = useState(8_00_000);
  const [holdingMonths, setHoldingMonths] = useState(18);
  const [taxSlab, setTaxSlab] = useState(30);

  const exampleSteps = useMemo(
    () => [
      t("Tool_mutual_fund_tax_ExampleStep_1"),
      t("Tool_mutual_fund_tax_ExampleStep_2"),
      t("Tool_mutual_fund_tax_ExampleStep_3"),
      t("Tool_mutual_fund_tax_ExampleStep_4"),
      t("Tool_mutual_fund_tax_ExampleStep_5"),
    ],
    [t],
  );

  const { summaryCards, scenarios } = useMemo(() => {
    const result = calculateMutualFundTax({
      fundType,
      buyValue,
      sellValue,
      holdingMonths,
      taxSlabPercent: taxSlab,
    });
    const short = calculateMutualFundTax({
      fundType,
      buyValue,
      sellValue,
      holdingMonths: Math.max(1, result.holdingThresholdMonths - 1),
      taxSlabPercent: taxSlab,
    });
    const long = calculateMutualFundTax({
      fundType,
      buyValue,
      sellValue,
      holdingMonths: result.holdingThresholdMonths + 6,
      taxSlabPercent: taxSlab,
    });

    return {
      summaryCards: [
        {
          label: t("Tool_mutual_fund_tax_Result_Gain"),
          value: inr(result.gain),
          footnote: result.isLongTerm
            ? t("Tool_mutual_fund_tax_Result_Ltcg")
            : t("Tool_mutual_fund_tax_Result_Stcg"),
          variant: "primary" as const,
        },
        {
          label: t("Tool_mutual_fund_tax_Result_Taxable"),
          value: inr(result.taxableGain),
          footnote: t("Tool_mutual_fund_tax_Result_TaxableFootnote"),
        },
        {
          label: t("Tool_mutual_fund_tax_Result_Tax"),
          value: inr(result.taxAmount),
          footnote: t("Tool_mutual_fund_tax_Result_TaxFootnote", percent(result.taxRatePercent)),
          variant: "volatile" as const,
        },
      ],
      scenarios: [
        {
          name: t("Tool_mutual_fund_tax_Scenario_Short"),
          primaryLabel: t("Tool_mutual_fund_tax_Result_Tax"),
          primaryValue: inr(short.taxAmount),
          secondaryLabel: t("Tool_mutual_fund_tax_LabelHolding"),
          secondaryValue: String(Math.max(1, result.holdingThresholdMonths - 1)),
          variant: "worst" as const,
        },
        {
          name: t("Common_Scenario_Base"),
          primaryLabel: t("Tool_mutual_fund_tax_Result_Tax"),
          primaryValue: inr(result.taxAmount),
          secondaryLabel: t("Tool_mutual_fund_tax_LabelHolding"),
          secondaryValue: String(holdingMonths),
          variant: "base" as const,
        },
        {
          name: t("Tool_mutual_fund_tax_Scenario_Long"),
          primaryLabel: t("Tool_mutual_fund_tax_Result_Tax"),
          primaryValue: inr(long.taxAmount),
          secondaryLabel: t("Tool_mutual_fund_tax_LabelHolding"),
          secondaryValue: String(result.holdingThresholdMonths + 6),
          variant: "best" as const,
        },
      ],
    };
  }, [fundType, buyValue, sellValue, holdingMonths, taxSlab, t]);

  return (
    <ToolPageShell
      title={t(tool.titleKey)}
      subtitle={t("Tool_mutual_fund_tax_Subtitle")}
      description={t(tool.descriptionKey)}
      icon={tool.icon}
      educate={
        <>
          <div className="fy-info-box">
            <strong>{t("Common_WhatYouLearn")}</strong>
            <p>{t("Tool_mutual_fund_tax_LearnText")}</p>
          </div>
          <FormulaCard
            title={t("Common_Formula")}
            code={"gain = sell − buy\nequity: STCG 20% / LTCG 12.5% (−₹1.25L)\ndebt: always slab (simplified)"}
            note={t("Tool_mutual_fund_tax_FormulaNote")}
          />
        </>
      }
      below={<ToolInfoPanel info={mutualFundTaxInfo(t)} />}
    >
      <div className="fy-form-card">
        <h3>{t("Common_YourInputs")}</h3>
        <div className="fy-field">
          <label>{t("Tool_mutual_fund_tax_LabelType")}</label>
          <select
            value={fundType}
            onChange={(e) => setFundType(e.target.value as MfFundType)}
          >
            {FUND_TYPES.map((ft) => (
              <option key={ft} value={ft}>
                {t(`Tool_mutual_fund_tax_Type_${ft === "equity" ? "Equity" : "Debt"}`)}
              </option>
            ))}
          </select>
        </div>
        <div className="fy-field">
          <label>{t("Tool_mutual_fund_tax_LabelBuy")}</label>
          <input
            type="number"
            min={0}
            step={10000}
            inputMode="decimal"
            value={buyValue}
            onChange={(e) => setBuyValue(Math.max(0, Number(e.target.value) || 0))}
          />
        </div>
        <div className="fy-field">
          <label>{t("Tool_mutual_fund_tax_LabelSell")}</label>
          <input
            type="number"
            min={0}
            step={10000}
            inputMode="decimal"
            value={sellValue}
            onChange={(e) => setSellValue(Math.max(0, Number(e.target.value) || 0))}
          />
        </div>
        <div className="fy-field">
          <label>{t("Tool_mutual_fund_tax_LabelHolding")}</label>
          <input
            type="number"
            min={0}
            step={1}
            inputMode="numeric"
            value={holdingMonths}
            onChange={(e) => setHoldingMonths(Math.max(0, Number(e.target.value) || 0))}
          />
        </div>
        <div className="fy-field">
          <label>{t("Tool_mutual_fund_tax_LabelSlab")}</label>
          <input
            type="number"
            min={0}
            max={42}
            step={1}
            inputMode="decimal"
            value={taxSlab}
            onChange={(e) => setTaxSlab(Math.max(0, Number(e.target.value) || 0))}
          />
          <p className="fy-field-hint">{t("Tool_mutual_fund_tax_SlabHint")}</p>
        </div>
        <button type="button" className="fy-btn-calc">
          {t("Common_Calculate")}
        </button>
      </div>

      <ResultSummaryCards cards={summaryCards} />
      <ScenarioCompare
        title={t("Tool_mutual_fund_tax_ScenarioTitle")}
        subtitle={t("Tool_mutual_fund_tax_ScenarioSubtitle")}
        scenarios={scenarios}
      />
      <WorkedExample
        title={t("Tool_mutual_fund_tax_ExampleTitle")}
        subtitle={t("Tool_mutual_fund_tax_ExampleSubtitle")}
        steps={exampleSteps}
      />
    </ToolPageShell>
  );
}
