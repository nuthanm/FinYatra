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
import { calculateGoldEtfVsSgb } from "@/lib/finance/goldEtfVsSgb";
import { inr, percent } from "@/lib/finance/format";
import { getTool } from "@/lib/config/tools";
import { goldEtfVsSgbInfo } from "@/lib/tool-page-content";

export function GoldEtfVsSgbCalculator() {
  const t = useT();
  const tool = getTool("gold-etf-vs-sgb")!;

  const [investment, setInvestment] = useState(1_00_000);
  const [goldPrice, setGoldPrice] = useState(7_000);
  const [endPrice, setEndPrice] = useState(10_000);
  const [years, setYears] = useState(8);

  const exampleSteps = useMemo(
    () => [
      t("Tool_gold_etf_vs_sgb_ExampleStep_1"),
      t("Tool_gold_etf_vs_sgb_ExampleStep_2"),
      t("Tool_gold_etf_vs_sgb_ExampleStep_3"),
      t("Tool_gold_etf_vs_sgb_ExampleStep_4"),
      t("Tool_gold_etf_vs_sgb_ExampleStep_5"),
    ],
    [t],
  );

  const { summaryCards, scenarios, result } = useMemo(() => {
    const result = calculateGoldEtfVsSgb({
      investment,
      goldPricePerGram: goldPrice,
      endGoldPricePerGram: endPrice,
      years,
    });
    const flatGold = calculateGoldEtfVsSgb({
      investment,
      goldPricePerGram: goldPrice,
      endGoldPricePerGram: goldPrice,
      years,
    });
    const higherGold = calculateGoldEtfVsSgb({
      investment,
      goldPricePerGram: goldPrice,
      endGoldPricePerGram: Math.round(endPrice * 1.2),
      years,
    });

    return {
      result,
      summaryCards: [
        {
          label: t("Tool_gold_etf_vs_sgb_Result_Sgb"),
          value: inr(result.sgbTotalReturn),
          footnote: t("Tool_gold_etf_vs_sgb_Result_SgbFootnote", percent(result.sgbCagrPercent, 2)),
          variant: "primary" as const,
        },
        {
          label: t("Tool_gold_etf_vs_sgb_Result_Etf"),
          value: inr(result.etfNetValue),
          footnote: t("Tool_gold_etf_vs_sgb_Result_EtfFootnote", percent(result.etfCagrPercent, 2)),
          variant: "secure" as const,
        },
        {
          label: t("Tool_gold_etf_vs_sgb_Result_Gap"),
          value: inr(Math.abs(result.advantageSgb)),
          footnote:
            result.winner === "sgb"
              ? t("Tool_gold_etf_vs_sgb_Result_WinnerSgb")
              : result.winner === "etf"
                ? t("Tool_gold_etf_vs_sgb_Result_WinnerEtf")
                : t("Tool_gold_etf_vs_sgb_Result_WinnerTie"),
        },
      ],
      scenarios: [
        {
          name: t("Tool_gold_etf_vs_sgb_Scenario_Flat"),
          primaryLabel: t("Tool_gold_etf_vs_sgb_Result_Sgb"),
          primaryValue: inr(flatGold.sgbTotalReturn),
          secondaryLabel: t("Tool_gold_etf_vs_sgb_Result_Etf"),
          secondaryValue: inr(flatGold.etfNetValue),
          variant: "worst" as const,
        },
        {
          name: t("Common_Scenario_Base"),
          primaryLabel: t("Tool_gold_etf_vs_sgb_Result_Sgb"),
          primaryValue: inr(result.sgbTotalReturn),
          secondaryLabel: t("Tool_gold_etf_vs_sgb_Result_Etf"),
          secondaryValue: inr(result.etfNetValue),
          variant: "base" as const,
        },
        {
          name: t("Tool_gold_etf_vs_sgb_Scenario_Higher"),
          primaryLabel: t("Tool_gold_etf_vs_sgb_Result_Sgb"),
          primaryValue: inr(higherGold.sgbTotalReturn),
          secondaryLabel: t("Tool_gold_etf_vs_sgb_Result_Etf"),
          secondaryValue: inr(higherGold.etfNetValue),
          variant: "best" as const,
        },
      ],
    };
  }, [investment, goldPrice, endPrice, years, t]);

  return (
    <ToolPageShell
      title={t(tool.titleKey)}
      subtitle={t("Tool_gold_etf_vs_sgb_Subtitle")}
      description={t(tool.descriptionKey)}
      icon={tool.icon}
      educate={
        <>
          <div className="fy-info-box">
            <strong>{t("Common_WhatYouLearn")}</strong>
            <p>{t("Tool_gold_etf_vs_sgb_LearnText")}</p>
          </div>
          <FormulaCard
            title={t("Common_Formula")}
            code={
              "SGB = invested + 2.5%×years + gold gain\nETF = gold value − expense − LTCG\nCompare net proceeds"
            }
            note={t("Tool_gold_etf_vs_sgb_FormulaNote")}
          />
        </>
      }
      below={<ToolInfoPanel info={goldEtfVsSgbInfo(t)} />}
    >
      <div className="fy-form-card">
        <h3>{t("Common_YourInputs")}</h3>
        <div className="fy-field">
          <label>{t("Tool_gold_etf_vs_sgb_LabelInvestment")}</label>
          <input
            type="number"
            min={0}
            step={10000}
            inputMode="decimal"
            value={investment}
            onChange={(e) => setInvestment(Math.max(0, Number(e.target.value) || 0))}
          />
        </div>
        <div className="fy-field">
          <label>{t("Tool_gold_etf_vs_sgb_LabelPrice")}</label>
          <input
            type="number"
            min={1}
            step={100}
            inputMode="decimal"
            value={goldPrice}
            onChange={(e) => setGoldPrice(Math.max(1, Number(e.target.value) || 1))}
          />
        </div>
        <div className="fy-field">
          <label>{t("Tool_gold_etf_vs_sgb_LabelEndPrice")}</label>
          <input
            type="number"
            min={0}
            step={100}
            inputMode="decimal"
            value={endPrice}
            onChange={(e) => setEndPrice(Math.max(0, Number(e.target.value) || 0))}
          />
        </div>
        <div className="fy-field">
          <label>{t("Tool_gold_etf_vs_sgb_LabelYears")}</label>
          <input
            type="number"
            min={1}
            max={8}
            step={1}
            inputMode="decimal"
            value={years}
            onChange={(e) => setYears(Math.max(1, Number(e.target.value) || 8))}
          />
          <p className="fy-field-hint">{t("Tool_gold_etf_vs_sgb_YearsHint")}</p>
        </div>
        <button type="button" className="fy-btn-calc">
          {t("Common_Calculate")}
        </button>
      </div>

      <ResultSummaryCards cards={summaryCards} />
      <div className="fy-info-box">
        <p>
          {t(
            "Tool_gold_etf_vs_sgb_InterestNote",
            inr(result.sgbTotalInterest),
            inr(result.etfTax),
          )}
        </p>
      </div>
      <ScenarioCompare
        title={t("Tool_gold_etf_vs_sgb_ScenarioTitle")}
        subtitle={t("Tool_gold_etf_vs_sgb_ScenarioSubtitle")}
        scenarios={scenarios}
      />
      <WorkedExample
        title={t("Tool_gold_etf_vs_sgb_ExampleTitle")}
        subtitle={t("Tool_gold_etf_vs_sgb_ExampleSubtitle")}
        steps={exampleSteps}
      />
    </ToolPageShell>
  );
}
