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
  calculateNpsWithdrawal,
  NPS_DEFAULT_ANNUITY_RATE,
  NPS_MAX_LUMP_PERCENT,
} from "@/lib/finance/npsWithdrawal";
import { inr } from "@/lib/finance/format";
import { getTool } from "@/lib/config/tools";
import { npsWithdrawalInfo } from "@/lib/tool-page-content";

export function NpsWithdrawalCalculator() {
  const t = useT();
  const tool = getTool("nps-withdrawal")!;

  const [corpus, setCorpus] = useState(5_000_000);
  const [lumpPercent, setLumpPercent] = useState(60);
  const [annuityRate, setAnnuityRate] = useState(NPS_DEFAULT_ANNUITY_RATE);

  const exampleSteps = useMemo(
    () => [
      t("Tool_nps_withdrawal_ExampleStep_1"),
      t("Tool_nps_withdrawal_ExampleStep_2"),
      t("Tool_nps_withdrawal_ExampleStep_3"),
      t("Tool_nps_withdrawal_ExampleStep_4"),
      t("Tool_nps_withdrawal_ExampleStep_5"),
    ],
    [t],
  );

  const { summaryCards, scenarios, result } = useMemo(() => {
    const result = calculateNpsWithdrawal({
      corpus,
      lumpPercent,
      annuityRatePercent: annuityRate,
    });
    const low = calculateNpsWithdrawal({
      corpus,
      lumpPercent: 40,
      annuityRatePercent: annuityRate,
    });
    const mid = calculateNpsWithdrawal({
      corpus,
      lumpPercent: 50,
      annuityRatePercent: annuityRate,
    });
    const max = calculateNpsWithdrawal({
      corpus,
      lumpPercent: NPS_MAX_LUMP_PERCENT,
      annuityRatePercent: annuityRate,
    });

    return {
      result,
      summaryCards: [
        {
          label: t("Tool_nps_withdrawal_Result_Lump"),
          value: inr(result.lumpAmount),
          footnote: t("Tool_nps_withdrawal_Result_LumpFootnote", String(result.lumpPercent)),
          variant: "primary" as const,
        },
        {
          label: t("Tool_nps_withdrawal_Result_Annuity"),
          value: inr(result.annuityCorpus),
          footnote: t(
            "Tool_nps_withdrawal_Result_AnnuityFootnote",
            inr(result.estimatedMonthlyAnnuity),
          ),
          variant: "secure" as const,
        },
        {
          label: t("Tool_nps_withdrawal_Result_Taxable"),
          value: inr(result.taxableLumpEstimate),
          footnote:
            result.taxableLumpEstimate > 0
              ? t(
                  "Tool_nps_withdrawal_Result_TaxableFootnote",
                  inr(result.estimatedTaxOnExcess),
                )
              : t("Tool_nps_withdrawal_Result_TaxFree"),
        },
      ],
      scenarios: [
        {
          name: t("Tool_nps_withdrawal_Scenario_40"),
          primaryLabel: t("Tool_nps_withdrawal_Result_Lump"),
          primaryValue: inr(low.lumpAmount),
          secondaryLabel: t("Tool_nps_withdrawal_Result_Annuity"),
          secondaryValue: inr(low.annuityCorpus),
          variant: "worst",
        },
        {
          name: t("Tool_nps_withdrawal_Scenario_50"),
          primaryLabel: t("Tool_nps_withdrawal_Result_Lump"),
          primaryValue: inr(mid.lumpAmount),
          secondaryLabel: t("Tool_nps_withdrawal_Result_Annuity"),
          secondaryValue: inr(mid.annuityCorpus),
          variant: "base",
        },
        {
          name: t("Tool_nps_withdrawal_Scenario_60"),
          primaryLabel: t("Tool_nps_withdrawal_Result_Lump"),
          primaryValue: inr(max.lumpAmount),
          secondaryLabel: t("Tool_nps_withdrawal_Result_Annuity"),
          secondaryValue: inr(max.annuityCorpus),
          variant: "best",
        },
      ],
    };
  }, [corpus, lumpPercent, annuityRate, t]);

  return (
    <ToolPageShell
      title={t(tool.titleKey)}
      subtitle={t("Tool_nps_withdrawal_Subtitle")}
      description={t(tool.descriptionKey)}
      icon={tool.icon}
      educate={
        <>
          <div className="fy-info-box">
            <strong>{t("Common_WhatYouLearn")}</strong>
            <p>{t("Tool_nps_withdrawal_LearnText")}</p>
          </div>
          <FormulaCard
            title={t("Common_Formula")}
            code={
              "Lump ≤ 60% of corpus (tax-free at normal exit)\nAnnuity corpus = corpus − lump\nAnnual pension ≈ annuity × rate%"
            }
            note={t("Tool_nps_withdrawal_FormulaNote")}
          />
        </>
      }
      below={<ToolInfoPanel info={npsWithdrawalInfo(t)} />}
    >
      <div className="fy-form-card">
        <h3>{t("Common_YourInputs")}</h3>
        <div className="fy-field">
          <label>{t("Tool_nps_withdrawal_LabelCorpus")}</label>
          <input
            type="number"
            min={0}
            step={50000}
            inputMode="decimal"
            value={corpus}
            onChange={(e) => setCorpus(Math.max(0, Number(e.target.value) || 0))}
          />
        </div>
        <div className="fy-field">
          <label>{t("Tool_nps_withdrawal_LabelLump")}</label>
          <input
            type="number"
            min={0}
            max={NPS_MAX_LUMP_PERCENT}
            step={5}
            inputMode="decimal"
            value={lumpPercent}
            onChange={(e) =>
              setLumpPercent(
                Math.min(NPS_MAX_LUMP_PERCENT, Math.max(0, Number(e.target.value) || 0)),
              )
            }
          />
          <p className="fy-field-hint">{t("Tool_nps_withdrawal_LumpHint")}</p>
        </div>
        <div className="fy-field">
          <label>{t("Tool_nps_withdrawal_LabelAnnuityRate")}</label>
          <input
            type="number"
            min={0}
            step={0.25}
            inputMode="decimal"
            value={annuityRate}
            onChange={(e) => setAnnuityRate(Math.max(0, Number(e.target.value) || 0))}
          />
        </div>
        <button type="button" className="fy-btn-calc">
          {t("Common_Calculate")}
        </button>
      </div>

      <div className="fy-info-box">
        <strong>{t("Tool_nps_withdrawal_VerdictTitle")}</strong>
        <p>
          {t(
            "Tool_nps_withdrawal_VerdictNote",
            inr(result.lumpAmount),
            inr(result.annuityCorpus),
            inr(result.estimatedMonthlyAnnuity),
          )}
        </p>
      </div>

      <ResultSummaryCards cards={summaryCards} />
      <ScenarioCompare
        title={t("Tool_nps_withdrawal_ScenarioTitle")}
        subtitle={t("Tool_nps_withdrawal_ScenarioSubtitle")}
        scenarios={scenarios}
      />
      <WorkedExample
        title={t("Tool_nps_withdrawal_ExampleTitle")}
        subtitle={t("Tool_nps_withdrawal_ExampleSubtitle")}
        steps={exampleSteps}
      />
    </ToolPageShell>
  );
}
