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
import { calculateRetirement } from "@/lib/finance/retirement";
import { inr, percent } from "@/lib/finance/format";
import { getTool } from "@/lib/config/tools";
import { retirementInfo } from "@/lib/tool-page-content";

export function RetirementCalculator() {
  const t = useT();
  const tool = getTool("retirement")!;

  const [currentAge, setCurrentAge] = useState(30);
  const [retireAge, setRetireAge] = useState(60);
  const [monthlyExpense, setMonthlyExpense] = useState(50_000);
  const [inflationPercent, setInflationPercent] = useState(6);
  const [corpusMultiplier, setCorpusMultiplier] = useState(25);
  const [preRetireReturnPercent, setPreRetireReturnPercent] = useState(10);
  const [existingSavings, setExistingSavings] = useState(500_000);

  const exampleSteps = useMemo(
    () => [
      t("Tool_retirement_ExampleStep_1"),
      t("Tool_retirement_ExampleStep_2"),
      t("Tool_retirement_ExampleStep_3"),
      t("Tool_retirement_ExampleStep_4"),
      t("Tool_retirement_ExampleStep_5"),
    ],
    [t],
  );

  const { summaryCards, scenarios } = useMemo(() => {
    const base = {
      currentAge,
      retireAge,
      monthlyExpense,
      inflationPercent,
      corpusMultiplier,
      preRetireReturnPercent,
      existingSavings,
    };
    const result = calculateRetirement(base);
    const secure = calculateRetirement({ ...base, preRetireReturnPercent: 7 });
    const aggressive = calculateRetirement({ ...base, preRetireReturnPercent: 12 });

    return {
      summaryCards: [
        {
          label: t("Tool_retirement_Result_Corpus"),
          value: inr(result.targetCorpus),
          footnote: t(
            "Tool_retirement_Result_CorpusFootnote",
            inr(result.futureMonthlyExpense),
            String(Math.round(result.corpusMultiplier * 10) / 10),
          ),
          variant: "primary" as const,
        },
        {
          label: t("Tool_retirement_Result_Sip"),
          value: inr(result.monthlySipRequired),
          footnote: t("Tool_retirement_Result_SipFootnote", percent(result.preRetireReturnPercent)),
          variant: "secure" as const,
        },
        {
          label: t("Tool_retirement_Result_Gap"),
          value: inr(result.corpusGap),
          footnote: t("Tool_retirement_Result_GapFootnote", inr(result.existingAtRetirement)),
        },
      ],
      scenarios: [
        {
          name: t("Tool_retirement_Scenario_Secure"),
          primaryLabel: t("Common_Label_MonthlySip"),
          primaryValue: inr(secure.monthlySipRequired),
          secondaryLabel: t("Common_Label_Return"),
          secondaryValue: "7%",
          variant: "secure",
        },
        {
          name: t("Common_Scenario_YourRate"),
          primaryLabel: t("Common_Label_MonthlySip"),
          primaryValue: inr(result.monthlySipRequired),
          secondaryLabel: t("Common_Label_Return"),
          secondaryValue: percent(preRetireReturnPercent),
          variant: "base",
        },
        {
          name: t("Tool_retirement_Scenario_Aggressive"),
          primaryLabel: t("Common_Label_MonthlySip"),
          primaryValue: inr(aggressive.monthlySipRequired),
          secondaryLabel: t("Common_Label_Return"),
          secondaryValue: "12%",
          variant: "best",
        },
      ],
    };
  }, [
    currentAge,
    retireAge,
    monthlyExpense,
    inflationPercent,
    corpusMultiplier,
    preRetireReturnPercent,
    existingSavings,
    t,
  ]);

  return (
    <ToolPageShell
      title={t(tool.titleKey)}
      subtitle={t("Tool_retirement_Subtitle")}
      description={t(tool.descriptionKey)}
      icon={tool.icon}
      educate={
        <>
          <div className="fy-info-box">
            <strong>{t("Common_WhatYouLearn")}</strong>
            <p>{t("Tool_retirement_LearnText")}</p>
          </div>
          <FormulaCard
            title={t("Common_Formula")}
            code={
              "futureMonthly = expense × (1 + inflation)^years\ncorpus = futureMonthly × 12 × multiplier\nSIP = sipRequired(gap, return, months)"
            }
            note={t("Tool_retirement_FormulaNote")}
          />
        </>
      }
      below={<ToolInfoPanel info={retirementInfo(t)} />}
    >
      <div className="fy-form-card">
        <h3>{t("Common_YourInputs")}</h3>
        <div className="fy-field">
          <label>{t("Tool_retirement_LabelCurrentAge")}</label>
          <input
            type="number"
            min={0}
            max={100}
            inputMode="numeric"
            value={currentAge}
            onChange={(e) => setCurrentAge(Math.max(0, Number(e.target.value) || 0))}
          />
        </div>
        <div className="fy-field">
          <label>{t("Tool_retirement_LabelRetireAge")}</label>
          <input
            type="number"
            min={0}
            max={100}
            inputMode="numeric"
            value={retireAge}
            onChange={(e) => setRetireAge(Math.max(0, Number(e.target.value) || 0))}
          />
        </div>
        <div className="fy-field">
          <label>{t("Tool_retirement_LabelExpense")}</label>
          <input
            type="number"
            min={0}
            step={1000}
            inputMode="decimal"
            value={monthlyExpense}
            onChange={(e) => setMonthlyExpense(Math.max(0, Number(e.target.value) || 0))}
          />
        </div>
        <div className="fy-field">
          <label>{t("Tool_retirement_LabelInflation")}</label>
          <input
            type="number"
            min={0}
            step={0.1}
            inputMode="decimal"
            value={inflationPercent}
            onChange={(e) => setInflationPercent(Math.max(0, Number(e.target.value) || 0))}
          />
        </div>
        <div className="fy-field">
          <label>{t("Tool_retirement_LabelMultiplier")}</label>
          <input
            type="number"
            min={1}
            step={1}
            inputMode="decimal"
            value={corpusMultiplier}
            onChange={(e) => setCorpusMultiplier(Math.max(1, Number(e.target.value) || 25))}
          />
          <p className="fy-field-hint">{t("Tool_retirement_MultiplierHint")}</p>
        </div>
        <div className="fy-field">
          <label>{t("Tool_retirement_LabelReturn")}</label>
          <input
            type="number"
            min={0}
            step={0.1}
            inputMode="decimal"
            value={preRetireReturnPercent}
            onChange={(e) => setPreRetireReturnPercent(Math.max(0, Number(e.target.value) || 0))}
          />
        </div>
        <div className="fy-field">
          <label>{t("Tool_retirement_LabelExisting")}</label>
          <input
            type="number"
            min={0}
            step={10000}
            inputMode="decimal"
            value={existingSavings}
            onChange={(e) => setExistingSavings(Math.max(0, Number(e.target.value) || 0))}
          />
        </div>
        <button type="button" className="fy-btn-calc">
          {t("Common_Calculate")}
        </button>
      </div>

      <ResultSummaryCards cards={summaryCards} />
      <ScenarioCompare
        title={t("Tool_retirement_ScenarioTitle")}
        subtitle={t("Tool_retirement_ScenarioSubtitle")}
        scenarios={scenarios}
      />
      <WorkedExample
        title={t("Tool_retirement_ExampleTitle")}
        subtitle={t("Tool_retirement_ExampleSubtitle")}
        steps={exampleSteps}
      />
    </ToolPageShell>
  );
}
