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
  calculateCropInsurance,
  CROP_PREMIUM_RATES,
  type CropSeason,
} from "@/lib/finance/cropInsurance";
import { inr, percent } from "@/lib/finance/format";
import { getTool } from "@/lib/config/tools";
import { cropInsuranceInfo } from "@/lib/tool-page-content";

export function CropInsuranceCalculator() {
  const t = useT();
  const tool = getTool("crop-insurance")!;

  const [sumInsured, setSumInsured] = useState(2_00_000);
  const [season, setSeason] = useState<CropSeason>("kharif");
  const [rateOverride, setRateOverride] = useState<number | "">(CROP_PREMIUM_RATES.kharif);

  const exampleSteps = useMemo(
    () => [
      t("Tool_crop_insurance_ExampleStep_1"),
      t("Tool_crop_insurance_ExampleStep_2"),
      t("Tool_crop_insurance_ExampleStep_3"),
      t("Tool_crop_insurance_ExampleStep_4"),
      t("Tool_crop_insurance_ExampleStep_5"),
    ],
    [t],
  );

  const { summaryCards, scenarios } = useMemo(() => {
    const rate =
      rateOverride === "" ? CROP_PREMIUM_RATES[season] : Math.max(0, Number(rateOverride) || 0);
    const result = calculateCropInsurance({
      sumInsured,
      season,
      premiumRatePercent: rate,
    });
    const rabi = calculateCropInsurance({
      sumInsured,
      season: "rabi",
      premiumRatePercent: CROP_PREMIUM_RATES.rabi,
    });
    const commercial = calculateCropInsurance({
      sumInsured,
      season: "commercial",
      premiumRatePercent: CROP_PREMIUM_RATES.commercial,
    });

    return {
      summaryCards: [
        {
          label: t("Tool_crop_insurance_Result_Premium"),
          value: inr(result.farmerPremium),
          footnote: t(
            "Tool_crop_insurance_Result_PremiumFootnote",
            percent(result.premiumRatePercent),
          ),
          variant: "primary" as const,
        },
        {
          label: t("Tool_crop_insurance_Result_Sum"),
          value: inr(result.sumInsured),
          footnote: t("Tool_crop_insurance_Result_SumFootnote"),
        },
        {
          label: t("Tool_crop_insurance_Result_Claim"),
          value: inr(result.maxClaimNote),
          footnote: t("Tool_crop_insurance_Result_ClaimFootnote"),
          variant: "secure" as const,
        },
      ],
      scenarios: [
        {
          name: t("Tool_crop_insurance_Scenario_Rabi"),
          primaryLabel: t("Tool_crop_insurance_Result_Premium"),
          primaryValue: inr(rabi.farmerPremium),
          secondaryLabel: t("Tool_crop_insurance_LabelRate"),
          secondaryValue: percent(rabi.premiumRatePercent),
          variant: "best" as const,
        },
        {
          name: t("Common_Scenario_Base"),
          primaryLabel: t("Tool_crop_insurance_Result_Premium"),
          primaryValue: inr(result.farmerPremium),
          secondaryLabel: t("Tool_crop_insurance_Result_Sum"),
          secondaryValue: inr(result.sumInsured),
          variant: "base" as const,
        },
        {
          name: t("Tool_crop_insurance_Scenario_Commercial"),
          primaryLabel: t("Tool_crop_insurance_Result_Premium"),
          primaryValue: inr(commercial.farmerPremium),
          secondaryLabel: t("Tool_crop_insurance_LabelRate"),
          secondaryValue: percent(commercial.premiumRatePercent),
          variant: "worst" as const,
        },
      ],
    };
  }, [sumInsured, season, rateOverride, t]);

  return (
    <ToolPageShell
      title={t(tool.titleKey)}
      subtitle={t("Tool_crop_insurance_Subtitle")}
      description={t(tool.descriptionKey)}
      icon={tool.icon}
      educate={
        <>
          <div className="fy-info-box">
            <strong>{t("Common_WhatYouLearn")}</strong>
            <p>{t("Tool_crop_insurance_LearnText")}</p>
          </div>
          <FormulaCard
            title={t("Common_Formula")}
            code={"premium = sumInsured × rate%\nKharif ~2% · Rabi ~1.5%\nclaim ≤ sum insured (note)"}
            note={t("Tool_crop_insurance_FormulaNote")}
          />
        </>
      }
      below={<ToolInfoPanel info={cropInsuranceInfo(t)} />}
    >
      <div className="fy-form-card">
        <h3>{t("Common_YourInputs")}</h3>
        <div className="fy-field">
          <label>{t("Tool_crop_insurance_LabelSum")}</label>
          <input
            type="number"
            min={0}
            step={1000}
            inputMode="decimal"
            value={sumInsured}
            onChange={(e) => setSumInsured(Math.max(0, Number(e.target.value) || 0))}
          />
        </div>
        <div className="fy-field">
          <label>{t("Tool_crop_insurance_LabelSeason")}</label>
          <select
            value={season}
            onChange={(e) => {
              const s = e.target.value as CropSeason;
              setSeason(s);
              setRateOverride(CROP_PREMIUM_RATES[s]);
            }}
          >
            <option value="kharif">{t("Tool_crop_insurance_Season_Kharif")}</option>
            <option value="rabi">{t("Tool_crop_insurance_Season_Rabi")}</option>
            <option value="commercial">{t("Tool_crop_insurance_Season_Commercial")}</option>
          </select>
        </div>
        <div className="fy-field">
          <label>{t("Tool_crop_insurance_LabelRate")}</label>
          <input
            type="number"
            min={0}
            max={20}
            step={0.1}
            inputMode="decimal"
            value={rateOverride}
            onChange={(e) =>
              setRateOverride(e.target.value === "" ? "" : Math.max(0, Number(e.target.value) || 0))
            }
          />
          <p className="fy-field-hint">{t("Tool_crop_insurance_RateHint")}</p>
        </div>
        <button type="button" className="fy-btn-calc">
          {t("Common_Calculate")}
        </button>
      </div>

      <ResultSummaryCards cards={summaryCards} />
      <ScenarioCompare
        title={t("Tool_crop_insurance_ScenarioTitle")}
        subtitle={t("Tool_crop_insurance_ScenarioSubtitle")}
        scenarios={scenarios}
      />
      <WorkedExample
        title={t("Tool_crop_insurance_ExampleTitle")}
        subtitle={t("Tool_crop_insurance_ExampleSubtitle")}
        steps={exampleSteps}
      />
    </ToolPageShell>
  );
}
