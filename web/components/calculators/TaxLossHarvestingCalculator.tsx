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
import { calculateTaxLossHarvesting } from "@/lib/finance/taxLossHarvesting";
import { inr } from "@/lib/finance/format";
import { getTool } from "@/lib/config/tools";
import { taxLossHarvestingInfo } from "@/lib/tool-page-content";

export function TaxLossHarvestingCalculator() {
  const t = useT();
  const tool = getTool("tax-loss-harvesting")!;

  const [stcg, setStcg] = useState(2_00_000);
  const [ltcg, setLtcg] = useState(3_00_000);
  const [stcl, setStcl] = useState(1_50_000);
  const [ltcl, setLtcl] = useState(80_000);
  const [stcgRate, setStcgRate] = useState(20);
  const [ltcgRate, setLtcgRate] = useState(12.5);

  const exampleSteps = useMemo(
    () => [
      t("Tool_tax_loss_harvesting_ExampleStep_1"),
      t("Tool_tax_loss_harvesting_ExampleStep_2"),
      t("Tool_tax_loss_harvesting_ExampleStep_3"),
      t("Tool_tax_loss_harvesting_ExampleStep_4"),
      t("Tool_tax_loss_harvesting_ExampleStep_5"),
    ],
    [t],
  );

  const { summaryCards, scenarios } = useMemo(() => {
    const result = calculateTaxLossHarvesting({
      shortTermGains: stcg,
      longTermGains: ltcg,
      shortTermLosses: stcl,
      longTermLosses: ltcl,
      stcgRatePercent: stcgRate,
      ltcgRatePercent: ltcgRate,
    });
    const noLoss = calculateTaxLossHarvesting({
      shortTermGains: stcg,
      longTermGains: ltcg,
      shortTermLosses: 0,
      longTermLosses: 0,
      stcgRatePercent: stcgRate,
      ltcgRatePercent: ltcgRate,
    });
    const moreLoss = calculateTaxLossHarvesting({
      shortTermGains: stcg,
      longTermGains: ltcg,
      shortTermLosses: stcl + 50_000,
      longTermLosses: ltcl + 50_000,
      stcgRatePercent: stcgRate,
      ltcgRatePercent: ltcgRate,
    });

    return {
      summaryCards: [
        {
          label: t("Tool_tax_loss_harvesting_Result_TaxAfter"),
          value: inr(result.estimatedTaxAfterHarvest),
          footnote: t("Tool_tax_loss_harvesting_Result_TaxAfterFootnote"),
          variant: "primary" as const,
        },
        {
          label: t("Tool_tax_loss_harvesting_Result_Saved"),
          value: inr(result.taxSaved),
          footnote: t(
            "Tool_tax_loss_harvesting_Result_SavedFootnote",
            inr(result.estimatedTaxWithoutHarvest),
          ),
          variant: "secure" as const,
        },
        {
          label: t("Tool_tax_loss_harvesting_Result_NetGains"),
          value: inr(result.netStcg + result.netLtcg),
          footnote: t(
            "Tool_tax_loss_harvesting_Result_NetGainsFootnote",
            inr(result.netStcg),
            inr(result.netLtcg),
          ),
        },
      ],
      scenarios: [
        {
          name: t("Tool_tax_loss_harvesting_Scenario_NoLoss"),
          primaryLabel: t("Tool_tax_loss_harvesting_Result_TaxAfter"),
          primaryValue: inr(noLoss.estimatedTaxAfterHarvest),
          secondaryLabel: t("Tool_tax_loss_harvesting_Result_Saved"),
          secondaryValue: inr(noLoss.taxSaved),
          variant: "worst" as const,
        },
        {
          name: t("Common_Scenario_Base"),
          primaryLabel: t("Tool_tax_loss_harvesting_Result_TaxAfter"),
          primaryValue: inr(result.estimatedTaxAfterHarvest),
          secondaryLabel: t("Tool_tax_loss_harvesting_Result_Saved"),
          secondaryValue: inr(result.taxSaved),
          variant: "base" as const,
        },
        {
          name: t("Tool_tax_loss_harvesting_Scenario_MoreLoss"),
          primaryLabel: t("Tool_tax_loss_harvesting_Result_TaxAfter"),
          primaryValue: inr(moreLoss.estimatedTaxAfterHarvest),
          secondaryLabel: t("Tool_tax_loss_harvesting_Result_Saved"),
          secondaryValue: inr(moreLoss.taxSaved),
          variant: "best" as const,
        },
      ],
    };
  }, [stcg, ltcg, stcl, ltcl, stcgRate, ltcgRate, t]);

  return (
    <ToolPageShell
      title={t(tool.titleKey)}
      subtitle={t("Tool_tax_loss_harvesting_Subtitle")}
      description={t(tool.descriptionKey)}
      icon={tool.icon}
      educate={
        <>
          <div className="fy-info-box">
            <strong>{t("Common_WhatYouLearn")}</strong>
            <p>{t("Tool_tax_loss_harvesting_LearnText")}</p>
          </div>
          <FormulaCard
            title={t("Common_Formula")}
            code={
              "STCL → STCG then LTCG\nLTCL → LTCG only\ntax on net STCG + net LTCG"
            }
            note={t("Tool_tax_loss_harvesting_FormulaNote")}
          />
        </>
      }
      below={<ToolInfoPanel info={taxLossHarvestingInfo(t)} />}
    >
      <div className="fy-form-card">
        <h3>{t("Common_YourInputs")}</h3>
        <div className="fy-field">
          <label>{t("Tool_tax_loss_harvesting_LabelStcg")}</label>
          <input
            type="number"
            min={0}
            step={10000}
            inputMode="decimal"
            value={stcg}
            onChange={(e) => setStcg(Math.max(0, Number(e.target.value) || 0))}
          />
        </div>
        <div className="fy-field">
          <label>{t("Tool_tax_loss_harvesting_LabelLtcg")}</label>
          <input
            type="number"
            min={0}
            step={10000}
            inputMode="decimal"
            value={ltcg}
            onChange={(e) => setLtcg(Math.max(0, Number(e.target.value) || 0))}
          />
        </div>
        <div className="fy-field">
          <label>{t("Tool_tax_loss_harvesting_LabelStcl")}</label>
          <input
            type="number"
            min={0}
            step={10000}
            inputMode="decimal"
            value={stcl}
            onChange={(e) => setStcl(Math.max(0, Number(e.target.value) || 0))}
          />
        </div>
        <div className="fy-field">
          <label>{t("Tool_tax_loss_harvesting_LabelLtcl")}</label>
          <input
            type="number"
            min={0}
            step={10000}
            inputMode="decimal"
            value={ltcl}
            onChange={(e) => setLtcl(Math.max(0, Number(e.target.value) || 0))}
          />
        </div>
        <div className="fy-field">
          <label>{t("Tool_tax_loss_harvesting_LabelStcgRate")}</label>
          <input
            type="number"
            min={0}
            max={42}
            step={0.5}
            inputMode="decimal"
            value={stcgRate}
            onChange={(e) => setStcgRate(Math.max(0, Number(e.target.value) || 0))}
          />
        </div>
        <div className="fy-field">
          <label>{t("Tool_tax_loss_harvesting_LabelLtcgRate")}</label>
          <input
            type="number"
            min={0}
            max={42}
            step={0.5}
            inputMode="decimal"
            value={ltcgRate}
            onChange={(e) => setLtcgRate(Math.max(0, Number(e.target.value) || 0))}
          />
        </div>
        <button type="button" className="fy-btn-calc">
          {t("Common_Calculate")}
        </button>
      </div>

      <ResultSummaryCards cards={summaryCards} />
      <ScenarioCompare
        title={t("Tool_tax_loss_harvesting_ScenarioTitle")}
        subtitle={t("Tool_tax_loss_harvesting_ScenarioSubtitle")}
        scenarios={scenarios}
      />
      <WorkedExample
        title={t("Tool_tax_loss_harvesting_ExampleTitle")}
        subtitle={t("Tool_tax_loss_harvesting_ExampleSubtitle")}
        steps={exampleSteps}
      />
    </ToolPageShell>
  );
}
