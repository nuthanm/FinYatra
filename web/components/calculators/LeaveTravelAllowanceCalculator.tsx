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
  calculateLeaveTravelAllowance,
  LTA_BLOCK_YEARS,
  LTA_TRIPS_PER_BLOCK,
} from "@/lib/finance/leaveTravelAllowance";
import { inr } from "@/lib/finance/format";
import { getTool } from "@/lib/config/tools";
import { leaveTravelAllowanceInfo } from "@/lib/tool-page-content";

export function LeaveTravelAllowanceCalculator() {
  const t = useT();
  const tool = getTool("leave-travel-allowance")!;

  const [claimed, setClaimed] = useState(50_000);
  const [exemptLimit, setExemptLimit] = useState(40_000);
  const [tripsUsed, setTripsUsed] = useState(1);

  const exampleSteps = useMemo(
    () => [
      t("Tool_leave_travel_allowance_ExampleStep_1"),
      t("Tool_leave_travel_allowance_ExampleStep_2"),
      t("Tool_leave_travel_allowance_ExampleStep_3"),
      t("Tool_leave_travel_allowance_ExampleStep_4"),
      t("Tool_leave_travel_allowance_ExampleStep_5"),
    ],
    [t],
  );

  const { summaryCards, scenarios } = useMemo(() => {
    const result = calculateLeaveTravelAllowance({ claimed, exemptLimit, tripsUsed });
    const lowerClaim = calculateLeaveTravelAllowance({
      claimed: Math.max(0, claimed - 10_000),
      exemptLimit,
      tripsUsed,
    });
    const higherClaim = calculateLeaveTravelAllowance({
      claimed: claimed + 20_000,
      exemptLimit,
      tripsUsed,
    });

    return {
      summaryCards: [
        {
          label: t("Tool_leave_travel_allowance_Result_Exempt"),
          value: inr(result.exempt),
          footnote: t("Tool_leave_travel_allowance_Result_ExemptFootnote", inr(result.exemptLimit)),
          variant: "primary" as const,
        },
        {
          label: t("Tool_leave_travel_allowance_Result_Taxable"),
          value: inr(result.taxable),
          footnote: t("Tool_leave_travel_allowance_Result_TaxableFootnote"),
          variant: result.taxable > 0 ? ("volatile" as const) : ("secure" as const),
        },
        {
          label: t("Tool_leave_travel_allowance_Result_Claimed"),
          value: inr(result.claimed),
          footnote: t(
            "Tool_leave_travel_allowance_Result_TripsFootnote",
            result.tripsUsed,
            LTA_TRIPS_PER_BLOCK,
            LTA_BLOCK_YEARS,
          ),
        },
      ],
      scenarios: [
        {
          name: t("Tool_leave_travel_allowance_Scenario_LowerClaim"),
          primaryLabel: t("Tool_leave_travel_allowance_Result_Taxable"),
          primaryValue: inr(lowerClaim.taxable),
          secondaryLabel: t("Tool_leave_travel_allowance_Result_Exempt"),
          secondaryValue: inr(lowerClaim.exempt),
          variant: "worst" as const,
        },
        {
          name: t("Common_Scenario_Base"),
          primaryLabel: t("Tool_leave_travel_allowance_Result_Taxable"),
          primaryValue: inr(result.taxable),
          secondaryLabel: t("Tool_leave_travel_allowance_Result_Exempt"),
          secondaryValue: inr(result.exempt),
          variant: "base" as const,
        },
        {
          name: t("Tool_leave_travel_allowance_Scenario_HigherClaim"),
          primaryLabel: t("Tool_leave_travel_allowance_Result_Taxable"),
          primaryValue: inr(higherClaim.taxable),
          secondaryLabel: t("Tool_leave_travel_allowance_Result_Exempt"),
          secondaryValue: inr(higherClaim.exempt),
          variant: "best" as const,
        },
      ],
    };
  }, [claimed, exemptLimit, tripsUsed, t]);

  return (
    <ToolPageShell
      title={t(tool.titleKey)}
      subtitle={t("Tool_leave_travel_allowance_Subtitle")}
      description={t(tool.descriptionKey)}
      icon={tool.icon}
      educate={
        <>
          <div className="fy-info-box">
            <strong>{t("Common_WhatYouLearn")}</strong>
            <p>{t("Tool_leave_travel_allowance_LearnText")}</p>
          </div>
          <FormulaCard
            title={t("Common_Formula")}
            code={"Exempt = min(claimed, exempt limit)\nTaxable = max(0, claimed − exempt)"}
            note={t("Tool_leave_travel_allowance_FormulaNote")}
          />
        </>
      }
      below={<ToolInfoPanel info={leaveTravelAllowanceInfo(t)} />}
    >
      <div className="fy-form-card">
        <h3>{t("Common_YourInputs")}</h3>
        <div className="fy-field">
          <label>{t("Tool_leave_travel_allowance_LabelClaimed")}</label>
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
          <label>{t("Tool_leave_travel_allowance_LabelExemptLimit")}</label>
          <input
            type="number"
            min={0}
            step={1000}
            inputMode="decimal"
            value={exemptLimit}
            onChange={(e) => setExemptLimit(Math.max(0, Number(e.target.value) || 0))}
          />
          <p className="fy-field-hint">{t("Tool_leave_travel_allowance_ExemptHint")}</p>
        </div>
        <div className="fy-field">
          <label>{t("Tool_leave_travel_allowance_LabelTrips")}</label>
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
            {t("Tool_leave_travel_allowance_TripsHint", LTA_TRIPS_PER_BLOCK, LTA_BLOCK_YEARS)}
          </p>
        </div>
        <button type="button" className="fy-btn-calc">
          {t("Common_Calculate")}
        </button>
      </div>

      <ResultSummaryCards cards={summaryCards} />
      <ScenarioCompare
        title={t("Tool_leave_travel_allowance_ScenarioTitle")}
        subtitle={t("Tool_leave_travel_allowance_ScenarioSubtitle")}
        scenarios={scenarios}
      />
      <WorkedExample
        title={t("Tool_leave_travel_allowance_ExampleTitle")}
        subtitle={t("Tool_leave_travel_allowance_ExampleSubtitle")}
        steps={exampleSteps}
      />
    </ToolPageShell>
  );
}
