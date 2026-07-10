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
import { calculateElectricVehicle } from "@/lib/finance/electricVehicle";
import { inr } from "@/lib/finance/format";
import { getTool } from "@/lib/config/tools";
import { electricVehicleInfo } from "@/lib/tool-page-content";

export function ElectricVehicleCalculator() {
  const t = useT();
  const tool = getTool("electric-vehicle")!;

  const [icePerKm, setIcePerKm] = useState(6);
  const [evPerKm, setEvPerKm] = useState(1.5);
  const [kmPerMonth, setKmPerMonth] = useState(1000);
  const [years, setYears] = useState(5);
  const [priceDelta, setPriceDelta] = useState(2_00_000);

  const exampleSteps = useMemo(
    () => [
      t("Tool_electric_vehicle_ExampleStep_1"),
      t("Tool_electric_vehicle_ExampleStep_2"),
      t("Tool_electric_vehicle_ExampleStep_3"),
      t("Tool_electric_vehicle_ExampleStep_4"),
      t("Tool_electric_vehicle_ExampleStep_5"),
    ],
    [t],
  );

  const { summaryCards, scenarios } = useMemo(() => {
    const base = calculateElectricVehicle({
      iceCostPerKm: icePerKm,
      evCostPerKm: evPerKm,
      kmPerMonth,
      years,
      purchasePriceDelta: priceDelta,
    });
    const lowKm = calculateElectricVehicle({
      iceCostPerKm: icePerKm,
      evCostPerKm: evPerKm,
      kmPerMonth: Math.max(0, kmPerMonth * 0.5),
      years,
      purchasePriceDelta: priceDelta,
    });
    const highKm = calculateElectricVehicle({
      iceCostPerKm: icePerKm,
      evCostPerKm: evPerKm,
      kmPerMonth: kmPerMonth * 1.5,
      years,
      purchasePriceDelta: priceDelta,
    });

    return {
      summaryCards: [
        {
          label: t("Tool_electric_vehicle_Result_Ice"),
          value: inr(base.iceTotalCost),
          footnote: t("Tool_electric_vehicle_Result_IceFootnote", years),
        },
        {
          label: t("Tool_electric_vehicle_Result_Ev"),
          value: inr(base.evTotalCost),
          footnote: t("Tool_electric_vehicle_Result_EvFootnote", years),
          variant: "primary" as const,
        },
        {
          label: t("Tool_electric_vehicle_Result_Savings"),
          value: inr(base.runningSavings),
          footnote: t("Tool_electric_vehicle_Result_SavingsFootnote"),
          variant: "secure" as const,
        },
        {
          label: t("Tool_electric_vehicle_Result_Payback"),
          value:
            base.paybackYears != null
              ? t("Tool_electric_vehicle_Result_PaybackValue", base.paybackYears.toFixed(1))
              : t("Tool_electric_vehicle_Result_PaybackNa"),
          footnote: t("Tool_electric_vehicle_Result_PaybackFootnote", inr(priceDelta)),
        },
      ],
      scenarios: [
        {
          name: t("Tool_electric_vehicle_Scenario_LowKm"),
          primaryLabel: t("Tool_electric_vehicle_Result_Savings"),
          primaryValue: inr(lowKm.runningSavings),
          secondaryLabel: t("Tool_electric_vehicle_LabelKm"),
          secondaryValue: String(Math.round(kmPerMonth * 0.5)),
          variant: "worst" as const,
        },
        {
          name: t("Common_Scenario_Base"),
          primaryLabel: t("Tool_electric_vehicle_Result_Savings"),
          primaryValue: inr(base.runningSavings),
          secondaryLabel: t("Tool_electric_vehicle_LabelKm"),
          secondaryValue: String(kmPerMonth),
          variant: "base" as const,
        },
        {
          name: t("Tool_electric_vehicle_Scenario_HighKm"),
          primaryLabel: t("Tool_electric_vehicle_Result_Savings"),
          primaryValue: inr(highKm.runningSavings),
          secondaryLabel: t("Tool_electric_vehicle_LabelKm"),
          secondaryValue: String(Math.round(kmPerMonth * 1.5)),
          variant: "best" as const,
        },
      ],
    };
  }, [icePerKm, evPerKm, kmPerMonth, years, priceDelta, t]);

  return (
    <ToolPageShell
      title={t(tool.titleKey)}
      subtitle={t("Tool_electric_vehicle_Subtitle")}
      description={t(tool.descriptionKey)}
      icon={tool.icon}
      educate={
        <>
          <div className="fy-info-box">
            <strong>{t("Common_WhatYouLearn")}</strong>
            <p>{t("Tool_electric_vehicle_LearnText")}</p>
          </div>
          <FormulaCard
            title={t("Common_Formula")}
            code={
              "totalKm = km/month × 12 × years\ncost = ₹/km × totalKm\npayback = Δprice / annual running save"
            }
            note={t("Tool_electric_vehicle_FormulaNote")}
          />
        </>
      }
      below={<ToolInfoPanel info={electricVehicleInfo(t)} />}
    >
      <div className="fy-form-card">
        <h3>{t("Common_YourInputs")}</h3>
        <div className="fy-field">
          <label>{t("Tool_electric_vehicle_LabelIce")}</label>
          <input
            type="number"
            min={0}
            step={0.1}
            inputMode="decimal"
            value={icePerKm}
            onChange={(e) => setIcePerKm(Math.max(0, Number(e.target.value) || 0))}
          />
          <p className="fy-field-hint">{t("Tool_electric_vehicle_IceHint")}</p>
        </div>
        <div className="fy-field">
          <label>{t("Tool_electric_vehicle_LabelEv")}</label>
          <input
            type="number"
            min={0}
            step={0.1}
            inputMode="decimal"
            value={evPerKm}
            onChange={(e) => setEvPerKm(Math.max(0, Number(e.target.value) || 0))}
          />
          <p className="fy-field-hint">{t("Tool_electric_vehicle_EvHint")}</p>
        </div>
        <div className="fy-field">
          <label>{t("Tool_electric_vehicle_LabelKm")}</label>
          <input
            type="number"
            min={0}
            step={50}
            inputMode="decimal"
            value={kmPerMonth}
            onChange={(e) => setKmPerMonth(Math.max(0, Number(e.target.value) || 0))}
          />
        </div>
        <div className="fy-field">
          <label>{t("Common_Label_TenureYears")}</label>
          <input
            type="number"
            min={1}
            max={20}
            step={1}
            inputMode="numeric"
            value={years}
            onChange={(e) => setYears(Math.max(1, Number(e.target.value) || 1))}
          />
        </div>
        <div className="fy-field">
          <label>{t("Tool_electric_vehicle_LabelDelta")}</label>
          <input
            type="number"
            min={0}
            step={10000}
            inputMode="decimal"
            value={priceDelta}
            onChange={(e) => setPriceDelta(Math.max(0, Number(e.target.value) || 0))}
          />
          <p className="fy-field-hint">{t("Tool_electric_vehicle_DeltaHint")}</p>
        </div>
        <button type="button" className="fy-btn-calc">
          {t("Common_Calculate")}
        </button>
      </div>

      <ResultSummaryCards cards={summaryCards} />
      <ScenarioCompare
        title={t("Tool_electric_vehicle_ScenarioTitle")}
        subtitle={t("Tool_electric_vehicle_ScenarioSubtitle")}
        scenarios={scenarios}
      />
      <WorkedExample
        title={t("Tool_electric_vehicle_ExampleTitle")}
        subtitle={t("Tool_electric_vehicle_ExampleSubtitle")}
        steps={exampleSteps}
      />
    </ToolPageShell>
  );
}
