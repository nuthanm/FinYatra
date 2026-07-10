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
import { calculateSavingsAccountInterest } from "@/lib/finance/savingsAccountInterest";
import { inr, percent } from "@/lib/finance/format";
import { getTool } from "@/lib/config/tools";
import { savingsAccountInterestInfo } from "@/lib/tool-page-content";

export function SavingsAccountInterestCalculator() {
  const t = useT();
  const tool = getTool("savings-account-interest")!;

  const [balance, setBalance] = useState(200_000);
  const [rate, setRate] = useState(2.75);
  const [days, setDays] = useState(365);

  const exampleSteps = useMemo(
    () => [
      t("Tool_savings_account_interest_ExampleStep_1"),
      t("Tool_savings_account_interest_ExampleStep_2"),
      t("Tool_savings_account_interest_ExampleStep_3"),
      t("Tool_savings_account_interest_ExampleStep_4"),
      t("Tool_savings_account_interest_ExampleStep_5"),
    ],
    [t],
  );

  const { summaryCards, scenarios, result } = useMemo(() => {
    const result = calculateSavingsAccountInterest({ balance, annualRatePercent: rate, days });
    const low = calculateSavingsAccountInterest({ balance, annualRatePercent: 2.7, days });
    const high = calculateSavingsAccountInterest({ balance, annualRatePercent: 3.0, days });

    return {
      result,
      summaryCards: [
        {
          label: t("Tool_savings_account_interest_Result_Interest"),
          value: inr(result.interest),
          footnote: t(
            "Tool_savings_account_interest_Result_InterestFootnote",
            percent(rate),
            String(days),
          ),
          variant: "primary" as const,
        },
        {
          label: t("Tool_savings_account_interest_Result_Balance"),
          value: inr(result.balance),
          footnote: t("Tool_savings_account_interest_Result_BalanceFootnote"),
        },
        {
          label: t("Tool_savings_account_interest_Result_Taxable"),
          value: inr(result.taxableAbove80tta),
          footnote: t(
            "Tool_savings_account_interest_Result_TaxableFootnote",
            inr(result.section80ttaLimit),
          ),
        },
      ],
      scenarios: [
        {
          name: t("Tool_savings_account_interest_Scenario_Low"),
          primaryLabel: t("Tool_savings_account_interest_Result_Interest"),
          primaryValue: inr(low.interest),
          secondaryLabel: t("Common_Label_Return"),
          secondaryValue: "2.7%",
          variant: "worst",
        },
        {
          name: t("Common_Scenario_Base"),
          primaryLabel: t("Tool_savings_account_interest_Result_Interest"),
          primaryValue: inr(result.interest),
          secondaryLabel: t("Common_Label_Return"),
          secondaryValue: percent(rate),
          variant: "base",
        },
        {
          name: t("Tool_savings_account_interest_Scenario_High"),
          primaryLabel: t("Tool_savings_account_interest_Result_Interest"),
          primaryValue: inr(high.interest),
          secondaryLabel: t("Common_Label_Return"),
          secondaryValue: "3%",
          variant: "best",
        },
      ],
    };
  }, [balance, rate, days, t]);

  return (
    <ToolPageShell
      title={t(tool.titleKey)}
      subtitle={t("Tool_savings_account_interest_Subtitle")}
      description={t(tool.descriptionKey)}
      icon={tool.icon}
      educate={
        <>
          <div className="fy-info-box">
            <strong>{t("Common_WhatYouLearn")}</strong>
            <p>{t("Tool_savings_account_interest_LearnText")}</p>
          </div>
          <FormulaCard
            title={t("Common_Formula")}
            code={"Interest = Balance × Rate% × Days / 365\n80TTA: up to ₹10,000 exempt (non-senior)"}
            note={t("Tool_savings_account_interest_FormulaNote")}
          />
        </>
      }
      below={<ToolInfoPanel info={savingsAccountInterestInfo(t)} />}
    >
      <div className="fy-form-card">
        <h3>{t("Common_YourInputs")}</h3>
        <div className="fy-field">
          <label>{t("Tool_savings_account_interest_LabelBalance")}</label>
          <input
            type="number"
            min={0}
            step={1000}
            inputMode="decimal"
            value={balance}
            onChange={(e) => setBalance(Math.max(0, Number(e.target.value) || 0))}
          />
        </div>
        <div className="fy-field">
          <label>{t("Tool_savings_account_interest_LabelRate")}</label>
          <input
            type="number"
            min={0}
            max={10}
            step={0.05}
            inputMode="decimal"
            value={rate}
            onChange={(e) => setRate(Math.max(0, Number(e.target.value) || 0))}
          />
          <p className="fy-field-hint">{t("Tool_savings_account_interest_RateHint")}</p>
        </div>
        <div className="fy-field">
          <label>{t("Tool_savings_account_interest_LabelDays")}</label>
          <input
            type="number"
            min={1}
            max={366}
            step={1}
            inputMode="numeric"
            value={days}
            onChange={(e) => setDays(Math.max(1, Math.min(366, Number(e.target.value) || 1)))}
          />
        </div>
        <button type="button" className="fy-btn-calc">
          {t("Common_Calculate")}
        </button>
      </div>

      <div className="fy-info-box fy-tax-verdict">
        <strong>{t("Tool_savings_account_interest_VerdictTitle")}</strong>
        <p>
          {result.taxableAbove80tta > 0
            ? t(
                "Tool_savings_account_interest_VerdictTaxable",
                inr(result.interest),
                inr(result.taxableAbove80tta),
              )
            : t("Tool_savings_account_interest_VerdictOk", inr(result.interest))}
        </p>
      </div>

      <ResultSummaryCards cards={summaryCards} />
      <ScenarioCompare
        title={t("Tool_savings_account_interest_ScenarioTitle")}
        subtitle={t("Tool_savings_account_interest_ScenarioSubtitle")}
        scenarios={scenarios}
      />
      <WorkedExample
        title={t("Tool_savings_account_interest_ExampleTitle")}
        subtitle={t("Tool_savings_account_interest_ExampleSubtitle")}
        steps={exampleSteps}
      />
    </ToolPageShell>
  );
}
