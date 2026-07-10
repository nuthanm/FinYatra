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
  calculatePostOfficeMis,
  MIS_DEFAULT_RATE,
  MIS_TENURE_YEARS,
  misMaxDeposit,
  type MisAccountType,
} from "@/lib/finance/postOfficeMis";
import { inr, percent } from "@/lib/finance/format";
import { getTool } from "@/lib/config/tools";
import { postOfficeMisInfo } from "@/lib/tool-page-content";

export function PostOfficeMisCalculator() {
  const t = useT();
  const tool = getTool("post-office-mis")!;

  const [accountType, setAccountType] = useState<MisAccountType>("single");
  const [deposit, setDeposit] = useState(500_000);
  const [rate, setRate] = useState(MIS_DEFAULT_RATE);
  const [years, setYears] = useState(MIS_TENURE_YEARS);

  const maxDeposit = misMaxDeposit(accountType);

  const exampleSteps = useMemo(
    () => [
      t("Tool_post_office_mis_ExampleStep_1"),
      t("Tool_post_office_mis_ExampleStep_2"),
      t("Tool_post_office_mis_ExampleStep_3"),
      t("Tool_post_office_mis_ExampleStep_4"),
      t("Tool_post_office_mis_ExampleStep_5"),
    ],
    [t],
  );

  const { summaryCards, scenarios } = useMemo(() => {
    const result = calculatePostOfficeMis(deposit, rate, years, accountType);
    const low = calculatePostOfficeMis(deposit, 6.6, years, accountType);
    const high = calculatePostOfficeMis(deposit, 7.7, years, accountType);

    return {
      summaryCards: [
        {
          label: t("Tool_post_office_mis_Result_Monthly"),
          value: inr(result.monthlyInterest),
          footnote: t("Tool_post_office_mis_Result_MonthlyFootnote"),
          variant: "primary" as const,
        },
        {
          label: t("Tool_post_office_mis_Result_Annual"),
          value: inr(result.annualInterest),
          footnote: t("Common_Footnote_RatePa", percent(rate)),
          variant: "secure" as const,
        },
        {
          label: t("Tool_post_office_mis_Result_TotalInterest"),
          value: inr(result.totalInterest),
          footnote: t("Tool_post_office_mis_Result_TotalFootnote", years, inr(result.maturityAmount)),
        },
      ],
      scenarios: [
        {
          name: t("Tool_post_office_mis_Scenario_Low"),
          primaryLabel: t("Tool_post_office_mis_Result_Monthly"),
          primaryValue: inr(low.monthlyInterest),
          secondaryLabel: t("Common_Label_Return"),
          secondaryValue: "6.6%",
          variant: "worst",
        },
        {
          name: t("Common_Scenario_Base"),
          primaryLabel: t("Tool_post_office_mis_Result_Monthly"),
          primaryValue: inr(result.monthlyInterest),
          secondaryLabel: t("Common_Label_Return"),
          secondaryValue: percent(rate),
          variant: "base",
        },
        {
          name: t("Tool_post_office_mis_Scenario_High"),
          primaryLabel: t("Tool_post_office_mis_Result_Monthly"),
          primaryValue: inr(high.monthlyInterest),
          secondaryLabel: t("Common_Label_Return"),
          secondaryValue: "7.7%",
          variant: "best",
        },
      ],
    };
  }, [deposit, rate, years, accountType, t]);

  return (
    <ToolPageShell
      title={t(tool.titleKey)}
      subtitle={t("Tool_post_office_mis_Subtitle")}
      description={t(tool.descriptionKey)}
      icon={tool.icon}
      educate={
        <>
          <div className="fy-info-box">
            <strong>{t("Common_WhatYouLearn")}</strong>
            <p>{t("Tool_post_office_mis_LearnText")}</p>
          </div>
          <FormulaCard
            title={t("Common_Formula")}
            code={"Monthly interest = Deposit × rate / 12\nPrincipal returned at maturity"}
            note={t("Tool_post_office_mis_FormulaNote")}
          />
        </>
      }
      below={<ToolInfoPanel info={postOfficeMisInfo(t)} />}
    >
      <div className="fy-form-card">
        <h3>{t("Common_YourInputs")}</h3>
        <div className="fy-field">
          <label>{t("Tool_post_office_mis_LabelAccount")}</label>
          <select
            value={accountType}
            onChange={(e) => {
              const next = e.target.value as MisAccountType;
              setAccountType(next);
              const cap = misMaxDeposit(next);
              setDeposit((d) => Math.min(d, cap));
            }}
          >
            <option value="single">{t("Tool_post_office_mis_Account_Single")}</option>
            <option value="joint">{t("Tool_post_office_mis_Account_Joint")}</option>
          </select>
        </div>
        <div className="fy-field">
          <label>{t("Tool_post_office_mis_LabelDeposit")}</label>
          <input
            type="number"
            min={1000}
            max={maxDeposit}
            step={10000}
            inputMode="decimal"
            value={deposit}
            onChange={(e) => setDeposit(Math.max(0, Number(e.target.value) || 0))}
          />
          <p className="fy-field-hint">{t("Tool_post_office_mis_MaxHint", inr(maxDeposit))}</p>
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
            min={1}
            max={5}
            step={1}
            inputMode="numeric"
            value={years}
            onChange={(e) => setYears(Math.max(1, Math.min(5, Number(e.target.value) || 5)))}
          />
          <p className="fy-field-hint">{t("Tool_post_office_mis_TenureHint")}</p>
        </div>
        <button type="button" className="fy-btn-calc">
          {t("Common_Calculate")}
        </button>
      </div>

      <ResultSummaryCards cards={summaryCards} />
      <ScenarioCompare
        title={t("Tool_post_office_mis_ScenarioTitle")}
        subtitle={t("Tool_post_office_mis_ScenarioSubtitle")}
        scenarios={scenarios}
      />
      <WorkedExample
        title={t("Tool_post_office_mis_ExampleTitle")}
        subtitle={t("Tool_post_office_mis_ExampleSubtitle")}
        steps={exampleSteps}
      />
    </ToolPageShell>
  );
}
