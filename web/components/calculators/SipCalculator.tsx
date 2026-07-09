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
import { sipFutureValue } from "@/lib/finance/compound";
import { inr, percent } from "@/lib/finance/format";
import { sipYearly } from "@/lib/finance/projections";
import { getTool } from "@/lib/config/tools";
import { sipInfo, standardGrowthColumns } from "@/lib/tool-page-content";

export function SipCalculator() {
  const t = useT();
  const tool = getTool("sip")!;

  const [sip, setSip] = useState(10000);
  const [annualRate, setAnnualRate] = useState(12);
  const [years, setYears] = useState(10);

  const breakdownColumns = useMemo(() => standardGrowthColumns(t), [t]);

  const exampleSteps = useMemo(
    () => [
      t("Tool_sip_ExampleStep_1"),
      t("Tool_sip_ExampleStep_2"),
      t("Tool_sip_ExampleStep_3"),
      t("Tool_sip_ExampleStep_4"),
      t("Tool_sip_ExampleStep_5"),
    ],
    [t],
  );

  const { summaryCards, scenarios, breakdownRows, breakdownSubtitle } = useMemo(() => {
    const safeSip = Math.max(0, sip);
    const safeRate = Math.max(0, annualRate);
    const safeYears = Math.max(0, years);
    const months = safeYears * 12;
    const invested = safeSip * months;
    const futureValue = sipFutureValue(safeSip, safeRate, months);
    const conservative = sipFutureValue(safeSip, 10, months);
    const aggressive = sipFutureValue(safeSip, 15, months);

    return {
      summaryCards: [
        {
          label: t("Tool_sip_Result_TotalInvested"),
          value: inr(invested),
          footnote: t("Tool_sip_Result_InvestedFootnote", safeYears, inr(safeSip)),
        },
        {
          label: t("Tool_sip_Result_EstimatedValue"),
          value: inr(futureValue),
          footnote: t("Tool_sip_Result_ValueFootnote", percent(safeRate)),
          variant: "primary" as const,
        },
        {
          label: t("Tool_sip_Result_EstimatedGains"),
          value: inr(futureValue - invested),
          footnote: t("Tool_sip_Result_GainsFootnote"),
          variant: "volatile" as const,
        },
      ],
      scenarios: [
        {
          name: t("Tool_sip_Scenario_Conservative"),
          primaryLabel: t("Common_Label_FutureValue"),
          primaryValue: inr(conservative),
          secondaryLabel: t("Common_Label_Return"),
          secondaryValue: "10%",
          variant: "worst",
        },
        {
          name: t("Common_Scenario_Base"),
          primaryLabel: t("Common_Label_FutureValue"),
          primaryValue: inr(futureValue),
          secondaryLabel: t("Common_Label_Return"),
          secondaryValue: percent(safeRate),
          variant: "base",
        },
        {
          name: t("Tool_sip_Scenario_Aggressive"),
          primaryLabel: t("Common_Label_FutureValue"),
          primaryValue: inr(aggressive),
          secondaryLabel: t("Common_Label_Return"),
          secondaryValue: "15%",
          variant: "best",
        },
      ],
      breakdownSubtitle: t("Tool_sip_BreakdownSubtitle", safeRate),
      breakdownRows: sipYearly(safeSip, safeRate, safeYears).map((r) => ({
        cells: {
          year: t("Common_YearN", r.year),
          invested: inr(r.invested),
          value: inr(r.value),
          gain: inr(r.gain),
        },
      })),
    };
  }, [sip, annualRate, years, t]);

  return (
    <ToolPageShell
      title={t(tool.titleKey)}
      subtitle={t("Tool_sip_Subtitle")}
      description={t(tool.descriptionKey)}
      icon={tool.icon}
      educate={
        <>
          <div className="fy-info-box">
            <strong>{t("Common_WhatYouLearn")}</strong>
            <p>{t("Tool_sip_LearnText")}</p>
          </div>
          <FormulaCard
            title={t("Common_Formula")}
            code={"r = annual_rate / 12        (monthly rate)\nn = years * 12             (months)\nFV = SIP * ((1 + r)^n - 1) / r"}
            note={t("Tool_sip_FormulaNote")}
          />
        </>
      }
      below={<ToolInfoPanel info={sipInfo(t)} />}
    >
      <div className="fy-form-card">
        <h3>{t("Common_YourInputs")}</h3>
        <div className="fy-field">
          <label>{t("Tool_sip_LabelSip")}</label>
          <input
            type="number"
            min={0}
            inputMode="decimal"
            value={sip}
            onChange={(e) => setSip(Math.max(0, Number(e.target.value) || 0))}
          />
        </div>
        <div className="fy-field">
          <label>{t("Tool_sip_LabelRate")}</label>
          <input
            type="number"
            min={0}
            step={0.1}
            inputMode="decimal"
            value={annualRate}
            onChange={(e) => setAnnualRate(Math.max(0, Number(e.target.value) || 0))}
          />
        </div>
        <div className="fy-field">
          <label>{t("Common_Label_TenureYears")}</label>
          <input
            type="number"
            min={0}
            step={1}
            inputMode="numeric"
            value={years}
            onChange={(e) => setYears(Math.max(0, Number(e.target.value) || 0))}
          />
        </div>
        <button type="button" className="fy-btn-calc">
          {t("Common_Calculate")}
        </button>
      </div>

      <ResultSummaryCards cards={summaryCards} />
      <ScenarioCompare
        title={t("Tool_sip_ScenarioTitle")}
        subtitle={t("Tool_sip_ScenarioSubtitle")}
        scenarios={scenarios}
      />
      <BreakdownTable
        title={t("Tool_sip_BreakdownTitle")}
        subtitle={breakdownSubtitle}
        columns={breakdownColumns}
        rows={breakdownRows}
      />
      <WorkedExample
        title={t("Tool_sip_ExampleTitle")}
        subtitle={t("Tool_sip_ExampleSubtitle")}
        steps={exampleSteps}
      />
    </ToolPageShell>
  );
}
