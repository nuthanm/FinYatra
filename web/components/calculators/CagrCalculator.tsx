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
import { cagr, futureValue } from "@/lib/finance/compound";
import { inr, percent } from "@/lib/finance/format";
import { lumpsumYearly } from "@/lib/finance/projections";
import { getTool } from "@/lib/config/tools";
import { cagrInfo, standardGrowthColumns } from "@/lib/tool-page-content";

export function CagrCalculator() {
  const t = useT();
  const tool = getTool("cagr")!;

  const [beginning, setBeginning] = useState(100000);
  const [ending, setEnding] = useState(250000);
  const [years, setYears] = useState(5);

  const breakdownColumns = useMemo(() => standardGrowthColumns(t), [t]);

  const exampleSteps = useMemo(
    () => [
      t("Tool_cagr_ExampleStep_1"),
      t("Tool_cagr_ExampleStep_2"),
      t("Tool_cagr_ExampleStep_3"),
      t("Tool_cagr_ExampleStep_4"),
      t("Tool_cagr_ExampleStep_5"),
    ],
    [t],
  );

  const { summaryCards, scenarios, breakdownRows } = useMemo(() => {
    const safeBeginning = Math.max(0, beginning);
    const safeEnding = Math.max(0, ending);
    const safeYears = Math.max(0, years);
    const rate = cagr(safeBeginning, safeEnding, safeYears);
    const impliedEnd = futureValue(safeBeginning, rate, safeYears);
    const conservative = cagr(safeBeginning, safeEnding * 0.85, safeYears);
    const optimistic = cagr(safeBeginning, safeEnding * 1.15, safeYears);

    return {
      summaryCards: [
        {
          label: t("Tool_cagr_Result_Beginning"),
          value: inr(safeBeginning),
          footnote: t("Tool_cagr_Result_BeginningFootnote"),
        },
        {
          label: t("Tool_cagr_Result_Cagr"),
          value: percent(rate),
          footnote: t("Common_Footnote_AfterYears", safeYears),
          variant: "primary" as const,
        },
        {
          label: t("Tool_cagr_Result_Ending"),
          value: inr(safeEnding),
          footnote: t("Tool_cagr_Result_EndingFootnote", inr(impliedEnd)),
          variant: "volatile" as const,
        },
      ],
      scenarios: [
        {
          name: t("Tool_cagr_Scenario_Conservative"),
          primaryLabel: t("Tool_cagr_Result_Cagr"),
          primaryValue: percent(conservative),
          secondaryLabel: t("Common_Label_FutureValue"),
          secondaryValue: inr(futureValue(safeBeginning, conservative, safeYears)),
          variant: "worst",
        },
        {
          name: t("Common_Scenario_Base"),
          primaryLabel: t("Tool_cagr_Result_Cagr"),
          primaryValue: percent(rate),
          secondaryLabel: t("Common_Label_FutureValue"),
          secondaryValue: inr(safeEnding),
          variant: "base",
        },
        {
          name: t("Tool_cagr_Scenario_Optimistic"),
          primaryLabel: t("Tool_cagr_Result_Cagr"),
          primaryValue: percent(optimistic),
          secondaryLabel: t("Common_Label_FutureValue"),
          secondaryValue: inr(futureValue(safeBeginning, optimistic, safeYears)),
          variant: "best",
        },
      ],
      breakdownRows:
        rate > 0
          ? lumpsumYearly(safeBeginning, rate, safeYears).map((r) => ({
              cells: {
                year: t("Common_YearN", r.year),
                invested: inr(r.invested),
                value: inr(r.value),
                gain: inr(r.gain),
              },
            }))
          : [],
    };
  }, [beginning, ending, years, t]);

  return (
    <ToolPageShell
      title={t(tool.titleKey)}
      subtitle={t("Tool_cagr_Subtitle")}
      description={t(tool.descriptionKey)}
      icon={tool.icon}
      educate={
        <>
          <div className="fy-info-box">
            <strong>{t("Common_WhatYouLearn")}</strong>
            <p>{t("Tool_cagr_LearnText")}</p>
          </div>
          <FormulaCard
            title={t("Common_Formula")}
            code="CAGR = (Ending / Beginning)^(1/years) - 1"
            note={t("Tool_cagr_FormulaNote")}
          />
        </>
      }
      below={<ToolInfoPanel info={cagrInfo(t)} />}
    >
      <div className="fy-form-card">
        <h3>{t("Common_YourInputs")}</h3>
        <div className="fy-field">
          <label>{t("Tool_cagr_LabelBeginning")}</label>
          <input
            type="number"
            min={0}
            inputMode="decimal"
            value={beginning}
            onChange={(e) => setBeginning(Math.max(0, Number(e.target.value) || 0))}
          />
        </div>
        <div className="fy-field">
          <label>{t("Tool_cagr_LabelEnding")}</label>
          <input
            type="number"
            min={0}
            inputMode="decimal"
            value={ending}
            onChange={(e) => setEnding(Math.max(0, Number(e.target.value) || 0))}
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
        title={t("Tool_cagr_ScenarioTitle")}
        subtitle={t("Tool_cagr_ScenarioSubtitle")}
        scenarios={scenarios}
      />
      <BreakdownTable title={t("Tool_cagr_BreakdownTitle")} columns={breakdownColumns} rows={breakdownRows} />
      <WorkedExample title={t("Tool_cagr_ExampleTitle")} subtitle={t("Tool_cagr_ExampleSubtitle")} steps={exampleSteps} />
    </ToolPageShell>
  );
}
