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
import { calculateBonus, type BonusMode } from "@/lib/finance/bonus";
import { inr, percent } from "@/lib/finance/format";
import { getTool } from "@/lib/config/tools";
import { bonusInfo } from "@/lib/tool-page-content";

export function BonusCalculator() {
  const t = useT();
  const tool = getTool("bonus")!;

  const [basic, setBasic] = useState(40_000);
  const [mode, setMode] = useState<BonusMode>("percent");
  const [bonusPercent, setBonusPercent] = useState(8.33);
  const [bonusAmount, setBonusAmount] = useState(50_000);
  const [taxSlab, setTaxSlab] = useState(30);

  const exampleSteps = useMemo(
    () => [
      t("Tool_bonus_ExampleStep_1"),
      t("Tool_bonus_ExampleStep_2"),
      t("Tool_bonus_ExampleStep_3"),
      t("Tool_bonus_ExampleStep_4"),
      t("Tool_bonus_ExampleStep_5"),
    ],
    [t],
  );

  const { summaryCards, scenarios } = useMemo(() => {
    const result = calculateBonus({
      basicPay: basic,
      mode,
      bonusPercent,
      bonusAmount,
      taxSlabPercent: taxSlab,
    });
    const minPct = calculateBonus({
      basicPay: basic,
      mode: "percent",
      bonusPercent: 8.33,
      bonusAmount,
      taxSlabPercent: taxSlab,
    });
    const maxPct = calculateBonus({
      basicPay: basic,
      mode: "percent",
      bonusPercent: 20,
      bonusAmount,
      taxSlabPercent: taxSlab,
    });

    return {
      summaryCards: [
        {
          label: t("Tool_bonus_Result_Bonus"),
          value: inr(result.bonus),
          footnote:
            mode === "percent"
              ? t("Tool_bonus_Result_BonusFootnotePct", percent(bonusPercent, 2))
              : t("Tool_bonus_Result_BonusFootnoteAmt"),
          variant: "primary" as const,
        },
        {
          label: t("Tool_bonus_Result_Tax"),
          value: inr(result.estimatedTaxOnBonus),
          footnote: t("Tool_bonus_Result_TaxFootnote", percent(taxSlab, 0)),
          variant: "volatile" as const,
        },
        {
          label: t("Tool_bonus_Result_Basic"),
          value: inr(result.basicPay),
          footnote: t("Tool_bonus_Result_BasicFootnote"),
        },
      ],
      scenarios: [
        {
          name: t("Tool_bonus_Scenario_Min"),
          primaryLabel: t("Tool_bonus_Result_Bonus"),
          primaryValue: inr(minPct.bonus),
          secondaryLabel: t("Tool_bonus_Result_Tax"),
          secondaryValue: inr(minPct.estimatedTaxOnBonus),
          variant: "best" as const,
        },
        {
          name: t("Common_Scenario_Base"),
          primaryLabel: t("Tool_bonus_Result_Bonus"),
          primaryValue: inr(result.bonus),
          secondaryLabel: t("Tool_bonus_Result_Tax"),
          secondaryValue: inr(result.estimatedTaxOnBonus),
          variant: "base" as const,
        },
        {
          name: t("Tool_bonus_Scenario_Max"),
          primaryLabel: t("Tool_bonus_Result_Bonus"),
          primaryValue: inr(maxPct.bonus),
          secondaryLabel: t("Tool_bonus_Result_Tax"),
          secondaryValue: inr(maxPct.estimatedTaxOnBonus),
          variant: "worst" as const,
        },
      ],
    };
  }, [basic, mode, bonusPercent, bonusAmount, taxSlab, t]);

  return (
    <ToolPageShell
      title={t(tool.titleKey)}
      subtitle={t("Tool_bonus_Subtitle")}
      description={t(tool.descriptionKey)}
      icon={tool.icon}
      educate={
        <>
          <div className="fy-info-box">
            <strong>{t("Common_WhatYouLearn")}</strong>
            <p>{t("Tool_bonus_LearnText")}</p>
          </div>
          <FormulaCard
            title={t("Common_Formula")}
            code={"bonus = amount  OR  basic × %\ntax tip ≈ bonus × slab%"}
            note={t("Tool_bonus_FormulaNote")}
          />
        </>
      }
      below={<ToolInfoPanel info={bonusInfo(t)} />}
    >
      <div className="fy-form-card">
        <h3>{t("Common_YourInputs")}</h3>
        <div className="fy-field">
          <label>{t("Tool_bonus_LabelBasic")}</label>
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
          <label>{t("Tool_bonus_LabelMode")}</label>
          <select value={mode} onChange={(e) => setMode(e.target.value as BonusMode)}>
            <option value="percent">{t("Tool_bonus_Mode_Percent")}</option>
            <option value="amount">{t("Tool_bonus_Mode_Amount")}</option>
          </select>
        </div>
        {mode === "percent" ? (
          <div className="fy-field">
            <label>{t("Tool_bonus_LabelPercent")}</label>
            <input
              type="number"
              min={0}
              max={100}
              step={0.01}
              inputMode="decimal"
              value={bonusPercent}
              onChange={(e) => setBonusPercent(Math.max(0, Number(e.target.value) || 0))}
            />
            <p className="fy-field-hint">{t("Tool_bonus_PercentHint")}</p>
          </div>
        ) : (
          <div className="fy-field">
            <label>{t("Tool_bonus_LabelAmount")}</label>
            <input
              type="number"
              min={0}
              step={1000}
              inputMode="decimal"
              value={bonusAmount}
              onChange={(e) => setBonusAmount(Math.max(0, Number(e.target.value) || 0))}
            />
          </div>
        )}
        <div className="fy-field">
          <label>{t("Tool_bonus_LabelSlab")}</label>
          <input
            type="number"
            min={0}
            max={42}
            step={1}
            inputMode="decimal"
            value={taxSlab}
            onChange={(e) => setTaxSlab(Math.max(0, Number(e.target.value) || 0))}
          />
        </div>
        <button type="button" className="fy-btn-calc">
          {t("Common_Calculate")}
        </button>
      </div>

      <ResultSummaryCards cards={summaryCards} />
      <ScenarioCompare
        title={t("Tool_bonus_ScenarioTitle")}
        subtitle={t("Tool_bonus_ScenarioSubtitle")}
        scenarios={scenarios}
      />
      <WorkedExample
        title={t("Tool_bonus_ExampleTitle")}
        subtitle={t("Tool_bonus_ExampleSubtitle")}
        steps={exampleSteps}
      />
    </ToolPageShell>
  );
}
