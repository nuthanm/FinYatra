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
  calculateTcsOnForeignRemittance,
  TCS_LRS_THRESHOLD,
} from "@/lib/finance/tcsOnForeignRemittance";
import { inr, percent } from "@/lib/finance/format";
import { getTool } from "@/lib/config/tools";
import { tcsOnForeignRemittanceInfo } from "@/lib/tool-page-content";

export function TcsOnForeignRemittanceCalculator() {
  const t = useT();
  const tool = getTool("tcs-on-foreign-remittance")!;

  const [amount, setAmount] = useState(10_00_000);

  const exampleSteps = useMemo(
    () => [
      t("Tool_tcs_on_foreign_remittance_ExampleStep_1"),
      t("Tool_tcs_on_foreign_remittance_ExampleStep_2"),
      t("Tool_tcs_on_foreign_remittance_ExampleStep_3"),
      t("Tool_tcs_on_foreign_remittance_ExampleStep_4"),
      t("Tool_tcs_on_foreign_remittance_ExampleStep_5"),
    ],
    [t],
  );

  const { summaryCards, scenarios, detail } = useMemo(() => {
    const result = calculateTcsOnForeignRemittance({ remittanceAmount: amount });
    const low = calculateTcsOnForeignRemittance({
      remittanceAmount: Math.min(amount, TCS_LRS_THRESHOLD),
    });
    const high = calculateTcsOnForeignRemittance({
      remittanceAmount: Math.max(amount, TCS_LRS_THRESHOLD + 1_00_000),
    });

    return {
      detail: result,
      summaryCards: [
        {
          label: t("Tool_tcs_on_foreign_remittance_Result_Tcs"),
          value: inr(result.tcsAmount),
          footnote: t(
            "Tool_tcs_on_foreign_remittance_Result_TcsFootnote",
            percent(result.ratePercent, 0),
          ),
          variant: "primary" as const,
        },
        {
          label: t("Tool_tcs_on_foreign_remittance_Result_Net"),
          value: inr(result.netAmount),
          footnote: t("Tool_tcs_on_foreign_remittance_Result_NetFootnote"),
          variant: "secure" as const,
        },
        {
          label: t("Tool_tcs_on_foreign_remittance_Result_Threshold"),
          value: inr(result.threshold),
          footnote: t("Tool_tcs_on_foreign_remittance_Result_ThresholdFootnote"),
        },
      ],
      scenarios: [
        {
          name: t("Tool_tcs_on_foreign_remittance_Scenario_Low"),
          primaryLabel: t("Tool_tcs_on_foreign_remittance_Result_Tcs"),
          primaryValue: inr(low.tcsAmount),
          secondaryLabel: t("Tool_tcs_on_foreign_remittance_Result_Rate"),
          secondaryValue: percent(low.ratePercent, 0),
          variant: "best" as const,
        },
        {
          name: t("Common_Scenario_Base"),
          primaryLabel: t("Tool_tcs_on_foreign_remittance_Result_Tcs"),
          primaryValue: inr(result.tcsAmount),
          secondaryLabel: t("Tool_tcs_on_foreign_remittance_Result_Rate"),
          secondaryValue: percent(result.ratePercent, 0),
          variant: "base" as const,
        },
        {
          name: t("Tool_tcs_on_foreign_remittance_Scenario_High"),
          primaryLabel: t("Tool_tcs_on_foreign_remittance_Result_Tcs"),
          primaryValue: inr(high.tcsAmount),
          secondaryLabel: t("Tool_tcs_on_foreign_remittance_Result_Rate"),
          secondaryValue: percent(high.ratePercent, 0),
          variant: "worst" as const,
        },
      ],
    };
  }, [amount, t]);

  const statusText =
    detail.noteKey === "lrs_low"
      ? t(
          "Tool_tcs_on_foreign_remittance_Status_Low",
          percent(detail.ratePercent, 0),
          inr(detail.tcsAmount),
          inr(TCS_LRS_THRESHOLD),
        )
      : detail.noteKey === "lrs_high"
        ? t(
            "Tool_tcs_on_foreign_remittance_Status_High",
            percent(detail.ratePercent, 0),
            inr(detail.tcsAmount),
            inr(TCS_LRS_THRESHOLD),
          )
        : t("Tool_tcs_on_foreign_remittance_Status_None");

  return (
    <ToolPageShell
      title={t(tool.titleKey)}
      subtitle={t("Tool_tcs_on_foreign_remittance_Subtitle")}
      description={t(tool.descriptionKey)}
      icon={tool.icon}
      educate={
        <>
          <div className="fy-info-box">
            <strong>{t("Common_WhatYouLearn")}</strong>
            <p>{t("Tool_tcs_on_foreign_remittance_LearnText")}</p>
          </div>
          <FormulaCard
            title={t("Common_Formula")}
            code={"LRS ≤ ₹7L → TCS 5%\nLRS > ₹7L → TCS 20%\nNet = amount − TCS"}
            note={t("Tool_tcs_on_foreign_remittance_FormulaNote")}
          />
        </>
      }
      below={<ToolInfoPanel info={tcsOnForeignRemittanceInfo(t)} />}
    >
      <div className="fy-form-card">
        <h3>{t("Common_YourInputs")}</h3>
        <div className="fy-field">
          <label>{t("Tool_tcs_on_foreign_remittance_LabelAmount")}</label>
          <input
            type="number"
            min={0}
            step={10000}
            inputMode="decimal"
            value={amount}
            onChange={(e) => setAmount(Math.max(0, Number(e.target.value) || 0))}
          />
          <p className="fy-field-hint">{t("Tool_tcs_on_foreign_remittance_AmountHint")}</p>
        </div>
        <button type="button" className="fy-btn-calc">
          {t("Common_Calculate")}
        </button>
      </div>

      <div className="fy-info-box">
        <strong>{t("Tool_tcs_on_foreign_remittance_StatusTitle")}</strong>
        <p>{statusText}</p>
      </div>

      <ResultSummaryCards cards={summaryCards} />
      <ScenarioCompare
        title={t("Tool_tcs_on_foreign_remittance_ScenarioTitle")}
        subtitle={t("Tool_tcs_on_foreign_remittance_ScenarioSubtitle")}
        scenarios={scenarios}
      />
      <WorkedExample
        title={t("Tool_tcs_on_foreign_remittance_ExampleTitle")}
        subtitle={t("Tool_tcs_on_foreign_remittance_ExampleSubtitle")}
        steps={exampleSteps}
      />
    </ToolPageShell>
  );
}
