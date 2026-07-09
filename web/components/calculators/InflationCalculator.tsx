"use client";

import { useMemo, useState } from "react";
import { useT } from "@/components/providers/I18nProvider";
import {
  BreakdownTable,
  FormulaCard,
  ResultSummaryCards,
  ScenarioCompare,
  ToolInfoPanel,
  ToolPageShell,
  WorkedExample,
} from "@/components/calculator/CalculatorUi";
import { futureValue } from "@/lib/finance/compound";
import { inr, percent } from "@/lib/finance/format";
import { inflationYearly } from "@/lib/finance/projections";
import { getTool } from "@/lib/config/tools";
import { inflationInfo } from "@/lib/tool-page-content";

export function InflationCalculator() {
  const t = useT();
  const tool = getTool("inflation")!;

  const [present, setPresent] = useState(100000);
  const [inflation, setInflation] = useState(6);
  const [years, setYears] = useState(10);

  const breakdownColumns = useMemo(
    () => [
      { key: "year", header: t("Common_Year"), alignRight: false as const },
      { key: "present", header: t("Common_Col_TodaysValue") },
      { key: "future", header: t("Common_Col_FutureCost") },
      { key: "increase", header: t("Common_Col_Increase") },
    ],
    [t],
  );

  const exampleSteps = useMemo(
    () => [
      t("Tool_inflation_ExampleStep_1"),
      t("Tool_inflation_ExampleStep_2"),
      t("Tool_inflation_ExampleStep_3"),
      t("Tool_inflation_ExampleStep_4"),
      t("Tool_inflation_ExampleStep_5"),
    ],
    [t],
  );

  const { summaryCards, scenarios, breakdownRows } = useMemo(() => {
    const safePresent = Math.max(0, present);
    const safeInflation = Math.max(0, inflation);
    const safeYears = Math.max(0, years);
    const future = futureValue(safePresent, safeInflation, safeYears);
    const lowInflation = futureValue(safePresent, 4, safeYears);
    const highInflation = futureValue(safePresent, 8, safeYears);

    return {
      summaryCards: [
        {
          label: t("Tool_inflation_Result_CostToday"),
          value: inr(safePresent),
          footnote: t("Tool_inflation_Result_PresentFootnote"),
        },
        {
          label: t("Tool_inflation_Result_FutureCost"),
          value: inr(future),
          footnote: t("Common_Footnote_AfterYears", safeYears),
          variant: "primary" as const,
        },
        {
          label: t("Tool_inflation_Result_IncreaseNeeded"),
          value: inr(future - safePresent),
          footnote: t("Common_Footnote_InflationRate", percent(safeInflation)),
          variant: "volatile" as const,
        },
      ],
      scenarios: [
        {
          name: t("Tool_inflation_Scenario_Low"),
          primaryLabel: t("Common_Col_FutureCost"),
          primaryValue: inr(lowInflation),
          secondaryLabel: t("Common_Label_Increase"),
          secondaryValue: inr(lowInflation - safePresent),
          variant: "best",
        },
        {
          name: t("Common_Scenario_YourRate"),
          primaryLabel: t("Common_Col_FutureCost"),
          primaryValue: inr(future),
          secondaryLabel: t("Common_Label_Increase"),
          secondaryValue: inr(future - safePresent),
          variant: "base",
        },
        {
          name: t("Tool_inflation_Scenario_High"),
          primaryLabel: t("Common_Col_FutureCost"),
          primaryValue: inr(highInflation),
          secondaryLabel: t("Common_Label_Increase"),
          secondaryValue: inr(highInflation - safePresent),
          variant: "worst",
        },
      ],
      breakdownRows: inflationYearly(safePresent, safeInflation, safeYears).map((r) => ({
        cells: {
          year: t("Common_YearN", r.year),
          present: inr(safePresent),
          future: inr(r.value),
          increase: inr(r.gain),
        },
      })),
    };
  }, [present, inflation, years, t]);

  return (
    <ToolPageShell
      title={t(tool.titleKey)}
      subtitle={t("Tool_inflation_Subtitle")}
      description={t(tool.descriptionKey)}
      icon={tool.icon}
      educate={
        <>
          <div className="fy-info-box">
            <strong>{t("Common_WhatYouLearn")}</strong>
            <p>{t("Tool_inflation_LearnText")}</p>
          </div>
          <FormulaCard
            title={t("Common_Formula")}
            code="future_cost = present * (1 + i)^years"
            note={t("Tool_inflation_FormulaNote")}
          />
        </>
      }
      below={<ToolInfoPanel info={inflationInfo(t)} />}
    >
      <div className="fy-form-card">
        <h3>{t("Common_YourInputs")}</h3>
        <div className="fy-field">
          <label>{t("Tool_inflation_LabelPresent")}</label>
          <input
            type="number"
            min={0}
            inputMode="decimal"
            value={present}
            onChange={(e) => setPresent(Math.max(0, Number(e.target.value) || 0))}
          />
        </div>
        <div className="fy-field">
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
        <div className="fy-field">
          <label>{t("Common_Label_Years")}</label>
          <input
            type="number"
            min={0}
            step={1}
            inputMode="numeric"
            value={years}
            onChange={(e) => setYears(Math.max(0, Number(e.target.value) || 0))}
          />
        </div>
        <button type="button" className="fy-btn-calc">
          {t("Common_Calculate")}
        </button>
      </div>

      <ResultSummaryCards cards={summaryCards} />
      <ScenarioCompare
        title={t("Tool_inflation_ScenarioTitle")}
        subtitle={t("Tool_inflation_ScenarioSubtitle")}
        scenarios={scenarios}
      />
      <BreakdownTable
        title={t("Tool_inflation_BreakdownTitle")}
        columns={breakdownColumns}
        rows={breakdownRows}
      />
      <WorkedExample
        title={t("Tool_inflation_ExampleTitle")}
        subtitle={t("Tool_inflation_ExampleSubtitle")}
        steps={exampleSteps}
      />
    </ToolPageShell>
  );
}
