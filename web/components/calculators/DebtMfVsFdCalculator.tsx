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
import { calculateDebtMfVsFd } from "@/lib/finance/debtMfVsFd";
import { inr, percent } from "@/lib/finance/format";
import { getTool } from "@/lib/config/tools";
import { debtMfVsFdInfo } from "@/lib/tool-page-content";

export function DebtMfVsFdCalculator() {
  const t = useT();
  const tool = getTool("debt-mf-vs-fd")!;

  const [investment, setInvestment] = useState(5_00_000);
  const [years, setYears] = useState(5);
  const [debtRate, setDebtRate] = useState(7.5);
  const [fdRate, setFdRate] = useState(7);
  const [slab, setSlab] = useState(30);

  const exampleSteps = useMemo(
    () => [
      t("Tool_debt_mf_vs_fd_ExampleStep_1"),
      t("Tool_debt_mf_vs_fd_ExampleStep_2"),
      t("Tool_debt_mf_vs_fd_ExampleStep_3"),
      t("Tool_debt_mf_vs_fd_ExampleStep_4"),
      t("Tool_debt_mf_vs_fd_ExampleStep_5"),
    ],
    [t],
  );

  const { summaryCards, scenarios } = useMemo(() => {
    const result = calculateDebtMfVsFd({
      investment,
      years,
      debtMfRatePercent: debtRate,
      fdRatePercent: fdRate,
      taxSlabPercent: slab,
    });
    const lowerSlab = calculateDebtMfVsFd({
      investment,
      years,
      debtMfRatePercent: debtRate,
      fdRatePercent: fdRate,
      taxSlabPercent: Math.max(0, slab - 10),
    });
    const higherDebt = calculateDebtMfVsFd({
      investment,
      years,
      debtMfRatePercent: debtRate + 1,
      fdRatePercent: fdRate,
      taxSlabPercent: slab,
    });

    return {
      summaryCards: [
        {
          label: t("Tool_debt_mf_vs_fd_Result_DebtNet"),
          value: inr(result.debtMfNet),
          footnote: t("Tool_debt_mf_vs_fd_Result_DebtNetFootnote", inr(result.debtMfTax)),
          variant: "primary" as const,
        },
        {
          label: t("Tool_debt_mf_vs_fd_Result_FdNet"),
          value: inr(result.fdNet),
          footnote: t("Tool_debt_mf_vs_fd_Result_FdNetFootnote", inr(result.fdTax)),
        },
        {
          label: t("Tool_debt_mf_vs_fd_Result_Advantage"),
          value: inr(result.advantage),
          footnote: t(
            "Tool_debt_mf_vs_fd_Result_AdvantageFootnote",
            result.winner === "debt_mf"
              ? t("Tool_debt_mf_vs_fd_Winner_Debt")
              : result.winner === "fd"
                ? t("Tool_debt_mf_vs_fd_Winner_Fd")
                : t("Tool_debt_mf_vs_fd_Winner_Tie"),
          ),
          variant: "volatile" as const,
        },
      ],
      scenarios: [
        {
          name: t("Tool_debt_mf_vs_fd_Scenario_LowerSlab"),
          primaryLabel: t("Tool_debt_mf_vs_fd_Result_Advantage"),
          primaryValue: inr(lowerSlab.advantage),
          secondaryLabel: t("Tool_debt_mf_vs_fd_Result_DebtNet"),
          secondaryValue: inr(lowerSlab.debtMfNet),
          variant: "worst" as const,
        },
        {
          name: t("Common_Scenario_Base"),
          primaryLabel: t("Tool_debt_mf_vs_fd_Result_Advantage"),
          primaryValue: inr(result.advantage),
          secondaryLabel: t("Tool_debt_mf_vs_fd_Result_FdNet"),
          secondaryValue: inr(result.fdNet),
          variant: "base" as const,
        },
        {
          name: t("Tool_debt_mf_vs_fd_Scenario_HigherDebt"),
          primaryLabel: t("Tool_debt_mf_vs_fd_Result_Advantage"),
          primaryValue: inr(higherDebt.advantage),
          secondaryLabel: t("Tool_debt_mf_vs_fd_Result_DebtNet"),
          secondaryValue: inr(higherDebt.debtMfNet),
          variant: "best" as const,
        },
      ],
    };
  }, [investment, years, debtRate, fdRate, slab, t]);

  return (
    <ToolPageShell
      title={t(tool.titleKey)}
      subtitle={t("Tool_debt_mf_vs_fd_Subtitle")}
      description={t(tool.descriptionKey)}
      icon={tool.icon}
      educate={
        <>
          <div className="fy-info-box">
            <strong>{t("Common_WhatYouLearn")}</strong>
            <p>{t("Tool_debt_mf_vs_fd_LearnText")}</p>
          </div>
          <FormulaCard
            title={t("Common_Formula")}
            code={
              "FV = P × (1+r)^n\nTax ≈ gain × slab%\nCompare post-tax nets"
            }
            note={t("Tool_debt_mf_vs_fd_FormulaNote")}
          />
        </>
      }
      below={<ToolInfoPanel info={debtMfVsFdInfo(t)} />}
    >
      <div className="fy-form-card">
        <h3>{t("Common_YourInputs")}</h3>
        <div className="fy-field">
          <label>{t("Tool_debt_mf_vs_fd_LabelInvestment")}</label>
          <input
            type="number"
            min={0}
            step={10000}
            inputMode="decimal"
            value={investment}
            onChange={(e) => setInvestment(Math.max(0, Number(e.target.value) || 0))}
          />
        </div>
        <div className="fy-field">
          <label>{t("Tool_debt_mf_vs_fd_LabelYears")}</label>
          <input
            type="number"
            min={1}
            max={40}
            step={1}
            inputMode="numeric"
            value={years}
            onChange={(e) => setYears(Math.max(1, Number(e.target.value) || 1))}
          />
        </div>
        <div className="fy-field">
          <label>{t("Tool_debt_mf_vs_fd_LabelDebtRate")}</label>
          <input
            type="number"
            min={0}
            step={0.1}
            inputMode="decimal"
            value={debtRate}
            onChange={(e) => setDebtRate(Math.max(0, Number(e.target.value) || 0))}
          />
        </div>
        <div className="fy-field">
          <label>{t("Tool_debt_mf_vs_fd_LabelFdRate")}</label>
          <input
            type="number"
            min={0}
            step={0.1}
            inputMode="decimal"
            value={fdRate}
            onChange={(e) => setFdRate(Math.max(0, Number(e.target.value) || 0))}
          />
        </div>
        <div className="fy-field">
          <label>{t("Tool_debt_mf_vs_fd_LabelSlab")}</label>
          <input
            type="number"
            min={0}
            max={42}
            step={1}
            inputMode="decimal"
            value={slab}
            onChange={(e) => setSlab(Math.max(0, Number(e.target.value) || 0))}
          />
          <p className="fy-hint">{t("Common_Footnote_RatePa", percent(slab))}</p>
        </div>
        <button type="button" className="fy-btn-calc">
          {t("Common_Calculate")}
        </button>
      </div>

      <ResultSummaryCards cards={summaryCards} />
      <ScenarioCompare
        title={t("Tool_debt_mf_vs_fd_ScenarioTitle")}
        subtitle={t("Tool_debt_mf_vs_fd_ScenarioSubtitle")}
        scenarios={scenarios}
      />
      <WorkedExample
        title={t("Tool_debt_mf_vs_fd_ExampleTitle")}
        subtitle={t("Tool_debt_mf_vs_fd_ExampleSubtitle")}
        steps={exampleSteps}
      />
    </ToolPageShell>
  );
}
