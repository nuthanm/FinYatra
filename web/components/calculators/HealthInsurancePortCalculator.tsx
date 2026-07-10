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
import { calculateHealthInsurancePort } from "@/lib/finance/healthInsurancePort";
import { inr } from "@/lib/finance/format";
import { getTool } from "@/lib/config/tools";
import { healthInsurancePortInfo } from "@/lib/tool-page-content";

export function HealthInsurancePortCalculator() {
  const t = useT();
  const tool = getTool("health-insurance-port")!;

  const [originalWait, setOriginalWait] = useState(36);
  const [completed, setCompleted] = useState(24);
  const [currentSi, setCurrentSi] = useState(5_00_000);
  const [newSi, setNewSi] = useState(10_00_000);

  const exampleSteps = useMemo(
    () => [
      t("Tool_health_insurance_port_ExampleStep_1"),
      t("Tool_health_insurance_port_ExampleStep_2"),
      t("Tool_health_insurance_port_ExampleStep_3"),
      t("Tool_health_insurance_port_ExampleStep_4"),
      t("Tool_health_insurance_port_ExampleStep_5"),
    ],
    [t],
  );

  const { summaryCards, scenarios, result } = useMemo(() => {
    const result = calculateHealthInsurancePort({
      originalWaitingMonths: originalWait,
      monthsCompleted: completed,
      currentSumInsured: currentSi,
      newSumInsured: newSi,
    });
    const early = calculateHealthInsurancePort({
      originalWaitingMonths: originalWait,
      monthsCompleted: Math.max(0, completed - 12),
      currentSumInsured: currentSi,
      newSumInsured: newSi,
    });
    const sameSi = calculateHealthInsurancePort({
      originalWaitingMonths: originalWait,
      monthsCompleted: completed,
      currentSumInsured: currentSi,
      newSumInsured: currentSi,
    });

    return {
      result,
      summaryCards: [
        {
          label: t("Tool_health_insurance_port_Result_Left"),
          value: String(result.waitingLeftMonths),
          footnote: t("Tool_health_insurance_port_Result_LeftFootnote"),
          variant: "primary" as const,
        },
        {
          label: t("Tool_health_insurance_port_Result_Status"),
          value: result.waitingFullyServed
            ? t("Tool_health_insurance_port_Status_Done")
            : t("Tool_health_insurance_port_Status_Left"),
          footnote: t("Tool_health_insurance_port_Result_StatusFootnote"),
          variant: result.waitingFullyServed
            ? ("secure" as const)
            : ("volatile" as const),
        },
        {
          label: t("Tool_health_insurance_port_Result_Gap"),
          value: inr(result.coverIncrease),
          footnote: t("Tool_health_insurance_port_Result_GapFootnote"),
        },
      ],
      scenarios: [
        {
          name: t("Tool_health_insurance_port_Scenario_Early"),
          primaryLabel: t("Tool_health_insurance_port_Result_Left"),
          primaryValue: String(early.waitingLeftMonths),
          secondaryLabel: t("Tool_health_insurance_port_Result_Gap"),
          secondaryValue: inr(early.coverIncrease),
          variant: "worst" as const,
        },
        {
          name: t("Common_Scenario_Base"),
          primaryLabel: t("Tool_health_insurance_port_Result_Left"),
          primaryValue: String(result.waitingLeftMonths),
          secondaryLabel: t("Tool_health_insurance_port_Result_Gap"),
          secondaryValue: inr(result.coverIncrease),
          variant: "base" as const,
        },
        {
          name: t("Tool_health_insurance_port_Scenario_SameSi"),
          primaryLabel: t("Tool_health_insurance_port_Result_Left"),
          primaryValue: String(sameSi.waitingLeftMonths),
          secondaryLabel: t("Tool_health_insurance_port_Result_Gap"),
          secondaryValue: inr(sameSi.coverIncrease),
          variant: "best" as const,
        },
      ],
    };
  }, [originalWait, completed, currentSi, newSi, t]);

  return (
    <ToolPageShell
      title={t(tool.titleKey)}
      subtitle={t("Tool_health_insurance_port_Subtitle")}
      description={t(tool.descriptionKey)}
      icon={tool.icon}
      educate={
        <>
          <div className="fy-info-box">
            <strong>{t("Common_WhatYouLearn")}</strong>
            <p>{t("Tool_health_insurance_port_LearnText")}</p>
          </div>
          <FormulaCard
            title={t("Common_Formula")}
            code={"Waiting left = original − completed\nGap cover = new SI − current SI"}
            note={t("Tool_health_insurance_port_FormulaNote")}
          />
        </>
      }
      below={<ToolInfoPanel info={healthInsurancePortInfo(t)} />}
    >
      <div className="fy-form-card">
        <h3>{t("Common_YourInputs")}</h3>
        <div className="fy-field">
          <label>{t("Tool_health_insurance_port_LabelOriginal")}</label>
          <input
            type="number"
            min={0}
            max={48}
            step={1}
            inputMode="numeric"
            value={originalWait}
            onChange={(e) => setOriginalWait(Math.max(0, Number(e.target.value) || 0))}
          />
        </div>
        <div className="fy-field">
          <label>{t("Tool_health_insurance_port_LabelCompleted")}</label>
          <input
            type="number"
            min={0}
            max={48}
            step={1}
            inputMode="numeric"
            value={completed}
            onChange={(e) => setCompleted(Math.max(0, Number(e.target.value) || 0))}
          />
        </div>
        <div className="fy-field">
          <label>{t("Tool_health_insurance_port_LabelCurrentSi")}</label>
          <input
            type="number"
            min={0}
            step={50000}
            inputMode="decimal"
            value={currentSi}
            onChange={(e) => setCurrentSi(Math.max(0, Number(e.target.value) || 0))}
          />
        </div>
        <div className="fy-field">
          <label>{t("Tool_health_insurance_port_LabelNewSi")}</label>
          <input
            type="number"
            min={0}
            step={50000}
            inputMode="decimal"
            value={newSi}
            onChange={(e) => setNewSi(Math.max(0, Number(e.target.value) || 0))}
          />
        </div>
        <button type="button" className="fy-btn-calc">
          {t("Common_Calculate")}
        </button>
      </div>

      {result.hasGapCoverNote && (
        <div className="fy-info-box">
          <strong>{t("Tool_health_insurance_port_GapTitle")}</strong>
          <p>{t("Tool_health_insurance_port_GapNote", inr(result.coverIncrease))}</p>
        </div>
      )}

      <ResultSummaryCards cards={summaryCards} />
      <ScenarioCompare
        title={t("Tool_health_insurance_port_ScenarioTitle")}
        subtitle={t("Tool_health_insurance_port_ScenarioSubtitle")}
        scenarios={scenarios}
      />
      <WorkedExample
        title={t("Tool_health_insurance_port_ExampleTitle")}
        subtitle={t("Tool_health_insurance_port_ExampleSubtitle")}
        steps={exampleSteps}
      />
    </ToolPageShell>
  );
}
