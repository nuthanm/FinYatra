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
  calculateHomeInsurance,
  DEFAULT_HOME_INSURANCE_RATE,
} from "@/lib/finance/homeInsurance";
import { inr } from "@/lib/finance/format";
import { getTool } from "@/lib/config/tools";
import { homeInsuranceInfo } from "@/lib/tool-page-content";

export function HomeInsuranceCalculator() {
  const t = useT();
  const tool = getTool("home-insurance")!;

  const [propertyValue, setPropertyValue] = useState(5_000_000);
  const [ratePercent, setRatePercent] = useState(DEFAULT_HOME_INSURANCE_RATE);

  const exampleSteps = useMemo(
    () => [
      t("Tool_home_insurance_ExampleStep_1"),
      t("Tool_home_insurance_ExampleStep_2"),
      t("Tool_home_insurance_ExampleStep_3"),
      t("Tool_home_insurance_ExampleStep_4"),
      t("Tool_home_insurance_ExampleStep_5"),
    ],
    [t],
  );

  const { summaryCards, scenarios, result } = useMemo(() => {
    const result = calculateHomeInsurance({ propertyValue, ratePercent });
    const low = calculateHomeInsurance({ propertyValue, ratePercent: 0.05 });
    const high = calculateHomeInsurance({ propertyValue, ratePercent: 0.2 });

    return {
      result,
      summaryCards: [
        {
          label: t("Tool_home_insurance_Result_Premium"),
          value: inr(result.estimatedPremium),
          footnote: t(
            "Tool_home_insurance_Result_PremiumFootnote",
            String(result.ratePercent),
          ),
          variant: "primary" as const,
        },
        {
          label: t("Tool_home_insurance_Result_Property"),
          value: inr(result.propertyValue),
          footnote: t("Tool_home_insurance_Result_PropertyFootnote"),
          variant: "secure" as const,
        },
        {
          label: t("Tool_home_insurance_Result_Rate"),
          value: `${result.ratePercent}%`,
          footnote: t("Tool_home_insurance_Result_RateFootnote"),
        },
      ],
      scenarios: [
        {
          name: t("Tool_home_insurance_Scenario_Low"),
          primaryLabel: t("Tool_home_insurance_Result_Premium"),
          primaryValue: inr(low.estimatedPremium),
          secondaryLabel: t("Tool_home_insurance_Result_Rate"),
          secondaryValue: "0.05%",
          variant: "best",
        },
        {
          name: t("Common_Scenario_Base"),
          primaryLabel: t("Tool_home_insurance_Result_Premium"),
          primaryValue: inr(result.estimatedPremium),
          secondaryLabel: t("Tool_home_insurance_Result_Rate"),
          secondaryValue: `${result.ratePercent}%`,
          variant: "base",
        },
        {
          name: t("Tool_home_insurance_Scenario_High"),
          primaryLabel: t("Tool_home_insurance_Result_Premium"),
          primaryValue: inr(high.estimatedPremium),
          secondaryLabel: t("Tool_home_insurance_Result_Rate"),
          secondaryValue: "0.2%",
          variant: "worst",
        },
      ],
    };
  }, [propertyValue, ratePercent, t]);

  return (
    <ToolPageShell
      title={t(tool.titleKey)}
      subtitle={t("Tool_home_insurance_Subtitle")}
      description={t(tool.descriptionKey)}
      icon={tool.icon}
      educate={
        <>
          <div className="fy-info-box">
            <strong>{t("Common_WhatYouLearn")}</strong>
            <p>{t("Tool_home_insurance_LearnText")}</p>
          </div>
          <FormulaCard
            title={t("Common_Formula")}
            code={"Premium ≈ property value × rate%\nDefault rate ≈ 0.1% (illustrative)"}
            note={t("Tool_home_insurance_FormulaNote")}
          />
        </>
      }
      below={<ToolInfoPanel info={homeInsuranceInfo(t)} />}
    >
      <div className="fy-form-card">
        <h3>{t("Common_YourInputs")}</h3>
        <div className="fy-field">
          <label>{t("Tool_home_insurance_LabelProperty")}</label>
          <input
            type="number"
            min={0}
            step={100000}
            inputMode="decimal"
            value={propertyValue}
            onChange={(e) => setPropertyValue(Math.max(0, Number(e.target.value) || 0))}
          />
          <p className="fy-field-hint">{t("Tool_home_insurance_PropertyHint")}</p>
        </div>
        <div className="fy-field">
          <label>{t("Tool_home_insurance_LabelRate")}</label>
          <input
            type="number"
            min={0}
            step={0.01}
            inputMode="decimal"
            value={ratePercent}
            onChange={(e) => setRatePercent(Math.max(0, Number(e.target.value) || 0))}
          />
          <p className="fy-field-hint">{t("Tool_home_insurance_RateHint")}</p>
        </div>
        <button type="button" className="fy-btn-calc">
          {t("Common_Calculate")}
        </button>
      </div>

      <div className="fy-info-box">
        <strong>{t("Tool_home_insurance_VerdictTitle")}</strong>
        <p>
          {t(
            "Tool_home_insurance_VerdictNote",
            inr(result.estimatedPremium),
            inr(result.propertyValue),
          )}
        </p>
      </div>

      <ResultSummaryCards cards={summaryCards} />
      <ScenarioCompare
        title={t("Tool_home_insurance_ScenarioTitle")}
        subtitle={t("Tool_home_insurance_ScenarioSubtitle")}
        scenarios={scenarios}
      />
      <WorkedExample
        title={t("Tool_home_insurance_ExampleTitle")}
        subtitle={t("Tool_home_insurance_ExampleSubtitle")}
        steps={exampleSteps}
      />
    </ToolPageShell>
  );
}
