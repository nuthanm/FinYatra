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
import { calculateXirr, type XirrCashflow } from "@/lib/finance/xirr";
import { inr, percent } from "@/lib/finance/format";
import { getTool } from "@/lib/config/tools";
import { xirrInfo } from "@/lib/tool-page-content";

type Row = { date: string; amount: number };

const DEFAULT_ROWS: Row[] = [
  { date: "2023-01-01", amount: -100_000 },
  { date: "2023-07-01", amount: -50_000 },
  { date: "2024-01-01", amount: -50_000 },
  { date: "2025-01-01", amount: 0 },
  { date: "2026-01-01", amount: 0 },
];

export function XirrCalculator() {
  const t = useT();
  const tool = getTool("xirr")!;

  const [rows, setRows] = useState<Row[]>(DEFAULT_ROWS);
  const [finalValue, setFinalValue] = useState(280_000);
  const [finalDate, setFinalDate] = useState("2026-01-01");
  const [rowCount, setRowCount] = useState(3);

  const exampleSteps = useMemo(
    () => [
      t("Tool_xirr_ExampleStep_1"),
      t("Tool_xirr_ExampleStep_2"),
      t("Tool_xirr_ExampleStep_3"),
      t("Tool_xirr_ExampleStep_4"),
      t("Tool_xirr_ExampleStep_5"),
    ],
    [t],
  );

  const updateRow = (index: number, patch: Partial<Row>) => {
    setRows((prev) => prev.map((r, i) => (i === index ? { ...r, ...patch } : r)));
  };

  const { summaryCards, scenarios, result } = useMemo(() => {
    const investments = rows.slice(0, rowCount).filter((r) => r.amount !== 0);
    const cashflows: XirrCashflow[] = [
      ...investments,
      { date: finalDate, amount: Math.max(0, finalValue) },
    ];
    const result = calculateXirr(cashflows);
    const higherFv = calculateXirr([
      ...investments,
      { date: finalDate, amount: Math.max(0, finalValue) * 1.2 },
    ]);
    const lowerFv = calculateXirr([
      ...investments,
      { date: finalDate, amount: Math.max(0, finalValue) * 0.85 },
    ]);

    const rateLabel = result.rate !== null ? percent(result.rate * 100) : t("Tool_xirr_Result_NoRate");

    return {
      result,
      summaryCards: [
        {
          label: t("Tool_xirr_Result_Xirr"),
          value: rateLabel,
          footnote: result.converged
            ? t("Tool_xirr_Result_XirrFootnote")
            : t("Tool_xirr_Result_NoRateFootnote"),
          variant: "primary" as const,
        },
        {
          label: t("Tool_xirr_Result_Invested"),
          value: inr(result.totalInvested),
          footnote: t("Tool_xirr_Result_InvestedFootnote", String(result.cashflowCount)),
        },
        {
          label: t("Tool_xirr_Result_Profit"),
          value: inr(result.profit),
          footnote: t("Tool_xirr_Result_ProfitFootnote", inr(result.finalValue)),
          variant: result.profit >= 0 ? ("secure" as const) : ("volatile" as const),
        },
      ],
      scenarios: [
        {
          name: t("Tool_xirr_Scenario_Lower"),
          primaryLabel: t("Tool_xirr_Result_Xirr"),
          primaryValue: lowerFv.rate !== null ? percent(lowerFv.rate * 100) : "—",
          secondaryLabel: t("Tool_xirr_Result_Profit"),
          secondaryValue: inr(lowerFv.profit),
          variant: "worst",
        },
        {
          name: t("Common_Scenario_Base"),
          primaryLabel: t("Tool_xirr_Result_Xirr"),
          primaryValue: rateLabel,
          secondaryLabel: t("Tool_xirr_Result_Profit"),
          secondaryValue: inr(result.profit),
          variant: "base",
        },
        {
          name: t("Tool_xirr_Scenario_Higher"),
          primaryLabel: t("Tool_xirr_Result_Xirr"),
          primaryValue: higherFv.rate !== null ? percent(higherFv.rate * 100) : "—",
          secondaryLabel: t("Tool_xirr_Result_Profit"),
          secondaryValue: inr(higherFv.profit),
          variant: "best",
        },
      ],
    };
  }, [rows, rowCount, finalValue, finalDate, t]);

  return (
    <ToolPageShell
      title={t(tool.titleKey)}
      subtitle={t("Tool_xirr_Subtitle")}
      description={t(tool.descriptionKey)}
      icon={tool.icon}
      educate={
        <>
          <div className="fy-info-box">
            <strong>{t("Common_WhatYouLearn")}</strong>
            <p>{t("Tool_xirr_LearnText")}</p>
          </div>
          <FormulaCard
            title={t("Common_Formula")}
            code={"Σ CFᵢ / (1 + XIRR)^(daysᵢ/365) = 0\n(Newton–Raphson)"}
            note={t("Tool_xirr_FormulaNote")}
          />
        </>
      }
      below={<ToolInfoPanel info={xirrInfo(t)} />}
    >
      <div className="fy-form-card">
        <h3>{t("Common_YourInputs")}</h3>
        <div className="fy-field">
          <label>{t("Tool_xirr_LabelCount")}</label>
          <select value={rowCount} onChange={(e) => setRowCount(Number(e.target.value))}>
            <option value={3}>3</option>
            <option value={4}>4</option>
            <option value={5}>5</option>
          </select>
          <p className="fy-field-hint">{t("Tool_xirr_CountHint")}</p>
        </div>
        {rows.slice(0, rowCount).map((row, i) => (
          <div key={i} className="fy-field">
            <label>{t("Tool_xirr_LabelCashflow", String(i + 1))}</label>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem" }}>
              <input
                type="date"
                value={row.date}
                onChange={(e) => updateRow(i, { date: e.target.value })}
              />
              <input
                type="number"
                step={1000}
                inputMode="decimal"
                value={row.amount}
                onChange={(e) => updateRow(i, { amount: Number(e.target.value) || 0 })}
                placeholder={t("Tool_xirr_AmountHint")}
              />
            </div>
          </div>
        ))}
        <div className="fy-field">
          <label>{t("Tool_xirr_LabelFinalDate")}</label>
          <input type="date" value={finalDate} onChange={(e) => setFinalDate(e.target.value)} />
        </div>
        <div className="fy-field">
          <label>{t("Tool_xirr_LabelFinalValue")}</label>
          <input
            type="number"
            min={0}
            step={1000}
            inputMode="decimal"
            value={finalValue}
            onChange={(e) => setFinalValue(Math.max(0, Number(e.target.value) || 0))}
          />
          <p className="fy-field-hint">{t("Tool_xirr_FinalHint")}</p>
        </div>
        <button type="button" className="fy-btn-calc">
          {t("Common_Calculate")}
        </button>
      </div>

      <div className="fy-info-box">
        <strong>{t("Tool_xirr_VerdictTitle")}</strong>
        <p>
          {result.rate !== null
            ? t("Tool_xirr_VerdictNote", percent(result.rate * 100), inr(result.profit))
            : t("Tool_xirr_VerdictFail")}
        </p>
      </div>

      <ResultSummaryCards cards={summaryCards} />
      <ScenarioCompare
        title={t("Tool_xirr_ScenarioTitle")}
        subtitle={t("Tool_xirr_ScenarioSubtitle")}
        scenarios={scenarios}
      />
      <WorkedExample
        title={t("Tool_xirr_ExampleTitle")}
        subtitle={t("Tool_xirr_ExampleSubtitle")}
        steps={exampleSteps}
      />
    </ToolPageShell>
  );
}
