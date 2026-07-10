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
import { calculateGstItc } from "@/lib/finance/gstItc";
import { inr } from "@/lib/finance/format";
import { getTool } from "@/lib/config/tools";
import { gstItcInfo } from "@/lib/tool-page-content";

export function GstItcCalculator() {
  const t = useT();
  const tool = getTool("gst-itc")!;

  const [outwardTax, setOutwardTax] = useState(1_80_000);
  const [itcAvailable, setItcAvailable] = useState(1_20_000);

  const exampleSteps = useMemo(
    () => [
      t("Tool_gst_itc_ExampleStep_1"),
      t("Tool_gst_itc_ExampleStep_2"),
      t("Tool_gst_itc_ExampleStep_3"),
      t("Tool_gst_itc_ExampleStep_4"),
      t("Tool_gst_itc_ExampleStep_5"),
    ],
    [t],
  );

  const { summaryCards, scenarios } = useMemo(() => {
    const result = calculateGstItc({ outwardTax, itcAvailable });
    const lowerItc = calculateGstItc({
      outwardTax,
      itcAvailable: Math.max(0, itcAvailable - 30_000),
    });
    const higherItc = calculateGstItc({
      outwardTax,
      itcAvailable: itcAvailable + 30_000,
    });

    const statusKey =
      result.status === "nil"
        ? "Tool_gst_itc_Result_StatusNil"
        : result.status === "payable"
          ? "Tool_gst_itc_Result_StatusPayable"
          : "Tool_gst_itc_Result_StatusCredit";

    return {
      summaryCards: [
        {
          label: t("Tool_gst_itc_Result_NetPayable"),
          value: inr(result.netPayable),
          footnote: t(statusKey),
          variant: result.status === "payable" ? ("volatile" as const) : ("primary" as const),
        },
        {
          label: t("Tool_gst_itc_Result_Outward"),
          value: inr(result.outwardTax),
          footnote: t("Tool_gst_itc_Result_OutwardFootnote"),
        },
        {
          label: t("Tool_gst_itc_Result_Itc"),
          value: inr(result.itcAvailable),
          footnote:
            result.excessItc > 0
              ? t("Tool_gst_itc_Result_ExcessFootnote", inr(result.excessItc))
              : t("Tool_gst_itc_Result_ItcFootnote"),
          variant: "secure" as const,
        },
      ],
      scenarios: [
        {
          name: t("Tool_gst_itc_Scenario_LowerItc"),
          primaryLabel: t("Tool_gst_itc_Result_NetPayable"),
          primaryValue: inr(lowerItc.netPayable),
          secondaryLabel: t("Tool_gst_itc_Result_Itc"),
          secondaryValue: inr(lowerItc.itcAvailable),
          variant: "worst" as const,
        },
        {
          name: t("Common_Scenario_Base"),
          primaryLabel: t("Tool_gst_itc_Result_NetPayable"),
          primaryValue: inr(result.netPayable),
          secondaryLabel: t("Tool_gst_itc_Result_Outward"),
          secondaryValue: inr(result.outwardTax),
          variant: "base" as const,
        },
        {
          name: t("Tool_gst_itc_Scenario_HigherItc"),
          primaryLabel: t("Tool_gst_itc_Result_NetPayable"),
          primaryValue: inr(higherItc.netPayable),
          secondaryLabel: t("Tool_gst_itc_Result_Itc"),
          secondaryValue: inr(higherItc.itcAvailable),
          variant: "best" as const,
        },
      ],
    };
  }, [outwardTax, itcAvailable, t]);

  return (
    <ToolPageShell
      title={t(tool.titleKey)}
      subtitle={t("Tool_gst_itc_Subtitle")}
      description={t(tool.descriptionKey)}
      icon={tool.icon}
      educate={
        <>
          <div className="fy-info-box">
            <strong>{t("Common_WhatYouLearn")}</strong>
            <p>{t("Tool_gst_itc_LearnText")}</p>
          </div>
          <FormulaCard
            title={t("Common_Formula")}
            code={"net payable = max(0, outward − ITC)\nexcess ITC = max(0, ITC − outward)"}
            note={t("Tool_gst_itc_FormulaNote")}
          />
        </>
      }
      below={<ToolInfoPanel info={gstItcInfo(t)} />}
    >
      <div className="fy-form-card">
        <h3>{t("Common_YourInputs")}</h3>
        <div className="fy-field">
          <label>{t("Tool_gst_itc_LabelOutward")}</label>
          <input
            type="number"
            min={0}
            step={1000}
            inputMode="decimal"
            value={outwardTax}
            onChange={(e) => setOutwardTax(Math.max(0, Number(e.target.value) || 0))}
          />
        </div>
        <div className="fy-field">
          <label>{t("Tool_gst_itc_LabelItc")}</label>
          <input
            type="number"
            min={0}
            step={1000}
            inputMode="decimal"
            value={itcAvailable}
            onChange={(e) => setItcAvailable(Math.max(0, Number(e.target.value) || 0))}
          />
          <p className="fy-field-hint">{t("Tool_gst_itc_ItcHint")}</p>
        </div>
        <button type="button" className="fy-btn-calc">
          {t("Common_Calculate")}
        </button>
      </div>

      <ResultSummaryCards cards={summaryCards} />
      <ScenarioCompare
        title={t("Tool_gst_itc_ScenarioTitle")}
        subtitle={t("Tool_gst_itc_ScenarioSubtitle")}
        scenarios={scenarios}
      />
      <WorkedExample
        title={t("Tool_gst_itc_ExampleTitle")}
        subtitle={t("Tool_gst_itc_ExampleSubtitle")}
        steps={exampleSteps}
      />
    </ToolPageShell>
  );
}
