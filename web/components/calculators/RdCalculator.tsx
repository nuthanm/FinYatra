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
import { calculateRd, rdYearlyRows } from "@/lib/finance/rd";
import { inr, percent } from "@/lib/finance/format";
import { getTool } from "@/lib/config/tools";
import { rdInfo, standardGrowthColumns } from "@/lib/tool-page-content";

export function RdCalculator() {
  const t = useT();
  const tool = getTool("rd")!;

  const [monthly, setMonthly] = useState(10_000);
  const [rate, setRate] = useState(6.5);
  const [months, setMonths] = useState(36);

  const breakdownColumns = useMemo(() => standardGrowthColumns(t), [t]);

  const exampleSteps = useMemo(
    () => [
      t("Tool_rd_ExampleStep_1"),
      t("Tool_rd_ExampleStep_2"),
      t("Tool_rd_ExampleStep_3"),
      t("Tool_rd_ExampleStep_4"),
      t("Tool_rd_ExampleStep_5"),
    ],
    [t],
  );

  const { summaryCards, scenarios, breakdownRows } = useMemo(() => {
    const result = calculateRd(monthly, rate, months);
    const low = calculateRd(monthly, 5.5, months);
    const sipLike = calculateRd(monthly, 12, months); // illustrative equity SIP rate band

    return {
      summaryCards: [
        {
          label: t("Tool_rd_Result_Invested"),
          value: inr(result.totalInvested),
          footnote: t("Tool_rd_Result_InvestedFootnote", result.months),
        },
        {
          label: t("Tool_rd_Result_Maturity"),
          value: inr(result.maturity),
          footnote: t("Common_Footnote_RatePa", percent(rate)),
          variant: "primary" as const,
        },
        {
          label: t("Tool_rd_Result_Interest"),
          value: inr(result.interest),
          footnote: t("Tool_rd_Result_InterestFootnote"),
          variant: "secure" as const,
        },
      ],
      scenarios: [
        {
          name: t("Tool_rd_Scenario_Low"),
          primaryLabel: t("Tool_rd_Result_Maturity"),
          primaryValue: inr(low.maturity),
          secondaryLabel: t("Common_Label_Return"),
          secondaryValue: "5.5%",
          variant: "worst",
        },
        {
          name: t("Common_Scenario_Base"),
          primaryLabel: t("Tool_rd_Result_Maturity"),
          primaryValue: inr(result.maturity),
          secondaryLabel: t("Common_Label_Return"),
          secondaryValue: percent(rate),
          variant: "base",
        },
        {
          name: t("Tool_rd_Scenario_VsSip"),
          primaryLabel: t("Tool_rd_Result_Maturity"),
          primaryValue: inr(sipLike.maturity),
          secondaryLabel: t("Tool_rd_Scenario_VsSipFoot"),
          secondaryValue: "12%",
          variant: "best",
        },
      ],
      breakdownRows: rdYearlyRows(monthly, rate, months).map((r) => ({
        cells: {
          year: t("Common_YearN", r.year),
          invested: inr(r.invested),
          value: inr(r.value),
          gain: inr(r.interest),
        },
      })),
    };
  }, [monthly, rate, months, t]);

  return (
    <ToolPageShell
      title={t(tool.titleKey)}
      subtitle={t("Tool_rd_Subtitle")}
      description={t(tool.descriptionKey)}
      icon={tool.icon}
      educate={
        <>
          <div className="fy-info-box">
            <strong>{t("Common_WhatYouLearn")}</strong>
            <p>{t("Tool_rd_LearnText")}</p>
          </div>
          <FormulaCard
            title={t("Common_Formula")}
            code={"M = P × [((1+i)^n − 1) / (1 − (1+i)^(−1/3))]\ni = rate/400, n = quarters"}
            note={t("Tool_rd_FormulaNote")}
          />
        </>
      }
      below={<ToolInfoPanel info={rdInfo(t)} />}
    >
      <div className="fy-form-card">
        <h3>{t("Common_YourInputs")}</h3>
        <div className="fy-field">
          <label>{t("Tool_rd_LabelMonthly")}</label>
          <input
            type="number"
            min={0}
            step={500}
            inputMode="decimal"
            value={monthly}
            onChange={(e) => setMonthly(Math.max(0, Number(e.target.value) || 0))}
          />
        </div>
        <div className="fy-field">
          <label>{t("Common_Label_RatePa")}</label>
          <input
            type="number"
            min={0}
            step={0.05}
            inputMode="decimal"
            value={rate}
            onChange={(e) => setRate(Math.max(0, Number(e.target.value) || 0))}
          />
        </div>
        <div className="fy-field">
          <label>{t("Tool_rd_LabelMonths")}</label>
          <input
            type="number"
            min={6}
            max={120}
            step={3}
            inputMode="numeric"
            value={months}
            onChange={(e) => setMonths(Math.max(6, Number(e.target.value) || 6))}
          />
          <p className="fy-field-hint">{t("Tool_rd_MonthsHint")}</p>
        </div>
        <button type="button" className="fy-btn-calc">
          {t("Common_Calculate")}
        </button>
      </div>

      <ResultSummaryCards cards={summaryCards} />
      <ScenarioCompare title={t("Tool_rd_ScenarioTitle")} subtitle={t("Tool_rd_ScenarioSubtitle")} scenarios={scenarios} />
      <BreakdownTable title={t("Tool_rd_BreakdownTitle")} columns={breakdownColumns} rows={breakdownRows} />
      <WorkedExample title={t("Tool_rd_ExampleTitle")} subtitle={t("Tool_rd_ExampleSubtitle")} steps={exampleSteps} />
    </ToolPageShell>
  );
}
