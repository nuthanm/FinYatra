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
  calculateRentalIncomeTax,
  RENTAL_STANDARD_DEDUCTION_PCT,
} from "@/lib/finance/rentalIncomeTax";
import { inr, percent } from "@/lib/finance/format";
import { getTool } from "@/lib/config/tools";
import { rentalIncomeTaxInfo } from "@/lib/tool-page-content";

export function RentalIncomeTaxCalculator() {
  const t = useT();
  const tool = getTool("rental-income-tax")!;

  const [annualRent, setAnnualRent] = useState(360_000);
  const [municipalTaxes, setMunicipalTaxes] = useState(12_000);
  const [taxSlab, setTaxSlab] = useState(30);

  const exampleSteps = useMemo(
    () => [
      t("Tool_rental_income_tax_ExampleStep_1"),
      t("Tool_rental_income_tax_ExampleStep_2"),
      t("Tool_rental_income_tax_ExampleStep_3"),
      t("Tool_rental_income_tax_ExampleStep_4"),
      t("Tool_rental_income_tax_ExampleStep_5"),
    ],
    [t],
  );

  const { summaryCards, scenarios, result } = useMemo(() => {
    const result = calculateRentalIncomeTax({ annualRent, municipalTaxes, taxSlabPercent: taxSlab });
    const lowerSlab = calculateRentalIncomeTax({ annualRent, municipalTaxes, taxSlabPercent: 20 });
    const higherRent = calculateRentalIncomeTax({
      annualRent: annualRent * 1.25,
      municipalTaxes,
      taxSlabPercent: taxSlab,
    });

    return {
      result,
      summaryCards: [
        {
          label: t("Tool_rental_income_tax_Result_Taxable"),
          value: inr(result.taxableIncome),
          footnote: t(
            "Tool_rental_income_tax_Result_TaxableFootnote",
            percent(RENTAL_STANDARD_DEDUCTION_PCT),
          ),
          variant: "primary" as const,
        },
        {
          label: t("Tool_rental_income_tax_Result_Tax"),
          value: inr(result.estimatedTax),
          footnote: t("Tool_rental_income_tax_Result_TaxFootnote", percent(taxSlab)),
          variant: "volatile" as const,
        },
        {
          label: t("Tool_rental_income_tax_Result_Nav"),
          value: inr(result.netAnnualValue),
          footnote: t("Tool_rental_income_tax_Result_NavFootnote", inr(result.standardDeduction)),
        },
      ],
      scenarios: [
        {
          name: t("Tool_rental_income_tax_Scenario_LowerSlab"),
          primaryLabel: t("Tool_rental_income_tax_Result_Tax"),
          primaryValue: inr(lowerSlab.estimatedTax),
          secondaryLabel: t("Common_Label_Return"),
          secondaryValue: percent(20),
          variant: "best",
        },
        {
          name: t("Common_Scenario_Base"),
          primaryLabel: t("Tool_rental_income_tax_Result_Tax"),
          primaryValue: inr(result.estimatedTax),
          secondaryLabel: t("Tool_rental_income_tax_Result_Taxable"),
          secondaryValue: inr(result.taxableIncome),
          variant: "base",
        },
        {
          name: t("Tool_rental_income_tax_Scenario_HigherRent"),
          primaryLabel: t("Tool_rental_income_tax_Result_Tax"),
          primaryValue: inr(higherRent.estimatedTax),
          secondaryLabel: t("Tool_rental_income_tax_Result_Taxable"),
          secondaryValue: inr(higherRent.taxableIncome),
          variant: "worst",
        },
      ],
    };
  }, [annualRent, municipalTaxes, taxSlab, t]);

  return (
    <ToolPageShell
      title={t(tool.titleKey)}
      subtitle={t("Tool_rental_income_tax_Subtitle")}
      description={t(tool.descriptionKey)}
      icon={tool.icon}
      educate={
        <>
          <div className="fy-info-box">
            <strong>{t("Common_WhatYouLearn")}</strong>
            <p>{t("Tool_rental_income_tax_LearnText")}</p>
          </div>
          <FormulaCard
            title={t("Common_Formula")}
            code={"NAV = Rent − Municipal taxes\nTaxable = NAV − 30% of NAV\nTax ≈ Taxable × slab"}
            note={t("Tool_rental_income_tax_FormulaNote")}
          />
        </>
      }
      below={<ToolInfoPanel info={rentalIncomeTaxInfo(t)} />}
    >
      <div className="fy-form-card">
        <h3>{t("Common_YourInputs")}</h3>
        <div className="fy-field">
          <label>{t("Tool_rental_income_tax_LabelRent")}</label>
          <input
            type="number"
            min={0}
            step={1000}
            inputMode="decimal"
            value={annualRent}
            onChange={(e) => setAnnualRent(Math.max(0, Number(e.target.value) || 0))}
          />
        </div>
        <div className="fy-field">
          <label>{t("Tool_rental_income_tax_LabelMunicipal")}</label>
          <input
            type="number"
            min={0}
            step={500}
            inputMode="decimal"
            value={municipalTaxes}
            onChange={(e) => setMunicipalTaxes(Math.max(0, Number(e.target.value) || 0))}
          />
        </div>
        <div className="fy-field">
          <label>{t("Tool_rental_income_tax_LabelSlab")}</label>
          <select value={taxSlab} onChange={(e) => setTaxSlab(Number(e.target.value))}>
            <option value={5}>5%</option>
            <option value={10}>10%</option>
            <option value={20}>20%</option>
            <option value={30}>30%</option>
          </select>
        </div>
        <button type="button" className="fy-btn-calc">
          {t("Common_Calculate")}
        </button>
      </div>

      <div className="fy-info-box">
        <strong>{t("Tool_rental_income_tax_VerdictTitle")}</strong>
        <p>
          {t(
            "Tool_rental_income_tax_VerdictNote",
            inr(result.taxableIncome),
            inr(result.estimatedTax),
            percent(taxSlab),
          )}
        </p>
      </div>

      <ResultSummaryCards cards={summaryCards} />
      <ScenarioCompare
        title={t("Tool_rental_income_tax_ScenarioTitle")}
        subtitle={t("Tool_rental_income_tax_ScenarioSubtitle")}
        scenarios={scenarios}
      />
      <WorkedExample
        title={t("Tool_rental_income_tax_ExampleTitle")}
        subtitle={t("Tool_rental_income_tax_ExampleSubtitle")}
        steps={exampleSteps}
      />
    </ToolPageShell>
  );
}
