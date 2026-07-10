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
import { calculateUlipSurrender } from "@/lib/finance/ulipSurrender";
import { inr } from "@/lib/finance/format";
import { getTool } from "@/lib/config/tools";
import { ulipSurrenderInfo } from "@/lib/tool-page-content";

export function UlipSurrenderCalculator() {
  const t = useT();
  const tool = getTool("ulip-surrender")!;

  const [totalPremiumsPaid, setTotalPremiumsPaid] = useState(5_00_000);
  const [surrenderValue, setSurrenderValue] = useState(6_50_000);
  const [yearsHeld, setYearsHeld] = useState(4);

  const exampleSteps = useMemo(
    () => [
      t("Tool_ulip_surrender_ExampleStep_1"),
      t("Tool_ulip_surrender_ExampleStep_2"),
      t("Tool_ulip_surrender_ExampleStep_3"),
      t("Tool_ulip_surrender_ExampleStep_4"),
      t("Tool_ulip_surrender_ExampleStep_5"),
    ],
    [t],
  );

  const { summaryCards, scenarios } = useMemo(() => {
    const result = calculateUlipSurrender({ totalPremiumsPaid, surrenderValue, yearsHeld });
    const early = calculateUlipSurrender({ totalPremiumsPaid, surrenderValue, yearsHeld: 2 });
    const long = calculateUlipSurrender({ totalPremiumsPaid, surrenderValue, yearsHeld: 8 });

    return {
      summaryCards: [
        {
          label: t("Tool_ulip_surrender_Result_Gain"),
          value: inr(result.gain),
          footnote: t("Tool_ulip_surrender_Result_GainFootnote"),
          variant: "primary" as const,
        },
        {
          label: t("Tool_ulip_surrender_Result_Tax"),
          value: inr(result.illustrativeTaxAt20),
          footnote: result.mayBeTaxable
            ? t("Tool_ulip_surrender_Result_TaxableYes")
            : t("Tool_ulip_surrender_Result_TaxableNo"),
          variant: result.mayBeTaxable ? ("volatile" as const) : ("secure" as const),
        },
        {
          label: t("Tool_ulip_surrender_Result_Loss"),
          value: inr(result.loss),
          footnote: t("Tool_ulip_surrender_Result_LossFootnote"),
        },
      ],
      scenarios: [
        {
          name: t("Tool_ulip_surrender_Scenario_Early"),
          primaryLabel: t("Tool_ulip_surrender_Result_Gain"),
          primaryValue: inr(early.gain),
          secondaryLabel: t("Tool_ulip_surrender_Result_Tax"),
          secondaryValue: inr(early.illustrativeTaxAt20),
          variant: "worst" as const,
        },
        {
          name: t("Common_Scenario_Base"),
          primaryLabel: t("Tool_ulip_surrender_Result_Gain"),
          primaryValue: inr(result.gain),
          secondaryLabel: t("Tool_ulip_surrender_Result_Tax"),
          secondaryValue: inr(result.illustrativeTaxAt20),
          variant: "base" as const,
        },
        {
          name: t("Tool_ulip_surrender_Scenario_Long"),
          primaryLabel: t("Tool_ulip_surrender_Result_Gain"),
          primaryValue: inr(long.gain),
          secondaryLabel: t("Tool_ulip_surrender_Result_Tax"),
          secondaryValue: inr(long.illustrativeTaxAt20),
          variant: "best" as const,
        },
      ],
    };
  }, [totalPremiumsPaid, surrenderValue, yearsHeld, t]);

  return (
    <ToolPageShell
      title={t(tool.titleKey)}
      subtitle={t("Tool_ulip_surrender_Subtitle")}
      description={t(tool.descriptionKey)}
      icon={tool.icon}
      educate={
        <>
          <div className="fy-info-box">
            <strong>{t("Common_WhatYouLearn")}</strong>
            <p>{t("Tool_ulip_surrender_LearnText")}</p>
          </div>
          <FormulaCard
            title={t("Common_Formula")}
            code={"Gain = surrender − premiums\nTax note if <5 yrs or high premium\nIllustrative tax ≈ 20% of gain"}
            note={t("Tool_ulip_surrender_FormulaNote")}
          />
        </>
      }
      below={<ToolInfoPanel info={ulipSurrenderInfo(t)} />}
    >
      <div className="fy-form-card">
        <h3>{t("Common_YourInputs")}</h3>
        <div className="fy-field">
          <label>{t("Tool_ulip_surrender_LabelPremiums")}</label>
          <input
            type="number"
            min={0}
            step={10000}
            inputMode="decimal"
            value={totalPremiumsPaid}
            onChange={(e) => setTotalPremiumsPaid(Math.max(0, Number(e.target.value) || 0))}
          />
        </div>
        <div className="fy-field">
          <label>{t("Tool_ulip_surrender_LabelSurrender")}</label>
          <input
            type="number"
            min={0}
            step={10000}
            inputMode="decimal"
            value={surrenderValue}
            onChange={(e) => setSurrenderValue(Math.max(0, Number(e.target.value) || 0))}
          />
        </div>
        <div className="fy-field">
          <label>{t("Tool_ulip_surrender_LabelYears")}</label>
          <input
            type="number"
            min={0}
            max={40}
            step={1}
            inputMode="decimal"
            value={yearsHeld}
            onChange={(e) => setYearsHeld(Math.max(0, Number(e.target.value) || 0))}
          />
        </div>
        <button type="button" className="fy-btn-calc">
          {t("Common_Calculate")}
        </button>
      </div>

      <ResultSummaryCards cards={summaryCards} />
      <ScenarioCompare
        title={t("Tool_ulip_surrender_ScenarioTitle")}
        subtitle={t("Tool_ulip_surrender_ScenarioSubtitle")}
        scenarios={scenarios}
      />
      <WorkedExample
        title={t("Tool_ulip_surrender_ExampleTitle")}
        subtitle={t("Tool_ulip_surrender_ExampleSubtitle")}
        steps={exampleSteps}
      />
    </ToolPageShell>
  );
}
