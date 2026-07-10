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
import { calculateUps } from "@/lib/finance/ups";
import { inr, percent } from "@/lib/finance/format";
import { getTool } from "@/lib/config/tools";
import { upsInfo } from "@/lib/tool-page-content";

export function UpsCalculator() {
  const t = useT();
  const tool = getTool("ups")!;

  const [monthlyBasic, setMonthlyBasic] = useState(80_000);
  const [years, setYears] = useState(25);
  const [empPct, setEmpPct] = useState(10);
  const [govtPct, setGovtPct] = useState(18.5);
  const [npsReturn, setNpsReturn] = useState(10);
  const [annuityRate, setAnnuityRate] = useState(6);

  const exampleSteps = useMemo(
    () => [
      t("Tool_ups_ExampleStep_1"),
      t("Tool_ups_ExampleStep_2"),
      t("Tool_ups_ExampleStep_3"),
      t("Tool_ups_ExampleStep_4"),
      t("Tool_ups_ExampleStep_5"),
    ],
    [t],
  );

  const { summaryCards, scenarios } = useMemo(() => {
    const result = calculateUps({
      monthlyBasic,
      yearsOfService: years,
      employeeContribPercent: empPct,
      govtContribPercent: govtPct,
      npsReturnPercent: npsReturn,
      annuityRatePercent: annuityRate,
    });
    const shorter = calculateUps({
      monthlyBasic,
      yearsOfService: Math.max(1, years - 5),
      employeeContribPercent: empPct,
      govtContribPercent: govtPct,
      npsReturnPercent: npsReturn,
      annuityRatePercent: annuityRate,
    });
    const longer = calculateUps({
      monthlyBasic,
      yearsOfService: years + 5,
      employeeContribPercent: empPct,
      govtContribPercent: govtPct,
      npsReturnPercent: npsReturn,
      annuityRatePercent: annuityRate,
    });

    return {
      summaryCards: [
        {
          label: t("Tool_ups_Result_UpsPension"),
          value: inr(result.upsMonthlyPension),
          footnote: t("Tool_ups_Result_UpsPensionFootnote", percent(result.assuredPensionPercent, 1)),
          variant: "primary" as const,
        },
        {
          label: t("Tool_ups_Result_NpsPension"),
          value: inr(result.npsMonthlyPension),
          footnote: t("Tool_ups_Result_NpsPensionFootnote", inr(result.npsCorpus)),
        },
        {
          label: t("Tool_ups_Result_Gap"),
          value: inr(result.pensionGap),
          footnote: t("Tool_ups_Result_GapFootnote"),
          variant: result.pensionGap >= 0 ? ("secure" as const) : ("volatile" as const),
        },
      ],
      scenarios: [
        {
          name: t("Tool_ups_Scenario_Shorter"),
          primaryLabel: t("Tool_ups_Result_UpsPension"),
          primaryValue: inr(shorter.upsMonthlyPension),
          secondaryLabel: t("Tool_ups_Result_NpsPension"),
          secondaryValue: inr(shorter.npsMonthlyPension),
          variant: "worst" as const,
        },
        {
          name: t("Common_Scenario_Base"),
          primaryLabel: t("Tool_ups_Result_UpsPension"),
          primaryValue: inr(result.upsMonthlyPension),
          secondaryLabel: t("Tool_ups_Result_Gap"),
          secondaryValue: inr(result.pensionGap),
          variant: "base" as const,
        },
        {
          name: t("Tool_ups_Scenario_Longer"),
          primaryLabel: t("Tool_ups_Result_UpsPension"),
          primaryValue: inr(longer.upsMonthlyPension),
          secondaryLabel: t("Tool_ups_Result_NpsPension"),
          secondaryValue: inr(longer.npsMonthlyPension),
          variant: "best" as const,
        },
      ],
    };
  }, [monthlyBasic, years, empPct, govtPct, npsReturn, annuityRate, t]);

  return (
    <ToolPageShell
      title={t(tool.titleKey)}
      subtitle={t("Tool_ups_Subtitle")}
      description={t(tool.descriptionKey)}
      icon={tool.icon}
      educate={
        <>
          <div className="fy-info-box">
            <strong>{t("Common_WhatYouLearn")}</strong>
            <p>{t("Tool_ups_LearnText")}</p>
          </div>
          <FormulaCard
            title={t("Common_Formula")}
            code={"UPS% = min(50%, 50% × yrs/25)\nUPS pension = basic × UPS%\nNPS corpus = SIP(emp+govt)"}
            note={t("Tool_ups_FormulaNote")}
          />
        </>
      }
      below={<ToolInfoPanel info={upsInfo(t)} />}
    >
      <div className="fy-form-card">
        <h3>{t("Common_YourInputs")}</h3>
        <div className="fy-field">
          <label>{t("Tool_ups_LabelBasic")}</label>
          <input
            type="number"
            min={0}
            step={1000}
            inputMode="decimal"
            value={monthlyBasic}
            onChange={(e) => setMonthlyBasic(Math.max(0, Number(e.target.value) || 0))}
          />
        </div>
        <div className="fy-field">
          <label>{t("Tool_ups_LabelYears")}</label>
          <input
            type="number"
            min={0}
            max={40}
            step={1}
            inputMode="decimal"
            value={years}
            onChange={(e) => setYears(Math.max(0, Number(e.target.value) || 0))}
          />
          <p className="fy-field-hint">{t("Tool_ups_YearsHint")}</p>
        </div>
        <div className="fy-field">
          <label>{t("Tool_ups_LabelEmpPct")}</label>
          <input
            type="number"
            min={0}
            max={20}
            step={0.5}
            inputMode="decimal"
            value={empPct}
            onChange={(e) => setEmpPct(Math.max(0, Number(e.target.value) || 0))}
          />
        </div>
        <div className="fy-field">
          <label>{t("Tool_ups_LabelGovtPct")}</label>
          <input
            type="number"
            min={0}
            max={30}
            step={0.5}
            inputMode="decimal"
            value={govtPct}
            onChange={(e) => setGovtPct(Math.max(0, Number(e.target.value) || 0))}
          />
        </div>
        <div className="fy-field">
          <label>{t("Tool_ups_LabelNpsReturn")}</label>
          <input
            type="number"
            min={0}
            max={20}
            step={0.5}
            inputMode="decimal"
            value={npsReturn}
            onChange={(e) => setNpsReturn(Math.max(0, Number(e.target.value) || 0))}
          />
        </div>
        <div className="fy-field">
          <label>{t("Tool_ups_LabelAnnuity")}</label>
          <input
            type="number"
            min={0}
            max={12}
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
        title={t("Tool_ups_ScenarioTitle")}
        subtitle={t("Tool_ups_ScenarioSubtitle")}
        scenarios={scenarios}
      />
      <WorkedExample
        title={t("Tool_ups_ExampleTitle")}
        subtitle={t("Tool_ups_ExampleSubtitle")}
        steps={exampleSteps}
      />
    </ToolPageShell>
  );
}
