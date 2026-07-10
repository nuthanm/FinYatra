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
import { calculateRentalYield } from "@/lib/finance/rentalYield";
import { inr, percent } from "@/lib/finance/format";
import { getTool } from "@/lib/config/tools";
import { rentalYieldInfo } from "@/lib/tool-page-content";

export function RentalYieldCalculator() {
  const t = useT();
  const tool = getTool("rental-yield")!;

  const [propertyValue, setPropertyValue] = useState(1_00_00_000);
  const [monthlyRent, setMonthlyRent] = useState(40_000);
  const [annualExpenses, setAnnualExpenses] = useState(60_000);

  const exampleSteps = useMemo(
    () => [
      t("Tool_rental_yield_ExampleStep_1"),
      t("Tool_rental_yield_ExampleStep_2"),
      t("Tool_rental_yield_ExampleStep_3"),
      t("Tool_rental_yield_ExampleStep_4"),
      t("Tool_rental_yield_ExampleStep_5"),
    ],
    [t],
  );

  const { summaryCards, scenarios } = useMemo(() => {
    const annualRent = monthlyRent * 12;
    const result = calculateRentalYield({
      propertyValue,
      annualRent,
      annualExpenses,
    });
    const lowerRent = calculateRentalYield({
      propertyValue,
      annualRent: Math.round(annualRent * 0.8),
      annualExpenses,
    });
    const higherRent = calculateRentalYield({
      propertyValue,
      annualRent: Math.round(annualRent * 1.2),
      annualExpenses,
    });

    return {
      summaryCards: [
        {
          label: t("Tool_rental_yield_Result_Gross"),
          value: percent(result.grossYieldPercent, 2),
          footnote: t("Tool_rental_yield_Result_GrossFootnote", inr(result.annualRent)),
          variant: "primary" as const,
        },
        {
          label: t("Tool_rental_yield_Result_Net"),
          value: percent(result.netYieldPercent, 2),
          footnote: t("Tool_rental_yield_Result_NetFootnote", inr(result.netRent)),
          variant: "secure" as const,
        },
        {
          label: t("Tool_rental_yield_Result_Property"),
          value: inr(result.propertyValue),
          footnote: t("Tool_rental_yield_Result_PropertyFootnote", inr(result.annualExpenses)),
        },
      ],
      scenarios: [
        {
          name: t("Tool_rental_yield_Scenario_Lower"),
          primaryLabel: t("Tool_rental_yield_Result_Gross"),
          primaryValue: percent(lowerRent.grossYieldPercent, 2),
          secondaryLabel: t("Tool_rental_yield_Result_Net"),
          secondaryValue: percent(lowerRent.netYieldPercent, 2),
          variant: "worst" as const,
        },
        {
          name: t("Common_Scenario_Base"),
          primaryLabel: t("Tool_rental_yield_Result_Gross"),
          primaryValue: percent(result.grossYieldPercent, 2),
          secondaryLabel: t("Tool_rental_yield_Result_Net"),
          secondaryValue: percent(result.netYieldPercent, 2),
          variant: "base" as const,
        },
        {
          name: t("Tool_rental_yield_Scenario_Higher"),
          primaryLabel: t("Tool_rental_yield_Result_Gross"),
          primaryValue: percent(higherRent.grossYieldPercent, 2),
          secondaryLabel: t("Tool_rental_yield_Result_Net"),
          secondaryValue: percent(higherRent.netYieldPercent, 2),
          variant: "best" as const,
        },
      ],
    };
  }, [propertyValue, monthlyRent, annualExpenses, t]);

  return (
    <ToolPageShell
      title={t(tool.titleKey)}
      subtitle={t("Tool_rental_yield_Subtitle")}
      description={t(tool.descriptionKey)}
      icon={tool.icon}
      educate={
        <>
          <div className="fy-info-box">
            <strong>{t("Common_WhatYouLearn")}</strong>
            <p>{t("Tool_rental_yield_LearnText")}</p>
          </div>
          <FormulaCard
            title={t("Common_Formula")}
            code={
              "Annual rent = monthly × 12\nGross yield % = annual rent / value × 100\nNet yield % = (rent − expenses) / value × 100"
            }
            note={t("Tool_rental_yield_FormulaNote")}
          />
        </>
      }
      below={<ToolInfoPanel info={rentalYieldInfo(t)} />}
    >
      <div className="fy-form-card">
        <h3>{t("Common_YourInputs")}</h3>
        <div className="fy-field">
          <label>{t("Tool_rental_yield_LabelProperty")}</label>
          <input
            type="number"
            min={0}
            step={100000}
            inputMode="decimal"
            value={propertyValue}
            onChange={(e) => setPropertyValue(Math.max(0, Number(e.target.value) || 0))}
          />
        </div>
        <div className="fy-field">
          <label>{t("Tool_rental_yield_LabelRent")}</label>
          <input
            type="number"
            min={0}
            step={1000}
            inputMode="decimal"
            value={monthlyRent}
            onChange={(e) => setMonthlyRent(Math.max(0, Number(e.target.value) || 0))}
          />
          <p className="fy-field-hint">{t("Tool_rental_yield_RentHint")}</p>
        </div>
        <div className="fy-field">
          <label>{t("Tool_rental_yield_LabelExpenses")}</label>
          <input
            type="number"
            min={0}
            step={1000}
            inputMode="decimal"
            value={annualExpenses}
            onChange={(e) => setAnnualExpenses(Math.max(0, Number(e.target.value) || 0))}
          />
          <p className="fy-field-hint">{t("Tool_rental_yield_ExpensesHint")}</p>
        </div>
        <button type="button" className="fy-btn-calc">
          {t("Common_Calculate")}
        </button>
      </div>

      <ResultSummaryCards cards={summaryCards} />
      <ScenarioCompare
        title={t("Tool_rental_yield_ScenarioTitle")}
        subtitle={t("Tool_rental_yield_ScenarioSubtitle")}
        scenarios={scenarios}
      />
      <WorkedExample
        title={t("Tool_rental_yield_ExampleTitle")}
        subtitle={t("Tool_rental_yield_ExampleSubtitle")}
        steps={exampleSteps}
      />
    </ToolPageShell>
  );
}
