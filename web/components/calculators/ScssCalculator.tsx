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
import { calculateScss, SCSS_DEFAULT_RATE, SCSS_MAX_DEPOSIT, SCSS_TENURE_YEARS } from "@/lib/finance/scss";
import { inr, percent } from "@/lib/finance/format";
import { getTool } from "@/lib/config/tools";
import { scssInfo } from "@/lib/tool-page-content";

export function ScssCalculator() {
  const t = useT();
  const tool = getTool("scss")!;

  const [deposit, setDeposit] = useState(1_500_000);
  const [rate, setRate] = useState(SCSS_DEFAULT_RATE);
  const [years, setYears] = useState(SCSS_TENURE_YEARS);
  const [taxSlab, setTaxSlab] = useState(20);

  const exampleSteps = useMemo(
    () => [
      t("Tool_scss_ExampleStep_1"),
      t("Tool_scss_ExampleStep_2"),
      t("Tool_scss_ExampleStep_3"),
      t("Tool_scss_ExampleStep_4"),
      t("Tool_scss_ExampleStep_5"),
    ],
    [t],
  );

  const { summaryCards, scenarios, taxNote } = useMemo(() => {
    const result = calculateScss(deposit, rate, years);
    const low = calculateScss(deposit, 7.5, years);
    const high = calculateScss(deposit, 8.5, years);
    const taxOnInterest = result.annualInterest * (taxSlab / 100);

    return {
      taxNote: t("Tool_scss_TaxNote", inr(result.annualInterest), percent(taxSlab, 0), inr(taxOnInterest)),
      summaryCards: [
        {
          label: t("Tool_scss_Result_Quarterly"),
          value: inr(result.quarterlyInterest),
          footnote: t("Tool_scss_Result_QuarterlyFootnote"),
          variant: "primary" as const,
        },
        {
          label: t("Tool_scss_Result_Annual"),
          value: inr(result.annualInterest),
          footnote: t("Common_Footnote_RatePa", percent(rate)),
          variant: "secure" as const,
        },
        {
          label: t("Tool_scss_Result_TotalInterest"),
          value: inr(result.totalInterest),
          footnote: t("Tool_scss_Result_TotalFootnote", years, inr(result.maturityAmount)),
        },
      ],
      scenarios: [
        {
          name: t("Tool_scss_Scenario_Low"),
          primaryLabel: t("Tool_scss_Result_Quarterly"),
          primaryValue: inr(low.quarterlyInterest),
          secondaryLabel: t("Common_Label_Return"),
          secondaryValue: "7.5%",
          variant: "worst",
        },
        {
          name: t("Common_Scenario_Base"),
          primaryLabel: t("Tool_scss_Result_Quarterly"),
          primaryValue: inr(result.quarterlyInterest),
          secondaryLabel: t("Common_Label_Return"),
          secondaryValue: percent(rate),
          variant: "base",
        },
        {
          name: t("Tool_scss_Scenario_High"),
          primaryLabel: t("Tool_scss_Result_Quarterly"),
          primaryValue: inr(high.quarterlyInterest),
          secondaryLabel: t("Common_Label_Return"),
          secondaryValue: "8.5%",
          variant: "best",
        },
      ],
    };
  }, [deposit, rate, years, taxSlab, t]);

  return (
    <ToolPageShell
      title={t(tool.titleKey)}
      subtitle={t("Tool_scss_Subtitle")}
      description={t(tool.descriptionKey)}
      icon={tool.icon}
      educate={
        <>
          <div className="fy-info-box">
            <strong>{t("Common_WhatYouLearn")}</strong>
            <p>{t("Tool_scss_LearnText")}</p>
          </div>
          <FormulaCard
            title={t("Common_Formula")}
            code={"Quarterly interest = Deposit × rate / 4\nPrincipal returned at maturity"}
            note={t("Tool_scss_FormulaNote")}
          />
        </>
      }
      below={<ToolInfoPanel info={scssInfo(t)} />}
    >
      <div className="fy-form-card">
        <h3>{t("Common_YourInputs")}</h3>
        <div className="fy-field">
          <label>{t("Tool_scss_LabelDeposit")}</label>
          <input
            type="number"
            min={1000}
            max={SCSS_MAX_DEPOSIT}
            step={10000}
            inputMode="decimal"
            value={deposit}
            onChange={(e) => setDeposit(Math.max(0, Number(e.target.value) || 0))}
          />
          <p className="fy-field-hint">{t("Tool_scss_MaxHint", inr(SCSS_MAX_DEPOSIT))}</p>
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
          <label>{t("Common_Label_Years")}</label>
          <input
            type="number"
            min={5}
            max={8}
            step={1}
            inputMode="numeric"
            value={years}
            onChange={(e) => setYears(Math.max(5, Number(e.target.value) || 5))}
          />
          <p className="fy-field-hint">{t("Tool_scss_TenureHint")}</p>
        </div>
        <div className="fy-field">
          <label>{t("Tool_scss_LabelSlab")}</label>
          <select value={taxSlab} onChange={(e) => setTaxSlab(Number(e.target.value))}>
            <option value={0}>0%</option>
            <option value={5}>5%</option>
            <option value={10}>10%</option>
            <option value={20}>20%</option>
            <option value={30}>30%</option>
          </select>
        </div>
        <button type="button" className="fy-btn-calc">
          {t("Common_Calculate")}
        </button>
      </div>

      <div className="fy-info-box fy-tax-verdict">
        <strong>{t("Tool_scss_TaxTitle")}</strong>
        <p>{taxNote}</p>
      </div>

      <ResultSummaryCards cards={summaryCards} />
      <ScenarioCompare title={t("Tool_scss_ScenarioTitle")} subtitle={t("Tool_scss_ScenarioSubtitle")} scenarios={scenarios} />
      <WorkedExample title={t("Tool_scss_ExampleTitle")} subtitle={t("Tool_scss_ExampleSubtitle")} steps={exampleSteps} />
    </ToolPageShell>
  );
}
