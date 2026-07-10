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
import { calculateMfOverlap, parseHoldingsList } from "@/lib/finance/mfOverlap";
import { percent } from "@/lib/finance/format";
import { getTool } from "@/lib/config/tools";
import { mfOverlapInfo } from "@/lib/tool-page-content";

export function MfOverlapCalculator() {
  const t = useT();
  const tool = getTool("mf-overlap")!;

  const [fundAText, setFundAText] = useState("RELIANCE:8, TCS:6, INFY:5, HDFCBANK:7, ICICIBANK:4");
  const [fundBText, setFundBText] = useState("RELIANCE:9, INFY:5, SBIN:4, HDFCBANK:6, BHARTIARTL:3");

  const exampleSteps = useMemo(
    () => [
      t("Tool_mf_overlap_ExampleStep_1"),
      t("Tool_mf_overlap_ExampleStep_2"),
      t("Tool_mf_overlap_ExampleStep_3"),
      t("Tool_mf_overlap_ExampleStep_4"),
      t("Tool_mf_overlap_ExampleStep_5"),
    ],
    [t],
  );

  const { summaryCards, scenarios, sharedLabel } = useMemo(() => {
    const fundA = parseHoldingsList(fundAText);
    const fundB = parseHoldingsList(fundBText);
    const result = calculateMfOverlap({ fundA, fundB });
    const countOnly = calculateMfOverlap({
      fundA: fundA.map((h) => ({ symbol: h.symbol })),
      fundB: fundB.map((h) => ({ symbol: h.symbol })),
    });
    const halfA = calculateMfOverlap({
      fundA: fundA.slice(0, Math.max(1, Math.ceil(fundA.length / 2))),
      fundB,
    });

    return {
      sharedLabel:
        result.sharedSymbols.length > 0
          ? result.sharedSymbols.join(", ")
          : t("Tool_mf_overlap_SharedNone"),
      summaryCards: [
        {
          label: t("Tool_mf_overlap_Result_Overlap"),
          value: percent(result.overlapPercent),
          footnote:
            result.method === "weighted"
              ? t("Tool_mf_overlap_Result_OverlapWeighted")
              : t("Tool_mf_overlap_Result_OverlapCount"),
          variant: "primary" as const,
        },
        {
          label: t("Tool_mf_overlap_Result_Shared"),
          value: String(result.sharedCount),
          footnote: t("Tool_mf_overlap_Result_SharedFootnote", result.symbolsA, result.symbolsB),
        },
        {
          label: t("Tool_mf_overlap_Result_Method"),
          value:
            result.method === "weighted"
              ? t("Tool_mf_overlap_Method_Weighted")
              : t("Tool_mf_overlap_Method_Count"),
          footnote: t("Tool_mf_overlap_Result_MethodFootnote"),
          variant: "secure" as const,
        },
      ],
      scenarios: [
        {
          name: t("Tool_mf_overlap_Scenario_Count"),
          primaryLabel: t("Tool_mf_overlap_Result_Overlap"),
          primaryValue: percent(countOnly.overlapPercent),
          secondaryLabel: t("Tool_mf_overlap_Result_Shared"),
          secondaryValue: String(countOnly.sharedCount),
          variant: "worst",
        },
        {
          name: t("Common_Scenario_Base"),
          primaryLabel: t("Tool_mf_overlap_Result_Overlap"),
          primaryValue: percent(result.overlapPercent),
          secondaryLabel: t("Tool_mf_overlap_Result_Method"),
          secondaryValue:
            result.method === "weighted"
              ? t("Tool_mf_overlap_Method_Weighted")
              : t("Tool_mf_overlap_Method_Count"),
          variant: "base",
        },
        {
          name: t("Tool_mf_overlap_Scenario_HalfA"),
          primaryLabel: t("Tool_mf_overlap_Result_Overlap"),
          primaryValue: percent(halfA.overlapPercent),
          secondaryLabel: t("Tool_mf_overlap_Result_Shared"),
          secondaryValue: String(halfA.sharedCount),
          variant: "best",
        },
      ],
    };
  }, [fundAText, fundBText, t]);

  return (
    <ToolPageShell
      title={t(tool.titleKey)}
      subtitle={t("Tool_mf_overlap_Subtitle")}
      description={t(tool.descriptionKey)}
      icon={tool.icon}
      educate={
        <>
          <div className="fy-info-box">
            <strong>{t("Common_WhatYouLearn")}</strong>
            <p>{t("Tool_mf_overlap_LearnText")}</p>
          </div>
          <FormulaCard
            title={t("Common_Formula")}
            code={"Count: shared / union × 100\nWeighted: Σ min(wA, wB) for shared"}
            note={t("Tool_mf_overlap_FormulaNote")}
          />
        </>
      }
      below={<ToolInfoPanel info={mfOverlapInfo(t)} />}
    >
      <div className="fy-form-card">
        <h3>{t("Common_YourInputs")}</h3>
        <div className="fy-field">
          <label>{t("Tool_mf_overlap_LabelFundA")}</label>
          <textarea
            rows={3}
            value={fundAText}
            onChange={(e) => setFundAText(e.target.value)}
          />
          <p className="fy-field-hint">{t("Tool_mf_overlap_HoldingsHint")}</p>
        </div>
        <div className="fy-field">
          <label>{t("Tool_mf_overlap_LabelFundB")}</label>
          <textarea
            rows={3}
            value={fundBText}
            onChange={(e) => setFundBText(e.target.value)}
          />
        </div>
        <button type="button" className="fy-btn-calc">
          {t("Common_Calculate")}
        </button>
      </div>

      <div className="fy-info-box">
        <strong>{t("Tool_mf_overlap_SharedTitle")}</strong>
        <p>{sharedLabel}</p>
      </div>

      <ResultSummaryCards cards={summaryCards} />
      <ScenarioCompare
        title={t("Tool_mf_overlap_ScenarioTitle")}
        subtitle={t("Tool_mf_overlap_ScenarioSubtitle")}
        scenarios={scenarios}
      />
      <WorkedExample
        title={t("Tool_mf_overlap_ExampleTitle")}
        subtitle={t("Tool_mf_overlap_ExampleSubtitle")}
        steps={exampleSteps}
      />
    </ToolPageShell>
  );
}
