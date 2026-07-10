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
import { calculateSsyVsPpf } from "@/lib/finance/ssyVsPpf";
import { SSY_DEFAULT_RATE } from "@/lib/finance/ssy";
import { PPF_DEFAULT_RATE } from "@/lib/finance/ppf";
import { inr, percent } from "@/lib/finance/format";
import { getTool } from "@/lib/config/tools";
import { ssyVsPpfInfo } from "@/lib/tool-page-content";

export function SsyVsPpfCalculator() {
  const t = useT();
  const tool = getTool("ssy-vs-ppf")!;

  const [annualDeposit, setAnnualDeposit] = useState(1_50_000);
  const [ssyRate, setSsyRate] = useState(SSY_DEFAULT_RATE);
  const [ppfRate, setPpfRate] = useState(PPF_DEFAULT_RATE);

  const exampleSteps = useMemo(
    () => [
      t("Tool_ssy_vs_ppf_ExampleStep_1"),
      t("Tool_ssy_vs_ppf_ExampleStep_2"),
      t("Tool_ssy_vs_ppf_ExampleStep_3"),
      t("Tool_ssy_vs_ppf_ExampleStep_4"),
      t("Tool_ssy_vs_ppf_ExampleStep_5"),
    ],
    [t],
  );

  const { summaryCards, scenarios } = useMemo(() => {
    const result = calculateSsyVsPpf({
      annualDeposit,
      ssyRatePercent: ssyRate,
      ppfRatePercent: ppfRate,
    });
    const half = calculateSsyVsPpf({
      annualDeposit: Math.max(12_000, Math.round(annualDeposit / 2)),
      ssyRatePercent: ssyRate,
      ppfRatePercent: ppfRate,
    });

    const winnerKey =
      result.winner === "ssy"
        ? "Tool_ssy_vs_ppf_Result_WinnerSsy"
        : result.winner === "ppf"
          ? "Tool_ssy_vs_ppf_Result_WinnerPpf"
          : "Tool_ssy_vs_ppf_Result_WinnerTie";

    return {
      summaryCards: [
        {
          label: t("Tool_ssy_vs_ppf_Result_Ssy"),
          value: inr(result.ssy.maturity),
          footnote: t(
            "Tool_ssy_vs_ppf_Result_SsyFootnote",
            percent(result.ssy.ratePercent),
            result.ssy.years,
          ),
          variant: "primary" as const,
        },
        {
          label: t("Tool_ssy_vs_ppf_Result_Ppf"),
          value: inr(result.ppf.maturity),
          footnote: t(
            "Tool_ssy_vs_ppf_Result_PpfFootnote",
            percent(result.ppf.ratePercent),
            result.ppf.years,
          ),
          variant: "secure" as const,
        },
        {
          label: t("Tool_ssy_vs_ppf_Result_Gap"),
          value: inr(result.maturityGap),
          footnote: t(winnerKey),
          variant: result.winner === "ssy" ? ("volatile" as const) : ("primary" as const),
        },
      ],
      scenarios: [
        {
          name: t("Tool_ssy_vs_ppf_Scenario_Half"),
          primaryLabel: t("Tool_ssy_vs_ppf_Result_Ssy"),
          primaryValue: inr(half.ssy.maturity),
          secondaryLabel: t("Tool_ssy_vs_ppf_Result_Ppf"),
          secondaryValue: inr(half.ppf.maturity),
          variant: "worst" as const,
        },
        {
          name: t("Common_Scenario_Base"),
          primaryLabel: t("Tool_ssy_vs_ppf_Result_Ssy"),
          primaryValue: inr(result.ssy.maturity),
          secondaryLabel: t("Tool_ssy_vs_ppf_Result_Ppf"),
          secondaryValue: inr(result.ppf.maturity),
          variant: "base" as const,
        },
        {
          name: t("Tool_ssy_vs_ppf_Scenario_Max"),
          primaryLabel: t("Tool_ssy_vs_ppf_Result_Gap"),
          primaryValue: inr(result.maturityGap),
          secondaryLabel: t("Tool_ssy_vs_ppf_Result_Ssy"),
          secondaryValue: inr(result.ssy.maturity),
          variant: "best" as const,
        },
      ],
    };
  }, [annualDeposit, ssyRate, ppfRate, t]);

  return (
    <ToolPageShell
      title={t(tool.titleKey)}
      subtitle={t("Tool_ssy_vs_ppf_Subtitle")}
      description={t(tool.descriptionKey)}
      icon={tool.icon}
      educate={
        <>
          <div className="fy-info-box">
            <strong>{t("Common_WhatYouLearn")}</strong>
            <p>{t("Tool_ssy_vs_ppf_LearnText")}</p>
          </div>
          <FormulaCard
            title={t("Common_Formula")}
            code={"Same annual deposit\nSSY: 15 deposit yrs → mature yr 21\nPPF: 15 yrs annual compound\ngap = SSY − PPF maturity"}
            note={t("Tool_ssy_vs_ppf_FormulaNote")}
          />
        </>
      }
      below={<ToolInfoPanel info={ssyVsPpfInfo(t)} />}
    >
      <div className="fy-form-card">
        <h3>{t("Common_YourInputs")}</h3>
        <div className="fy-field">
          <label>{t("Tool_ssy_vs_ppf_LabelDeposit")}</label>
          <input
            type="number"
            min={0}
            max={150000}
            step={1000}
            inputMode="decimal"
            value={annualDeposit}
            onChange={(e) =>
              setAnnualDeposit(Math.min(150_000, Math.max(0, Number(e.target.value) || 0)))
            }
          />
          <p className="fy-field-hint">{t("Tool_ssy_vs_ppf_DepositHint")}</p>
        </div>
        <div className="fy-field">
          <label>{t("Tool_ssy_vs_ppf_LabelSsyRate")}</label>
          <input
            type="number"
            min={0}
            max={15}
            step={0.1}
            inputMode="decimal"
            value={ssyRate}
            onChange={(e) => setSsyRate(Math.max(0, Number(e.target.value) || 0))}
          />
        </div>
        <div className="fy-field">
          <label>{t("Tool_ssy_vs_ppf_LabelPpfRate")}</label>
          <input
            type="number"
            min={0}
            max={15}
            step={0.1}
            inputMode="decimal"
            value={ppfRate}
            onChange={(e) => setPpfRate(Math.max(0, Number(e.target.value) || 0))}
          />
        </div>
        <button type="button" className="fy-btn-calc">
          {t("Common_Calculate")}
        </button>
      </div>

      <ResultSummaryCards cards={summaryCards} />
      <ScenarioCompare
        title={t("Tool_ssy_vs_ppf_ScenarioTitle")}
        subtitle={t("Tool_ssy_vs_ppf_ScenarioSubtitle")}
        scenarios={scenarios}
      />
      <WorkedExample
        title={t("Tool_ssy_vs_ppf_ExampleTitle")}
        subtitle={t("Tool_ssy_vs_ppf_ExampleSubtitle")}
        steps={exampleSteps}
      />
    </ToolPageShell>
  );
}
