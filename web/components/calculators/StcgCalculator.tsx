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
import { calculateStcg, type StcgAsset } from "@/lib/finance/stcg";
import { inr, percent } from "@/lib/finance/format";
import { getTool } from "@/lib/config/tools";
import { stcgInfo } from "@/lib/tool-page-content";

const ASSETS: StcgAsset[] = ["equity", "property"];

export function StcgCalculator() {
  const t = useT();
  const tool = getTool("stcg")!;

  const [asset, setAsset] = useState<StcgAsset>("equity");
  const [buyPrice, setBuyPrice] = useState(5_00_000);
  const [sellPrice, setSellPrice] = useState(6_50_000);
  const [holdingMonths, setHoldingMonths] = useState(8);
  const [taxSlab, setTaxSlab] = useState(30);

  const exampleSteps = useMemo(
    () => [
      t("Tool_stcg_ExampleStep_1"),
      t("Tool_stcg_ExampleStep_2"),
      t("Tool_stcg_ExampleStep_3"),
      t("Tool_stcg_ExampleStep_4"),
      t("Tool_stcg_ExampleStep_5"),
    ],
    [t],
  );

  const { summaryCards, scenarios } = useMemo(() => {
    const result = calculateStcg({
      asset,
      buyPrice,
      sellPrice,
      holdingMonths,
      taxSlabPercent: taxSlab,
    });

    return {
      summaryCards: [
        {
          label: t("Tool_stcg_Result_Gain"),
          value: inr(result.gain),
          footnote: t("Tool_stcg_Result_ShortTerm"),
          variant: "primary" as const,
        },
        {
          label: t("Tool_stcg_Result_Tax"),
          value: inr(result.taxAmount),
          footnote: t("Tool_stcg_Result_TaxFootnote", percent(result.taxRatePercent)),
          variant: "volatile" as const,
        },
        {
          label: t("Tool_stcg_Result_WaitSave"),
          value: inr(result.taxSavedByWaiting),
          footnote: t(
            "Tool_stcg_Result_WaitSaveFootnote",
            inr(result.ltcgTaxIfWaited),
          ),
          variant: "secure" as const,
        },
      ],
      scenarios: [
        {
          name: t("Tool_stcg_Scenario_SellNow"),
          primaryLabel: t("Tool_stcg_Result_Tax"),
          primaryValue: inr(result.taxAmount),
          secondaryLabel: t("Tool_stcg_LabelHolding"),
          secondaryValue: String(holdingMonths),
          variant: "worst" as const,
        },
        {
          name: t("Common_Scenario_Base"),
          primaryLabel: t("Tool_stcg_Result_Tax"),
          primaryValue: inr(result.taxAmount),
          secondaryLabel: t("Tool_stcg_Result_WaitSave"),
          secondaryValue: inr(result.taxSavedByWaiting),
          variant: "base" as const,
        },
        {
          name: t("Tool_stcg_Scenario_Wait"),
          primaryLabel: t("Tool_stcg_Result_Tax"),
          primaryValue: inr(result.ltcgTaxIfWaited),
          secondaryLabel: t("Tool_stcg_LabelHolding"),
          secondaryValue: String(result.holdingThresholdMonths + 1),
          variant: "best" as const,
        },
      ],
    };
  }, [asset, buyPrice, sellPrice, holdingMonths, taxSlab, t]);

  return (
    <ToolPageShell
      title={t(tool.titleKey)}
      subtitle={t("Tool_stcg_Subtitle")}
      description={t(tool.descriptionKey)}
      icon={tool.icon}
      educate={
        <>
          <div className="fy-info-box">
            <strong>{t("Common_WhatYouLearn")}</strong>
            <p>{t("Tool_stcg_LearnText")}</p>
          </div>
          <FormulaCard
            title={t("Common_Formula")}
            code={"gain = sell − buy\nequity STCG 20%\nproperty STCG at slab%"}
            note={t("Tool_stcg_FormulaNote")}
          />
        </>
      }
      below={<ToolInfoPanel info={stcgInfo(t)} />}
    >
      <div className="fy-form-card">
        <h3>{t("Common_YourInputs")}</h3>
        <div className="fy-field">
          <label>{t("Tool_stcg_LabelAsset")}</label>
          <select value={asset} onChange={(e) => setAsset(e.target.value as StcgAsset)}>
            {ASSETS.map((a) => (
              <option key={a} value={a}>
                {t(`Tool_stcg_Asset_${a === "equity" ? "Equity" : "Property"}`)}
              </option>
            ))}
          </select>
        </div>
        <div className="fy-field">
          <label>{t("Tool_stcg_LabelBuy")}</label>
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
          <label>{t("Tool_stcg_LabelSell")}</label>
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
          <label>{t("Tool_stcg_LabelHolding")}</label>
          <input
            type="number"
            min={0}
            step={1}
            inputMode="numeric"
            value={holdingMonths}
            onChange={(e) => setHoldingMonths(Math.max(0, Number(e.target.value) || 0))}
          />
          <p className="fy-field-hint">{t("Tool_stcg_HoldingHint")}</p>
        </div>
        <div className="fy-field">
          <label>{t("Tool_stcg_LabelSlab")}</label>
          <input
            type="number"
            min={0}
            max={42}
            step={1}
            inputMode="decimal"
            value={taxSlab}
            onChange={(e) => setTaxSlab(Math.max(0, Number(e.target.value) || 0))}
          />
          <p className="fy-field-hint">{t("Tool_stcg_SlabHint")}</p>
        </div>
        <button type="button" className="fy-btn-calc">
          {t("Common_Calculate")}
        </button>
      </div>

      <ResultSummaryCards cards={summaryCards} />
      <ScenarioCompare
        title={t("Tool_stcg_ScenarioTitle")}
        subtitle={t("Tool_stcg_ScenarioSubtitle")}
        scenarios={scenarios}
      />
      <WorkedExample
        title={t("Tool_stcg_ExampleTitle")}
        subtitle={t("Tool_stcg_ExampleSubtitle")}
        steps={exampleSteps}
      />
    </ToolPageShell>
  );
}
