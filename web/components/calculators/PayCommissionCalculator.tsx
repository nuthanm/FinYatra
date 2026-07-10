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
import { calculatePayCommission } from "@/lib/finance/payCommission";
import { inr, percent } from "@/lib/finance/format";
import { getTool } from "@/lib/config/tools";
import { payCommissionInfo } from "@/lib/tool-page-content";

export function PayCommissionCalculator() {
  const t = useT();
  const tool = getTool("pay-commission")!;

  const [basic, setBasic] = useState(25_000);
  const [fitment, setFitment] = useState(2.57);

  const exampleSteps = useMemo(
    () => [
      t("Tool_pay_commission_ExampleStep_1"),
      t("Tool_pay_commission_ExampleStep_2"),
      t("Tool_pay_commission_ExampleStep_3"),
      t("Tool_pay_commission_ExampleStep_4"),
      t("Tool_pay_commission_ExampleStep_5"),
    ],
    [t],
  );

  const { summaryCards, scenarios } = useMemo(() => {
    const result = calculatePayCommission({
      currentBasic: basic,
      fitmentFactor: fitment,
    });
    const lower = calculatePayCommission({
      currentBasic: basic,
      fitmentFactor: 2.25,
    });
    const higher = calculatePayCommission({
      currentBasic: basic,
      fitmentFactor: 2.67,
    });

    return {
      summaryCards: [
        {
          label: t("Tool_pay_commission_Result_Revised"),
          value: inr(result.revisedBasic),
          footnote: t(
            "Tool_pay_commission_Result_RevisedFootnote",
            fitment.toFixed(2),
          ),
          variant: "primary" as const,
        },
        {
          label: t("Tool_pay_commission_Result_Increase"),
          value: inr(result.increase),
          footnote: t(
            "Tool_pay_commission_Result_IncreaseFootnote",
            percent(result.increasePercent, 1),
          ),
          variant: "secure" as const,
        },
        {
          label: t("Tool_pay_commission_Result_Current"),
          value: inr(result.currentBasic),
          footnote: t("Tool_pay_commission_Result_CurrentFootnote"),
        },
      ],
      scenarios: [
        {
          name: t("Tool_pay_commission_Scenario_Lower"),
          primaryLabel: t("Tool_pay_commission_Result_Revised"),
          primaryValue: inr(lower.revisedBasic),
          secondaryLabel: t("Tool_pay_commission_LabelFitment"),
          secondaryValue: "2.25",
          variant: "worst" as const,
        },
        {
          name: t("Common_Scenario_Base"),
          primaryLabel: t("Tool_pay_commission_Result_Revised"),
          primaryValue: inr(result.revisedBasic),
          secondaryLabel: t("Tool_pay_commission_Result_Increase"),
          secondaryValue: inr(result.increase),
          variant: "base" as const,
        },
        {
          name: t("Tool_pay_commission_Scenario_Higher"),
          primaryLabel: t("Tool_pay_commission_Result_Revised"),
          primaryValue: inr(higher.revisedBasic),
          secondaryLabel: t("Tool_pay_commission_LabelFitment"),
          secondaryValue: "2.67",
          variant: "best" as const,
        },
      ],
    };
  }, [basic, fitment, t]);

  return (
    <ToolPageShell
      title={t(tool.titleKey)}
      subtitle={t("Tool_pay_commission_Subtitle")}
      description={t(tool.descriptionKey)}
      icon={tool.icon}
      educate={
        <>
          <div className="fy-info-box">
            <strong>{t("Common_WhatYouLearn")}</strong>
            <p>{t("Tool_pay_commission_LearnText")}</p>
          </div>
          <FormulaCard
            title={t("Common_Formula")}
            code={"revised basic = current basic × fitment\n7th CPC fitment ≈ 2.57"}
            note={t("Tool_pay_commission_FormulaNote")}
          />
        </>
      }
      below={<ToolInfoPanel info={payCommissionInfo(t)} />}
    >
      <div className="fy-form-card">
        <h3>{t("Common_YourInputs")}</h3>
        <div className="fy-field">
          <label>{t("Tool_pay_commission_LabelBasic")}</label>
          <input
            type="number"
            min={0}
            step={1000}
            inputMode="decimal"
            value={basic}
            onChange={(e) => setBasic(Math.max(0, Number(e.target.value) || 0))}
          />
        </div>
        <div className="fy-field">
          <label>{t("Tool_pay_commission_LabelFitment")}</label>
          <input
            type="number"
            min={0}
            max={5}
            step={0.01}
            inputMode="decimal"
            value={fitment}
            onChange={(e) => setFitment(Math.max(0, Number(e.target.value) || 0))}
          />
          <p className="fy-field-hint">{t("Tool_pay_commission_FitmentHint")}</p>
        </div>
        <button type="button" className="fy-btn-calc">
          {t("Common_Calculate")}
        </button>
      </div>

      <ResultSummaryCards cards={summaryCards} />
      <ScenarioCompare
        title={t("Tool_pay_commission_ScenarioTitle")}
        subtitle={t("Tool_pay_commission_ScenarioSubtitle")}
        scenarios={scenarios}
      />
      <WorkedExample
        title={t("Tool_pay_commission_ExampleTitle")}
        subtitle={t("Tool_pay_commission_ExampleSubtitle")}
        steps={exampleSteps}
      />
    </ToolPageShell>
  );
}
