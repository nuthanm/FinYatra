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
import { calculateRentIncrease } from "@/lib/finance/rentIncrease";
import { inr, percent } from "@/lib/finance/format";
import { getTool } from "@/lib/config/tools";
import { rentIncreaseInfo } from "@/lib/tool-page-content";

export function RentIncreaseCalculator() {
  const t = useT();
  const tool = getTool("rent-increase")!;

  const [rent, setRent] = useState(25_000);
  const [increasePct, setIncreasePct] = useState(5);
  const [years, setYears] = useState(5);

  const exampleSteps = useMemo(
    () => [
      t("Tool_rent_increase_ExampleStep_1"),
      t("Tool_rent_increase_ExampleStep_2"),
      t("Tool_rent_increase_ExampleStep_3"),
      t("Tool_rent_increase_ExampleStep_4"),
      t("Tool_rent_increase_ExampleStep_5"),
    ],
    [t],
  );

  const { summaryCards, scenarios } = useMemo(() => {
    const result = calculateRentIncrease({
      currentMonthlyRent: rent,
      increasePercentPerYear: increasePct,
      years,
    });
    const low = calculateRentIncrease({
      currentMonthlyRent: rent,
      increasePercentPerYear: Math.max(0, increasePct - 2),
      years,
    });
    const high = calculateRentIncrease({
      currentMonthlyRent: rent,
      increasePercentPerYear: increasePct + 3,
      years,
    });

    return {
      summaryCards: [
        {
          label: t("Tool_rent_increase_Result_Final"),
          value: inr(result.finalMonthlyRent),
          footnote: t("Tool_rent_increase_Result_FinalFootnote", years),
          variant: "primary" as const,
        },
        {
          label: t("Tool_rent_increase_Result_Annual"),
          value: inr(result.finalAnnualRent),
          footnote: t("Tool_rent_increase_Result_AnnualFootnote"),
        },
        {
          label: t("Tool_rent_increase_Result_Total"),
          value: inr(result.totalRentPaid),
          footnote: t("Tool_rent_increase_Result_TotalFootnote", years),
          variant: "volatile" as const,
        },
      ],
      scenarios: [
        {
          name: t("Tool_rent_increase_Scenario_Low"),
          primaryLabel: t("Tool_rent_increase_Result_Final"),
          primaryValue: inr(low.finalMonthlyRent),
          secondaryLabel: t("Tool_rent_increase_Result_Total"),
          secondaryValue: inr(low.totalRentPaid),
          variant: "worst" as const,
        },
        {
          name: t("Common_Scenario_Base"),
          primaryLabel: t("Tool_rent_increase_Result_Final"),
          primaryValue: inr(result.finalMonthlyRent),
          secondaryLabel: t("Tool_rent_increase_Result_Total"),
          secondaryValue: inr(result.totalRentPaid),
          variant: "base" as const,
        },
        {
          name: t("Tool_rent_increase_Scenario_High"),
          primaryLabel: t("Tool_rent_increase_Result_Final"),
          primaryValue: inr(high.finalMonthlyRent),
          secondaryLabel: t("Tool_rent_increase_Result_Total"),
          secondaryValue: inr(high.totalRentPaid),
          variant: "best" as const,
        },
      ],
    };
  }, [rent, increasePct, years, t]);

  return (
    <ToolPageShell
      title={t(tool.titleKey)}
      subtitle={t("Tool_rent_increase_Subtitle")}
      description={t(tool.descriptionKey)}
      icon={tool.icon}
      educate={
        <>
          <div className="fy-info-box">
            <strong>{t("Common_WhatYouLearn")}</strong>
            <p>{t("Tool_rent_increase_LearnText")}</p>
          </div>
          <FormulaCard
            title={t("Common_Formula")}
            code={"Year n rent = current × (1 + %)^(n−1)\nSum annual rents over years"}
            note={t("Tool_rent_increase_FormulaNote")}
          />
        </>
      }
      below={<ToolInfoPanel info={rentIncreaseInfo(t)} />}
    >
      <div className="fy-form-card">
        <h3>{t("Common_YourInputs")}</h3>
        <div className="fy-field">
          <label>{t("Tool_rent_increase_LabelRent")}</label>
          <input
            type="number"
            min={0}
            step={1000}
            inputMode="decimal"
            value={rent}
            onChange={(e) => setRent(Math.max(0, Number(e.target.value) || 0))}
          />
        </div>
        <div className="fy-field">
          <label>{t("Tool_rent_increase_LabelIncrease")}</label>
          <input
            type="number"
            min={0}
            step={0.5}
            inputMode="decimal"
            value={increasePct}
            onChange={(e) => setIncreasePct(Math.max(0, Number(e.target.value) || 0))}
          />
          <p className="fy-hint">{percent(increasePct)} / year</p>
        </div>
        <div className="fy-field">
          <label>{t("Tool_rent_increase_LabelYears")}</label>
          <input
            type="number"
            min={1}
            max={30}
            step={1}
            inputMode="numeric"
            value={years}
            onChange={(e) => setYears(Math.max(1, Number(e.target.value) || 1))}
          />
        </div>
        <button type="button" className="fy-btn-calc">
          {t("Common_Calculate")}
        </button>
      </div>

      <ResultSummaryCards cards={summaryCards} />
      <ScenarioCompare
        title={t("Tool_rent_increase_ScenarioTitle")}
        subtitle={t("Tool_rent_increase_ScenarioSubtitle")}
        scenarios={scenarios}
      />
      <WorkedExample
        title={t("Tool_rent_increase_ExampleTitle")}
        subtitle={t("Tool_rent_increase_ExampleSubtitle")}
        steps={exampleSteps}
      />
    </ToolPageShell>
  );
}
