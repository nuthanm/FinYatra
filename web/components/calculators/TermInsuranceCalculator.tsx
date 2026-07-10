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
  calculateTermInsurance,
  type TermCoverMethod,
} from "@/lib/finance/termInsurance";
import { inr } from "@/lib/finance/format";
import { getTool } from "@/lib/config/tools";
import { termInsuranceInfo } from "@/lib/tool-page-content";

export function TermInsuranceCalculator() {
  const t = useT();
  const tool = getTool("term-insurance")!;

  const [method, setMethod] = useState<TermCoverMethod>("income");
  const [annualIncome, setAnnualIncome] = useState(1_200_000);
  const [incomeYears, setIncomeYears] = useState(15);
  const [annualExpenses, setAnnualExpenses] = useState(600_000);
  const [expenseYears, setExpenseYears] = useState(20);
  const [liabilities, setLiabilities] = useState(2_000_000);
  const [existingCover, setExistingCover] = useState(2_500_000);

  const exampleSteps = useMemo(
    () => [
      t("Tool_term_insurance_ExampleStep_1"),
      t("Tool_term_insurance_ExampleStep_2"),
      t("Tool_term_insurance_ExampleStep_3"),
      t("Tool_term_insurance_ExampleStep_4"),
      t("Tool_term_insurance_ExampleStep_5"),
    ],
    [t],
  );

  const { summaryCards, scenarios, result } = useMemo(() => {
    const input = {
      method,
      annualIncome,
      incomeYears,
      annualExpenses,
      expenseYears,
      liabilities,
      existingCover,
    };
    const result = calculateTermInsurance(input);
    const incomeOnly = calculateTermInsurance({ ...input, method: "income" });
    const expenseOnly = calculateTermInsurance({ ...input, method: "expense" });

    return {
      result,
      summaryCards: [
        {
          label: t("Tool_term_insurance_Result_Suggested"),
          value: inr(result.suggestedCover),
          footnote: t("Tool_term_insurance_Result_SuggestedFootnote"),
          variant: "primary" as const,
        },
        {
          label: t("Tool_term_insurance_Result_Gap"),
          value: inr(result.gap),
          footnote:
            result.gap > 0
              ? t("Tool_term_insurance_Result_GapFootnote", inr(result.existingCover))
              : t("Tool_term_insurance_Result_GapOk"),
          variant: result.gap > 0 ? ("volatile" as const) : ("secure" as const),
        },
        {
          label: t("Tool_term_insurance_Result_Existing"),
          value: inr(result.existingCover),
          footnote: t("Tool_term_insurance_Result_ExistingFootnote"),
        },
      ],
      scenarios: [
        {
          name: t("Tool_term_insurance_Scenario_Income"),
          primaryLabel: t("Tool_term_insurance_Result_Suggested"),
          primaryValue: inr(incomeOnly.suggestedCover),
          secondaryLabel: t("Tool_term_insurance_Result_Gap"),
          secondaryValue: inr(incomeOnly.gap),
          variant: "base",
        },
        {
          name: t("Tool_term_insurance_Scenario_Expense"),
          primaryLabel: t("Tool_term_insurance_Result_Suggested"),
          primaryValue: inr(expenseOnly.suggestedCover),
          secondaryLabel: t("Tool_term_insurance_Result_Gap"),
          secondaryValue: inr(expenseOnly.gap),
          variant: "best",
        },
        {
          name: t("Tool_term_insurance_Scenario_Higher"),
          primaryLabel: t("Tool_term_insurance_Result_Suggested"),
          primaryValue: inr(
            Math.max(incomeOnly.suggestedCover, expenseOnly.suggestedCover),
          ),
          secondaryLabel: t("Tool_term_insurance_Result_Gap"),
          secondaryValue: inr(
            Math.max(0, Math.max(incomeOnly.suggestedCover, expenseOnly.suggestedCover) - existingCover),
          ),
          variant: "worst",
        },
      ],
    };
  }, [
    method,
    annualIncome,
    incomeYears,
    annualExpenses,
    expenseYears,
    liabilities,
    existingCover,
    t,
  ]);

  return (
    <ToolPageShell
      title={t(tool.titleKey)}
      subtitle={t("Tool_term_insurance_Subtitle")}
      description={t(tool.descriptionKey)}
      icon={tool.icon}
      educate={
        <>
          <div className="fy-info-box">
            <strong>{t("Common_WhatYouLearn")}</strong>
            <p>{t("Tool_term_insurance_LearnText")}</p>
          </div>
          <FormulaCard
            title={t("Common_Formula")}
            code={"Income method: income × years + liabilities\nExpense method: expenses × years + liabilities\ngap = need − existing"}
            note={t("Tool_term_insurance_FormulaNote")}
          />
        </>
      }
      below={<ToolInfoPanel info={termInsuranceInfo(t)} />}
    >
      <div className="fy-form-card">
        <h3>{t("Common_YourInputs")}</h3>
        <div className="fy-field">
          <label>{t("Tool_term_insurance_LabelMethod")}</label>
          <select
            value={method}
            onChange={(e) => setMethod(e.target.value as TermCoverMethod)}
          >
            <option value="income">{t("Tool_term_insurance_Method_Income")}</option>
            <option value="expense">{t("Tool_term_insurance_Method_Expense")}</option>
          </select>
        </div>
        {method === "income" ? (
          <>
            <div className="fy-field">
              <label>{t("Tool_term_insurance_LabelIncome")}</label>
              <input
                type="number"
                min={0}
                step={50000}
                inputMode="decimal"
                value={annualIncome}
                onChange={(e) => setAnnualIncome(Math.max(0, Number(e.target.value) || 0))}
              />
            </div>
            <div className="fy-field">
              <label>{t("Tool_term_insurance_LabelIncomeYears")}</label>
              <input
                type="number"
                min={1}
                max={40}
                step={1}
                inputMode="numeric"
                value={incomeYears}
                onChange={(e) =>
                  setIncomeYears(Math.max(1, Math.min(40, Number(e.target.value) || 1)))
                }
              />
              <p className="fy-field-hint">{t("Tool_term_insurance_IncomeYearsHint")}</p>
            </div>
          </>
        ) : (
          <>
            <div className="fy-field">
              <label>{t("Tool_term_insurance_LabelExpenses")}</label>
              <input
                type="number"
                min={0}
                step={25000}
                inputMode="decimal"
                value={annualExpenses}
                onChange={(e) => setAnnualExpenses(Math.max(0, Number(e.target.value) || 0))}
              />
            </div>
            <div className="fy-field">
              <label>{t("Tool_term_insurance_LabelExpenseYears")}</label>
              <input
                type="number"
                min={1}
                max={40}
                step={1}
                inputMode="numeric"
                value={expenseYears}
                onChange={(e) =>
                  setExpenseYears(Math.max(1, Math.min(40, Number(e.target.value) || 1)))
                }
              />
            </div>
          </>
        )}
        <div className="fy-field">
          <label>{t("Tool_term_insurance_LabelLiabilities")}</label>
          <input
            type="number"
            min={0}
            step={100000}
            inputMode="decimal"
            value={liabilities}
            onChange={(e) => setLiabilities(Math.max(0, Number(e.target.value) || 0))}
          />
          <p className="fy-field-hint">{t("Tool_term_insurance_LiabilitiesHint")}</p>
        </div>
        <div className="fy-field">
          <label>{t("Tool_term_insurance_LabelExisting")}</label>
          <input
            type="number"
            min={0}
            step={100000}
            inputMode="decimal"
            value={existingCover}
            onChange={(e) => setExistingCover(Math.max(0, Number(e.target.value) || 0))}
          />
        </div>
        <button type="button" className="fy-btn-calc">
          {t("Common_Calculate")}
        </button>
      </div>

      <div className="fy-info-box fy-tax-verdict">
        <strong>{t("Tool_term_insurance_VerdictTitle")}</strong>
        <p>
          {result.gap > 0
            ? t("Tool_term_insurance_VerdictGap", inr(result.suggestedCover), inr(result.gap))
            : t("Tool_term_insurance_VerdictOk", inr(result.suggestedCover))}
        </p>
      </div>

      <ResultSummaryCards cards={summaryCards} />
      <ScenarioCompare
        title={t("Tool_term_insurance_ScenarioTitle")}
        subtitle={t("Tool_term_insurance_ScenarioSubtitle")}
        scenarios={scenarios}
      />
      <WorkedExample
        title={t("Tool_term_insurance_ExampleTitle")}
        subtitle={t("Tool_term_insurance_ExampleSubtitle")}
        steps={exampleSteps}
      />
    </ToolPageShell>
  );
}
