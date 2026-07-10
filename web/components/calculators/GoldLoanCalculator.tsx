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
import { calculateGoldLoan, type GoldPurity } from "@/lib/finance/goldLoan";
import { inr, percent } from "@/lib/finance/format";
import { getTool } from "@/lib/config/tools";
import { goldLoanInfo } from "@/lib/tool-page-content";

export function GoldLoanCalculator() {
  const t = useT();
  const tool = getTool("gold-loan")!;

  const [weight, setWeight] = useState(50);
  const [purity, setPurity] = useState<GoldPurity>(22);
  const [ratePerGram, setRatePerGram] = useState(7_500);
  const [ltv, setLtv] = useState(75);
  const [rate, setRate] = useState(10);
  const [months, setMonths] = useState(12);

  const exampleSteps = useMemo(
    () => [
      t("Tool_gold_loan_ExampleStep_1"),
      t("Tool_gold_loan_ExampleStep_2"),
      t("Tool_gold_loan_ExampleStep_3"),
      t("Tool_gold_loan_ExampleStep_4"),
      t("Tool_gold_loan_ExampleStep_5"),
    ],
    [t],
  );

  const { summaryCards, scenarios, detail } = useMemo(() => {
    const result = calculateGoldLoan({
      weightGrams: weight,
      purity,
      ratePerGram24k: ratePerGram,
      ltvPercent: ltv,
      annualRatePercent: rate,
      tenureMonths: months,
    });
    const bank = calculateGoldLoan({
      weightGrams: weight,
      purity,
      ratePerGram24k: ratePerGram,
      ltvPercent: ltv,
      annualRatePercent: 9,
      tenureMonths: months,
    });
    const nbfc = calculateGoldLoan({
      weightGrams: weight,
      purity,
      ratePerGram24k: ratePerGram,
      ltvPercent: ltv,
      annualRatePercent: 12,
      tenureMonths: months,
    });

    return {
      detail: result,
      summaryCards: [
        {
          label: t("Tool_gold_loan_Result_MaxLoan"),
          value: inr(result.maxLoan),
          footnote: t("Tool_gold_loan_Result_MaxLoanFootnote", percent(ltv, 0)),
          variant: "primary" as const,
        },
        {
          label: t("Tool_gold_loan_Result_Emi"),
          value: inr(result.monthlyEmi),
          footnote: t("Tool_gold_loan_Result_EmiFootnote", months),
        },
        {
          label: t("Tool_gold_loan_Result_Interest"),
          value: inr(result.totalInterest),
          footnote: t("Common_Footnote_RatePa", percent(rate)),
          variant: "volatile" as const,
        },
      ],
      scenarios: [
        {
          name: t("Tool_gold_loan_Scenario_Bank"),
          primaryLabel: t("Tool_gold_loan_Result_Emi"),
          primaryValue: inr(bank.monthlyEmi),
          secondaryLabel: t("Tool_gold_loan_Result_Interest"),
          secondaryValue: inr(bank.totalInterest),
          variant: "best",
        },
        {
          name: t("Common_Scenario_Base"),
          primaryLabel: t("Tool_gold_loan_Result_Emi"),
          primaryValue: inr(result.monthlyEmi),
          secondaryLabel: t("Tool_gold_loan_Result_MaxLoan"),
          secondaryValue: inr(result.maxLoan),
          variant: "base",
        },
        {
          name: t("Tool_gold_loan_Scenario_Nbfc"),
          primaryLabel: t("Tool_gold_loan_Result_Emi"),
          primaryValue: inr(nbfc.monthlyEmi),
          secondaryLabel: t("Tool_gold_loan_Result_Interest"),
          secondaryValue: inr(nbfc.totalInterest),
          variant: "worst",
        },
      ],
    };
  }, [weight, purity, ratePerGram, ltv, rate, months, t]);

  return (
    <ToolPageShell
      title={t(tool.titleKey)}
      subtitle={t("Tool_gold_loan_Subtitle")}
      description={t(tool.descriptionKey)}
      icon={tool.icon}
      educate={
        <>
          <div className="fy-info-box">
            <strong>{t("Common_WhatYouLearn")}</strong>
            <p>{t("Tool_gold_loan_LearnText")}</p>
          </div>
          <FormulaCard
            title={t("Common_Formula")}
            code={"Value = grams × (purity/24) × 24K rate\nMax loan = Value × LTV%\nEMI on max loan"}
            note={t("Tool_gold_loan_FormulaNote")}
          />
        </>
      }
      below={<ToolInfoPanel info={goldLoanInfo(t)} />}
    >
      <div className="fy-form-card">
        <h3>{t("Common_YourInputs")}</h3>
        <div className="fy-field">
          <label>{t("Tool_gold_loan_LabelWeight")}</label>
          <input
            type="number"
            min={0}
            step={1}
            inputMode="decimal"
            value={weight}
            onChange={(e) => setWeight(Math.max(0, Number(e.target.value) || 0))}
          />
        </div>
        <div className="fy-field">
          <label>{t("Tool_gold_loan_LabelPurity")}</label>
          <select value={purity} onChange={(e) => setPurity(Number(e.target.value) as GoldPurity)}>
            <option value={22}>22K</option>
            <option value={24}>24K</option>
          </select>
        </div>
        <div className="fy-field">
          <label>{t("Tool_gold_loan_LabelRate")}</label>
          <input
            type="number"
            min={0}
            step={50}
            inputMode="decimal"
            value={ratePerGram}
            onChange={(e) => setRatePerGram(Math.max(0, Number(e.target.value) || 0))}
          />
        </div>
        <div className="fy-field">
          <label>{t("Tool_gold_loan_LabelLtv")}</label>
          <input
            type="number"
            min={0}
            max={100}
            step={1}
            inputMode="decimal"
            value={ltv}
            onChange={(e) => setLtv(Math.max(0, Number(e.target.value) || 0))}
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
        </div>
        <div className="fy-field">
          <label>{t("Common_Label_Months")}</label>
          <input
            type="number"
            min={1}
            max={36}
            step={1}
            inputMode="numeric"
            value={months}
            onChange={(e) => setMonths(Math.max(1, Number(e.target.value) || 1))}
          />
        </div>
        <button type="button" className="fy-btn-calc">
          {t("Common_Calculate")}
        </button>
      </div>

      <div className="fy-info-box fy-tax-verdict">
        <strong>{t("Tool_gold_loan_ValueTitle")}</strong>
        <p>
          {t(
            "Tool_gold_loan_ValueBody",
            inr(detail.goldValue),
            detail.pureGoldEquivalentGrams.toFixed(2),
            inr(detail.maxLoan),
          )}
        </p>
      </div>

      <ResultSummaryCards cards={summaryCards} />
      <ScenarioCompare
        title={t("Tool_gold_loan_ScenarioTitle")}
        subtitle={t("Tool_gold_loan_ScenarioSubtitle")}
        scenarios={scenarios}
      />
      <WorkedExample
        title={t("Tool_gold_loan_ExampleTitle")}
        subtitle={t("Tool_gold_loan_ExampleSubtitle")}
        steps={exampleSteps}
      />
    </ToolPageShell>
  );
}
