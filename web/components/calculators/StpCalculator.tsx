"use client";

import { useMemo, useState } from "react";
import { useT } from "@/components/providers/I18nProvider";
import {
  BreakdownTable,
  FormulaCard,
  ResultSummaryCards,
  ScenarioCompare,
  ToolInfoPanel,
  ToolPageShell,
  WorkedExample,
} from "@/components/calculator/CalculatorUi";
import { calculateStp } from "@/lib/finance/stp";
import { inr, percent } from "@/lib/finance/format";
import { getTool } from "@/lib/config/tools";
import { stpInfo } from "@/lib/tool-page-content";

export function StpCalculator() {
  const t = useT();
  const tool = getTool("stp")!;

  const [debtCorpus, setDebtCorpus] = useState(500_000);
  const [monthlyTransfer, setMonthlyTransfer] = useState(10_000);
  const [months, setMonths] = useState(24);
  const [equityReturn, setEquityReturn] = useState(12);
  const [debtReturn, setDebtReturn] = useState(6);

  const breakdownColumns = useMemo(
    () => [
      { key: "year", header: t("Common_Year"), alignRight: false as const },
      { key: "transferred", header: t("Tool_stp_Col_Transferred") },
      { key: "equity", header: t("Tool_stp_Col_Equity") },
      { key: "debt", header: t("Tool_stp_Col_Debt") },
      { key: "total", header: t("Tool_stp_Col_Total") },
    ],
    [t],
  );

  const exampleSteps = useMemo(
    () => [
      t("Tool_stp_ExampleStep_1"),
      t("Tool_stp_ExampleStep_2"),
      t("Tool_stp_ExampleStep_3"),
      t("Tool_stp_ExampleStep_4"),
      t("Tool_stp_ExampleStep_5"),
    ],
    [t],
  );

  const { summaryCards, scenarios, breakdownRows } = useMemo(() => {
    const base = calculateStp({
      debtCorpus,
      monthlyTransfer,
      months,
      equityReturnPercent: equityReturn,
      debtReturnPercent: debtReturn,
    });
    const conservative = calculateStp({
      debtCorpus,
      monthlyTransfer,
      months,
      equityReturnPercent: Math.max(0, equityReturn - 3),
      debtReturnPercent: debtReturn,
    });
    const aggressive = calculateStp({
      debtCorpus,
      monthlyTransfer,
      months,
      equityReturnPercent: equityReturn + 3,
      debtReturnPercent: debtReturn,
    });

    return {
      summaryCards: [
        {
          label: t("Tool_stp_Result_Equity"),
          value: inr(base.equityValue),
          footnote: t("Tool_stp_Result_EquityFootnote", percent(equityReturn)),
          variant: "primary" as const,
        },
        {
          label: t("Tool_stp_Result_Debt"),
          value: inr(base.debtResidual),
          footnote: t("Tool_stp_Result_DebtFootnote", percent(debtReturn)),
          variant: "secure" as const,
        },
        {
          label: t("Tool_stp_Result_Total"),
          value: inr(base.totalValue),
          footnote: t("Tool_stp_Result_TotalFootnote", inr(base.totalTransferred), months),
          variant: "volatile" as const,
        },
      ],
      scenarios: [
        {
          name: t("Tool_stp_Scenario_Lower"),
          primaryLabel: t("Tool_stp_Result_Total"),
          primaryValue: inr(conservative.totalValue),
          secondaryLabel: t("Tool_stp_Result_Equity"),
          secondaryValue: inr(conservative.equityValue),
          variant: "worst",
        },
        {
          name: t("Common_Scenario_Base"),
          primaryLabel: t("Tool_stp_Result_Total"),
          primaryValue: inr(base.totalValue),
          secondaryLabel: t("Common_Label_Return"),
          secondaryValue: percent(equityReturn),
          variant: "base",
        },
        {
          name: t("Tool_stp_Scenario_Higher"),
          primaryLabel: t("Tool_stp_Result_Total"),
          primaryValue: inr(aggressive.totalValue),
          secondaryLabel: t("Tool_stp_Result_Equity"),
          secondaryValue: inr(aggressive.equityValue),
          variant: "best",
        },
      ],
      breakdownRows: base.yearly.map((r) => ({
        cells: {
          year: t("Common_YearN", r.year),
          transferred: inr(r.transferred),
          equity: inr(r.equityValue),
          debt: inr(r.debtValue),
          total: inr(r.totalValue),
        },
      })),
    };
  }, [debtCorpus, monthlyTransfer, months, equityReturn, debtReturn, t]);

  return (
    <ToolPageShell
      title={t(tool.titleKey)}
      subtitle={t("Tool_stp_Subtitle")}
      description={t(tool.descriptionKey)}
      icon={tool.icon}
      educate={
        <>
          <div className="fy-info-box">
            <strong>{t("Common_WhatYouLearn")}</strong>
            <p>{t("Tool_stp_LearnText")}</p>
          </div>
          <FormulaCard
            title={t("Common_Formula")}
            code={
              "each month:\n  debt *= (1+rd); equity *= (1+re)\n  move min(STP, debt) → equity"
            }
            note={t("Tool_stp_FormulaNote")}
          />
        </>
      }
      below={<ToolInfoPanel info={stpInfo(t)} />}
    >
      <div className="fy-form-card">
        <h3>{t("Common_YourInputs")}</h3>
        <div className="fy-field">
          <label>{t("Tool_stp_LabelDebt")}</label>
          <input
            type="number"
            min={0}
            step={10000}
            inputMode="decimal"
            value={debtCorpus}
            onChange={(e) => setDebtCorpus(Math.max(0, Number(e.target.value) || 0))}
          />
        </div>
        <div className="fy-field">
          <label>{t("Tool_stp_LabelTransfer")}</label>
          <input
            type="number"
            min={0}
            step={500}
            inputMode="decimal"
            value={monthlyTransfer}
            onChange={(e) => setMonthlyTransfer(Math.max(0, Number(e.target.value) || 0))}
          />
        </div>
        <div className="fy-field">
          <label>{t("Tool_stp_LabelMonths")}</label>
          <input
            type="number"
            min={1}
            max={120}
            step={1}
            inputMode="numeric"
            value={months}
            onChange={(e) => setMonths(Math.max(1, Number(e.target.value) || 1))}
          />
        </div>
        <div className="fy-field">
          <label>{t("Tool_stp_LabelEquityReturn")}</label>
          <input
            type="number"
            min={0}
            step={0.5}
            inputMode="decimal"
            value={equityReturn}
            onChange={(e) => setEquityReturn(Math.max(0, Number(e.target.value) || 0))}
          />
        </div>
        <div className="fy-field">
          <label>{t("Tool_stp_LabelDebtReturn")}</label>
          <input
            type="number"
            min={0}
            step={0.5}
            inputMode="decimal"
            value={debtReturn}
            onChange={(e) => setDebtReturn(Math.max(0, Number(e.target.value) || 0))}
          />
        </div>
        <button type="button" className="fy-btn-calc">
          {t("Common_Calculate")}
        </button>
      </div>

      <ResultSummaryCards cards={summaryCards} />
      <ScenarioCompare
        title={t("Tool_stp_ScenarioTitle")}
        subtitle={t("Tool_stp_ScenarioSubtitle")}
        scenarios={scenarios}
      />
      <BreakdownTable
        title={t("Tool_stp_BreakdownTitle")}
        columns={breakdownColumns}
        rows={breakdownRows}
      />
      <WorkedExample
        title={t("Tool_stp_ExampleTitle")}
        subtitle={t("Tool_stp_ExampleSubtitle")}
        steps={exampleSteps}
      />
    </ToolPageShell>
  );
}
