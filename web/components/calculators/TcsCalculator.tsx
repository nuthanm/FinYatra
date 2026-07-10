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
  calculateTcs,
  TCS_LRS_THRESHOLD,
  TCS_NATURES,
  type TcsNatureId,
} from "@/lib/finance/tcs";
import { inr, percent } from "@/lib/finance/format";
import { getTool } from "@/lib/config/tools";
import { tcsInfo } from "@/lib/tool-page-content";

export function TcsCalculator() {
  const t = useT();
  const tool = getTool("tcs")!;

  const [natureId, setNatureId] = useState<TcsNatureId>("lrs_foreign");
  const [amount, setAmount] = useState(1_000_000);

  const exampleSteps = useMemo(
    () => [
      t("Tool_tcs_ExampleStep_1"),
      t("Tool_tcs_ExampleStep_2"),
      t("Tool_tcs_ExampleStep_3"),
      t("Tool_tcs_ExampleStep_4"),
      t("Tool_tcs_ExampleStep_5"),
    ],
    [t],
  );

  const { summaryCards, scenarios, detail } = useMemo(() => {
    const result = calculateTcs({ natureId, amount });
    const lower = calculateTcs({ natureId, amount: amount * 0.5 });
    const higher = calculateTcs({ natureId, amount: amount * 1.5 });

    return {
      detail: result,
      summaryCards: [
        {
          label: t("Tool_tcs_Result_Tcs"),
          value: inr(result.tcsAmount),
          footnote: t("Tool_tcs_Result_TcsFootnote", percent(result.ratePercent, 2)),
          variant: "primary" as const,
        },
        {
          label: t("Tool_tcs_Result_Net"),
          value: inr(result.netAmount),
          footnote: t("Tool_tcs_Result_NetFootnote"),
          variant: "secure" as const,
        },
        {
          label: t("Tool_tcs_Result_Threshold"),
          value: natureId === "scrap" ? "—" : inr(result.threshold),
          footnote: t("Tool_tcs_Result_ThresholdFootnote"),
        },
      ],
      scenarios: [
        {
          name: t("Tool_tcs_Scenario_Lower"),
          primaryLabel: t("Tool_tcs_Result_Tcs"),
          primaryValue: inr(lower.tcsAmount),
          secondaryLabel: t("Tool_tcs_Result_Rate"),
          secondaryValue: percent(lower.ratePercent, 2),
          variant: "best",
        },
        {
          name: t("Common_Scenario_Base"),
          primaryLabel: t("Tool_tcs_Result_Tcs"),
          primaryValue: inr(result.tcsAmount),
          secondaryLabel: t("Tool_tcs_Result_Rate"),
          secondaryValue: percent(result.ratePercent, 2),
          variant: "base",
        },
        {
          name: t("Tool_tcs_Scenario_Higher"),
          primaryLabel: t("Tool_tcs_Result_Tcs"),
          primaryValue: inr(higher.tcsAmount),
          secondaryLabel: t("Tool_tcs_Result_Rate"),
          secondaryValue: percent(higher.ratePercent, 2),
          variant: "worst",
        },
      ],
    };
  }, [natureId, amount, t]);

  const statusText =
    detail.noteKey === "below_threshold"
      ? t("Tool_tcs_Status_Below", inr(detail.threshold))
      : detail.noteKey === "lrs_low"
        ? t("Tool_tcs_Status_LrsLow", percent(detail.ratePercent, 0), inr(detail.tcsAmount), inr(TCS_LRS_THRESHOLD))
        : detail.noteKey === "lrs_high"
          ? t("Tool_tcs_Status_LrsHigh", percent(detail.ratePercent, 0), inr(detail.tcsAmount), inr(TCS_LRS_THRESHOLD))
          : t("Tool_tcs_Status_Applied", percent(detail.ratePercent, 2), inr(detail.tcsAmount));

  return (
    <ToolPageShell
      title={t(tool.titleKey)}
      subtitle={t("Tool_tcs_Subtitle")}
      description={t(tool.descriptionKey)}
      icon={tool.icon}
      educate={
        <>
          <div className="fy-info-box">
            <strong>{t("Common_WhatYouLearn")}</strong>
            <p>{t("Tool_tcs_LearnText")}</p>
          </div>
          <FormulaCard
            title={t("Common_Formula")}
            code={
              "LRS: ≤ ₹7L → 5%; above → 20%\nSale of goods: 0.1% if > ₹50L\nScrap: 1% of amount"
            }
            note={t("Tool_tcs_FormulaNote")}
          />
        </>
      }
      below={<ToolInfoPanel info={tcsInfo(t)} />}
    >
      <div className="fy-form-card">
        <h3>{t("Common_YourInputs")}</h3>
        <div className="fy-field">
          <label>{t("Tool_tcs_LabelNature")}</label>
          <select value={natureId} onChange={(e) => setNatureId(e.target.value as TcsNatureId)}>
            {TCS_NATURES.map((n) => (
              <option key={n.id} value={n.id}>
                {t(`Tool_tcs_Nature_${n.id}`)}
              </option>
            ))}
          </select>
          <p className="fy-field-hint">{t(`Tool_tcs_NatureHint_${natureId}`)}</p>
        </div>
        <div className="fy-field">
          <label>{t("Tool_tcs_LabelAmount")}</label>
          <input
            type="number"
            min={0}
            step={1000}
            inputMode="decimal"
            value={amount}
            onChange={(e) => setAmount(Math.max(0, Number(e.target.value) || 0))}
          />
          <p className="fy-field-hint">{t("Tool_tcs_AmountHint")}</p>
        </div>
        <button type="button" className="fy-btn-calc">
          {t("Common_Calculate")}
        </button>
      </div>

      <div className="fy-info-box fy-tax-verdict">
        <strong>{t("Tool_tcs_StatusTitle")}</strong>
        <p>{statusText}</p>
      </div>

      <ResultSummaryCards cards={summaryCards} />
      <ScenarioCompare
        title={t("Tool_tcs_ScenarioTitle")}
        subtitle={t("Tool_tcs_ScenarioSubtitle")}
        scenarios={scenarios}
      />
      <WorkedExample
        title={t("Tool_tcs_ExampleTitle")}
        subtitle={t("Tool_tcs_ExampleSubtitle")}
        steps={exampleSteps}
      />
    </ToolPageShell>
  );
}
