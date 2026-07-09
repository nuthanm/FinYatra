"use client";

import { useMemo, useState } from "react";
import { useT } from "@/components/providers/I18nProvider";
import {
  BreakdownTable,
  ResultSummaryCards,
  ScenarioCompare,
  ToolInfoPanel,
  ToolPageShell,
  WorkedExample,
} from "@/components/calculator/CalculatorUi";
import { inflate, sipRequired } from "@/lib/finance/compound";
import { inr, percent } from "@/lib/finance/format";
import { sipYearly } from "@/lib/finance/projections";
import { getTool } from "@/lib/config/tools";
import { goalExampleSources, goalInfo, standardGrowthColumns } from "@/lib/tool-page-content";

function FormulaWithSteps({ title, code, note, steps }: { title: string; code: string; note: string; steps: string[] }) {
  const t = useT();
  return (
    <div className="fy-formula-card">
      <h4>{title}</h4>
      <pre className="fy-formula-code">{code}</pre>
      <div className="fy-formula-section fy-formula-steps-wrap">
        <div className="fy-formula-kicker">{t("Common_StepByStep")}</div>
        <ol className="fy-formula-steps">
          {steps.map((step, i) => (
            <li key={i}>{step}</li>
          ))}
        </ol>
      </div>
      <p className="fy-audience">{note}</p>
    </div>
  );
}

export function GoalPlanner() {
  const t = useT();
  const tool = getTool("goal")!;

  const [target, setTarget] = useState(1000000);
  const [years, setYears] = useState(5);
  const [applyInflation, setApplyInflation] = useState(true);
  const [inflation, setInflation] = useState(6);
  const [secureRate, setSecureRate] = useState(7);
  const [volatileWorst, setVolatileWorst] = useState(8);
  const [volatileBase, setVolatileBase] = useState(12);
  const [volatileBest, setVolatileBest] = useState(15);

  const breakdownColumns = useMemo(() => standardGrowthColumns(t), [t]);

  const inflationSteps = useMemo(
    () => [
      t("Tool_goal_StepInflation_1"),
      t("Tool_goal_StepInflation_2"),
      t("Tool_goal_StepInflation_3"),
      t("Tool_goal_StepInflation_4"),
      t("Tool_goal_StepInflation_5"),
    ],
    [t],
  );

  const sipSteps = useMemo(
    () => [
      t("Tool_goal_StepSip_1"),
      t("Tool_goal_StepSip_2"),
      t("Tool_goal_StepSip_3"),
      t("Tool_goal_StepSip_4"),
      t("Tool_goal_StepSip_5"),
    ],
    [t],
  );

  const exampleSteps = useMemo(
    () => [
      t("Tool_goal_ExampleStep_1"),
      t("Tool_goal_ExampleStep_2"),
      t("Tool_goal_ExampleStep_3"),
      t("Tool_goal_ExampleStep_4"),
      t("Tool_goal_ExampleStep_5"),
    ],
    [t],
  );

  const exampleSources = useMemo(() => goalExampleSources(t), [t]);

  const { summaryCards, scenarios, breakdownRows } = useMemo(() => {
    const safeYears = Math.min(40, Math.max(1, years));
    const safeTarget = Math.max(0, target);
    const safeInflation = Math.max(0, inflation);
    const safeSecureRate = Math.max(0, secureRate);
    const safeVolatileWorst = Math.max(0, volatileWorst);
    const safeVolatileBase = Math.max(0, volatileBase);
    const safeVolatileBest = Math.max(0, volatileBest);

    const adjustedTarget = applyInflation ? inflate(safeTarget, safeInflation, safeYears) : safeTarget;
    const months = safeYears * 12;
    const secureMonthly = sipRequired(adjustedTarget, safeSecureRate, months);
    const volatileWorstMonthly = sipRequired(adjustedTarget, safeVolatileWorst, months);
    const volatileBaseMonthly = sipRequired(adjustedTarget, safeVolatileBase, months);
    const volatileBestMonthly = sipRequired(adjustedTarget, safeVolatileBest, months);

    return {
      summaryCards: [
        {
          label: t("Tool_goal_Result_AdjustedTarget"),
          value: inr(adjustedTarget),
          footnote: applyInflation
            ? t("Tool_goal_Result_AdjustedFootnoteInflation", safeInflation, safeYears)
            : t("Tool_goal_Result_AdjustedFootnoteToday"),
          variant: "primary" as const,
        },
        {
          label: t("Tool_goal_Result_SecureMonthly"),
          value: inr(secureMonthly),
          footnote: t("Tool_goal_Result_SecureFootnote", safeSecureRate),
          variant: "secure" as const,
        },
        {
          label: t("Tool_goal_Result_VolatileMonthly"),
          value: inr(volatileBaseMonthly),
          footnote: t("Tool_goal_Result_VolatileRange", inr(volatileWorstMonthly), inr(volatileBestMonthly)),
          variant: "volatile" as const,
        },
      ],
      scenarios: [
        {
          name: t("Tool_goal_Scenario_Secure"),
          primaryLabel: t("Common_Label_MonthlySaving"),
          primaryValue: inr(secureMonthly),
          secondaryLabel: t("Common_Label_EndValue"),
          secondaryValue: inr(adjustedTarget),
          variant: "secure",
        },
        {
          name: t("Tool_goal_Scenario_VolatileWorst"),
          primaryLabel: t("Common_Label_MonthlySaving"),
          primaryValue: inr(volatileWorstMonthly),
          secondaryLabel: t("Common_Label_Return"),
          secondaryValue: percent(safeVolatileWorst),
          variant: "worst",
        },
        {
          name: t("Tool_goal_Scenario_VolatileBase"),
          primaryLabel: t("Common_Label_MonthlySaving"),
          primaryValue: inr(volatileBaseMonthly),
          secondaryLabel: t("Common_Label_Return"),
          secondaryValue: percent(safeVolatileBase),
          variant: "base",
        },
        {
          name: t("Tool_goal_Scenario_VolatileBest"),
          primaryLabel: t("Common_Label_MonthlySaving"),
          primaryValue: inr(volatileBestMonthly),
          secondaryLabel: t("Common_Label_Return"),
          secondaryValue: percent(safeVolatileBest),
          variant: "best",
        },
      ],
      breakdownRows: sipYearly(volatileBaseMonthly, safeVolatileBase, safeYears).map((r) => ({
        cells: {
          year: t("Common_YearN", r.year),
          invested: inr(r.invested),
          value: inr(r.value),
          gain: inr(r.gain),
        },
      })),
    };
  }, [target, years, applyInflation, inflation, secureRate, volatileWorst, volatileBase, volatileBest, t]);

  return (
    <ToolPageShell
      title={t(tool.titleKey)}
      subtitle={t("Tool_goal_Subtitle")}
      description={t(tool.descriptionKey)}
      icon={tool.icon}
      educate={
        <>
          <div className="fy-info-box">
            <strong>{t("Common_WhatYouLearn")}</strong>
            <p>{t("Tool_goal_LearnText")}</p>
          </div>
          <FormulaWithSteps
            title={t("Tool_goal_FormulaInflationTitle")}
            code="futureTarget = targetToday * (1 + inflationRate) ^ years"
            note={t("Tool_goal_FormulaInflationNote")}
            steps={inflationSteps}
          />
          <FormulaWithSteps
            title={t("Tool_goal_FormulaSipTitle")}
            code={"r = annualReturn / 12\nsip = target * r / ((1 + r) ^ months - 1)"}
            note={t("Tool_goal_FormulaSipNote")}
            steps={sipSteps}
          />
        </>
      }
      results={
        <div className="fy-output-grid">
          <ResultSummaryCards cards={summaryCards} ariaLabel={t("Tool_goal_SummaryAria")} />
          <ScenarioCompare
            title={t("Tool_goal_ScenarioTitle")}
            subtitle={t("Tool_goal_ScenarioSubtitle")}
            scenarios={scenarios}
          />
          <BreakdownTable
            title={t("Tool_goal_BreakdownTitle")}
            subtitle={t("Tool_goal_BreakdownSubtitle")}
            columns={breakdownColumns}
            rows={breakdownRows}
          />
          <WorkedExample
            title={t("Tool_goal_ExampleTitle")}
            subtitle={t("Tool_goal_ExampleSubtitle")}
            steps={exampleSteps}
            sources={exampleSources}
          />
        </div>
      }
      below={<ToolInfoPanel info={goalInfo(t)} />}
    >
      <div className="fy-form-card">
        <h3>{t("Common_YourGoal")}</h3>
        <div className="fy-form-grid">
          <div className="fy-field">
            <label>{t("Tool_goal_LabelTarget")}</label>
            <input
              type="number"
              min={0}
              inputMode="decimal"
              value={target}
              onChange={(e) => setTarget(Math.max(0, Number(e.target.value) || 0))}
            />
          </div>
          <div className="fy-field">
            <label>{t("Tool_goal_LabelHorizon")}</label>
            <input
              type="number"
              min={1}
              max={40}
              inputMode="numeric"
              value={years}
              onChange={(e) => setYears(Math.min(40, Math.max(1, Number(e.target.value) || 1)))}
            />
          </div>
        </div>

        <label className="fy-goal-check">
          <input type="checkbox" checked={applyInflation} onChange={(e) => setApplyInflation(e.target.checked)} />
          {t("Tool_goal_AdjustInflation")}
        </label>

        {applyInflation ? (
          <div className="fy-field fy-field-inline">
            <label>{t("Common_Label_RatePa")}</label>
            <input
              type="number"
              min={0}
              step={0.1}
              inputMode="decimal"
              value={inflation}
              onChange={(e) => setInflation(Math.max(0, Number(e.target.value) || 0))}
            />
          </div>
        ) : null}

        <div className="fy-split-label">{t("Tool_goal_SecurePath")}</div>
        <div className="fy-field fy-field-inline">
          <label>{t("Common_Label_RatePa")}</label>
          <input
            type="number"
            min={0}
            step={0.1}
            inputMode="decimal"
            value={secureRate}
            onChange={(e) => setSecureRate(Math.max(0, Number(e.target.value) || 0))}
          />
        </div>

        <div className="fy-split-label">{t("Tool_goal_VolatilePath")}</div>
        <div className="fy-fd-inputs">
          <div className="fy-field">
            <label>{t("Tool_goal_LabelWorst")}</label>
            <input
              type="number"
              min={0}
              step={0.1}
              inputMode="decimal"
              value={volatileWorst}
              onChange={(e) => setVolatileWorst(Math.max(0, Number(e.target.value) || 0))}
            />
          </div>
          <div className="fy-field">
            <label>{t("Tool_goal_LabelBase")}</label>
            <input
              type="number"
              min={0}
              step={0.1}
              inputMode="decimal"
              value={volatileBase}
              onChange={(e) => setVolatileBase(Math.max(0, Number(e.target.value) || 0))}
            />
          </div>
          <div className="fy-field">
            <label>{t("Tool_goal_LabelBest")}</label>
            <input
              type="number"
              min={0}
              step={0.1}
              inputMode="decimal"
              value={volatileBest}
              onChange={(e) => setVolatileBest(Math.max(0, Number(e.target.value) || 0))}
            />
          </div>
        </div>

        <button type="button" className="fy-btn-calc">
          {t("Common_Calculate")}
        </button>
      </div>
    </ToolPageShell>
  );
}
