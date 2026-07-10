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
  calculateTdsOnProperty,
  TDS_PROPERTY_RATE_PERCENT,
  TDS_PROPERTY_THRESHOLD,
} from "@/lib/finance/tdsOnProperty";
import { inr, percent } from "@/lib/finance/format";
import { getTool } from "@/lib/config/tools";
import { tdsOnPropertyInfo } from "@/lib/tool-page-content";

export function TdsOnPropertyCalculator() {
  const t = useT();
  const tool = getTool("tds-on-property")!;

  const [consideration, setConsideration] = useState(6_000_000);
  const [ratePercent, setRatePercent] = useState(TDS_PROPERTY_RATE_PERCENT);
  const [buyerCount, setBuyerCount] = useState(1);

  const exampleSteps = useMemo(
    () => [
      t("Tool_tds_on_property_ExampleStep_1"),
      t("Tool_tds_on_property_ExampleStep_2"),
      t("Tool_tds_on_property_ExampleStep_3"),
      t("Tool_tds_on_property_ExampleStep_4"),
      t("Tool_tds_on_property_ExampleStep_5"),
    ],
    [t],
  );

  const { summaryCards, scenarios, detail } = useMemo(() => {
    const result = calculateTdsOnProperty({ consideration, ratePercent, buyerCount });
    const below = calculateTdsOnProperty({
      consideration: TDS_PROPERTY_THRESHOLD,
      ratePercent,
      buyerCount,
    });
    const joint = calculateTdsOnProperty({
      consideration,
      ratePercent,
      buyerCount: Math.max(2, buyerCount),
    });

    return {
      detail: result,
      summaryCards: [
        {
          label: t("Tool_tds_on_property_Result_Tds"),
          value: inr(result.tdsAmount),
          footnote: t("Tool_tds_on_property_Result_TdsFootnote", percent(result.ratePercent, 0)),
          variant: "primary" as const,
        },
        {
          label: t("Tool_tds_on_property_Result_Net"),
          value: inr(result.netPayable),
          footnote: t("Tool_tds_on_property_Result_NetFootnote"),
          variant: "secure" as const,
        },
        {
          label: t("Tool_tds_on_property_Result_Share"),
          value: inr(result.perBuyerShare),
          footnote: t("Tool_tds_on_property_Result_ShareFootnote", String(result.buyerCount)),
        },
      ],
      scenarios: [
        {
          name: t("Tool_tds_on_property_Scenario_Below"),
          primaryLabel: t("Tool_tds_on_property_Result_Tds"),
          primaryValue: inr(below.tdsAmount),
          secondaryLabel: t("Tool_tds_on_property_Result_Consideration"),
          secondaryValue: inr(below.threshold),
          variant: "best",
        },
        {
          name: t("Common_Scenario_Base"),
          primaryLabel: t("Tool_tds_on_property_Result_Tds"),
          primaryValue: inr(result.tdsAmount),
          secondaryLabel: t("Tool_tds_on_property_Result_Net"),
          secondaryValue: inr(result.netPayable),
          variant: "base",
        },
        {
          name: t("Tool_tds_on_property_Scenario_Joint"),
          primaryLabel: t("Tool_tds_on_property_Result_Tds"),
          primaryValue: inr(joint.tdsAmount),
          secondaryLabel: t("Tool_tds_on_property_Result_Share"),
          secondaryValue: inr(joint.perBuyerShare),
          variant: "worst",
        },
      ],
    };
  }, [consideration, ratePercent, buyerCount, t]);

  return (
    <ToolPageShell
      title={t(tool.titleKey)}
      subtitle={t("Tool_tds_on_property_Subtitle")}
      description={t(tool.descriptionKey)}
      icon={tool.icon}
      educate={
        <>
          <div className="fy-info-box">
            <strong>{t("Common_WhatYouLearn")}</strong>
            <p>{t("Tool_tds_on_property_LearnText")}</p>
          </div>
          <FormulaCard
            title={t("Common_Formula")}
            code={"If consideration > ₹50L → TDS = consideration × 1%\nJoint buyers: TDS on full amount"}
            note={t("Tool_tds_on_property_FormulaNote")}
          />
        </>
      }
      below={<ToolInfoPanel info={tdsOnPropertyInfo(t)} />}
    >
      <div className="fy-form-card">
        <h3>{t("Common_YourInputs")}</h3>
        <div className="fy-field">
          <label>{t("Tool_tds_on_property_LabelConsideration")}</label>
          <input
            type="number"
            min={0}
            step={10000}
            inputMode="decimal"
            value={consideration}
            onChange={(e) => setConsideration(Math.max(0, Number(e.target.value) || 0))}
          />
          <p className="fy-field-hint">
            {t("Tool_tds_on_property_ConsiderationHint", inr(TDS_PROPERTY_THRESHOLD))}
          </p>
        </div>
        <div className="fy-field">
          <label>{t("Tool_tds_on_property_LabelRate")}</label>
          <input
            type="number"
            min={0}
            max={100}
            step={0.1}
            inputMode="decimal"
            value={ratePercent}
            onChange={(e) => setRatePercent(Math.max(0, Number(e.target.value) || 0))}
          />
          <p className="fy-field-hint">{t("Tool_tds_on_property_RateHint")}</p>
        </div>
        <div className="fy-field">
          <label>{t("Tool_tds_on_property_LabelBuyers")}</label>
          <input
            type="number"
            min={1}
            max={20}
            step={1}
            inputMode="numeric"
            value={buyerCount}
            onChange={(e) => setBuyerCount(Math.max(1, Math.floor(Number(e.target.value) || 1)))}
          />
          <p className="fy-field-hint">{t("Tool_tds_on_property_BuyersHint")}</p>
        </div>
        <button type="button" className="fy-btn-calc">
          {t("Common_Calculate")}
        </button>
      </div>

      <div className="fy-info-box fy-tax-verdict">
        <strong>{t("Tool_tds_on_property_StatusTitle")}</strong>
        <p>
          {detail.noteKey === "below_threshold"
            ? t("Tool_tds_on_property_Status_Below", inr(detail.threshold))
            : t(
                "Tool_tds_on_property_Status_Applied",
                percent(detail.ratePercent, 0),
                inr(detail.tdsAmount),
              )}
        </p>
        {detail.buyerCount > 1 && (
          <p className="fy-field-hint">{t("Tool_tds_on_property_JointNote")}</p>
        )}
      </div>

      <ResultSummaryCards cards={summaryCards} />
      <ScenarioCompare
        title={t("Tool_tds_on_property_ScenarioTitle")}
        subtitle={t("Tool_tds_on_property_ScenarioSubtitle")}
        scenarios={scenarios}
      />
      <WorkedExample
        title={t("Tool_tds_on_property_ExampleTitle")}
        subtitle={t("Tool_tds_on_property_ExampleSubtitle")}
        steps={exampleSteps}
      />
    </ToolPageShell>
  );
}
