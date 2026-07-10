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
import { calculateLta, LTA_BLOCK_YEARS, LTA_TRIPS_PER_BLOCK } from "@/lib/finance/lta";
import { inr } from "@/lib/finance/format";
import { getTool } from "@/lib/config/tools";
import { ltaInfo } from "@/lib/tool-page-content";

export function LtaCalculator() {
  const t = useT();
  const tool = getTool("lta")!;

  const [claimed, setClaimed] = useState(50_000);
  const [exemptLimit, setExemptLimit] = useState(40_000);
  const [tripsUsed, setTripsUsed] = useState(1);

  const exampleSteps = useMemo(
    () => [
      t("Tool_lta_ExampleStep_1"),
      t("Tool_lta_ExampleStep_2"),
      t("Tool_lta_ExampleStep_3"),
      t("Tool_lta_ExampleStep_4"),
      t("Tool_lta_ExampleStep_5"),
    ],
    [t],
  );

  const { summaryCards, scenarios } = useMemo(() => {
    const result = calculateLta(claimed, exemptLimit, tripsUsed);
    const lowerClaim = calculateLta(Math.max(0, claimed - 10_000), exemptLimit, tripsUsed);
    const higherClaim = calculateLta(claimed + 20_000, exemptLimit, tripsUsed);

    return {
      summaryCards: [
        {
          label: t("Tool_lta_Result_Exempt"),
          value: inr(result.exempt),
          footnote: t("Tool_lta_Result_ExemptFootnote", inr(result.exemptLimit)),
          variant: "primary" as const,
        },
        {
          label: t("Tool_lta_Result_Taxable"),
          value: inr(result.taxable),
          footnote: t("Tool_lta_Result_TaxableFootnote"),
          variant: result.taxable > 0 ? ("volatile" as const) : ("secure" as const),
        },
        {
          label: t("Tool_lta_Result_Claimed"),
          value: inr(result.claimed),
          footnote: t(
            "Tool_lta_Result_TripsFootnote",
            result.tripsUsed,
            LTA_TRIPS_PER_BLOCK,
            LTA_BLOCK_YEARS,
          ),
        },
      ],
      scenarios: [
        {
          name: t("Tool_lta_Scenario_LowerClaim"),
          primaryLabel: t("Tool_lta_Result_Taxable"),
          primaryValue: inr(lowerClaim.taxable),
          secondaryLabel: t("Tool_lta_Result_Exempt"),
          secondaryValue: inr(lowerClaim.exempt),
          variant: "worst",
        },
        {
          name: t("Common_Scenario_Base"),
          primaryLabel: t("Tool_lta_Result_Taxable"),
          primaryValue: inr(result.taxable),
          secondaryLabel: t("Tool_lta_Result_Exempt"),
          secondaryValue: inr(result.exempt),
          variant: "base",
        },
        {
          name: t("Tool_lta_Scenario_HigherClaim"),
          primaryLabel: t("Tool_lta_Result_Taxable"),
          primaryValue: inr(higherClaim.taxable),
          secondaryLabel: t("Tool_lta_Result_Exempt"),
          secondaryValue: inr(higherClaim.exempt),
          variant: "best",
        },
      ],
    };
  }, [claimed, exemptLimit, tripsUsed, t]);

  return (
    <ToolPageShell
      title={t(tool.titleKey)}
      subtitle={t("Tool_lta_Subtitle")}
      description={t(tool.descriptionKey)}
      icon={tool.icon}
      educate={
        <>
          <div className="fy-info-box">
            <strong>{t("Common_WhatYouLearn")}</strong>
            <p>{t("Tool_lta_LearnText")}</p>
          </div>
          <FormulaCard
            title={t("Common_Formula")}
            code={"Exempt = min(claimed, exempt limit)\nTaxable = max(0, claimed − exempt)"}
            note={t("Tool_lta_FormulaNote")}
          />
        </>
      }
      below={<ToolInfoPanel info={ltaInfo(t)} />}
    >
      <div className="fy-form-card">
        <h3>{t("Common_YourInputs")}</h3>
        <div className="fy-field">
          <label>{t("Tool_lta_LabelClaimed")}</label>
          <input
            type="number"
            min={0}
            step={1000}
            inputMode="decimal"
            value={claimed}
            onChange={(e) => setClaimed(Math.max(0, Number(e.target.value) || 0))}
          />
        </div>
        <div className="fy-field">
          <label>{t("Tool_lta_LabelExemptLimit")}</label>
          <input
            type="number"
            min={0}
            step={1000}
            inputMode="decimal"
            value={exemptLimit}
            onChange={(e) => setExemptLimit(Math.max(0, Number(e.target.value) || 0))}
          />
          <p className="fy-field-hint">{t("Tool_lta_ExemptHint")}</p>
        </div>
        <div className="fy-field">
          <label>{t("Tool_lta_LabelTrips")}</label>
          <input
            type="number"
            min={0}
            max={LTA_TRIPS_PER_BLOCK + 2}
            step={1}
            inputMode="decimal"
            value={tripsUsed}
            onChange={(e) => setTripsUsed(Math.max(0, Math.floor(Number(e.target.value) || 0)))}
          />
          <p className="fy-field-hint">
            {t("Tool_lta_TripsHint", LTA_TRIPS_PER_BLOCK, LTA_BLOCK_YEARS)}
          </p>
        </div>
        <button type="button" className="fy-btn-calc">
          {t("Common_Calculate")}
        </button>
      </div>

      <ResultSummaryCards cards={summaryCards} />
      <ScenarioCompare
        title={t("Tool_lta_ScenarioTitle")}
        subtitle={t("Tool_lta_ScenarioSubtitle")}
        scenarios={scenarios}
      />
      <WorkedExample
        title={t("Tool_lta_ExampleTitle")}
        subtitle={t("Tool_lta_ExampleSubtitle")}
        steps={exampleSteps}
      />
    </ToolPageShell>
  );
}
