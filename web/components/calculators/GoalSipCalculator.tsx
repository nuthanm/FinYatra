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
import { calculateGoalSip } from "@/lib/finance/goalSip";
import { inr, percent } from "@/lib/finance/format";
import { getTool } from "@/lib/config/tools";
import { goalSipInfo } from "@/lib/tool-page-content";

export function GoalSipCalculator() {
  const t = useT();
  const tool = getTool("goal-sip")!;

  const [target, setTarget] = useState(2_000_000);
  const [years, setYears] = useState(10);
  const [rate, setRate] = useState(12);

  const exampleSteps = useMemo(
    () => [
      t("Tool_goal_sip_ExampleStep_1"),
      t("Tool_goal_sip_ExampleStep_2"),
      t("Tool_goal_sip_ExampleStep_3"),
      t("Tool_goal_sip_ExampleStep_4"),
      t("Tool_goal_sip_ExampleStep_5"),
    ],
    [t],
  );

  const { summaryCards, scenarios } = useMemo(() => {
    const base = calculateGoalSip({
      targetAmount: target,
      years,
      expectedReturnPercent: rate,
    });
    const low = calculateGoalSip({
      targetAmount: target,
      years,
      expectedReturnPercent: Math.max(0, rate - 3),
    });
    const high = calculateGoalSip({
      targetAmount: target,
      years,
      expectedReturnPercent: rate + 3,
    });

    return {
      summaryCards: [
        {
          label: t("Tool_goal_sip_Result_Sip"),
          value: inr(base.monthlySip),
          footnote: t("Tool_goal_sip_Result_SipFootnote", years, percent(rate)),
          variant: "primary" as const,
        },
        {
          label: t("Tool_goal_sip_Result_Invested"),
          value: inr(base.totalInvested),
          footnote: t("Tool_goal_sip_Result_InvestedFootnote", base.months),
        },
        {
          label: t("Tool_goal_sip_Result_Target"),
          value: inr(base.targetAmount),
          footnote: t("Tool_goal_sip_Result_TargetFootnote"),
          variant: "secure" as const,
        },
      ],
      scenarios: [
        {
          name: t("Tool_goal_sip_Scenario_Lower"),
          primaryLabel: t("Tool_goal_sip_Result_Sip"),
          primaryValue: inr(low.monthlySip),
          secondaryLabel: t("Common_Label_Return"),
          secondaryValue: percent(Math.max(0, rate - 3)),
          variant: "worst",
        },
        {
          name: t("Common_Scenario_Base"),
          primaryLabel: t("Tool_goal_sip_Result_Sip"),
          primaryValue: inr(base.monthlySip),
          secondaryLabel: t("Common_Label_Return"),
          secondaryValue: percent(rate),
          variant: "base",
        },
        {
          name: t("Tool_goal_sip_Scenario_Higher"),
          primaryLabel: t("Tool_goal_sip_Result_Sip"),
          primaryValue: inr(high.monthlySip),
          secondaryLabel: t("Common_Label_Return"),
          secondaryValue: percent(rate + 3),
          variant: "best",
        },
      ],
    };
  }, [target, years, rate, t]);

  return (
    <ToolPageShell
      title={t(tool.titleKey)}
      subtitle={t("Tool_goal_sip_Subtitle")}
      description={t(tool.descriptionKey)}
      icon={tool.icon}
      educate={
        <>
          <div className="fy-info-box">
            <strong>{t("Common_WhatYouLearn")}</strong>
            <p>{t("Tool_goal_sip_LearnText")}</p>
          </div>
          <FormulaCard
            title={t("Common_Formula")}
            code={"r = annualReturn / 12\nSIP = target × r / ((1+r)^months − 1)"}
            note={t("Tool_goal_sip_FormulaNote")}
          />
        </>
      }
      below={<ToolInfoPanel info={goalSipInfo(t)} />}
    >
      <div className="fy-form-card">
        <h3>{t("Common_YourInputs")}</h3>
        <div className="fy-field">
          <label>{t("Tool_goal_sip_LabelTarget")}</label>
          <input
            type="number"
            min={0}
            step={10000}
            inputMode="decimal"
            value={target}
            onChange={(e) => setTarget(Math.max(0, Number(e.target.value) || 0))}
          />
        </div>
        <div className="fy-field">
          <label>{t("Common_Label_Years")}</label>
          <input
            type="number"
            min={1}
            max={50}
            step={1}
            inputMode="numeric"
            value={years}
            onChange={(e) => setYears(Math.max(1, Number(e.target.value) || 1))}
          />
        </div>
        <div className="fy-field">
          <label>{t("Common_Label_RatePa")}</label>
          <input
            type="number"
            min={0}
            step={0.5}
            inputMode="decimal"
            value={rate}
            onChange={(e) => setRate(Math.max(0, Number(e.target.value) || 0))}
          />
          <p className="fy-field-hint">{t("Tool_goal_sip_RateHint")}</p>
        </div>
        <button type="button" className="fy-btn-calc">
          {t("Common_Calculate")}
        </button>
      </div>

      <ResultSummaryCards cards={summaryCards} />
      <ScenarioCompare
        title={t("Tool_goal_sip_ScenarioTitle")}
        subtitle={t("Tool_goal_sip_ScenarioSubtitle")}
        scenarios={scenarios}
      />
      <WorkedExample
        title={t("Tool_goal_sip_ExampleTitle")}
        subtitle={t("Tool_goal_sip_ExampleSubtitle")}
        steps={exampleSteps}
      />
    </ToolPageShell>
  );
}
