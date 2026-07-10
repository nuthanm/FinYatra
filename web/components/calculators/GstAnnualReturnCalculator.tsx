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
import { calculateGstAnnualReturn } from "@/lib/finance/gstAnnualReturn";
import { inr, percent } from "@/lib/finance/format";
import { getTool } from "@/lib/config/tools";
import { gstAnnualReturnInfo } from "@/lib/tool-page-content";

export function GstAnnualReturnCalculator() {
  const t = useT();
  const tool = getTool("gst-annual-return")!;

  const [outwardSupplies, setOutwardSupplies] = useState(50_00_000);
  const [gstRate, setGstRate] = useState(18);
  const [taxPaid, setTaxPaid] = useState(8_50_000);

  const exampleSteps = useMemo(
    () => [
      t("Tool_gst_annual_return_ExampleStep_1"),
      t("Tool_gst_annual_return_ExampleStep_2"),
      t("Tool_gst_annual_return_ExampleStep_3"),
      t("Tool_gst_annual_return_ExampleStep_4"),
      t("Tool_gst_annual_return_ExampleStep_5"),
    ],
    [t],
  );

  const { summaryCards, scenarios } = useMemo(() => {
    const result = calculateGstAnnualReturn({
      outwardSupplies,
      gstRatePercent: gstRate,
      taxPaid,
    });
    const lowerPaid = calculateGstAnnualReturn({
      outwardSupplies,
      gstRatePercent: gstRate,
      taxPaid: Math.max(0, taxPaid - 50_000),
    });
    const higherPaid = calculateGstAnnualReturn({
      outwardSupplies,
      gstRatePercent: gstRate,
      taxPaid: taxPaid + 50_000,
    });

    const statusKey =
      result.status === "balanced"
        ? "Tool_gst_annual_return_Result_StatusBalanced"
        : result.status === "excess"
          ? "Tool_gst_annual_return_Result_StatusExcess"
          : "Tool_gst_annual_return_Result_StatusShortfall";

    return {
      summaryCards: [
        {
          label: t("Tool_gst_annual_return_Result_Liability"),
          value: inr(result.taxLiability),
          footnote: t("Tool_gst_annual_return_Result_LiabilityFootnote", percent(gstRate, 0)),
          variant: "primary" as const,
        },
        {
          label: t("Tool_gst_annual_return_Result_Paid"),
          value: inr(result.taxPaid),
          footnote: t("Tool_gst_annual_return_Result_PaidFootnote"),
        },
        {
          label: t("Tool_gst_annual_return_Result_Difference"),
          value: inr(result.difference),
          footnote: t(statusKey),
          variant:
            result.status === "shortfall"
              ? ("volatile" as const)
              : result.status === "excess"
                ? ("secure" as const)
                : ("primary" as const),
        },
      ],
      scenarios: [
        {
          name: t("Tool_gst_annual_return_Scenario_LowerPaid"),
          primaryLabel: t("Tool_gst_annual_return_Result_Difference"),
          primaryValue: inr(lowerPaid.difference),
          secondaryLabel: t("Tool_gst_annual_return_Result_Paid"),
          secondaryValue: inr(lowerPaid.taxPaid),
          variant: "worst" as const,
        },
        {
          name: t("Common_Scenario_Base"),
          primaryLabel: t("Tool_gst_annual_return_Result_Difference"),
          primaryValue: inr(result.difference),
          secondaryLabel: t("Tool_gst_annual_return_Result_Liability"),
          secondaryValue: inr(result.taxLiability),
          variant: "base" as const,
        },
        {
          name: t("Tool_gst_annual_return_Scenario_HigherPaid"),
          primaryLabel: t("Tool_gst_annual_return_Result_Difference"),
          primaryValue: inr(higherPaid.difference),
          secondaryLabel: t("Tool_gst_annual_return_Result_Paid"),
          secondaryValue: inr(higherPaid.taxPaid),
          variant: "best" as const,
        },
      ],
    };
  }, [outwardSupplies, gstRate, taxPaid, t]);

  return (
    <ToolPageShell
      title={t(tool.titleKey)}
      subtitle={t("Tool_gst_annual_return_Subtitle")}
      description={t(tool.descriptionKey)}
      icon={tool.icon}
      educate={
        <>
          <div className="fy-info-box">
            <strong>{t("Common_WhatYouLearn")}</strong>
            <p>{t("Tool_gst_annual_return_LearnText")}</p>
          </div>
          <FormulaCard
            title={t("Common_Formula")}
            code={"liability = outward × GST%\ndifference = tax paid − liability"}
            note={t("Tool_gst_annual_return_FormulaNote")}
          />
        </>
      }
      below={<ToolInfoPanel info={gstAnnualReturnInfo(t)} />}
    >
      <div className="fy-form-card">
        <h3>{t("Common_YourInputs")}</h3>
        <div className="fy-field">
          <label>{t("Tool_gst_annual_return_LabelOutward")}</label>
          <input
            type="number"
            min={0}
            step={10000}
            inputMode="decimal"
            value={outwardSupplies}
            onChange={(e) => setOutwardSupplies(Math.max(0, Number(e.target.value) || 0))}
          />
        </div>
        <div className="fy-field">
          <label>{t("Tool_gst_annual_return_LabelRate")}</label>
          <input
            type="number"
            min={0}
            max={40}
            step={1}
            inputMode="decimal"
            value={gstRate}
            onChange={(e) => setGstRate(Math.max(0, Number(e.target.value) || 0))}
          />
          <p className="fy-field-hint">{t("Tool_gst_annual_return_RateHint")}</p>
        </div>
        <div className="fy-field">
          <label>{t("Tool_gst_annual_return_LabelPaid")}</label>
          <input
            type="number"
            min={0}
            step={1000}
            inputMode="decimal"
            value={taxPaid}
            onChange={(e) => setTaxPaid(Math.max(0, Number(e.target.value) || 0))}
          />
        </div>
        <button type="button" className="fy-btn-calc">
          {t("Common_Calculate")}
        </button>
      </div>

      <ResultSummaryCards cards={summaryCards} />
      <ScenarioCompare
        title={t("Tool_gst_annual_return_ScenarioTitle")}
        subtitle={t("Tool_gst_annual_return_ScenarioSubtitle")}
        scenarios={scenarios}
      />
      <WorkedExample
        title={t("Tool_gst_annual_return_ExampleTitle")}
        subtitle={t("Tool_gst_annual_return_ExampleSubtitle")}
        steps={exampleSteps}
      />
    </ToolPageShell>
  );
}
