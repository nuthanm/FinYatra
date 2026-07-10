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
  calculateGstHsnCode,
  GST_HSN_RATES,
  type GstHsnCategory,
} from "@/lib/finance/gstHsnCode";
import { inr, percent } from "@/lib/finance/format";
import { getTool } from "@/lib/config/tools";
import { gstHsnCodeInfo } from "@/lib/tool-page-content";

const CATEGORIES: GstHsnCategory[] = ["exempt", "five", "twelve", "eighteen", "twentyeight"];

export function GstHsnCodeCalculator() {
  const t = useT();
  const tool = getTool("gst-hsn-code")!;

  const [category, setCategory] = useState<GstHsnCategory>("eighteen");
  const [amount, setAmount] = useState(1_00_000);
  const [intraState, setIntraState] = useState(true);

  const exampleSteps = useMemo(
    () => [
      t("Tool_gst_hsn_code_ExampleStep_1"),
      t("Tool_gst_hsn_code_ExampleStep_2"),
      t("Tool_gst_hsn_code_ExampleStep_3"),
      t("Tool_gst_hsn_code_ExampleStep_4"),
      t("Tool_gst_hsn_code_ExampleStep_5"),
    ],
    [t],
  );

  const { summaryCards, scenarios } = useMemo(() => {
    const result = calculateGstHsnCode({
      category,
      taxableAmount: amount,
      intraState,
    });
    const five = calculateGstHsnCode({
      category: "five",
      taxableAmount: amount,
      intraState,
    });
    const twentyeight = calculateGstHsnCode({
      category: "twentyeight",
      taxableAmount: amount,
      intraState,
    });

    return {
      summaryCards: [
        {
          label: t("Tool_gst_hsn_code_Result_Gst"),
          value: inr(result.gstAmount),
          footnote: t("Tool_gst_hsn_code_Result_GstFootnote", percent(result.ratePercent)),
          variant: "primary" as const,
        },
        {
          label: t("Tool_gst_hsn_code_Result_Total"),
          value: inr(result.invoiceTotal),
          footnote: t("Tool_gst_hsn_code_Result_TotalFootnote"),
        },
        {
          label: intraState
            ? t("Tool_gst_hsn_code_Result_CgstSgst")
            : t("Tool_gst_hsn_code_Result_Igst"),
          value: intraState
            ? `${inr(result.cgst)} + ${inr(result.sgst)}`
            : inr(result.igst),
          footnote: t("Tool_gst_hsn_code_Result_SplitFootnote"),
          variant: "secure" as const,
        },
      ],
      scenarios: [
        {
          name: t("Tool_gst_hsn_code_Cat_Five"),
          primaryLabel: t("Tool_gst_hsn_code_Result_Gst"),
          primaryValue: inr(five.gstAmount),
          secondaryLabel: t("Tool_gst_hsn_code_Result_Total"),
          secondaryValue: inr(five.invoiceTotal),
          variant: "worst" as const,
        },
        {
          name: t("Common_Scenario_Base"),
          primaryLabel: t("Tool_gst_hsn_code_Result_Gst"),
          primaryValue: inr(result.gstAmount),
          secondaryLabel: t("Tool_gst_hsn_code_Result_Total"),
          secondaryValue: inr(result.invoiceTotal),
          variant: "base" as const,
        },
        {
          name: t("Tool_gst_hsn_code_Cat_Twentyeight"),
          primaryLabel: t("Tool_gst_hsn_code_Result_Gst"),
          primaryValue: inr(twentyeight.gstAmount),
          secondaryLabel: t("Tool_gst_hsn_code_Result_Total"),
          secondaryValue: inr(twentyeight.invoiceTotal),
          variant: "best" as const,
        },
      ],
    };
  }, [category, amount, intraState, t]);

  return (
    <ToolPageShell
      title={t(tool.titleKey)}
      subtitle={t("Tool_gst_hsn_code_Subtitle")}
      description={t(tool.descriptionKey)}
      icon={tool.icon}
      educate={
        <>
          <div className="fy-info-box">
            <strong>{t("Common_WhatYouLearn")}</strong>
            <p>{t("Tool_gst_hsn_code_LearnText")}</p>
          </div>
          <FormulaCard
            title={t("Common_Formula")}
            code={"Pick category → rate\nGST = amount × rate%\nCGST+SGST or IGST"}
            note={t("Tool_gst_hsn_code_FormulaNote")}
          />
        </>
      }
      below={<ToolInfoPanel info={gstHsnCodeInfo(t)} />}
    >
      <div className="fy-form-card">
        <h3>{t("Common_YourInputs")}</h3>
        <div className="fy-field">
          <label>{t("Tool_gst_hsn_code_LabelCategory")}</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as GstHsnCategory)}
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {t(
                  `Tool_gst_hsn_code_Cat_${c[0]!.toUpperCase()}${c.slice(1)}`,
                )}{" "}
                ({percent(GST_HSN_RATES[c])})
              </option>
            ))}
          </select>
        </div>
        <div className="fy-field">
          <label>{t("Tool_gst_hsn_code_LabelAmount")}</label>
          <input
            type="number"
            min={0}
            step={1000}
            inputMode="decimal"
            value={amount}
            onChange={(e) => setAmount(Math.max(0, Number(e.target.value) || 0))}
          />
        </div>
        <div className="fy-field">
          <label>{t("Tool_gst_hsn_code_LabelSupply")}</label>
          <select
            value={intraState ? "intra" : "inter"}
            onChange={(e) => setIntraState(e.target.value === "intra")}
          >
            <option value="intra">{t("Tool_gst_hsn_code_Supply_Intra")}</option>
            <option value="inter">{t("Tool_gst_hsn_code_Supply_Inter")}</option>
          </select>
        </div>
        <button type="button" className="fy-btn-calc">
          {t("Common_Calculate")}
        </button>
      </div>

      <ResultSummaryCards cards={summaryCards} />
      <ScenarioCompare
        title={t("Tool_gst_hsn_code_ScenarioTitle")}
        subtitle={t("Tool_gst_hsn_code_ScenarioSubtitle")}
        scenarios={scenarios}
      />
      <WorkedExample
        title={t("Tool_gst_hsn_code_ExampleTitle")}
        subtitle={t("Tool_gst_hsn_code_ExampleSubtitle")}
        steps={exampleSteps}
      />
    </ToolPageShell>
  );
}
