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
import { calculateMotorInsuranceNcb } from "@/lib/finance/motorInsuranceNcb";
import { inr, percent } from "@/lib/finance/format";
import { getTool } from "@/lib/config/tools";
import { motorInsuranceNcbInfo } from "@/lib/tool-page-content";

export function MotorInsuranceNcbCalculator() {
  const t = useT();
  const tool = getTool("motor-insurance-ncb")!;

  const [odPremium, setOdPremium] = useState(12_000);
  const [ncbPercent, setNcbPercent] = useState(20);
  const [tpPremium, setTpPremium] = useState(3_000);

  const exampleSteps = useMemo(
    () => [
      t("Tool_motor_insurance_ncb_ExampleStep_1"),
      t("Tool_motor_insurance_ncb_ExampleStep_2"),
      t("Tool_motor_insurance_ncb_ExampleStep_3"),
      t("Tool_motor_insurance_ncb_ExampleStep_4"),
      t("Tool_motor_insurance_ncb_ExampleStep_5"),
    ],
    [t],
  );

  const { summaryCards, scenarios } = useMemo(() => {
    const result = calculateMotorInsuranceNcb({ odPremium, ncbPercent, tpPremium });
    const zero = calculateMotorInsuranceNcb({ odPremium, ncbPercent: 0, tpPremium });
    const max = calculateMotorInsuranceNcb({ odPremium, ncbPercent: 50, tpPremium });

    return {
      summaryCards: [
        {
          label: t("Tool_motor_insurance_ncb_Result_Discount"),
          value: inr(result.ncbDiscount),
          footnote: t("Tool_motor_insurance_ncb_Result_DiscountFootnote", percent(ncbPercent, 0)),
          variant: "primary" as const,
        },
        {
          label: t("Tool_motor_insurance_ncb_Result_OdAfter"),
          value: inr(result.odAfterNcb),
          footnote: t("Tool_motor_insurance_ncb_Result_OdAfterFootnote"),
        },
        {
          label: t("Tool_motor_insurance_ncb_Result_Total"),
          value: inr(result.totalPremium),
          footnote: t("Tool_motor_insurance_ncb_Result_TotalFootnote"),
          variant: "secure" as const,
        },
      ],
      scenarios: [
        {
          name: t("Tool_motor_insurance_ncb_Scenario_Zero"),
          primaryLabel: t("Tool_motor_insurance_ncb_Result_Total"),
          primaryValue: inr(zero.totalPremium),
          secondaryLabel: t("Tool_motor_insurance_ncb_Result_Discount"),
          secondaryValue: inr(zero.ncbDiscount),
          variant: "worst" as const,
        },
        {
          name: t("Common_Scenario_Base"),
          primaryLabel: t("Tool_motor_insurance_ncb_Result_Total"),
          primaryValue: inr(result.totalPremium),
          secondaryLabel: t("Tool_motor_insurance_ncb_Result_Discount"),
          secondaryValue: inr(result.ncbDiscount),
          variant: "base" as const,
        },
        {
          name: t("Tool_motor_insurance_ncb_Scenario_Max"),
          primaryLabel: t("Tool_motor_insurance_ncb_Result_Total"),
          primaryValue: inr(max.totalPremium),
          secondaryLabel: t("Tool_motor_insurance_ncb_Result_Discount"),
          secondaryValue: inr(max.ncbDiscount),
          variant: "best" as const,
        },
      ],
    };
  }, [odPremium, ncbPercent, tpPremium, t]);

  return (
    <ToolPageShell
      title={t(tool.titleKey)}
      subtitle={t("Tool_motor_insurance_ncb_Subtitle")}
      description={t(tool.descriptionKey)}
      icon={tool.icon}
      educate={
        <>
          <div className="fy-info-box">
            <strong>{t("Common_WhatYouLearn")}</strong>
            <p>{t("Tool_motor_insurance_ncb_LearnText")}</p>
          </div>
          <FormulaCard
            title={t("Common_Formula")}
            code={"NCB discount = OD × NCB%\nOD after = OD − discount\nTotal = OD after + TP"}
            note={t("Tool_motor_insurance_ncb_FormulaNote")}
          />
        </>
      }
      below={<ToolInfoPanel info={motorInsuranceNcbInfo(t)} />}
    >
      <div className="fy-form-card">
        <h3>{t("Common_YourInputs")}</h3>
        <div className="fy-field">
          <label>{t("Tool_motor_insurance_ncb_LabelOd")}</label>
          <input
            type="number"
            min={0}
            step={500}
            inputMode="decimal"
            value={odPremium}
            onChange={(e) => setOdPremium(Math.max(0, Number(e.target.value) || 0))}
          />
        </div>
        <div className="fy-field">
          <label>{t("Tool_motor_insurance_ncb_LabelNcb")}</label>
          <input
            type="number"
            min={0}
            max={50}
            step={5}
            inputMode="decimal"
            value={ncbPercent}
            onChange={(e) => setNcbPercent(Math.max(0, Number(e.target.value) || 0))}
          />
        </div>
        <div className="fy-field">
          <label>{t("Tool_motor_insurance_ncb_LabelTp")}</label>
          <input
            type="number"
            min={0}
            step={100}
            inputMode="decimal"
            value={tpPremium}
            onChange={(e) => setTpPremium(Math.max(0, Number(e.target.value) || 0))}
          />
        </div>
        <button type="button" className="fy-btn-calc">
          {t("Common_Calculate")}
        </button>
      </div>

      <ResultSummaryCards cards={summaryCards} />
      <ScenarioCompare
        title={t("Tool_motor_insurance_ncb_ScenarioTitle")}
        subtitle={t("Tool_motor_insurance_ncb_ScenarioSubtitle")}
        scenarios={scenarios}
      />
      <WorkedExample
        title={t("Tool_motor_insurance_ncb_ExampleTitle")}
        subtitle={t("Tool_motor_insurance_ncb_ExampleSubtitle")}
        steps={exampleSteps}
      />
    </ToolPageShell>
  );
}
