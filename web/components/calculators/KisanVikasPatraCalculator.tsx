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
import { calculateKvp, KVP_DEFAULT_RATE } from "@/lib/finance/kisanVikasPatra";
import { inr, percent } from "@/lib/finance/format";
import { getTool } from "@/lib/config/tools";
import { kisanVikasPatraInfo } from "@/lib/tool-page-content";

export function KisanVikasPatraCalculator() {
  const t = useT();
  const tool = getTool("kisan-vikas-patra")!;

  const [principal, setPrincipal] = useState(100_000);
  const [rate, setRate] = useState(KVP_DEFAULT_RATE);

  const exampleSteps = useMemo(
    () => [
      t("Tool_kisan_vikas_patra_ExampleStep_1"),
      t("Tool_kisan_vikas_patra_ExampleStep_2"),
      t("Tool_kisan_vikas_patra_ExampleStep_3"),
      t("Tool_kisan_vikas_patra_ExampleStep_4"),
      t("Tool_kisan_vikas_patra_ExampleStep_5"),
    ],
    [t],
  );

  const { summaryCards, scenarios } = useMemo(() => {
    const result = calculateKvp(principal, rate);
    const low = calculateKvp(principal, 6.9);
    const high = calculateKvp(principal, 7.7);

    return {
      summaryCards: [
        {
          label: t("Tool_kisan_vikas_patra_Result_Maturity"),
          value: inr(result.maturity),
          footnote: t("Tool_kisan_vikas_patra_Result_MaturityFootnote"),
          variant: "primary" as const,
        },
        {
          label: t("Tool_kisan_vikas_patra_Result_Interest"),
          value: inr(result.interest),
          footnote: t("Tool_kisan_vikas_patra_Result_InterestFootnote", percent(rate)),
          variant: "secure" as const,
        },
        {
          label: t("Tool_kisan_vikas_patra_Result_Tenure"),
          value: t("Tool_kisan_vikas_patra_TenureValue", result.tenureMonths),
          footnote: t(
            "Tool_kisan_vikas_patra_Result_TenureFootnote",
            result.tenureYears.toFixed(1),
          ),
        },
      ],
      scenarios: [
        {
          name: t("Tool_kisan_vikas_patra_Scenario_Low"),
          primaryLabel: t("Tool_kisan_vikas_patra_Result_Tenure"),
          primaryValue: t("Tool_kisan_vikas_patra_TenureValue", low.tenureMonths),
          secondaryLabel: t("Common_Label_Return"),
          secondaryValue: "6.9%",
          variant: "worst",
        },
        {
          name: t("Common_Scenario_Base"),
          primaryLabel: t("Tool_kisan_vikas_patra_Result_Maturity"),
          primaryValue: inr(result.maturity),
          secondaryLabel: t("Tool_kisan_vikas_patra_Result_Tenure"),
          secondaryValue: t("Tool_kisan_vikas_patra_TenureValue", result.tenureMonths),
          variant: "base",
        },
        {
          name: t("Tool_kisan_vikas_patra_Scenario_High"),
          primaryLabel: t("Tool_kisan_vikas_patra_Result_Tenure"),
          primaryValue: t("Tool_kisan_vikas_patra_TenureValue", high.tenureMonths),
          secondaryLabel: t("Common_Label_Return"),
          secondaryValue: "7.7%",
          variant: "best",
        },
      ],
    };
  }, [principal, rate, t]);

  return (
    <ToolPageShell
      title={t(tool.titleKey)}
      subtitle={t("Tool_kisan_vikas_patra_Subtitle")}
      description={t(tool.descriptionKey)}
      icon={tool.icon}
      educate={
        <>
          <div className="fy-info-box">
            <strong>{t("Common_WhatYouLearn")}</strong>
            <p>{t("Tool_kisan_vikas_patra_LearnText")}</p>
          </div>
          <FormulaCard
            title={t("Common_Formula")}
            code={"Maturity = 2 × Principal\nTenure ≈ 115 months at 7.5%"}
            note={t("Tool_kisan_vikas_patra_FormulaNote")}
          />
        </>
      }
      below={<ToolInfoPanel info={kisanVikasPatraInfo(t)} />}
    >
      <div className="fy-form-card">
        <h3>{t("Common_YourInputs")}</h3>
        <div className="fy-field">
          <label>{t("Tool_kisan_vikas_patra_LabelPrincipal")}</label>
          <input
            type="number"
            min={0}
            step={1000}
            inputMode="decimal"
            value={principal}
            onChange={(e) => setPrincipal(Math.max(0, Number(e.target.value) || 0))}
          />
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
          <p className="fy-field-hint">{t("Tool_kisan_vikas_patra_RateHint")}</p>
        </div>
        <button type="button" className="fy-btn-calc">
          {t("Common_Calculate")}
        </button>
      </div>

      <ResultSummaryCards cards={summaryCards} />
      <ScenarioCompare
        title={t("Tool_kisan_vikas_patra_ScenarioTitle")}
        subtitle={t("Tool_kisan_vikas_patra_ScenarioSubtitle")}
        scenarios={scenarios}
      />
      <WorkedExample
        title={t("Tool_kisan_vikas_patra_ExampleTitle")}
        subtitle={t("Tool_kisan_vikas_patra_ExampleSubtitle")}
        steps={exampleSteps}
      />
    </ToolPageShell>
  );
}
