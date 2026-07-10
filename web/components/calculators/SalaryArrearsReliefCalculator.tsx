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
import { calculateSalaryArrearsRelief } from "@/lib/finance/salaryArrearsRelief";
import { inr, percent } from "@/lib/finance/format";
import { getTool } from "@/lib/config/tools";
import { salaryArrearsReliefInfo } from "@/lib/tool-page-content";

export function SalaryArrearsReliefCalculator() {
  const t = useT();
  const tool = getTool("salary-arrears-relief")!;

  const [arrears, setArrears] = useState(1_20_000);
  const [years, setYears] = useState(2);
  const [taxSlab, setTaxSlab] = useState(30);

  const exampleSteps = useMemo(
    () => [
      t("Tool_salary_arrears_relief_ExampleStep_1"),
      t("Tool_salary_arrears_relief_ExampleStep_2"),
      t("Tool_salary_arrears_relief_ExampleStep_3"),
      t("Tool_salary_arrears_relief_ExampleStep_4"),
      t("Tool_salary_arrears_relief_ExampleStep_5"),
    ],
    [t],
  );

  const { summaryCards, scenarios } = useMemo(() => {
    const result = calculateSalaryArrearsRelief({
      arrearsAmount: arrears,
      years,
      taxSlabPercent: taxSlab,
    });
    const oneYear = calculateSalaryArrearsRelief({
      arrearsAmount: arrears,
      years: 1,
      taxSlabPercent: taxSlab,
    });
    const moreYears = calculateSalaryArrearsRelief({
      arrearsAmount: arrears,
      years: years + 2,
      taxSlabPercent: taxSlab,
    });

    return {
      summaryCards: [
        {
          label: t("Tool_salary_arrears_relief_Result_Relief"),
          value: inr(result.estimatedRelief),
          footnote: t("Tool_salary_arrears_relief_Result_ReliefFootnote"),
          variant: "primary" as const,
        },
        {
          label: t("Tool_salary_arrears_relief_Result_Lump"),
          value: inr(result.taxIfLumpSum),
          footnote: t(
            "Tool_salary_arrears_relief_Result_LumpFootnote",
            percent(taxSlab, 0),
          ),
          variant: "volatile" as const,
        },
        {
          label: t("Tool_salary_arrears_relief_Result_Spread"),
          value: inr(result.taxIfSpread),
          footnote: t(
            "Tool_salary_arrears_relief_Result_SpreadFootnote",
            percent(result.priorYearSlabPercent, 0),
          ),
        },
      ],
      scenarios: [
        {
          name: t("Tool_salary_arrears_relief_Scenario_One"),
          primaryLabel: t("Tool_salary_arrears_relief_Result_Relief"),
          primaryValue: inr(oneYear.estimatedRelief),
          secondaryLabel: t("Tool_salary_arrears_relief_LabelYears"),
          secondaryValue: "1",
          variant: "worst" as const,
        },
        {
          name: t("Common_Scenario_Base"),
          primaryLabel: t("Tool_salary_arrears_relief_Result_Relief"),
          primaryValue: inr(result.estimatedRelief),
          secondaryLabel: t("Tool_salary_arrears_relief_Result_Lump"),
          secondaryValue: inr(result.taxIfLumpSum),
          variant: "base" as const,
        },
        {
          name: t("Tool_salary_arrears_relief_Scenario_More"),
          primaryLabel: t("Tool_salary_arrears_relief_Result_Relief"),
          primaryValue: inr(moreYears.estimatedRelief),
          secondaryLabel: t("Tool_salary_arrears_relief_LabelYears"),
          secondaryValue: String(years + 2),
          variant: "best" as const,
        },
      ],
    };
  }, [arrears, years, taxSlab, t]);

  return (
    <ToolPageShell
      title={t(tool.titleKey)}
      subtitle={t("Tool_salary_arrears_relief_Subtitle")}
      description={t(tool.descriptionKey)}
      icon={tool.icon}
      educate={
        <>
          <div className="fy-info-box">
            <strong>{t("Common_WhatYouLearn")}</strong>
            <p>{t("Tool_salary_arrears_relief_LearnText")}</p>
          </div>
          <FormulaCard
            title={t("Common_Formula")}
            code={
              "tax lump ≈ arrears × current slab%\ntax spread ≈ arrears × prior slab%\nrelief ≈ lump − spread"
            }
            note={t("Tool_salary_arrears_relief_FormulaNote")}
          />
        </>
      }
      below={<ToolInfoPanel info={salaryArrearsReliefInfo(t)} />}
    >
      <div className="fy-form-card">
        <h3>{t("Common_YourInputs")}</h3>
        <div className="fy-field">
          <label>{t("Tool_salary_arrears_relief_LabelArrears")}</label>
          <input
            type="number"
            min={0}
            step={10000}
            inputMode="decimal"
            value={arrears}
            onChange={(e) => setArrears(Math.max(0, Number(e.target.value) || 0))}
          />
        </div>
        <div className="fy-field">
          <label>{t("Tool_salary_arrears_relief_LabelYears")}</label>
          <input
            type="number"
            min={1}
            max={10}
            step={1}
            inputMode="numeric"
            value={years}
            onChange={(e) => setYears(Math.max(1, Number(e.target.value) || 1))}
          />
          <p className="fy-field-hint">{t("Tool_salary_arrears_relief_YearsHint")}</p>
        </div>
        <div className="fy-field">
          <label>{t("Tool_salary_arrears_relief_LabelSlab")}</label>
          <input
            type="number"
            min={0}
            max={42}
            step={1}
            inputMode="decimal"
            value={taxSlab}
            onChange={(e) => setTaxSlab(Math.max(0, Number(e.target.value) || 0))}
          />
        </div>
        <button type="button" className="fy-btn-calc">
          {t("Common_Calculate")}
        </button>
      </div>

      <ResultSummaryCards cards={summaryCards} />
      <ScenarioCompare
        title={t("Tool_salary_arrears_relief_ScenarioTitle")}
        subtitle={t("Tool_salary_arrears_relief_ScenarioSubtitle")}
        scenarios={scenarios}
      />
      <WorkedExample
        title={t("Tool_salary_arrears_relief_ExampleTitle")}
        subtitle={t("Tool_salary_arrears_relief_ExampleSubtitle")}
        steps={exampleSteps}
      />
    </ToolPageShell>
  );
}
