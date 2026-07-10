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
  calculateNifty50Returns,
  nifty50Scenarios,
  type Nifty50Mode,
} from "@/lib/finance/nifty50Returns";
import { inr, percent } from "@/lib/finance/format";
import { getTool } from "@/lib/config/tools";
import { nifty50ReturnsInfo } from "@/lib/tool-page-content";

export function Nifty50ReturnsCalculator() {
  const t = useT();
  const tool = getTool("nifty-50-returns")!;

  const [mode, setMode] = useState<Nifty50Mode>("sip");
  const [principal, setPrincipal] = useState(100_000);
  const [monthlySip, setMonthlySip] = useState(10_000);
  const [cagr, setCagr] = useState(12);
  const [years, setYears] = useState(10);

  const exampleSteps = useMemo(
    () => [
      t("Tool_nifty_50_returns_ExampleStep_1"),
      t("Tool_nifty_50_returns_ExampleStep_2"),
      t("Tool_nifty_50_returns_ExampleStep_3"),
      t("Tool_nifty_50_returns_ExampleStep_4"),
      t("Tool_nifty_50_returns_ExampleStep_5"),
    ],
    [t],
  );

  const { summaryCards, scenarios } = useMemo(() => {
    const base = calculateNifty50Returns({
      mode,
      principal,
      monthlySip,
      assumedCagrPercent: cagr,
      years,
    });
    const [s8, s12, s15] = nifty50Scenarios(mode, principal, monthlySip, years, [8, 12, 15]);

    return {
      summaryCards: [
        {
          label: t("Tool_nifty_50_returns_Result_Invested"),
          value: inr(base.invested),
          footnote:
            mode === "sip"
              ? t("Tool_nifty_50_returns_Result_InvestedFootnoteSip", years, inr(monthlySip))
              : t("Tool_nifty_50_returns_Result_InvestedFootnoteLumpsum"),
        },
        {
          label: t("Tool_nifty_50_returns_Result_Value"),
          value: inr(base.estimatedValue),
          footnote: t("Tool_nifty_50_returns_Result_ValueFootnote", percent(cagr)),
          variant: "primary" as const,
        },
        {
          label: t("Tool_nifty_50_returns_Result_Gain"),
          value: inr(base.gain),
          footnote: t("Tool_nifty_50_returns_Result_GainFootnote"),
          variant: "volatile" as const,
        },
      ],
      scenarios: [
        {
          name: t("Tool_nifty_50_returns_Scenario_8"),
          primaryLabel: t("Common_Label_FutureValue"),
          primaryValue: inr(s8.estimatedValue),
          secondaryLabel: t("Common_Label_Return"),
          secondaryValue: percent(8),
          variant: "worst" as const,
        },
        {
          name: t("Tool_nifty_50_returns_Scenario_12"),
          primaryLabel: t("Common_Label_FutureValue"),
          primaryValue: inr(s12.estimatedValue),
          secondaryLabel: t("Common_Label_Return"),
          secondaryValue: percent(12),
          variant: "base" as const,
        },
        {
          name: t("Tool_nifty_50_returns_Scenario_15"),
          primaryLabel: t("Common_Label_FutureValue"),
          primaryValue: inr(s15.estimatedValue),
          secondaryLabel: t("Common_Label_Return"),
          secondaryValue: percent(15),
          variant: "best" as const,
        },
      ],
    };
  }, [mode, principal, monthlySip, cagr, years, t]);

  return (
    <ToolPageShell
      title={t(tool.titleKey)}
      subtitle={t("Tool_nifty_50_returns_Subtitle")}
      description={t(tool.descriptionKey)}
      icon={tool.icon}
      educate={
        <>
          <div className="fy-info-box">
            <strong>{t("Common_WhatYouLearn")}</strong>
            <p>{t("Tool_nifty_50_returns_LearnText")}</p>
          </div>
          <FormulaCard
            title={t("Common_Formula")}
            code={"Lumpsum: FV = P × (1 + CAGR)^years\nSIP: FV = SIP × ((1+r_m)^n − 1) / r_m"}
            note={t("Tool_nifty_50_returns_FormulaNote")}
          />
        </>
      }
      below={<ToolInfoPanel info={nifty50ReturnsInfo(t)} />}
    >
      <div className="fy-form-card">
        <h3>{t("Common_YourInputs")}</h3>
        <div className="fy-field">
          <label>{t("Tool_nifty_50_returns_LabelMode")}</label>
          <select value={mode} onChange={(e) => setMode(e.target.value as Nifty50Mode)}>
            <option value="sip">{t("Tool_nifty_50_returns_Mode_Sip")}</option>
            <option value="lumpsum">{t("Tool_nifty_50_returns_Mode_Lumpsum")}</option>
          </select>
        </div>
        {mode === "sip" ? (
          <div className="fy-field">
            <label>{t("Tool_nifty_50_returns_LabelSip")}</label>
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
            <label>{t("Tool_nifty_50_returns_LabelPrincipal")}</label>
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
          <label>{t("Tool_nifty_50_returns_LabelCagr")}</label>
          <input
            type="number"
            min={0}
            step={0.1}
            inputMode="decimal"
            value={cagr}
            onChange={(e) => setCagr(Math.max(0, Number(e.target.value) || 0))}
          />
          <p className="fy-field-hint">{t("Tool_nifty_50_returns_CagrHint")}</p>
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
        title={t("Tool_nifty_50_returns_ScenarioTitle")}
        subtitle={t("Tool_nifty_50_returns_ScenarioSubtitle")}
        scenarios={scenarios}
      />
      <WorkedExample
        title={t("Tool_nifty_50_returns_ExampleTitle")}
        subtitle={t("Tool_nifty_50_returns_ExampleSubtitle")}
        steps={exampleSteps}
      />
    </ToolPageShell>
  );
}
