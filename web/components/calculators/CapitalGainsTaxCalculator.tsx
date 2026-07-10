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
import { calculateCapitalGains, type CapGainAsset } from "@/lib/finance/capitalGains";
import { inr, percent } from "@/lib/finance/format";
import { getTool } from "@/lib/config/tools";
import { capitalGainsTaxInfo } from "@/lib/tool-page-content";

const ASSETS: CapGainAsset[] = ["equity", "property", "gold", "debt_mf"];

export function CapitalGainsTaxCalculator() {
  const t = useT();
  const tool = getTool("capital-gains-tax")!;

  const [asset, setAsset] = useState<CapGainAsset>("equity");
  const [buyPrice, setBuyPrice] = useState(500_000);
  const [sellPrice, setSellPrice] = useState(800_000);
  const [holdingMonths, setHoldingMonths] = useState(18);
  const [taxSlab, setTaxSlab] = useState(30);
  const [exemption, setExemption] = useState(0);

  const exampleSteps = useMemo(
    () => [
      t("Tool_capital_gains_tax_ExampleStep_1"),
      t("Tool_capital_gains_tax_ExampleStep_2"),
      t("Tool_capital_gains_tax_ExampleStep_3"),
      t("Tool_capital_gains_tax_ExampleStep_4"),
      t("Tool_capital_gains_tax_ExampleStep_5"),
    ],
    [t],
  );

  const { summaryCards, scenarios, detail } = useMemo(() => {
    const result = calculateCapitalGains({
      asset,
      buyPrice,
      sellPrice,
      holdingMonths,
      taxSlabPercent: taxSlab,
      exemptionAmount: exemption,
    });
    const short = calculateCapitalGains({
      asset,
      buyPrice,
      sellPrice,
      holdingMonths: Math.max(1, result.holdingThresholdMonths - 1),
      taxSlabPercent: taxSlab,
      exemptionAmount: 0,
    });
    const long = calculateCapitalGains({
      asset,
      buyPrice,
      sellPrice,
      holdingMonths: result.holdingThresholdMonths + 6,
      taxSlabPercent: taxSlab,
      exemptionAmount: exemption,
    });

    return {
      detail: result,
      summaryCards: [
        {
          label: t("Tool_capital_gains_tax_Result_Gain"),
          value: inr(result.gain),
          footnote: result.isLongTerm
            ? t("Tool_capital_gains_tax_Result_Ltcg")
            : t("Tool_capital_gains_tax_Result_Stcg"),
          variant: "primary" as const,
        },
        {
          label: t("Tool_capital_gains_tax_Result_Taxable"),
          value: inr(result.taxableGain),
          footnote: t("Tool_capital_gains_tax_Result_TaxableFootnote"),
        },
        {
          label: t("Tool_capital_gains_tax_Result_Tax"),
          value: inr(result.taxAmount),
          footnote: t("Tool_capital_gains_tax_Result_TaxFootnote", percent(result.taxRatePercent)),
          variant: "volatile" as const,
        },
      ],
      scenarios: [
        {
          name: t("Tool_capital_gains_tax_Scenario_Short"),
          primaryLabel: t("Tool_capital_gains_tax_Result_Tax"),
          primaryValue: inr(short.taxAmount),
          secondaryLabel: t("Tool_capital_gains_tax_LabelHolding"),
          secondaryValue: String(Math.max(1, result.holdingThresholdMonths - 1)),
          variant: "worst",
        },
        {
          name: t("Common_Scenario_Base"),
          primaryLabel: t("Tool_capital_gains_tax_Result_Tax"),
          primaryValue: inr(result.taxAmount),
          secondaryLabel: t("Tool_capital_gains_tax_Result_Taxable"),
          secondaryValue: inr(result.taxableGain),
          variant: "base",
        },
        {
          name: t("Tool_capital_gains_tax_Scenario_Long"),
          primaryLabel: t("Tool_capital_gains_tax_Result_Tax"),
          primaryValue: inr(long.taxAmount),
          secondaryLabel: t("Tool_capital_gains_tax_LabelHolding"),
          secondaryValue: String(result.holdingThresholdMonths + 6),
          variant: "best",
        },
      ],
    };
  }, [asset, buyPrice, sellPrice, holdingMonths, taxSlab, exemption, t]);

  return (
    <ToolPageShell
      title={t(tool.titleKey)}
      subtitle={t("Tool_capital_gains_tax_Subtitle")}
      description={t(tool.descriptionKey)}
      icon={tool.icon}
      educate={
        <>
          <div className="fy-info-box">
            <strong>{t("Common_WhatYouLearn")}</strong>
            <p>{t("Tool_capital_gains_tax_LearnText")}</p>
          </div>
          <FormulaCard
            title={t("Common_Formula")}
            code={"Gain = Sell − Buy\nLTCG/STCG by holding & asset\nTax = taxable × rate"}
            note={t("Tool_capital_gains_tax_FormulaNote")}
          />
        </>
      }
      below={<ToolInfoPanel info={capitalGainsTaxInfo(t)} />}
    >
      <div className="fy-form-card">
        <h3>{t("Common_YourInputs")}</h3>
        <div className="fy-field">
          <label>{t("Tool_capital_gains_tax_LabelAsset")}</label>
          <select value={asset} onChange={(e) => setAsset(e.target.value as CapGainAsset)}>
            {ASSETS.map((a) => (
              <option key={a} value={a}>
                {t(`Tool_capital_gains_tax_Asset_${a}`)}
              </option>
            ))}
          </select>
        </div>
        <div className="fy-field">
          <label>{t("Tool_capital_gains_tax_LabelBuy")}</label>
          <input
            type="number"
            min={0}
            step={1000}
            inputMode="decimal"
            value={buyPrice}
            onChange={(e) => setBuyPrice(Math.max(0, Number(e.target.value) || 0))}
          />
        </div>
        <div className="fy-field">
          <label>{t("Tool_capital_gains_tax_LabelSell")}</label>
          <input
            type="number"
            min={0}
            step={1000}
            inputMode="decimal"
            value={sellPrice}
            onChange={(e) => setSellPrice(Math.max(0, Number(e.target.value) || 0))}
          />
        </div>
        <div className="fy-field">
          <label>{t("Tool_capital_gains_tax_LabelHolding")}</label>
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
          <label>{t("Tool_capital_gains_tax_LabelSlab")}</label>
          <select value={taxSlab} onChange={(e) => setTaxSlab(Number(e.target.value))}>
            <option value={5}>5%</option>
            <option value={10}>10%</option>
            <option value={20}>20%</option>
            <option value={30}>30%</option>
          </select>
        </div>
        <div className="fy-field">
          <label>{t("Tool_capital_gains_tax_LabelExemption")}</label>
          <input
            type="number"
            min={0}
            step={10000}
            inputMode="decimal"
            value={exemption}
            onChange={(e) => setExemption(Math.max(0, Number(e.target.value) || 0))}
          />
          <p className="fy-field-hint">{t("Tool_capital_gains_tax_ExemptionHint")}</p>
        </div>
        <button type="button" className="fy-btn-calc">
          {t("Common_Calculate")}
        </button>
      </div>

      <div className="fy-info-box fy-tax-verdict">
        <strong>{t("Tool_capital_gains_tax_StatusTitle")}</strong>
        <p>
          {detail.gain <= 0
            ? t("Tool_capital_gains_tax_Status_Loss")
            : t(
                "Tool_capital_gains_tax_Status_Body",
                detail.isLongTerm
                  ? t("Tool_capital_gains_tax_Result_Ltcg")
                  : t("Tool_capital_gains_tax_Result_Stcg"),
                inr(detail.ltcgExemptionUsed),
                inr(detail.exemptionApplied),
                inr(detail.taxAmount),
              )}
        </p>
      </div>

      <ResultSummaryCards cards={summaryCards} />
      <ScenarioCompare
        title={t("Tool_capital_gains_tax_ScenarioTitle")}
        subtitle={t("Tool_capital_gains_tax_ScenarioSubtitle")}
        scenarios={scenarios}
      />
      <WorkedExample
        title={t("Tool_capital_gains_tax_ExampleTitle")}
        subtitle={t("Tool_capital_gains_tax_ExampleSubtitle")}
        steps={exampleSteps}
      />
    </ToolPageShell>
  );
}
