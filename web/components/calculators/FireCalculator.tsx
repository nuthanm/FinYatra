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
import { sipRequired } from "@/lib/finance/compound";
import { inr, percent } from "@/lib/finance/format";
import { sipYearly } from "@/lib/finance/projections";
import { getTool } from "@/lib/config/tools";
import { fireInfo, standardGrowthColumns } from "@/lib/tool-page-content";

const INFLATION_RATE = 6;

const GOAL_KEYS = ["Car", "Travel", "House", "Interior", "Marriage", "Other"] as const;
const GOAL_LABEL_KEYS: Record<(typeof GOAL_KEYS)[number], string> = {
  Car: "Tool_fire_Goal_Car",
  Travel: "Tool_fire_Goal_Travel",
  House: "Tool_fire_Goal_House",
  Interior: "Tool_fire_Goal_Interior",
  Marriage: "Tool_fire_Goal_Marriage",
  Other: "Tool_fire_Goal_Other",
};

export function FireCalculator() {
  const t = useT();
  const tool = getTool("fire")!;

  const [currentAge, setCurrentAge] = useState(30);
  const [retirementAge, setRetirementAge] = useState(50);
  const [monthlyExpenses, setMonthlyExpenses] = useState(50000);
  const [returnRate, setReturnRate] = useState(10);
  const [selectedGoals, setSelectedGoals] = useState<Set<string>>(new Set(["Travel", "House"]));

  const breakdownColumns = useMemo(() => standardGrowthColumns(t), [t]);

  const exampleSteps = useMemo(
    () => [
      t("Tool_fire_ExampleStep_1"),
      t("Tool_fire_ExampleStep_2"),
      t("Tool_fire_ExampleStep_3"),
      t("Tool_fire_ExampleStep_4"),
      t("Tool_fire_ExampleStep_5"),
    ],
    [t],
  );

  const goalOptions = useMemo(
    () => GOAL_KEYS.map((key) => ({ key, label: t(GOAL_LABEL_KEYS[key]) })),
    [t],
  );

  const toggleGoal = (goal: string, checked: boolean) => {
    setSelectedGoals((prev) => {
      const next = new Set(prev);
      if (checked) next.add(goal);
      else next.delete(goal);
      return next;
    });
  };

  const { inflationExample, summaryCards, scenarios, breakdownRows, breakdownSubtitle } = useMemo(() => {
    const safeRetirementAge = Math.max(currentAge, retirementAge);
    const years = Math.max(0, safeRetirementAge - currentAge);
    const inflationEx = Math.round(100 * Math.pow(1 + INFLATION_RATE / 100, 5));
    const futureMonthlyExpense = monthlyExpenses * Math.pow(1 + INFLATION_RATE / 100, years);
    const fireCorpus = futureMonthlyExpense * 12 * 25;
    const months = years * 12;
    const monthlyInvestment = sipRequired(fireCorpus, returnRate, months);
    const secureMonthly = sipRequired(fireCorpus, 7, months);
    const volatileBest = sipRequired(fireCorpus, 15, months);

    return {
      inflationExample: inflationEx,
      summaryCards: [
        {
          label: t("Tool_fire_Result_TargetCorpus"),
          value: inr(fireCorpus),
          footnote: t("Tool_fire_Result_CorpusFootnote", inr(futureMonthlyExpense)),
          variant: "primary" as const,
        },
        {
          label: t("Tool_fire_Result_MonthlySip"),
          value: inr(monthlyInvestment),
          footnote: t("Common_Footnote_AtReturn", percent(returnRate)),
        },
        {
          label: t("Tool_fire_Result_YearsToFire"),
          value: String(years),
          footnote: t("Tool_fire_Result_AgeRange", currentAge, safeRetirementAge),
          variant: "secure" as const,
        },
      ],
      scenarios: [
        {
          name: t("Tool_fire_Scenario_Secure"),
          primaryLabel: t("Common_Label_MonthlySip"),
          primaryValue: inr(secureMonthly),
          secondaryLabel: t("Common_Label_Corpus"),
          secondaryValue: inr(fireCorpus),
          variant: "secure",
        },
        {
          name: t("Common_Scenario_YourRate"),
          primaryLabel: t("Common_Label_MonthlySip"),
          primaryValue: inr(monthlyInvestment),
          secondaryLabel: t("Common_Label_Return"),
          secondaryValue: percent(returnRate),
          variant: "base",
        },
        {
          name: t("Tool_fire_Scenario_Volatile"),
          primaryLabel: t("Common_Label_MonthlySip"),
          primaryValue: inr(volatileBest),
          secondaryLabel: t("Common_Label_Return"),
          secondaryValue: "15%",
          variant: "best",
        },
      ],
      breakdownSubtitle: t("Tool_fire_BreakdownSubtitle", inr(monthlyInvestment), returnRate),
      breakdownRows:
        years > 0
          ? sipYearly(monthlyInvestment, returnRate, years).map((r) => ({
              cells: {
                year: t("Common_YearN", r.year),
                invested: inr(r.invested),
                value: inr(r.value),
                gain: inr(r.gain),
              },
            }))
          : [],
    };
  }, [currentAge, retirementAge, monthlyExpenses, returnRate, t]);

  return (
    <ToolPageShell
      title={t(tool.titleKey)}
      subtitle={t("Tool_fire_Subtitle")}
      description={t(tool.descriptionKey)}
      icon={tool.icon}
      educate={
        <>
          <div className="fy-info-box">
            <strong>{t("Tool_fire_LearnTitle")}</strong>
            <p>{t("Tool_fire_LearnText")}</p>
          </div>

          <section className="fy-goals-section">
            <h3>{t("Tool_fire_GoalsTitle")}</h3>
            <div className="fy-goals-grid">
              {goalOptions.map((goal) => (
                <label key={goal.key} className="fy-goal-check">
                  <input
                    type="checkbox"
                    checked={selectedGoals.has(goal.key)}
                    onChange={(e) => toggleGoal(goal.key, e.target.checked)}
                  />
                  {goal.label}
                </label>
              ))}
            </div>
          </section>

          <div className="fy-inflation-card">
            <img className="fy-illus-sm" src="/assets/icons/fy-growth.svg" alt="" />
            <p>
              {t("Tool_fire_InflationIntro")}
              <strong>{t("Tool_fire_InflationToday")}</strong> {t("Tool_fire_InflationBecomes")}{" "}
              <strong>₹{inflationExample}</strong> {t("Tool_fire_InflationYears", INFLATION_RATE)}
            </p>
          </div>

          <div className="fy-formula-box">
            <h4>{t("Tool_fire_RuleTitle")}</h4>
            <p className="example">
              {t("Tool_fire_RuleCorpus")} <strong>{t("Tool_fire_RuleFormula")}</strong> {t("Tool_fire_RuleNote")}
            </p>
          </div>
        </>
      }
      below={<ToolInfoPanel info={fireInfo(t)} />}
    >
      <div className="fy-form-card">
        <h3>{t("Common_YourInputs")}</h3>
        <div className="fy-field">
          <label>{t("Tool_fire_LabelCurrentAge")}</label>
          <input
            type="number"
            min={0}
            inputMode="numeric"
            value={currentAge}
            onChange={(e) => setCurrentAge(Math.max(0, Number(e.target.value) || 0))}
          />
        </div>
        <div className="fy-field">
          <label>{t("Tool_fire_LabelRetirementAge")}</label>
          <input
            type="number"
            min={0}
            inputMode="numeric"
            value={retirementAge}
            onChange={(e) => setRetirementAge(Math.max(0, Number(e.target.value) || 0))}
          />
        </div>
        <div className="fy-field">
          <label>{t("Tool_fire_LabelExpenses")}</label>
          <input
            type="number"
            min={0}
            inputMode="decimal"
            value={monthlyExpenses}
            onChange={(e) => setMonthlyExpenses(Math.max(0, Number(e.target.value) || 0))}
          />
        </div>
        <div className="fy-field">
          <label>{t("Tool_fire_LabelReturn")}</label>
          <input
            type="number"
            min={0}
            step={0.1}
            inputMode="decimal"
            value={returnRate}
            onChange={(e) => setReturnRate(Math.max(0, Number(e.target.value) || 0))}
          />
        </div>
        <button type="button" className="fy-btn-calc">
          {t("Common_Calculate")}
        </button>
      </div>

      <ResultSummaryCards cards={summaryCards} />
      <ScenarioCompare
        title={t("Tool_fire_ScenarioTitle")}
        subtitle={t("Tool_fire_ScenarioSubtitle")}
        scenarios={scenarios}
      />
      <BreakdownTable
        title={t("Tool_fire_BreakdownTitle")}
        subtitle={breakdownSubtitle}
        columns={breakdownColumns}
        rows={breakdownRows}
      />
      <WorkedExample
        title={t("Tool_fire_ExampleTitle")}
        subtitle={t("Tool_fire_ExampleSubtitle")}
        steps={exampleSteps}
      />

      <div className="fy-quote-panel">
        <blockquote>&ldquo;{t("Tool_fire_Quote")}&rdquo;</blockquote>
        <div className="fy-quote-byline">{t("Common_FinYatraGuide")}</div>
      </div>
    </ToolPageShell>
  );
}
