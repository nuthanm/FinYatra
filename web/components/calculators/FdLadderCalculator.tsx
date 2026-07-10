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
import { calculateFdLadder } from "@/lib/finance/fdLadder";
import { inr, percent } from "@/lib/finance/format";
import { getTool } from "@/lib/config/tools";
import { fdLadderInfo } from "@/lib/tool-page-content";

export function FdLadderCalculator() {
  const t = useT();
  const tool = getTool("fd-ladder")!;

  const [total, setTotal] = useState(5_00_000);
  const [rungs, setRungs] = useState(5);
  const [shortest, setShortest] = useState(1);
  const [rate, setRate] = useState(7);

  const exampleSteps = useMemo(
    () => [
      t("Tool_fd_ladder_ExampleStep_1"),
      t("Tool_fd_ladder_ExampleStep_2"),
      t("Tool_fd_ladder_ExampleStep_3"),
      t("Tool_fd_ladder_ExampleStep_4"),
      t("Tool_fd_ladder_ExampleStep_5"),
    ],
    [t],
  );

  const breakdownColumns = useMemo(
    () => [
      { key: "rung", header: t("Tool_fd_ladder_Col_Rung"), alignRight: false as const },
      { key: "years", header: t("Tool_fd_ladder_Col_Years") },
      { key: "principal", header: t("Tool_fd_ladder_Col_Principal") },
      { key: "maturity", header: t("Tool_fd_ladder_Col_Maturity") },
    ],
    [t],
  );

  const { summaryCards, scenarios, breakdownRows } = useMemo(() => {
    const result = calculateFdLadder({
      totalAmount: total,
      rungs,
      shortestYears: shortest,
      annualRatePercent: rate,
    });
    const fewer = calculateFdLadder({
      totalAmount: total,
      rungs: Math.max(2, rungs - 2),
      shortestYears: shortest,
      annualRatePercent: rate,
    });
    const more = calculateFdLadder({
      totalAmount: total,
      rungs: Math.min(10, rungs + 2),
      shortestYears: shortest,
      annualRatePercent: rate,
    });

    return {
      summaryCards: [
        {
          label: t("Tool_fd_ladder_Result_TotalMaturity"),
          value: inr(result.totalMaturity),
          footnote: t("Tool_fd_ladder_Result_TotalMaturityFootnote", String(result.rungs)),
          variant: "primary" as const,
        },
        {
          label: t("Tool_fd_ladder_Result_AvgMaturity"),
          value: `${result.averageMaturityYears.toFixed(1)} yr`,
          footnote: t(
            "Tool_fd_ladder_Result_AvgMaturityFootnote",
            String(result.shortestYears),
            String(result.longestYears),
          ),
          variant: "secure" as const,
        },
        {
          label: t("Tool_fd_ladder_Result_Interest"),
          value: inr(result.totalInterest),
          footnote: t("Tool_fd_ladder_Result_InterestFootnote", percent(rate)),
        },
      ],
      scenarios: [
        {
          name: t("Tool_fd_ladder_Scenario_Fewer"),
          primaryLabel: t("Tool_fd_ladder_Result_AvgMaturity"),
          primaryValue: `${fewer.averageMaturityYears.toFixed(1)}y`,
          secondaryLabel: t("Tool_fd_ladder_Result_Interest"),
          secondaryValue: inr(fewer.totalInterest),
          variant: "worst" as const,
        },
        {
          name: t("Common_Scenario_Base"),
          primaryLabel: t("Tool_fd_ladder_Result_AvgMaturity"),
          primaryValue: `${result.averageMaturityYears.toFixed(1)}y`,
          secondaryLabel: t("Tool_fd_ladder_Result_PerRung"),
          secondaryValue: inr(result.perRungPrincipal),
          variant: "base" as const,
        },
        {
          name: t("Tool_fd_ladder_Scenario_More"),
          primaryLabel: t("Tool_fd_ladder_Result_AvgMaturity"),
          primaryValue: `${more.averageMaturityYears.toFixed(1)}y`,
          secondaryLabel: t("Tool_fd_ladder_Result_Interest"),
          secondaryValue: inr(more.totalInterest),
          variant: "best" as const,
        },
      ],
      breakdownRows: result.ladder.map((r) => ({
        cells: {
          rung: String(r.index),
          years: String(r.years),
          principal: inr(r.principal),
          maturity: inr(r.maturity),
        },
      })),
    };
  }, [total, rungs, shortest, rate, t]);

  return (
    <ToolPageShell
      title={t(tool.titleKey)}
      subtitle={t("Tool_fd_ladder_Subtitle")}
      description={t(tool.descriptionKey)}
      icon={tool.icon}
      educate={
        <>
          <div className="fy-info-box">
            <strong>{t("Common_WhatYouLearn")}</strong>
            <p>{t("Tool_fd_ladder_LearnText")}</p>
          </div>
          <FormulaCard
            title={t("Common_Formula")}
            code={
              "Per rung = total ÷ N\nTenure_i = shortest + (i−1)×step\nAvg maturity = Σ (tenure × principal) / total"
            }
            note={t("Tool_fd_ladder_FormulaNote")}
          />
        </>
      }
      below={<ToolInfoPanel info={fdLadderInfo(t)} />}
    >
      <div className="fy-form-card">
        <h3>{t("Common_YourInputs")}</h3>
        <div className="fy-field">
          <label>{t("Tool_fd_ladder_LabelTotal")}</label>
          <input
            type="number"
            min={0}
            step={50000}
            inputMode="decimal"
            value={total}
            onChange={(e) => setTotal(Math.max(0, Number(e.target.value) || 0))}
          />
        </div>
        <div className="fy-field">
          <label>{t("Tool_fd_ladder_LabelRungs")}</label>
          <input
            type="number"
            min={2}
            max={12}
            step={1}
            inputMode="decimal"
            value={rungs}
            onChange={(e) => setRungs(Math.max(2, Math.min(12, Number(e.target.value) || 5)))}
          />
        </div>
        <div className="fy-field">
          <label>{t("Tool_fd_ladder_LabelShortest")}</label>
          <input
            type="number"
            min={0.5}
            step={0.5}
            inputMode="decimal"
            value={shortest}
            onChange={(e) => setShortest(Math.max(0.5, Number(e.target.value) || 1))}
          />
        </div>
        <div className="fy-field">
          <label>{t("Tool_fd_ladder_LabelRate")}</label>
          <input
            type="number"
            min={0}
            step={0.1}
            inputMode="decimal"
            value={rate}
            onChange={(e) => setRate(Math.max(0, Number(e.target.value) || 0))}
          />
        </div>
        <button type="button" className="fy-btn-calc">
          {t("Common_Calculate")}
        </button>
      </div>

      <ResultSummaryCards cards={summaryCards} />
      <BreakdownTable
        title={t("Tool_fd_ladder_BreakdownTitle")}
        columns={breakdownColumns}
        rows={breakdownRows}
      />
      <ScenarioCompare
        title={t("Tool_fd_ladder_ScenarioTitle")}
        subtitle={t("Tool_fd_ladder_ScenarioSubtitle")}
        scenarios={scenarios}
      />
      <WorkedExample
        title={t("Tool_fd_ladder_ExampleTitle")}
        subtitle={t("Tool_fd_ladder_ExampleSubtitle")}
        steps={exampleSteps}
      />
    </ToolPageShell>
  );
}
