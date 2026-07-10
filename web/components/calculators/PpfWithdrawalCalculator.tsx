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
  calculatePpfWithdrawal,
  type PpfMode,
} from "@/lib/finance/ppfWithdrawal";
import { inr, percent } from "@/lib/finance/format";
import { getTool } from "@/lib/config/tools";
import { ppfWithdrawalInfo } from "@/lib/tool-page-content";

export function PpfWithdrawalCalculator() {
  const t = useT();
  const tool = getTool("ppf-withdrawal")!;

  const [accountYear, setAccountYear] = useState(8);
  const [balance, setBalance] = useState(500_000);
  const [mode, setMode] = useState<PpfMode>("withdrawal");

  const exampleSteps = useMemo(
    () => [
      t("Tool_ppf_withdrawal_ExampleStep_1"),
      t("Tool_ppf_withdrawal_ExampleStep_2"),
      t("Tool_ppf_withdrawal_ExampleStep_3"),
      t("Tool_ppf_withdrawal_ExampleStep_4"),
      t("Tool_ppf_withdrawal_ExampleStep_5"),
    ],
    [t],
  );

  const noteMap = {
    too_early: "Tool_ppf_withdrawal_Note_TooEarly",
    loan_window: "Tool_ppf_withdrawal_Note_LoanWindow",
    withdrawal_ok: "Tool_ppf_withdrawal_Note_WithdrawalOk",
    loan_closed: "Tool_ppf_withdrawal_Note_LoanClosed",
    mature: "Tool_ppf_withdrawal_Note_Mature",
  } as const;

  const { summaryCards, scenarios, note } = useMemo(() => {
    const result = calculatePpfWithdrawal({ accountYear, balance, mode });
    const asLoan = calculatePpfWithdrawal({ accountYear, balance, mode: "loan" });
    const asWithdraw = calculatePpfWithdrawal({ accountYear, balance, mode: "withdrawal" });
    const later = calculatePpfWithdrawal({
      accountYear: Math.min(15, accountYear + 2),
      balance,
      mode: "withdrawal",
    });

    return {
      note: t(noteMap[result.noteKey]),
      summaryCards: [
        {
          label: t("Tool_ppf_withdrawal_Result_Max"),
          value: inr(result.maxAmount),
          footnote: result.eligible
            ? t("Tool_ppf_withdrawal_Result_MaxFootnote", percent(result.fraction * 100))
            : t("Tool_ppf_withdrawal_Result_NotEligible"),
          variant: "primary" as const,
        },
        {
          label: t("Tool_ppf_withdrawal_Result_Balance"),
          value: inr(result.balance),
          footnote: t("Tool_ppf_withdrawal_Result_BalanceFootnote", accountYear),
        },
        {
          label: t("Tool_ppf_withdrawal_Result_Status"),
          value: result.eligible
            ? t("Tool_ppf_withdrawal_Status_Eligible")
            : t("Tool_ppf_withdrawal_Status_NotEligible"),
          footnote: t(noteMap[result.noteKey]),
          variant: result.eligible ? ("secure" as const) : ("volatile" as const),
        },
      ],
      scenarios: [
        {
          name: t("Tool_ppf_withdrawal_Scenario_Loan"),
          primaryLabel: t("Tool_ppf_withdrawal_Result_Max"),
          primaryValue: inr(asLoan.maxAmount),
          secondaryLabel: t("Tool_ppf_withdrawal_Result_Status"),
          secondaryValue: asLoan.eligible
            ? t("Tool_ppf_withdrawal_Status_Eligible")
            : t("Tool_ppf_withdrawal_Status_NotEligible"),
          variant: "worst",
        },
        {
          name: t("Tool_ppf_withdrawal_Scenario_Withdraw"),
          primaryLabel: t("Tool_ppf_withdrawal_Result_Max"),
          primaryValue: inr(asWithdraw.maxAmount),
          secondaryLabel: t("Tool_ppf_withdrawal_LabelYear"),
          secondaryValue: String(accountYear),
          variant: "base",
        },
        {
          name: t("Tool_ppf_withdrawal_Scenario_Later"),
          primaryLabel: t("Tool_ppf_withdrawal_Result_Max"),
          primaryValue: inr(later.maxAmount),
          secondaryLabel: t("Tool_ppf_withdrawal_LabelYear"),
          secondaryValue: String(Math.min(15, accountYear + 2)),
          variant: "best",
        },
      ],
    };
  }, [accountYear, balance, mode, t]);

  return (
    <ToolPageShell
      title={t(tool.titleKey)}
      subtitle={t("Tool_ppf_withdrawal_Subtitle")}
      description={t(tool.descriptionKey)}
      icon={tool.icon}
      educate={
        <>
          <div className="fy-info-box">
            <strong>{t("Common_WhatYouLearn")}</strong>
            <p>{t("Tool_ppf_withdrawal_LearnText")}</p>
          </div>
          <FormulaCard
            title={t("Common_Formula")}
            code={"Loan (Y3–6): ≈ 25% of balance\nPartial (Y7+): ≈ 50% of balance"}
            note={t("Tool_ppf_withdrawal_FormulaNote")}
          />
        </>
      }
      below={<ToolInfoPanel info={ppfWithdrawalInfo(t)} />}
    >
      <div className="fy-form-card">
        <h3>{t("Common_YourInputs")}</h3>
        <div className="fy-field">
          <label>{t("Tool_ppf_withdrawal_LabelYear")}</label>
          <input
            type="number"
            min={1}
            max={20}
            step={1}
            inputMode="numeric"
            value={accountYear}
            onChange={(e) => setAccountYear(Math.max(1, Number(e.target.value) || 1))}
          />
          <p className="fy-field-hint">{t("Tool_ppf_withdrawal_YearHint")}</p>
        </div>
        <div className="fy-field">
          <label>{t("Tool_ppf_withdrawal_LabelBalance")}</label>
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
          <label>{t("Tool_ppf_withdrawal_LabelMode")}</label>
          <select value={mode} onChange={(e) => setMode(e.target.value as PpfMode)}>
            <option value="withdrawal">{t("Tool_ppf_withdrawal_Mode_Withdrawal")}</option>
            <option value="loan">{t("Tool_ppf_withdrawal_Mode_Loan")}</option>
          </select>
        </div>
        <button type="button" className="fy-btn-calc">
          {t("Common_Calculate")}
        </button>
      </div>

      <div className="fy-info-box">
        <p>{note}</p>
      </div>

      <ResultSummaryCards cards={summaryCards} />
      <ScenarioCompare
        title={t("Tool_ppf_withdrawal_ScenarioTitle")}
        subtitle={t("Tool_ppf_withdrawal_ScenarioSubtitle")}
        scenarios={scenarios}
      />
      <WorkedExample
        title={t("Tool_ppf_withdrawal_ExampleTitle")}
        subtitle={t("Tool_ppf_withdrawal_ExampleSubtitle")}
        steps={exampleSteps}
      />
    </ToolPageShell>
  );
}
