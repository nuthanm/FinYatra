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
import { calculateDtaa } from "@/lib/finance/dtaa";
import { inr } from "@/lib/finance/format";
import { getTool } from "@/lib/config/tools";
import { dtaaInfo } from "@/lib/tool-page-content";

export function DtaaCalculator() {
  const t = useT();
  const tool = getTool("dtaa")!;

  const [foreignIncome, setForeignIncome] = useState(10_00_000);
  const [foreignTaxPaid, setForeignTaxPaid] = useState(1_50_000);
  const [indiaTaxOnIncome, setIndiaTaxOnIncome] = useState(2_00_000);

  const exampleSteps = useMemo(
    () => [
      t("Tool_dtaa_ExampleStep_1"),
      t("Tool_dtaa_ExampleStep_2"),
      t("Tool_dtaa_ExampleStep_3"),
      t("Tool_dtaa_ExampleStep_4"),
      t("Tool_dtaa_ExampleStep_5"),
    ],
    [t],
  );

  const { summaryCards, scenarios } = useMemo(() => {
    const result = calculateDtaa({ foreignIncome, foreignTaxPaid, indiaTaxOnIncome });
    const lowForeign = calculateDtaa({
      foreignIncome,
      foreignTaxPaid: Math.round(foreignTaxPaid * 0.5),
      indiaTaxOnIncome,
    });
    const highForeign = calculateDtaa({
      foreignIncome,
      foreignTaxPaid: Math.round(foreignTaxPaid * 1.5),
      indiaTaxOnIncome,
    });

    return {
      summaryCards: [
        {
          label: t("Tool_dtaa_Result_Credit"),
          value: inr(result.foreignTaxCredit),
          footnote: t("Tool_dtaa_Result_CreditFootnote"),
          variant: "primary" as const,
        },
        {
          label: t("Tool_dtaa_Result_NetIndia"),
          value: inr(result.netIndiaTax),
          footnote: t("Tool_dtaa_Result_NetIndiaFootnote"),
        },
        {
          label: t("Tool_dtaa_Result_Uncredited"),
          value: inr(result.uncreditedForeignTax),
          footnote: t("Tool_dtaa_Result_UncreditedFootnote"),
          variant: result.uncreditedForeignTax > 0 ? ("volatile" as const) : ("default" as const),
        },
      ],
      scenarios: [
        {
          name: t("Tool_dtaa_Scenario_LowForeign"),
          primaryLabel: t("Tool_dtaa_Result_Credit"),
          primaryValue: inr(lowForeign.foreignTaxCredit),
          secondaryLabel: t("Tool_dtaa_Result_NetIndia"),
          secondaryValue: inr(lowForeign.netIndiaTax),
          variant: "worst" as const,
        },
        {
          name: t("Common_Scenario_Base"),
          primaryLabel: t("Tool_dtaa_Result_Credit"),
          primaryValue: inr(result.foreignTaxCredit),
          secondaryLabel: t("Tool_dtaa_Result_NetIndia"),
          secondaryValue: inr(result.netIndiaTax),
          variant: "base" as const,
        },
        {
          name: t("Tool_dtaa_Scenario_HighForeign"),
          primaryLabel: t("Tool_dtaa_Result_Credit"),
          primaryValue: inr(highForeign.foreignTaxCredit),
          secondaryLabel: t("Tool_dtaa_Result_Uncredited"),
          secondaryValue: inr(highForeign.uncreditedForeignTax),
          variant: "best" as const,
        },
      ],
    };
  }, [foreignIncome, foreignTaxPaid, indiaTaxOnIncome, t]);

  return (
    <ToolPageShell
      title={t(tool.titleKey)}
      subtitle={t("Tool_dtaa_Subtitle")}
      description={t(tool.descriptionKey)}
      icon={tool.icon}
      educate={
        <>
          <div className="fy-info-box">
            <strong>{t("Common_WhatYouLearn")}</strong>
            <p>{t("Tool_dtaa_LearnText")}</p>
          </div>
          <FormulaCard
            title={t("Common_Formula")}
            code={"FTC = min(foreign tax, India tax)\nNet India = India − FTC\nUncredited = foreign − FTC"}
            note={t("Tool_dtaa_FormulaNote")}
          />
        </>
      }
      below={<ToolInfoPanel info={dtaaInfo(t)} />}
    >
      <div className="fy-form-card">
        <h3>{t("Common_YourInputs")}</h3>
        <div className="fy-field">
          <label>{t("Tool_dtaa_LabelForeignIncome")}</label>
          <input
            type="number"
            min={0}
            step={10000}
            inputMode="decimal"
            value={foreignIncome}
            onChange={(e) => setForeignIncome(Math.max(0, Number(e.target.value) || 0))}
          />
        </div>
        <div className="fy-field">
          <label>{t("Tool_dtaa_LabelForeignTax")}</label>
          <input
            type="number"
            min={0}
            step={1000}
            inputMode="decimal"
            value={foreignTaxPaid}
            onChange={(e) => setForeignTaxPaid(Math.max(0, Number(e.target.value) || 0))}
          />
        </div>
        <div className="fy-field">
          <label>{t("Tool_dtaa_LabelIndiaTax")}</label>
          <input
            type="number"
            min={0}
            step={1000}
            inputMode="decimal"
            value={indiaTaxOnIncome}
            onChange={(e) => setIndiaTaxOnIncome(Math.max(0, Number(e.target.value) || 0))}
          />
          <p className="fy-field-hint">{t("Tool_dtaa_IndiaTaxHint")}</p>
        </div>
        <button type="button" className="fy-btn-calc">
          {t("Common_Calculate")}
        </button>
      </div>

      <ResultSummaryCards cards={summaryCards} />
      <ScenarioCompare
        title={t("Tool_dtaa_ScenarioTitle")}
        subtitle={t("Tool_dtaa_ScenarioSubtitle")}
        scenarios={scenarios}
      />
      <WorkedExample
        title={t("Tool_dtaa_ExampleTitle")}
        subtitle={t("Tool_dtaa_ExampleSubtitle")}
        steps={exampleSteps}
      />
    </ToolPageShell>
  );
}
