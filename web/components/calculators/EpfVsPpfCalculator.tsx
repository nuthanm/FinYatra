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
import { calculateEpfVsPpf } from "@/lib/finance/epfVsPpf";
import { EPF_DEFAULT_RATE } from "@/lib/finance/epf";
import { PPF_DEFAULT_RATE } from "@/lib/finance/ppf";
import { inr, percent } from "@/lib/finance/format";
import { getTool } from "@/lib/config/tools";
import { epfVsPpfInfo } from "@/lib/tool-page-content";

export function EpfVsPpfCalculator() {
  const t = useT();
  const tool = getTool("epf-vs-ppf")!;

  const [monthly, setMonthly] = useState(12_500);
  const [years, setYears] = useState(15);
  const [epfRate, setEpfRate] = useState(EPF_DEFAULT_RATE);
  const [ppfRate, setPpfRate] = useState(PPF_DEFAULT_RATE);
  const [employerMatch, setEmployerMatch] = useState(true);

  const exampleSteps = useMemo(
    () => [
      t("Tool_epf_vs_ppf_ExampleStep_1"),
      t("Tool_epf_vs_ppf_ExampleStep_2"),
      t("Tool_epf_vs_ppf_ExampleStep_3"),
      t("Tool_epf_vs_ppf_ExampleStep_4"),
      t("Tool_epf_vs_ppf_ExampleStep_5"),
    ],
    [t],
  );

  const { summaryCards, scenarios } = useMemo(() => {
    const result = calculateEpfVsPpf({
      monthlyContribution: monthly,
      years,
      epfRatePercent: epfRate,
      ppfRatePercent: ppfRate,
      includeEmployerMatch: employerMatch,
    });
    const noMatch = calculateEpfVsPpf({
      monthlyContribution: monthly,
      years,
      epfRatePercent: epfRate,
      ppfRatePercent: ppfRate,
      includeEmployerMatch: false,
    });
    const longer = calculateEpfVsPpf({
      monthlyContribution: monthly,
      years: Math.min(40, years + 10),
      epfRatePercent: epfRate,
      ppfRatePercent: ppfRate,
      includeEmployerMatch: employerMatch,
    });

    const winnerKey =
      result.winner === "epf"
        ? "Tool_epf_vs_ppf_Result_WinnerEpf"
        : result.winner === "ppf"
          ? "Tool_epf_vs_ppf_Result_WinnerPpf"
          : "Tool_epf_vs_ppf_Result_WinnerTie";

    return {
      summaryCards: [
        {
          label: t("Tool_epf_vs_ppf_Result_Epf"),
          value: inr(result.epf.maturity),
          footnote: t(
            "Tool_epf_vs_ppf_Result_EpfFootnote",
            percent(result.epf.ratePercent),
          ),
          variant: "primary" as const,
        },
        {
          label: t("Tool_epf_vs_ppf_Result_Ppf"),
          value: inr(result.ppf.maturity),
          footnote: t(
            "Tool_epf_vs_ppf_Result_PpfFootnote",
            percent(result.ppf.ratePercent),
          ),
          variant: "secure" as const,
        },
        {
          label: t("Tool_epf_vs_ppf_Result_Gap"),
          value: inr(result.maturityGap),
          footnote: t(winnerKey),
          variant: result.winner === "epf" ? ("volatile" as const) : ("primary" as const),
        },
      ],
      scenarios: [
        {
          name: t("Tool_epf_vs_ppf_Scenario_NoMatch"),
          primaryLabel: t("Tool_epf_vs_ppf_Result_Epf"),
          primaryValue: inr(noMatch.epf.maturity),
          secondaryLabel: t("Tool_epf_vs_ppf_Result_Ppf"),
          secondaryValue: inr(noMatch.ppf.maturity),
          variant: "worst" as const,
        },
        {
          name: t("Common_Scenario_Base"),
          primaryLabel: t("Tool_epf_vs_ppf_Result_Epf"),
          primaryValue: inr(result.epf.maturity),
          secondaryLabel: t("Tool_epf_vs_ppf_Result_Ppf"),
          secondaryValue: inr(result.ppf.maturity),
          variant: "base" as const,
        },
        {
          name: t("Tool_epf_vs_ppf_Scenario_Longer"),
          primaryLabel: t("Tool_epf_vs_ppf_Result_Epf"),
          primaryValue: inr(longer.epf.maturity),
          secondaryLabel: t("Tool_epf_vs_ppf_Result_Ppf"),
          secondaryValue: inr(longer.ppf.maturity),
          variant: "best" as const,
        },
      ],
    };
  }, [monthly, years, epfRate, ppfRate, employerMatch, t]);

  return (
    <ToolPageShell
      title={t(tool.titleKey)}
      subtitle={t("Tool_epf_vs_ppf_Subtitle")}
      description={t(tool.descriptionKey)}
      icon={tool.icon}
      educate={
        <>
          <div className="fy-info-box">
            <strong>{t("Common_WhatYouLearn")}</strong>
            <p>{t("Tool_epf_vs_ppf_LearnText")}</p>
          </div>
          <FormulaCard
            title={t("Common_Formula")}
            code={"Same monthly outlay\nEPF (+ optional employer 3.67%) vs PPF\ngap = EPF − PPF maturity"}
            note={t("Tool_epf_vs_ppf_FormulaNote")}
          />
        </>
      }
      below={<ToolInfoPanel info={epfVsPpfInfo(t)} />}
    >
      <div className="fy-form-card">
        <h3>{t("Common_YourInputs")}</h3>
        <div className="fy-field">
          <label>{t("Tool_epf_vs_ppf_LabelMonthly")}</label>
          <input
            type="number"
            min={0}
            step={500}
            inputMode="decimal"
            value={monthly}
            onChange={(e) => setMonthly(Math.max(0, Number(e.target.value) || 0))}
          />
          <p className="fy-field-hint">{t("Tool_epf_vs_ppf_MonthlyHint")}</p>
        </div>
        <div className="fy-field">
          <label>{t("Tool_epf_vs_ppf_LabelYears")}</label>
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
          <label>{t("Tool_epf_vs_ppf_LabelEpfRate")}</label>
          <input
            type="number"
            min={0}
            step={0.05}
            inputMode="decimal"
            value={epfRate}
            onChange={(e) => setEpfRate(Math.max(0, Number(e.target.value) || 0))}
          />
        </div>
        <div className="fy-field">
          <label>{t("Tool_epf_vs_ppf_LabelPpfRate")}</label>
          <input
            type="number"
            min={0}
            step={0.05}
            inputMode="decimal"
            value={ppfRate}
            onChange={(e) => setPpfRate(Math.max(0, Number(e.target.value) || 0))}
          />
        </div>
        <div className="fy-field">
          <label>{t("Tool_epf_vs_ppf_LabelEmployer")}</label>
          <select
            value={employerMatch ? "yes" : "no"}
            onChange={(e) => setEmployerMatch(e.target.value === "yes")}
          >
            <option value="yes">{t("Tool_epf_vs_ppf_Employer_Yes")}</option>
            <option value="no">{t("Tool_epf_vs_ppf_Employer_No")}</option>
          </select>
        </div>
        <button type="button" className="fy-btn-calc">
          {t("Common_Calculate")}
        </button>
      </div>

      <ResultSummaryCards cards={summaryCards} />
      <ScenarioCompare
        title={t("Tool_epf_vs_ppf_ScenarioTitle")}
        subtitle={t("Tool_epf_vs_ppf_ScenarioSubtitle")}
        scenarios={scenarios}
      />
      <WorkedExample
        title={t("Tool_epf_vs_ppf_ExampleTitle")}
        subtitle={t("Tool_epf_vs_ppf_ExampleSubtitle")}
        steps={exampleSteps}
      />
    </ToolPageShell>
  );
}
