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
import { calculateCreditCardEmi } from "@/lib/finance/creditCardEmi";
import { inr, percent } from "@/lib/finance/format";
import { getTool } from "@/lib/config/tools";
import { creditCardEmiInfo } from "@/lib/tool-page-content";

export function CreditCardEmiCalculator() {
  const t = useT();
  const tool = getTool("credit-card-emi")!;

  const [purchaseAmount, setPurchaseAmount] = useState(50_000);
  const [months, setMonths] = useState(12);
  const [rate, setRate] = useState(1.5);
  const [rateIsMonthly, setRateIsMonthly] = useState(true);

  const exampleSteps = useMemo(
    () => [
      t("Tool_credit_card_emi_ExampleStep_1"),
      t("Tool_credit_card_emi_ExampleStep_2"),
      t("Tool_credit_card_emi_ExampleStep_3"),
      t("Tool_credit_card_emi_ExampleStep_4"),
      t("Tool_credit_card_emi_ExampleStep_5"),
    ],
    [t],
  );

  const { summaryCards, scenarios, result } = useMemo(() => {
    const r = calculateCreditCardEmi({
      purchaseAmount,
      tenureMonths: months,
      ratePercent: rate,
      rateIsMonthly,
    });

    return {
      result: r,
      summaryCards: [
        {
          label: t("Tool_credit_card_emi_Result_Emi"),
          value: inr(r.reducingEmi),
          footnote: t("Tool_credit_card_emi_Result_EmiFootnote", String(r.months)),
          variant: "primary" as const,
        },
        {
          label: t("Tool_credit_card_emi_Result_Interest"),
          value: inr(r.reducingTotalInterest),
          footnote: t("Common_Footnote_RatePa", percent(r.annualRatePercent)),
          variant: "volatile" as const,
        },
        {
          label: t("Tool_credit_card_emi_Result_TotalPayment"),
          value: inr(r.reducingTotalPayment),
          footnote: t("Tool_credit_card_emi_Result_PaymentFootnote"),
          variant: "secure" as const,
        },
      ],
      scenarios: [
        {
          name: t("Tool_credit_card_emi_Scenario_Flat"),
          primaryLabel: t("Tool_credit_card_emi_LabelFlatEmi"),
          primaryValue: inr(r.flatEmi),
          secondaryLabel: t("Tool_credit_card_emi_LabelFlatInterest"),
          secondaryValue: inr(r.flatTotalInterest),
          variant: "worst",
        },
        {
          name: t("Common_Scenario_Base"),
          primaryLabel: t("Tool_credit_card_emi_Result_Emi"),
          primaryValue: inr(r.reducingEmi),
          secondaryLabel: t("Tool_credit_card_emi_Result_Interest"),
          secondaryValue: inr(r.reducingTotalInterest),
          variant: "base",
        },
        {
          name: t("Tool_credit_card_emi_Scenario_Reducing"),
          primaryLabel: t("Tool_credit_card_emi_LabelExtraInterest"),
          primaryValue: inr(r.interestDifference),
          secondaryLabel: t("Tool_credit_card_emi_LabelEmiDiff"),
          secondaryValue: inr(r.emiDifference),
          variant: "best",
        },
      ],
    };
  }, [purchaseAmount, months, rate, rateIsMonthly, t]);

  return (
    <ToolPageShell
      title={t(tool.titleKey)}
      subtitle={t("Tool_credit_card_emi_Subtitle")}
      description={t(tool.descriptionKey)}
      icon={tool.icon}
      educate={
        <>
          <div className="fy-info-box">
            <strong>{t("Common_WhatYouLearn")}</strong>
            <p>{t("Tool_credit_card_emi_LearnText")}</p>
          </div>
          <FormulaCard
            title={t("Common_Formula")}
            code={
              "EMI = P × r × (1+r)^n / ((1+r)^n − 1)\nFlat interest = P × annual% × years\nFlat EMI = (P + flat interest) / n"
            }
            note={t("Tool_credit_card_emi_FormulaNote")}
          />
        </>
      }
      below={<ToolInfoPanel info={creditCardEmiInfo(t)} />}
    >
      <div className="fy-form-card">
        <h3>{t("Common_YourInputs")}</h3>
        <div className="fy-field">
          <label>{t("Tool_credit_card_emi_LabelPurchase")}</label>
          <input
            type="number"
            min={0}
            step={1000}
            inputMode="decimal"
            value={purchaseAmount}
            onChange={(e) => setPurchaseAmount(Math.max(0, Number(e.target.value) || 0))}
          />
        </div>
        <div className="fy-field">
          <label>{t("Tool_credit_card_emi_LabelMonths")}</label>
          <input
            type="number"
            min={1}
            max={60}
            step={1}
            inputMode="numeric"
            value={months}
            onChange={(e) => setMonths(Math.max(1, Math.min(60, Number(e.target.value) || 1)))}
          />
        </div>
        <div className="fy-field">
          <label>{t("Tool_credit_card_emi_LabelRateMode")}</label>
          <select
            value={rateIsMonthly ? "monthly" : "annual"}
            onChange={(e) => {
              const nextMonthly = e.target.value === "monthly";
              setRateIsMonthly(nextMonthly);
              setRate((prev) => (nextMonthly ? prev / 12 : prev * 12));
            }}
          >
            <option value="monthly">{t("Tool_credit_card_emi_RateMode_Monthly")}</option>
            <option value="annual">{t("Tool_credit_card_emi_RateMode_Annual")}</option>
          </select>
        </div>
        <div className="fy-field">
          <label>
            {rateIsMonthly
              ? t("Tool_credit_card_emi_LabelMonthlyRate")
              : t("Tool_credit_card_emi_LabelAnnualRate")}
          </label>
          <input
            type="number"
            min={0}
            step={0.05}
            inputMode="decimal"
            value={rate}
            onChange={(e) => setRate(Math.max(0, Number(e.target.value) || 0))}
          />
          <p className="fy-field-hint">
            {t(
              "Tool_credit_card_emi_RateHint",
              percent(result.monthlyRatePercent, 2),
              percent(result.annualRatePercent),
            )}
          </p>
        </div>
        <button type="button" className="fy-btn-calc">
          {t("Common_Calculate")}
        </button>
      </div>

      <div className="fy-info-box fy-tax-verdict">
        <strong>{t("Tool_credit_card_emi_VerdictTitle")}</strong>
        <p>
          {t(
            "Tool_credit_card_emi_VerdictBody",
            inr(result.reducingEmi),
            inr(result.reducingTotalInterest),
            inr(result.flatTotalInterest),
          )}
        </p>
      </div>

      <ResultSummaryCards cards={summaryCards} />
      <ScenarioCompare
        title={t("Tool_credit_card_emi_ScenarioTitle")}
        subtitle={t("Tool_credit_card_emi_ScenarioSubtitle")}
        scenarios={scenarios}
      />
      <WorkedExample
        title={t("Tool_credit_card_emi_ExampleTitle")}
        subtitle={t("Tool_credit_card_emi_ExampleSubtitle")}
        steps={exampleSteps}
      />
    </ToolPageShell>
  );
}
