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
import { calculateEpf, EPF_DEFAULT_RATE } from "@/lib/finance/epf";
import { inr, percent } from "@/lib/finance/format";
import { getTool } from "@/lib/config/tools";
import { epfInfo } from "@/lib/tool-page-content";

export function EpfCalculator() {
  const t = useT();
  const tool = getTool("epf")!;

  const [basic, setBasic] = useState(40_000);
  const [years, setYears] = useState(20);
  const [rate, setRate] = useState(EPF_DEFAULT_RATE);
  const [existing, setExisting] = useState(200_000);
  const [pfOnActual, setPfOnActual] = useState(true);

  const breakdownColumns = useMemo(
    () => [
      { key: "year", header: t("Common_Year"), alignRight: false as const },
      { key: "employee", header: t("Tool_epf_Col_Employee") },
      { key: "employer", header: t("Tool_epf_Col_Employer") },
      { key: "interest", header: t("Common_Col_Interest") },
      { key: "balance", header: t("Common_Col_Balance") },
    ],
    [t],
  );

  const exampleSteps = useMemo(
    () => [
      t("Tool_epf_ExampleStep_1"),
      t("Tool_epf_ExampleStep_2"),
      t("Tool_epf_ExampleStep_3"),
      t("Tool_epf_ExampleStep_4"),
      t("Tool_epf_ExampleStep_5"),
    ],
    [t],
  );

  const { summaryCards, scenarios, breakdownRows, epsNote } = useMemo(() => {
    const result = calculateEpf(basic, years, rate, existing, pfOnActual);
    const low = calculateEpf(basic, years, 7.5, existing, pfOnActual);
    const high = calculateEpf(basic, years, 8.5, existing, pfOnActual);

    return {
      epsNote: t("Tool_epf_EpsNote", inr(result.monthlyEps)),
      summaryCards: [
        {
          label: t("Tool_epf_Result_Corpus"),
          value: inr(result.maturity),
          footnote: t("Tool_epf_Result_CorpusFootnote", years, percent(rate)),
          variant: "primary" as const,
        },
        {
          label: t("Tool_epf_Result_Contributions"),
          value: inr(result.totalEmployee + result.totalEmployer),
          footnote: t("Tool_epf_Result_ContributionsFootnote"),
        },
        {
          label: t("Tool_epf_Result_Interest"),
          value: inr(result.totalInterest),
          footnote: t("Tool_epf_Result_InterestFootnote"),
          variant: "secure" as const,
        },
      ],
      scenarios: [
        {
          name: t("Tool_epf_Scenario_Low"),
          primaryLabel: t("Tool_epf_Result_Corpus"),
          primaryValue: inr(low.maturity),
          secondaryLabel: t("Common_Label_Return"),
          secondaryValue: "7.5%",
          variant: "worst",
        },
        {
          name: t("Common_Scenario_Base"),
          primaryLabel: t("Tool_epf_Result_Corpus"),
          primaryValue: inr(result.maturity),
          secondaryLabel: t("Common_Label_Return"),
          secondaryValue: percent(rate),
          variant: "base",
        },
        {
          name: t("Tool_epf_Scenario_High"),
          primaryLabel: t("Tool_epf_Result_Corpus"),
          primaryValue: inr(high.maturity),
          secondaryLabel: t("Common_Label_Return"),
          secondaryValue: "8.5%",
          variant: "best",
        },
      ],
      breakdownRows: result.rows.map((r) => ({
        cells: {
          year: t("Common_YearN", r.year),
          employee: inr(r.employee),
          employer: inr(r.employer),
          interest: inr(r.interest),
          balance: inr(r.balance),
        },
      })),
    };
  }, [basic, years, rate, existing, pfOnActual, t]);

  return (
    <ToolPageShell
      title={t(tool.titleKey)}
      subtitle={t("Tool_epf_Subtitle")}
      description={t(tool.descriptionKey)}
      icon={tool.icon}
      educate={
        <>
          <div className="fy-info-box">
            <strong>{t("Common_WhatYouLearn")}</strong>
            <p>{t("Tool_epf_LearnText")}</p>
          </div>
          <FormulaCard
            title={t("Common_Formula")}
            code={"Employee 12% → EPF\nEmployer 3.67% → EPF, 8.33% → EPS"}
            note={t("Tool_epf_FormulaNote")}
          />
        </>
      }
      below={<ToolInfoPanel info={epfInfo(t)} />}
    >
      <div className="fy-form-card">
        <h3>{t("Common_YourInputs")}</h3>
        <div className="fy-field">
          <label>{t("Tool_epf_LabelBasic")}</label>
          <input
            type="number"
            min={0}
            step={1000}
            inputMode="decimal"
            value={basic}
            onChange={(e) => setBasic(Math.max(0, Number(e.target.value) || 0))}
          />
        </div>
        <div className="fy-field">
          <label>{t("Tool_epf_LabelExisting")}</label>
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
          <label>{t("Common_Label_Years")}</label>
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
          <label>{t("Common_Label_RatePa")}</label>
          <input
            type="number"
            min={0}
            step={0.05}
            inputMode="decimal"
            value={rate}
            onChange={(e) => setRate(Math.max(0, Number(e.target.value) || 0))}
          />
        </div>
        <div className="fy-field">
          <label>
            <input type="checkbox" checked={pfOnActual} onChange={(e) => setPfOnActual(e.target.checked)} />{" "}
            {t("Tool_epf_LabelPfActual")}
          </label>
          <p className="fy-field-hint">{t("Tool_epf_PfHint")}</p>
        </div>
        <button type="button" className="fy-btn-calc">
          {t("Common_Calculate")}
        </button>
      </div>

      <div className="fy-info-box fy-tax-verdict">
        <strong>{t("Tool_epf_EpsTitle")}</strong>
        <p>{epsNote}</p>
      </div>

      <ResultSummaryCards cards={summaryCards} />
      <ScenarioCompare title={t("Tool_epf_ScenarioTitle")} subtitle={t("Tool_epf_ScenarioSubtitle")} scenarios={scenarios} />
      <BreakdownTable title={t("Tool_epf_BreakdownTitle")} columns={breakdownColumns} rows={breakdownRows} />
      <WorkedExample title={t("Tool_epf_ExampleTitle")} subtitle={t("Tool_epf_ExampleSubtitle")} steps={exampleSteps} />
    </ToolPageShell>
  );
}
