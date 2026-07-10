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
import { calculateHomeLoanPrepayment } from "@/lib/finance/homeLoanPrepayment";
import { inr } from "@/lib/finance/format";
import { getTool } from "@/lib/config/tools";
import { homeLoanPrepaymentInfo } from "@/lib/tool-page-content";

export function HomeLoanPrepaymentCalculator() {
  const t = useT();
  const tool = getTool("home-loan-prepayment")!;

  const [outstanding, setOutstanding] = useState(3_000_000);
  const [rate, setRate] = useState(8.5);
  const [remainingMonths, setRemainingMonths] = useState(180);
  const [prepayment, setPrepayment] = useState(500_000);

  const exampleSteps = useMemo(
    () => [
      t("Tool_home_loan_prepayment_ExampleStep_1"),
      t("Tool_home_loan_prepayment_ExampleStep_2"),
      t("Tool_home_loan_prepayment_ExampleStep_3"),
      t("Tool_home_loan_prepayment_ExampleStep_4"),
      t("Tool_home_loan_prepayment_ExampleStep_5"),
    ],
    [t],
  );

  const { summaryCards, scenarios, result } = useMemo(() => {
    const r = calculateHomeLoanPrepayment({
      outstandingPrincipal: outstanding,
      annualRatePercent: rate,
      remainingMonths,
      prepaymentAmount: prepayment,
    });

    const betterSaved = Math.max(r.reduceEmi.interestSaved, r.reduceTenure.interestSaved);

    return {
      result: r,
      summaryCards: [
        {
          label: t("Tool_home_loan_prepayment_Result_CurrentEmi"),
          value: inr(r.currentEmi),
          footnote: t("Tool_home_loan_prepayment_Result_CurrentEmiFootnote"),
          variant: "primary" as const,
        },
        {
          label: t("Tool_home_loan_prepayment_Result_NewPrincipal"),
          value: inr(r.newPrincipal),
          footnote: t("Tool_home_loan_prepayment_Result_NewPrincipalFootnote", inr(r.prepaymentApplied)),
        },
        {
          label: t("Tool_home_loan_prepayment_Result_BestSave"),
          value: inr(betterSaved),
          footnote: t("Tool_home_loan_prepayment_Result_BestSaveFootnote"),
          variant: "secure" as const,
        },
      ],
      scenarios: [
        {
          name: t("Tool_home_loan_prepayment_Scenario_ReduceEmi"),
          primaryLabel: t("Tool_home_loan_prepayment_LabelNewEmi"),
          primaryValue: inr(r.reduceEmi.emi),
          secondaryLabel: t("Tool_home_loan_prepayment_LabelInterestSaved"),
          secondaryValue: inr(r.reduceEmi.interestSaved),
          variant: "worst",
        },
        {
          name: t("Common_Scenario_Base"),
          primaryLabel: t("Tool_home_loan_prepayment_Result_CurrentEmi"),
          primaryValue: inr(r.currentEmi),
          secondaryLabel: t("Tool_home_loan_prepayment_LabelOriginalInterest"),
          secondaryValue: inr(r.originalTotalInterest),
          variant: "base",
        },
        {
          name: t("Tool_home_loan_prepayment_Scenario_ReduceTenure"),
          primaryLabel: t("Tool_home_loan_prepayment_LabelNewMonths"),
          primaryValue: t("Tool_home_loan_prepayment_MonthsValue", String(r.reduceTenure.months)),
          secondaryLabel: t("Tool_home_loan_prepayment_LabelInterestSaved"),
          secondaryValue: inr(r.reduceTenure.interestSaved),
          variant: "best",
        },
      ],
    };
  }, [outstanding, rate, remainingMonths, prepayment, t]);

  return (
    <ToolPageShell
      title={t(tool.titleKey)}
      subtitle={t("Tool_home_loan_prepayment_Subtitle")}
      description={t(tool.descriptionKey)}
      icon={tool.icon}
      educate={
        <>
          <div className="fy-info-box">
            <strong>{t("Common_WhatYouLearn")}</strong>
            <p>{t("Tool_home_loan_prepayment_LearnText")}</p>
          </div>
          <FormulaCard
            title={t("Common_Formula")}
            code={"EMI = P × r × (1+r)^n / ((1+r)^n − 1)\nReduce EMI: same n, new P\nReduce tenure: same EMI, solve n"}
            note={t("Tool_home_loan_prepayment_FormulaNote")}
          />
        </>
      }
      below={<ToolInfoPanel info={homeLoanPrepaymentInfo(t)} />}
    >
      <div className="fy-form-card">
        <h3>{t("Common_YourInputs")}</h3>
        <div className="fy-field">
          <label>{t("Tool_home_loan_prepayment_LabelPrincipal")}</label>
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
          <label>{t("Tool_home_loan_prepayment_LabelRate")}</label>
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
          <label>{t("Tool_home_loan_prepayment_LabelMonths")}</label>
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
          <label>{t("Tool_home_loan_prepayment_LabelPrepay")}</label>
          <input
            type="number"
            min={0}
            step={10000}
            inputMode="decimal"
            value={prepayment}
            onChange={(e) => setPrepayment(Math.max(0, Number(e.target.value) || 0))}
          />
          <p className="fy-field-hint">{t("Tool_home_loan_prepayment_PrepayHint")}</p>
        </div>
        <button type="button" className="fy-btn-calc">
          {t("Common_Calculate")}
        </button>
      </div>

      <div className="fy-info-box fy-tax-verdict">
        <strong>{t("Tool_home_loan_prepayment_VerdictTitle")}</strong>
        <p>
          {result.reduceTenure.interestSaved >= result.reduceEmi.interestSaved
            ? t(
                "Tool_home_loan_prepayment_VerdictTenure",
                inr(result.reduceTenure.interestSaved),
                String(result.reduceTenure.months),
              )
            : t(
                "Tool_home_loan_prepayment_VerdictEmi",
                inr(result.reduceEmi.interestSaved),
                inr(result.reduceEmi.emi),
              )}
        </p>
      </div>

      <ResultSummaryCards cards={summaryCards} />
      <ScenarioCompare
        title={t("Tool_home_loan_prepayment_ScenarioTitle")}
        subtitle={t("Tool_home_loan_prepayment_ScenarioSubtitle")}
        scenarios={scenarios}
      />
      <WorkedExample
        title={t("Tool_home_loan_prepayment_ExampleTitle")}
        subtitle={t("Tool_home_loan_prepayment_ExampleSubtitle")}
        steps={exampleSteps}
      />
    </ToolPageShell>
  );
}
