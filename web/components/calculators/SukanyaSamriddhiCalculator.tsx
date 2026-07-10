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
import {
  calculateSsy,
  SSY_DEFAULT_RATE,
  SSY_DEPOSIT_YEARS,
  SSY_MATURITY_YEARS,
  SSY_MAX_ANNUAL,
} from "@/lib/finance/ssy";
import { inr, percent } from "@/lib/finance/format";
import { getTool } from "@/lib/config/tools";
import { ssyInfo } from "@/lib/tool-page-content";

export function SukanyaSamriddhiCalculator() {
  const t = useT();
  const tool = getTool("sukanya-samriddhi")!;

  const [annualDeposit, setAnnualDeposit] = useState(150_000);
  const [rate, setRate] = useState(SSY_DEFAULT_RATE);

  const breakdownColumns = useMemo(
    () => [
      { key: "year", header: t("Common_Year"), alignRight: false as const },
      { key: "deposit", header: t("Tool_sukanya_samriddhi_Col_Deposit") },
      { key: "interest", header: t("Common_Col_Interest") },
      { key: "balance", header: t("Common_Col_Balance") },
    ],
    [t],
  );

  const exampleSteps = useMemo(
    () => [
      t("Tool_sukanya_samriddhi_ExampleStep_1"),
      t("Tool_sukanya_samriddhi_ExampleStep_2"),
      t("Tool_sukanya_samriddhi_ExampleStep_3"),
      t("Tool_sukanya_samriddhi_ExampleStep_4"),
      t("Tool_sukanya_samriddhi_ExampleStep_5"),
    ],
    [t],
  );

  const { summaryCards, scenarios, breakdownRows } = useMemo(() => {
    const result = calculateSsy(annualDeposit, rate);
    const half = calculateSsy(Math.min(annualDeposit, 75_000), rate);
    const ppfLike = calculateSsy(annualDeposit, 7.1, SSY_DEPOSIT_YEARS, SSY_MATURITY_YEARS);

    return {
      summaryCards: [
        {
          label: t("Tool_sukanya_samriddhi_Result_Invested"),
          value: inr(result.totalInvested),
          footnote: t("Tool_sukanya_samriddhi_Result_InvestedFootnote", SSY_DEPOSIT_YEARS),
        },
        {
          label: t("Tool_sukanya_samriddhi_Result_Maturity"),
          value: inr(result.maturity),
          footnote: t("Tool_sukanya_samriddhi_Result_MaturityFootnote", SSY_MATURITY_YEARS, percent(rate)),
          variant: "primary" as const,
        },
        {
          label: t("Tool_sukanya_samriddhi_Result_Interest"),
          value: inr(result.totalInterest),
          footnote: t("Tool_sukanya_samriddhi_Result_InterestFootnote"),
          variant: "secure" as const,
        },
      ],
      scenarios: [
        {
          name: t("Tool_sukanya_samriddhi_Scenario_Half"),
          primaryLabel: t("Tool_sukanya_samriddhi_Result_Maturity"),
          primaryValue: inr(half.maturity),
          secondaryLabel: t("Tool_sukanya_samriddhi_LabelAnnual"),
          secondaryValue: inr(Math.min(annualDeposit, 75_000)),
          variant: "worst",
        },
        {
          name: t("Common_Scenario_Base"),
          primaryLabel: t("Tool_sukanya_samriddhi_Result_Maturity"),
          primaryValue: inr(result.maturity),
          secondaryLabel: t("Common_Label_Return"),
          secondaryValue: percent(rate),
          variant: "base",
        },
        {
          name: t("Tool_sukanya_samriddhi_Scenario_VsPpf"),
          primaryLabel: t("Tool_sukanya_samriddhi_Result_Maturity"),
          primaryValue: inr(ppfLike.maturity),
          secondaryLabel: t("Tool_sukanya_samriddhi_Scenario_VsPpfFoot"),
          secondaryValue: "7.1%",
          variant: "best",
        },
      ],
      breakdownRows: result.rows.map((r) => ({
        cells: {
          year: t("Common_YearN", r.year),
          deposit: inr(r.deposit),
          interest: inr(r.interest),
          balance: inr(r.balance),
        },
      })),
    };
  }, [annualDeposit, rate, t]);

  return (
    <ToolPageShell
      title={t(tool.titleKey)}
      subtitle={t("Tool_sukanya_samriddhi_Subtitle")}
      description={t(tool.descriptionKey)}
      icon={tool.icon}
      educate={
        <>
          <div className="fy-info-box">
            <strong>{t("Common_WhatYouLearn")}</strong>
            <p>{t("Tool_sukanya_samriddhi_LearnText")}</p>
          </div>
          <FormulaCard
            title={t("Common_Formula")}
            code={"Deposit years 1–15\nInterest compounds to year 21"}
            note={t("Tool_sukanya_samriddhi_FormulaNote")}
          />
        </>
      }
      below={<ToolInfoPanel info={ssyInfo(t)} />}
    >
      <div className="fy-form-card">
        <h3>{t("Common_YourInputs")}</h3>
        <div className="fy-field">
          <label>{t("Tool_sukanya_samriddhi_LabelAnnual")}</label>
          <input
            type="number"
            min={250}
            max={SSY_MAX_ANNUAL}
            step={500}
            inputMode="decimal"
            value={annualDeposit}
            onChange={(e) => setAnnualDeposit(Math.max(0, Number(e.target.value) || 0))}
          />
          <p className="fy-field-hint">{t("Tool_sukanya_samriddhi_MaxHint", inr(SSY_MAX_ANNUAL))}</p>
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
        <p className="fy-field-hint">{t("Tool_sukanya_samriddhi_TenureHint", SSY_DEPOSIT_YEARS, SSY_MATURITY_YEARS)}</p>
        <button type="button" className="fy-btn-calc">
          {t("Common_Calculate")}
        </button>
      </div>

      <ResultSummaryCards cards={summaryCards} />
      <ScenarioCompare
        title={t("Tool_sukanya_samriddhi_ScenarioTitle")}
        subtitle={t("Tool_sukanya_samriddhi_ScenarioSubtitle")}
        scenarios={scenarios}
      />
      <BreakdownTable
        title={t("Tool_sukanya_samriddhi_BreakdownTitle")}
        columns={breakdownColumns}
        rows={breakdownRows}
      />
      <WorkedExample
        title={t("Tool_sukanya_samriddhi_ExampleTitle")}
        subtitle={t("Tool_sukanya_samriddhi_ExampleSubtitle")}
        steps={exampleSteps}
      />
    </ToolPageShell>
  );
}
