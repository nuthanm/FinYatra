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
  calculateSukanyaVsLic,
  LIC_ENDOWMENT_DEFAULT_IRR,
} from "@/lib/finance/sukanyaVsLic";
import { SSY_DEFAULT_RATE } from "@/lib/finance/ssy";
import { inr, percent } from "@/lib/finance/format";
import { getTool } from "@/lib/config/tools";
import { sukanyaVsLicInfo } from "@/lib/tool-page-content";

export function SukanyaVsLicCalculator() {
  const t = useT();
  const tool = getTool("sukanya-vs-lic")!;

  const [annualOutlay, setAnnualOutlay] = useState(1_00_000);
  const [ssyRate, setSsyRate] = useState(SSY_DEFAULT_RATE);
  const [licIrr, setLicIrr] = useState(LIC_ENDOWMENT_DEFAULT_IRR);

  const exampleSteps = useMemo(
    () => [
      t("Tool_sukanya_vs_lic_ExampleStep_1"),
      t("Tool_sukanya_vs_lic_ExampleStep_2"),
      t("Tool_sukanya_vs_lic_ExampleStep_3"),
      t("Tool_sukanya_vs_lic_ExampleStep_4"),
      t("Tool_sukanya_vs_lic_ExampleStep_5"),
    ],
    [t],
  );

  const { summaryCards, scenarios } = useMemo(() => {
    const result = calculateSukanyaVsLic({
      annualOutlay,
      ssyRatePercent: ssyRate,
      licIrrPercent: licIrr,
    });
    const half = calculateSukanyaVsLic({
      annualOutlay: Math.max(250, Math.round(annualOutlay / 2)),
      ssyRatePercent: ssyRate,
      licIrrPercent: licIrr,
    });
    const higherLic = calculateSukanyaVsLic({
      annualOutlay,
      ssyRatePercent: ssyRate,
      licIrrPercent: licIrr + 1.5,
    });

    const winnerKey =
      result.winner === "ssy"
        ? "Tool_sukanya_vs_lic_Result_WinnerSsy"
        : result.winner === "lic"
          ? "Tool_sukanya_vs_lic_Result_WinnerLic"
          : "Tool_sukanya_vs_lic_Result_WinnerTie";

    return {
      summaryCards: [
        {
          label: t("Tool_sukanya_vs_lic_Result_Ssy"),
          value: inr(result.ssy.maturity),
          footnote: t(
            "Tool_sukanya_vs_lic_Result_SsyFootnote",
            percent(result.ssy.ratePercent),
            result.ssy.years,
          ),
          variant: "primary" as const,
        },
        {
          label: t("Tool_sukanya_vs_lic_Result_Lic"),
          value: inr(result.lic.maturity),
          footnote: t(
            "Tool_sukanya_vs_lic_Result_LicFootnote",
            percent(result.lic.ratePercent),
            result.lic.years,
          ),
          variant: "secure" as const,
        },
        {
          label: t("Tool_sukanya_vs_lic_Result_Gap"),
          value: inr(result.maturityGap),
          footnote: t(winnerKey),
          variant: result.winner === "ssy" ? ("volatile" as const) : ("primary" as const),
        },
      ],
      scenarios: [
        {
          name: t("Tool_sukanya_vs_lic_Scenario_Half"),
          primaryLabel: t("Tool_sukanya_vs_lic_Result_Ssy"),
          primaryValue: inr(half.ssy.maturity),
          secondaryLabel: t("Tool_sukanya_vs_lic_Result_Lic"),
          secondaryValue: inr(half.lic.maturity),
          variant: "worst" as const,
        },
        {
          name: t("Common_Scenario_Base"),
          primaryLabel: t("Tool_sukanya_vs_lic_Result_Ssy"),
          primaryValue: inr(result.ssy.maturity),
          secondaryLabel: t("Tool_sukanya_vs_lic_Result_Lic"),
          secondaryValue: inr(result.lic.maturity),
          variant: "base" as const,
        },
        {
          name: t("Tool_sukanya_vs_lic_Scenario_HigherLic"),
          primaryLabel: t("Tool_sukanya_vs_lic_Result_Gap"),
          primaryValue: inr(higherLic.maturityGap),
          secondaryLabel: t("Tool_sukanya_vs_lic_Result_Lic"),
          secondaryValue: inr(higherLic.lic.maturity),
          variant: "best" as const,
        },
      ],
    };
  }, [annualOutlay, ssyRate, licIrr, t]);

  return (
    <ToolPageShell
      title={t(tool.titleKey)}
      subtitle={t("Tool_sukanya_vs_lic_Subtitle")}
      description={t(tool.descriptionKey)}
      icon={tool.icon}
      educate={
        <>
          <div className="fy-info-box">
            <strong>{t("Common_WhatYouLearn")}</strong>
            <p>{t("Tool_sukanya_vs_lic_LearnText")}</p>
          </div>
          <FormulaCard
            title={t("Common_Formula")}
            code={"Same annual outlay\nSSY: 15 deposit yrs → mature yr 21\nLIC endowment ≈ IRR compound\ngap = SSY − LIC"}
            note={t("Tool_sukanya_vs_lic_FormulaNote")}
          />
        </>
      }
      below={<ToolInfoPanel info={sukanyaVsLicInfo(t)} />}
    >
      <div className="fy-form-card">
        <h3>{t("Common_YourInputs")}</h3>
        <div className="fy-field">
          <label>{t("Tool_sukanya_vs_lic_LabelOutlay")}</label>
          <input
            type="number"
            min={0}
            max={150000}
            step={1000}
            inputMode="decimal"
            value={annualOutlay}
            onChange={(e) =>
              setAnnualOutlay(Math.min(150_000, Math.max(0, Number(e.target.value) || 0)))
            }
          />
          <p className="fy-field-hint">{t("Tool_sukanya_vs_lic_OutlayHint")}</p>
        </div>
        <div className="fy-field">
          <label>{t("Tool_sukanya_vs_lic_LabelSsyRate")}</label>
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
          <label>{t("Tool_sukanya_vs_lic_LabelLicIrr")}</label>
          <input
            type="number"
            min={0}
            max={12}
            step={0.1}
            inputMode="decimal"
            value={licIrr}
            onChange={(e) => setLicIrr(Math.max(0, Number(e.target.value) || 0))}
          />
          <p className="fy-field-hint">{t("Tool_sukanya_vs_lic_LicHint")}</p>
        </div>
        <button type="button" className="fy-btn-calc">
          {t("Common_Calculate")}
        </button>
      </div>

      <ResultSummaryCards cards={summaryCards} />
      <ScenarioCompare
        title={t("Tool_sukanya_vs_lic_ScenarioTitle")}
        subtitle={t("Tool_sukanya_vs_lic_ScenarioSubtitle")}
        scenarios={scenarios}
      />
      <WorkedExample
        title={t("Tool_sukanya_vs_lic_ExampleTitle")}
        subtitle={t("Tool_sukanya_vs_lic_ExampleSubtitle")}
        steps={exampleSteps}
      />
    </ToolPageShell>
  );
}
