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
  calculateGstRegistrationThreshold,
  type GstRegistrationCategory,
} from "@/lib/finance/gstRegistrationThreshold";
import { inr } from "@/lib/finance/format";
import { getTool } from "@/lib/config/tools";
import { gstRegistrationThresholdInfo } from "@/lib/tool-page-content";

export function GstRegistrationThresholdCalculator() {
  const t = useT();
  const tool = getTool("gst-registration-threshold")!;

  const [annualTurnover, setAnnualTurnover] = useState(25_00_000);
  const [category, setCategory] = useState<GstRegistrationCategory>("services");

  const exampleSteps = useMemo(
    () => [
      t("Tool_gst_registration_threshold_ExampleStep_1"),
      t("Tool_gst_registration_threshold_ExampleStep_2"),
      t("Tool_gst_registration_threshold_ExampleStep_3"),
      t("Tool_gst_registration_threshold_ExampleStep_4"),
      t("Tool_gst_registration_threshold_ExampleStep_5"),
    ],
    [t],
  );

  const { summaryCards, scenarios } = useMemo(() => {
    const result = calculateGstRegistrationThreshold({ annualTurnover, category });
    const asGoods = calculateGstRegistrationThreshold({ annualTurnover, category: "goods" });
    const asSpecial = calculateGstRegistrationThreshold({
      annualTurnover,
      category: "special_category",
    });

    return {
      summaryCards: [
        {
          label: t("Tool_gst_registration_threshold_Result_Needed"),
          value: result.registrationNeeded
            ? t("Tool_gst_registration_threshold_Needed_Yes")
            : t("Tool_gst_registration_threshold_Needed_No"),
          footnote: t(
            "Tool_gst_registration_threshold_Result_NeededFootnote",
            result.thresholdLabel,
            inr(result.threshold),
          ),
          variant: result.registrationNeeded ? ("volatile" as const) : ("secure" as const),
        },
        {
          label: t("Tool_gst_registration_threshold_Result_Threshold"),
          value: inr(result.threshold),
          footnote: t("Tool_gst_registration_threshold_Result_ThresholdFootnote"),
          variant: "primary" as const,
        },
        {
          label: t("Tool_gst_registration_threshold_Result_Gap"),
          value: inr(Math.abs(result.gapToThreshold)),
          footnote:
            result.gapToThreshold > 0
              ? t("Tool_gst_registration_threshold_Result_GapAbove")
              : t("Tool_gst_registration_threshold_Result_GapBelow"),
        },
      ],
      scenarios: [
        {
          name: t("Tool_gst_registration_threshold_Scenario_Special"),
          primaryLabel: t("Tool_gst_registration_threshold_Result_Needed"),
          primaryValue: asSpecial.registrationNeeded
            ? t("Tool_gst_registration_threshold_Needed_Yes")
            : t("Tool_gst_registration_threshold_Needed_No"),
          secondaryLabel: t("Tool_gst_registration_threshold_Result_Threshold"),
          secondaryValue: inr(asSpecial.threshold),
          variant: "worst" as const,
        },
        {
          name: t("Common_Scenario_Base"),
          primaryLabel: t("Tool_gst_registration_threshold_Result_Needed"),
          primaryValue: result.registrationNeeded
            ? t("Tool_gst_registration_threshold_Needed_Yes")
            : t("Tool_gst_registration_threshold_Needed_No"),
          secondaryLabel: t("Tool_gst_registration_threshold_Result_Threshold"),
          secondaryValue: inr(result.threshold),
          variant: "base" as const,
        },
        {
          name: t("Tool_gst_registration_threshold_Scenario_Goods"),
          primaryLabel: t("Tool_gst_registration_threshold_Result_Needed"),
          primaryValue: asGoods.registrationNeeded
            ? t("Tool_gst_registration_threshold_Needed_Yes")
            : t("Tool_gst_registration_threshold_Needed_No"),
          secondaryLabel: t("Tool_gst_registration_threshold_Result_Threshold"),
          secondaryValue: inr(asGoods.threshold),
          variant: "best" as const,
        },
      ],
    };
  }, [annualTurnover, category, t]);

  return (
    <ToolPageShell
      title={t(tool.titleKey)}
      subtitle={t("Tool_gst_registration_threshold_Subtitle")}
      description={t(tool.descriptionKey)}
      icon={tool.icon}
      educate={
        <>
          <div className="fy-info-box">
            <strong>{t("Common_WhatYouLearn")}</strong>
            <p>{t("Tool_gst_registration_threshold_LearnText")}</p>
          </div>
          <FormulaCard
            title={t("Common_Formula")}
            code={"Services ≈ ₹20L · Goods ≈ ₹40L\nSpecial category ≈ ₹10L\nRegister if turnover > threshold"}
            note={t("Tool_gst_registration_threshold_FormulaNote")}
          />
        </>
      }
      below={<ToolInfoPanel info={gstRegistrationThresholdInfo(t)} />}
    >
      <div className="fy-form-card">
        <h3>{t("Common_YourInputs")}</h3>
        <div className="fy-field">
          <label>{t("Tool_gst_registration_threshold_LabelTurnover")}</label>
          <input
            type="number"
            min={0}
            step={100000}
            inputMode="decimal"
            value={annualTurnover}
            onChange={(e) => setAnnualTurnover(Math.max(0, Number(e.target.value) || 0))}
          />
        </div>
        <div className="fy-field">
          <label>{t("Tool_gst_registration_threshold_LabelCategory")}</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as GstRegistrationCategory)}
          >
            <option value="services">{t("Tool_gst_registration_threshold_Cat_Services")}</option>
            <option value="goods">{t("Tool_gst_registration_threshold_Cat_Goods")}</option>
            <option value="special_category">
              {t("Tool_gst_registration_threshold_Cat_Special")}
            </option>
          </select>
        </div>
        <button type="button" className="fy-btn-calc">
          {t("Common_Calculate")}
        </button>
      </div>

      <ResultSummaryCards cards={summaryCards} />
      <ScenarioCompare
        title={t("Tool_gst_registration_threshold_ScenarioTitle")}
        subtitle={t("Tool_gst_registration_threshold_ScenarioSubtitle")}
        scenarios={scenarios}
      />
      <WorkedExample
        title={t("Tool_gst_registration_threshold_ExampleTitle")}
        subtitle={t("Tool_gst_registration_threshold_ExampleSubtitle")}
        steps={exampleSteps}
      />
    </ToolPageShell>
  );
}
