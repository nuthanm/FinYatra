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
  calculateDividendYield,
  type DividendYieldMode,
} from "@/lib/finance/dividendYield";
import { inr, percent } from "@/lib/finance/format";
import { getTool } from "@/lib/config/tools";
import { dividendYieldInfo } from "@/lib/tool-page-content";

export function DividendYieldCalculator() {
  const t = useT();
  const tool = getTool("dividend-yield")!;

  const [mode, setMode] = useState<DividendYieldMode>("perShare");
  const [annualDividendPerShare, setAnnualDividendPerShare] = useState(12);
  const [pricePerShare, setPricePerShare] = useState(240);
  const [totalDividend, setTotalDividend] = useState(12_000);
  const [investment, setInvestment] = useState(240_000);
  const [sharesHeld, setSharesHeld] = useState(1000);

  const exampleSteps = useMemo(
    () => [
      t("Tool_dividend_yield_ExampleStep_1"),
      t("Tool_dividend_yield_ExampleStep_2"),
      t("Tool_dividend_yield_ExampleStep_3"),
      t("Tool_dividend_yield_ExampleStep_4"),
      t("Tool_dividend_yield_ExampleStep_5"),
    ],
    [t],
  );

  const { summaryCards, scenarios, detail } = useMemo(() => {
    const result = calculateDividendYield({
      mode,
      annualDividendPerShare,
      pricePerShare,
      totalDividend,
      investment,
      sharesHeld,
    });
    const lowerPrice = calculateDividendYield({
      mode: "perShare",
      annualDividendPerShare: mode === "perShare" ? annualDividendPerShare : result.dividendPerShare || 12,
      pricePerShare: mode === "perShare" ? pricePerShare * 0.85 : Math.max(1, result.effectivePrice * 0.85),
      totalDividend,
      investment: investment * 0.85,
      sharesHeld,
    });
    const higherDiv = calculateDividendYield({
      mode,
      annualDividendPerShare: annualDividendPerShare * 1.25,
      pricePerShare,
      totalDividend: totalDividend * 1.25,
      investment,
      sharesHeld,
    });

    return {
      detail: result,
      summaryCards: [
        {
          label: t("Tool_dividend_yield_Result_Yield"),
          value: percent(result.yieldPercent, 2),
          footnote: t("Tool_dividend_yield_Result_YieldFootnote"),
          variant: "primary" as const,
        },
        {
          label: t("Tool_dividend_yield_Result_Income"),
          value: inr(result.annualIncome),
          footnote: t("Tool_dividend_yield_Result_IncomeFootnote"),
          variant: "secure" as const,
        },
        {
          label: t("Tool_dividend_yield_Result_Dps"),
          value: inr(result.dividendPerShare, 2),
          footnote: t("Tool_dividend_yield_Result_DpsFootnote"),
        },
      ],
      scenarios: [
        {
          name: t("Tool_dividend_yield_Scenario_LowerPrice"),
          primaryLabel: t("Tool_dividend_yield_Result_Yield"),
          primaryValue: percent(lowerPrice.yieldPercent, 2),
          secondaryLabel: t("Tool_dividend_yield_Result_Income"),
          secondaryValue: inr(lowerPrice.annualIncome),
          variant: "best",
        },
        {
          name: t("Common_Scenario_Base"),
          primaryLabel: t("Tool_dividend_yield_Result_Yield"),
          primaryValue: percent(result.yieldPercent, 2),
          secondaryLabel: t("Tool_dividend_yield_Result_Income"),
          secondaryValue: inr(result.annualIncome),
          variant: "base",
        },
        {
          name: t("Tool_dividend_yield_Scenario_HigherDiv"),
          primaryLabel: t("Tool_dividend_yield_Result_Yield"),
          primaryValue: percent(higherDiv.yieldPercent, 2),
          secondaryLabel: t("Tool_dividend_yield_Result_Income"),
          secondaryValue: inr(higherDiv.annualIncome),
          variant: "worst",
        },
      ],
    };
  }, [
    mode,
    annualDividendPerShare,
    pricePerShare,
    totalDividend,
    investment,
    sharesHeld,
    t,
  ]);

  return (
    <ToolPageShell
      title={t(tool.titleKey)}
      subtitle={t("Tool_dividend_yield_Subtitle")}
      description={t(tool.descriptionKey)}
      icon={tool.icon}
      educate={
        <>
          <div className="fy-info-box">
            <strong>{t("Common_WhatYouLearn")}</strong>
            <p>{t("Tool_dividend_yield_LearnText")}</p>
          </div>
          <FormulaCard
            title={t("Common_Formula")}
            code={"Yield % = (Annual dividend ÷ Price) × 100\nor (Total dividend ÷ Investment) × 100\nIncome = Shares × DPS"}
            note={t("Tool_dividend_yield_FormulaNote")}
          />
        </>
      }
      below={<ToolInfoPanel info={dividendYieldInfo(t)} />}
    >
      <div className="fy-form-card">
        <h3>{t("Common_YourInputs")}</h3>
        <div className="fy-field">
          <label>{t("Tool_dividend_yield_LabelMode")}</label>
          <select value={mode} onChange={(e) => setMode(e.target.value as DividendYieldMode)}>
            <option value="perShare">{t("Tool_dividend_yield_Mode_perShare")}</option>
            <option value="total">{t("Tool_dividend_yield_Mode_total")}</option>
          </select>
        </div>
        {mode === "perShare" ? (
          <>
            <div className="fy-field">
              <label>{t("Tool_dividend_yield_LabelDps")}</label>
              <input
                type="number"
                min={0}
                step={0.5}
                inputMode="decimal"
                value={annualDividendPerShare}
                onChange={(e) =>
                  setAnnualDividendPerShare(Math.max(0, Number(e.target.value) || 0))
                }
              />
            </div>
            <div className="fy-field">
              <label>{t("Tool_dividend_yield_LabelPrice")}</label>
              <input
                type="number"
                min={0}
                step={1}
                inputMode="decimal"
                value={pricePerShare}
                onChange={(e) => setPricePerShare(Math.max(0, Number(e.target.value) || 0))}
              />
            </div>
          </>
        ) : (
          <>
            <div className="fy-field">
              <label>{t("Tool_dividend_yield_LabelTotalDiv")}</label>
              <input
                type="number"
                min={0}
                step={100}
                inputMode="decimal"
                value={totalDividend}
                onChange={(e) => setTotalDividend(Math.max(0, Number(e.target.value) || 0))}
              />
            </div>
            <div className="fy-field">
              <label>{t("Tool_dividend_yield_LabelInvestment")}</label>
              <input
                type="number"
                min={0}
                step={1000}
                inputMode="decimal"
                value={investment}
                onChange={(e) => setInvestment(Math.max(0, Number(e.target.value) || 0))}
              />
            </div>
          </>
        )}
        <div className="fy-field">
          <label>{t("Tool_dividend_yield_LabelShares")}</label>
          <input
            type="number"
            min={0}
            step={1}
            inputMode="numeric"
            value={sharesHeld}
            onChange={(e) => setSharesHeld(Math.max(0, Number(e.target.value) || 0))}
          />
          <p className="fy-field-hint">{t("Tool_dividend_yield_SharesHint")}</p>
        </div>
        <button type="button" className="fy-btn-calc">
          {t("Common_Calculate")}
        </button>
      </div>

      <div className="fy-info-box fy-tax-verdict">
        <strong>{t("Tool_dividend_yield_StatusTitle")}</strong>
        <p>
          {t(
            "Tool_dividend_yield_Status_Body",
            percent(detail.yieldPercent, 2),
            inr(detail.annualIncome),
          )}
        </p>
      </div>

      <ResultSummaryCards cards={summaryCards} />
      <ScenarioCompare
        title={t("Tool_dividend_yield_ScenarioTitle")}
        subtitle={t("Tool_dividend_yield_ScenarioSubtitle")}
        scenarios={scenarios}
      />
      <WorkedExample
        title={t("Tool_dividend_yield_ExampleTitle")}
        subtitle={t("Tool_dividend_yield_ExampleSubtitle")}
        steps={exampleSteps}
      />
    </ToolPageShell>
  );
}
