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
import { calculateInHandSalary } from "@/lib/finance/inHandSalary";
import { inr, percent } from "@/lib/finance/format";
import { getTool } from "@/lib/config/tools";
import { inHandSalaryInfo } from "@/lib/tool-page-content";

export function InHandSalaryCalculator() {
  const t = useT();
  const tool = getTool("in-hand-salary")!;

  const [ctc, setCtc] = useState(12_00_000);
  const [basicPercent, setBasicPercent] = useState(40);
  const [useNewRegime, setUseNewRegime] = useState(true);
  const [isMetro, setIsMetro] = useState(true);

  const exampleSteps = useMemo(
    () => [
      t("Tool_in_hand_salary_ExampleStep_1"),
      t("Tool_in_hand_salary_ExampleStep_2"),
      t("Tool_in_hand_salary_ExampleStep_3"),
      t("Tool_in_hand_salary_ExampleStep_4"),
      t("Tool_in_hand_salary_ExampleStep_5"),
    ],
    [t],
  );

  const { summaryCards, scenarios } = useMemo(() => {
    const result = calculateInHandSalary({
      ctcAnnual: ctc,
      basicPercent,
      useNewRegime,
      isMetro,
    });
    const lowerCtc = calculateInHandSalary({
      ctcAnnual: Math.round(ctc * 0.85),
      basicPercent,
      useNewRegime,
      isMetro,
    });
    const higherBasic = calculateInHandSalary({
      ctcAnnual: ctc,
      basicPercent: Math.min(60, basicPercent + 10),
      useNewRegime,
      isMetro,
    });

    return {
      summaryCards: [
        {
          label: t("Tool_in_hand_salary_Result_Monthly"),
          value: inr(result.inHandMonthly),
          footnote: t("Tool_in_hand_salary_Result_MonthlyFootnote"),
          variant: "primary" as const,
        },
        {
          label: t("Tool_in_hand_salary_Result_Annual"),
          value: inr(result.inHandAnnual),
          footnote: t(
            "Tool_in_hand_salary_Result_AnnualFootnote",
            percent(result.takeHomeRatioPercent, 1),
          ),
          variant: "secure" as const,
        },
        {
          label: t("Tool_in_hand_salary_Result_Tax"),
          value: inr(result.estimatedTaxAnnual / 12),
          footnote: t("Tool_in_hand_salary_Result_TaxFootnote"),
        },
      ],
      scenarios: [
        {
          name: t("Tool_in_hand_salary_Scenario_Lower"),
          primaryLabel: t("Tool_in_hand_salary_Result_Monthly"),
          primaryValue: inr(lowerCtc.inHandMonthly),
          secondaryLabel: t("Tool_in_hand_salary_Result_Annual"),
          secondaryValue: inr(lowerCtc.inHandAnnual),
          variant: "worst" as const,
        },
        {
          name: t("Common_Scenario_Base"),
          primaryLabel: t("Tool_in_hand_salary_Result_Monthly"),
          primaryValue: inr(result.inHandMonthly),
          secondaryLabel: t("Tool_in_hand_salary_Result_Ratio"),
          secondaryValue: percent(result.takeHomeRatioPercent, 1),
          variant: "base" as const,
        },
        {
          name: t("Tool_in_hand_salary_Scenario_HigherBasic"),
          primaryLabel: t("Tool_in_hand_salary_Result_Monthly"),
          primaryValue: inr(higherBasic.inHandMonthly),
          secondaryLabel: t("Tool_in_hand_salary_Result_Pf"),
          secondaryValue: inr(higherBasic.monthlyEmployeePf),
          variant: "best" as const,
        },
      ],
    };
  }, [ctc, basicPercent, useNewRegime, isMetro, t]);

  return (
    <ToolPageShell
      title={t(tool.titleKey)}
      subtitle={t("Tool_in_hand_salary_Subtitle")}
      description={t(tool.descriptionKey)}
      icon={tool.icon}
      educate={
        <>
          <div className="fy-info-box">
            <strong>{t("Common_WhatYouLearn")}</strong>
            <p>{t("Tool_in_hand_salary_LearnText")}</p>
          </div>
          <FormulaCard
            title={t("Common_Formula")}
            code={
              "Gross ≈ CTC − employer PF − gratuity\nIn-hand ≈ gross − PF − PT − tax\nMonthly = annual ÷ 12"
            }
            note={t("Tool_in_hand_salary_FormulaNote")}
          />
        </>
      }
      below={<ToolInfoPanel info={inHandSalaryInfo(t)} />}
    >
      <div className="fy-form-card">
        <h3>{t("Common_YourInputs")}</h3>
        <div className="fy-field">
          <label>{t("Tool_in_hand_salary_LabelCtc")}</label>
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
          <label>{t("Tool_in_hand_salary_LabelBasic")}</label>
          <input
            type="number"
            min={20}
            max={80}
            step={1}
            inputMode="decimal"
            value={basicPercent}
            onChange={(e) => setBasicPercent(Math.max(20, Number(e.target.value) || 40))}
          />
          <p className="fy-field-hint">{t("Tool_in_hand_salary_BasicHint")}</p>
        </div>
        <div className="fy-field">
          <label>{t("Tool_in_hand_salary_LabelRegime")}</label>
          <select
            value={useNewRegime ? "new" : "old"}
            onChange={(e) => setUseNewRegime(e.target.value === "new")}
          >
            <option value="new">{t("Tool_in_hand_salary_Regime_New")}</option>
            <option value="old">{t("Tool_in_hand_salary_Regime_Old")}</option>
          </select>
        </div>
        <div className="fy-field">
          <label>{t("Tool_in_hand_salary_LabelCity")}</label>
          <select
            value={isMetro ? "metro" : "non"}
            onChange={(e) => setIsMetro(e.target.value === "metro")}
          >
            <option value="metro">{t("Tool_in_hand_salary_City_Metro")}</option>
            <option value="non">{t("Tool_in_hand_salary_City_Non")}</option>
          </select>
        </div>
        <button type="button" className="fy-btn-calc">
          {t("Common_Calculate")}
        </button>
      </div>

      <ResultSummaryCards cards={summaryCards} />
      <ScenarioCompare
        title={t("Tool_in_hand_salary_ScenarioTitle")}
        subtitle={t("Tool_in_hand_salary_ScenarioSubtitle")}
        scenarios={scenarios}
      />
      <WorkedExample
        title={t("Tool_in_hand_salary_ExampleTitle")}
        subtitle={t("Tool_in_hand_salary_ExampleSubtitle")}
        steps={exampleSteps}
      />
    </ToolPageShell>
  );
}
