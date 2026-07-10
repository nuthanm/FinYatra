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
import { calculateLtcg, type LtcgAsset } from "@/lib/finance/ltcg";
import { inr, percent } from "@/lib/finance/format";
import { getTool } from "@/lib/config/tools";
import { ltcgInfo } from "@/lib/tool-page-content";

const ASSETS: LtcgAsset[] = ["equity", "property"];

export function LtcgCalculator() {
  const t = useT();
  const tool = getTool("ltcg")!;

  const [asset, setAsset] = useState<LtcgAsset>("equity");
  const [buyPrice, setBuyPrice] = useState(5_00_000);
  const [sellPrice, setSellPrice] = useState(8_00_000);
  const [holdingMonths, setHoldingMonths] = useState(18);
  const [exemption, setExemption] = useState(0);

  const exampleSteps = useMemo(
    () => [
      t("Tool_ltcg_ExampleStep_1"),
      t("Tool_ltcg_ExampleStep_2"),
      t("Tool_ltcg_ExampleStep_3"),
      t("Tool_ltcg_ExampleStep_4"),
      t("Tool_ltcg_ExampleStep_5"),
    ],
    [t],
  );

  const { summaryCards, scenarios } = useMemo(() => {
    const result = calculateLtcg({
      asset,
      buyPrice,
      sellPrice,
      holdingMonths,
      exemptionAmount: exemption,
    });
    const noExempt = calculateLtcg({
      asset,
      buyPrice,
      sellPrice,
      holdingMonths,
      exemptionAmount: 0,
    });
    const withExempt = calculateLtcg({
      asset,
      buyPrice,
      sellPrice,
      holdingMonths,
      exemptionAmount: Math.max(exemption, Math.round(result.gain * 0.3)),
    });

    return {
      summaryCards: [
        {
          label: t("Tool_ltcg_Result_Gain"),
          value: inr(result.gain),
          footnote: result.belowThreshold
            ? t("Tool_ltcg_Result_BelowThreshold")
            : t("Tool_ltcg_Result_LongTerm"),
          variant: "primary" as const,
        },
        {
          label: t("Tool_ltcg_Result_Taxable"),
          value: inr(result.taxableGain),
          footnote: t(
            "Tool_ltcg_Result_TaxableFootnote",
            inr(result.ltcgExemptionUsed),
          ),
        },
        {
          label: t("Tool_ltcg_Result_Tax"),
          value: inr(result.taxAmount),
          footnote: t("Tool_ltcg_Result_TaxFootnote", percent(result.taxRatePercent)),
          variant: "volatile" as const,
        },
      ],
      scenarios: [
        {
          name: t("Tool_ltcg_Scenario_NoExempt"),
          primaryLabel: t("Tool_ltcg_Result_Tax"),
          primaryValue: inr(noExempt.taxAmount),
          secondaryLabel: t("Tool_ltcg_Result_Taxable"),
          secondaryValue: inr(noExempt.taxableGain),
          variant: "worst" as const,
        },
        {
          name: t("Common_Scenario_Base"),
          primaryLabel: t("Tool_ltcg_Result_Tax"),
          primaryValue: inr(result.taxAmount),
          secondaryLabel: t("Tool_ltcg_Result_Taxable"),
          secondaryValue: inr(result.taxableGain),
          variant: "base" as const,
        },
        {
          name: t("Tool_ltcg_Scenario_Exempt"),
          primaryLabel: t("Tool_ltcg_Result_Tax"),
          primaryValue: inr(withExempt.taxAmount),
          secondaryLabel: t("Tool_ltcg_Result_Taxable"),
          secondaryValue: inr(withExempt.taxableGain),
          variant: "best" as const,
        },
      ],
    };
  }, [asset, buyPrice, sellPrice, holdingMonths, exemption, t]);

  return (
    <ToolPageShell
      title={t(tool.titleKey)}
      subtitle={t("Tool_ltcg_Subtitle")}
      description={t(tool.descriptionKey)}
      icon={tool.icon}
      educate={
        <>
          <div className="fy-info-box">
            <strong>{t("Common_WhatYouLearn")}</strong>
            <p>{t("Tool_ltcg_LearnText")}</p>
          </div>
          <FormulaCard
            title={t("Common_Formula")}
            code={
              "gain = sell − buy\nequity: −₹1.25L then 12.5%\nproperty: 12.5% (−54/54EC)"
            }
            note={t("Tool_ltcg_FormulaNote")}
          />
        </>
      }
      below={<ToolInfoPanel info={ltcgInfo(t)} />}
    >
      <div className="fy-form-card">
        <h3>{t("Common_YourInputs")}</h3>
        <div className="fy-field">
          <label>{t("Tool_ltcg_LabelAsset")}</label>
          <select value={asset} onChange={(e) => setAsset(e.target.value as LtcgAsset)}>
            {ASSETS.map((a) => (
              <option key={a} value={a}>
                {t(`Tool_ltcg_Asset_${a === "equity" ? "Equity" : "Property"}`)}
              </option>
            ))}
          </select>
        </div>
        <div className="fy-field">
          <label>{t("Tool_ltcg_LabelBuy")}</label>
          <input
            type="number"
            min={0}
            step={10000}
            inputMode="decimal"
            value={buyPrice}
            onChange={(e) => setBuyPrice(Math.max(0, Number(e.target.value) || 0))}
          />
        </div>
        <div className="fy-field">
          <label>{t("Tool_ltcg_LabelSell")}</label>
          <input
            type="number"
            min={0}
            step={10000}
            inputMode="decimal"
            value={sellPrice}
            onChange={(e) => setSellPrice(Math.max(0, Number(e.target.value) || 0))}
          />
        </div>
        <div className="fy-field">
          <label>{t("Tool_ltcg_LabelHolding")}</label>
          <input
            type="number"
            min={0}
            step={1}
            inputMode="numeric"
            value={holdingMonths}
            onChange={(e) => setHoldingMonths(Math.max(0, Number(e.target.value) || 0))}
          />
          <p className="fy-field-hint">{t("Tool_ltcg_HoldingHint")}</p>
        </div>
        <div className="fy-field">
          <label>{t("Tool_ltcg_LabelExemption")}</label>
          <input
            type="number"
            min={0}
            step={10000}
            inputMode="decimal"
            value={exemption}
            onChange={(e) => setExemption(Math.max(0, Number(e.target.value) || 0))}
          />
          <p className="fy-field-hint">{t("Tool_ltcg_ExemptionHint")}</p>
        </div>
        <button type="button" className="fy-btn-calc">
          {t("Common_Calculate")}
        </button>
      </div>

      <ResultSummaryCards cards={summaryCards} />
      <ScenarioCompare
        title={t("Tool_ltcg_ScenarioTitle")}
        subtitle={t("Tool_ltcg_ScenarioSubtitle")}
        scenarios={scenarios}
      />
      <WorkedExample
        title={t("Tool_ltcg_ExampleTitle")}
        subtitle={t("Tool_ltcg_ExampleSubtitle")}
        steps={exampleSteps}
      />
    </ToolPageShell>
  );
}
