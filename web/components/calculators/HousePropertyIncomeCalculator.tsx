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
import { calculateHousePropertyIncome } from "@/lib/finance/housePropertyIncome";
import { inr, percent } from "@/lib/finance/format";
import { getTool } from "@/lib/config/tools";
import { housePropertyIncomeInfo } from "@/lib/tool-page-content";

export function HousePropertyIncomeCalculator() {
  const t = useT();
  const tool = getTool("house-property-income")!;

  const [gav, setGav] = useState(3_00_000);
  const [municipal, setMunicipal] = useState(12_000);
  const [interest, setInterest] = useState(1_50_000);
  const [taxSlab, setTaxSlab] = useState(30);

  const exampleSteps = useMemo(
    () => [
      t("Tool_house_property_income_ExampleStep_1"),
      t("Tool_house_property_income_ExampleStep_2"),
      t("Tool_house_property_income_ExampleStep_3"),
      t("Tool_house_property_income_ExampleStep_4"),
      t("Tool_house_property_income_ExampleStep_5"),
    ],
    [t],
  );

  const { summaryCards, scenarios } = useMemo(() => {
    const result = calculateHousePropertyIncome({
      gav,
      municipalTaxes: municipal,
      interestPaid: interest,
      taxSlabPercent: taxSlab,
    });
    const lessInterest = calculateHousePropertyIncome({
      gav,
      municipalTaxes: municipal,
      interestPaid: Math.max(0, interest - 50_000),
      taxSlabPercent: taxSlab,
    });
    const moreInterest = calculateHousePropertyIncome({
      gav,
      municipalTaxes: municipal,
      interestPaid: interest + 50_000,
      taxSlabPercent: taxSlab,
    });

    return {
      summaryCards: [
        {
          label: t("Tool_house_property_income_Result_Nav"),
          value: inr(result.nav),
          footnote: t("Tool_house_property_income_Result_NavFootnote"),
          variant: "primary" as const,
        },
        {
          label: t("Tool_house_property_income_Result_Tax"),
          value: inr(result.estimatedTax),
          footnote: t(
            "Tool_house_property_income_Result_TaxFootnote",
            percent(taxSlab, 0),
          ),
          variant: "volatile" as const,
        },
        {
          label: t("Tool_house_property_income_Result_Std"),
          value: inr(result.standardDeduction),
          footnote: t("Tool_house_property_income_Result_StdFootnote"),
        },
      ],
      scenarios: [
        {
          name: t("Tool_house_property_income_Scenario_LessInt"),
          primaryLabel: t("Tool_house_property_income_Result_Nav"),
          primaryValue: inr(lessInterest.nav),
          secondaryLabel: t("Tool_house_property_income_Result_Tax"),
          secondaryValue: inr(lessInterest.estimatedTax),
          variant: "worst" as const,
        },
        {
          name: t("Common_Scenario_Base"),
          primaryLabel: t("Tool_house_property_income_Result_Nav"),
          primaryValue: inr(result.nav),
          secondaryLabel: t("Tool_house_property_income_Result_Tax"),
          secondaryValue: inr(result.estimatedTax),
          variant: "base" as const,
        },
        {
          name: t("Tool_house_property_income_Scenario_MoreInt"),
          primaryLabel: t("Tool_house_property_income_Result_Nav"),
          primaryValue: inr(moreInterest.nav),
          secondaryLabel: t("Tool_house_property_income_Result_Tax"),
          secondaryValue: inr(moreInterest.estimatedTax),
          variant: "best" as const,
        },
      ],
    };
  }, [gav, municipal, interest, taxSlab, t]);

  return (
    <ToolPageShell
      title={t(tool.titleKey)}
      subtitle={t("Tool_house_property_income_Subtitle")}
      description={t(tool.descriptionKey)}
      icon={tool.icon}
      educate={
        <>
          <div className="fy-info-box">
            <strong>{t("Common_WhatYouLearn")}</strong>
            <p>{t("Tool_house_property_income_LearnText")}</p>
          </div>
          <FormulaCard
            title={t("Common_Formula")}
            code={
              "NAV = GAV − municipal − 30% std − interest\ntax ≈ max(0, NAV) × slab%"
            }
            note={t("Tool_house_property_income_FormulaNote")}
          />
        </>
      }
      below={<ToolInfoPanel info={housePropertyIncomeInfo(t)} />}
    >
      <div className="fy-form-card">
        <h3>{t("Common_YourInputs")}</h3>
        <div className="fy-field">
          <label>{t("Tool_house_property_income_LabelGav")}</label>
          <input
            type="number"
            min={0}
            step={10000}
            inputMode="decimal"
            value={gav}
            onChange={(e) => setGav(Math.max(0, Number(e.target.value) || 0))}
          />
        </div>
        <div className="fy-field">
          <label>{t("Tool_house_property_income_LabelMunicipal")}</label>
          <input
            type="number"
            min={0}
            step={1000}
            inputMode="decimal"
            value={municipal}
            onChange={(e) => setMunicipal(Math.max(0, Number(e.target.value) || 0))}
          />
        </div>
        <div className="fy-field">
          <label>{t("Tool_house_property_income_LabelInterest")}</label>
          <input
            type="number"
            min={0}
            step={10000}
            inputMode="decimal"
            value={interest}
            onChange={(e) => setInterest(Math.max(0, Number(e.target.value) || 0))}
          />
          <p className="fy-field-hint">{t("Tool_house_property_income_InterestHint")}</p>
        </div>
        <div className="fy-field">
          <label>{t("Tool_house_property_income_LabelSlab")}</label>
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
        title={t("Tool_house_property_income_ScenarioTitle")}
        subtitle={t("Tool_house_property_income_ScenarioSubtitle")}
        scenarios={scenarios}
      />
      <WorkedExample
        title={t("Tool_house_property_income_ExampleTitle")}
        subtitle={t("Tool_house_property_income_ExampleSubtitle")}
        steps={exampleSteps}
      />
    </ToolPageShell>
  );
}
