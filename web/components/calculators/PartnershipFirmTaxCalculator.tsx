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
  calculatePartnershipFirmTax,
  PARTNERSHIP_FLAT_RATE,
  PARTNERSHIP_SURCHARGE_THRESHOLD,
} from "@/lib/finance/partnershipFirmTax";
import { inr, percent } from "@/lib/finance/format";
import { getTool } from "@/lib/config/tools";
import { partnershipFirmTaxInfo } from "@/lib/tool-page-content";

export function PartnershipFirmTaxCalculator() {
  const t = useT();
  const tool = getTool("partnership-firm-tax")!;

  const [firmProfit, setFirmProfit] = useState(50_00_000);
  const [partnerRemuneration, setPartnerRemuneration] = useState(10_00_000);

  const exampleSteps = useMemo(
    () => [
      t("Tool_partnership_firm_tax_ExampleStep_1"),
      t("Tool_partnership_firm_tax_ExampleStep_2"),
      t("Tool_partnership_firm_tax_ExampleStep_3"),
      t("Tool_partnership_firm_tax_ExampleStep_4"),
      t("Tool_partnership_firm_tax_ExampleStep_5"),
    ],
    [t],
  );

  const { summaryCards, scenarios } = useMemo(() => {
    const result = calculatePartnershipFirmTax({ firmProfit, partnerRemuneration });
    const low = calculatePartnershipFirmTax({
      firmProfit: Math.round(firmProfit * 0.5),
      partnerRemuneration,
    });
    const high = calculatePartnershipFirmTax({
      firmProfit: Math.max(firmProfit, PARTNERSHIP_SURCHARGE_THRESHOLD + 1),
      partnerRemuneration,
    });

    return {
      summaryCards: [
        {
          label: t("Tool_partnership_firm_tax_Result_Total"),
          value: inr(result.totalTax),
          footnote: t(
            "Tool_partnership_firm_tax_Result_TotalFootnote",
            percent(result.effectiveRatePercent, 1),
          ),
          variant: "primary" as const,
        },
        {
          label: t("Tool_partnership_firm_tax_Result_Base"),
          value: inr(result.baseTax),
          footnote: t("Tool_partnership_firm_tax_Result_BaseFootnote", String(PARTNERSHIP_FLAT_RATE)),
        },
        {
          label: t("Tool_partnership_firm_tax_Result_Surcharge"),
          value: inr(result.surcharge + result.cess),
          footnote: t(
            "Tool_partnership_firm_tax_Result_SurchargeFootnote",
            inr(result.surcharge),
            inr(result.cess),
          ),
          variant: result.surcharge > 0 ? ("volatile" as const) : ("default" as const),
        },
      ],
      scenarios: [
        {
          name: t("Tool_partnership_firm_tax_Scenario_Low"),
          primaryLabel: t("Tool_partnership_firm_tax_Result_Total"),
          primaryValue: inr(low.totalTax),
          secondaryLabel: t("Tool_partnership_firm_tax_Result_Base"),
          secondaryValue: inr(low.baseTax),
          variant: "best" as const,
        },
        {
          name: t("Common_Scenario_Base"),
          primaryLabel: t("Tool_partnership_firm_tax_Result_Total"),
          primaryValue: inr(result.totalTax),
          secondaryLabel: t("Tool_partnership_firm_tax_Result_Base"),
          secondaryValue: inr(result.baseTax),
          variant: "base" as const,
        },
        {
          name: t("Tool_partnership_firm_tax_Scenario_Surcharge"),
          primaryLabel: t("Tool_partnership_firm_tax_Result_Total"),
          primaryValue: inr(high.totalTax),
          secondaryLabel: t("Tool_partnership_firm_tax_Result_Surcharge"),
          secondaryValue: inr(high.surcharge),
          variant: "worst" as const,
        },
      ],
    };
  }, [firmProfit, partnerRemuneration, t]);

  return (
    <ToolPageShell
      title={t(tool.titleKey)}
      subtitle={t("Tool_partnership_firm_tax_Subtitle")}
      description={t(tool.descriptionKey)}
      icon={tool.icon}
      educate={
        <>
          <div className="fy-info-box">
            <strong>{t("Common_WhatYouLearn")}</strong>
            <p>{t("Tool_partnership_firm_tax_LearnText")}</p>
          </div>
          <FormulaCard
            title={t("Common_Formula")}
            code={"Base = profit × 30%\nSurcharge if profit > ₹1 Cr\n+ 4% cess"}
            note={t("Tool_partnership_firm_tax_FormulaNote")}
          />
        </>
      }
      below={<ToolInfoPanel info={partnershipFirmTaxInfo(t)} />}
    >
      <div className="fy-form-card">
        <h3>{t("Common_YourInputs")}</h3>
        <div className="fy-field">
          <label>{t("Tool_partnership_firm_tax_LabelProfit")}</label>
          <input
            type="number"
            min={0}
            step={100000}
            inputMode="decimal"
            value={firmProfit}
            onChange={(e) => setFirmProfit(Math.max(0, Number(e.target.value) || 0))}
          />
        </div>
        <div className="fy-field">
          <label>{t("Tool_partnership_firm_tax_LabelRemuneration")}</label>
          <input
            type="number"
            min={0}
            step={50000}
            inputMode="decimal"
            value={partnerRemuneration}
            onChange={(e) => setPartnerRemuneration(Math.max(0, Number(e.target.value) || 0))}
          />
          <p className="fy-field-hint">{t("Tool_partnership_firm_tax_RemunerationHint")}</p>
        </div>
        <button type="button" className="fy-btn-calc">
          {t("Common_Calculate")}
        </button>
      </div>

      <ResultSummaryCards cards={summaryCards} />
      <ScenarioCompare
        title={t("Tool_partnership_firm_tax_ScenarioTitle")}
        subtitle={t("Tool_partnership_firm_tax_ScenarioSubtitle")}
        scenarios={scenarios}
      />
      <WorkedExample
        title={t("Tool_partnership_firm_tax_ExampleTitle")}
        subtitle={t("Tool_partnership_firm_tax_ExampleSubtitle")}
        steps={exampleSteps}
      />
    </ToolPageShell>
  );
}
