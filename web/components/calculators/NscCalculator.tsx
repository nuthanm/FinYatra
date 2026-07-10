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
import { calculateNsc, NSC_DEFAULT_RATE, NSC_TENURE_YEARS } from "@/lib/finance/nsc";
import { inr, percent } from "@/lib/finance/format";
import { getTool } from "@/lib/config/tools";
import { nscInfo } from "@/lib/tool-page-content";

export function NscCalculator() {
  const t = useT();
  const tool = getTool("nsc")!;

  const [deposit, setDeposit] = useState(100_000);
  const [rate, setRate] = useState(NSC_DEFAULT_RATE);

  const breakdownColumns = useMemo(
    () => [
      { key: "year", header: t("Common_Year"), alignRight: false as const },
      { key: "opening", header: t("Tool_nsc_Col_Opening") },
      { key: "interest", header: t("Tool_nsc_Col_Interest") },
      { key: "closing", header: t("Tool_nsc_Col_Closing") },
      { key: "note", header: t("Tool_nsc_Col_Note"), alignRight: false as const },
    ],
    [t],
  );

  const exampleSteps = useMemo(
    () => [
      t("Tool_nsc_ExampleStep_1"),
      t("Tool_nsc_ExampleStep_2"),
      t("Tool_nsc_ExampleStep_3"),
      t("Tool_nsc_ExampleStep_4"),
      t("Tool_nsc_ExampleStep_5"),
    ],
    [t],
  );

  const { summaryCards, scenarios, breakdownRows } = useMemo(() => {
    const result = calculateNsc(deposit, rate, NSC_TENURE_YEARS);
    const low = calculateNsc(deposit, 6.8, NSC_TENURE_YEARS);
    const high = calculateNsc(deposit, 8.0, NSC_TENURE_YEARS);

    return {
      summaryCards: [
        {
          label: t("Tool_nsc_Result_Maturity"),
          value: inr(result.maturity),
          footnote: t("Common_Footnote_RatePa", percent(rate)),
          variant: "primary" as const,
        },
        {
          label: t("Tool_nsc_Result_Interest"),
          value: inr(result.totalInterest),
          footnote: t("Tool_nsc_Result_InterestFootnote", NSC_TENURE_YEARS),
          variant: "secure" as const,
        },
        {
          label: t("Tool_nsc_Result_80c"),
          value: inr(result.deposit80c),
          footnote: t("Tool_nsc_Result_80cFootnote", inr(result.intermediateInterest80c)),
        },
      ],
      scenarios: [
        {
          name: t("Tool_nsc_Scenario_Low"),
          primaryLabel: t("Tool_nsc_Result_Maturity"),
          primaryValue: inr(low.maturity),
          secondaryLabel: t("Common_Label_Return"),
          secondaryValue: "6.8%",
          variant: "worst",
        },
        {
          name: t("Common_Scenario_Base"),
          primaryLabel: t("Tool_nsc_Result_Maturity"),
          primaryValue: inr(result.maturity),
          secondaryLabel: t("Common_Label_Return"),
          secondaryValue: percent(rate),
          variant: "base",
        },
        {
          name: t("Tool_nsc_Scenario_High"),
          primaryLabel: t("Tool_nsc_Result_Maturity"),
          primaryValue: inr(high.maturity),
          secondaryLabel: t("Common_Label_Return"),
          secondaryValue: "8.0%",
          variant: "best",
        },
      ],
      breakdownRows: result.rows.map((row) => ({
        cells: {
          year: t("Common_YearN", row.year),
          opening: inr(row.opening),
          interest: inr(row.interest),
          closing: inr(row.closing),
          note: row.qualifies80cInterest
            ? t("Tool_nsc_Note_80cInterest")
            : t("Tool_nsc_Note_MaturityYear"),
        },
      })),
    };
  }, [deposit, rate, t]);

  return (
    <ToolPageShell
      title={t(tool.titleKey)}
      subtitle={t("Tool_nsc_Subtitle")}
      description={t(tool.descriptionKey)}
      icon={tool.icon}
      educate={
        <>
          <div className="fy-info-box">
            <strong>{t("Common_WhatYouLearn")}</strong>
            <p>{t("Tool_nsc_LearnText")}</p>
          </div>
          <FormulaCard
            title={t("Common_Formula")}
            code={"Maturity = P × (1 + r)^5\nInterest reinvested annually"}
            note={t("Tool_nsc_FormulaNote")}
          />
        </>
      }
      below={<ToolInfoPanel info={nscInfo(t)} />}
    >
      <div className="fy-form-card">
        <h3>{t("Common_YourInputs")}</h3>
        <div className="fy-field">
          <label>{t("Tool_nsc_LabelDeposit")}</label>
          <input
            type="number"
            min={0}
            step={1000}
            inputMode="decimal"
            value={deposit}
            onChange={(e) => setDeposit(Math.max(0, Number(e.target.value) || 0))}
          />
          <p className="fy-field-hint">{t("Tool_nsc_DepositHint")}</p>
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
          <p className="fy-field-hint">{t("Tool_nsc_RateHint")}</p>
        </div>
        <div className="fy-field">
          <label>{t("Common_Label_Years")}</label>
          <input type="number" value={NSC_TENURE_YEARS} disabled readOnly />
          <p className="fy-field-hint">{t("Tool_nsc_TenureHint")}</p>
        </div>
        <button type="button" className="fy-btn-calc">
          {t("Common_Calculate")}
        </button>
      </div>

      <ResultSummaryCards cards={summaryCards} />
      <ScenarioCompare
        title={t("Tool_nsc_ScenarioTitle")}
        subtitle={t("Tool_nsc_ScenarioSubtitle")}
        scenarios={scenarios}
      />
      <BreakdownTable title={t("Tool_nsc_BreakdownTitle")} columns={breakdownColumns} rows={breakdownRows} />
      <WorkedExample title={t("Tool_nsc_ExampleTitle")} subtitle={t("Tool_nsc_ExampleSubtitle")} steps={exampleSteps} />
    </ToolPageShell>
  );
}
