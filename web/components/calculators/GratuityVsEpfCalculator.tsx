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
import { calculateGratuityVsEpf } from "@/lib/finance/gratuityVsEpf";
import { EPF_DEFAULT_RATE } from "@/lib/finance/epf";
import { inr, percent } from "@/lib/finance/format";
import { getTool } from "@/lib/config/tools";
import { gratuityVsEpfInfo } from "@/lib/tool-page-content";

export function GratuityVsEpfCalculator() {
  const t = useT();
  const tool = getTool("gratuity-vs-epf")!;

  const [lastDrawn, setLastDrawn] = useState(50_000);
  const [years, setYears] = useState(20);
  const [monthlyBasic, setMonthlyBasic] = useState(50_000);
  const [epfRate, setEpfRate] = useState(EPF_DEFAULT_RATE);

  const exampleSteps = useMemo(
    () => [
      t("Tool_gratuity_vs_epf_ExampleStep_1"),
      t("Tool_gratuity_vs_epf_ExampleStep_2"),
      t("Tool_gratuity_vs_epf_ExampleStep_3"),
      t("Tool_gratuity_vs_epf_ExampleStep_4"),
      t("Tool_gratuity_vs_epf_ExampleStep_5"),
    ],
    [t],
  );

  const { summaryCards, scenarios } = useMemo(() => {
    const result = calculateGratuityVsEpf({
      lastDrawnSalary: lastDrawn,
      yearsOfService: years,
      monthlyBasic,
      epfRatePercent: epfRate,
    });
    const shorter = calculateGratuityVsEpf({
      lastDrawnSalary: lastDrawn,
      yearsOfService: Math.max(5, Math.round(years / 2)),
      monthlyBasic,
      epfRatePercent: epfRate,
    });
    const longer = calculateGratuityVsEpf({
      lastDrawnSalary: lastDrawn,
      yearsOfService: years + 5,
      monthlyBasic,
      epfRatePercent: epfRate,
    });

    const winnerKey =
      result.winner === "epf"
        ? "Tool_gratuity_vs_epf_Result_WinnerEpf"
        : result.winner === "gratuity"
          ? "Tool_gratuity_vs_epf_Result_WinnerGratuity"
          : "Tool_gratuity_vs_epf_Result_WinnerTie";

    return {
      summaryCards: [
        {
          label: t("Tool_gratuity_vs_epf_Result_Gratuity"),
          value: inr(result.gratuity),
          footnote: t("Tool_gratuity_vs_epf_Result_GratuityFootnote", years),
          variant: "primary" as const,
        },
        {
          label: t("Tool_gratuity_vs_epf_Result_Epf"),
          value: inr(result.epfCorpus),
          footnote: t(
            "Tool_gratuity_vs_epf_Result_EpfFootnote",
            percent(result.epfRatePercent),
          ),
          variant: "secure" as const,
        },
        {
          label: t("Tool_gratuity_vs_epf_Result_Gap"),
          value: inr(result.gap),
          footnote: t(winnerKey),
        },
      ],
      scenarios: [
        {
          name: t("Tool_gratuity_vs_epf_Scenario_Shorter"),
          primaryLabel: t("Tool_gratuity_vs_epf_Result_Gratuity"),
          primaryValue: inr(shorter.gratuity),
          secondaryLabel: t("Tool_gratuity_vs_epf_Result_Epf"),
          secondaryValue: inr(shorter.epfCorpus),
          variant: "worst" as const,
        },
        {
          name: t("Common_Scenario_Base"),
          primaryLabel: t("Tool_gratuity_vs_epf_Result_Gratuity"),
          primaryValue: inr(result.gratuity),
          secondaryLabel: t("Tool_gratuity_vs_epf_Result_Epf"),
          secondaryValue: inr(result.epfCorpus),
          variant: "base" as const,
        },
        {
          name: t("Tool_gratuity_vs_epf_Scenario_Longer"),
          primaryLabel: t("Tool_gratuity_vs_epf_Result_Gratuity"),
          primaryValue: inr(longer.gratuity),
          secondaryLabel: t("Tool_gratuity_vs_epf_Result_Epf"),
          secondaryValue: inr(longer.epfCorpus),
          variant: "best" as const,
        },
      ],
    };
  }, [lastDrawn, years, monthlyBasic, epfRate, t]);

  return (
    <ToolPageShell
      title={t(tool.titleKey)}
      subtitle={t("Tool_gratuity_vs_epf_Subtitle")}
      description={t(tool.descriptionKey)}
      icon={tool.icon}
      educate={
        <>
          <div className="fy-info-box">
            <strong>{t("Common_WhatYouLearn")}</strong>
            <p>{t("Tool_gratuity_vs_epf_LearnText")}</p>
          </div>
          <FormulaCard
            title={t("Common_Formula")}
            code={
              "Gratuity = (Basic+DA) × 15 × years / 26\nEPF = monthly contrib compounded\ngap = EPF − gratuity"
            }
            note={t("Tool_gratuity_vs_epf_FormulaNote")}
          />
        </>
      }
      below={<ToolInfoPanel info={gratuityVsEpfInfo(t)} />}
    >
      <div className="fy-form-card">
        <h3>{t("Common_YourInputs")}</h3>
        <div className="fy-field">
          <label>{t("Tool_gratuity_vs_epf_LabelSalary")}</label>
          <input
            type="number"
            min={0}
            step={1000}
            inputMode="decimal"
            value={lastDrawn}
            onChange={(e) => setLastDrawn(Math.max(0, Number(e.target.value) || 0))}
          />
          <p className="fy-field-hint">{t("Tool_gratuity_vs_epf_SalaryHint")}</p>
        </div>
        <div className="fy-field">
          <label>{t("Tool_gratuity_vs_epf_LabelBasic")}</label>
          <input
            type="number"
            min={0}
            step={1000}
            inputMode="decimal"
            value={monthlyBasic}
            onChange={(e) => setMonthlyBasic(Math.max(0, Number(e.target.value) || 0))}
          />
          <p className="fy-field-hint">{t("Tool_gratuity_vs_epf_BasicHint")}</p>
        </div>
        <div className="fy-field">
          <label>{t("Tool_gratuity_vs_epf_LabelYears")}</label>
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
          <label>{t("Tool_gratuity_vs_epf_LabelEpfRate")}</label>
          <input
            type="number"
            min={0}
            max={15}
            step={0.05}
            inputMode="decimal"
            value={epfRate}
            onChange={(e) => setEpfRate(Math.max(0, Number(e.target.value) || 0))}
          />
        </div>
        <button type="button" className="fy-btn-calc">
          {t("Common_Calculate")}
        </button>
      </div>

      <ResultSummaryCards cards={summaryCards} />
      <ScenarioCompare
        title={t("Tool_gratuity_vs_epf_ScenarioTitle")}
        subtitle={t("Tool_gratuity_vs_epf_ScenarioSubtitle")}
        scenarios={scenarios}
      />
      <WorkedExample
        title={t("Tool_gratuity_vs_epf_ExampleTitle")}
        subtitle={t("Tool_gratuity_vs_epf_ExampleSubtitle")}
        steps={exampleSteps}
      />
    </ToolPageShell>
  );
}
