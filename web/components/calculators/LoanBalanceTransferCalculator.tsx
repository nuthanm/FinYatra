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
import { calculateLoanBalanceTransfer } from "@/lib/finance/loanBalanceTransfer";
import { inr, percent } from "@/lib/finance/format";
import { getTool } from "@/lib/config/tools";
import { loanBalanceTransferInfo } from "@/lib/tool-page-content";

export function LoanBalanceTransferCalculator() {
  const t = useT();
  const tool = getTool("loan-balance-transfer")!;

  const [outstanding, setOutstanding] = useState(2_000_000);
  const [currentRate, setCurrentRate] = useState(9.5);
  const [remainingMonths, setRemainingMonths] = useState(180);
  const [newRate, setNewRate] = useState(8.2);
  const [feePercent, setFeePercent] = useState(1);

  const exampleSteps = useMemo(
    () => [
      t("Tool_loan_balance_transfer_ExampleStep_1"),
      t("Tool_loan_balance_transfer_ExampleStep_2"),
      t("Tool_loan_balance_transfer_ExampleStep_3"),
      t("Tool_loan_balance_transfer_ExampleStep_4"),
      t("Tool_loan_balance_transfer_ExampleStep_5"),
    ],
    [t],
  );

  const { summaryCards, scenarios, result } = useMemo(() => {
    const r = calculateLoanBalanceTransfer({
      outstanding,
      currentRatePercent: currentRate,
      remainingMonths,
      newRatePercent: newRate,
      processingFeePercent: feePercent,
    });

    const breakEvenLabel = Number.isFinite(r.breakEvenMonths)
      ? t("Tool_loan_balance_transfer_BreakEvenValue", String(Math.ceil(r.breakEvenMonths)))
      : t("Tool_loan_balance_transfer_BreakEvenNever");

    return {
      result: r,
      summaryCards: [
        {
          label: t("Tool_loan_balance_transfer_Result_NetSavings"),
          value: inr(r.netSavings),
          footnote: t("Tool_loan_balance_transfer_Result_NetSavingsFootnote", inr(r.processingFee)),
          variant: (r.worthTransferring ? "secure" : "volatile") as "secure" | "volatile",
        },
        {
          label: t("Tool_loan_balance_transfer_Result_InterestSaved"),
          value: inr(r.interestSaved),
          footnote: t("Tool_loan_balance_transfer_Result_InterestSavedFootnote"),
          variant: "primary" as const,
        },
        {
          label: t("Tool_loan_balance_transfer_Result_BreakEven"),
          value: breakEvenLabel,
          footnote: t("Tool_loan_balance_transfer_Result_BreakEvenFootnote", inr(r.monthlyEmiSaving)),
        },
      ],
      scenarios: [
        {
          name: t("Tool_loan_balance_transfer_Scenario_Current"),
          primaryLabel: t("Tool_loan_balance_transfer_LabelCurrentEmi"),
          primaryValue: inr(r.currentEmi),
          secondaryLabel: t("Tool_loan_balance_transfer_LabelCurrentInterest"),
          secondaryValue: inr(r.currentTotalInterest),
          variant: "worst",
        },
        {
          name: t("Common_Scenario_Base"),
          primaryLabel: t("Tool_loan_balance_transfer_Result_NetSavings"),
          primaryValue: inr(r.netSavings),
          secondaryLabel: t("Tool_loan_balance_transfer_Result_BreakEven"),
          secondaryValue: breakEvenLabel,
          variant: "base",
        },
        {
          name: t("Tool_loan_balance_transfer_Scenario_New"),
          primaryLabel: t("Tool_loan_balance_transfer_LabelNewEmi"),
          primaryValue: inr(r.newEmi),
          secondaryLabel: t("Tool_loan_balance_transfer_LabelNewInterest"),
          secondaryValue: inr(r.newTotalInterest),
          variant: "best",
        },
      ],
    };
  }, [outstanding, currentRate, remainingMonths, newRate, feePercent, t]);

  return (
    <ToolPageShell
      title={t(tool.titleKey)}
      subtitle={t("Tool_loan_balance_transfer_Subtitle")}
      description={t(tool.descriptionKey)}
      icon={tool.icon}
      educate={
        <>
          <div className="fy-info-box">
            <strong>{t("Common_WhatYouLearn")}</strong>
            <p>{t("Tool_loan_balance_transfer_LearnText")}</p>
          </div>
          <FormulaCard
            title={t("Common_Formula")}
            code={
              "EMI_old / EMI_new from reducing formula\nFee = Outstanding × fee%\nNet save = (I_old − I_new) − Fee\nBreak-even ≈ Fee / (EMI_old − EMI_new)"
            }
            note={t("Tool_loan_balance_transfer_FormulaNote")}
          />
        </>
      }
      below={<ToolInfoPanel info={loanBalanceTransferInfo(t)} />}
    >
      <div className="fy-form-card">
        <h3>{t("Common_YourInputs")}</h3>
        <div className="fy-field">
          <label>{t("Tool_loan_balance_transfer_LabelOutstanding")}</label>
          <input
            type="number"
            min={0}
            step={10000}
            inputMode="decimal"
            value={outstanding}
            onChange={(e) => setOutstanding(Math.max(0, Number(e.target.value) || 0))}
          />
        </div>
        <div className="fy-field">
          <label>{t("Tool_loan_balance_transfer_LabelCurrentRate")}</label>
          <input
            type="number"
            min={0}
            step={0.05}
            inputMode="decimal"
            value={currentRate}
            onChange={(e) => setCurrentRate(Math.max(0, Number(e.target.value) || 0))}
          />
        </div>
        <div className="fy-field">
          <label>{t("Tool_loan_balance_transfer_LabelMonths")}</label>
          <input
            type="number"
            min={1}
            max={480}
            step={1}
            inputMode="numeric"
            value={remainingMonths}
            onChange={(e) =>
              setRemainingMonths(Math.max(1, Math.min(480, Number(e.target.value) || 1)))
            }
          />
        </div>
        <div className="fy-field">
          <label>{t("Tool_loan_balance_transfer_LabelNewRate")}</label>
          <input
            type="number"
            min={0}
            step={0.05}
            inputMode="decimal"
            value={newRate}
            onChange={(e) => setNewRate(Math.max(0, Number(e.target.value) || 0))}
          />
        </div>
        <div className="fy-field">
          <label>{t("Tool_loan_balance_transfer_LabelFee")}</label>
          <input
            type="number"
            min={0}
            max={10}
            step={0.1}
            inputMode="decimal"
            value={feePercent}
            onChange={(e) => setFeePercent(Math.max(0, Number(e.target.value) || 0))}
          />
          <p className="fy-field-hint">{t("Tool_loan_balance_transfer_FeeHint")}</p>
        </div>
        <button type="button" className="fy-btn-calc">
          {t("Common_Calculate")}
        </button>
      </div>

      <div className="fy-info-box fy-tax-verdict">
        <strong>{t("Tool_loan_balance_transfer_VerdictTitle")}</strong>
        <p>
          {result.worthTransferring
            ? t(
                "Tool_loan_balance_transfer_VerdictYes",
                inr(result.netSavings),
                Number.isFinite(result.breakEvenMonths)
                  ? String(Math.ceil(result.breakEvenMonths))
                  : "—",
              )
            : t(
                "Tool_loan_balance_transfer_VerdictNo",
                inr(result.processingFee),
                inr(result.interestSaved),
              )}
        </p>
      </div>

      <ResultSummaryCards cards={summaryCards} />
      <ScenarioCompare
        title={t("Tool_loan_balance_transfer_ScenarioTitle")}
        subtitle={t("Tool_loan_balance_transfer_ScenarioSubtitle")}
        scenarios={scenarios}
      />
      <WorkedExample
        title={t("Tool_loan_balance_transfer_ExampleTitle")}
        subtitle={t("Tool_loan_balance_transfer_ExampleSubtitle")}
        steps={exampleSteps}
      />
    </ToolPageShell>
  );
}
