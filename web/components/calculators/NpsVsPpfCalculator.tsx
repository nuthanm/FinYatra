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
  calculateNpsVsPpf,
  NPS_VS_PPF_DEFAULT_NPS_RATE,
  NPS_VS_PPF_DEFAULT_YEARS,
} from "@/lib/finance/npsVsPpf";
import { PPF_DEFAULT_RATE } from "@/lib/finance/ppf";
import { inr, percent } from "@/lib/finance/format";
import { getTool } from "@/lib/config/tools";
import { npsVsPpfInfo } from "@/lib/tool-page-content";

export function NpsVsPpfCalculator() {
  const t = useT();
  const tool = getTool("nps-vs-ppf")!;

  const [annual, setAnnual] = useState(1_50_000);
  const [years, setYears] = useState(NPS_VS_PPF_DEFAULT_YEARS);
  const [npsRate, setNpsRate] = useState(NPS_VS_PPF_DEFAULT_NPS_RATE);
  const [ppfRate, setPpfRate] = useState(PPF_DEFAULT_RATE);

  const exampleSteps = useMemo(
    () => [
      t("Tool_nps_vs_ppf_ExampleStep_1"),
      t("Tool_nps_vs_ppf_ExampleStep_2"),
      t("Tool_nps_vs_ppf_ExampleStep_3"),
      t("Tool_nps_vs_ppf_ExampleStep_4"),
      t("Tool_nps_vs_ppf_ExampleStep_5"),
    ],
    [t],
  );

  const { summaryCards, scenarios } = useMemo(() => {
    const result = calculateNpsVsPpf({
      annualContribution: annual,
      years,
      npsRatePercent: npsRate,
      ppfRatePercent: ppfRate,
    });
    const half = calculateNpsVsPpf({
      annualContribution: Math.max(12_000, Math.round(annual / 2)),
      years,
      npsRatePercent: npsRate,
      ppfRatePercent: ppfRate,
    });
    const longer = calculateNpsVsPpf({
      annualContribution: annual,
      years: years + 5,
      npsRatePercent: npsRate,
      ppfRatePercent: ppfRate,
    });

    const winnerKey =
      result.winner === "nps"
        ? "Tool_nps_vs_ppf_Result_WinnerNps"
        : result.winner === "ppf"
          ? "Tool_nps_vs_ppf_Result_WinnerPpf"
          : "Tool_nps_vs_ppf_Result_WinnerTie";

    return {
      summaryCards: [
        {
          label: t("Tool_nps_vs_ppf_Result_Nps"),
          value: inr(result.nps.maturity),
          footnote: t(
            "Tool_nps_vs_ppf_Result_NpsFootnote",
            percent(result.nps.ratePercent),
            result.nps.years,
          ),
          variant: "primary" as const,
        },
        {
          label: t("Tool_nps_vs_ppf_Result_Ppf"),
          value: inr(result.ppf.maturity),
          footnote: t(
            "Tool_nps_vs_ppf_Result_PpfFootnote",
            percent(result.ppf.ratePercent),
            result.ppf.years,
          ),
          variant: "secure" as const,
        },
        {
          label: t("Tool_nps_vs_ppf_Result_Gap"),
          value: inr(result.maturityGap),
          footnote: t(winnerKey),
        },
      ],
      scenarios: [
        {
          name: t("Tool_nps_vs_ppf_Scenario_Half"),
          primaryLabel: t("Tool_nps_vs_ppf_Result_Nps"),
          primaryValue: inr(half.nps.maturity),
          secondaryLabel: t("Tool_nps_vs_ppf_Result_Ppf"),
          secondaryValue: inr(half.ppf.maturity),
          variant: "worst" as const,
        },
        {
          name: t("Common_Scenario_Base"),
          primaryLabel: t("Tool_nps_vs_ppf_Result_Nps"),
          primaryValue: inr(result.nps.maturity),
          secondaryLabel: t("Tool_nps_vs_ppf_Result_Ppf"),
          secondaryValue: inr(result.ppf.maturity),
          variant: "base" as const,
        },
        {
          name: t("Tool_nps_vs_ppf_Scenario_Longer"),
          primaryLabel: t("Tool_nps_vs_ppf_Result_Nps"),
          primaryValue: inr(longer.nps.maturity),
          secondaryLabel: t("Tool_nps_vs_ppf_Result_Ppf"),
          secondaryValue: inr(longer.ppf.maturity),
          variant: "best" as const,
        },
      ],
    };
  }, [annual, years, npsRate, ppfRate, t]);

  return (
    <ToolPageShell
      title={t(tool.titleKey)}
      subtitle={t("Tool_nps_vs_ppf_Subtitle")}
      description={t(tool.descriptionKey)}
      icon={tool.icon}
      educate={
        <>
          <div className="fy-info-box">
            <strong>{t("Common_WhatYouLearn")}</strong>
            <p>{t("Tool_nps_vs_ppf_LearnText")}</p>
          </div>
          <FormulaCard
            title={t("Common_Formula")}
            code={
              "Same annual contribution\nNPS: monthly SIP FV @ market rate\nPPF: annual compound @ ~7.1%\ngap = NPS − PPF"
            }
            note={t("Tool_nps_vs_ppf_FormulaNote")}
          />
        </>
      }
      below={<ToolInfoPanel info={npsVsPpfInfo(t)} />}
    >
      <div className="fy-form-card">
        <h3>{t("Common_YourInputs")}</h3>
        <div className="fy-field">
          <label>{t("Tool_nps_vs_ppf_LabelAnnual")}</label>
          <input
            type="number"
            min={0}
            max={150000}
            step={1000}
            inputMode="decimal"
            value={annual}
            onChange={(e) =>
              setAnnual(Math.min(150_000, Math.max(0, Number(e.target.value) || 0)))
            }
          />
          <p className="fy-field-hint">{t("Tool_nps_vs_ppf_AnnualHint")}</p>
        </div>
        <div className="fy-field">
          <label>{t("Tool_nps_vs_ppf_LabelYears")}</label>
          <input
            type="number"
            min={1}
            max={40}
            step={1}
            inputMode="numeric"
            value={years}
            onChange={(e) => setYears(Math.min(40, Math.max(1, Number(e.target.value) || 1)))}
          />
        </div>
        <div className="fy-field">
          <label>{t("Tool_nps_vs_ppf_LabelNpsRate")}</label>
          <input
            type="number"
            min={0}
            max={20}
            step={0.5}
            inputMode="decimal"
            value={npsRate}
            onChange={(e) => setNpsRate(Math.max(0, Number(e.target.value) || 0))}
          />
        </div>
        <div className="fy-field">
          <label>{t("Tool_nps_vs_ppf_LabelPpfRate")}</label>
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
        title={t("Tool_nps_vs_ppf_ScenarioTitle")}
        subtitle={t("Tool_nps_vs_ppf_ScenarioSubtitle")}
        scenarios={scenarios}
      />
      <WorkedExample
        title={t("Tool_nps_vs_ppf_ExampleTitle")}
        subtitle={t("Tool_nps_vs_ppf_ExampleSubtitle")}
        steps={exampleSteps}
      />
    </ToolPageShell>
  );
}
