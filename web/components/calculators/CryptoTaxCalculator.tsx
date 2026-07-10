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
  calculateCryptoTax,
  CRYPTO_TAX_RATE_PERCENT,
  CRYPTO_TDS_RATE_PERCENT,
  CRYPTO_TDS_THRESHOLD,
} from "@/lib/finance/cryptoTax";
import { inr, percent } from "@/lib/finance/format";
import { getTool } from "@/lib/config/tools";
import { cryptoTaxInfo } from "@/lib/tool-page-content";

export function CryptoTaxCalculator() {
  const t = useT();
  const tool = getTool("crypto-tax")!;

  const [buyValue, setBuyValue] = useState(100_000);
  const [sellValue, setSellValue] = useState(150_000);
  const [includeTds, setIncludeTds] = useState(true);

  const exampleSteps = useMemo(
    () => [
      t("Tool_crypto_tax_ExampleStep_1"),
      t("Tool_crypto_tax_ExampleStep_2"),
      t("Tool_crypto_tax_ExampleStep_3"),
      t("Tool_crypto_tax_ExampleStep_4"),
      t("Tool_crypto_tax_ExampleStep_5"),
    ],
    [t],
  );

  const { summaryCards, scenarios, detail } = useMemo(() => {
    const result = calculateCryptoTax({ buyValue, sellValue, includeTds });
    const higherGain = calculateCryptoTax({
      buyValue,
      sellValue: sellValue * 1.25,
      includeTds,
    });
    const noTds = calculateCryptoTax({ buyValue, sellValue, includeTds: false });

    return {
      detail: result,
      summaryCards: [
        {
          label: t("Tool_crypto_tax_Result_Gain"),
          value: inr(result.gain),
          footnote: result.isLoss
            ? t("Tool_crypto_tax_Result_LossNote")
            : t("Tool_crypto_tax_Result_GainFootnote"),
          variant: "primary" as const,
        },
        {
          label: t("Tool_crypto_tax_Result_Tax"),
          value: inr(result.taxAmount),
          footnote: t("Tool_crypto_tax_Result_TaxFootnote", percent(result.taxRatePercent)),
          variant: "volatile" as const,
        },
        {
          label: t("Tool_crypto_tax_Result_Tds"),
          value: inr(result.tdsAmount),
          footnote: result.tdsApplies
            ? t("Tool_crypto_tax_Result_TdsFootnote", percent(CRYPTO_TDS_RATE_PERCENT))
            : t("Tool_crypto_tax_Result_TdsSkipped"),
        },
      ],
      scenarios: [
        {
          name: t("Tool_crypto_tax_Scenario_NoTds"),
          primaryLabel: t("Tool_crypto_tax_Result_Tax"),
          primaryValue: inr(noTds.taxAmount),
          secondaryLabel: t("Tool_crypto_tax_Result_Tds"),
          secondaryValue: inr(noTds.tdsAmount),
          variant: "best",
        },
        {
          name: t("Common_Scenario_Base"),
          primaryLabel: t("Tool_crypto_tax_Result_Tax"),
          primaryValue: inr(result.taxAmount),
          secondaryLabel: t("Tool_crypto_tax_Result_Tds"),
          secondaryValue: inr(result.tdsAmount),
          variant: "base",
        },
        {
          name: t("Tool_crypto_tax_Scenario_Higher"),
          primaryLabel: t("Tool_crypto_tax_Result_Tax"),
          primaryValue: inr(higherGain.taxAmount),
          secondaryLabel: t("Tool_crypto_tax_Result_Gain"),
          secondaryValue: inr(higherGain.gain),
          variant: "worst",
        },
      ],
    };
  }, [buyValue, sellValue, includeTds, t]);

  return (
    <ToolPageShell
      title={t(tool.titleKey)}
      subtitle={t("Tool_crypto_tax_Subtitle")}
      description={t(tool.descriptionKey)}
      icon={tool.icon}
      educate={
        <>
          <div className="fy-info-box">
            <strong>{t("Common_WhatYouLearn")}</strong>
            <p>{t("Tool_crypto_tax_LearnText")}</p>
          </div>
          <FormulaCard
            title={t("Common_Formula")}
            code={"Gain = Sell − Buy\nTax = max(0, Gain) × 30%\nTDS ≈ 1% of Sell (if above threshold)"}
            note={t("Tool_crypto_tax_FormulaNote")}
          />
        </>
      }
      below={<ToolInfoPanel info={cryptoTaxInfo(t)} />}
    >
      <div className="fy-form-card">
        <h3>{t("Common_YourInputs")}</h3>
        <div className="fy-field">
          <label>{t("Tool_crypto_tax_LabelBuy")}</label>
          <input
            type="number"
            min={0}
            step={1000}
            inputMode="decimal"
            value={buyValue}
            onChange={(e) => setBuyValue(Math.max(0, Number(e.target.value) || 0))}
          />
        </div>
        <div className="fy-field">
          <label>{t("Tool_crypto_tax_LabelSell")}</label>
          <input
            type="number"
            min={0}
            step={1000}
            inputMode="decimal"
            value={sellValue}
            onChange={(e) => setSellValue(Math.max(0, Number(e.target.value) || 0))}
          />
        </div>
        <div className="fy-field">
          <label>
            <input
              type="checkbox"
              checked={includeTds}
              onChange={(e) => setIncludeTds(e.target.checked)}
            />{" "}
            {t("Tool_crypto_tax_LabelTds")}
          </label>
          <p className="fy-field-hint">
            {t("Tool_crypto_tax_TdsHint", inr(CRYPTO_TDS_THRESHOLD), percent(CRYPTO_TDS_RATE_PERCENT))}
          </p>
        </div>
        <button type="button" className="fy-btn-calc">
          {t("Common_Calculate")}
        </button>
      </div>

      <div className="fy-info-box fy-tax-verdict">
        <strong>{t("Tool_crypto_tax_StatusTitle")}</strong>
        <p>
          {detail.isLoss
            ? t("Tool_crypto_tax_Status_Loss")
            : t(
                "Tool_crypto_tax_Status_Body",
                inr(detail.taxableGain),
                percent(CRYPTO_TAX_RATE_PERCENT),
                inr(detail.taxAmount),
                inr(detail.tdsAmount),
              )}
        </p>
      </div>

      <ResultSummaryCards cards={summaryCards} />
      <ScenarioCompare
        title={t("Tool_crypto_tax_ScenarioTitle")}
        subtitle={t("Tool_crypto_tax_ScenarioSubtitle")}
        scenarios={scenarios}
      />
      <WorkedExample
        title={t("Tool_crypto_tax_ExampleTitle")}
        subtitle={t("Tool_crypto_tax_ExampleSubtitle")}
        steps={exampleSteps}
      />
    </ToolPageShell>
  );
}
