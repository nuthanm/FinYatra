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
import { calculateDaArrears } from "@/lib/finance/daArrears";
import { inr, percent } from "@/lib/finance/format";
import { getTool } from "@/lib/config/tools";
import { daArrearsInfo } from "@/lib/tool-page-content";

export function DaArrearsCalculator() {
  const t = useT();
  const tool = getTool("da-arrears")!;

  const [basicPay, setBasicPay] = useState(50_000);
  const [oldDa, setOldDa] = useState(50);
  const [newDa, setNewDa] = useState(53);
  const [months, setMonths] = useState(6);

  const exampleSteps = useMemo(
    () => [
      t("Tool_da_arrears_ExampleStep_1"),
      t("Tool_da_arrears_ExampleStep_2"),
      t("Tool_da_arrears_ExampleStep_3"),
      t("Tool_da_arrears_ExampleStep_4"),
      t("Tool_da_arrears_ExampleStep_5"),
    ],
    [t],
  );

  const { summaryCards, scenarios } = useMemo(() => {
    const result = calculateDaArrears({
      basicPay,
      oldDaPercent: oldDa,
      newDaPercent: newDa,
      months,
    });
    const fewer = calculateDaArrears({
      basicPay,
      oldDaPercent: oldDa,
      newDaPercent: newDa,
      months: Math.max(1, months - 3),
    });
    const more = calculateDaArrears({
      basicPay,
      oldDaPercent: oldDa,
      newDaPercent: newDa,
      months: months + 3,
    });

    return {
      summaryCards: [
        {
          label: t("Tool_da_arrears_Result_Total"),
          value: inr(result.totalArrears),
          footnote: t("Tool_da_arrears_Result_TotalFootnote", months),
          variant: "primary" as const,
        },
        {
          label: t("Tool_da_arrears_Result_Monthly"),
          value: inr(result.monthlyArrear),
          footnote: t(
            "Tool_da_arrears_Result_MonthlyFootnote",
            percent(result.daIncreasePercent, 1),
          ),
        },
        {
          label: t("Tool_da_arrears_Result_NewDa"),
          value: inr(result.newMonthlyDa),
          footnote: t("Tool_da_arrears_Result_NewDaFootnote", percent(newDa, 1)),
          variant: "secure" as const,
        },
      ],
      scenarios: [
        {
          name: t("Tool_da_arrears_Scenario_Fewer"),
          primaryLabel: t("Tool_da_arrears_Result_Total"),
          primaryValue: inr(fewer.totalArrears),
          secondaryLabel: t("Tool_da_arrears_LabelMonths"),
          secondaryValue: String(Math.max(1, months - 3)),
          variant: "best" as const,
        },
        {
          name: t("Common_Scenario_Base"),
          primaryLabel: t("Tool_da_arrears_Result_Total"),
          primaryValue: inr(result.totalArrears),
          secondaryLabel: t("Tool_da_arrears_Result_Monthly"),
          secondaryValue: inr(result.monthlyArrear),
          variant: "base" as const,
        },
        {
          name: t("Tool_da_arrears_Scenario_More"),
          primaryLabel: t("Tool_da_arrears_Result_Total"),
          primaryValue: inr(more.totalArrears),
          secondaryLabel: t("Tool_da_arrears_LabelMonths"),
          secondaryValue: String(months + 3),
          variant: "worst" as const,
        },
      ],
    };
  }, [basicPay, oldDa, newDa, months, t]);

  return (
    <ToolPageShell
      title={t(tool.titleKey)}
      subtitle={t("Tool_da_arrears_Subtitle")}
      description={t(tool.descriptionKey)}
      icon={tool.icon}
      educate={
        <>
          <div className="fy-info-box">
            <strong>{t("Common_WhatYouLearn")}</strong>
            <p>{t("Tool_da_arrears_LearnText")}</p>
          </div>
          <FormulaCard
            title={t("Common_Formula")}
            code={"ΔDA% = new% − old%\nmonthly = basic × ΔDA%\ntotal = monthly × months"}
            note={t("Tool_da_arrears_FormulaNote")}
          />
        </>
      }
      below={<ToolInfoPanel info={daArrearsInfo(t)} />}
    >
      <div className="fy-form-card">
        <h3>{t("Common_YourInputs")}</h3>
        <div className="fy-field">
          <label>{t("Tool_da_arrears_LabelBasic")}</label>
          <input
            type="number"
            min={0}
            step={1000}
            inputMode="decimal"
            value={basicPay}
            onChange={(e) => setBasicPay(Math.max(0, Number(e.target.value) || 0))}
          />
        </div>
        <div className="fy-field">
          <label>{t("Tool_da_arrears_LabelOld")}</label>
          <input
            type="number"
            min={0}
            step={0.5}
            inputMode="decimal"
            value={oldDa}
            onChange={(e) => setOldDa(Math.max(0, Number(e.target.value) || 0))}
          />
        </div>
        <div className="fy-field">
          <label>{t("Tool_da_arrears_LabelNew")}</label>
          <input
            type="number"
            min={0}
            step={0.5}
            inputMode="decimal"
            value={newDa}
            onChange={(e) => setNewDa(Math.max(0, Number(e.target.value) || 0))}
          />
        </div>
        <div className="fy-field">
          <label>{t("Tool_da_arrears_LabelMonths")}</label>
          <input
            type="number"
            min={1}
            max={36}
            step={1}
            inputMode="numeric"
            value={months}
            onChange={(e) => setMonths(Math.max(1, Number(e.target.value) || 1))}
          />
          <p className="fy-field-hint">{t("Tool_da_arrears_MonthsHint")}</p>
        </div>
        <button type="button" className="fy-btn-calc">
          {t("Common_Calculate")}
        </button>
      </div>

      <ResultSummaryCards cards={summaryCards} />
      <ScenarioCompare
        title={t("Tool_da_arrears_ScenarioTitle")}
        subtitle={t("Tool_da_arrears_ScenarioSubtitle")}
        scenarios={scenarios}
      />
      <WorkedExample
        title={t("Tool_da_arrears_ExampleTitle")}
        subtitle={t("Tool_da_arrears_ExampleSubtitle")}
        steps={exampleSteps}
      />
    </ToolPageShell>
  );
}
