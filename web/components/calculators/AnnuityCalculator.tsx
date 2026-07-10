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
import { calculateAnnuity } from "@/lib/finance/annuity";
import { inr, percent } from "@/lib/finance/format";
import { getTool } from "@/lib/config/tools";
import { annuityInfo } from "@/lib/tool-page-content";

export function AnnuityCalculator() {
  const t = useT();
  const tool = getTool("annuity")!;

  const [corpus, setCorpus] = useState(5_000_000);
  const [rate, setRate] = useState(6);
  const [years, setYears] = useState(20);
  const [forever, setForever] = useState(false);

  const exampleSteps = useMemo(
    () => [
      t("Tool_annuity_ExampleStep_1"),
      t("Tool_annuity_ExampleStep_2"),
      t("Tool_annuity_ExampleStep_3"),
      t("Tool_annuity_ExampleStep_4"),
      t("Tool_annuity_ExampleStep_5"),
    ],
    [t],
  );

  const { summaryCards, scenarios } = useMemo(() => {
    const result = calculateAnnuity(corpus, rate, years, forever);
    const lower = calculateAnnuity(corpus, Math.max(0, rate - 1), years, forever);
    const higher = calculateAnnuity(corpus, rate + 1, years, forever);
    const perp = calculateAnnuity(corpus, rate, years, true);

    return {
      summaryCards: [
        {
          label: t("Tool_annuity_Result_Monthly"),
          value: inr(result.monthlyPension),
          footnote: forever
            ? t("Tool_annuity_Result_MonthlyForever")
            : t("Tool_annuity_Result_MonthlyFootnote", years),
          variant: "primary" as const,
        },
        {
          label: t("Tool_annuity_Result_Annual"),
          value: inr(result.annualPension),
          footnote: t("Common_Footnote_RatePa", percent(rate)),
          variant: "secure" as const,
        },
        {
          label: forever
            ? t("Tool_annuity_Result_Perpetuity")
            : t("Tool_annuity_Result_TotalPayout"),
          value: forever ? t("Tool_annuity_ForeverLabel") : inr(result.totalPayout ?? 0),
          footnote: forever
            ? t("Tool_annuity_Result_PerpetuityFootnote")
            : t("Tool_annuity_Result_TotalFootnote"),
        },
      ],
      scenarios: [
        {
          name: t("Tool_annuity_Scenario_LowerRate"),
          primaryLabel: t("Tool_annuity_Result_Monthly"),
          primaryValue: inr(lower.monthlyPension),
          secondaryLabel: t("Common_Label_Return"),
          secondaryValue: percent(Math.max(0, rate - 1)),
          variant: "worst",
        },
        {
          name: t("Common_Scenario_Base"),
          primaryLabel: t("Tool_annuity_Result_Monthly"),
          primaryValue: inr(result.monthlyPension),
          secondaryLabel: forever
            ? t("Tool_annuity_ForeverLabel")
            : t("Common_Label_Years"),
          secondaryValue: forever ? "∞" : String(years),
          variant: "base",
        },
        {
          name: forever
            ? t("Tool_annuity_Scenario_HigherRate")
            : t("Tool_annuity_Scenario_Forever"),
          primaryLabel: t("Tool_annuity_Result_Monthly"),
          primaryValue: inr(forever ? higher.monthlyPension : perp.monthlyPension),
          secondaryLabel: forever ? t("Common_Label_Return") : t("Tool_annuity_ForeverLabel"),
          secondaryValue: forever ? percent(rate + 1) : percent(rate),
          variant: "best",
        },
      ],
    };
  }, [corpus, rate, years, forever, t]);

  return (
    <ToolPageShell
      title={t(tool.titleKey)}
      subtitle={t("Tool_annuity_Subtitle")}
      description={t(tool.descriptionKey)}
      icon={tool.icon}
      educate={
        <>
          <div className="fy-info-box">
            <strong>{t("Common_WhatYouLearn")}</strong>
            <p>{t("Tool_annuity_LearnText")}</p>
          </div>
          <FormulaCard
            title={t("Common_Formula")}
            code={
              "Forever: monthly ≈ corpus × r / 12\nFinite: PMT = corpus × r_m / (1 − (1+r_m)^(−n))"
            }
            note={t("Tool_annuity_FormulaNote")}
          />
        </>
      }
      below={<ToolInfoPanel info={annuityInfo(t)} />}
    >
      <div className="fy-form-card">
        <h3>{t("Common_YourInputs")}</h3>
        <div className="fy-field">
          <label>{t("Tool_annuity_LabelCorpus")}</label>
          <input
            type="number"
            min={0}
            step={100000}
            inputMode="decimal"
            value={corpus}
            onChange={(e) => setCorpus(Math.max(0, Number(e.target.value) || 0))}
          />
        </div>
        <div className="fy-field">
          <label>{t("Common_Label_RatePa")}</label>
          <input
            type="number"
            min={0}
            step={0.1}
            inputMode="decimal"
            value={rate}
            onChange={(e) => setRate(Math.max(0, Number(e.target.value) || 0))}
          />
        </div>
        <div className="fy-field">
          <label>
            <input
              type="checkbox"
              checked={forever}
              onChange={(e) => setForever(e.target.checked)}
            />{" "}
            {t("Tool_annuity_LabelForever")}
          </label>
        </div>
        {!forever && (
          <div className="fy-field">
            <label>{t("Tool_annuity_LabelYears")}</label>
            <input
              type="number"
              min={1}
              step={1}
              inputMode="decimal"
              value={years}
              onChange={(e) => setYears(Math.max(1, Number(e.target.value) || 1))}
            />
            <p className="fy-field-hint">{t("Tool_annuity_YearsHint")}</p>
          </div>
        )}
        <button type="button" className="fy-btn-calc">
          {t("Common_Calculate")}
        </button>
      </div>

      <ResultSummaryCards cards={summaryCards} />
      <ScenarioCompare
        title={t("Tool_annuity_ScenarioTitle")}
        subtitle={t("Tool_annuity_ScenarioSubtitle")}
        scenarios={scenarios}
      />
      <WorkedExample
        title={t("Tool_annuity_ExampleTitle")}
        subtitle={t("Tool_annuity_ExampleSubtitle")}
        steps={exampleSteps}
      />
    </ToolPageShell>
  );
}
