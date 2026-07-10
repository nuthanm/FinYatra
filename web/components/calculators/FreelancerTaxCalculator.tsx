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
  calculateFreelancerTax,
  PRESUMPTIVE_44ADA_PCT,
} from "@/lib/finance/freelancerTax";
import { inr, percent } from "@/lib/finance/format";
import { getTool } from "@/lib/config/tools";
import { freelancerTaxInfo } from "@/lib/tool-page-content";

export function FreelancerTaxCalculator() {
  const t = useT();
  const tool = getTool("freelancer-tax")!;

  const [receipts, setReceipts] = useState(1_200_000);
  const [expenses, setExpenses] = useState(400_000);
  const [usePresumptive, setUsePresumptive] = useState(true);
  const [taxSlab, setTaxSlab] = useState(30);

  const exampleSteps = useMemo(
    () => [
      t("Tool_freelancer_tax_ExampleStep_1"),
      t("Tool_freelancer_tax_ExampleStep_2"),
      t("Tool_freelancer_tax_ExampleStep_3"),
      t("Tool_freelancer_tax_ExampleStep_4"),
      t("Tool_freelancer_tax_ExampleStep_5"),
    ],
    [t],
  );

  const { summaryCards, scenarios, result } = useMemo(() => {
    const result = calculateFreelancerTax({
      receipts,
      expenses,
      usePresumptive44ADA: usePresumptive,
      taxSlabPercent: taxSlab,
    });
    const books = calculateFreelancerTax({
      receipts,
      expenses,
      usePresumptive44ADA: false,
      taxSlabPercent: taxSlab,
    });
    const presumptive = calculateFreelancerTax({
      receipts,
      expenses,
      usePresumptive44ADA: true,
      taxSlabPercent: taxSlab,
    });

    return {
      result,
      summaryCards: [
        {
          label: t("Tool_freelancer_tax_Result_Taxable"),
          value: inr(result.taxableProfit),
          footnote: usePresumptive
            ? t("Tool_freelancer_tax_Result_PresumptiveFootnote", percent(PRESUMPTIVE_44ADA_PCT))
            : t("Tool_freelancer_tax_Result_BooksFootnote"),
          variant: "primary" as const,
        },
        {
          label: t("Tool_freelancer_tax_Result_Tax"),
          value: inr(result.estimatedTax),
          footnote: t("Tool_freelancer_tax_Result_TaxFootnote", percent(taxSlab)),
          variant: "volatile" as const,
        },
        {
          label: t("Tool_freelancer_tax_Result_ActualProfit"),
          value: inr(result.actualProfit),
          footnote: t("Tool_freelancer_tax_Result_ActualFootnote"),
        },
      ],
      scenarios: [
        {
          name: t("Tool_freelancer_tax_Scenario_Presumptive"),
          primaryLabel: t("Tool_freelancer_tax_Result_Tax"),
          primaryValue: inr(presumptive.estimatedTax),
          secondaryLabel: t("Tool_freelancer_tax_Result_Taxable"),
          secondaryValue: inr(presumptive.taxableProfit),
          variant: presumptive.estimatedTax <= books.estimatedTax ? "best" : "worst",
        },
        {
          name: t("Common_Scenario_Base"),
          primaryLabel: t("Tool_freelancer_tax_Result_Tax"),
          primaryValue: inr(result.estimatedTax),
          secondaryLabel: t("Tool_freelancer_tax_Result_Taxable"),
          secondaryValue: inr(result.taxableProfit),
          variant: "base",
        },
        {
          name: t("Tool_freelancer_tax_Scenario_Books"),
          primaryLabel: t("Tool_freelancer_tax_Result_Tax"),
          primaryValue: inr(books.estimatedTax),
          secondaryLabel: t("Tool_freelancer_tax_Result_ActualProfit"),
          secondaryValue: inr(books.actualProfit),
          variant: books.estimatedTax <= presumptive.estimatedTax ? "best" : "worst",
        },
      ],
    };
  }, [receipts, expenses, usePresumptive, taxSlab, t]);

  return (
    <ToolPageShell
      title={t(tool.titleKey)}
      subtitle={t("Tool_freelancer_tax_Subtitle")}
      description={t(tool.descriptionKey)}
      icon={tool.icon}
      educate={
        <>
          <div className="fy-info-box">
            <strong>{t("Common_WhatYouLearn")}</strong>
            <p>{t("Tool_freelancer_tax_LearnText")}</p>
          </div>
          <FormulaCard
            title={t("Common_Formula")}
            code={"Profit = Receipts − Expenses\n44ADA: Taxable = 50% of receipts\nTax ≈ Taxable × slab"}
            note={t("Tool_freelancer_tax_FormulaNote")}
          />
        </>
      }
      below={<ToolInfoPanel info={freelancerTaxInfo(t)} />}
    >
      <div className="fy-form-card">
        <h3>{t("Common_YourInputs")}</h3>
        <div className="fy-field">
          <label>{t("Tool_freelancer_tax_LabelReceipts")}</label>
          <input
            type="number"
            min={0}
            step={10000}
            inputMode="decimal"
            value={receipts}
            onChange={(e) => setReceipts(Math.max(0, Number(e.target.value) || 0))}
          />
        </div>
        <div className="fy-field">
          <label>{t("Tool_freelancer_tax_LabelExpenses")}</label>
          <input
            type="number"
            min={0}
            step={5000}
            inputMode="decimal"
            value={expenses}
            onChange={(e) => setExpenses(Math.max(0, Number(e.target.value) || 0))}
            disabled={usePresumptive}
          />
          {usePresumptive && (
            <p className="fy-field-hint">{t("Tool_freelancer_tax_ExpensesHint")}</p>
          )}
        </div>
        <div className="fy-field">
          <label>
            <input
              type="checkbox"
              checked={usePresumptive}
              onChange={(e) => setUsePresumptive(e.target.checked)}
            />{" "}
            {t("Tool_freelancer_tax_Label44ADA")}
          </label>
          <p className="fy-field-hint">{t("Tool_freelancer_tax_44ADAHint")}</p>
        </div>
        <div className="fy-field">
          <label>{t("Tool_freelancer_tax_LabelSlab")}</label>
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
        <strong>{t("Tool_freelancer_tax_VerdictTitle")}</strong>
        <p>
          {t(
            "Tool_freelancer_tax_VerdictNote",
            inr(result.taxableProfit),
            inr(result.estimatedTax),
            usePresumptive
              ? t("Tool_freelancer_tax_Mode_Presumptive")
              : t("Tool_freelancer_tax_Mode_Books"),
          )}
        </p>
      </div>

      <ResultSummaryCards cards={summaryCards} />
      <ScenarioCompare
        title={t("Tool_freelancer_tax_ScenarioTitle")}
        subtitle={t("Tool_freelancer_tax_ScenarioSubtitle")}
        scenarios={scenarios}
      />
      <WorkedExample
        title={t("Tool_freelancer_tax_ExampleTitle")}
        subtitle={t("Tool_freelancer_tax_ExampleSubtitle")}
        steps={exampleSteps}
      />
    </ToolPageShell>
  );
}
