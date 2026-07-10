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
import { calculateHomeLoanTaxBenefit } from "@/lib/finance/homeLoanTaxBenefit";
import { inr, percent } from "@/lib/finance/format";
import { getTool } from "@/lib/config/tools";
import { homeLoanTaxBenefitInfo } from "@/lib/tool-page-content";

export function HomeLoanTaxBenefitCalculator() {
  const t = useT();
  const tool = getTool("home-loan-tax-benefit")!;

  const [annualInterest, setAnnualInterest] = useState(2_50_000);
  const [annualPrincipal, setAnnualPrincipal] = useState(1_80_000);
  const [selfOccupied, setSelfOccupied] = useState(true);
  const [taxSlab, setTaxSlab] = useState(30);
  const [oldRegime, setOldRegime] = useState(true);

  const exampleSteps = useMemo(
    () => [
      t("Tool_home_loan_tax_benefit_ExampleStep_1"),
      t("Tool_home_loan_tax_benefit_ExampleStep_2"),
      t("Tool_home_loan_tax_benefit_ExampleStep_3"),
      t("Tool_home_loan_tax_benefit_ExampleStep_4"),
      t("Tool_home_loan_tax_benefit_ExampleStep_5"),
    ],
    [t],
  );

  const { summaryCards, scenarios } = useMemo(() => {
    const result = calculateHomeLoanTaxBenefit({
      annualInterest,
      annualPrincipal,
      selfOccupied,
      taxSlabPercent: taxSlab,
      oldRegime,
    });
    const letOut = calculateHomeLoanTaxBenefit({
      annualInterest,
      annualPrincipal,
      selfOccupied: false,
      taxSlabPercent: taxSlab,
      oldRegime: true,
    });
    const newReg = calculateHomeLoanTaxBenefit({
      annualInterest,
      annualPrincipal,
      selfOccupied,
      taxSlabPercent: taxSlab,
      oldRegime: false,
    });

    return {
      summaryCards: [
        {
          label: t("Tool_home_loan_tax_benefit_Result_Saving"),
          value: inr(result.estimatedTaxSaving),
          footnote: t(
            "Tool_home_loan_tax_benefit_Result_SavingFootnote",
            percent(taxSlab, 0),
          ),
          variant: "primary" as const,
        },
        {
          label: t("Tool_home_loan_tax_benefit_Result_24b"),
          value: inr(result.section24bDeduction),
          footnote: t("Tool_home_loan_tax_benefit_Result_24bFootnote"),
        },
        {
          label: t("Tool_home_loan_tax_benefit_Result_80c"),
          value: inr(result.section80cPrincipal),
          footnote: t("Tool_home_loan_tax_benefit_Result_80cFootnote"),
          variant: "secure" as const,
        },
      ],
      scenarios: [
        {
          name: t("Tool_home_loan_tax_benefit_Scenario_Self"),
          primaryLabel: t("Tool_home_loan_tax_benefit_Result_Saving"),
          primaryValue: inr(
            calculateHomeLoanTaxBenefit({
              annualInterest,
              annualPrincipal,
              selfOccupied: true,
              taxSlabPercent: taxSlab,
              oldRegime: true,
            }).estimatedTaxSaving,
          ),
          secondaryLabel: t("Tool_home_loan_tax_benefit_Result_24b"),
          secondaryValue: inr(
            calculateHomeLoanTaxBenefit({
              annualInterest,
              annualPrincipal,
              selfOccupied: true,
              taxSlabPercent: taxSlab,
              oldRegime: true,
            }).section24bDeduction,
          ),
          variant: "base" as const,
        },
        {
          name: t("Tool_home_loan_tax_benefit_Scenario_LetOut"),
          primaryLabel: t("Tool_home_loan_tax_benefit_Result_Saving"),
          primaryValue: inr(letOut.estimatedTaxSaving),
          secondaryLabel: t("Tool_home_loan_tax_benefit_Result_24b"),
          secondaryValue: inr(letOut.section24bDeduction),
          variant: "best" as const,
        },
        {
          name: t("Tool_home_loan_tax_benefit_Scenario_New"),
          primaryLabel: t("Tool_home_loan_tax_benefit_Result_Saving"),
          primaryValue: inr(newReg.estimatedTaxSaving),
          secondaryLabel: t("Tool_home_loan_tax_benefit_Result_Total"),
          secondaryValue: inr(newReg.totalDeduction),
          variant: "worst" as const,
        },
      ],
    };
  }, [annualInterest, annualPrincipal, selfOccupied, taxSlab, oldRegime, t]);

  return (
    <ToolPageShell
      title={t(tool.titleKey)}
      subtitle={t("Tool_home_loan_tax_benefit_Subtitle")}
      description={t(tool.descriptionKey)}
      icon={tool.icon}
      educate={
        <>
          <div className="fy-info-box">
            <strong>{t("Common_WhatYouLearn")}</strong>
            <p>{t("Tool_home_loan_tax_benefit_LearnText")}</p>
          </div>
          <FormulaCard
            title={t("Common_Formula")}
            code={
              "24(b) = min(interest, ₹2L) if self-occupied\n80C = min(principal, ₹1.5L)\nsaving ≈ (24b + 80C) × slab%"
            }
            note={t("Tool_home_loan_tax_benefit_FormulaNote")}
          />
        </>
      }
      below={<ToolInfoPanel info={homeLoanTaxBenefitInfo(t)} />}
    >
      <div className="fy-form-card">
        <h3>{t("Common_YourInputs")}</h3>
        <div className="fy-field">
          <label>{t("Tool_home_loan_tax_benefit_LabelInterest")}</label>
          <input
            type="number"
            min={0}
            step={10000}
            inputMode="decimal"
            value={annualInterest}
            onChange={(e) => setAnnualInterest(Math.max(0, Number(e.target.value) || 0))}
          />
        </div>
        <div className="fy-field">
          <label>{t("Tool_home_loan_tax_benefit_LabelPrincipal")}</label>
          <input
            type="number"
            min={0}
            step={10000}
            inputMode="decimal"
            value={annualPrincipal}
            onChange={(e) => setAnnualPrincipal(Math.max(0, Number(e.target.value) || 0))}
          />
        </div>
        <div className="fy-field">
          <label>{t("Tool_home_loan_tax_benefit_LabelOccupancy")}</label>
          <select
            value={selfOccupied ? "self" : "let"}
            onChange={(e) => setSelfOccupied(e.target.value === "self")}
          >
            <option value="self">{t("Tool_home_loan_tax_benefit_Occupancy_Self")}</option>
            <option value="let">{t("Tool_home_loan_tax_benefit_Occupancy_Let")}</option>
          </select>
        </div>
        <div className="fy-field">
          <label>{t("Tool_home_loan_tax_benefit_LabelRegime")}</label>
          <select
            value={oldRegime ? "old" : "new"}
            onChange={(e) => setOldRegime(e.target.value === "old")}
          >
            <option value="old">{t("Tool_home_loan_tax_benefit_Regime_Old")}</option>
            <option value="new">{t("Tool_home_loan_tax_benefit_Regime_New")}</option>
          </select>
          <p className="fy-field-hint">{t("Tool_home_loan_tax_benefit_RegimeHint")}</p>
        </div>
        <div className="fy-field">
          <label>{t("Tool_home_loan_tax_benefit_LabelSlab")}</label>
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
        title={t("Tool_home_loan_tax_benefit_ScenarioTitle")}
        subtitle={t("Tool_home_loan_tax_benefit_ScenarioSubtitle")}
        scenarios={scenarios}
      />
      <WorkedExample
        title={t("Tool_home_loan_tax_benefit_ExampleTitle")}
        subtitle={t("Tool_home_loan_tax_benefit_ExampleSubtitle")}
        steps={exampleSteps}
      />
    </ToolPageShell>
  );
}
