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
import { calculateEmiToRate } from "@/lib/finance/emiToRate";
import { inr, percent } from "@/lib/finance/format";
import { getTool } from "@/lib/config/tools";
import { emiToRateInfo } from "@/lib/tool-page-content";

export function EmiToRateCalculator() {
  const t = useT();
  const tool = getTool("emi-to-rate")!;

  const [principal, setPrincipal] = useState(100_000);
  const [monthlyEmi, setMonthlyEmi] = useState(4_800);
  const [months, setMonths] = useState(24);

  const exampleSteps = useMemo(
    () => [
      t("Tool_emi_to_rate_ExampleStep_1"),
      t("Tool_emi_to_rate_ExampleStep_2"),
      t("Tool_emi_to_rate_ExampleStep_3"),
      t("Tool_emi_to_rate_ExampleStep_4"),
      t("Tool_emi_to_rate_ExampleStep_5"),
    ],
    [t],
  );

  const { summaryCards, scenarios, result } = useMemo(() => {
    const r = calculateEmiToRate({
      principal,
      monthlyEmi,
      tenureMonths: months,
    });

    const lowerEmi = calculateEmiToRate({
      principal,
      monthlyEmi: Math.max(1, monthlyEmi * 0.95),
      tenureMonths: months,
    });
    const higherEmi = calculateEmiToRate({
      principal,
      monthlyEmi: monthlyEmi * 1.05,
      tenureMonths: months,
    });

    return {
      result: r,
      summaryCards: [
        {
          label: t("Tool_emi_to_rate_Result_Rate"),
          value: r.impossible ? t("Tool_emi_to_rate_Result_Impossible") : percent(r.annualRatePercent, 2),
          footnote: t("Tool_emi_to_rate_Result_RateFootnote", percent(r.monthlyRatePercent, 3)),
          variant: "primary" as const,
        },
        {
          label: t("Tool_emi_to_rate_Result_Interest"),
          value: inr(r.totalInterest),
          footnote: t("Tool_emi_to_rate_Result_InterestFootnote"),
          variant: "volatile" as const,
        },
        {
          label: t("Tool_emi_to_rate_Result_TotalPayment"),
          value: inr(r.totalPayment),
          footnote: t("Tool_emi_to_rate_Result_PaymentFootnote", String(r.months)),
          variant: "secure" as const,
        },
      ],
      scenarios: [
        {
          name: t("Tool_emi_to_rate_Scenario_LowerEmi"),
          primaryLabel: t("Tool_emi_to_rate_Result_Rate"),
          primaryValue: percent(lowerEmi.annualRatePercent, 2),
          secondaryLabel: t("Tool_emi_to_rate_LabelEmi"),
          secondaryValue: inr(lowerEmi.monthlyEmi),
          variant: "best",
        },
        {
          name: t("Common_Scenario_Base"),
          primaryLabel: t("Tool_emi_to_rate_Result_Rate"),
          primaryValue: r.impossible ? "—" : percent(r.annualRatePercent, 2),
          secondaryLabel: t("Tool_emi_to_rate_Result_Interest"),
          secondaryValue: inr(r.totalInterest),
          variant: "base",
        },
        {
          name: t("Tool_emi_to_rate_Scenario_HigherEmi"),
          primaryLabel: t("Tool_emi_to_rate_Result_Rate"),
          primaryValue: percent(higherEmi.annualRatePercent, 2),
          secondaryLabel: t("Tool_emi_to_rate_LabelEmi"),
          secondaryValue: inr(higherEmi.monthlyEmi),
          variant: "worst",
        },
      ],
    };
  }, [principal, monthlyEmi, months, t]);

  return (
    <ToolPageShell
      title={t(tool.titleKey)}
      subtitle={t("Tool_emi_to_rate_Subtitle")}
      description={t(tool.descriptionKey)}
      icon={tool.icon}
      educate={
        <>
          <div className="fy-info-box">
            <strong>{t("Common_WhatYouLearn")}</strong>
            <p>{t("Tool_emi_to_rate_LearnText")}</p>
          </div>
          <FormulaCard
            title={t("Common_Formula")}
            code={"Solve r in:\nEMI = P × r × (1+r)^n / ((1+r)^n − 1)\n(binary search on annual rate)"}
            note={t("Tool_emi_to_rate_FormulaNote")}
          />
        </>
      }
      below={<ToolInfoPanel info={emiToRateInfo(t)} />}
    >
      <div className="fy-form-card">
        <h3>{t("Common_YourInputs")}</h3>
        <div className="fy-field">
          <label>{t("Tool_emi_to_rate_LabelPrincipal")}</label>
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
          <label>{t("Tool_emi_to_rate_LabelEmi")}</label>
          <input
            type="number"
            min={0}
            step={100}
            inputMode="decimal"
            value={monthlyEmi}
            onChange={(e) => setMonthlyEmi(Math.max(0, Number(e.target.value) || 0))}
          />
        </div>
        <div className="fy-field">
          <label>{t("Tool_emi_to_rate_LabelMonths")}</label>
          <input
            type="number"
            min={1}
            max={480}
            step={1}
            inputMode="numeric"
            value={months}
            onChange={(e) => setMonths(Math.max(1, Math.min(480, Number(e.target.value) || 1)))}
          />
          <p className="fy-field-hint">{t("Tool_emi_to_rate_MonthsHint")}</p>
        </div>
        <button type="button" className="fy-btn-calc">
          {t("Common_Calculate")}
        </button>
      </div>

      <div className="fy-info-box fy-tax-verdict">
        <strong>{t("Tool_emi_to_rate_VerdictTitle")}</strong>
        <p>
          {result.impossible
            ? t("Tool_emi_to_rate_VerdictImpossible")
            : t(
                "Tool_emi_to_rate_VerdictBody",
                percent(result.annualRatePercent, 2),
                inr(result.totalInterest),
              )}
        </p>
      </div>

      <ResultSummaryCards cards={summaryCards} />
      <ScenarioCompare
        title={t("Tool_emi_to_rate_ScenarioTitle")}
        subtitle={t("Tool_emi_to_rate_ScenarioSubtitle")}
        scenarios={scenarios}
      />
      <WorkedExample
        title={t("Tool_emi_to_rate_ExampleTitle")}
        subtitle={t("Tool_emi_to_rate_ExampleSubtitle")}
        steps={exampleSteps}
      />
    </ToolPageShell>
  );
}
