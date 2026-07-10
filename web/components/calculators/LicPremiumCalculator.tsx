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
import { calculateLicPremium } from "@/lib/finance/licPremium";
import { inr, percent } from "@/lib/finance/format";
import { getTool } from "@/lib/config/tools";
import { licPremiumInfo } from "@/lib/tool-page-content";

export function LicPremiumCalculator() {
  const t = useT();
  const tool = getTool("lic-premium")!;

  const [sumAssured, setSumAssured] = useState(50_00_000);
  const [age, setAge] = useState(30);
  const [term, setTerm] = useState(20);
  const [ratePerThousand, setRatePerThousand] = useState(8);

  const exampleSteps = useMemo(
    () => [
      t("Tool_lic_premium_ExampleStep_1"),
      t("Tool_lic_premium_ExampleStep_2"),
      t("Tool_lic_premium_ExampleStep_3"),
      t("Tool_lic_premium_ExampleStep_4"),
      t("Tool_lic_premium_ExampleStep_5"),
    ],
    [t],
  );

  const { summaryCards, scenarios } = useMemo(() => {
    const base = calculateLicPremium({
      sumAssured,
      age,
      termYears: term,
      ratePerThousand,
    });
    const lower = calculateLicPremium({
      sumAssured,
      age,
      termYears: term,
      ratePerThousand: Math.max(0, ratePerThousand - 2),
    });
    const higher = calculateLicPremium({
      sumAssured,
      age,
      termYears: term,
      ratePerThousand: ratePerThousand + 2,
    });

    return {
      summaryCards: [
        {
          label: t("Tool_lic_premium_Result_Annual"),
          value: inr(base.annualPremium),
          footnote: t("Tool_lic_premium_Result_AnnualFootnote", base.ratePerThousand.toFixed(1)),
          variant: "primary" as const,
        },
        {
          label: t("Tool_lic_premium_Result_Total"),
          value: inr(base.totalPremiums),
          footnote: t("Tool_lic_premium_Result_TotalFootnote", term),
        },
        {
          label: t("Tool_lic_premium_Result_Ratio"),
          value: percent(base.premiumToCoverPct, 1),
          footnote: t("Tool_lic_premium_Result_RatioFootnote"),
        },
      ],
      scenarios: [
        {
          name: t("Tool_lic_premium_Scenario_Lower"),
          primaryLabel: t("Tool_lic_premium_Result_Annual"),
          primaryValue: inr(lower.annualPremium),
          secondaryLabel: t("Tool_lic_premium_LabelRate"),
          secondaryValue: String(Math.max(0, ratePerThousand - 2)),
          variant: "best" as const,
        },
        {
          name: t("Common_Scenario_Base"),
          primaryLabel: t("Tool_lic_premium_Result_Annual"),
          primaryValue: inr(base.annualPremium),
          secondaryLabel: t("Tool_lic_premium_LabelRate"),
          secondaryValue: String(ratePerThousand),
          variant: "base" as const,
        },
        {
          name: t("Tool_lic_premium_Scenario_Higher"),
          primaryLabel: t("Tool_lic_premium_Result_Annual"),
          primaryValue: inr(higher.annualPremium),
          secondaryLabel: t("Tool_lic_premium_LabelRate"),
          secondaryValue: String(ratePerThousand + 2),
          variant: "worst" as const,
        },
      ],
    };
  }, [sumAssured, age, term, ratePerThousand, t]);

  return (
    <ToolPageShell
      title={t(tool.titleKey)}
      subtitle={t("Tool_lic_premium_Subtitle")}
      description={t(tool.descriptionKey)}
      icon={tool.icon}
      educate={
        <>
          <div className="fy-info-box">
            <strong>{t("Common_WhatYouLearn")}</strong>
            <p>{t("Tool_lic_premium_LearnText")}</p>
          </div>
          <FormulaCard
            title={t("Common_Formula")}
            code={"annual ≈ (sumAssured / 1000) × ratePerThousand\n(+ illustrative age loading)"}
            note={t("Tool_lic_premium_FormulaNote")}
          />
        </>
      }
      below={<ToolInfoPanel info={licPremiumInfo(t)} />}
    >
      <div className="fy-form-card">
        <h3>{t("Common_YourInputs")}</h3>
        <div className="fy-field">
          <label>{t("Tool_lic_premium_LabelSum")}</label>
          <input
            type="number"
            min={0}
            step={100000}
            inputMode="decimal"
            value={sumAssured}
            onChange={(e) => setSumAssured(Math.max(0, Number(e.target.value) || 0))}
          />
        </div>
        <div className="fy-field">
          <label>{t("Tool_lic_premium_LabelAge")}</label>
          <input
            type="number"
            min={18}
            max={70}
            step={1}
            inputMode="numeric"
            value={age}
            onChange={(e) => setAge(Math.max(18, Number(e.target.value) || 18))}
          />
        </div>
        <div className="fy-field">
          <label>{t("Tool_lic_premium_LabelTerm")}</label>
          <input
            type="number"
            min={1}
            max={40}
            step={1}
            inputMode="numeric"
            value={term}
            onChange={(e) => setTerm(Math.max(1, Number(e.target.value) || 1))}
          />
        </div>
        <div className="fy-field">
          <label>{t("Tool_lic_premium_LabelRate")}</label>
          <input
            type="number"
            min={0}
            step={0.5}
            inputMode="decimal"
            value={ratePerThousand}
            onChange={(e) => setRatePerThousand(Math.max(0, Number(e.target.value) || 0))}
          />
          <p className="fy-field-hint">{t("Tool_lic_premium_RateHint")}</p>
        </div>
        <button type="button" className="fy-btn-calc">
          {t("Common_Calculate")}
        </button>
      </div>

      <ResultSummaryCards cards={summaryCards} />
      <ScenarioCompare
        title={t("Tool_lic_premium_ScenarioTitle")}
        subtitle={t("Tool_lic_premium_ScenarioSubtitle")}
        scenarios={scenarios}
      />
      <WorkedExample
        title={t("Tool_lic_premium_ExampleTitle")}
        subtitle={t("Tool_lic_premium_ExampleSubtitle")}
        steps={exampleSteps}
      />
    </ToolPageShell>
  );
}
