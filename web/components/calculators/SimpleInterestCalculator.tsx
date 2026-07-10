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
import { calculateSimpleInterest } from "@/lib/finance/simpleInterest";
import { compoundInterest } from "@/lib/finance/compound";
import { inr, percent } from "@/lib/finance/format";
import { getTool } from "@/lib/config/tools";
import { simpleInterestInfo } from "@/lib/tool-page-content";

export function SimpleInterestCalculator() {
  const t = useT();
  const tool = getTool("simple-interest")!;

  const [principal, setPrincipal] = useState(100_000);
  const [rate, setRate] = useState(8);
  const [years, setYears] = useState(3);

  const exampleSteps = useMemo(
    () => [
      t("Tool_simple_interest_ExampleStep_1"),
      t("Tool_simple_interest_ExampleStep_2"),
      t("Tool_simple_interest_ExampleStep_3"),
      t("Tool_simple_interest_ExampleStep_4"),
      t("Tool_simple_interest_ExampleStep_5"),
    ],
    [t],
  );

  const { summaryCards, scenarios } = useMemo(() => {
    const result = calculateSimpleInterest(principal, rate, years);
    const halfTime = calculateSimpleInterest(principal, rate, years / 2);
    const doubleRate = calculateSimpleInterest(principal, rate * 2, years);
    const compoundAmount = compoundInterest(Math.max(0, principal), Math.max(0, rate), Math.max(0, years), 1);
    const compoundInterestEarned = Math.max(0, compoundAmount - Math.max(0, principal));

    return {
      summaryCards: [
        {
          label: t("Tool_simple_interest_Result_Interest"),
          value: inr(result.interest),
          footnote: t("Tool_simple_interest_Result_InterestFootnote", percent(rate), years),
          variant: "primary" as const,
        },
        {
          label: t("Tool_simple_interest_Result_Amount"),
          value: inr(result.amount),
          footnote: t("Tool_simple_interest_Result_AmountFootnote"),
          variant: "secure" as const,
        },
        {
          label: t("Tool_simple_interest_Result_Principal"),
          value: inr(result.principal),
          footnote: t("Tool_simple_interest_Result_PrincipalFootnote"),
        },
      ],
      scenarios: [
        {
          name: t("Tool_simple_interest_Scenario_HalfTime"),
          primaryLabel: t("Tool_simple_interest_Result_Interest"),
          primaryValue: inr(halfTime.interest),
          secondaryLabel: t("Common_Label_Years"),
          secondaryValue: String(years / 2),
          variant: "worst",
        },
        {
          name: t("Common_Scenario_Base"),
          primaryLabel: t("Tool_simple_interest_Result_Interest"),
          primaryValue: inr(result.interest),
          secondaryLabel: t("Tool_simple_interest_VsCompound"),
          secondaryValue: inr(compoundInterestEarned),
          variant: "base",
        },
        {
          name: t("Tool_simple_interest_Scenario_DoubleRate"),
          primaryLabel: t("Tool_simple_interest_Result_Interest"),
          primaryValue: inr(doubleRate.interest),
          secondaryLabel: t("Common_Label_Return"),
          secondaryValue: percent(rate * 2),
          variant: "best",
        },
      ],
    };
  }, [principal, rate, years, t]);

  return (
    <ToolPageShell
      title={t(tool.titleKey)}
      subtitle={t("Tool_simple_interest_Subtitle")}
      description={t(tool.descriptionKey)}
      icon={tool.icon}
      educate={
        <>
          <div className="fy-info-box">
            <strong>{t("Common_WhatYouLearn")}</strong>
            <p>{t("Tool_simple_interest_LearnText")}</p>
          </div>
          <FormulaCard
            title={t("Common_Formula")}
            code={"SI = P × R × T / 100\nAmount = P + SI"}
            note={t("Tool_simple_interest_FormulaNote")}
          />
        </>
      }
      below={<ToolInfoPanel info={simpleInterestInfo(t)} />}
    >
      <div className="fy-form-card">
        <h3>{t("Common_YourInputs")}</h3>
        <div className="fy-field">
          <label>{t("Tool_simple_interest_LabelPrincipal")}</label>
          <input
            type="number"
            min={0}
            step={1000}
            inputMode="decimal"
            value={principal}
            onChange={(e) => setPrincipal(Math.max(0, Number(e.target.value) || 0))}
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
          <label>{t("Tool_simple_interest_LabelYears")}</label>
          <input
            type="number"
            min={0}
            step={0.25}
            inputMode="decimal"
            value={years}
            onChange={(e) => setYears(Math.max(0, Number(e.target.value) || 0))}
          />
          <p className="fy-field-hint">{t("Tool_simple_interest_YearsHint")}</p>
        </div>
        <button type="button" className="fy-btn-calc">
          {t("Common_Calculate")}
        </button>
      </div>

      <ResultSummaryCards cards={summaryCards} />
      <ScenarioCompare
        title={t("Tool_simple_interest_ScenarioTitle")}
        subtitle={t("Tool_simple_interest_ScenarioSubtitle")}
        scenarios={scenarios}
      />
      <WorkedExample
        title={t("Tool_simple_interest_ExampleTitle")}
        subtitle={t("Tool_simple_interest_ExampleSubtitle")}
        steps={exampleSteps}
      />
    </ToolPageShell>
  );
}
