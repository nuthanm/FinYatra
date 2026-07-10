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
  calculatePresumptiveTax,
  type PresumptiveScheme,
} from "@/lib/finance/presumptiveTax";
import { inr, percent } from "@/lib/finance/format";
import { getTool } from "@/lib/config/tools";
import { presumptiveTaxInfo } from "@/lib/tool-page-content";

const SCHEMES: PresumptiveScheme[] = ["44ad_digital", "44ad_other", "44ada"];

export function PresumptiveTaxCalculator() {
  const t = useT();
  const tool = getTool("presumptive-tax")!;

  const [turnover, setTurnover] = useState(50_00_000);
  const [scheme, setScheme] = useState<PresumptiveScheme>("44ad_other");
  const [taxSlab, setTaxSlab] = useState(30);

  const exampleSteps = useMemo(
    () => [
      t("Tool_presumptive_tax_ExampleStep_1"),
      t("Tool_presumptive_tax_ExampleStep_2"),
      t("Tool_presumptive_tax_ExampleStep_3"),
      t("Tool_presumptive_tax_ExampleStep_4"),
      t("Tool_presumptive_tax_ExampleStep_5"),
    ],
    [t],
  );

  const { summaryCards, scenarios } = useMemo(() => {
    const result = calculatePresumptiveTax({ turnover, scheme, taxSlabPercent: taxSlab });
    const digital = calculatePresumptiveTax({
      turnover,
      scheme: "44ad_digital",
      taxSlabPercent: taxSlab,
    });
    const ada = calculatePresumptiveTax({
      turnover,
      scheme: "44ada",
      taxSlabPercent: taxSlab,
    });

    return {
      summaryCards: [
        {
          label: t("Tool_presumptive_tax_Result_Income"),
          value: inr(result.presumptiveIncome),
          footnote: t(
            "Tool_presumptive_tax_Result_IncomeFootnote",
            percent(result.presumptiveRatePercent, 0),
          ),
          variant: "primary" as const,
        },
        {
          label: t("Tool_presumptive_tax_Result_Tax"),
          value: inr(result.estimatedTax),
          footnote: t("Tool_presumptive_tax_Result_TaxFootnote", percent(taxSlab, 0)),
          variant: "volatile" as const,
        },
        {
          label: t("Tool_presumptive_tax_Result_Turnover"),
          value: inr(result.turnover),
          footnote: t("Tool_presumptive_tax_Result_TurnoverFootnote"),
        },
      ],
      scenarios: [
        {
          name: t("Tool_presumptive_tax_Scenario_Digital"),
          primaryLabel: t("Tool_presumptive_tax_Result_Income"),
          primaryValue: inr(digital.presumptiveIncome),
          secondaryLabel: t("Tool_presumptive_tax_Result_Tax"),
          secondaryValue: inr(digital.estimatedTax),
          variant: "best" as const,
        },
        {
          name: t("Common_Scenario_Base"),
          primaryLabel: t("Tool_presumptive_tax_Result_Income"),
          primaryValue: inr(result.presumptiveIncome),
          secondaryLabel: t("Tool_presumptive_tax_Result_Tax"),
          secondaryValue: inr(result.estimatedTax),
          variant: "base" as const,
        },
        {
          name: t("Tool_presumptive_tax_Scenario_Ada"),
          primaryLabel: t("Tool_presumptive_tax_Result_Income"),
          primaryValue: inr(ada.presumptiveIncome),
          secondaryLabel: t("Tool_presumptive_tax_Result_Tax"),
          secondaryValue: inr(ada.estimatedTax),
          variant: "worst" as const,
        },
      ],
    };
  }, [turnover, scheme, taxSlab, t]);

  return (
    <ToolPageShell
      title={t(tool.titleKey)}
      subtitle={t("Tool_presumptive_tax_Subtitle")}
      description={t(tool.descriptionKey)}
      icon={tool.icon}
      educate={
        <>
          <div className="fy-info-box">
            <strong>{t("Common_WhatYouLearn")}</strong>
            <p>{t("Tool_presumptive_tax_LearnText")}</p>
          </div>
          <FormulaCard
            title={t("Common_Formula")}
            code={"income = turnover × rate%\n44AD: 6% digital / 8% other\n44ADA: 50%\ntax ≈ income × slab%"}
            note={t("Tool_presumptive_tax_FormulaNote")}
          />
        </>
      }
      below={<ToolInfoPanel info={presumptiveTaxInfo(t)} />}
    >
      <div className="fy-form-card">
        <h3>{t("Common_YourInputs")}</h3>
        <div className="fy-field">
          <label>{t("Tool_presumptive_tax_LabelTurnover")}</label>
          <input
            type="number"
            min={0}
            step={10000}
            inputMode="decimal"
            value={turnover}
            onChange={(e) => setTurnover(Math.max(0, Number(e.target.value) || 0))}
          />
        </div>
        <div className="fy-field">
          <label>{t("Tool_presumptive_tax_LabelScheme")}</label>
          <select value={scheme} onChange={(e) => setScheme(e.target.value as PresumptiveScheme)}>
            {SCHEMES.map((s) => (
              <option key={s} value={s}>
                {t(`Tool_presumptive_tax_Scheme_${s === "44ad_digital" ? "Digital" : s === "44ad_other" ? "Other" : "Ada"}`)}
              </option>
            ))}
          </select>
        </div>
        <div className="fy-field">
          <label>{t("Tool_presumptive_tax_LabelSlab")}</label>
          <input
            type="number"
            min={0}
            max={42}
            step={1}
            inputMode="decimal"
            value={taxSlab}
            onChange={(e) => setTaxSlab(Math.max(0, Number(e.target.value) || 0))}
          />
          <p className="fy-field-hint">{t("Tool_presumptive_tax_SlabHint")}</p>
        </div>
        <button type="button" className="fy-btn-calc">
          {t("Common_Calculate")}
        </button>
      </div>

      <ResultSummaryCards cards={summaryCards} />
      <ScenarioCompare
        title={t("Tool_presumptive_tax_ScenarioTitle")}
        subtitle={t("Tool_presumptive_tax_ScenarioSubtitle")}
        scenarios={scenarios}
      />
      <WorkedExample
        title={t("Tool_presumptive_tax_ExampleTitle")}
        subtitle={t("Tool_presumptive_tax_ExampleSubtitle")}
        steps={exampleSteps}
      />
    </ToolPageShell>
  );
}
