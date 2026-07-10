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
import { calculateSipVsLumpsum } from "@/lib/finance/sipVsLumpsum";
import { inr } from "@/lib/finance/format";
import { getTool } from "@/lib/config/tools";
import { sipVsLumpsumInfo } from "@/lib/tool-page-content";

export function SipVsLumpsumCalculator() {
  const t = useT();
  const tool = getTool("sip-vs-lumpsum")!;

  const [monthlySip, setMonthlySip] = useState(10_000);
  const [years, setYears] = useState(10);
  const [rate, setRate] = useState(12);

  const exampleSteps = useMemo(
    () => [
      t("Tool_sip_vs_lumpsum_ExampleStep_1"),
      t("Tool_sip_vs_lumpsum_ExampleStep_2"),
      t("Tool_sip_vs_lumpsum_ExampleStep_3"),
      t("Tool_sip_vs_lumpsum_ExampleStep_4"),
      t("Tool_sip_vs_lumpsum_ExampleStep_5"),
    ],
    [t],
  );

  const { summaryCards, scenarios, result } = useMemo(() => {
    const result = calculateSipVsLumpsum({
      monthlySip,
      years,
      annualReturnPercent: rate,
    });
    const low = calculateSipVsLumpsum({
      monthlySip,
      years,
      annualReturnPercent: Math.max(0, rate - 3),
    });
    const high = calculateSipVsLumpsum({
      monthlySip,
      years,
      annualReturnPercent: rate + 3,
    });

    return {
      result,
      summaryCards: [
        {
          label: t("Tool_sip_vs_lumpsum_Result_Sip"),
          value: inr(result.sipFv),
          footnote: t("Tool_sip_vs_lumpsum_Result_SipFootnote", inr(result.totalInvested)),
          variant: "primary" as const,
        },
        {
          label: t("Tool_sip_vs_lumpsum_Result_Lumpsum"),
          value: inr(result.lumpsumFv),
          footnote: t("Tool_sip_vs_lumpsum_Result_LumpsumFootnote"),
          variant: "secure" as const,
        },
        {
          label: t("Tool_sip_vs_lumpsum_Result_Diff"),
          value: inr(result.difference),
          footnote:
            result.difference >= 0
              ? t("Tool_sip_vs_lumpsum_Result_DiffLump")
              : t("Tool_sip_vs_lumpsum_Result_DiffSip"),
        },
      ],
      scenarios: [
        {
          name: t("Tool_sip_vs_lumpsum_Scenario_Low"),
          primaryLabel: t("Tool_sip_vs_lumpsum_Result_Sip"),
          primaryValue: inr(low.sipFv),
          secondaryLabel: t("Tool_sip_vs_lumpsum_Result_Lumpsum"),
          secondaryValue: inr(low.lumpsumFv),
          variant: "worst",
        },
        {
          name: t("Common_Scenario_Base"),
          primaryLabel: t("Tool_sip_vs_lumpsum_Result_Sip"),
          primaryValue: inr(result.sipFv),
          secondaryLabel: t("Tool_sip_vs_lumpsum_Result_Lumpsum"),
          secondaryValue: inr(result.lumpsumFv),
          variant: "base",
        },
        {
          name: t("Tool_sip_vs_lumpsum_Scenario_High"),
          primaryLabel: t("Tool_sip_vs_lumpsum_Result_Sip"),
          primaryValue: inr(high.sipFv),
          secondaryLabel: t("Tool_sip_vs_lumpsum_Result_Lumpsum"),
          secondaryValue: inr(high.lumpsumFv),
          variant: "best",
        },
      ],
    };
  }, [monthlySip, years, rate, t]);

  return (
    <ToolPageShell
      title={t(tool.titleKey)}
      subtitle={t("Tool_sip_vs_lumpsum_Subtitle")}
      description={t(tool.descriptionKey)}
      icon={tool.icon}
      educate={
        <>
          <div className="fy-info-box">
            <strong>{t("Common_WhatYouLearn")}</strong>
            <p>{t("Tool_sip_vs_lumpsum_LearnText")}</p>
          </div>
          <FormulaCard
            title={t("Common_Formula")}
            code={
              "Total invested = SIP × months\nSIP FV = SIP × ((1+r)^n − 1) / r\nLumpsum FV = Total × (1+R)^years"
            }
            note={t("Tool_sip_vs_lumpsum_FormulaNote")}
          />
        </>
      }
      below={<ToolInfoPanel info={sipVsLumpsumInfo(t)} />}
    >
      <div className="fy-form-card">
        <h3>{t("Common_YourInputs")}</h3>
        <div className="fy-field">
          <label>{t("Tool_sip_vs_lumpsum_LabelSip")}</label>
          <input
            type="number"
            min={0}
            step={500}
            inputMode="decimal"
            value={monthlySip}
            onChange={(e) => setMonthlySip(Math.max(0, Number(e.target.value) || 0))}
          />
        </div>
        <div className="fy-field">
          <label>{t("Tool_sip_vs_lumpsum_LabelYears")}</label>
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
          <label>{t("Tool_sip_vs_lumpsum_LabelRate")}</label>
          <input
            type="number"
            min={0}
            step={0.5}
            inputMode="decimal"
            value={rate}
            onChange={(e) => setRate(Math.max(0, Number(e.target.value) || 0))}
          />
        </div>
        <button type="button" className="fy-btn-calc">
          {t("Common_Calculate")}
        </button>
      </div>

      <div className="fy-info-box">
        <strong>{t("Tool_sip_vs_lumpsum_VerdictTitle")}</strong>
        <p>
          {t(
            "Tool_sip_vs_lumpsum_VerdictNote",
            inr(result.sipFv),
            inr(result.lumpsumFv),
            inr(Math.abs(result.difference)),
          )}
        </p>
      </div>

      <ResultSummaryCards cards={summaryCards} />
      <ScenarioCompare
        title={t("Tool_sip_vs_lumpsum_ScenarioTitle")}
        subtitle={t("Tool_sip_vs_lumpsum_ScenarioSubtitle")}
        scenarios={scenarios}
      />
      <WorkedExample
        title={t("Tool_sip_vs_lumpsum_ExampleTitle")}
        subtitle={t("Tool_sip_vs_lumpsum_ExampleSubtitle")}
        steps={exampleSteps}
      />
    </ToolPageShell>
  );
}
