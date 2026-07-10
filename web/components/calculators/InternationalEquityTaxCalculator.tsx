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
import { calculateInternationalEquityTax } from "@/lib/finance/internationalEquityTax";
import { inr, percent } from "@/lib/finance/format";
import { getTool } from "@/lib/config/tools";
import { internationalEquityTaxInfo } from "@/lib/tool-page-content";

export function InternationalEquityTaxCalculator() {
  const t = useT();
  const tool = getTool("international-equity-tax")!;

  const [saleProceeds, setSaleProceeds] = useState(5_00_000);
  const [costOfAcquisition, setCostOfAcquisition] = useState(3_00_000);
  const [holdingMonths, setHoldingMonths] = useState(18);
  const [taxSlab, setTaxSlab] = useState(30);

  const exampleSteps = useMemo(
    () => [
      t("Tool_international_equity_tax_ExampleStep_1"),
      t("Tool_international_equity_tax_ExampleStep_2"),
      t("Tool_international_equity_tax_ExampleStep_3"),
      t("Tool_international_equity_tax_ExampleStep_4"),
      t("Tool_international_equity_tax_ExampleStep_5"),
    ],
    [t],
  );

  const { summaryCards, scenarios } = useMemo(() => {
    const input = { saleProceeds, costOfAcquisition, holdingMonths, taxSlabPercent: taxSlab };
    const result = calculateInternationalEquityTax(input);
    const lowSlab = calculateInternationalEquityTax({ ...input, taxSlabPercent: 10 });
    const highSlab = calculateInternationalEquityTax({ ...input, taxSlabPercent: 30 });

    return {
      summaryCards: [
        {
          label: t("Tool_international_equity_tax_Result_Gain"),
          value: inr(result.gain),
          footnote: t("Tool_international_equity_tax_Result_GainFootnote"),
          variant: "primary" as const,
        },
        {
          label: t("Tool_international_equity_tax_Result_Tax"),
          value: inr(result.totalTax),
          footnote: t(
            "Tool_international_equity_tax_Result_TaxFootnote",
            percent(taxSlab, 0),
            inr(result.cess),
          ),
          variant: "volatile" as const,
        },
        {
          label: t("Tool_international_equity_tax_Result_Loss"),
          value: inr(result.loss),
          footnote: t("Tool_international_equity_tax_Result_LossFootnote"),
        },
      ],
      scenarios: [
        {
          name: t("Tool_international_equity_tax_Scenario_Low"),
          primaryLabel: t("Tool_international_equity_tax_Result_Tax"),
          primaryValue: inr(lowSlab.totalTax),
          secondaryLabel: t("Tool_international_equity_tax_Result_Gain"),
          secondaryValue: inr(lowSlab.gain),
          variant: "best" as const,
        },
        {
          name: t("Common_Scenario_Base"),
          primaryLabel: t("Tool_international_equity_tax_Result_Tax"),
          primaryValue: inr(result.totalTax),
          secondaryLabel: t("Tool_international_equity_tax_Result_Gain"),
          secondaryValue: inr(result.gain),
          variant: "base" as const,
        },
        {
          name: t("Tool_international_equity_tax_Scenario_High"),
          primaryLabel: t("Tool_international_equity_tax_Result_Tax"),
          primaryValue: inr(highSlab.totalTax),
          secondaryLabel: t("Tool_international_equity_tax_Result_Gain"),
          secondaryValue: inr(highSlab.gain),
          variant: "worst" as const,
        },
      ],
    };
  }, [saleProceeds, costOfAcquisition, holdingMonths, taxSlab, t]);

  return (
    <ToolPageShell
      title={t(tool.titleKey)}
      subtitle={t("Tool_international_equity_tax_Subtitle")}
      description={t(tool.descriptionKey)}
      icon={tool.icon}
      educate={
        <>
          <div className="fy-info-box">
            <strong>{t("Common_WhatYouLearn")}</strong>
            <p>{t("Tool_international_equity_tax_LearnText")}</p>
          </div>
          <FormulaCard
            title={t("Common_Formula")}
            code={"Gain = sale − cost\nTax ≈ gain × slab% (+ 4% cess)\nEducational debt/other treatment"}
            note={t("Tool_international_equity_tax_FormulaNote")}
          />
        </>
      }
      below={<ToolInfoPanel info={internationalEquityTaxInfo(t)} />}
    >
      <div className="fy-form-card">
        <h3>{t("Common_YourInputs")}</h3>
        <div className="fy-field">
          <label>{t("Tool_international_equity_tax_LabelSale")}</label>
          <input
            type="number"
            min={0}
            step={10000}
            inputMode="decimal"
            value={saleProceeds}
            onChange={(e) => setSaleProceeds(Math.max(0, Number(e.target.value) || 0))}
          />
        </div>
        <div className="fy-field">
          <label>{t("Tool_international_equity_tax_LabelCost")}</label>
          <input
            type="number"
            min={0}
            step={10000}
            inputMode="decimal"
            value={costOfAcquisition}
            onChange={(e) => setCostOfAcquisition(Math.max(0, Number(e.target.value) || 0))}
          />
        </div>
        <div className="fy-field">
          <label>{t("Tool_international_equity_tax_LabelMonths")}</label>
          <input
            type="number"
            min={0}
            max={600}
            step={1}
            inputMode="decimal"
            value={holdingMonths}
            onChange={(e) => setHoldingMonths(Math.max(0, Number(e.target.value) || 0))}
          />
        </div>
        <div className="fy-field">
          <label>{t("Tool_international_equity_tax_LabelSlab")}</label>
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
        title={t("Tool_international_equity_tax_ScenarioTitle")}
        subtitle={t("Tool_international_equity_tax_ScenarioSubtitle")}
        scenarios={scenarios}
      />
      <WorkedExample
        title={t("Tool_international_equity_tax_ExampleTitle")}
        subtitle={t("Tool_international_equity_tax_ExampleSubtitle")}
        steps={exampleSteps}
      />
    </ToolPageShell>
  );
}
