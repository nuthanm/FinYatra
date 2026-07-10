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
import { calculatePropertyCapitalGains } from "@/lib/finance/propertyCapitalGains";
import { inr, percent } from "@/lib/finance/format";
import { getTool } from "@/lib/config/tools";
import { propertyCapitalGainsInfo } from "@/lib/tool-page-content";

export function PropertyCapitalGainsCalculator() {
  const t = useT();
  const tool = getTool("property-capital-gains")!;

  const [buyPrice, setBuyPrice] = useState(50_00_000);
  const [sellPrice, setSellPrice] = useState(80_00_000);
  const [holdingMonths, setHoldingMonths] = useState(36);
  const [exemption, setExemption] = useState(0);

  const exampleSteps = useMemo(
    () => [
      t("Tool_property_capital_gains_ExampleStep_1"),
      t("Tool_property_capital_gains_ExampleStep_2"),
      t("Tool_property_capital_gains_ExampleStep_3"),
      t("Tool_property_capital_gains_ExampleStep_4"),
      t("Tool_property_capital_gains_ExampleStep_5"),
    ],
    [t],
  );

  const { summaryCards, scenarios } = useMemo(() => {
    const result = calculatePropertyCapitalGains({
      buyPrice,
      sellPrice,
      holdingMonths,
      exemptionAmount: exemption,
    });
    const noExempt = calculatePropertyCapitalGains({
      buyPrice,
      sellPrice,
      holdingMonths,
      exemptionAmount: 0,
    });
    const withExempt = calculatePropertyCapitalGains({
      buyPrice,
      sellPrice,
      holdingMonths,
      exemptionAmount: Math.max(exemption, Math.round(result.gain * 0.4)),
    });

    return {
      summaryCards: [
        {
          label: t("Tool_property_capital_gains_Result_Gain"),
          value: inr(result.gain),
          footnote: result.belowThreshold
            ? t("Tool_property_capital_gains_Result_BelowThreshold")
            : t("Tool_property_capital_gains_Result_LongTerm"),
          variant: "primary" as const,
        },
        {
          label: t("Tool_property_capital_gains_Result_Taxable"),
          value: inr(result.taxableGain),
          footnote: t(
            "Tool_property_capital_gains_Result_TaxableFootnote",
            inr(result.exemptionApplied),
          ),
        },
        {
          label: t("Tool_property_capital_gains_Result_Tax"),
          value: inr(result.taxAmount),
          footnote: t(
            "Tool_property_capital_gains_Result_TaxFootnote",
            percent(result.taxRatePercent),
          ),
          variant: "volatile" as const,
        },
      ],
      scenarios: [
        {
          name: t("Tool_property_capital_gains_Scenario_NoExempt"),
          primaryLabel: t("Tool_property_capital_gains_Result_Tax"),
          primaryValue: inr(noExempt.taxAmount),
          secondaryLabel: t("Tool_property_capital_gains_Result_Taxable"),
          secondaryValue: inr(noExempt.taxableGain),
          variant: "worst" as const,
        },
        {
          name: t("Common_Scenario_Base"),
          primaryLabel: t("Tool_property_capital_gains_Result_Tax"),
          primaryValue: inr(result.taxAmount),
          secondaryLabel: t("Tool_property_capital_gains_Result_Gain"),
          secondaryValue: inr(result.gain),
          variant: "base" as const,
        },
        {
          name: t("Tool_property_capital_gains_Scenario_WithExempt"),
          primaryLabel: t("Tool_property_capital_gains_Result_Tax"),
          primaryValue: inr(withExempt.taxAmount),
          secondaryLabel: t("Tool_property_capital_gains_Result_Taxable"),
          secondaryValue: inr(withExempt.taxableGain),
          variant: "best" as const,
        },
      ],
    };
  }, [buyPrice, sellPrice, holdingMonths, exemption, t]);

  return (
    <ToolPageShell
      title={t(tool.titleKey)}
      subtitle={t("Tool_property_capital_gains_Subtitle")}
      description={t(tool.descriptionKey)}
      icon={tool.icon}
      educate={
        <>
          <div className="fy-info-box">
            <strong>{t("Common_WhatYouLearn")}</strong>
            <p>{t("Tool_property_capital_gains_LearnText")}</p>
          </div>
          <FormulaCard
            title={t("Common_Formula")}
            code={"gain = sell − buy\nLTCG if held ≥ 24 months → ~12.5%\n− Sec 54/54EC exemption"}
            note={t("Tool_property_capital_gains_FormulaNote")}
          />
        </>
      }
      below={<ToolInfoPanel info={propertyCapitalGainsInfo(t)} />}
    >
      <div className="fy-form-card">
        <h3>{t("Common_YourInputs")}</h3>
        <div className="fy-field">
          <label>{t("Tool_property_capital_gains_LabelBuy")}</label>
          <input
            type="number"
            min={0}
            step={100000}
            inputMode="decimal"
            value={buyPrice}
            onChange={(e) => setBuyPrice(Math.max(0, Number(e.target.value) || 0))}
          />
        </div>
        <div className="fy-field">
          <label>{t("Tool_property_capital_gains_LabelSell")}</label>
          <input
            type="number"
            min={0}
            step={100000}
            inputMode="decimal"
            value={sellPrice}
            onChange={(e) => setSellPrice(Math.max(0, Number(e.target.value) || 0))}
          />
        </div>
        <div className="fy-field">
          <label>{t("Tool_property_capital_gains_LabelHolding")}</label>
          <input
            type="number"
            min={0}
            step={1}
            inputMode="numeric"
            value={holdingMonths}
            onChange={(e) =>
              setHoldingMonths(Math.max(0, Number(e.target.value) || 0))
            }
          />
          <p className="fy-field-hint">{t("Tool_property_capital_gains_HoldingHint")}</p>
        </div>
        <div className="fy-field">
          <label>{t("Tool_property_capital_gains_LabelExemption")}</label>
          <input
            type="number"
            min={0}
            step={10000}
            inputMode="decimal"
            value={exemption}
            onChange={(e) => setExemption(Math.max(0, Number(e.target.value) || 0))}
          />
          <p className="fy-field-hint">{t("Tool_property_capital_gains_ExemptionHint")}</p>
        </div>
        <button type="button" className="fy-btn-calc">
          {t("Common_Calculate")}
        </button>
      </div>

      <ResultSummaryCards cards={summaryCards} />
      <ScenarioCompare
        title={t("Tool_property_capital_gains_ScenarioTitle")}
        subtitle={t("Tool_property_capital_gains_ScenarioSubtitle")}
        scenarios={scenarios}
      />
      <WorkedExample
        title={t("Tool_property_capital_gains_ExampleTitle")}
        subtitle={t("Tool_property_capital_gains_ExampleSubtitle")}
        steps={exampleSteps}
      />
    </ToolPageShell>
  );
}
