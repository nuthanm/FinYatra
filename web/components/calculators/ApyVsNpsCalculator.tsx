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
import { calculateApyVsNps } from "@/lib/finance/apyVsNps";
import { APY_PENSION_OPTIONS, type ApyPensionAmount } from "@/lib/finance/atalPension";
import { inr } from "@/lib/finance/format";
import { getTool } from "@/lib/config/tools";
import { apyVsNpsInfo } from "@/lib/tool-page-content";

export function ApyVsNpsCalculator() {
  const t = useT();
  const tool = getTool("apy-vs-nps")!;

  const [entryAge, setEntryAge] = useState(30);
  const [apyPension, setApyPension] = useState<ApyPensionAmount>(5000);
  const [npsReturnPercent, setNpsReturnPercent] = useState(10);
  const [annuityRatePercent, setAnnuityRatePercent] = useState(6);

  const exampleSteps = useMemo(
    () => [
      t("Tool_apy_vs_nps_ExampleStep_1"),
      t("Tool_apy_vs_nps_ExampleStep_2"),
      t("Tool_apy_vs_nps_ExampleStep_3"),
      t("Tool_apy_vs_nps_ExampleStep_4"),
      t("Tool_apy_vs_nps_ExampleStep_5"),
    ],
    [t],
  );

  const { summaryCards, scenarios, result } = useMemo(() => {
    const result = calculateApyVsNps({
      entryAge,
      apyPension,
      npsReturnPercent,
      annuityRatePercent,
    });
    const lowReturn = calculateApyVsNps({
      entryAge,
      apyPension,
      npsReturnPercent: 8,
      annuityRatePercent,
    });
    const highReturn = calculateApyVsNps({
      entryAge,
      apyPension,
      npsReturnPercent: 12,
      annuityRatePercent,
    });

    const winnerKey =
      result.winner === "apy"
        ? "Tool_apy_vs_nps_Winner_Apy"
        : result.winner === "nps"
          ? "Tool_apy_vs_nps_Winner_Nps"
          : result.winner === "tie"
            ? "Tool_apy_vs_nps_Winner_Tie"
            : "Tool_apy_vs_nps_Winner_Invalid";

    return {
      result,
      summaryCards: [
        {
          label: t("Tool_apy_vs_nps_Result_Monthly"),
          value: inr(result.monthlyOutlay),
          footnote: t("Tool_apy_vs_nps_Result_MonthlyFootnote"),
          variant: "primary" as const,
        },
        {
          label: t("Tool_apy_vs_nps_Result_ApyPension"),
          value: inr(result.apyPension),
          footnote: t("Tool_apy_vs_nps_Result_ApyFootnote", inr(result.apyTotalContributed)),
        },
        {
          label: t("Tool_apy_vs_nps_Result_NpsPension"),
          value: inr(result.npsMonthlyPension),
          footnote: t(
            "Tool_apy_vs_nps_Result_NpsFootnote",
            inr(result.npsCorpus),
            inr(result.npsLumpSum),
          ),
          variant: "secure" as const,
        },
      ],
      scenarios: [
        {
          name: t("Tool_apy_vs_nps_Scenario_8"),
          primaryLabel: t("Tool_apy_vs_nps_Result_NpsPension"),
          primaryValue: inr(lowReturn.npsMonthlyPension),
          secondaryLabel: t("Tool_apy_vs_nps_Result_ApyPension"),
          secondaryValue: inr(lowReturn.apyPension),
          variant: "worst" as const,
        },
        {
          name: t("Common_Scenario_Base"),
          primaryLabel: t(winnerKey),
          primaryValue: inr(Math.abs(result.pensionGap)),
          secondaryLabel: t("Tool_apy_vs_nps_Result_NpsPension"),
          secondaryValue: inr(result.npsMonthlyPension),
          variant: "base" as const,
        },
        {
          name: t("Tool_apy_vs_nps_Scenario_12"),
          primaryLabel: t("Tool_apy_vs_nps_Result_NpsPension"),
          primaryValue: inr(highReturn.npsMonthlyPension),
          secondaryLabel: t("Tool_apy_vs_nps_Result_ApyPension"),
          secondaryValue: inr(highReturn.apyPension),
          variant: "best" as const,
        },
      ],
    };
  }, [entryAge, apyPension, npsReturnPercent, annuityRatePercent, t]);

  return (
    <ToolPageShell
      title={t(tool.titleKey)}
      subtitle={t("Tool_apy_vs_nps_Subtitle")}
      description={t(tool.descriptionKey)}
      icon={tool.icon}
      educate={
        <>
          <div className="fy-info-box">
            <strong>{t("Common_WhatYouLearn")}</strong>
            <p>{t("Tool_apy_vs_nps_LearnText")}</p>
          </div>
          <FormulaCard
            title={t("Common_Formula")}
            code={"APY monthly from age chart\nSame ₹ → NPS SIP to age 60\nCompare pensions"}
            note={t("Tool_apy_vs_nps_FormulaNote")}
          />
        </>
      }
      below={<ToolInfoPanel info={apyVsNpsInfo(t)} />}
    >
      <div className="fy-form-card">
        <h3>{t("Common_YourInputs")}</h3>
        <div className="fy-field">
          <label>{t("Tool_apy_vs_nps_LabelAge")}</label>
          <input
            type="number"
            min={18}
            max={40}
            step={1}
            inputMode="numeric"
            value={entryAge}
            onChange={(e) => setEntryAge(Math.max(18, Math.min(40, Number(e.target.value) || 18)))}
          />
        </div>
        <div className="fy-field">
          <label>{t("Tool_apy_vs_nps_LabelPension")}</label>
          <select
            value={apyPension}
            onChange={(e) => setApyPension(Number(e.target.value) as ApyPensionAmount)}
          >
            {APY_PENSION_OPTIONS.map((p) => (
              <option key={p} value={p}>
                {inr(p)}/{t("Tool_apy_vs_nps_PerMonth")}
              </option>
            ))}
          </select>
        </div>
        <div className="fy-field">
          <label>{t("Tool_apy_vs_nps_LabelNpsReturn")}</label>
          <input
            type="number"
            min={1}
            max={20}
            step={0.5}
            inputMode="decimal"
            value={npsReturnPercent}
            onChange={(e) => setNpsReturnPercent(Math.max(0, Number(e.target.value) || 0))}
          />
        </div>
        <div className="fy-field">
          <label>{t("Tool_apy_vs_nps_LabelAnnuity")}</label>
          <input
            type="number"
            min={1}
            max={12}
            step={0.5}
            inputMode="decimal"
            value={annuityRatePercent}
            onChange={(e) => setAnnuityRatePercent(Math.max(0, Number(e.target.value) || 0))}
          />
        </div>
        <button type="button" className="fy-btn-calc">
          {t("Common_Calculate")}
        </button>
      </div>

      <ResultSummaryCards cards={summaryCards} />
      <div className="fy-info-box">
        <strong>{t("Tool_apy_vs_nps_VerdictTitle")}</strong>
        <p>
          {t(
            "Tool_apy_vs_nps_VerdictNote",
            inr(result.monthlyOutlay),
            inr(result.apyPension),
            inr(result.npsMonthlyPension),
          )}
        </p>
      </div>
      <ScenarioCompare
        title={t("Tool_apy_vs_nps_ScenarioTitle")}
        subtitle={t("Tool_apy_vs_nps_ScenarioSubtitle")}
        scenarios={scenarios}
      />
      <WorkedExample
        title={t("Tool_apy_vs_nps_ExampleTitle")}
        subtitle={t("Tool_apy_vs_nps_ExampleSubtitle")}
        steps={exampleSteps}
      />
    </ToolPageShell>
  );
}
