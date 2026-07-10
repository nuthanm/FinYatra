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
  calculateFloatingRateSavingsBond,
  FRSB_DEFAULT_RATE,
  FRSB_TENURE_YEARS,
} from "@/lib/finance/floatingRateSavingsBond";
import { inr, percent } from "@/lib/finance/format";
import { getTool } from "@/lib/config/tools";
import { floatingRateSavingsBondInfo } from "@/lib/tool-page-content";

export function FloatingRateSavingsBondCalculator() {
  const t = useT();
  const tool = getTool("floating-rate-savings-bond")!;

  const [deposit, setDeposit] = useState(5_00_000);
  const [rate, setRate] = useState(FRSB_DEFAULT_RATE);
  const [years, setYears] = useState(FRSB_TENURE_YEARS);

  const exampleSteps = useMemo(
    () => [
      t("Tool_floating_rate_savings_bond_ExampleStep_1"),
      t("Tool_floating_rate_savings_bond_ExampleStep_2"),
      t("Tool_floating_rate_savings_bond_ExampleStep_3"),
      t("Tool_floating_rate_savings_bond_ExampleStep_4"),
      t("Tool_floating_rate_savings_bond_ExampleStep_5"),
    ],
    [t],
  );

  const { summaryCards, scenarios } = useMemo(() => {
    const result = calculateFloatingRateSavingsBond({
      deposit,
      annualRatePercent: rate,
      tenureYears: years,
    });
    const lower = calculateFloatingRateSavingsBond({
      deposit,
      annualRatePercent: Math.max(0, rate - 0.5),
      tenureYears: years,
    });
    const higher = calculateFloatingRateSavingsBond({
      deposit,
      annualRatePercent: rate + 0.5,
      tenureYears: years,
    });

    return {
      summaryCards: [
        {
          label: t("Tool_floating_rate_savings_bond_Result_Half"),
          value: inr(result.halfYearlyInterest),
          footnote: t(
            "Tool_floating_rate_savings_bond_Result_HalfFootnote",
            percent(rate),
          ),
          variant: "primary" as const,
        },
        {
          label: t("Tool_floating_rate_savings_bond_Result_Annual"),
          value: inr(result.annualInterest),
          footnote: t("Tool_floating_rate_savings_bond_Result_AnnualFootnote"),
        },
        {
          label: t("Tool_floating_rate_savings_bond_Result_Total"),
          value: inr(result.totalInterest),
          footnote: t("Tool_floating_rate_savings_bond_Result_TotalFootnote", years),
          variant: "secure" as const,
        },
      ],
      scenarios: [
        {
          name: t("Tool_floating_rate_savings_bond_Scenario_Lower"),
          primaryLabel: t("Tool_floating_rate_savings_bond_Result_Half"),
          primaryValue: inr(lower.halfYearlyInterest),
          secondaryLabel: t("Tool_floating_rate_savings_bond_Result_Total"),
          secondaryValue: inr(lower.totalInterest),
          variant: "worst" as const,
        },
        {
          name: t("Common_Scenario_Base"),
          primaryLabel: t("Tool_floating_rate_savings_bond_Result_Half"),
          primaryValue: inr(result.halfYearlyInterest),
          secondaryLabel: t("Tool_floating_rate_savings_bond_LabelRate"),
          secondaryValue: percent(rate),
          variant: "base" as const,
        },
        {
          name: t("Tool_floating_rate_savings_bond_Scenario_Higher"),
          primaryLabel: t("Tool_floating_rate_savings_bond_Result_Half"),
          primaryValue: inr(higher.halfYearlyInterest),
          secondaryLabel: t("Tool_floating_rate_savings_bond_Result_Total"),
          secondaryValue: inr(higher.totalInterest),
          variant: "best" as const,
        },
      ],
    };
  }, [deposit, rate, years, t]);

  return (
    <ToolPageShell
      title={t(tool.titleKey)}
      subtitle={t("Tool_floating_rate_savings_bond_Subtitle")}
      description={t(tool.descriptionKey)}
      icon={tool.icon}
      educate={
        <>
          <div className="fy-info-box">
            <strong>{t("Common_WhatYouLearn")}</strong>
            <p>{t("Tool_floating_rate_savings_bond_LearnText")}</p>
          </div>
          <FormulaCard
            title={t("Common_Formula")}
            code={"annual = deposit × rate%\nhalf-yearly = annual / 2\ntotal = annual × years"}
            note={t("Tool_floating_rate_savings_bond_FormulaNote")}
          />
        </>
      }
      below={<ToolInfoPanel info={floatingRateSavingsBondInfo(t)} />}
    >
      <div className="fy-form-card">
        <h3>{t("Common_YourInputs")}</h3>
        <div className="fy-field">
          <label>{t("Tool_floating_rate_savings_bond_LabelDeposit")}</label>
          <input
            type="number"
            min={0}
            step={10000}
            inputMode="decimal"
            value={deposit}
            onChange={(e) => setDeposit(Math.max(0, Number(e.target.value) || 0))}
          />
        </div>
        <div className="fy-field">
          <label>{t("Tool_floating_rate_savings_bond_LabelRate")}</label>
          <input
            type="number"
            min={0}
            step={0.01}
            inputMode="decimal"
            value={rate}
            onChange={(e) => setRate(Math.max(0, Number(e.target.value) || 0))}
          />
          <p className="fy-field-hint">{t("Tool_floating_rate_savings_bond_RateHint")}</p>
        </div>
        <div className="fy-field">
          <label>{t("Tool_floating_rate_savings_bond_LabelTenure")}</label>
          <input
            type="number"
            min={1}
            max={10}
            step={1}
            inputMode="numeric"
            value={years}
            onChange={(e) => setYears(Math.max(1, Number(e.target.value) || 1))}
          />
          <p className="fy-field-hint">{t("Tool_floating_rate_savings_bond_TenureHint")}</p>
        </div>
        <button type="button" className="fy-btn-calc">
          {t("Common_Calculate")}
        </button>
      </div>

      <ResultSummaryCards cards={summaryCards} />
      <ScenarioCompare
        title={t("Tool_floating_rate_savings_bond_ScenarioTitle")}
        subtitle={t("Tool_floating_rate_savings_bond_ScenarioSubtitle")}
        scenarios={scenarios}
      />
      <WorkedExample
        title={t("Tool_floating_rate_savings_bond_ExampleTitle")}
        subtitle={t("Tool_floating_rate_savings_bond_ExampleSubtitle")}
        steps={exampleSteps}
      />
    </ToolPageShell>
  );
}
