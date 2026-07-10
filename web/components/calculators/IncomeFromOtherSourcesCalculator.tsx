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
import { calculateIncomeFromOtherSources } from "@/lib/finance/incomeFromOtherSources";
import { inr, percent } from "@/lib/finance/format";
import { getTool } from "@/lib/config/tools";
import { incomeFromOtherSourcesInfo } from "@/lib/tool-page-content";

export function IncomeFromOtherSourcesCalculator() {
  const t = useT();
  const tool = getTool("income-from-other-sources")!;

  const [interest, setInterest] = useState(80_000);
  const [other, setOther] = useState(20_000);
  const [slab, setSlab] = useState(30);
  const [apply80tta, setApply80tta] = useState(true);
  const [isSenior, setIsSenior] = useState(false);

  const exampleSteps = useMemo(
    () => [
      t("Tool_income_from_other_sources_ExampleStep_1"),
      t("Tool_income_from_other_sources_ExampleStep_2"),
      t("Tool_income_from_other_sources_ExampleStep_3"),
      t("Tool_income_from_other_sources_ExampleStep_4"),
      t("Tool_income_from_other_sources_ExampleStep_5"),
    ],
    [t],
  );

  const { summaryCards, scenarios } = useMemo(() => {
    const result = calculateIncomeFromOtherSources({
      interestIncome: interest,
      otherIncome: other,
      taxSlabPercent: slab,
      apply80tta,
      isSenior,
    });
    const noDed = calculateIncomeFromOtherSources({
      interestIncome: interest,
      otherIncome: other,
      taxSlabPercent: slab,
      apply80tta: false,
      isSenior,
    });
    const higherSlab = calculateIncomeFromOtherSources({
      interestIncome: interest,
      otherIncome: other,
      taxSlabPercent: Math.min(42, slab + 10),
      apply80tta,
      isSenior,
    });

    return {
      summaryCards: [
        {
          label: t("Tool_income_from_other_sources_Result_Tax"),
          value: inr(result.totalTax),
          footnote: t(
            "Tool_income_from_other_sources_Result_TaxFootnote",
            percent(result.taxSlabPercent),
          ),
          variant: "primary" as const,
        },
        {
          label: t("Tool_income_from_other_sources_Result_Taxable"),
          value: inr(result.taxableIfos),
          footnote: t(
            "Tool_income_from_other_sources_Result_TaxableFootnote",
            inr(result.deduction80tta),
          ),
          variant: "secure" as const,
        },
        {
          label: t("Tool_income_from_other_sources_Result_Gross"),
          value: inr(result.grossIfos),
          footnote: t(
            "Tool_income_from_other_sources_Result_GrossFootnote",
            percent(result.effectiveRate, 2),
          ),
        },
      ],
      scenarios: [
        {
          name: t("Tool_income_from_other_sources_Scenario_NoDed"),
          primaryLabel: t("Tool_income_from_other_sources_Result_Tax"),
          primaryValue: inr(noDed.totalTax),
          secondaryLabel: t("Tool_income_from_other_sources_Result_Taxable"),
          secondaryValue: inr(noDed.taxableIfos),
          variant: "worst" as const,
        },
        {
          name: t("Common_Scenario_Base"),
          primaryLabel: t("Tool_income_from_other_sources_Result_Tax"),
          primaryValue: inr(result.totalTax),
          secondaryLabel: t("Tool_income_from_other_sources_Result_Taxable"),
          secondaryValue: inr(result.taxableIfos),
          variant: "base" as const,
        },
        {
          name: t("Tool_income_from_other_sources_Scenario_Higher"),
          primaryLabel: t("Tool_income_from_other_sources_Result_Tax"),
          primaryValue: inr(higherSlab.totalTax),
          secondaryLabel: t("Tool_income_from_other_sources_Result_Taxable"),
          secondaryValue: inr(higherSlab.taxableIfos),
          variant: "best" as const,
        },
      ],
    };
  }, [interest, other, slab, apply80tta, isSenior, t]);

  return (
    <ToolPageShell
      title={t(tool.titleKey)}
      subtitle={t("Tool_income_from_other_sources_Subtitle")}
      description={t(tool.descriptionKey)}
      icon={tool.icon}
      educate={
        <>
          <div className="fy-info-box">
            <strong>{t("Common_WhatYouLearn")}</strong>
            <p>{t("Tool_income_from_other_sources_LearnText")}</p>
          </div>
          <FormulaCard
            title={t("Common_Formula")}
            code={
              "Gross IFOS = interest + other\nTaxable = gross − 80TTA/B (interest)\nTax = taxable × slab% × 1.04"
            }
            note={t("Tool_income_from_other_sources_FormulaNote")}
          />
        </>
      }
      below={<ToolInfoPanel info={incomeFromOtherSourcesInfo(t)} />}
    >
      <div className="fy-form-card">
        <h3>{t("Common_YourInputs")}</h3>
        <div className="fy-field">
          <label>{t("Tool_income_from_other_sources_LabelInterest")}</label>
          <input
            type="number"
            min={0}
            step={1000}
            inputMode="decimal"
            value={interest}
            onChange={(e) => setInterest(Math.max(0, Number(e.target.value) || 0))}
          />
        </div>
        <div className="fy-field">
          <label>{t("Tool_income_from_other_sources_LabelOther")}</label>
          <input
            type="number"
            min={0}
            step={1000}
            inputMode="decimal"
            value={other}
            onChange={(e) => setOther(Math.max(0, Number(e.target.value) || 0))}
          />
          <p className="fy-field-hint">{t("Tool_income_from_other_sources_OtherHint")}</p>
        </div>
        <div className="fy-field">
          <label>{t("Tool_income_from_other_sources_LabelSlab")}</label>
          <input
            type="number"
            min={0}
            max={42}
            step={1}
            inputMode="decimal"
            value={slab}
            onChange={(e) => setSlab(Math.min(42, Math.max(0, Number(e.target.value) || 0)))}
          />
        </div>
        <div className="fy-field">
          <label>{t("Tool_income_from_other_sources_Label80tta")}</label>
          <select
            value={apply80tta ? "yes" : "no"}
            onChange={(e) => setApply80tta(e.target.value === "yes")}
          >
            <option value="yes">{t("Tool_income_from_other_sources_80tta_Yes")}</option>
            <option value="no">{t("Tool_income_from_other_sources_80tta_No")}</option>
          </select>
        </div>
        <div className="fy-field">
          <label>{t("Tool_income_from_other_sources_LabelSenior")}</label>
          <select
            value={isSenior ? "yes" : "no"}
            onChange={(e) => setIsSenior(e.target.value === "yes")}
          >
            <option value="no">{t("Tool_income_from_other_sources_Senior_No")}</option>
            <option value="yes">{t("Tool_income_from_other_sources_Senior_Yes")}</option>
          </select>
          <p className="fy-field-hint">{t("Tool_income_from_other_sources_SeniorHint")}</p>
        </div>
        <button type="button" className="fy-btn-calc">
          {t("Common_Calculate")}
        </button>
      </div>

      <ResultSummaryCards cards={summaryCards} />
      <ScenarioCompare
        title={t("Tool_income_from_other_sources_ScenarioTitle")}
        subtitle={t("Tool_income_from_other_sources_ScenarioSubtitle")}
        scenarios={scenarios}
      />
      <WorkedExample
        title={t("Tool_income_from_other_sources_ExampleTitle")}
        subtitle={t("Tool_income_from_other_sources_ExampleSubtitle")}
        steps={exampleSteps}
      />
    </ToolPageShell>
  );
}
