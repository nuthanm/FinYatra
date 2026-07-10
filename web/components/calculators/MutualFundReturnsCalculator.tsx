"use client";

import { useMemo, useState } from "react";
import { useT } from "@/components/providers/I18nProvider";
import {
  BreakdownTable,
  FormulaCard,
  ResultSummaryCards,
  ScenarioCompare,
  ToolInfoPanel,
  ToolPageShell,
  WorkedExample,
} from "@/components/calculator/CalculatorUi";
import {
  calculateMutualFundReturns,
  type MutualFundMode,
} from "@/lib/finance/mutualFundReturns";
import { inr, percent } from "@/lib/finance/format";
import { lumpsumYearly, sipYearly } from "@/lib/finance/projections";
import { getTool } from "@/lib/config/tools";
import { mutualFundReturnsInfo, standardGrowthColumns } from "@/lib/tool-page-content";

export function MutualFundReturnsCalculator() {
  const t = useT();
  const tool = getTool("mutual-fund-returns")!;

  const [mode, setMode] = useState<MutualFundMode>("sip");
  const [principal, setPrincipal] = useState(100_000);
  const [monthlySip, setMonthlySip] = useState(10_000);
  const [rate, setRate] = useState(12);
  const [years, setYears] = useState(10);

  const breakdownColumns = useMemo(() => standardGrowthColumns(t), [t]);

  const exampleSteps = useMemo(
    () => [
      t("Tool_mutual_fund_returns_ExampleStep_1"),
      t("Tool_mutual_fund_returns_ExampleStep_2"),
      t("Tool_mutual_fund_returns_ExampleStep_3"),
      t("Tool_mutual_fund_returns_ExampleStep_4"),
      t("Tool_mutual_fund_returns_ExampleStep_5"),
    ],
    [t],
  );

  const { summaryCards, scenarios, breakdownRows, breakdownSubtitle } = useMemo(() => {
    const base = calculateMutualFundReturns({
      mode,
      principal: Math.max(0, principal),
      monthlySip: Math.max(0, monthlySip),
      annualRatePercent: Math.max(0, rate),
      years: Math.max(0, years),
    });
    const lowerRate = Math.max(0, rate - 2);
    const higherRate = rate + 2;
    const lower = calculateMutualFundReturns({
      mode,
      principal,
      monthlySip,
      annualRatePercent: lowerRate,
      years,
    });
    const higher = calculateMutualFundReturns({
      mode,
      principal,
      monthlySip,
      annualRatePercent: higherRate,
      years,
    });

    const rows =
      mode === "sip"
        ? sipYearly(Math.max(0, monthlySip), Math.max(0, rate), Math.max(0, years))
        : lumpsumYearly(Math.max(0, principal), Math.max(0, rate), Math.max(0, years));

    return {
      summaryCards: [
        {
          label: t("Tool_mutual_fund_returns_Result_Invested"),
          value: inr(base.invested),
          footnote:
            mode === "sip"
              ? t("Tool_mutual_fund_returns_Result_InvestedFootnoteSip", years, inr(monthlySip))
              : t("Tool_mutual_fund_returns_Result_InvestedFootnoteLumpsum"),
        },
        {
          label: t("Tool_mutual_fund_returns_Result_Value"),
          value: inr(base.estimatedValue),
          footnote: t("Tool_mutual_fund_returns_Result_ValueFootnote", percent(rate)),
          variant: "primary" as const,
        },
        {
          label: t("Tool_mutual_fund_returns_Result_Gain"),
          value: inr(base.gain),
          footnote: t("Tool_mutual_fund_returns_Result_GainFootnote"),
          variant: "volatile" as const,
        },
      ],
      scenarios: [
        {
          name: t("Tool_mutual_fund_returns_Scenario_Lower"),
          primaryLabel: t("Common_Label_FutureValue"),
          primaryValue: inr(lower.estimatedValue),
          secondaryLabel: t("Common_Label_Return"),
          secondaryValue: percent(lowerRate),
          variant: "worst",
        },
        {
          name: t("Common_Scenario_Base"),
          primaryLabel: t("Common_Label_FutureValue"),
          primaryValue: inr(base.estimatedValue),
          secondaryLabel: t("Common_Label_Return"),
          secondaryValue: percent(rate),
          variant: "base",
        },
        {
          name: t("Tool_mutual_fund_returns_Scenario_Higher"),
          primaryLabel: t("Common_Label_FutureValue"),
          primaryValue: inr(higher.estimatedValue),
          secondaryLabel: t("Common_Label_Return"),
          secondaryValue: percent(higherRate),
          variant: "best",
        },
      ],
      breakdownSubtitle: t("Tool_mutual_fund_returns_BreakdownSubtitle", percent(rate)),
      breakdownRows: rows.map((r) => ({
        cells: {
          year: t("Common_YearN", r.year),
          invested: inr(r.invested),
          value: inr(r.value),
          gain: inr(r.gain),
        },
      })),
    };
  }, [mode, principal, monthlySip, rate, years, t]);

  return (
    <ToolPageShell
      title={t(tool.titleKey)}
      subtitle={t("Tool_mutual_fund_returns_Subtitle")}
      description={t(tool.descriptionKey)}
      icon={tool.icon}
      educate={
        <>
          <div className="fy-info-box">
            <strong>{t("Common_WhatYouLearn")}</strong>
            <p>{t("Tool_mutual_fund_returns_LearnText")}</p>
          </div>
          <FormulaCard
            title={t("Common_Formula")}
            code={"Lumpsum: FV = P × (1 + r)^years\nSIP: FV = SIP × ((1+r_m)^n − 1) / r_m"}
            note={t("Tool_mutual_fund_returns_FormulaNote")}
          />
        </>
      }
      below={<ToolInfoPanel info={mutualFundReturnsInfo(t)} />}
    >
      <div className="fy-form-card">
        <h3>{t("Common_YourInputs")}</h3>
        <div className="fy-field">
          <label>{t("Tool_mutual_fund_returns_LabelMode")}</label>
          <select value={mode} onChange={(e) => setMode(e.target.value as MutualFundMode)}>
            <option value="sip">{t("Tool_mutual_fund_returns_Mode_Sip")}</option>
            <option value="lumpsum">{t("Tool_mutual_fund_returns_Mode_Lumpsum")}</option>
          </select>
        </div>
        {mode === "sip" ? (
          <div className="fy-field">
            <label>{t("Tool_mutual_fund_returns_LabelSip")}</label>
            <input
              type="number"
              min={0}
              step={500}
              inputMode="decimal"
              value={monthlySip}
              onChange={(e) => setMonthlySip(Math.max(0, Number(e.target.value) || 0))}
            />
          </div>
        ) : (
          <div className="fy-field">
            <label>{t("Tool_mutual_fund_returns_LabelPrincipal")}</label>
            <input
              type="number"
              min={0}
              step={1000}
              inputMode="decimal"
              value={principal}
              onChange={(e) => setPrincipal(Math.max(0, Number(e.target.value) || 0))}
            />
          </div>
        )}
        <div className="fy-field">
          <label>{t("Tool_mutual_fund_returns_LabelRate")}</label>
          <input
            type="number"
            min={0}
            step={0.1}
            inputMode="decimal"
            value={rate}
            onChange={(e) => setRate(Math.max(0, Number(e.target.value) || 0))}
          />
          <p className="fy-field-hint">{t("Tool_mutual_fund_returns_RateHint")}</p>
        </div>
        <div className="fy-field">
          <label>{t("Common_Label_TenureYears")}</label>
          <input
            type="number"
            min={1}
            max={40}
            step={1}
            inputMode="numeric"
            value={years}
            onChange={(e) => setYears(Math.max(1, Number(e.target.value) || 1))}
          />
        </div>
        <button type="button" className="fy-btn-calc">
          {t("Common_Calculate")}
        </button>
      </div>

      <ResultSummaryCards cards={summaryCards} />
      <ScenarioCompare
        title={t("Tool_mutual_fund_returns_ScenarioTitle")}
        subtitle={t("Tool_mutual_fund_returns_ScenarioSubtitle")}
        scenarios={scenarios}
      />
      <BreakdownTable
        title={t("Tool_mutual_fund_returns_BreakdownTitle")}
        subtitle={breakdownSubtitle}
        columns={breakdownColumns}
        rows={breakdownRows}
      />
      <WorkedExample
        title={t("Tool_mutual_fund_returns_ExampleTitle")}
        subtitle={t("Tool_mutual_fund_returns_ExampleSubtitle")}
        steps={exampleSteps}
      />
    </ToolPageShell>
  );
}
