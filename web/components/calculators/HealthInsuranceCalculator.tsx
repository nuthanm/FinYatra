"use client";

import { useMemo, useState } from "react";
import { useT } from "@/components/providers/I18nProvider";
import {
  BreakdownTable,
  FormulaCard,
  ResultSummaryCards,
  ScenarioCompare,
  ToolInfoPanel,
  ToolPageShell,
  WorkedExample,
} from "@/components/calculator/CalculatorUi";
import {
  calculateHealthInsurance,
  type CityTier,
} from "@/lib/finance/healthInsurance";
import { inr } from "@/lib/finance/format";
import { getTool } from "@/lib/config/tools";
import { healthInsuranceInfo } from "@/lib/tool-page-content";

export function HealthInsuranceCalculator() {
  const t = useT();
  const tool = getTool("health-insurance")!;

  const [age, setAge] = useState(35);
  const [familyMembers, setFamilyMembers] = useState(3);
  const [cityTier, setCityTier] = useState<CityTier>(1);
  const [currentCover, setCurrentCover] = useState(500_000);

  const breakdownColumns = useMemo(
    () => [
      { key: "item", header: t("Tool_health_insurance_Col_Item"), alignRight: false as const },
      { key: "amount", header: t("Tool_health_insurance_Col_Amount") },
    ],
    [t],
  );

  const exampleSteps = useMemo(
    () => [
      t("Tool_health_insurance_ExampleStep_1"),
      t("Tool_health_insurance_ExampleStep_2"),
      t("Tool_health_insurance_ExampleStep_3"),
      t("Tool_health_insurance_ExampleStep_4"),
      t("Tool_health_insurance_ExampleStep_5"),
    ],
    [t],
  );

  const { summaryCards, scenarios, breakdownRows, result } = useMemo(() => {
    const input = { age, familyMembers, cityTier, currentCover };
    const r = calculateHealthInsurance(input);
    const tier1 = calculateHealthInsurance({ ...input, cityTier: 1 });
    const tier2 = calculateHealthInsurance({ ...input, cityTier: 2 });
    const tier3 = calculateHealthInsurance({ ...input, cityTier: 3 });

    return {
      result: r,
      summaryCards: [
        {
          label: t("Tool_health_insurance_Result_Suggested"),
          value: inr(r.suggestedCover),
          footnote: t("Tool_health_insurance_Result_SuggestedFootnote"),
          variant: "primary" as const,
        },
        {
          label: t("Tool_health_insurance_Result_Gap"),
          value: inr(r.gap),
          footnote:
            r.gap > 0
              ? t("Tool_health_insurance_Result_GapFootnote", inr(r.currentCover))
              : t("Tool_health_insurance_Result_GapOk"),
          variant: r.gap > 0 ? ("volatile" as const) : ("secure" as const),
        },
        {
          label: t("Tool_health_insurance_Result_Current"),
          value: inr(r.currentCover),
          footnote: t("Tool_health_insurance_Result_CurrentFootnote"),
        },
      ],
      scenarios: [
        {
          name: t("Tool_health_insurance_Scenario_Tier3"),
          primaryLabel: t("Tool_health_insurance_Result_Suggested"),
          primaryValue: inr(tier3.suggestedCover),
          secondaryLabel: t("Tool_health_insurance_Result_Gap"),
          secondaryValue: inr(tier3.gap),
          variant: "worst",
        },
        {
          name: t("Tool_health_insurance_Scenario_Tier2"),
          primaryLabel: t("Tool_health_insurance_Result_Suggested"),
          primaryValue: inr(tier2.suggestedCover),
          secondaryLabel: t("Tool_health_insurance_Result_Gap"),
          secondaryValue: inr(tier2.gap),
          variant: "base",
        },
        {
          name: t("Tool_health_insurance_Scenario_Tier1"),
          primaryLabel: t("Tool_health_insurance_Result_Suggested"),
          primaryValue: inr(tier1.suggestedCover),
          secondaryLabel: t("Tool_health_insurance_Result_Gap"),
          secondaryValue: inr(tier1.gap),
          variant: "best",
        },
      ],
      breakdownRows: [
        {
          cells: {
            item: t("Tool_health_insurance_Row_Base"),
            amount: inr(r.baseCover),
          },
        },
        {
          cells: {
            item: t("Tool_health_insurance_Row_Members", String(familyMembers)),
            amount: inr(r.perMemberAdd),
          },
        },
        {
          cells: {
            item: t("Tool_health_insurance_Row_Age"),
            amount: inr(r.ageAdd),
          },
        },
        {
          cells: {
            item: t("Tool_health_insurance_Row_City"),
            amount: inr(r.cityAdd),
          },
        },
        {
          cells: {
            item: t("Tool_health_insurance_Row_Total"),
            amount: inr(r.suggestedCover),
          },
        },
      ],
    };
  }, [age, familyMembers, cityTier, currentCover, t]);

  return (
    <ToolPageShell
      title={t(tool.titleKey)}
      subtitle={t("Tool_health_insurance_Subtitle")}
      description={t(tool.descriptionKey)}
      icon={tool.icon}
      educate={
        <>
          <div className="fy-info-box">
            <strong>{t("Common_WhatYouLearn")}</strong>
            <p>{t("Tool_health_insurance_LearnText")}</p>
          </div>
          <FormulaCard
            title={t("Common_Formula")}
            code={"suggested = ₹5L base\n  + ₹2L × members\n  + age add-on\n  + city-tier bump\ngap = max(0, suggested − current)"}
            note={t("Tool_health_insurance_FormulaNote")}
          />
        </>
      }
      below={<ToolInfoPanel info={healthInsuranceInfo(t)} />}
    >
      <div className="fy-form-card">
        <h3>{t("Common_YourInputs")}</h3>
        <div className="fy-field">
          <label>{t("Tool_health_insurance_LabelAge")}</label>
          <input
            type="number"
            min={0}
            max={100}
            step={1}
            inputMode="numeric"
            value={age}
            onChange={(e) => setAge(Math.max(0, Math.min(100, Number(e.target.value) || 0)))}
          />
        </div>
        <div className="fy-field">
          <label>{t("Tool_health_insurance_LabelMembers")}</label>
          <input
            type="number"
            min={1}
            max={20}
            step={1}
            inputMode="numeric"
            value={familyMembers}
            onChange={(e) => setFamilyMembers(Math.max(1, Math.min(20, Number(e.target.value) || 1)))}
          />
          <p className="fy-field-hint">{t("Tool_health_insurance_MembersHint")}</p>
        </div>
        <div className="fy-field">
          <label>{t("Tool_health_insurance_LabelTier")}</label>
          <select
            value={cityTier}
            onChange={(e) => setCityTier(Number(e.target.value) as CityTier)}
          >
            <option value={1}>{t("Tool_health_insurance_Tier1")}</option>
            <option value={2}>{t("Tool_health_insurance_Tier2")}</option>
            <option value={3}>{t("Tool_health_insurance_Tier3")}</option>
          </select>
          <p className="fy-field-hint">{t("Tool_health_insurance_TierHint")}</p>
        </div>
        <div className="fy-field">
          <label>{t("Tool_health_insurance_LabelCurrent")}</label>
          <input
            type="number"
            min={0}
            step={100000}
            inputMode="decimal"
            value={currentCover}
            onChange={(e) => setCurrentCover(Math.max(0, Number(e.target.value) || 0))}
          />
          <p className="fy-field-hint">{t("Tool_health_insurance_CurrentHint")}</p>
        </div>
        <button type="button" className="fy-btn-calc">
          {t("Common_Calculate")}
        </button>
      </div>

      <div className="fy-info-box fy-tax-verdict">
        <strong>{t("Tool_health_insurance_VerdictTitle")}</strong>
        <p>
          {result.gap > 0
            ? t("Tool_health_insurance_VerdictGap", inr(result.suggestedCover), inr(result.gap))
            : t("Tool_health_insurance_VerdictOk", inr(result.suggestedCover))}
        </p>
      </div>

      <ResultSummaryCards cards={summaryCards} />
      <ScenarioCompare
        title={t("Tool_health_insurance_ScenarioTitle")}
        subtitle={t("Tool_health_insurance_ScenarioSubtitle")}
        scenarios={scenarios}
      />
      <BreakdownTable
        title={t("Tool_health_insurance_BreakdownTitle")}
        subtitle={t("Tool_health_insurance_BreakdownSubtitle")}
        columns={breakdownColumns}
        rows={breakdownRows}
      />
      <WorkedExample
        title={t("Tool_health_insurance_ExampleTitle")}
        subtitle={t("Tool_health_insurance_ExampleSubtitle")}
        steps={exampleSteps}
      />
    </ToolPageShell>
  );
}
