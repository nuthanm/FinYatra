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
import { calculateNpsAssetAllocation } from "@/lib/finance/npsAssetAllocation";
import { percent } from "@/lib/finance/format";
import { getTool } from "@/lib/config/tools";
import { npsAssetAllocationInfo } from "@/lib/tool-page-content";

export function NpsAssetAllocationCalculator() {
  const t = useT();
  const tool = getTool("nps-asset-allocation")!;

  const [equity, setEquity] = useState(50);
  const [corporate, setCorporate] = useState(30);
  const [govt, setGovt] = useState(20);
  const [eRet, setERet] = useState(12);
  const [cRet, setCRet] = useState(8);
  const [gRet, setGRet] = useState(7);

  const exampleSteps = useMemo(
    () => [
      t("Tool_nps_asset_allocation_ExampleStep_1"),
      t("Tool_nps_asset_allocation_ExampleStep_2"),
      t("Tool_nps_asset_allocation_ExampleStep_3"),
      t("Tool_nps_asset_allocation_ExampleStep_4"),
      t("Tool_nps_asset_allocation_ExampleStep_5"),
    ],
    [t],
  );

  const { summaryCards, scenarios, result } = useMemo(() => {
    const result = calculateNpsAssetAllocation({
      equityPercent: equity,
      corporatePercent: corporate,
      governmentPercent: govt,
      equityReturnPercent: eRet,
      corporateReturnPercent: cRet,
      governmentReturnPercent: gRet,
    });
    const conservative = calculateNpsAssetAllocation({
      equityPercent: 25,
      corporatePercent: 25,
      governmentPercent: 50,
      equityReturnPercent: eRet,
      corporateReturnPercent: cRet,
      governmentReturnPercent: gRet,
    });
    const aggressive = calculateNpsAssetAllocation({
      equityPercent: 75,
      corporatePercent: 15,
      governmentPercent: 10,
      equityReturnPercent: eRet,
      corporateReturnPercent: cRet,
      governmentReturnPercent: gRet,
    });

    return {
      result,
      summaryCards: [
        {
          label: t("Tool_nps_asset_allocation_Result_Blend"),
          value: percent(result.blendedReturnPercent),
          footnote: t("Tool_nps_asset_allocation_Result_BlendFootnote"),
          variant: "primary" as const,
        },
        {
          label: t("Tool_nps_asset_allocation_Result_Sum"),
          value: percent(result.allocationSum),
          footnote: result.isValid
            ? t("Tool_nps_asset_allocation_Sum_Ok")
            : t("Tool_nps_asset_allocation_Sum_Bad"),
          variant: result.isValid ? ("secure" as const) : ("volatile" as const),
        },
        {
          label: t("Tool_nps_asset_allocation_Result_Equity"),
          value: percent(result.equityPercent),
          footnote: t("Tool_nps_asset_allocation_Result_EquityFootnote", percent(eRet)),
        },
      ],
      scenarios: [
        {
          name: t("Tool_nps_asset_allocation_Scenario_Conservative"),
          primaryLabel: t("Tool_nps_asset_allocation_Result_Blend"),
          primaryValue: percent(conservative.blendedReturnPercent),
          secondaryLabel: t("Tool_nps_asset_allocation_Result_Equity"),
          secondaryValue: percent(25),
          variant: "worst" as const,
        },
        {
          name: t("Common_Scenario_Base"),
          primaryLabel: t("Tool_nps_asset_allocation_Result_Blend"),
          primaryValue: percent(result.blendedReturnPercent),
          secondaryLabel: t("Tool_nps_asset_allocation_Result_Sum"),
          secondaryValue: percent(result.allocationSum),
          variant: "base" as const,
        },
        {
          name: t("Tool_nps_asset_allocation_Scenario_Aggressive"),
          primaryLabel: t("Tool_nps_asset_allocation_Result_Blend"),
          primaryValue: percent(aggressive.blendedReturnPercent),
          secondaryLabel: t("Tool_nps_asset_allocation_Result_Equity"),
          secondaryValue: percent(75),
          variant: "best" as const,
        },
      ],
    };
  }, [equity, corporate, govt, eRet, cRet, gRet, t]);

  return (
    <ToolPageShell
      title={t(tool.titleKey)}
      subtitle={t("Tool_nps_asset_allocation_Subtitle")}
      description={t(tool.descriptionKey)}
      icon={tool.icon}
      educate={
        <>
          <div className="fy-info-box">
            <strong>{t("Common_WhatYouLearn")}</strong>
            <p>{t("Tool_nps_asset_allocation_LearnText")}</p>
          </div>
          <FormulaCard
            title={t("Common_Formula")}
            code={"E% + C% + G% = 100\nBlend = Σ (weight × return)"}
            note={t("Tool_nps_asset_allocation_FormulaNote")}
          />
        </>
      }
      below={<ToolInfoPanel info={npsAssetAllocationInfo(t)} />}
    >
      <div className="fy-form-card">
        <h3>{t("Common_YourInputs")}</h3>
        <div className="fy-field">
          <label>{t("Tool_nps_asset_allocation_LabelEquity")}</label>
          <input
            type="number"
            min={0}
            max={100}
            step={1}
            inputMode="decimal"
            value={equity}
            onChange={(e) => setEquity(Math.max(0, Number(e.target.value) || 0))}
          />
        </div>
        <div className="fy-field">
          <label>{t("Tool_nps_asset_allocation_LabelCorporate")}</label>
          <input
            type="number"
            min={0}
            max={100}
            step={1}
            inputMode="decimal"
            value={corporate}
            onChange={(e) => setCorporate(Math.max(0, Number(e.target.value) || 0))}
          />
        </div>
        <div className="fy-field">
          <label>{t("Tool_nps_asset_allocation_LabelGovt")}</label>
          <input
            type="number"
            min={0}
            max={100}
            step={1}
            inputMode="decimal"
            value={govt}
            onChange={(e) => setGovt(Math.max(0, Number(e.target.value) || 0))}
          />
        </div>
        <div className="fy-field">
          <label>{t("Tool_nps_asset_allocation_LabelERet")}</label>
          <input
            type="number"
            min={0}
            step={0.1}
            inputMode="decimal"
            value={eRet}
            onChange={(e) => setERet(Math.max(0, Number(e.target.value) || 0))}
          />
        </div>
        <div className="fy-field">
          <label>{t("Tool_nps_asset_allocation_LabelCRet")}</label>
          <input
            type="number"
            min={0}
            step={0.1}
            inputMode="decimal"
            value={cRet}
            onChange={(e) => setCRet(Math.max(0, Number(e.target.value) || 0))}
          />
        </div>
        <div className="fy-field">
          <label>{t("Tool_nps_asset_allocation_LabelGRet")}</label>
          <input
            type="number"
            min={0}
            step={0.1}
            inputMode="decimal"
            value={gRet}
            onChange={(e) => setGRet(Math.max(0, Number(e.target.value) || 0))}
          />
        </div>
        <button type="button" className="fy-btn-calc">
          {t("Common_Calculate")}
        </button>
      </div>

      {!result.isValid && (
        <div className="fy-info-box">
          <strong>{t("Tool_nps_asset_allocation_InvalidTitle")}</strong>
          <p>
            {t(
              "Tool_nps_asset_allocation_InvalidNote",
              percent(result.allocationSum),
            )}
          </p>
        </div>
      )}

      <ResultSummaryCards cards={summaryCards} />
      <ScenarioCompare
        title={t("Tool_nps_asset_allocation_ScenarioTitle")}
        subtitle={t("Tool_nps_asset_allocation_ScenarioSubtitle")}
        scenarios={scenarios}
      />
      <WorkedExample
        title={t("Tool_nps_asset_allocation_ExampleTitle")}
        subtitle={t("Tool_nps_asset_allocation_ExampleSubtitle")}
        steps={exampleSteps}
      />
    </ToolPageShell>
  );
}
