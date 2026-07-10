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
import { calculateVariablePayTax } from "@/lib/finance/variablePayTax";
import { inr, percent } from "@/lib/finance/format";
import { getTool } from "@/lib/config/tools";
import { variablePayTaxInfo } from "@/lib/tool-page-content";

export function VariablePayTaxCalculator() {
  const t = useT();
  const tool = getTool("variable-pay-tax")!;

  const [fixed, setFixed] = useState(12_00_000);
  const [variable, setVariable] = useState(3_00_000);
  const [slab, setSlab] = useState(30);

  const exampleSteps = useMemo(
    () => [
      t("Tool_variable_pay_tax_ExampleStep_1"),
      t("Tool_variable_pay_tax_ExampleStep_2"),
      t("Tool_variable_pay_tax_ExampleStep_3"),
      t("Tool_variable_pay_tax_ExampleStep_4"),
      t("Tool_variable_pay_tax_ExampleStep_5"),
    ],
    [t],
  );

  const { summaryCards, scenarios } = useMemo(() => {
    const result = calculateVariablePayTax({
      fixedPay: fixed,
      variablePay: variable,
      taxSlabPercent: slab,
    });
    const noVar = calculateVariablePayTax({
      fixedPay: fixed,
      variablePay: 0,
      taxSlabPercent: slab,
    });
    const higherVar = calculateVariablePayTax({
      fixedPay: fixed,
      variablePay: variable * 1.5,
      taxSlabPercent: slab,
    });

    return {
      summaryCards: [
        {
          label: t("Tool_variable_pay_tax_Result_With"),
          value: inr(result.taxWithVariable),
          footnote: t("Tool_variable_pay_tax_Result_WithFootnote"),
          variant: "primary" as const,
        },
        {
          label: t("Tool_variable_pay_tax_Result_Without"),
          value: inr(result.taxWithoutVariable),
          footnote: t("Tool_variable_pay_tax_Result_WithoutFootnote"),
        },
        {
          label: t("Tool_variable_pay_tax_Result_Extra"),
          value: inr(result.extraTaxOnVariable),
          footnote: t(
            "Tool_variable_pay_tax_Result_ExtraFootnote",
            percent(result.effectiveRateOnVariablePercent),
          ),
          variant: "volatile" as const,
        },
      ],
      scenarios: [
        {
          name: t("Tool_variable_pay_tax_Scenario_NoVar"),
          primaryLabel: t("Tool_variable_pay_tax_Result_With"),
          primaryValue: inr(noVar.taxWithVariable),
          secondaryLabel: t("Tool_variable_pay_tax_Result_Extra"),
          secondaryValue: inr(noVar.extraTaxOnVariable),
          variant: "worst" as const,
        },
        {
          name: t("Common_Scenario_Base"),
          primaryLabel: t("Tool_variable_pay_tax_Result_Extra"),
          primaryValue: inr(result.extraTaxOnVariable),
          secondaryLabel: t("Tool_variable_pay_tax_Result_With"),
          secondaryValue: inr(result.taxWithVariable),
          variant: "base" as const,
        },
        {
          name: t("Tool_variable_pay_tax_Scenario_Higher"),
          primaryLabel: t("Tool_variable_pay_tax_Result_Extra"),
          primaryValue: inr(higherVar.extraTaxOnVariable),
          secondaryLabel: t("Tool_variable_pay_tax_Result_With"),
          secondaryValue: inr(higherVar.taxWithVariable),
          variant: "best" as const,
        },
      ],
    };
  }, [fixed, variable, slab, t]);

  return (
    <ToolPageShell
      title={t(tool.titleKey)}
      subtitle={t("Tool_variable_pay_tax_Subtitle")}
      description={t(tool.descriptionKey)}
      icon={tool.icon}
      educate={
        <>
          <div className="fy-info-box">
            <strong>{t("Common_WhatYouLearn")}</strong>
            <p>{t("Tool_variable_pay_tax_LearnText")}</p>
          </div>
          <FormulaCard
            title={t("Common_Formula")}
            code={"Tax = income × slab% × 1.04\nExtra = tax(fixed+var) − tax(fixed)"}
            note={t("Tool_variable_pay_tax_FormulaNote")}
          />
        </>
      }
      below={<ToolInfoPanel info={variablePayTaxInfo(t)} />}
    >
      <div className="fy-form-card">
        <h3>{t("Common_YourInputs")}</h3>
        <div className="fy-field">
          <label>{t("Tool_variable_pay_tax_LabelFixed")}</label>
          <input
            type="number"
            min={0}
            step={10000}
            inputMode="decimal"
            value={fixed}
            onChange={(e) => setFixed(Math.max(0, Number(e.target.value) || 0))}
          />
        </div>
        <div className="fy-field">
          <label>{t("Tool_variable_pay_tax_LabelVariable")}</label>
          <input
            type="number"
            min={0}
            step={10000}
            inputMode="decimal"
            value={variable}
            onChange={(e) => setVariable(Math.max(0, Number(e.target.value) || 0))}
          />
        </div>
        <div className="fy-field">
          <label>{t("Tool_variable_pay_tax_LabelSlab")}</label>
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
        <button type="button" className="fy-btn-calc">
          {t("Common_Calculate")}
        </button>
      </div>

      <ResultSummaryCards cards={summaryCards} />
      <ScenarioCompare
        title={t("Tool_variable_pay_tax_ScenarioTitle")}
        subtitle={t("Tool_variable_pay_tax_ScenarioSubtitle")}
        scenarios={scenarios}
      />
      <WorkedExample
        title={t("Tool_variable_pay_tax_ExampleTitle")}
        subtitle={t("Tool_variable_pay_tax_ExampleSubtitle")}
        steps={exampleSteps}
      />
    </ToolPageShell>
  );
}
