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
import {
  calculateMahilaSamman,
  MSSC_DEFAULT_RATE,
  MSSC_MAX_DEPOSIT,
  MSSC_TENURE_YEARS,
} from "@/lib/finance/mahilaSamman";
import { inr, percent } from "@/lib/finance/format";
import { getTool } from "@/lib/config/tools";
import { mahilaSammanInfo } from "@/lib/tool-page-content";

export function MahilaSammanCalculator() {
  const t = useT();
  const tool = getTool("mahila-samman")!;

  const [deposit, setDeposit] = useState(100_000);
  const [rate, setRate] = useState(MSSC_DEFAULT_RATE);

  const exampleSteps = useMemo(
    () => [
      t("Tool_mahila_samman_ExampleStep_1"),
      t("Tool_mahila_samman_ExampleStep_2"),
      t("Tool_mahila_samman_ExampleStep_3"),
      t("Tool_mahila_samman_ExampleStep_4"),
      t("Tool_mahila_samman_ExampleStep_5"),
    ],
    [t],
  );

  const { summaryCards, scenarios, capped } = useMemo(() => {
    const result = calculateMahilaSamman(deposit, rate, MSSC_TENURE_YEARS);
    const half = calculateMahilaSamman(Math.min(deposit, MSSC_MAX_DEPOSIT) / 2, rate);
    const maxed = calculateMahilaSamman(MSSC_MAX_DEPOSIT, rate);

    return {
      capped: result.capped,
      summaryCards: [
        {
          label: t("Tool_mahila_samman_Result_Interest"),
          value: inr(result.totalInterest),
          footnote: t(
            "Tool_mahila_samman_Result_InterestFootnote",
            percent(rate),
            MSSC_TENURE_YEARS,
          ),
          variant: "primary" as const,
        },
        {
          label: t("Tool_mahila_samman_Result_Maturity"),
          value: inr(result.maturity),
          footnote: t("Tool_mahila_samman_Result_MaturityFootnote", inr(result.deposit)),
          variant: "secure" as const,
        },
        {
          label: t("Tool_mahila_samman_Result_Quarterly"),
          value: inr(result.quarterlyInterest),
          footnote: t("Tool_mahila_samman_Result_QuarterlyFootnote"),
        },
      ],
      scenarios: [
        {
          name: t("Tool_mahila_samman_Scenario_Half"),
          primaryLabel: t("Tool_mahila_samman_Result_Interest"),
          primaryValue: inr(half.totalInterest),
          secondaryLabel: t("Tool_mahila_samman_LabelDeposit"),
          secondaryValue: inr(half.deposit),
          variant: "worst",
        },
        {
          name: t("Common_Scenario_Base"),
          primaryLabel: t("Tool_mahila_samman_Result_Interest"),
          primaryValue: inr(result.totalInterest),
          secondaryLabel: t("Tool_mahila_samman_Result_Maturity"),
          secondaryValue: inr(result.maturity),
          variant: "base",
        },
        {
          name: t("Tool_mahila_samman_Scenario_Max"),
          primaryLabel: t("Tool_mahila_samman_Result_Interest"),
          primaryValue: inr(maxed.totalInterest),
          secondaryLabel: t("Tool_mahila_samman_LabelDeposit"),
          secondaryValue: inr(MSSC_MAX_DEPOSIT),
          variant: "best",
        },
      ],
    };
  }, [deposit, rate, t]);

  return (
    <ToolPageShell
      title={t(tool.titleKey)}
      subtitle={t("Tool_mahila_samman_Subtitle")}
      description={t(tool.descriptionKey)}
      icon={tool.icon}
      educate={
        <>
          <div className="fy-info-box">
            <strong>{t("Common_WhatYouLearn")}</strong>
            <p>{t("Tool_mahila_samman_LearnText")}</p>
          </div>
          <FormulaCard
            title={t("Common_Formula")}
            code={"Interest = Deposit × 7.5% × 2 years\nMax deposit ₹2 lakh"}
            note={t("Tool_mahila_samman_FormulaNote")}
          />
        </>
      }
      below={<ToolInfoPanel info={mahilaSammanInfo(t)} />}
    >
      <div className="fy-form-card">
        <h3>{t("Common_YourInputs")}</h3>
        <div className="fy-field">
          <label>{t("Tool_mahila_samman_LabelDeposit")}</label>
          <input
            type="number"
            min={0}
            max={MSSC_MAX_DEPOSIT}
            step={1000}
            inputMode="decimal"
            value={deposit}
            onChange={(e) => setDeposit(Math.max(0, Number(e.target.value) || 0))}
          />
          <p className="fy-field-hint">
            {t("Tool_mahila_samman_MaxHint", inr(MSSC_MAX_DEPOSIT))}
            {capped ? ` ${t("Tool_mahila_samman_CappedNote")}` : ""}
          </p>
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
          <p className="fy-field-hint">{t("Tool_mahila_samman_TenureHint", MSSC_TENURE_YEARS)}</p>
        </div>
        <button type="button" className="fy-btn-calc">
          {t("Common_Calculate")}
        </button>
      </div>

      <ResultSummaryCards cards={summaryCards} />
      <ScenarioCompare
        title={t("Tool_mahila_samman_ScenarioTitle")}
        subtitle={t("Tool_mahila_samman_ScenarioSubtitle")}
        scenarios={scenarios}
      />
      <WorkedExample
        title={t("Tool_mahila_samman_ExampleTitle")}
        subtitle={t("Tool_mahila_samman_ExampleSubtitle")}
        steps={exampleSteps}
      />
    </ToolPageShell>
  );
}
