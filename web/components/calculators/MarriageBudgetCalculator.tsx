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
import { calculateMarriageBudget } from "@/lib/finance/marriageBudget";
import { inr, percent } from "@/lib/finance/format";
import { getTool } from "@/lib/config/tools";
import { marriageBudgetInfo } from "@/lib/tool-page-content";

export function MarriageBudgetCalculator() {
  const t = useT();
  const tool = getTool("marriage-budget")!;

  const [venue, setVenue] = useState(3_00_000);
  const [catering, setCatering] = useState(4_00_000);
  const [decor, setDecor] = useState(1_50_000);
  const [attire, setAttire] = useState(2_00_000);
  const [photography, setPhotography] = useState(1_00_000);
  const [jewellery, setJewellery] = useState(5_00_000);
  const [travel, setTravel] = useState(50_000);
  const [misc, setMisc] = useState(1_00_000);
  const [contingency, setContingency] = useState(10);

  const exampleSteps = useMemo(
    () => [
      t("Tool_marriage_budget_ExampleStep_1"),
      t("Tool_marriage_budget_ExampleStep_2"),
      t("Tool_marriage_budget_ExampleStep_3"),
      t("Tool_marriage_budget_ExampleStep_4"),
      t("Tool_marriage_budget_ExampleStep_5"),
    ],
    [t],
  );

  const { summaryCards, scenarios } = useMemo(() => {
    const input = {
      venue,
      catering,
      decor,
      attire,
      photography,
      jewellery,
      travel,
      miscellaneous: misc,
      contingencyPercent: contingency,
    };
    const base = calculateMarriageBudget(input);
    const low = calculateMarriageBudget({ ...input, contingencyPercent: 5 });
    const high = calculateMarriageBudget({ ...input, contingencyPercent: 15 });

    return {
      summaryCards: [
        {
          label: t("Tool_marriage_budget_Result_Subtotal"),
          value: inr(base.subtotal),
          footnote: t("Tool_marriage_budget_Result_SubtotalFootnote"),
        },
        {
          label: t("Tool_marriage_budget_Result_Contingency"),
          value: inr(base.contingencyAmount),
          footnote: t("Tool_marriage_budget_Result_ContingencyFootnote", percent(contingency, 0)),
        },
        {
          label: t("Tool_marriage_budget_Result_Total"),
          value: inr(base.total),
          footnote: t("Tool_marriage_budget_Result_TotalFootnote"),
          variant: "primary" as const,
        },
      ],
      scenarios: [
        {
          name: t("Tool_marriage_budget_Scenario_5"),
          primaryLabel: t("Tool_marriage_budget_Result_Total"),
          primaryValue: inr(low.total),
          secondaryLabel: t("Tool_marriage_budget_LabelContingency"),
          secondaryValue: percent(5, 0),
          variant: "best" as const,
        },
        {
          name: t("Common_Scenario_Base"),
          primaryLabel: t("Tool_marriage_budget_Result_Total"),
          primaryValue: inr(base.total),
          secondaryLabel: t("Tool_marriage_budget_LabelContingency"),
          secondaryValue: percent(contingency, 0),
          variant: "base" as const,
        },
        {
          name: t("Tool_marriage_budget_Scenario_15"),
          primaryLabel: t("Tool_marriage_budget_Result_Total"),
          primaryValue: inr(high.total),
          secondaryLabel: t("Tool_marriage_budget_LabelContingency"),
          secondaryValue: percent(15, 0),
          variant: "worst" as const,
        },
      ],
    };
  }, [venue, catering, decor, attire, photography, jewellery, travel, misc, contingency, t]);

  return (
    <ToolPageShell
      title={t(tool.titleKey)}
      subtitle={t("Tool_marriage_budget_Subtitle")}
      description={t(tool.descriptionKey)}
      icon={tool.icon}
      educate={
        <>
          <div className="fy-info-box">
            <strong>{t("Common_WhatYouLearn")}</strong>
            <p>{t("Tool_marriage_budget_LearnText")}</p>
          </div>
          <FormulaCard
            title={t("Common_Formula")}
            code={"subtotal = Σ expense buckets\ntotal = subtotal × (1 + contingency%)"}
            note={t("Tool_marriage_budget_FormulaNote")}
          />
        </>
      }
      below={<ToolInfoPanel info={marriageBudgetInfo(t)} />}
    >
      <div className="fy-form-card">
        <h3>{t("Common_YourInputs")}</h3>
        <div className="fy-field">
          <label>{t("Tool_marriage_budget_LabelVenue")}</label>
          <input
            type="number"
            min={0}
            step={10000}
            inputMode="decimal"
            value={venue}
            onChange={(e) => setVenue(Math.max(0, Number(e.target.value) || 0))}
          />
        </div>
        <div className="fy-field">
          <label>{t("Tool_marriage_budget_LabelCatering")}</label>
          <input
            type="number"
            min={0}
            step={10000}
            inputMode="decimal"
            value={catering}
            onChange={(e) => setCatering(Math.max(0, Number(e.target.value) || 0))}
          />
        </div>
        <div className="fy-field">
          <label>{t("Tool_marriage_budget_LabelDecor")}</label>
          <input
            type="number"
            min={0}
            step={5000}
            inputMode="decimal"
            value={decor}
            onChange={(e) => setDecor(Math.max(0, Number(e.target.value) || 0))}
          />
        </div>
        <div className="fy-field">
          <label>{t("Tool_marriage_budget_LabelAttire")}</label>
          <input
            type="number"
            min={0}
            step={5000}
            inputMode="decimal"
            value={attire}
            onChange={(e) => setAttire(Math.max(0, Number(e.target.value) || 0))}
          />
        </div>
        <div className="fy-field">
          <label>{t("Tool_marriage_budget_LabelPhoto")}</label>
          <input
            type="number"
            min={0}
            step={5000}
            inputMode="decimal"
            value={photography}
            onChange={(e) => setPhotography(Math.max(0, Number(e.target.value) || 0))}
          />
        </div>
        <div className="fy-field">
          <label>{t("Tool_marriage_budget_LabelJewellery")}</label>
          <input
            type="number"
            min={0}
            step={10000}
            inputMode="decimal"
            value={jewellery}
            onChange={(e) => setJewellery(Math.max(0, Number(e.target.value) || 0))}
          />
        </div>
        <div className="fy-field">
          <label>{t("Tool_marriage_budget_LabelTravel")}</label>
          <input
            type="number"
            min={0}
            step={5000}
            inputMode="decimal"
            value={travel}
            onChange={(e) => setTravel(Math.max(0, Number(e.target.value) || 0))}
          />
        </div>
        <div className="fy-field">
          <label>{t("Tool_marriage_budget_LabelMisc")}</label>
          <input
            type="number"
            min={0}
            step={5000}
            inputMode="decimal"
            value={misc}
            onChange={(e) => setMisc(Math.max(0, Number(e.target.value) || 0))}
          />
        </div>
        <div className="fy-field">
          <label>{t("Tool_marriage_budget_LabelContingency")}</label>
          <input
            type="number"
            min={0}
            max={50}
            step={1}
            inputMode="decimal"
            value={contingency}
            onChange={(e) => setContingency(Math.max(0, Number(e.target.value) || 0))}
          />
          <p className="fy-field-hint">{t("Tool_marriage_budget_ContingencyHint")}</p>
        </div>
        <button type="button" className="fy-btn-calc">
          {t("Common_Calculate")}
        </button>
      </div>

      <ResultSummaryCards cards={summaryCards} />
      <ScenarioCompare
        title={t("Tool_marriage_budget_ScenarioTitle")}
        subtitle={t("Tool_marriage_budget_ScenarioSubtitle")}
        scenarios={scenarios}
      />
      <WorkedExample
        title={t("Tool_marriage_budget_ExampleTitle")}
        subtitle={t("Tool_marriage_budget_ExampleSubtitle")}
        steps={exampleSteps}
      />
    </ToolPageShell>
  );
}
