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
import { inr, percent } from "@/lib/finance/format";
import { PPF_DEFAULT_RATE, PPF_DEFAULT_YEARS, PPF_MAX_ANNUAL, ppfAnnualProjection } from "@/lib/finance/ppf";
import { getTool } from "@/lib/config/tools";
import { ppfInfo } from "@/lib/tool-page-content";

export function PpfCalculator() {
  const t = useT();
  const tool = getTool("ppf")!;

  const [annualDeposit, setAnnualDeposit] = useState(150_000);
  const [rate, setRate] = useState(PPF_DEFAULT_RATE);
  const [years, setYears] = useState(PPF_DEFAULT_YEARS);

  const breakdownColumns = useMemo(
    () => [
      { key: "year", header: t("Common_Year"), alignRight: false as const },
      { key: "deposit", header: t("Tool_ppf_Col_Deposit") },
      { key: "interest", header: t("Common_Col_Interest") },
      { key: "balance", header: t("Common_Col_Balance") },
    ],
    [t],
  );

  const exampleSteps = useMemo(
    () => [
      t("Tool_ppf_ExampleStep_1"),
      t("Tool_ppf_ExampleStep_2"),
      t("Tool_ppf_ExampleStep_3"),
      t("Tool_ppf_ExampleStep_4"),
      t("Tool_ppf_ExampleStep_5"),
    ],
    [t],
  );

  const { summaryCards, scenarios, breakdownRows } = useMemo(() => {
    const deposit = Math.min(Math.max(0, annualDeposit), PPF_MAX_ANNUAL);
    const safeRate = Math.max(0, rate);
    const safeYears = Math.max(0, Math.floor(years));
    const base = ppfAnnualProjection(deposit, safeRate, safeYears);
    const low = ppfAnnualProjection(deposit, 6.5, safeYears);
    const high = ppfAnnualProjection(deposit, 7.5, safeYears);
    const half = ppfAnnualProjection(Math.min(deposit, 75_000), safeRate, safeYears);

    return {
      summaryCards: [
        {
          label: t("Tool_ppf_Result_Invested"),
          value: inr(base.totalInvested),
          footnote: t("Tool_ppf_Result_InvestedFootnote", safeYears),
        },
        {
          label: t("Tool_ppf_Result_Maturity"),
          value: inr(base.maturity),
          footnote: t("Common_Footnote_RatePa", percent(safeRate)),
          variant: "primary" as const,
        },
        {
          label: t("Tool_ppf_Result_Interest"),
          value: inr(base.totalInterest),
          footnote: t("Tool_ppf_Result_InterestFootnote"),
          variant: "secure" as const,
        },
      ],
      scenarios: [
        {
          name: t("Tool_ppf_Scenario_Half"),
          primaryLabel: t("Tool_ppf_Result_Maturity"),
          primaryValue: inr(half.maturity),
          secondaryLabel: t("Tool_ppf_LabelAnnual"),
          secondaryValue: inr(Math.min(deposit, 75_000)),
          variant: "worst",
        },
        {
          name: t("Common_Scenario_Base"),
          primaryLabel: t("Tool_ppf_Result_Maturity"),
          primaryValue: inr(base.maturity),
          secondaryLabel: t("Common_Label_Return"),
          secondaryValue: percent(safeRate),
          variant: "base",
        },
        {
          name: t("Tool_ppf_Scenario_RateBand"),
          primaryLabel: t("Tool_ppf_Result_Maturity"),
          primaryValue: `${inr(low.maturity)} – ${inr(high.maturity)}`,
          secondaryLabel: t("Tool_ppf_Scenario_RateBandFoot"),
          secondaryValue: "6.5% – 7.5%",
          variant: "best",
        },
      ],
      breakdownRows: base.rows.map((r) => ({
        cells: {
          year: t("Common_YearN", r.year),
          deposit: inr(r.deposit),
          interest: inr(r.interest),
          balance: inr(r.balance),
        },
      })),
    };
  }, [annualDeposit, rate, years, t]);

  return (
    <ToolPageShell
      title={t(tool.titleKey)}
      subtitle={t("Tool_ppf_Subtitle")}
      description={t(tool.descriptionKey)}
      icon={tool.icon}
      educate={
        <>
          <div className="fy-info-box">
            <strong>{t("Common_WhatYouLearn")}</strong>
            <p>{t("Tool_ppf_LearnText")}</p>
          </div>
          <FormulaCard
            title={t("Common_Formula")}
            code={"balance += deposit\ninterest = balance × rate\nbalance += interest"}
            note={t("Tool_ppf_FormulaNote")}
          />
        </>
      }
      below={<ToolInfoPanel info={ppfInfo(t)} />}
    >
      <div className="fy-form-card">
        <h3>{t("Common_YourInputs")}</h3>
        <div className="fy-field">
          <label>{t("Tool_ppf_LabelAnnual")}</label>
          <input
            type="number"
            min={500}
            max={PPF_MAX_ANNUAL}
            step={500}
            inputMode="decimal"
            value={annualDeposit}
            onChange={(e) => setAnnualDeposit(Math.max(0, Number(e.target.value) || 0))}
          />
          <p className="fy-field-hint">{t("Tool_ppf_MaxHint", inr(PPF_MAX_ANNUAL))}</p>
        </div>
        <div className="fy-field">
          <label>{t("Common_Label_RatePa")}</label>
          <input
            type="number"
            min={0}
            step={0.1}
            inputMode="decimal"
            value={rate}
            onChange={(e) => setRate(Math.max(0, Number(e.target.value) || 0))}
          />
        </div>
        <div className="fy-field">
          <label>{t("Common_Label_Years")}</label>
          <input
            type="number"
            min={1}
            max={50}
            step={1}
            inputMode="numeric"
            value={years}
            onChange={(e) => setYears(Math.max(1, Number(e.target.value) || 1))}
          />
          <p className="fy-field-hint">{t("Tool_ppf_TenureHint")}</p>
        </div>
        <button type="button" className="fy-btn-calc">
          {t("Common_Calculate")}
        </button>
      </div>

      <ResultSummaryCards cards={summaryCards} />
      <ScenarioCompare title={t("Tool_ppf_ScenarioTitle")} subtitle={t("Tool_ppf_ScenarioSubtitle")} scenarios={scenarios} />
      <BreakdownTable title={t("Tool_ppf_BreakdownTitle")} columns={breakdownColumns} rows={breakdownRows} />
      <WorkedExample title={t("Tool_ppf_ExampleTitle")} subtitle={t("Tool_ppf_ExampleSubtitle")} steps={exampleSteps} />
    </ToolPageShell>
  );
}
