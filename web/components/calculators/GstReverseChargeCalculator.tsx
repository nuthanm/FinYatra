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
  calculateGstReverseCharge,
  type GstReverseChargeSupply,
} from "@/lib/finance/gstReverseCharge";
import { inr, percent } from "@/lib/finance/format";
import { getTool } from "@/lib/config/tools";
import { gstReverseChargeInfo } from "@/lib/tool-page-content";

export function GstReverseChargeCalculator() {
  const t = useT();
  const tool = getTool("gst-reverse-charge")!;

  const [taxableValue, setTaxableValue] = useState(100_000);
  const [gstRatePercent, setGstRatePercent] = useState(18);
  const [supply, setSupply] = useState<GstReverseChargeSupply>("intra");

  const exampleSteps = useMemo(
    () => [
      t("Tool_gst_reverse_charge_ExampleStep_1"),
      t("Tool_gst_reverse_charge_ExampleStep_2"),
      t("Tool_gst_reverse_charge_ExampleStep_3"),
      t("Tool_gst_reverse_charge_ExampleStep_4"),
      t("Tool_gst_reverse_charge_ExampleStep_5"),
    ],
    [t],
  );

  const { summaryCards, scenarios, detail } = useMemo(() => {
    const result = calculateGstReverseCharge({ taxableValue, gstRatePercent, supply });
    const rate12 = calculateGstReverseCharge({ taxableValue, gstRatePercent: 12, supply });
    const rate5 = calculateGstReverseCharge({ taxableValue, gstRatePercent: 5, supply });
    const inter = calculateGstReverseCharge({
      taxableValue,
      gstRatePercent,
      supply: "inter",
    });

    return {
      detail: result,
      summaryCards: [
        {
          label: t("Tool_gst_reverse_charge_Result_Total"),
          value: inr(result.totalGst),
          footnote: t("Tool_gst_reverse_charge_Result_TotalFootnote", percent(gstRatePercent)),
          variant: "primary" as const,
        },
        {
          label:
            supply === "inter"
              ? t("Tool_gst_reverse_charge_Result_Igst")
              : t("Tool_gst_reverse_charge_Result_CgstSgst"),
          value:
            supply === "inter"
              ? inr(result.igst)
              : `${inr(result.cgst)} + ${inr(result.sgst)}`,
          footnote:
            supply === "inter"
              ? t("Tool_gst_reverse_charge_Result_IgstFootnote")
              : t("Tool_gst_reverse_charge_Result_SplitFootnote"),
        },
        {
          label: t("Tool_gst_reverse_charge_Result_Value"),
          value: inr(result.taxableValue),
          footnote: t("Tool_gst_reverse_charge_Result_ItcNote"),
          variant: "secure" as const,
        },
      ],
      scenarios: [
        {
          name: t("Tool_gst_reverse_charge_Scenario_5"),
          primaryLabel: t("Tool_gst_reverse_charge_Result_Total"),
          primaryValue: inr(rate5.totalGst),
          secondaryLabel: t("Tool_gst_reverse_charge_LabelRate"),
          secondaryValue: percent(5),
          variant: "best" as const,
        },
        {
          name: t("Tool_gst_reverse_charge_Scenario_12"),
          primaryLabel: t("Tool_gst_reverse_charge_Result_Total"),
          primaryValue: inr(rate12.totalGst),
          secondaryLabel: t("Tool_gst_reverse_charge_LabelRate"),
          secondaryValue: percent(12),
          variant: "base" as const,
        },
        {
          name: t("Tool_gst_reverse_charge_Scenario_Inter"),
          primaryLabel: t("Tool_gst_reverse_charge_Result_Igst"),
          primaryValue: inr(inter.igst),
          secondaryLabel: t("Tool_gst_reverse_charge_Result_Total"),
          secondaryValue: inr(inter.totalGst),
          variant: "worst" as const,
        },
      ],
    };
  }, [taxableValue, gstRatePercent, supply, t]);

  return (
    <ToolPageShell
      title={t(tool.titleKey)}
      subtitle={t("Tool_gst_reverse_charge_Subtitle")}
      description={t(tool.descriptionKey)}
      icon={tool.icon}
      educate={
        <>
          <div className="fy-info-box">
            <strong>{t("Common_WhatYouLearn")}</strong>
            <p>{t("Tool_gst_reverse_charge_LearnText")}</p>
          </div>
          <FormulaCard
            title={t("Common_Formula")}
            code={"RCM GST = value × rate%\nIntra: CGST = SGST = half\nInter: IGST = full"}
            note={t("Tool_gst_reverse_charge_FormulaNote")}
          />
        </>
      }
      below={<ToolInfoPanel info={gstReverseChargeInfo(t)} />}
    >
      <div className="fy-form-card">
        <h3>{t("Common_YourInputs")}</h3>
        <div className="fy-field">
          <label>{t("Tool_gst_reverse_charge_LabelValue")}</label>
          <input
            type="number"
            min={0}
            step={1000}
            inputMode="decimal"
            value={taxableValue}
            onChange={(e) => setTaxableValue(Math.max(0, Number(e.target.value) || 0))}
          />
        </div>
        <div className="fy-field">
          <label>{t("Tool_gst_reverse_charge_LabelRate")}</label>
          <input
            type="number"
            min={0}
            max={40}
            step={1}
            inputMode="decimal"
            value={gstRatePercent}
            onChange={(e) => setGstRatePercent(Math.max(0, Number(e.target.value) || 0))}
          />
        </div>
        <div className="fy-field">
          <label>{t("Tool_gst_reverse_charge_LabelSupply")}</label>
          <select
            value={supply}
            onChange={(e) => setSupply(e.target.value as GstReverseChargeSupply)}
          >
            <option value="intra">{t("Tool_gst_reverse_charge_Supply_intra")}</option>
            <option value="inter">{t("Tool_gst_reverse_charge_Supply_inter")}</option>
          </select>
        </div>
        <button type="button" className="fy-btn-calc">
          {t("Common_Calculate")}
        </button>
      </div>

      <ResultSummaryCards cards={summaryCards} />
      <div className="fy-info-box">
        <strong>{t("Tool_gst_reverse_charge_VerdictTitle")}</strong>
        <p>
          {t(
            "Tool_gst_reverse_charge_VerdictNote",
            inr(detail.totalGst),
            supply === "inter" ? inr(detail.igst) : `${inr(detail.cgst)} / ${inr(detail.sgst)}`,
          )}
        </p>
      </div>
      <ScenarioCompare
        title={t("Tool_gst_reverse_charge_ScenarioTitle")}
        subtitle={t("Tool_gst_reverse_charge_ScenarioSubtitle")}
        scenarios={scenarios}
      />
      <WorkedExample
        title={t("Tool_gst_reverse_charge_ExampleTitle")}
        subtitle={t("Tool_gst_reverse_charge_ExampleSubtitle")}
        steps={exampleSteps}
      />
    </ToolPageShell>
  );
}
