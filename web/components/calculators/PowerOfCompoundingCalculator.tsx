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
import { calculatePowerOfCompounding } from "@/lib/finance/powerOfCompounding";
import { inr, percent } from "@/lib/finance/format";
import { getTool } from "@/lib/config/tools";
import { powerOfCompoundingInfo, standardGrowthColumns } from "@/lib/tool-page-content";

export function PowerOfCompoundingCalculator() {
  const t = useT();
  const tool = getTool("power-of-compounding")!;

  const [principal, setPrincipal] = useState(100_000);
  const [rate, setRate] = useState(12);
  const [years, setYears] = useState(15);

  const breakdownColumns = useMemo(() => standardGrowthColumns(t), [t]);

  const exampleSteps = useMemo(
    () => [
      t("Tool_power_of_compounding_ExampleStep_1"),
      t("Tool_power_of_compounding_ExampleStep_2"),
      t("Tool_power_of_compounding_ExampleStep_3"),
      t("Tool_power_of_compounding_ExampleStep_4"),
      t("Tool_power_of_compounding_ExampleStep_5"),
    ],
    [t],
  );

  const { summaryCards, scenarios, breakdownRows } = useMemo(() => {
    const result = calculatePowerOfCompounding({
      principal,
      annualRatePercent: rate,
      years,
    });
    const low = calculatePowerOfCompounding({
      principal,
      annualRatePercent: Math.max(1, rate - 4),
      years,
    });
    const high = calculatePowerOfCompounding({
      principal,
      annualRatePercent: rate + 3,
      years,
    });

    return {
      summaryCards: [
        {
          label: t("Tool_power_of_compounding_Result_Maturity"),
          value: inr(result.maturity),
          footnote: t("Tool_power_of_compounding_Result_MaturityFootnote", percent(rate), years),
          variant: "primary" as const,
        },
        {
          label: t("Tool_power_of_compounding_Result_Gain"),
          value: inr(result.totalGain),
          footnote: t("Tool_power_of_compounding_Result_GainFootnote"),
        },
        {
          label: t("Tool_power_of_compounding_Result_Rule72"),
          value:
            result.yearsToDouble > 0
              ? t("Tool_power_of_compounding_Result_Rule72Value", result.yearsToDouble.toFixed(1))
              : "—",
          footnote: t("Tool_power_of_compounding_Result_Rule72Footnote"),
          variant: "volatile" as const,
        },
      ],
      scenarios: [
        {
          name: t("Tool_power_of_compounding_Scenario_Low"),
          primaryLabel: t("Tool_power_of_compounding_Result_Maturity"),
          primaryValue: inr(low.maturity),
          secondaryLabel: t("Tool_power_of_compounding_LabelRate"),
          secondaryValue: percent(low.annualRatePercent),
          variant: "worst" as const,
        },
        {
          name: t("Common_Scenario_Base"),
          primaryLabel: t("Tool_power_of_compounding_Result_Maturity"),
          primaryValue: inr(result.maturity),
          secondaryLabel: t("Tool_power_of_compounding_Result_Gain"),
          secondaryValue: inr(result.totalGain),
          variant: "base" as const,
        },
        {
          name: t("Tool_power_of_compounding_Scenario_High"),
          primaryLabel: t("Tool_power_of_compounding_Result_Maturity"),
          primaryValue: inr(high.maturity),
          secondaryLabel: t("Tool_power_of_compounding_LabelRate"),
          secondaryValue: percent(high.annualRatePercent),
          variant: "best" as const,
        },
      ],
      breakdownRows: result.rows.map((r) => ({
        cells: {
          year: t("Common_YearN", r.year),
          invested: inr(r.invested),
          value: inr(r.value),
          gain: inr(r.gain),
        },
      })),
    };
  }, [principal, rate, years, t]);

  return (
    <ToolPageShell
      title={t(tool.titleKey)}
      subtitle={t("Tool_power_of_compounding_Subtitle")}
      description={t(tool.descriptionKey)}
      icon={tool.icon}
      educate={
        <>
          <div className="fy-info-box">
            <strong>{t("Common_WhatYouLearn")}</strong>
            <p>{t("Tool_power_of_compounding_LearnText")}</p>
          </div>
          <FormulaCard
            title={t("Common_Formula")}
            code={"A = P × (1 + r)^n\nRule of 72 ≈ 72 / rate%\nyearly table of growth"}
            note={t("Tool_power_of_compounding_FormulaNote")}
          />
        </>
      }
      below={<ToolInfoPanel info={powerOfCompoundingInfo(t)} />}
    >
      <div className="fy-form-card">
        <h3>{t("Common_YourInputs")}</h3>
        <div className="fy-field">
          <label>{t("Tool_power_of_compounding_LabelPrincipal")}</label>
          <input
            type="number"
            min={0}
            step={1000}
            inputMode="decimal"
            value={principal}
            onChange={(e) => setPrincipal(Math.max(0, Number(e.target.value) || 0))}
          />
        </div>
        <div className="fy-field">
          <label>{t("Tool_power_of_compounding_LabelRate")}</label>
          <input
            type="number"
            min={0}
            max={30}
            step={0.1}
            inputMode="decimal"
            value={rate}
            onChange={(e) => setRate(Math.max(0, Number(e.target.value) || 0))}
          />
          <p className="fy-field-hint">{t("Tool_power_of_compounding_RateHint")}</p>
        </div>
        <div className="fy-field">
          <label>{t("Tool_power_of_compounding_LabelYears")}</label>
          <input
            type="number"
            min={1}
            max={50}
            step={1}
            inputMode="numeric"
            value={years}
            onChange={(e) => setYears(Math.min(50, Math.max(1, Number(e.target.value) || 1)))}
          />
        </div>
        <button type="button" className="fy-btn-calc">
          {t("Common_Calculate")}
        </button>
      </div>

      <ResultSummaryCards cards={summaryCards} />
      <ScenarioCompare
        title={t("Tool_power_of_compounding_ScenarioTitle")}
        subtitle={t("Tool_power_of_compounding_ScenarioSubtitle")}
        scenarios={scenarios}
      />
      <BreakdownTable
        title={t("Tool_power_of_compounding_BreakdownTitle")}
        columns={breakdownColumns}
        rows={breakdownRows}
      />
      <WorkedExample
        title={t("Tool_power_of_compounding_ExampleTitle")}
        subtitle={t("Tool_power_of_compounding_ExampleSubtitle")}
        steps={exampleSteps}
      />
    </ToolPageShell>
  );
}
