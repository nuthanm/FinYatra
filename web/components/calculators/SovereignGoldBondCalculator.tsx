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
  calculateSovereignGoldBond,
  SGB_ANNUAL_INTEREST_PERCENT,
  SGB_DEFAULT_YEARS,
} from "@/lib/finance/sovereignGoldBond";
import { inr, percent } from "@/lib/finance/format";
import { getTool } from "@/lib/config/tools";
import { sovereignGoldBondInfo } from "@/lib/tool-page-content";

export function SovereignGoldBondCalculator() {
  const t = useT();
  const tool = getTool("sovereign-gold-bond")!;

  const [grams, setGrams] = useState(10);
  const [issuePrice, setIssuePrice] = useState(7500);
  const [years, setYears] = useState(SGB_DEFAULT_YEARS);
  const [redemptionPrice, setRedemptionPrice] = useState(9000);

  const exampleSteps = useMemo(
    () => [
      t("Tool_sovereign_gold_bond_ExampleStep_1"),
      t("Tool_sovereign_gold_bond_ExampleStep_2"),
      t("Tool_sovereign_gold_bond_ExampleStep_3"),
      t("Tool_sovereign_gold_bond_ExampleStep_4"),
      t("Tool_sovereign_gold_bond_ExampleStep_5"),
    ],
    [t],
  );

  const { summaryCards, scenarios, result } = useMemo(() => {
    const result = calculateSovereignGoldBond({
      grams,
      issuePricePerGram: issuePrice,
      years,
      redemptionPricePerGram: redemptionPrice,
    });
    const flat = calculateSovereignGoldBond({
      grams,
      issuePricePerGram: issuePrice,
      years,
      redemptionPricePerGram: issuePrice,
    });
    const high = calculateSovereignGoldBond({
      grams,
      issuePricePerGram: issuePrice,
      years,
      redemptionPricePerGram: redemptionPrice * 1.2,
    });

    return {
      result,
      summaryCards: [
        {
          label: t("Tool_sovereign_gold_bond_Result_Total"),
          value: inr(result.totalReturn),
          footnote: t("Tool_sovereign_gold_bond_Result_TotalFootnote", String(years)),
          variant: "primary" as const,
        },
        {
          label: t("Tool_sovereign_gold_bond_Result_Interest"),
          value: inr(result.totalInterest),
          footnote: t(
            "Tool_sovereign_gold_bond_Result_InterestFootnote",
            percent(SGB_ANNUAL_INTEREST_PERCENT),
          ),
          variant: "secure" as const,
        },
        {
          label: t("Tool_sovereign_gold_bond_Result_Gain"),
          value: inr(result.capitalGain),
          footnote: t("Tool_sovereign_gold_bond_Result_GainFootnote"),
        },
      ],
      scenarios: [
        {
          name: t("Tool_sovereign_gold_bond_Scenario_Flat"),
          primaryLabel: t("Tool_sovereign_gold_bond_Result_Total"),
          primaryValue: inr(flat.totalReturn),
          secondaryLabel: t("Tool_sovereign_gold_bond_Result_Gain"),
          secondaryValue: inr(flat.capitalGain),
          variant: "worst",
        },
        {
          name: t("Common_Scenario_Base"),
          primaryLabel: t("Tool_sovereign_gold_bond_Result_Total"),
          primaryValue: inr(result.totalReturn),
          secondaryLabel: t("Tool_sovereign_gold_bond_Result_Interest"),
          secondaryValue: inr(result.totalInterest),
          variant: "base",
        },
        {
          name: t("Tool_sovereign_gold_bond_Scenario_High"),
          primaryLabel: t("Tool_sovereign_gold_bond_Result_Total"),
          primaryValue: inr(high.totalReturn),
          secondaryLabel: t("Tool_sovereign_gold_bond_Result_Gain"),
          secondaryValue: inr(high.capitalGain),
          variant: "best",
        },
      ],
    };
  }, [grams, issuePrice, years, redemptionPrice, t]);

  return (
    <ToolPageShell
      title={t(tool.titleKey)}
      subtitle={t("Tool_sovereign_gold_bond_Subtitle")}
      description={t(tool.descriptionKey)}
      icon={tool.icon}
      educate={
        <>
          <div className="fy-info-box">
            <strong>{t("Common_WhatYouLearn")}</strong>
            <p>{t("Tool_sovereign_gold_bond_LearnText")}</p>
          </div>
          <FormulaCard
            title={t("Common_Formula")}
            code={"Invested = grams × issue price\nInterest = Invested × 2.5% × years\nGain = grams × (redeem − issue)"}
            note={t("Tool_sovereign_gold_bond_FormulaNote")}
          />
        </>
      }
      below={<ToolInfoPanel info={sovereignGoldBondInfo(t)} />}
    >
      <div className="fy-form-card">
        <h3>{t("Common_YourInputs")}</h3>
        <div className="fy-field">
          <label>{t("Tool_sovereign_gold_bond_LabelGrams")}</label>
          <input
            type="number"
            min={1}
            step={1}
            inputMode="decimal"
            value={grams}
            onChange={(e) => setGrams(Math.max(1, Number(e.target.value) || 1))}
          />
          <p className="fy-field-hint">{t("Tool_sovereign_gold_bond_GramsHint")}</p>
        </div>
        <div className="fy-field">
          <label>{t("Tool_sovereign_gold_bond_LabelIssue")}</label>
          <input
            type="number"
            min={0}
            step={50}
            inputMode="decimal"
            value={issuePrice}
            onChange={(e) => setIssuePrice(Math.max(0, Number(e.target.value) || 0))}
          />
        </div>
        <div className="fy-field">
          <label>{t("Tool_sovereign_gold_bond_LabelYears")}</label>
          <input
            type="number"
            min={1}
            max={8}
            step={1}
            inputMode="numeric"
            value={years}
            onChange={(e) => setYears(Math.max(1, Math.min(8, Number(e.target.value) || 8)))}
          />
          <p className="fy-field-hint">{t("Tool_sovereign_gold_bond_YearsHint")}</p>
        </div>
        <div className="fy-field">
          <label>{t("Tool_sovereign_gold_bond_LabelRedeem")}</label>
          <input
            type="number"
            min={0}
            step={50}
            inputMode="decimal"
            value={redemptionPrice}
            onChange={(e) => setRedemptionPrice(Math.max(0, Number(e.target.value) || 0))}
          />
          <p className="fy-field-hint">{t("Tool_sovereign_gold_bond_RedeemHint")}</p>
        </div>
        <button type="button" className="fy-btn-calc">
          {t("Common_Calculate")}
        </button>
      </div>

      <div className="fy-info-box fy-tax-verdict">
        <strong>{t("Tool_sovereign_gold_bond_VerdictTitle")}</strong>
        <p>
          {t(
            "Tool_sovereign_gold_bond_VerdictNote",
            inr(result.invested),
            inr(result.totalInterest),
            inr(result.capitalGain),
          )}
        </p>
      </div>

      <ResultSummaryCards cards={summaryCards} />
      <ScenarioCompare
        title={t("Tool_sovereign_gold_bond_ScenarioTitle")}
        subtitle={t("Tool_sovereign_gold_bond_ScenarioSubtitle")}
        scenarios={scenarios}
      />
      <WorkedExample
        title={t("Tool_sovereign_gold_bond_ExampleTitle")}
        subtitle={t("Tool_sovereign_gold_bond_ExampleSubtitle")}
        steps={exampleSteps}
      />
    </ToolPageShell>
  );
}
