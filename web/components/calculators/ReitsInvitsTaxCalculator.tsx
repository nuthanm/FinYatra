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
import { calculateReitsInvitsTax } from "@/lib/finance/reitsInvitsTax";
import { inr, percent } from "@/lib/finance/format";
import { getTool } from "@/lib/config/tools";
import { reitsInvitsTaxInfo } from "@/lib/tool-page-content";

export function ReitsInvitsTaxCalculator() {
  const t = useT();
  const tool = getTool("reits-invits-tax")!;

  const [interestComponent, setInterestComponent] = useState(40_000);
  const [dividendComponent, setDividendComponent] = useState(20_000);
  const [otherComponent, setOtherComponent] = useState(10_000);
  const [taxSlab, setTaxSlab] = useState(30);
  const [dividendTaxable, setDividendTaxable] = useState(true);

  const exampleSteps = useMemo(
    () => [
      t("Tool_reits_invits_tax_ExampleStep_1"),
      t("Tool_reits_invits_tax_ExampleStep_2"),
      t("Tool_reits_invits_tax_ExampleStep_3"),
      t("Tool_reits_invits_tax_ExampleStep_4"),
      t("Tool_reits_invits_tax_ExampleStep_5"),
    ],
    [t],
  );

  const { summaryCards, scenarios } = useMemo(() => {
    const input = {
      interestComponent,
      dividendComponent,
      otherComponent,
      taxSlabPercent: taxSlab,
      dividendTaxable,
    };
    const result = calculateReitsInvitsTax(input);
    const divExempt = calculateReitsInvitsTax({ ...input, dividendTaxable: false });
    const highSlab = calculateReitsInvitsTax({ ...input, taxSlabPercent: 30 });

    return {
      summaryCards: [
        {
          label: t("Tool_reits_invits_tax_Result_TotalTax"),
          value: inr(result.totalTax),
          footnote: t("Tool_reits_invits_tax_Result_TotalTaxFootnote", percent(taxSlab, 0)),
          variant: "primary" as const,
        },
        {
          label: t("Tool_reits_invits_tax_Result_Net"),
          value: inr(result.netDistribution),
          footnote: t("Tool_reits_invits_tax_Result_NetFootnote", inr(result.totalDistribution)),
          variant: "secure" as const,
        },
        {
          label: t("Tool_reits_invits_tax_Result_InterestTax"),
          value: inr(result.taxOnInterest + result.taxOnOther),
          footnote: t(
            "Tool_reits_invits_tax_Result_InterestTaxFootnote",
            inr(result.taxOnDividend),
          ),
        },
      ],
      scenarios: [
        {
          name: t("Tool_reits_invits_tax_Scenario_DivExempt"),
          primaryLabel: t("Tool_reits_invits_tax_Result_TotalTax"),
          primaryValue: inr(divExempt.totalTax),
          secondaryLabel: t("Tool_reits_invits_tax_Result_Net"),
          secondaryValue: inr(divExempt.netDistribution),
          variant: "best" as const,
        },
        {
          name: t("Common_Scenario_Base"),
          primaryLabel: t("Tool_reits_invits_tax_Result_TotalTax"),
          primaryValue: inr(result.totalTax),
          secondaryLabel: t("Tool_reits_invits_tax_Result_Net"),
          secondaryValue: inr(result.netDistribution),
          variant: "base" as const,
        },
        {
          name: t("Tool_reits_invits_tax_Scenario_High"),
          primaryLabel: t("Tool_reits_invits_tax_Result_TotalTax"),
          primaryValue: inr(highSlab.totalTax),
          secondaryLabel: t("Tool_reits_invits_tax_Result_Net"),
          secondaryValue: inr(highSlab.netDistribution),
          variant: "worst" as const,
        },
      ],
    };
  }, [interestComponent, dividendComponent, otherComponent, taxSlab, dividendTaxable, t]);

  return (
    <ToolPageShell
      title={t(tool.titleKey)}
      subtitle={t("Tool_reits_invits_tax_Subtitle")}
      description={t(tool.descriptionKey)}
      icon={tool.icon}
      educate={
        <>
          <div className="fy-info-box">
            <strong>{t("Common_WhatYouLearn")}</strong>
            <p>{t("Tool_reits_invits_tax_LearnText")}</p>
          </div>
          <FormulaCard
            title={t("Common_Formula")}
            code={"Tax ≈ (interest + other + ?div) × slab%\nNet = distribution − tax"}
            note={t("Tool_reits_invits_tax_FormulaNote")}
          />
        </>
      }
      below={<ToolInfoPanel info={reitsInvitsTaxInfo(t)} />}
    >
      <div className="fy-form-card">
        <h3>{t("Common_YourInputs")}</h3>
        <div className="fy-field">
          <label>{t("Tool_reits_invits_tax_LabelInterest")}</label>
          <input
            type="number"
            min={0}
            step={1000}
            inputMode="decimal"
            value={interestComponent}
            onChange={(e) => setInterestComponent(Math.max(0, Number(e.target.value) || 0))}
          />
        </div>
        <div className="fy-field">
          <label>{t("Tool_reits_invits_tax_LabelDividend")}</label>
          <input
            type="number"
            min={0}
            step={1000}
            inputMode="decimal"
            value={dividendComponent}
            onChange={(e) => setDividendComponent(Math.max(0, Number(e.target.value) || 0))}
          />
        </div>
        <div className="fy-field">
          <label>{t("Tool_reits_invits_tax_LabelOther")}</label>
          <input
            type="number"
            min={0}
            step={1000}
            inputMode="decimal"
            value={otherComponent}
            onChange={(e) => setOtherComponent(Math.max(0, Number(e.target.value) || 0))}
          />
        </div>
        <div className="fy-field">
          <label>{t("Tool_reits_invits_tax_LabelSlab")}</label>
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
        <div className="fy-field">
          <label>{t("Tool_reits_invits_tax_LabelDivTaxable")}</label>
          <select
            value={dividendTaxable ? "yes" : "no"}
            onChange={(e) => setDividendTaxable(e.target.value === "yes")}
          >
            <option value="yes">{t("Tool_reits_invits_tax_Div_Yes")}</option>
            <option value="no">{t("Tool_reits_invits_tax_Div_No")}</option>
          </select>
        </div>
        <button type="button" className="fy-btn-calc">
          {t("Common_Calculate")}
        </button>
      </div>

      <ResultSummaryCards cards={summaryCards} />
      <ScenarioCompare
        title={t("Tool_reits_invits_tax_ScenarioTitle")}
        subtitle={t("Tool_reits_invits_tax_ScenarioSubtitle")}
        scenarios={scenarios}
      />
      <WorkedExample
        title={t("Tool_reits_invits_tax_ExampleTitle")}
        subtitle={t("Tool_reits_invits_tax_ExampleSubtitle")}
        steps={exampleSteps}
      />
    </ToolPageShell>
  );
}
