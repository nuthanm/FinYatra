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
import { calculateMonthlyBudget } from "@/lib/finance/monthlyBudget";
import { inr, percent } from "@/lib/finance/format";
import { getTool } from "@/lib/config/tools";
import { monthlyBudgetInfo } from "@/lib/tool-page-content";

export function MonthlyBudgetCalculator() {
  const t = useT();
  const tool = getTool("monthly-budget")!;

  const [income, setIncome] = useState(80_000);
  const [needs, setNeeds] = useState(40_000);
  const [wants, setWants] = useState(20_000);
  const [savings, setSavings] = useState(15_000);

  const exampleSteps = useMemo(
    () => [
      t("Tool_monthly_budget_ExampleStep_1"),
      t("Tool_monthly_budget_ExampleStep_2"),
      t("Tool_monthly_budget_ExampleStep_3"),
      t("Tool_monthly_budget_ExampleStep_4"),
      t("Tool_monthly_budget_ExampleStep_5"),
    ],
    [t],
  );

  const { summaryCards, scenarios } = useMemo(() => {
    const result = calculateMonthlyBudget({
      monthlyIncome: income,
      needs,
      wants,
      savings,
    });
    const suggested = calculateMonthlyBudget({
      monthlyIncome: income,
      needs: income * 0.5,
      wants: income * 0.3,
      savings: income * 0.2,
    });
    const tight = calculateMonthlyBudget({
      monthlyIncome: income,
      needs: income * 0.6,
      wants: income * 0.25,
      savings: income * 0.1,
    });

    return {
      summaryCards: [
        {
          label: t("Tool_monthly_budget_Result_Surplus"),
          value: inr(result.surplus),
          footnote:
            result.surplus >= 0
              ? t("Tool_monthly_budget_Result_SurplusFootnote")
              : t("Tool_monthly_budget_Result_DeficitFootnote"),
          variant: (result.surplus >= 0 ? "secure" : "volatile") as "secure" | "volatile",
        },
        {
          label: t("Tool_monthly_budget_Result_Spent"),
          value: inr(result.totalExpenses),
          footnote: t("Tool_monthly_budget_Result_SpentFootnote", inr(income)),
          variant: "primary" as const,
        },
        {
          label: t("Tool_monthly_budget_Result_Split"),
          value: t(
            "Tool_monthly_budget_Result_SplitValue",
            percent(result.needsPct, 0),
            percent(result.wantsPct, 0),
            percent(result.savingsPct, 0),
          ),
          footnote: t("Tool_monthly_budget_Result_SplitFootnote"),
        },
      ],
      scenarios: [
        {
          name: t("Tool_monthly_budget_Scenario_Yours"),
          primaryLabel: t("Tool_monthly_budget_Result_Surplus"),
          primaryValue: inr(result.surplus),
          secondaryLabel: t("Tool_monthly_budget_LabelSavings"),
          secondaryValue: inr(result.savings),
          variant: "base",
        },
        {
          name: t("Tool_monthly_budget_Scenario_502030"),
          primaryLabel: t("Tool_monthly_budget_Result_Surplus"),
          primaryValue: inr(suggested.surplus),
          secondaryLabel: t("Tool_monthly_budget_LabelSavings"),
          secondaryValue: inr(suggested.savings),
          variant: "best",
        },
        {
          name: t("Tool_monthly_budget_Scenario_Tight"),
          primaryLabel: t("Tool_monthly_budget_Result_Surplus"),
          primaryValue: inr(tight.surplus),
          secondaryLabel: t("Tool_monthly_budget_LabelSavings"),
          secondaryValue: inr(tight.savings),
          variant: "worst",
        },
      ],
    };
  }, [income, needs, wants, savings, t]);

  return (
    <ToolPageShell
      title={t(tool.titleKey)}
      subtitle={t("Tool_monthly_budget_Subtitle")}
      description={t(tool.descriptionKey)}
      icon={tool.icon}
      educate={
        <>
          <div className="fy-info-box">
            <strong>{t("Common_WhatYouLearn")}</strong>
            <p>{t("Tool_monthly_budget_LearnText")}</p>
          </div>
          <FormulaCard
            title={t("Common_Formula")}
            code={"surplus = income − (needs + wants + savings)\n50/30/20 → 50% needs · 30% wants · 20% save"}
            note={t("Tool_monthly_budget_FormulaNote")}
          />
        </>
      }
      below={<ToolInfoPanel info={monthlyBudgetInfo(t)} />}
    >
      <div className="fy-form-card">
        <h3>{t("Common_YourInputs")}</h3>
        <div className="fy-field">
          <label>{t("Tool_monthly_budget_LabelIncome")}</label>
          <input
            type="number"
            min={0}
            step={1000}
            inputMode="decimal"
            value={income}
            onChange={(e) => setIncome(Math.max(0, Number(e.target.value) || 0))}
          />
        </div>
        <div className="fy-field">
          <label>{t("Tool_monthly_budget_LabelNeeds")}</label>
          <input
            type="number"
            min={0}
            step={500}
            inputMode="decimal"
            value={needs}
            onChange={(e) => setNeeds(Math.max(0, Number(e.target.value) || 0))}
          />
          <p className="fy-field-hint">{t("Tool_monthly_budget_NeedsHint")}</p>
        </div>
        <div className="fy-field">
          <label>{t("Tool_monthly_budget_LabelWants")}</label>
          <input
            type="number"
            min={0}
            step={500}
            inputMode="decimal"
            value={wants}
            onChange={(e) => setWants(Math.max(0, Number(e.target.value) || 0))}
          />
        </div>
        <div className="fy-field">
          <label>{t("Tool_monthly_budget_LabelSavings")}</label>
          <input
            type="number"
            min={0}
            step={500}
            inputMode="decimal"
            value={savings}
            onChange={(e) => setSavings(Math.max(0, Number(e.target.value) || 0))}
          />
        </div>
        <button type="button" className="fy-btn-calc">
          {t("Common_Calculate")}
        </button>
      </div>

      <ResultSummaryCards cards={summaryCards} />
      <ScenarioCompare
        title={t("Tool_monthly_budget_ScenarioTitle")}
        subtitle={t("Tool_monthly_budget_ScenarioSubtitle")}
        scenarios={scenarios}
      />
      <WorkedExample
        title={t("Tool_monthly_budget_ExampleTitle")}
        subtitle={t("Tool_monthly_budget_ExampleSubtitle")}
        steps={exampleSteps}
      />
    </ToolPageShell>
  );
}
