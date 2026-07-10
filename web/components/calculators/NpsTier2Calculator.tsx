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
import { calculateNpsTier2 } from "@/lib/finance/npsTier2";
import { inr, percent } from "@/lib/finance/format";
import { getTool } from "@/lib/config/tools";
import { npsTier2Info } from "@/lib/tool-page-content";

export function NpsTier2Calculator() {
  const t = useT();
  const tool = getTool("nps-tier-2")!;

  const [monthly, setMonthly] = useState(5_000);
  const [returnPct, setReturnPct] = useState(10);
  const [years, setYears] = useState(10);
  const [existing, setExisting] = useState(0);

  const exampleSteps = useMemo(
    () => [
      t("Tool_nps_tier_2_ExampleStep_1"),
      t("Tool_nps_tier_2_ExampleStep_2"),
      t("Tool_nps_tier_2_ExampleStep_3"),
      t("Tool_nps_tier_2_ExampleStep_4"),
      t("Tool_nps_tier_2_ExampleStep_5"),
    ],
    [t],
  );

  const { summaryCards, scenarios } = useMemo(() => {
    const result = calculateNpsTier2({
      monthlyContribution: monthly,
      expectedReturnPercent: returnPct,
      years,
      existingBalance: existing,
    });
    const shorter = calculateNpsTier2({
      monthlyContribution: monthly,
      expectedReturnPercent: returnPct,
      years: Math.max(1, years - 3),
      existingBalance: existing,
    });
    const longer = calculateNpsTier2({
      monthlyContribution: monthly,
      expectedReturnPercent: returnPct,
      years: years + 5,
      existingBalance: existing,
    });

    return {
      summaryCards: [
        {
          label: t("Tool_nps_tier_2_Result_Corpus"),
          value: inr(result.corpus),
          footnote: t("Tool_nps_tier_2_Result_CorpusFootnote", String(years)),
          variant: "primary" as const,
        },
        {
          label: t("Tool_nps_tier_2_Result_Invested"),
          value: inr(result.totalContributed),
          footnote: t("Tool_nps_tier_2_Result_InvestedFootnote", inr(monthly)),
        },
        {
          label: t("Tool_nps_tier_2_Result_Gains"),
          value: inr(result.gains),
          footnote: t("Tool_nps_tier_2_Result_GainsFootnote", percent(returnPct, 1)),
          variant: "secure" as const,
        },
      ],
      scenarios: [
        {
          name: t("Tool_nps_tier_2_Scenario_Shorter"),
          primaryLabel: t("Tool_nps_tier_2_Result_Corpus"),
          primaryValue: inr(shorter.corpus),
          secondaryLabel: t("Tool_nps_tier_2_Result_Gains"),
          secondaryValue: inr(shorter.gains),
          variant: "worst" as const,
        },
        {
          name: t("Common_Scenario_Base"),
          primaryLabel: t("Tool_nps_tier_2_Result_Corpus"),
          primaryValue: inr(result.corpus),
          secondaryLabel: t("Tool_nps_tier_2_Result_Invested"),
          secondaryValue: inr(result.totalContributed),
          variant: "base" as const,
        },
        {
          name: t("Tool_nps_tier_2_Scenario_Longer"),
          primaryLabel: t("Tool_nps_tier_2_Result_Corpus"),
          primaryValue: inr(longer.corpus),
          secondaryLabel: t("Tool_nps_tier_2_Result_Gains"),
          secondaryValue: inr(longer.gains),
          variant: "best" as const,
        },
      ],
    };
  }, [monthly, returnPct, years, existing, t]);

  return (
    <ToolPageShell
      title={t(tool.titleKey)}
      subtitle={t("Tool_nps_tier_2_Subtitle")}
      description={t(tool.descriptionKey)}
      icon={tool.icon}
      educate={
        <>
          <div className="fy-info-box">
            <strong>{t("Common_WhatYouLearn")}</strong>
            <p>{t("Tool_nps_tier_2_LearnText")}</p>
          </div>
          <FormulaCard
            title={t("Common_Formula")}
            code={"corpus = existing grown + SIP FV\nTier-II: liquid, no lock-in"}
            note={t("Tool_nps_tier_2_FormulaNote")}
          />
        </>
      }
      below={<ToolInfoPanel info={npsTier2Info(t)} />}
    >
      <div className="fy-form-card">
        <h3>{t("Common_YourInputs")}</h3>
        <div className="fy-field">
          <label>{t("Tool_nps_tier_2_LabelMonthly")}</label>
          <input
            type="number"
            min={0}
            step={500}
            inputMode="decimal"
            value={monthly}
            onChange={(e) => setMonthly(Math.max(0, Number(e.target.value) || 0))}
          />
        </div>
        <div className="fy-field">
          <label>{t("Tool_nps_tier_2_LabelReturn")}</label>
          <input
            type="number"
            min={0}
            max={20}
            step={0.5}
            inputMode="decimal"
            value={returnPct}
            onChange={(e) => setReturnPct(Math.max(0, Number(e.target.value) || 0))}
          />
        </div>
        <div className="fy-field">
          <label>{t("Tool_nps_tier_2_LabelYears")}</label>
          <input
            type="number"
            min={0}
            max={50}
            step={1}
            inputMode="decimal"
            value={years}
            onChange={(e) => setYears(Math.max(0, Number(e.target.value) || 0))}
          />
        </div>
        <div className="fy-field">
          <label>{t("Tool_nps_tier_2_LabelExisting")}</label>
          <input
            type="number"
            min={0}
            step={1000}
            inputMode="decimal"
            value={existing}
            onChange={(e) => setExisting(Math.max(0, Number(e.target.value) || 0))}
          />
          <p className="fy-field-hint">{t("Tool_nps_tier_2_ExistingHint")}</p>
        </div>
        <button type="button" className="fy-btn-calc">
          {t("Common_Calculate")}
        </button>
      </div>

      <ResultSummaryCards cards={summaryCards} />
      <ScenarioCompare
        title={t("Tool_nps_tier_2_ScenarioTitle")}
        subtitle={t("Tool_nps_tier_2_ScenarioSubtitle")}
        scenarios={scenarios}
      />
      <WorkedExample
        title={t("Tool_nps_tier_2_ExampleTitle")}
        subtitle={t("Tool_nps_tier_2_ExampleSubtitle")}
        steps={exampleSteps}
      />
    </ToolPageShell>
  );
}
