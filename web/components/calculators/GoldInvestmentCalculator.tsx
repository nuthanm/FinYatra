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
  calculateGoldInvestment,
  type GoldMode,
} from "@/lib/finance/goldInvestment";
import { inr, percent } from "@/lib/finance/format";
import { lumpsumYearly, sipYearly } from "@/lib/finance/projections";
import { getTool } from "@/lib/config/tools";
import { goldInvestmentInfo, standardGrowthColumns } from "@/lib/tool-page-content";

export function GoldInvestmentCalculator() {
  const t = useT();
  const tool = getTool("gold-investment")!;

  const [mode, setMode] = useState<GoldMode>("sip");
  const [monthlySip, setMonthlySip] = useState(5_000);
  const [lumpsum, setLumpsum] = useState(100_000);
  const [appreciation, setAppreciation] = useState(8);
  const [years, setYears] = useState(10);
  const [makingCharges, setMakingCharges] = useState(8);

  const breakdownColumns = useMemo(() => standardGrowthColumns(t), [t]);

  const exampleSteps = useMemo(
    () => [
      t("Tool_gold_investment_ExampleStep_1"),
      t("Tool_gold_investment_ExampleStep_2"),
      t("Tool_gold_investment_ExampleStep_3"),
      t("Tool_gold_investment_ExampleStep_4"),
      t("Tool_gold_investment_ExampleStep_5"),
    ],
    [t],
  );

  const { summaryCards, scenarios, breakdownRows, compareNote } = useMemo(() => {
    const base = calculateGoldInvestment({
      mode,
      monthlySip,
      lumpsum,
      goldAppreciationPercent: appreciation,
      years,
      makingChargesPercent: makingCharges,
    });
    const lower = calculateGoldInvestment({
      mode,
      monthlySip,
      lumpsum,
      goldAppreciationPercent: Math.max(0, appreciation - 2),
      years,
      makingChargesPercent: makingCharges,
    });
    const higher = calculateGoldInvestment({
      mode,
      monthlySip,
      lumpsum,
      goldAppreciationPercent: appreciation + 2,
      years,
      makingChargesPercent: makingCharges,
    });

    const rows =
      mode === "sip"
        ? sipYearly(Math.max(0, monthlySip), Math.max(0, appreciation), Math.max(0, years))
        : lumpsumYearly(Math.max(0, lumpsum), Math.max(0, appreciation), Math.max(0, years));

    return {
      compareNote: t(
        "Tool_gold_investment_CompareNote",
        percent(makingCharges),
        inr(base.makingCharges),
        inr(base.digitalValue - base.physicalValue),
      ),
      summaryCards: [
        {
          label: t("Tool_gold_investment_Result_Invested"),
          value: inr(base.invested),
          footnote:
            mode === "sip"
              ? t("Tool_gold_investment_Result_InvestedFootnoteSip", years, inr(monthlySip))
              : t("Tool_gold_investment_Result_InvestedFootnoteLumpsum"),
        },
        {
          label: t("Tool_gold_investment_Result_Digital"),
          value: inr(base.digitalValue),
          footnote: t("Tool_gold_investment_Result_DigitalFootnote", percent(appreciation)),
          variant: "primary" as const,
        },
        {
          label: t("Tool_gold_investment_Result_Physical"),
          value: inr(base.physicalValue),
          footnote: t("Tool_gold_investment_Result_PhysicalFootnote", percent(makingCharges)),
          variant: "volatile" as const,
        },
      ],
      scenarios: [
        {
          name: t("Tool_gold_investment_Scenario_Lower"),
          primaryLabel: t("Tool_gold_investment_Result_Digital"),
          primaryValue: inr(lower.digitalValue),
          secondaryLabel: t("Common_Label_Return"),
          secondaryValue: percent(Math.max(0, appreciation - 2)),
          variant: "worst",
        },
        {
          name: t("Common_Scenario_Base"),
          primaryLabel: t("Tool_gold_investment_Result_Digital"),
          primaryValue: inr(base.digitalValue),
          secondaryLabel: t("Common_Label_Return"),
          secondaryValue: percent(appreciation),
          variant: "base",
        },
        {
          name: t("Tool_gold_investment_Scenario_Higher"),
          primaryLabel: t("Tool_gold_investment_Result_Digital"),
          primaryValue: inr(higher.digitalValue),
          secondaryLabel: t("Common_Label_Return"),
          secondaryValue: percent(appreciation + 2),
          variant: "best",
        },
      ],
      breakdownRows: rows.map((r) => ({
        cells: {
          year: t("Common_YearN", r.year),
          invested: inr(r.invested),
          value: inr(r.value),
          gain: inr(r.gain),
        },
      })),
    };
  }, [mode, monthlySip, lumpsum, appreciation, years, makingCharges, t]);

  return (
    <ToolPageShell
      title={t(tool.titleKey)}
      subtitle={t("Tool_gold_investment_Subtitle")}
      description={t(tool.descriptionKey)}
      icon={tool.icon}
      educate={
        <>
          <div className="fy-info-box">
            <strong>{t("Common_WhatYouLearn")}</strong>
            <p>{t("Tool_gold_investment_LearnText")}</p>
          </div>
          <FormulaCard
            title={t("Common_Formula")}
            code={"Digital: SIP/lumpsum FV at gold CAGR\nPhysical: invest × (1 − making%) then FV"}
            note={t("Tool_gold_investment_FormulaNote")}
          />
        </>
      }
      below={<ToolInfoPanel info={goldInvestmentInfo(t)} />}
    >
      <div className="fy-form-card">
        <h3>{t("Common_YourInputs")}</h3>
        <div className="fy-field">
          <label>{t("Tool_gold_investment_LabelMode")}</label>
          <select value={mode} onChange={(e) => setMode(e.target.value as GoldMode)}>
            <option value="sip">{t("Tool_gold_investment_Mode_Sip")}</option>
            <option value="lumpsum">{t("Tool_gold_investment_Mode_Lumpsum")}</option>
          </select>
        </div>
        {mode === "sip" ? (
          <div className="fy-field">
            <label>{t("Tool_gold_investment_LabelSip")}</label>
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
            <label>{t("Tool_gold_investment_LabelLumpsum")}</label>
            <input
              type="number"
              min={0}
              step={1000}
              inputMode="decimal"
              value={lumpsum}
              onChange={(e) => setLumpsum(Math.max(0, Number(e.target.value) || 0))}
            />
          </div>
        )}
        <div className="fy-field">
          <label>{t("Tool_gold_investment_LabelAppreciation")}</label>
          <input
            type="number"
            min={0}
            step={0.5}
            inputMode="decimal"
            value={appreciation}
            onChange={(e) => setAppreciation(Math.max(0, Number(e.target.value) || 0))}
          />
          <p className="fy-field-hint">{t("Tool_gold_investment_AppreciationHint")}</p>
        </div>
        <div className="fy-field">
          <label>{t("Common_Label_Years")}</label>
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
        <div className="fy-field">
          <label>{t("Tool_gold_investment_LabelMaking")}</label>
          <input
            type="number"
            min={0}
            max={30}
            step={0.5}
            inputMode="decimal"
            value={makingCharges}
            onChange={(e) => setMakingCharges(Math.max(0, Number(e.target.value) || 0))}
          />
          <p className="fy-field-hint">{t("Tool_gold_investment_MakingHint")}</p>
        </div>
        <button type="button" className="fy-btn-calc">
          {t("Common_Calculate")}
        </button>
      </div>

      <div className="fy-info-box fy-tax-verdict">
        <strong>{t("Tool_gold_investment_CompareTitle")}</strong>
        <p>{compareNote}</p>
      </div>

      <ResultSummaryCards cards={summaryCards} />
      <ScenarioCompare
        title={t("Tool_gold_investment_ScenarioTitle")}
        subtitle={t("Tool_gold_investment_ScenarioSubtitle")}
        scenarios={scenarios}
      />
      <BreakdownTable
        title={t("Tool_gold_investment_BreakdownTitle")}
        subtitle={t("Tool_gold_investment_BreakdownSubtitle")}
        columns={breakdownColumns}
        rows={breakdownRows}
      />
      <WorkedExample
        title={t("Tool_gold_investment_ExampleTitle")}
        subtitle={t("Tool_gold_investment_ExampleSubtitle")}
        steps={exampleSteps}
      />
    </ToolPageShell>
  );
}
