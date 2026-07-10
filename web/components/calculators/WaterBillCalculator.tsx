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
import { calculateWaterBill } from "@/lib/finance/waterBill";
import { inr } from "@/lib/finance/format";
import { getTool } from "@/lib/config/tools";
import { waterBillInfo } from "@/lib/tool-page-content";

export function WaterBillCalculator() {
  const t = useT();
  const tool = getTool("water-bill")!;

  const [kl, setKl] = useState(20);
  const [rate1, setRate1] = useState(8);
  const [rate2, setRate2] = useState(15);
  const [rate3, setRate3] = useState(25);
  const [slab1, setSlab1] = useState(10);
  const [slab2, setSlab2] = useState(25);
  const [fixedCharge, setFixedCharge] = useState(100);

  const exampleSteps = useMemo(
    () => [
      t("Tool_water_bill_ExampleStep_1"),
      t("Tool_water_bill_ExampleStep_2"),
      t("Tool_water_bill_ExampleStep_3"),
      t("Tool_water_bill_ExampleStep_4"),
      t("Tool_water_bill_ExampleStep_5"),
    ],
    [t],
  );

  const { summaryCards, scenarios, result } = useMemo(() => {
    const slabs = [
      { upTo: Math.max(0.1, slab1), ratePerKl: Math.max(0, rate1) },
      { upTo: Math.max(slab1 + 0.1, slab2), ratePerKl: Math.max(0, rate2) },
      { upTo: Infinity, ratePerKl: Math.max(0, rate3) },
    ];
    const result = calculateWaterBill({ kl, slabs, fixedCharge });
    const low = calculateWaterBill({ kl: Math.max(0, kl * 0.6), slabs, fixedCharge });
    const high = calculateWaterBill({ kl: kl * 1.4, slabs, fixedCharge });

    return {
      result,
      summaryCards: [
        {
          label: t("Tool_water_bill_Result_Total"),
          value: inr(result.totalBill),
          footnote: t("Tool_water_bill_Result_TotalFootnote", String(result.kl)),
          variant: "primary" as const,
        },
        {
          label: t("Tool_water_bill_Result_Usage"),
          value: inr(result.usageCharge),
          footnote: t("Tool_water_bill_Result_UsageFootnote"),
        },
        {
          label: t("Tool_water_bill_Result_Fixed"),
          value: inr(result.fixedCharge),
          footnote: t("Tool_water_bill_Result_FixedFootnote"),
        },
      ],
      scenarios: [
        {
          name: t("Tool_water_bill_Scenario_Low"),
          primaryLabel: t("Tool_water_bill_Result_Total"),
          primaryValue: inr(low.totalBill),
          secondaryLabel: t("Tool_water_bill_LabelKl"),
          secondaryValue: String(low.kl),
          variant: "best",
        },
        {
          name: t("Common_Scenario_Base"),
          primaryLabel: t("Tool_water_bill_Result_Total"),
          primaryValue: inr(result.totalBill),
          secondaryLabel: t("Tool_water_bill_Result_Usage"),
          secondaryValue: inr(result.usageCharge),
          variant: "base",
        },
        {
          name: t("Tool_water_bill_Scenario_High"),
          primaryLabel: t("Tool_water_bill_Result_Total"),
          primaryValue: inr(high.totalBill),
          secondaryLabel: t("Tool_water_bill_LabelKl"),
          secondaryValue: String(high.kl),
          variant: "worst",
        },
      ],
    };
  }, [kl, rate1, rate2, rate3, slab1, slab2, fixedCharge, t]);

  return (
    <ToolPageShell
      title={t(tool.titleKey)}
      subtitle={t("Tool_water_bill_Subtitle")}
      description={t(tool.descriptionKey)}
      icon={tool.icon}
      educate={
        <>
          <div className="fy-info-box">
            <strong>{t("Common_WhatYouLearn")}</strong>
            <p>{t("Tool_water_bill_LearnText")}</p>
          </div>
          <FormulaCard
            title={t("Common_Formula")}
            code={"Bill = Σ (kl in slab × rate) + fixed\nDefault: 0–10 · 11–25 · 26+ kl"}
            note={t("Tool_water_bill_FormulaNote")}
          />
        </>
      }
      below={<ToolInfoPanel info={waterBillInfo(t)} />}
    >
      <div className="fy-form-card">
        <h3>{t("Common_YourInputs")}</h3>
        <div className="fy-field">
          <label>{t("Tool_water_bill_LabelKl")}</label>
          <input
            type="number"
            min={0}
            step={1}
            inputMode="decimal"
            value={kl}
            onChange={(e) => setKl(Math.max(0, Number(e.target.value) || 0))}
          />
          <p className="fy-field-hint">{t("Tool_water_bill_KlHint")}</p>
        </div>
        <div className="fy-field">
          <label>{t("Tool_water_bill_LabelSlab1")}</label>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem" }}>
            <input
              type="number"
              min={0.1}
              step={1}
              value={slab1}
              onChange={(e) => setSlab1(Math.max(0.1, Number(e.target.value) || 0.1))}
            />
            <input
              type="number"
              min={0}
              step={0.5}
              value={rate1}
              onChange={(e) => setRate1(Math.max(0, Number(e.target.value) || 0))}
            />
          </div>
          <p className="fy-field-hint">{t("Tool_water_bill_Slab1Hint")}</p>
        </div>
        <div className="fy-field">
          <label>{t("Tool_water_bill_LabelSlab2")}</label>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem" }}>
            <input
              type="number"
              min={0.1}
              step={1}
              value={slab2}
              onChange={(e) => setSlab2(Math.max(0.1, Number(e.target.value) || 0.1))}
            />
            <input
              type="number"
              min={0}
              step={0.5}
              value={rate2}
              onChange={(e) => setRate2(Math.max(0, Number(e.target.value) || 0))}
            />
          </div>
          <p className="fy-field-hint">{t("Tool_water_bill_Slab2Hint")}</p>
        </div>
        <div className="fy-field">
          <label>{t("Tool_water_bill_LabelSlab3")}</label>
          <input
            type="number"
            min={0}
            step={0.5}
            inputMode="decimal"
            value={rate3}
            onChange={(e) => setRate3(Math.max(0, Number(e.target.value) || 0))}
          />
          <p className="fy-field-hint">{t("Tool_water_bill_Slab3Hint")}</p>
        </div>
        <div className="fy-field">
          <label>{t("Tool_water_bill_LabelFixed")}</label>
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
        <strong>{t("Tool_water_bill_VerdictTitle")}</strong>
        <p>
          {t(
            "Tool_water_bill_VerdictNote",
            inr(result.totalBill),
            String(result.breakdown.length),
          )}
        </p>
        {result.breakdown.length > 0 && (
          <ul style={{ marginTop: "0.5rem", paddingLeft: "1.25rem" }}>
            {result.breakdown.map((b, i) => (
              <li key={i}>
                {t(
                  "Tool_water_bill_BreakdownRow",
                  String(b.fromKl),
                  String(b.toKl),
                  inr(b.amount),
                )}
              </li>
            ))}
          </ul>
        )}
      </div>

      <ResultSummaryCards cards={summaryCards} />
      <ScenarioCompare
        title={t("Tool_water_bill_ScenarioTitle")}
        subtitle={t("Tool_water_bill_ScenarioSubtitle")}
        scenarios={scenarios}
      />
      <WorkedExample
        title={t("Tool_water_bill_ExampleTitle")}
        subtitle={t("Tool_water_bill_ExampleSubtitle")}
        steps={exampleSteps}
      />
    </ToolPageShell>
  );
}
