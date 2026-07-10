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
import { calculateChildEducation } from "@/lib/finance/childEducation";
import { inr, percent } from "@/lib/finance/format";
import { getTool } from "@/lib/config/tools";
import { childEducationInfo } from "@/lib/tool-page-content";

export function ChildEducationCalculator() {
  const t = useT();
  const tool = getTool("child-education")!;

  const [currentCost, setCurrentCost] = useState(2_000_000);
  const [years, setYears] = useState(12);
  const [inflation, setInflation] = useState(10);
  const [rate, setRate] = useState(12);

  const exampleSteps = useMemo(
    () => [
      t("Tool_child_education_ExampleStep_1"),
      t("Tool_child_education_ExampleStep_2"),
      t("Tool_child_education_ExampleStep_3"),
      t("Tool_child_education_ExampleStep_4"),
      t("Tool_child_education_ExampleStep_5"),
    ],
    [t],
  );

  const { summaryCards, scenarios } = useMemo(() => {
    const base = calculateChildEducation({
      currentCost,
      yearsUntilNeeded: years,
      inflationPercent: inflation,
      expectedReturnPercent: rate,
    });
    const lowReturn = calculateChildEducation({
      currentCost,
      yearsUntilNeeded: years,
      inflationPercent: inflation,
      expectedReturnPercent: Math.max(0, rate - 3),
    });
    const highReturn = calculateChildEducation({
      currentCost,
      yearsUntilNeeded: years,
      inflationPercent: inflation,
      expectedReturnPercent: rate + 3,
    });

    return {
      summaryCards: [
        {
          label: t("Tool_child_education_Result_Future"),
          value: inr(base.futureCost),
          footnote: t(
            "Tool_child_education_Result_FutureFootnote",
            years,
            percent(inflation),
          ),
          variant: "primary" as const,
        },
        {
          label: t("Tool_child_education_Result_Sip"),
          value: inr(base.monthlySip),
          footnote: t("Tool_child_education_Result_SipFootnote", percent(rate)),
          variant: "secure" as const,
        },
        {
          label: t("Tool_child_education_Result_Invested"),
          value: inr(base.totalInvested),
          footnote: t("Tool_child_education_Result_InvestedFootnote", base.months),
        },
      ],
      scenarios: [
        {
          name: t("Tool_child_education_Scenario_Lower"),
          primaryLabel: t("Tool_child_education_Result_Sip"),
          primaryValue: inr(lowReturn.monthlySip),
          secondaryLabel: t("Common_Label_Return"),
          secondaryValue: percent(Math.max(0, rate - 3)),
          variant: "worst",
        },
        {
          name: t("Common_Scenario_Base"),
          primaryLabel: t("Tool_child_education_Result_Sip"),
          primaryValue: inr(base.monthlySip),
          secondaryLabel: t("Common_Label_Return"),
          secondaryValue: percent(rate),
          variant: "base",
        },
        {
          name: t("Tool_child_education_Scenario_Higher"),
          primaryLabel: t("Tool_child_education_Result_Sip"),
          primaryValue: inr(highReturn.monthlySip),
          secondaryLabel: t("Common_Label_Return"),
          secondaryValue: percent(rate + 3),
          variant: "best",
        },
      ],
    };
  }, [currentCost, years, inflation, rate, t]);

  return (
    <ToolPageShell
      title={t(tool.titleKey)}
      subtitle={t("Tool_child_education_Subtitle")}
      description={t(tool.descriptionKey)}
      icon={tool.icon}
      educate={
        <>
          <div className="fy-info-box">
            <strong>{t("Common_WhatYouLearn")}</strong>
            <p>{t("Tool_child_education_LearnText")}</p>
          </div>
          <FormulaCard
            title={t("Common_Formula")}
            code={"futureCost = current × (1 + inflation)^years\nSIP = sipRequired(futureCost, return, months)"}
            note={t("Tool_child_education_FormulaNote")}
          />
        </>
      }
      below={<ToolInfoPanel info={childEducationInfo(t)} />}
    >
      <div className="fy-form-card">
        <h3>{t("Common_YourInputs")}</h3>
        <div className="fy-field">
          <label>{t("Tool_child_education_LabelCost")}</label>
          <input
            type="number"
            min={0}
            step={50000}
            inputMode="decimal"
            value={currentCost}
            onChange={(e) => setCurrentCost(Math.max(0, Number(e.target.value) || 0))}
          />
          <p className="fy-field-hint">{t("Tool_child_education_CostHint")}</p>
        </div>
        <div className="fy-field">
          <label>{t("Tool_child_education_LabelYears")}</label>
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
        <div className="fy-field">
          <label>{t("Tool_child_education_LabelInflation")}</label>
          <input
            type="number"
            min={0}
            step={0.5}
            inputMode="decimal"
            value={inflation}
            onChange={(e) => setInflation(Math.max(0, Number(e.target.value) || 0))}
          />
          <p className="fy-field-hint">{t("Tool_child_education_InflationHint")}</p>
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
          <p className="fy-field-hint">{t("Tool_child_education_RateHint")}</p>
        </div>
        <button type="button" className="fy-btn-calc">
          {t("Common_Calculate")}
        </button>
      </div>

      <ResultSummaryCards cards={summaryCards} />
      <ScenarioCompare
        title={t("Tool_child_education_ScenarioTitle")}
        subtitle={t("Tool_child_education_ScenarioSubtitle")}
        scenarios={scenarios}
      />
      <WorkedExample
        title={t("Tool_child_education_ExampleTitle")}
        subtitle={t("Tool_child_education_ExampleSubtitle")}
        steps={exampleSteps}
      />
    </ToolPageShell>
  );
}
