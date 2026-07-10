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
  calculateElectricityBill,
} from "@/lib/finance/electricityBill";
import { inr } from "@/lib/finance/format";
import { getTool } from "@/lib/config/tools";
import { electricityBillInfo } from "@/lib/tool-page-content";

export function ElectricityBillCalculator() {
  const t = useT();
  const tool = getTool("electricity-bill")!;

  const [units, setUnits] = useState(250);
  const [rate1, setRate1] = useState(3.5);
  const [rate2, setRate2] = useState(5.5);
  const [rate3, setRate3] = useState(7.5);
  const [slab1, setSlab1] = useState(100);
  const [slab2, setSlab2] = useState(300);
  const [fixedCharge, setFixedCharge] = useState(50);

  const exampleSteps = useMemo(
    () => [
      t("Tool_electricity_bill_ExampleStep_1"),
      t("Tool_electricity_bill_ExampleStep_2"),
      t("Tool_electricity_bill_ExampleStep_3"),
      t("Tool_electricity_bill_ExampleStep_4"),
      t("Tool_electricity_bill_ExampleStep_5"),
    ],
    [t],
  );

  const { summaryCards, scenarios, result } = useMemo(() => {
    const slabs = [
      { upTo: Math.max(1, slab1), ratePerUnit: Math.max(0, rate1) },
      { upTo: Math.max(slab1 + 1, slab2), ratePerUnit: Math.max(0, rate2) },
      { upTo: Infinity, ratePerUnit: Math.max(0, rate3) },
    ];
    const result = calculateElectricityBill({ units, slabs, fixedCharge });
    const low = calculateElectricityBill({ units: Math.max(0, units * 0.6), slabs, fixedCharge });
    const high = calculateElectricityBill({ units: units * 1.4, slabs, fixedCharge });

    return {
      result,
      summaryCards: [
        {
          label: t("Tool_electricity_bill_Result_Total"),
          value: inr(result.totalBill),
          footnote: t("Tool_electricity_bill_Result_TotalFootnote", String(result.units)),
          variant: "primary" as const,
        },
        {
          label: t("Tool_electricity_bill_Result_Energy"),
          value: inr(result.energyCharge),
          footnote: t("Tool_electricity_bill_Result_EnergyFootnote"),
        },
        {
          label: t("Tool_electricity_bill_Result_Fixed"),
          value: inr(result.fixedCharge),
          footnote: t("Tool_electricity_bill_Result_FixedFootnote"),
        },
      ],
      scenarios: [
        {
          name: t("Tool_electricity_bill_Scenario_Low"),
          primaryLabel: t("Tool_electricity_bill_Result_Total"),
          primaryValue: inr(low.totalBill),
          secondaryLabel: t("Tool_electricity_bill_LabelUnits"),
          secondaryValue: String(low.units),
          variant: "best",
        },
        {
          name: t("Common_Scenario_Base"),
          primaryLabel: t("Tool_electricity_bill_Result_Total"),
          primaryValue: inr(result.totalBill),
          secondaryLabel: t("Tool_electricity_bill_Result_Energy"),
          secondaryValue: inr(result.energyCharge),
          variant: "base",
        },
        {
          name: t("Tool_electricity_bill_Scenario_High"),
          primaryLabel: t("Tool_electricity_bill_Result_Total"),
          primaryValue: inr(high.totalBill),
          secondaryLabel: t("Tool_electricity_bill_LabelUnits"),
          secondaryValue: String(high.units),
          variant: "worst",
        },
      ],
    };
  }, [units, rate1, rate2, rate3, slab1, slab2, fixedCharge, t]);

  return (
    <ToolPageShell
      title={t(tool.titleKey)}
      subtitle={t("Tool_electricity_bill_Subtitle")}
      description={t(tool.descriptionKey)}
      icon={tool.icon}
      educate={
        <>
          <div className="fy-info-box">
            <strong>{t("Common_WhatYouLearn")}</strong>
            <p>{t("Tool_electricity_bill_LearnText")}</p>
          </div>
          <FormulaCard
            title={t("Common_Formula")}
            code={"Bill = Σ (units in slab × rate) + fixed\nDefault: 0–100 · 101–300 · 301+"}
            note={t("Tool_electricity_bill_FormulaNote")}
          />
        </>
      }
      below={<ToolInfoPanel info={electricityBillInfo(t)} />}
    >
      <div className="fy-form-card">
        <h3>{t("Common_YourInputs")}</h3>
        <div className="fy-field">
          <label>{t("Tool_electricity_bill_LabelUnits")}</label>
          <input
            type="number"
            min={0}
            step={10}
            inputMode="decimal"
            value={units}
            onChange={(e) => setUnits(Math.max(0, Number(e.target.value) || 0))}
          />
        </div>
        <div className="fy-field">
          <label>{t("Tool_electricity_bill_LabelSlab1")}</label>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem" }}>
            <input
              type="number"
              min={1}
              step={10}
              value={slab1}
              onChange={(e) => setSlab1(Math.max(1, Number(e.target.value) || 1))}
              title={t("Tool_electricity_bill_UpToHint")}
            />
            <input
              type="number"
              min={0}
              step={0.1}
              value={rate1}
              onChange={(e) => setRate1(Math.max(0, Number(e.target.value) || 0))}
              title={t("Tool_electricity_bill_RateHint")}
            />
          </div>
          <p className="fy-field-hint">{t("Tool_electricity_bill_Slab1Hint")}</p>
        </div>
        <div className="fy-field">
          <label>{t("Tool_electricity_bill_LabelSlab2")}</label>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem" }}>
            <input
              type="number"
              min={1}
              step={10}
              value={slab2}
              onChange={(e) => setSlab2(Math.max(1, Number(e.target.value) || 1))}
            />
            <input
              type="number"
              min={0}
              step={0.1}
              value={rate2}
              onChange={(e) => setRate2(Math.max(0, Number(e.target.value) || 0))}
            />
          </div>
          <p className="fy-field-hint">{t("Tool_electricity_bill_Slab2Hint")}</p>
        </div>
        <div className="fy-field">
          <label>{t("Tool_electricity_bill_LabelSlab3")}</label>
          <input
            type="number"
            min={0}
            step={0.1}
            inputMode="decimal"
            value={rate3}
            onChange={(e) => setRate3(Math.max(0, Number(e.target.value) || 0))}
          />
          <p className="fy-field-hint">{t("Tool_electricity_bill_Slab3Hint")}</p>
        </div>
        <div className="fy-field">
          <label>{t("Tool_electricity_bill_LabelFixed")}</label>
          <input
            type="number"
            min={0}
            step={10}
            inputMode="decimal"
            value={fixedCharge}
            onChange={(e) => setFixedCharge(Math.max(0, Number(e.target.value) || 0))}
          />
        </div>
        <button type="button" className="fy-btn-calc">
          {t("Common_Calculate")}
        </button>
      </div>

      <div className="fy-info-box">
        <strong>{t("Tool_electricity_bill_VerdictTitle")}</strong>
        <p>
          {t(
            "Tool_electricity_bill_VerdictNote",
            inr(result.totalBill),
            String(result.breakdown.length),
          )}
        </p>
        {result.breakdown.length > 0 && (
          <ul style={{ marginTop: "0.5rem", paddingLeft: "1.25rem" }}>
            {result.breakdown.map((b, i) => (
              <li key={i}>
                {t(
                  "Tool_electricity_bill_BreakdownRow",
                  String(b.fromUnit),
                  String(b.toUnit),
                  inr(b.amount),
                )}
              </li>
            ))}
          </ul>
        )}
      </div>

      <ResultSummaryCards cards={summaryCards} />
      <ScenarioCompare
        title={t("Tool_electricity_bill_ScenarioTitle")}
        subtitle={t("Tool_electricity_bill_ScenarioSubtitle")}
        scenarios={scenarios}
      />
      <WorkedExample
        title={t("Tool_electricity_bill_ExampleTitle")}
        subtitle={t("Tool_electricity_bill_ExampleSubtitle")}
        steps={exampleSteps}
      />
    </ToolPageShell>
  );
}
