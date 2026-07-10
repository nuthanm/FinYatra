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
  calculateIndexedCost,
  CII_FY_OPTIONS,
  CII_TABLE,
  type CiiFy,
} from "@/lib/finance/costInflationIndex";
import { inr } from "@/lib/finance/format";
import { getTool } from "@/lib/config/tools";
import { costInflationIndexInfo } from "@/lib/tool-page-content";

export function CostInflationIndexCalculator() {
  const t = useT();
  const tool = getTool("cost-inflation-index")!;

  const [cost, setCost] = useState(1_000_000);
  const [buyYear, setBuyYear] = useState<CiiFy>("2018-19");
  const [sellYear, setSellYear] = useState<CiiFy>("2024-25");

  const exampleSteps = useMemo(
    () => [
      t("Tool_cost_inflation_index_ExampleStep_1"),
      t("Tool_cost_inflation_index_ExampleStep_2"),
      t("Tool_cost_inflation_index_ExampleStep_3"),
      t("Tool_cost_inflation_index_ExampleStep_4"),
      t("Tool_cost_inflation_index_ExampleStep_5"),
    ],
    [t],
  );

  const { summaryCards, scenarios } = useMemo(() => {
    const result = calculateIndexedCost(cost, buyYear, sellYear);
    const earlierBuy = CII_FY_OPTIONS[Math.max(0, CII_FY_OPTIONS.indexOf(buyYear) - 1)] ?? buyYear;
    const laterSell =
      CII_FY_OPTIONS[Math.min(CII_FY_OPTIONS.length - 1, CII_FY_OPTIONS.indexOf(sellYear) + 1)] ??
      sellYear;
    const low = calculateIndexedCost(cost, earlierBuy, sellYear);
    const high = calculateIndexedCost(cost, buyYear, laterSell);

    return {
      summaryCards: [
        {
          label: t("Tool_cost_inflation_index_Result_Indexed"),
          value: inr(result.indexedCost),
          footnote: t(
            "Tool_cost_inflation_index_Result_IndexedFootnote",
            String(result.buyCii),
            String(result.sellCii),
          ),
          variant: "primary" as const,
        },
        {
          label: t("Tool_cost_inflation_index_Result_Cost"),
          value: inr(result.cost),
          footnote: t("Tool_cost_inflation_index_Result_CostFootnote", buyYear),
          variant: "secure" as const,
        },
        {
          label: t("Tool_cost_inflation_index_Result_Factor"),
          value: result.indexFactor.toFixed(4),
          footnote: t("Tool_cost_inflation_index_Result_FactorFootnote"),
        },
      ],
      scenarios: [
        {
          name: t("Tool_cost_inflation_index_Scenario_EarlierBuy"),
          primaryLabel: t("Tool_cost_inflation_index_Result_Indexed"),
          primaryValue: inr(low.indexedCost),
          secondaryLabel: t("Tool_cost_inflation_index_LabelBuyYear"),
          secondaryValue: earlierBuy,
          variant: "worst",
        },
        {
          name: t("Common_Scenario_Base"),
          primaryLabel: t("Tool_cost_inflation_index_Result_Indexed"),
          primaryValue: inr(result.indexedCost),
          secondaryLabel: t("Tool_cost_inflation_index_Result_Factor"),
          secondaryValue: result.indexFactor.toFixed(3),
          variant: "base",
        },
        {
          name: t("Tool_cost_inflation_index_Scenario_LaterSell"),
          primaryLabel: t("Tool_cost_inflation_index_Result_Indexed"),
          primaryValue: inr(high.indexedCost),
          secondaryLabel: t("Tool_cost_inflation_index_LabelSellYear"),
          secondaryValue: laterSell,
          variant: "best",
        },
      ],
    };
  }, [cost, buyYear, sellYear, t]);

  return (
    <ToolPageShell
      title={t(tool.titleKey)}
      subtitle={t("Tool_cost_inflation_index_Subtitle")}
      description={t(tool.descriptionKey)}
      icon={tool.icon}
      educate={
        <>
          <div className="fy-info-box">
            <strong>{t("Common_WhatYouLearn")}</strong>
            <p>{t("Tool_cost_inflation_index_LearnText")}</p>
          </div>
          <FormulaCard
            title={t("Common_Formula")}
            code={"Indexed cost = Cost × (CII_sell / CII_buy)"}
            note={t("Tool_cost_inflation_index_FormulaNote")}
          />
        </>
      }
      below={<ToolInfoPanel info={costInflationIndexInfo(t)} />}
    >
      <div className="fy-form-card">
        <h3>{t("Common_YourInputs")}</h3>
        <div className="fy-field">
          <label>{t("Tool_cost_inflation_index_LabelCost")}</label>
          <input
            type="number"
            min={0}
            step={10000}
            inputMode="decimal"
            value={cost}
            onChange={(e) => setCost(Math.max(0, Number(e.target.value) || 0))}
          />
        </div>
        <div className="fy-field">
          <label>{t("Tool_cost_inflation_index_LabelBuyYear")}</label>
          <select value={buyYear} onChange={(e) => setBuyYear(e.target.value as CiiFy)}>
            {CII_FY_OPTIONS.map((fy) => (
              <option key={fy} value={fy}>
                {fy} (CII {CII_TABLE[fy]})
              </option>
            ))}
          </select>
        </div>
        <div className="fy-field">
          <label>{t("Tool_cost_inflation_index_LabelSellYear")}</label>
          <select value={sellYear} onChange={(e) => setSellYear(e.target.value as CiiFy)}>
            {CII_FY_OPTIONS.map((fy) => (
              <option key={fy} value={fy}>
                {fy} (CII {CII_TABLE[fy]})
              </option>
            ))}
          </select>
          <p className="fy-field-hint">{t("Tool_cost_inflation_index_YearHint")}</p>
        </div>
        <button type="button" className="fy-btn-calc">
          {t("Common_Calculate")}
        </button>
      </div>

      <ResultSummaryCards cards={summaryCards} />
      <ScenarioCompare
        title={t("Tool_cost_inflation_index_ScenarioTitle")}
        subtitle={t("Tool_cost_inflation_index_ScenarioSubtitle")}
        scenarios={scenarios}
      />
      <WorkedExample
        title={t("Tool_cost_inflation_index_ExampleTitle")}
        subtitle={t("Tool_cost_inflation_index_ExampleSubtitle")}
        steps={exampleSteps}
      />
    </ToolPageShell>
  );
}
