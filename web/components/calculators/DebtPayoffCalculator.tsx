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
import { calculateDebtPayoff, type DebtPayoffStrategy } from "@/lib/finance/debtPayoff";
import { inr } from "@/lib/finance/format";
import { getTool } from "@/lib/config/tools";
import { debtPayoffInfo } from "@/lib/tool-page-content";

export function DebtPayoffCalculator() {
  const t = useT();
  const tool = getTool("debt-payoff")!;

  const [balance, setBalance] = useState(3_00_000);
  const [rate, setRate] = useState(14);
  const [emi, setEmi] = useState(12_000);
  const [extra, setExtra] = useState(5_000);
  const [strategy, setStrategy] = useState<DebtPayoffStrategy>("avalanche");

  const exampleSteps = useMemo(
    () => [
      t("Tool_debt_payoff_ExampleStep_1"),
      t("Tool_debt_payoff_ExampleStep_2"),
      t("Tool_debt_payoff_ExampleStep_3"),
      t("Tool_debt_payoff_ExampleStep_4"),
      t("Tool_debt_payoff_ExampleStep_5"),
    ],
    [t],
  );

  const { summaryCards, scenarios, result } = useMemo(() => {
    const result = calculateDebtPayoff({
      balance,
      annualRatePercent: rate,
      monthlyPayment: emi,
      extraPayment: extra,
      strategy,
    });
    const noExtra = calculateDebtPayoff({
      balance,
      annualRatePercent: rate,
      monthlyPayment: emi,
      extraPayment: 0,
      strategy,
    });
    const moreExtra = calculateDebtPayoff({
      balance,
      annualRatePercent: rate,
      monthlyPayment: emi,
      extraPayment: extra * 2,
      strategy,
    });

    return {
      result,
      summaryCards: [
        {
          label: t("Tool_debt_payoff_Result_Months"),
          value: result.feasible ? String(result.monthsWithExtra) : t("Tool_debt_payoff_Result_Never"),
          footnote: t("Tool_debt_payoff_Result_MonthsFootnote", inr(result.totalMonthly)),
          variant: "primary" as const,
        },
        {
          label: t("Tool_debt_payoff_Result_InterestSaved"),
          value: inr(result.interestSaved),
          footnote: t("Tool_debt_payoff_Result_InterestSavedFootnote"),
          variant: "secure" as const,
        },
        {
          label: t("Tool_debt_payoff_Result_MonthsSaved"),
          value: String(result.monthsSaved),
          footnote: t("Tool_debt_payoff_Result_MonthsSavedFootnote"),
        },
      ],
      scenarios: [
        {
          name: t("Tool_debt_payoff_Scenario_NoExtra"),
          primaryLabel: t("Tool_debt_payoff_Result_Months"),
          primaryValue: noExtra.feasible ? String(noExtra.monthsWithExtra) : "—",
          secondaryLabel: t("Tool_debt_payoff_Result_Interest"),
          secondaryValue: inr(noExtra.interestWithExtra),
          variant: "worst" as const,
        },
        {
          name: t("Common_Scenario_Base"),
          primaryLabel: t("Tool_debt_payoff_Result_Months"),
          primaryValue: result.feasible ? String(result.monthsWithExtra) : "—",
          secondaryLabel: t("Tool_debt_payoff_Result_Interest"),
          secondaryValue: inr(result.interestWithExtra),
          variant: "base" as const,
        },
        {
          name: t("Tool_debt_payoff_Scenario_MoreExtra"),
          primaryLabel: t("Tool_debt_payoff_Result_Months"),
          primaryValue: moreExtra.feasible ? String(moreExtra.monthsWithExtra) : "—",
          secondaryLabel: t("Tool_debt_payoff_Result_InterestSaved"),
          secondaryValue: inr(moreExtra.interestSaved),
          variant: "best" as const,
        },
      ],
    };
  }, [balance, rate, emi, extra, strategy, t]);

  return (
    <ToolPageShell
      title={t(tool.titleKey)}
      subtitle={t("Tool_debt_payoff_Subtitle")}
      description={t(tool.descriptionKey)}
      icon={tool.icon}
      educate={
        <>
          <div className="fy-info-box">
            <strong>{t("Common_WhatYouLearn")}</strong>
            <p>{t("Tool_debt_payoff_LearnText")}</p>
          </div>
          <FormulaCard
            title={t("Common_Formula")}
            code={
              "Each month: interest = balance × r/12\nPrincipal paid = payment − interest\nRepeat until balance = 0\nExtra payment shortens tenure"
            }
            note={t("Tool_debt_payoff_FormulaNote")}
          />
        </>
      }
      below={<ToolInfoPanel info={debtPayoffInfo(t)} />}
    >
      <div className="fy-form-card">
        <h3>{t("Common_YourInputs")}</h3>
        <div className="fy-field">
          <label>{t("Tool_debt_payoff_LabelBalance")}</label>
          <input
            type="number"
            min={0}
            step={10000}
            inputMode="decimal"
            value={balance}
            onChange={(e) => setBalance(Math.max(0, Number(e.target.value) || 0))}
          />
        </div>
        <div className="fy-field">
          <label>{t("Tool_debt_payoff_LabelRate")}</label>
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
          <label>{t("Tool_debt_payoff_LabelEmi")}</label>
          <input
            type="number"
            min={0}
            step={500}
            inputMode="decimal"
            value={emi}
            onChange={(e) => setEmi(Math.max(0, Number(e.target.value) || 0))}
          />
        </div>
        <div className="fy-field">
          <label>{t("Tool_debt_payoff_LabelExtra")}</label>
          <input
            type="number"
            min={0}
            step={500}
            inputMode="decimal"
            value={extra}
            onChange={(e) => setExtra(Math.max(0, Number(e.target.value) || 0))}
          />
        </div>
        <div className="fy-field">
          <label>{t("Tool_debt_payoff_LabelStrategy")}</label>
          <select
            value={strategy}
            onChange={(e) => setStrategy(e.target.value as DebtPayoffStrategy)}
          >
            <option value="avalanche">{t("Tool_debt_payoff_Strategy_Avalanche")}</option>
            <option value="snowball">{t("Tool_debt_payoff_Strategy_Snowball")}</option>
          </select>
          <p className="fy-field-hint">{t("Tool_debt_payoff_StrategyHint")}</p>
        </div>
        <button type="button" className="fy-btn-calc">
          {t("Common_Calculate")}
        </button>
      </div>

      <ResultSummaryCards cards={summaryCards} />
      {!result.feasible ? (
        <div className="fy-info-box">
          <p>{t("Tool_debt_payoff_VerdictNever")}</p>
        </div>
      ) : null}
      <ScenarioCompare
        title={t("Tool_debt_payoff_ScenarioTitle")}
        subtitle={t("Tool_debt_payoff_ScenarioSubtitle")}
        scenarios={scenarios}
      />
      <WorkedExample
        title={t("Tool_debt_payoff_ExampleTitle")}
        subtitle={t("Tool_debt_payoff_ExampleSubtitle")}
        steps={exampleSteps}
      />
    </ToolPageShell>
  );
}
