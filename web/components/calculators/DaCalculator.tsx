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
import { calculateDa } from "@/lib/finance/da";
import { inr, percent } from "@/lib/finance/format";
import { getTool } from "@/lib/config/tools";
import { daInfo } from "@/lib/tool-page-content";

export function DaCalculator() {
  const t = useT();
  const tool = getTool("da")!;

  const [basicPay, setBasicPay] = useState(50_000);
  const [daPercent, setDaPercent] = useState(50);

  const exampleSteps = useMemo(
    () => [
      t("Tool_da_ExampleStep_1"),
      t("Tool_da_ExampleStep_2"),
      t("Tool_da_ExampleStep_3"),
      t("Tool_da_ExampleStep_4"),
      t("Tool_da_ExampleStep_5"),
    ],
    [t],
  );

  const { summaryCards, scenarios } = useMemo(() => {
    const result = calculateDa({ basicPay, daPercent });
    const lower = calculateDa({ basicPay, daPercent: Math.max(0, daPercent - 10) });
    const higher = calculateDa({ basicPay, daPercent: daPercent + 10 });

    return {
      summaryCards: [
        {
          label: t("Tool_da_Result_Da"),
          value: inr(result.daAmount),
          footnote: t("Tool_da_Result_DaFootnote", percent(daPercent)),
          variant: "primary" as const,
        },
        {
          label: t("Tool_da_Result_Total"),
          value: inr(result.total),
          footnote: t("Tool_da_Result_TotalFootnote"),
          variant: "secure" as const,
        },
        {
          label: t("Tool_da_Result_Basic"),
          value: inr(result.basicPay),
          footnote: t("Tool_da_Result_BasicFootnote"),
        },
      ],
      scenarios: [
        {
          name: t("Tool_da_Scenario_Lower"),
          primaryLabel: t("Tool_da_Result_Da"),
          primaryValue: inr(lower.daAmount),
          secondaryLabel: t("Tool_da_Result_Total"),
          secondaryValue: inr(lower.total),
          variant: "worst",
        },
        {
          name: t("Common_Scenario_Base"),
          primaryLabel: t("Tool_da_Result_Da"),
          primaryValue: inr(result.daAmount),
          secondaryLabel: t("Tool_da_Result_Total"),
          secondaryValue: inr(result.total),
          variant: "base",
        },
        {
          name: t("Tool_da_Scenario_Higher"),
          primaryLabel: t("Tool_da_Result_Da"),
          primaryValue: inr(higher.daAmount),
          secondaryLabel: t("Tool_da_Result_Total"),
          secondaryValue: inr(higher.total),
          variant: "best",
        },
      ],
    };
  }, [basicPay, daPercent, t]);

  return (
    <ToolPageShell
      title={t(tool.titleKey)}
      subtitle={t("Tool_da_Subtitle")}
      description={t(tool.descriptionKey)}
      icon={tool.icon}
      educate={
        <>
          <div className="fy-info-box">
            <strong>{t("Common_WhatYouLearn")}</strong>
            <p>{t("Tool_da_LearnText")}</p>
          </div>
          <FormulaCard
            title={t("Common_Formula")}
            code={"DA = Basic × DA% / 100\nTotal = Basic + DA"}
            note={t("Tool_da_FormulaNote")}
          />
        </>
      }
      below={<ToolInfoPanel info={daInfo(t)} />}
    >
      <div className="fy-form-card">
        <h3>{t("Common_YourInputs")}</h3>
        <div className="fy-field">
          <label>{t("Tool_da_LabelBasic")}</label>
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
          <label>{t("Tool_da_LabelPercent")}</label>
          <input
            type="number"
            min={0}
            max={200}
            step={0.5}
            inputMode="decimal"
            value={daPercent}
            onChange={(e) => setDaPercent(Math.max(0, Number(e.target.value) || 0))}
          />
          <p className="fy-field-hint">{t("Tool_da_PercentHint")}</p>
        </div>
        <button type="button" className="fy-btn-calc">
          {t("Common_Calculate")}
        </button>
      </div>

      <ResultSummaryCards cards={summaryCards} />
      <ScenarioCompare
        title={t("Tool_da_ScenarioTitle")}
        subtitle={t("Tool_da_ScenarioSubtitle")}
        scenarios={scenarios}
      />
      <WorkedExample title={t("Tool_da_ExampleTitle")} subtitle={t("Tool_da_ExampleSubtitle")} steps={exampleSteps} />
    </ToolPageShell>
  );
}
