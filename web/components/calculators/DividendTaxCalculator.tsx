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
import { calculateDividendTax } from "@/lib/finance/dividendTax";
import { inr, percent } from "@/lib/finance/format";
import { getTool } from "@/lib/config/tools";
import { dividendTaxInfo } from "@/lib/tool-page-content";

export function DividendTaxCalculator() {
  const t = useT();
  const tool = getTool("dividend-tax")!;

  const [dividend, setDividend] = useState(1_00_000);
  const [slab, setSlab] = useState(30);
  const [totalIncome, setTotalIncome] = useState(12_00_000);

  const exampleSteps = useMemo(
    () => [
      t("Tool_dividend_tax_ExampleStep_1"),
      t("Tool_dividend_tax_ExampleStep_2"),
      t("Tool_dividend_tax_ExampleStep_3"),
      t("Tool_dividend_tax_ExampleStep_4"),
      t("Tool_dividend_tax_ExampleStep_5"),
    ],
    [t],
  );

  const { summaryCards, scenarios } = useMemo(() => {
    const result = calculateDividendTax({
      dividendIncome: dividend,
      taxSlabPercent: slab,
      totalIncome,
    });
    const lowerSlab = calculateDividendTax({
      dividendIncome: dividend,
      taxSlabPercent: Math.max(0, slab - 10),
      totalIncome,
    });
    const higherSlab = calculateDividendTax({
      dividendIncome: dividend,
      taxSlabPercent: Math.min(42, slab + 5),
      totalIncome,
    });

    return {
      summaryCards: [
        {
          label: t("Tool_dividend_tax_Result_Tax"),
          value: inr(result.totalTax),
          footnote: t(
            "Tool_dividend_tax_Result_TaxFootnote",
            percent(result.effectiveRate, 1),
          ),
          variant: "primary" as const,
        },
        {
          label: t("Tool_dividend_tax_Result_Tds"),
          value: inr(result.illustrativeTds),
          footnote: t("Tool_dividend_tax_Result_TdsFootnote"),
        },
        {
          label: t("Tool_dividend_tax_Result_Surcharge"),
          value: t(`Tool_dividend_tax_Surcharge_${result.surchargeNote}`),
          footnote: t("Tool_dividend_tax_Result_SurchargeFootnote"),
          variant: "volatile" as const,
        },
      ],
      scenarios: [
        {
          name: t("Tool_dividend_tax_Scenario_LowerSlab"),
          primaryLabel: t("Tool_dividend_tax_Result_Tax"),
          primaryValue: inr(lowerSlab.totalTax),
          secondaryLabel: t("Tool_dividend_tax_Result_Tds"),
          secondaryValue: inr(lowerSlab.illustrativeTds),
          variant: "best" as const,
        },
        {
          name: t("Common_Scenario_Base"),
          primaryLabel: t("Tool_dividend_tax_Result_Tax"),
          primaryValue: inr(result.totalTax),
          secondaryLabel: t("Tool_dividend_tax_Result_Surcharge"),
          secondaryValue: t(`Tool_dividend_tax_Surcharge_${result.surchargeNote}`),
          variant: "base" as const,
        },
        {
          name: t("Tool_dividend_tax_Scenario_HigherSlab"),
          primaryLabel: t("Tool_dividend_tax_Result_Tax"),
          primaryValue: inr(higherSlab.totalTax),
          secondaryLabel: t("Tool_dividend_tax_Result_Tds"),
          secondaryValue: inr(higherSlab.illustrativeTds),
          variant: "worst" as const,
        },
      ],
    };
  }, [dividend, slab, totalIncome, t]);

  return (
    <ToolPageShell
      title={t(tool.titleKey)}
      subtitle={t("Tool_dividend_tax_Subtitle")}
      description={t(tool.descriptionKey)}
      icon={tool.icon}
      educate={
        <>
          <div className="fy-info-box">
            <strong>{t("Common_WhatYouLearn")}</strong>
            <p>{t("Tool_dividend_tax_LearnText")}</p>
          </div>
          <FormulaCard
            title={t("Common_Formula")}
            code={"tax = dividend × slab% × 1.04\n(no DDT; TDS @10% if > ₹10k)"}
            note={t("Tool_dividend_tax_FormulaNote")}
          />
        </>
      }
      below={<ToolInfoPanel info={dividendTaxInfo(t)} />}
    >
      <div className="fy-form-card">
        <h3>{t("Common_YourInputs")}</h3>
        <div className="fy-field">
          <label>{t("Tool_dividend_tax_LabelDividend")}</label>
          <input
            type="number"
            min={0}
            step={1000}
            inputMode="decimal"
            value={dividend}
            onChange={(e) => setDividend(Math.max(0, Number(e.target.value) || 0))}
          />
        </div>
        <div className="fy-field">
          <label>{t("Tool_dividend_tax_LabelSlab")}</label>
          <input
            type="number"
            min={0}
            max={42}
            step={1}
            inputMode="decimal"
            value={slab}
            onChange={(e) => setSlab(Math.max(0, Number(e.target.value) || 0))}
          />
        </div>
        <div className="fy-field">
          <label>{t("Tool_dividend_tax_LabelTotalIncome")}</label>
          <input
            type="number"
            min={0}
            step={10000}
            inputMode="decimal"
            value={totalIncome}
            onChange={(e) => setTotalIncome(Math.max(0, Number(e.target.value) || 0))}
          />
          <p className="fy-field-hint">{t("Tool_dividend_tax_TotalIncomeHint")}</p>
        </div>
        <button type="button" className="fy-btn-calc">
          {t("Common_Calculate")}
        </button>
      </div>

      <ResultSummaryCards cards={summaryCards} />
      <ScenarioCompare
        title={t("Tool_dividend_tax_ScenarioTitle")}
        subtitle={t("Tool_dividend_tax_ScenarioSubtitle")}
        scenarios={scenarios}
      />
      <WorkedExample
        title={t("Tool_dividend_tax_ExampleTitle")}
        subtitle={t("Tool_dividend_tax_ExampleSubtitle")}
        steps={exampleSteps}
      />
    </ToolPageShell>
  );
}
