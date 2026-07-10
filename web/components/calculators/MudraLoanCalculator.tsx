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
  calculateMudraLoan,
  MUDRA_DEFAULT_RATE,
  MUDRA_LIMITS,
  type MudraCategory,
} from "@/lib/finance/mudraLoan";
import { inr, percent } from "@/lib/finance/format";
import { getTool } from "@/lib/config/tools";
import { mudraLoanInfo } from "@/lib/tool-page-content";

const CATEGORIES: MudraCategory[] = ["shishu", "kishore", "tarun"];

export function MudraLoanCalculator() {
  const t = useT();
  const tool = getTool("mudra-loan")!;

  const [category, setCategory] = useState<MudraCategory>("kishore");
  const [amount, setAmount] = useState(3_00_000);
  const [rate, setRate] = useState(MUDRA_DEFAULT_RATE);
  const [months, setMonths] = useState(36);

  const exampleSteps = useMemo(
    () => [
      t("Tool_mudra_loan_ExampleStep_1"),
      t("Tool_mudra_loan_ExampleStep_2"),
      t("Tool_mudra_loan_ExampleStep_3"),
      t("Tool_mudra_loan_ExampleStep_4"),
      t("Tool_mudra_loan_ExampleStep_5"),
    ],
    [t],
  );

  const { summaryCards, scenarios, result } = useMemo(() => {
    const result = calculateMudraLoan({
      category,
      loanAmount: amount,
      annualRatePercent: rate,
      tenureMonths: months,
    });
    const shishu = calculateMudraLoan({
      category: "shishu",
      loanAmount: amount,
      annualRatePercent: rate,
      tenureMonths: months,
    });
    const tarun = calculateMudraLoan({
      category: "tarun",
      loanAmount: amount,
      annualRatePercent: rate,
      tenureMonths: months,
    });

    return {
      result,
      summaryCards: [
        {
          label: t("Tool_mudra_loan_Result_Eligible"),
          value: inr(result.eligibleAmount),
          footnote: t(
            "Tool_mudra_loan_Result_EligibleFootnote",
            inr(result.categoryLimit),
          ),
          variant: "primary" as const,
        },
        {
          label: t("Tool_mudra_loan_Result_Emi"),
          value: inr(result.monthlyEmi),
          footnote: t("Tool_mudra_loan_Result_EmiFootnote", months),
        },
        {
          label: t("Tool_mudra_loan_Result_Interest"),
          value: inr(result.totalInterest),
          footnote: t("Common_Footnote_RatePa", percent(rate)),
          variant: "volatile" as const,
        },
      ],
      scenarios: [
        {
          name: t("Tool_mudra_loan_Cat_Shishu"),
          primaryLabel: t("Tool_mudra_loan_Result_Eligible"),
          primaryValue: inr(shishu.eligibleAmount),
          secondaryLabel: t("Tool_mudra_loan_Result_Emi"),
          secondaryValue: inr(shishu.monthlyEmi),
          variant: "worst" as const,
        },
        {
          name: t("Common_Scenario_Base"),
          primaryLabel: t("Tool_mudra_loan_Result_Emi"),
          primaryValue: inr(result.monthlyEmi),
          secondaryLabel: t("Tool_mudra_loan_Result_Eligible"),
          secondaryValue: inr(result.eligibleAmount),
          variant: "base" as const,
        },
        {
          name: t("Tool_mudra_loan_Cat_Tarun"),
          primaryLabel: t("Tool_mudra_loan_Result_Eligible"),
          primaryValue: inr(tarun.eligibleAmount),
          secondaryLabel: t("Tool_mudra_loan_Result_Emi"),
          secondaryValue: inr(tarun.monthlyEmi),
          variant: "best" as const,
        },
      ],
    };
  }, [category, amount, rate, months, t]);

  return (
    <ToolPageShell
      title={t(tool.titleKey)}
      subtitle={t("Tool_mudra_loan_Subtitle")}
      description={t(tool.descriptionKey)}
      icon={tool.icon}
      educate={
        <>
          <div className="fy-info-box">
            <strong>{t("Common_WhatYouLearn")}</strong>
            <p>{t("Tool_mudra_loan_LearnText")}</p>
          </div>
          <FormulaCard
            title={t("Common_Formula")}
            code={
              "Shishu ≤ ₹50K · Kishore ≤ ₹5L · Tarun ≤ ₹10L\neligible = min(amount, limit)\nEMI on eligible"
            }
            note={t("Tool_mudra_loan_FormulaNote")}
          />
        </>
      }
      below={<ToolInfoPanel info={mudraLoanInfo(t)} />}
    >
      <div className="fy-form-card">
        <h3>{t("Common_YourInputs")}</h3>
        <div className="fy-field">
          <label>{t("Tool_mudra_loan_LabelCategory")}</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as MudraCategory)}
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {t(`Tool_mudra_loan_Cat_${c[0].toUpperCase()}${c.slice(1)}`)} (
                {inr(MUDRA_LIMITS[c])})
              </option>
            ))}
          </select>
        </div>
        <div className="fy-field">
          <label>{t("Tool_mudra_loan_LabelAmount")}</label>
          <input
            type="number"
            min={0}
            step={10000}
            inputMode="decimal"
            value={amount}
            onChange={(e) => setAmount(Math.max(0, Number(e.target.value) || 0))}
          />
        </div>
        <div className="fy-field">
          <label>{t("Tool_mudra_loan_LabelRate")}</label>
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
          <label>{t("Tool_mudra_loan_LabelTenure")}</label>
          <input
            type="number"
            min={1}
            max={120}
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

      {result.capped && (
        <div className="fy-info-box">
          <strong>{t("Tool_mudra_loan_CappedTitle")}</strong>
          <p>
            {t(
              "Tool_mudra_loan_CappedNote",
              inr(result.requestedAmount),
              inr(result.categoryLimit),
            )}
          </p>
        </div>
      )}

      <ResultSummaryCards cards={summaryCards} />
      <ScenarioCompare
        title={t("Tool_mudra_loan_ScenarioTitle")}
        subtitle={t("Tool_mudra_loan_ScenarioSubtitle")}
        scenarios={scenarios}
      />
      <WorkedExample
        title={t("Tool_mudra_loan_ExampleTitle")}
        subtitle={t("Tool_mudra_loan_ExampleSubtitle")}
        steps={exampleSteps}
      />
    </ToolPageShell>
  );
}
