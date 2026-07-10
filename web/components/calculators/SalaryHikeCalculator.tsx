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
import { calculateSalaryHike } from "@/lib/finance/salaryHike";
import { inr, percent } from "@/lib/finance/format";
import { getTool } from "@/lib/config/tools";
import { salaryHikeInfo } from "@/lib/tool-page-content";

export function SalaryHikeCalculator() {
  const t = useT();
  const tool = getTool("salary-hike")!;

  const [currentCtc, setCurrentCtc] = useState(1_200_000);
  const [hikePercent, setHikePercent] = useState(10);

  const exampleSteps = useMemo(
    () => [
      t("Tool_salary_hike_ExampleStep_1"),
      t("Tool_salary_hike_ExampleStep_2"),
      t("Tool_salary_hike_ExampleStep_3"),
      t("Tool_salary_hike_ExampleStep_4"),
      t("Tool_salary_hike_ExampleStep_5"),
    ],
    [t],
  );

  const { summaryCards, scenarios } = useMemo(() => {
    const result = calculateSalaryHike({ currentCtc, hikePercent });
    const low = calculateSalaryHike({ currentCtc, hikePercent: Math.max(0, hikePercent - 5) });
    const high = calculateSalaryHike({ currentCtc, hikePercent: hikePercent + 5 });

    return {
      summaryCards: [
        {
          label: t("Tool_salary_hike_Result_NewCtc"),
          value: inr(result.newCtc),
          footnote: t("Tool_salary_hike_Result_NewCtcFootnote", percent(hikePercent)),
          variant: "primary" as const,
        },
        {
          label: t("Tool_salary_hike_Result_HikeAmount"),
          value: inr(result.hikeAmount),
          footnote: t("Tool_salary_hike_Result_HikeAmountFootnote"),
          variant: "secure" as const,
        },
        {
          label: t("Tool_salary_hike_Result_Monthly"),
          value: inr(result.monthlyIncrease),
          footnote: t(
            "Tool_salary_hike_Result_MonthlyFootnote",
            inr(result.currentMonthly),
            inr(result.newMonthly),
          ),
        },
      ],
      scenarios: [
        {
          name: t("Tool_salary_hike_Scenario_Lower", percent(Math.max(0, hikePercent - 5))),
          primaryLabel: t("Tool_salary_hike_Result_NewCtc"),
          primaryValue: inr(low.newCtc),
          secondaryLabel: t("Tool_salary_hike_Result_Monthly"),
          secondaryValue: inr(low.monthlyIncrease),
          variant: "worst",
        },
        {
          name: t("Common_Scenario_Base"),
          primaryLabel: t("Tool_salary_hike_Result_NewCtc"),
          primaryValue: inr(result.newCtc),
          secondaryLabel: t("Tool_salary_hike_Result_Monthly"),
          secondaryValue: inr(result.monthlyIncrease),
          variant: "base",
        },
        {
          name: t("Tool_salary_hike_Scenario_Higher", percent(hikePercent + 5)),
          primaryLabel: t("Tool_salary_hike_Result_NewCtc"),
          primaryValue: inr(high.newCtc),
          secondaryLabel: t("Tool_salary_hike_Result_Monthly"),
          secondaryValue: inr(high.monthlyIncrease),
          variant: "best",
        },
      ],
    };
  }, [currentCtc, hikePercent, t]);

  return (
    <ToolPageShell
      title={t(tool.titleKey)}
      subtitle={t("Tool_salary_hike_Subtitle")}
      description={t(tool.descriptionKey)}
      icon={tool.icon}
      educate={
        <>
          <div className="fy-info-box">
            <strong>{t("Common_WhatYouLearn")}</strong>
            <p>{t("Tool_salary_hike_LearnText")}</p>
          </div>
          <FormulaCard
            title={t("Common_Formula")}
            code={
              "newCTC = currentCTC × (1 + hike% / 100)\nmonthlyIncrease = (newCTC − currentCTC) / 12"
            }
            note={t("Tool_salary_hike_FormulaNote")}
          />
        </>
      }
      below={<ToolInfoPanel info={salaryHikeInfo(t)} />}
    >
      <div className="fy-form-card">
        <h3>{t("Common_YourInputs")}</h3>
        <div className="fy-field">
          <label>{t("Tool_salary_hike_LabelCtc")}</label>
          <input
            type="number"
            min={0}
            step={10000}
            inputMode="decimal"
            value={currentCtc}
            onChange={(e) => setCurrentCtc(Math.max(0, Number(e.target.value) || 0))}
          />
        </div>
        <div className="fy-field">
          <label>{t("Tool_salary_hike_LabelHike")}</label>
          <input
            type="number"
            min={0}
            step={0.5}
            inputMode="decimal"
            value={hikePercent}
            onChange={(e) => setHikePercent(Math.max(0, Number(e.target.value) || 0))}
          />
          <p className="fy-field-hint">{t("Tool_salary_hike_HikeHint")}</p>
        </div>
        <button type="button" className="fy-btn-calc">
          {t("Common_Calculate")}
        </button>
      </div>

      <ResultSummaryCards cards={summaryCards} />
      <ScenarioCompare
        title={t("Tool_salary_hike_ScenarioTitle")}
        subtitle={t("Tool_salary_hike_ScenarioSubtitle")}
        scenarios={scenarios}
      />
      <WorkedExample
        title={t("Tool_salary_hike_ExampleTitle")}
        subtitle={t("Tool_salary_hike_ExampleSubtitle")}
        steps={exampleSteps}
      />
    </ToolPageShell>
  );
}
