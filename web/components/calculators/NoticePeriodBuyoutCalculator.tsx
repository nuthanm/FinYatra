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
import { calculateNoticePeriodBuyout } from "@/lib/finance/noticePeriodBuyout";
import { inr, percent } from "@/lib/finance/format";
import { getTool } from "@/lib/config/tools";
import { noticePeriodBuyoutInfo } from "@/lib/tool-page-content";

export function NoticePeriodBuyoutCalculator() {
  const t = useT();
  const tool = getTool("notice-period-buyout")!;

  const [ctc, setCtc] = useState(18_00_000);
  const [days, setDays] = useState(60);

  const exampleSteps = useMemo(
    () => [
      t("Tool_notice_period_buyout_ExampleStep_1"),
      t("Tool_notice_period_buyout_ExampleStep_2"),
      t("Tool_notice_period_buyout_ExampleStep_3"),
      t("Tool_notice_period_buyout_ExampleStep_4"),
      t("Tool_notice_period_buyout_ExampleStep_5"),
    ],
    [t],
  );

  const { summaryCards, scenarios } = useMemo(() => {
    const result = calculateNoticePeriodBuyout({ ctcAnnual: ctc, remainingDays: days });
    const half = calculateNoticePeriodBuyout({
      ctcAnnual: ctc,
      remainingDays: Math.round(days / 2),
    });
    const full = calculateNoticePeriodBuyout({
      ctcAnnual: ctc,
      remainingDays: Math.min(90, days + 30),
    });

    return {
      summaryCards: [
        {
          label: t("Tool_notice_period_buyout_Result_Cost"),
          value: inr(result.buyoutCost),
          footnote: t(
            "Tool_notice_period_buyout_Result_CostFootnote",
            String(result.remainingDays),
          ),
          variant: "primary" as const,
        },
        {
          label: t("Tool_notice_period_buyout_Result_Daily"),
          value: inr(result.dailyCtc),
          footnote: t("Tool_notice_period_buyout_Result_DailyFootnote"),
          variant: "secure" as const,
        },
        {
          label: t("Tool_notice_period_buyout_Result_Pct"),
          value: percent(result.buyoutPercentOfCtc, 1),
          footnote: t("Tool_notice_period_buyout_Result_PctFootnote"),
        },
      ],
      scenarios: [
        {
          name: t("Tool_notice_period_buyout_Scenario_Half"),
          primaryLabel: t("Tool_notice_period_buyout_Result_Cost"),
          primaryValue: inr(half.buyoutCost),
          secondaryLabel: t("Tool_notice_period_buyout_Result_Days"),
          secondaryValue: String(half.remainingDays),
          variant: "best" as const,
        },
        {
          name: t("Common_Scenario_Base"),
          primaryLabel: t("Tool_notice_period_buyout_Result_Cost"),
          primaryValue: inr(result.buyoutCost),
          secondaryLabel: t("Tool_notice_period_buyout_Result_Daily"),
          secondaryValue: inr(result.dailyCtc),
          variant: "base" as const,
        },
        {
          name: t("Tool_notice_period_buyout_Scenario_Longer"),
          primaryLabel: t("Tool_notice_period_buyout_Result_Cost"),
          primaryValue: inr(full.buyoutCost),
          secondaryLabel: t("Tool_notice_period_buyout_Result_Days"),
          secondaryValue: String(full.remainingDays),
          variant: "worst" as const,
        },
      ],
    };
  }, [ctc, days, t]);

  return (
    <ToolPageShell
      title={t(tool.titleKey)}
      subtitle={t("Tool_notice_period_buyout_Subtitle")}
      description={t(tool.descriptionKey)}
      icon={tool.icon}
      educate={
        <>
          <div className="fy-info-box">
            <strong>{t("Common_WhatYouLearn")}</strong>
            <p>{t("Tool_notice_period_buyout_LearnText")}</p>
          </div>
          <FormulaCard
            title={t("Common_Formula")}
            code={"Daily CTC = annual CTC ÷ 365\nBuyout = remaining days × daily CTC"}
            note={t("Tool_notice_period_buyout_FormulaNote")}
          />
        </>
      }
      below={<ToolInfoPanel info={noticePeriodBuyoutInfo(t)} />}
    >
      <div className="fy-form-card">
        <h3>{t("Common_YourInputs")}</h3>
        <div className="fy-field">
          <label>{t("Tool_notice_period_buyout_LabelCtc")}</label>
          <input
            type="number"
            min={0}
            step={50000}
            inputMode="decimal"
            value={ctc}
            onChange={(e) => setCtc(Math.max(0, Number(e.target.value) || 0))}
          />
        </div>
        <div className="fy-field">
          <label>{t("Tool_notice_period_buyout_LabelDays")}</label>
          <input
            type="number"
            min={0}
            max={180}
            step={1}
            inputMode="decimal"
            value={days}
            onChange={(e) => setDays(Math.max(0, Number(e.target.value) || 0))}
          />
          <p className="fy-field-hint">{t("Tool_notice_period_buyout_DaysHint")}</p>
        </div>
        <button type="button" className="fy-btn-calc">
          {t("Common_Calculate")}
        </button>
      </div>

      <ResultSummaryCards cards={summaryCards} />
      <ScenarioCompare
        title={t("Tool_notice_period_buyout_ScenarioTitle")}
        subtitle={t("Tool_notice_period_buyout_ScenarioSubtitle")}
        scenarios={scenarios}
      />
      <WorkedExample
        title={t("Tool_notice_period_buyout_ExampleTitle")}
        subtitle={t("Tool_notice_period_buyout_ExampleSubtitle")}
        steps={exampleSteps}
      />
    </ToolPageShell>
  );
}
