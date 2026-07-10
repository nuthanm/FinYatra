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
import { calculateForex } from "@/lib/finance/forex";
import { inr, percent } from "@/lib/finance/format";
import { getTool } from "@/lib/config/tools";
import { forexInfo } from "@/lib/tool-page-content";

export function ForexCalculator() {
  const t = useT();
  const tool = getTool("forex")!;

  const [amount, setAmount] = useState(1000);
  const [rate, setRate] = useState(83.5);
  const [feePercent, setFeePercent] = useState(1.5);

  const exampleSteps = useMemo(
    () => [
      t("Tool_forex_ExampleStep_1"),
      t("Tool_forex_ExampleStep_2"),
      t("Tool_forex_ExampleStep_3"),
      t("Tool_forex_ExampleStep_4"),
      t("Tool_forex_ExampleStep_5"),
    ],
    [t],
  );

  const { summaryCards, scenarios } = useMemo(() => {
    const base = calculateForex({ amount, rateInrPerUnit: rate, feePercent });
    const noFee = calculateForex({ amount, rateInrPerUnit: rate, feePercent: 0 });
    const highFee = calculateForex({
      amount,
      rateInrPerUnit: rate,
      feePercent: feePercent + 1.5,
    });

    return {
      summaryCards: [
        {
          label: t("Tool_forex_Result_Converted"),
          value: inr(base.convertedInr),
          footnote: t("Tool_forex_Result_ConvertedFootnote", String(amount), inr(rate)),
          variant: "primary" as const,
        },
        {
          label: t("Tool_forex_Result_Fee"),
          value: inr(base.feeInr),
          footnote: t("Tool_forex_Result_FeeFootnote", percent(feePercent)),
          variant: "volatile" as const,
        },
        {
          label: t("Tool_forex_Result_Net"),
          value: inr(base.netInr),
          footnote: t("Tool_forex_Result_NetFootnote"),
          variant: "secure" as const,
        },
      ],
      scenarios: [
        {
          name: t("Tool_forex_Scenario_NoFee"),
          primaryLabel: t("Tool_forex_Result_Net"),
          primaryValue: inr(noFee.netInr),
          secondaryLabel: t("Tool_forex_Result_Fee"),
          secondaryValue: inr(noFee.feeInr),
          variant: "best",
        },
        {
          name: t("Common_Scenario_Base"),
          primaryLabel: t("Tool_forex_Result_Net"),
          primaryValue: inr(base.netInr),
          secondaryLabel: t("Tool_forex_Result_Fee"),
          secondaryValue: inr(base.feeInr),
          variant: "base",
        },
        {
          name: t("Tool_forex_Scenario_HigherFee"),
          primaryLabel: t("Tool_forex_Result_Net"),
          primaryValue: inr(highFee.netInr),
          secondaryLabel: t("Tool_forex_Result_Fee"),
          secondaryValue: inr(highFee.feeInr),
          variant: "worst",
        },
      ],
    };
  }, [amount, rate, feePercent, t]);

  return (
    <ToolPageShell
      title={t(tool.titleKey)}
      subtitle={t("Tool_forex_Subtitle")}
      description={t(tool.descriptionKey)}
      icon={tool.icon}
      educate={
        <>
          <div className="fy-info-box">
            <strong>{t("Common_WhatYouLearn")}</strong>
            <p>{t("Tool_forex_LearnText")}</p>
          </div>
          <FormulaCard
            title={t("Common_Formula")}
            code={"converted = amount × rateINR\nfee = converted × fee%\nnet = converted − fee"}
            note={t("Tool_forex_FormulaNote")}
          />
        </>
      }
      below={<ToolInfoPanel info={forexInfo(t)} />}
    >
      <div className="fy-form-card">
        <h3>{t("Common_YourInputs")}</h3>
        <div className="fy-field">
          <label>{t("Tool_forex_LabelAmount")}</label>
          <input
            type="number"
            min={0}
            step={10}
            inputMode="decimal"
            value={amount}
            onChange={(e) => setAmount(Math.max(0, Number(e.target.value) || 0))}
          />
        </div>
        <div className="fy-field">
          <label>{t("Tool_forex_LabelRate")}</label>
          <input
            type="number"
            min={0}
            step={0.01}
            inputMode="decimal"
            value={rate}
            onChange={(e) => setRate(Math.max(0, Number(e.target.value) || 0))}
          />
          <p className="fy-field-hint">{t("Tool_forex_RateHint")}</p>
        </div>
        <div className="fy-field">
          <label>{t("Tool_forex_LabelFee")}</label>
          <input
            type="number"
            min={0}
            step={0.1}
            inputMode="decimal"
            value={feePercent}
            onChange={(e) => setFeePercent(Math.max(0, Number(e.target.value) || 0))}
          />
          <p className="fy-field-hint">{t("Tool_forex_FeeHint")}</p>
        </div>
        <button type="button" className="fy-btn-calc">
          {t("Common_Calculate")}
        </button>
      </div>

      <ResultSummaryCards cards={summaryCards} />
      <ScenarioCompare
        title={t("Tool_forex_ScenarioTitle")}
        subtitle={t("Tool_forex_ScenarioSubtitle")}
        scenarios={scenarios}
      />
      <WorkedExample
        title={t("Tool_forex_ExampleTitle")}
        subtitle={t("Tool_forex_ExampleSubtitle")}
        steps={exampleSteps}
      />
    </ToolPageShell>
  );
}
