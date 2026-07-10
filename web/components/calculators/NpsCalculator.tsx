"use client";

import { useMemo, useState } from "react";
import { useT } from "@/components/providers/I18nProvider";
import {
  BreakdownTable,
  FormulaCard,
  ResultSummaryCards,
  ScenarioCompare,
  ToolInfoPanel,
  ToolPageShell,
  WorkedExample,
} from "@/components/calculator/CalculatorUi";
import { calculateNps, npsYearlyRows } from "@/lib/finance/nps";
import { inr, percent } from "@/lib/finance/format";
import { getTool } from "@/lib/config/tools";
import { npsInfo, standardGrowthColumns } from "@/lib/tool-page-content";

export function NpsCalculator() {
  const t = useT();
  const tool = getTool("nps")!;

  const [currentAge, setCurrentAge] = useState(30);
  const [retirementAge, setRetirementAge] = useState(60);
  const [monthly, setMonthly] = useState(10_000);
  const [employerMonthly, setEmployerMonthly] = useState(0);
  const [existing, setExisting] = useState(0);
  const [returnPct, setReturnPct] = useState(10);
  const [annuityPct, setAnnuityPct] = useState(6);

  const breakdownColumns = useMemo(() => standardGrowthColumns(t), [t]);

  const exampleSteps = useMemo(
    () => [
      t("Tool_nps_ExampleStep_1"),
      t("Tool_nps_ExampleStep_2"),
      t("Tool_nps_ExampleStep_3"),
      t("Tool_nps_ExampleStep_4"),
      t("Tool_nps_ExampleStep_5"),
    ],
    [t],
  );

  const { summaryCards, scenarios, breakdownRows } = useMemo(() => {
    const result = calculateNps({
      currentAge,
      retirementAge,
      monthlyContribution: monthly,
      employerMonthly,
      existingCorpus: existing,
      expectedReturnPercent: returnPct,
      annuityRatePercent: annuityPct,
    });
    const conservative = calculateNps({
      currentAge,
      retirementAge,
      monthlyContribution: monthly,
      employerMonthly,
      existingCorpus: existing,
      expectedReturnPercent: 8,
      annuityRatePercent: annuityPct,
    });
    const aggressive = calculateNps({
      currentAge,
      retirementAge,
      monthlyContribution: monthly,
      employerMonthly,
      existingCorpus: existing,
      expectedReturnPercent: 12,
      annuityRatePercent: annuityPct,
    });
    const totalMonthly = Math.max(0, monthly) + Math.max(0, employerMonthly);

    return {
      summaryCards: [
        {
          label: t("Tool_nps_Result_Corpus"),
          value: inr(result.corpus),
          footnote: t("Tool_nps_Result_CorpusFootnote", result.years, percent(returnPct)),
          variant: "primary" as const,
        },
        {
          label: t("Tool_nps_Result_LumpSum"),
          value: inr(result.lumpSum),
          footnote: t("Tool_nps_Result_LumpSumFootnote"),
          variant: "secure" as const,
        },
        {
          label: t("Tool_nps_Result_Pension"),
          value: inr(result.monthlyPension),
          footnote: t("Tool_nps_Result_PensionFootnote", percent(annuityPct)),
          variant: "volatile" as const,
        },
      ],
      scenarios: [
        {
          name: t("Tool_nps_Scenario_Conservative"),
          primaryLabel: t("Tool_nps_Result_Corpus"),
          primaryValue: inr(conservative.corpus),
          secondaryLabel: t("Tool_nps_Result_Pension"),
          secondaryValue: inr(conservative.monthlyPension),
          variant: "worst",
        },
        {
          name: t("Common_Scenario_Base"),
          primaryLabel: t("Tool_nps_Result_Corpus"),
          primaryValue: inr(result.corpus),
          secondaryLabel: t("Common_Label_Return"),
          secondaryValue: percent(returnPct),
          variant: "base",
        },
        {
          name: t("Tool_nps_Scenario_Aggressive"),
          primaryLabel: t("Tool_nps_Result_Corpus"),
          primaryValue: inr(aggressive.corpus),
          secondaryLabel: t("Tool_nps_Result_Pension"),
          secondaryValue: inr(aggressive.monthlyPension),
          variant: "best",
        },
      ],
      breakdownRows: npsYearlyRows(Math.max(0, existing), totalMonthly, returnPct, result.years).map((r) => ({
        cells: {
          year: t("Common_YearN", r.year),
          invested: inr(r.invested),
          value: inr(r.value),
          gain: inr(r.value - r.invested),
        },
      })),
    };
  }, [currentAge, retirementAge, monthly, employerMonthly, existing, returnPct, annuityPct, t]);

  return (
    <ToolPageShell
      title={t(tool.titleKey)}
      subtitle={t("Tool_nps_Subtitle")}
      description={t(tool.descriptionKey)}
      icon={tool.icon}
      educate={
        <>
          <div className="fy-info-box">
            <strong>{t("Common_WhatYouLearn")}</strong>
            <p>{t("Tool_nps_LearnText")}</p>
          </div>
          <FormulaCard
            title={t("Common_Formula")}
            code={"Corpus = FV(existing) + FV(SIP)\n60% lump sum + 40% annuity"}
            note={t("Tool_nps_FormulaNote")}
          />
        </>
      }
      below={<ToolInfoPanel info={npsInfo(t)} />}
    >
      <div className="fy-form-card">
        <h3>{t("Common_YourInputs")}</h3>
        <div className="fy-field">
          <label>{t("Tool_nps_LabelCurrentAge")}</label>
          <input
            type="number"
            min={18}
            max={70}
            inputMode="numeric"
            value={currentAge}
            onChange={(e) => setCurrentAge(Math.max(18, Number(e.target.value) || 18))}
          />
        </div>
        <div className="fy-field">
          <label>{t("Tool_nps_LabelRetireAge")}</label>
          <input
            type="number"
            min={45}
            max={75}
            inputMode="numeric"
            value={retirementAge}
            onChange={(e) => setRetirementAge(Math.max(45, Number(e.target.value) || 60))}
          />
        </div>
        <div className="fy-field">
          <label>{t("Tool_nps_LabelMonthly")}</label>
          <input
            type="number"
            min={0}
            step={500}
            inputMode="decimal"
            value={monthly}
            onChange={(e) => setMonthly(Math.max(0, Number(e.target.value) || 0))}
          />
        </div>
        <div className="fy-field">
          <label>{t("Tool_nps_LabelEmployer")}</label>
          <input
            type="number"
            min={0}
            step={500}
            inputMode="decimal"
            value={employerMonthly}
            onChange={(e) => setEmployerMonthly(Math.max(0, Number(e.target.value) || 0))}
          />
        </div>
        <div className="fy-field">
          <label>{t("Tool_nps_LabelExisting")}</label>
          <input
            type="number"
            min={0}
            step={1000}
            inputMode="decimal"
            value={existing}
            onChange={(e) => setExisting(Math.max(0, Number(e.target.value) || 0))}
          />
        </div>
        <div className="fy-field">
          <label>{t("Common_Label_RatePa")}</label>
          <input
            type="number"
            min={0}
            step={0.5}
            inputMode="decimal"
            value={returnPct}
            onChange={(e) => setReturnPct(Math.max(0, Number(e.target.value) || 0))}
          />
        </div>
        <div className="fy-field">
          <label>{t("Tool_nps_LabelAnnuity")}</label>
          <input
            type="number"
            min={0}
            step={0.25}
            inputMode="decimal"
            value={annuityPct}
            onChange={(e) => setAnnuityPct(Math.max(0, Number(e.target.value) || 0))}
          />
          <p className="fy-field-hint">{t("Tool_nps_AnnuityHint")}</p>
        </div>
        <button type="button" className="fy-btn-calc">
          {t("Common_Calculate")}
        </button>
      </div>

      <ResultSummaryCards cards={summaryCards} />
      <ScenarioCompare title={t("Tool_nps_ScenarioTitle")} subtitle={t("Tool_nps_ScenarioSubtitle")} scenarios={scenarios} />
      <BreakdownTable title={t("Tool_nps_BreakdownTitle")} columns={breakdownColumns} rows={breakdownRows} />
      <WorkedExample title={t("Tool_nps_ExampleTitle")} subtitle={t("Tool_nps_ExampleSubtitle")} steps={exampleSteps} />
    </ToolPageShell>
  );
}
