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
import { calculateGst, type GstMode, type GstRate, type GstSupply } from "@/lib/finance/gst";
import { inr, percent } from "@/lib/finance/format";
import { getTool } from "@/lib/config/tools";
import { gstInfo } from "@/lib/tool-page-content";

const RATES: GstRate[] = [0, 5, 12, 18, 28];

export function GstCalculator() {
  const t = useT();
  const tool = getTool("gst")!;

  const [amount, setAmount] = useState(10_000);
  const [rate, setRate] = useState<GstRate>(18);
  const [mode, setMode] = useState<GstMode>("exclusive");
  const [supply, setSupply] = useState<GstSupply>("intra");

  const exampleSteps = useMemo(
    () => [
      t("Tool_gst_ExampleStep_1"),
      t("Tool_gst_ExampleStep_2"),
      t("Tool_gst_ExampleStep_3"),
      t("Tool_gst_ExampleStep_4"),
      t("Tool_gst_ExampleStep_5"),
    ],
    [t],
  );

  const { summaryCards, scenarios } = useMemo(() => {
    const result = calculateGst(Math.max(0, amount), rate, mode, supply);
    const at12 = calculateGst(Math.max(0, amount), 12, mode, supply);
    const at28 = calculateGst(Math.max(0, amount), 28, mode, supply);

    return {
      summaryCards: [
        {
          label: t("Tool_gst_Result_Base"),
          value: inr(result.baseAmount, 2),
          footnote: t("Tool_gst_Result_BaseFootnote"),
        },
        {
          label: t("Tool_gst_Result_Gst"),
          value: inr(result.gstAmount, 2),
          footnote: t("Tool_gst_Result_GstFootnote", percent(rate, 0)),
          variant: "primary" as const,
        },
        {
          label: t("Tool_gst_Result_Total"),
          value: inr(result.totalAmount, 2),
          footnote:
            supply === "intra"
              ? t("Tool_gst_Result_SplitIntra", inr(result.cgst, 2), inr(result.sgst, 2))
              : t("Tool_gst_Result_SplitInter", inr(result.igst, 2)),
          variant: "secure" as const,
        },
      ],
      scenarios: [
        {
          name: t("Tool_gst_Scenario_12"),
          primaryLabel: t("Tool_gst_Result_Total"),
          primaryValue: inr(at12.totalAmount, 2),
          secondaryLabel: t("Tool_gst_Result_Gst"),
          secondaryValue: inr(at12.gstAmount, 2),
          variant: "worst",
        },
        {
          name: t("Common_Scenario_Base"),
          primaryLabel: t("Tool_gst_Result_Total"),
          primaryValue: inr(result.totalAmount, 2),
          secondaryLabel: t("Common_Label_Return"),
          secondaryValue: percent(rate, 0),
          variant: "base",
        },
        {
          name: t("Tool_gst_Scenario_28"),
          primaryLabel: t("Tool_gst_Result_Total"),
          primaryValue: inr(at28.totalAmount, 2),
          secondaryLabel: t("Tool_gst_Result_Gst"),
          secondaryValue: inr(at28.gstAmount, 2),
          variant: "best",
        },
      ],
    };
  }, [amount, rate, mode, supply, t]);

  return (
    <ToolPageShell
      title={t(tool.titleKey)}
      subtitle={t("Tool_gst_Subtitle")}
      description={t(tool.descriptionKey)}
      icon={tool.icon}
      educate={
        <>
          <div className="fy-info-box">
            <strong>{t("Common_WhatYouLearn")}</strong>
            <p>{t("Tool_gst_LearnText")}</p>
          </div>
          <FormulaCard
            title={t("Common_Formula")}
            code={"Exclusive: GST = amount × rate\nInclusive: GST = amount × rate / (100 + rate)"}
            note={t("Tool_gst_FormulaNote")}
          />
        </>
      }
      below={<ToolInfoPanel info={gstInfo(t)} />}
    >
      <div className="fy-form-card">
        <h3>{t("Common_YourInputs")}</h3>
        <div className="fy-field">
          <label>{t("Tool_gst_LabelAmount")}</label>
          <input
            type="number"
            min={0}
            step={1}
            inputMode="decimal"
            value={amount}
            onChange={(e) => setAmount(Math.max(0, Number(e.target.value) || 0))}
          />
        </div>
        <div className="fy-field">
          <label>{t("Tool_gst_LabelRate")}</label>
          <select value={rate} onChange={(e) => setRate(Number(e.target.value) as GstRate)}>
            {RATES.map((r) => (
              <option key={r} value={r}>
                {r}%
              </option>
            ))}
          </select>
        </div>
        <div className="fy-field">
          <label>{t("Tool_gst_LabelMode")}</label>
          <select value={mode} onChange={(e) => setMode(e.target.value as GstMode)}>
            <option value="exclusive">{t("Tool_gst_Mode_Exclusive")}</option>
            <option value="inclusive">{t("Tool_gst_Mode_Inclusive")}</option>
          </select>
        </div>
        <div className="fy-field">
          <label>{t("Tool_gst_LabelSupply")}</label>
          <select value={supply} onChange={(e) => setSupply(e.target.value as GstSupply)}>
            <option value="intra">{t("Tool_gst_Supply_Intra")}</option>
            <option value="inter">{t("Tool_gst_Supply_Inter")}</option>
          </select>
          <p className="fy-field-hint">{t("Tool_gst_SupplyHint")}</p>
        </div>
        <button type="button" className="fy-btn-calc">
          {t("Common_Calculate")}
        </button>
      </div>

      <ResultSummaryCards cards={summaryCards} />
      <ScenarioCompare title={t("Tool_gst_ScenarioTitle")} subtitle={t("Tool_gst_ScenarioSubtitle")} scenarios={scenarios} />
      <WorkedExample title={t("Tool_gst_ExampleTitle")} subtitle={t("Tool_gst_ExampleSubtitle")} steps={exampleSteps} />
    </ToolPageShell>
  );
}
