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
import { calculateNpsVsOps } from "@/lib/finance/npsVsOps";
import { inr, percent } from "@/lib/finance/format";
import { getTool } from "@/lib/config/tools";
import { npsVsOpsInfo } from "@/lib/tool-page-content";

export function NpsVsOpsCalculator() {
  const t = useT();
  const tool = getTool("nps-vs-ops")!;

  const [currentAge, setCurrentAge] = useState(30);
  const [retirementAge, setRetirementAge] = useState(60);
  const [lastPay, setLastPay] = useState(80_000);
  const [payGrowth, setPayGrowth] = useState(5);
  const [monthlyNps, setMonthlyNps] = useState(10_000);
  const [existingCorpus, setExistingCorpus] = useState(0);
  const [npsReturn, setNpsReturn] = useState(10);
  const [annuityRate, setAnnuityRate] = useState(6);

  const exampleSteps = useMemo(
    () => [
      t("Tool_nps_vs_ops_ExampleStep_1"),
      t("Tool_nps_vs_ops_ExampleStep_2"),
      t("Tool_nps_vs_ops_ExampleStep_3"),
      t("Tool_nps_vs_ops_ExampleStep_4"),
      t("Tool_nps_vs_ops_ExampleStep_5"),
    ],
    [t],
  );

  const { summaryCards, scenarios } = useMemo(() => {
    const base = calculateNpsVsOps({
      currentAge,
      retirementAge,
      lastPay,
      payGrowthPercent: payGrowth,
      monthlyNpsContribution: monthlyNps,
      existingNpsCorpus: existingCorpus,
      npsReturnPercent: npsReturn,
      annuityRatePercent: annuityRate,
    });
    const lowRet = calculateNpsVsOps({
      currentAge,
      retirementAge,
      lastPay,
      payGrowthPercent: payGrowth,
      monthlyNpsContribution: monthlyNps,
      existingNpsCorpus: existingCorpus,
      npsReturnPercent: Math.max(0, npsReturn - 2),
      annuityRatePercent: annuityRate,
    });
    const highRet = calculateNpsVsOps({
      currentAge,
      retirementAge,
      lastPay,
      payGrowthPercent: payGrowth,
      monthlyNpsContribution: monthlyNps,
      existingNpsCorpus: existingCorpus,
      npsReturnPercent: npsReturn + 2,
      annuityRatePercent: annuityRate,
    });

    return {
      summaryCards: [
        {
          label: t("Tool_nps_vs_ops_Result_Ops"),
          value: inr(base.opsMonthlyPension),
          footnote: t("Tool_nps_vs_ops_Result_OpsFootnote", inr(base.projectedLastPay)),
          variant: "secure" as const,
        },
        {
          label: t("Tool_nps_vs_ops_Result_NpsPension"),
          value: inr(base.npsMonthlyPension),
          footnote: t("Tool_nps_vs_ops_Result_NpsPensionFootnote", percent(annuityRate)),
          variant: "primary" as const,
        },
        {
          label: t("Tool_nps_vs_ops_Result_Corpus"),
          value: inr(base.npsCorpus),
          footnote: t("Tool_nps_vs_ops_Result_CorpusFootnote", inr(base.npsLumpSum)),
        },
        {
          label: t("Tool_nps_vs_ops_Result_Gap"),
          value: inr(base.monthlyGap),
          footnote:
            base.monthlyGap >= 0
              ? t("Tool_nps_vs_ops_Result_GapFootnoteNps")
              : t("Tool_nps_vs_ops_Result_GapFootnoteOps"),
          variant: (base.monthlyGap >= 0 ? "volatile" : "secure") as "volatile" | "secure",
        },
      ],
      scenarios: [
        {
          name: t("Tool_nps_vs_ops_Scenario_Low"),
          primaryLabel: t("Tool_nps_vs_ops_Result_NpsPension"),
          primaryValue: inr(lowRet.npsMonthlyPension),
          secondaryLabel: t("Tool_nps_vs_ops_LabelReturn"),
          secondaryValue: percent(Math.max(0, npsReturn - 2)),
          variant: "worst" as const,
        },
        {
          name: t("Common_Scenario_Base"),
          primaryLabel: t("Tool_nps_vs_ops_Result_NpsPension"),
          primaryValue: inr(base.npsMonthlyPension),
          secondaryLabel: t("Tool_nps_vs_ops_LabelReturn"),
          secondaryValue: percent(npsReturn),
          variant: "base" as const,
        },
        {
          name: t("Tool_nps_vs_ops_Scenario_High"),
          primaryLabel: t("Tool_nps_vs_ops_Result_NpsPension"),
          primaryValue: inr(highRet.npsMonthlyPension),
          secondaryLabel: t("Tool_nps_vs_ops_LabelReturn"),
          secondaryValue: percent(npsReturn + 2),
          variant: "best" as const,
        },
      ],
    };
  }, [
    currentAge,
    retirementAge,
    lastPay,
    payGrowth,
    monthlyNps,
    existingCorpus,
    npsReturn,
    annuityRate,
    t,
  ]);

  return (
    <ToolPageShell
      title={t(tool.titleKey)}
      subtitle={t("Tool_nps_vs_ops_Subtitle")}
      description={t(tool.descriptionKey)}
      icon={tool.icon}
      educate={
        <>
          <div className="fy-info-box">
            <strong>{t("Common_WhatYouLearn")}</strong>
            <p>{t("Tool_nps_vs_ops_LearnText")}</p>
          </div>
          <FormulaCard
            title={t("Common_Formula")}
            code={
              "OPS ≈ 50% × projected last pay\nNPS corpus = FV(existing) + SIP FV\npension ≈ (40% corpus × annuity%) / 12"
            }
            note={t("Tool_nps_vs_ops_FormulaNote")}
          />
        </>
      }
      below={<ToolInfoPanel info={npsVsOpsInfo(t)} />}
    >
      <div className="fy-form-card">
        <h3>{t("Common_YourInputs")}</h3>
        <div className="fy-field">
          <label>{t("Tool_nps_vs_ops_LabelAge")}</label>
          <input
            type="number"
            min={18}
            max={70}
            step={1}
            inputMode="numeric"
            value={currentAge}
            onChange={(e) => setCurrentAge(Math.max(18, Number(e.target.value) || 18))}
          />
        </div>
        <div className="fy-field">
          <label>{t("Tool_nps_vs_ops_LabelRetire")}</label>
          <input
            type="number"
            min={currentAge + 1}
            max={75}
            step={1}
            inputMode="numeric"
            value={retirementAge}
            onChange={(e) =>
              setRetirementAge(Math.max(currentAge + 1, Number(e.target.value) || currentAge + 1))
            }
          />
        </div>
        <div className="fy-field">
          <label>{t("Tool_nps_vs_ops_LabelPay")}</label>
          <input
            type="number"
            min={0}
            step={1000}
            inputMode="decimal"
            value={lastPay}
            onChange={(e) => setLastPay(Math.max(0, Number(e.target.value) || 0))}
          />
          <p className="fy-field-hint">{t("Tool_nps_vs_ops_PayHint")}</p>
        </div>
        <div className="fy-field">
          <label>{t("Tool_nps_vs_ops_LabelGrowth")}</label>
          <input
            type="number"
            min={0}
            step={0.5}
            inputMode="decimal"
            value={payGrowth}
            onChange={(e) => setPayGrowth(Math.max(0, Number(e.target.value) || 0))}
          />
        </div>
        <div className="fy-field">
          <label>{t("Tool_nps_vs_ops_LabelMonthly")}</label>
          <input
            type="number"
            min={0}
            step={500}
            inputMode="decimal"
            value={monthlyNps}
            onChange={(e) => setMonthlyNps(Math.max(0, Number(e.target.value) || 0))}
          />
        </div>
        <div className="fy-field">
          <label>{t("Tool_nps_vs_ops_LabelExisting")}</label>
          <input
            type="number"
            min={0}
            step={10000}
            inputMode="decimal"
            value={existingCorpus}
            onChange={(e) => setExistingCorpus(Math.max(0, Number(e.target.value) || 0))}
          />
        </div>
        <div className="fy-field">
          <label>{t("Tool_nps_vs_ops_LabelReturn")}</label>
          <input
            type="number"
            min={0}
            step={0.5}
            inputMode="decimal"
            value={npsReturn}
            onChange={(e) => setNpsReturn(Math.max(0, Number(e.target.value) || 0))}
          />
        </div>
        <div className="fy-field">
          <label>{t("Tool_nps_vs_ops_LabelAnnuity")}</label>
          <input
            type="number"
            min={0}
            step={0.5}
            inputMode="decimal"
            value={annuityRate}
            onChange={(e) => setAnnuityRate(Math.max(0, Number(e.target.value) || 0))}
          />
        </div>
        <button type="button" className="fy-btn-calc">
          {t("Common_Calculate")}
        </button>
      </div>

      <ResultSummaryCards cards={summaryCards} />
      <ScenarioCompare
        title={t("Tool_nps_vs_ops_ScenarioTitle")}
        subtitle={t("Tool_nps_vs_ops_ScenarioSubtitle")}
        scenarios={scenarios}
      />
      <WorkedExample
        title={t("Tool_nps_vs_ops_ExampleTitle")}
        subtitle={t("Tool_nps_vs_ops_ExampleSubtitle")}
        steps={exampleSteps}
      />
    </ToolPageShell>
  );
}
