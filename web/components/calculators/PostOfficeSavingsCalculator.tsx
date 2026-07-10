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
  calculatePostOfficeSavings,
  POST_OFFICE_SAVINGS_DEFAULT_RATE,
  type PostOfficeSavingsCompounding,
} from "@/lib/finance/postOfficeSavings";
import { inr, percent } from "@/lib/finance/format";
import { getTool } from "@/lib/config/tools";
import { postOfficeSavingsInfo } from "@/lib/tool-page-content";

const COMPOUNDING: PostOfficeSavingsCompounding[] = ["annual", "quarterly", "monthly"];

export function PostOfficeSavingsCalculator() {
  const t = useT();
  const tool = getTool("post-office-savings")!;

  const [deposit, setDeposit] = useState(1_00_000);
  const [rate, setRate] = useState(POST_OFFICE_SAVINGS_DEFAULT_RATE);
  const [years, setYears] = useState(5);
  const [compounding, setCompounding] = useState<PostOfficeSavingsCompounding>("annual");

  const exampleSteps = useMemo(
    () => [
      t("Tool_post_office_savings_ExampleStep_1"),
      t("Tool_post_office_savings_ExampleStep_2"),
      t("Tool_post_office_savings_ExampleStep_3"),
      t("Tool_post_office_savings_ExampleStep_4"),
      t("Tool_post_office_savings_ExampleStep_5"),
    ],
    [t],
  );

  const { summaryCards, scenarios } = useMemo(() => {
    const result = calculatePostOfficeSavings({
      deposit,
      annualRatePercent: rate,
      years,
      compounding,
    });
    const annual = calculatePostOfficeSavings({
      deposit,
      annualRatePercent: rate,
      years,
      compounding: "annual",
    });
    const monthly = calculatePostOfficeSavings({
      deposit,
      annualRatePercent: rate,
      years,
      compounding: "monthly",
    });

    return {
      summaryCards: [
        {
          label: t("Tool_post_office_savings_Result_Maturity"),
          value: inr(result.maturityAmount),
          footnote: t("Tool_post_office_savings_Result_MaturityFootnote", years),
          variant: "primary" as const,
        },
        {
          label: t("Tool_post_office_savings_Result_Interest"),
          value: inr(result.totalInterest),
          footnote: t("Tool_post_office_savings_Result_InterestFootnote", percent(rate)),
          variant: "secure" as const,
        },
        {
          label: t("Tool_post_office_savings_Result_Deposit"),
          value: inr(result.deposit),
          footnote: t("Tool_post_office_savings_Result_DepositFootnote"),
        },
      ],
      scenarios: [
        {
          name: t("Tool_post_office_savings_Scenario_Annual"),
          primaryLabel: t("Tool_post_office_savings_Result_Maturity"),
          primaryValue: inr(annual.maturityAmount),
          secondaryLabel: t("Tool_post_office_savings_Result_Interest"),
          secondaryValue: inr(annual.totalInterest),
          variant: "worst" as const,
        },
        {
          name: t("Common_Scenario_Base"),
          primaryLabel: t("Tool_post_office_savings_Result_Maturity"),
          primaryValue: inr(result.maturityAmount),
          secondaryLabel: t("Tool_post_office_savings_Result_Interest"),
          secondaryValue: inr(result.totalInterest),
          variant: "base" as const,
        },
        {
          name: t("Tool_post_office_savings_Scenario_Monthly"),
          primaryLabel: t("Tool_post_office_savings_Result_Maturity"),
          primaryValue: inr(monthly.maturityAmount),
          secondaryLabel: t("Tool_post_office_savings_Result_Interest"),
          secondaryValue: inr(monthly.totalInterest),
          variant: "best" as const,
        },
      ],
    };
  }, [deposit, rate, years, compounding, t]);

  return (
    <ToolPageShell
      title={t(tool.titleKey)}
      subtitle={t("Tool_post_office_savings_Subtitle")}
      description={t(tool.descriptionKey)}
      icon={tool.icon}
      educate={
        <>
          <div className="fy-info-box">
            <strong>{t("Common_WhatYouLearn")}</strong>
            <p>{t("Tool_post_office_savings_LearnText")}</p>
          </div>
          <FormulaCard
            title={t("Common_Formula")}
            code={"A = P × (1 + r/n)^(n×t)\nInterest = A − P"}
            note={t("Tool_post_office_savings_FormulaNote")}
          />
        </>
      }
      below={<ToolInfoPanel info={postOfficeSavingsInfo(t)} />}
    >
      <div className="fy-form-card">
        <h3>{t("Common_YourInputs")}</h3>
        <div className="fy-field">
          <label>{t("Tool_post_office_savings_LabelDeposit")}</label>
          <input
            type="number"
            min={0}
            step={1000}
            inputMode="decimal"
            value={deposit}
            onChange={(e) => setDeposit(Math.max(0, Number(e.target.value) || 0))}
          />
        </div>
        <div className="fy-field">
          <label>{t("Tool_post_office_savings_LabelRate")}</label>
          <input
            type="number"
            min={0}
            max={15}
            step={0.1}
            inputMode="decimal"
            value={rate}
            onChange={(e) => setRate(Math.max(0, Number(e.target.value) || 0))}
          />
          <p className="fy-field-hint">{t("Tool_post_office_savings_RateHint")}</p>
        </div>
        <div className="fy-field">
          <label>{t("Tool_post_office_savings_LabelYears")}</label>
          <input
            type="number"
            min={0}
            max={50}
            step={0.5}
            inputMode="decimal"
            value={years}
            onChange={(e) => setYears(Math.max(0, Number(e.target.value) || 0))}
          />
        </div>
        <div className="fy-field">
          <label>{t("Tool_post_office_savings_LabelCompounding")}</label>
          <select
            value={compounding}
            onChange={(e) => setCompounding(e.target.value as PostOfficeSavingsCompounding)}
          >
            {COMPOUNDING.map((c) => (
              <option key={c} value={c}>
                {t(
                  `Tool_post_office_savings_Compounding_${c === "annual" ? "Annual" : c === "quarterly" ? "Quarterly" : "Monthly"}`,
                )}
              </option>
            ))}
          </select>
        </div>
        <button type="button" className="fy-btn-calc">
          {t("Common_Calculate")}
        </button>
      </div>

      <ResultSummaryCards cards={summaryCards} />
      <ScenarioCompare
        title={t("Tool_post_office_savings_ScenarioTitle")}
        subtitle={t("Tool_post_office_savings_ScenarioSubtitle")}
        scenarios={scenarios}
      />
      <WorkedExample
        title={t("Tool_post_office_savings_ExampleTitle")}
        subtitle={t("Tool_post_office_savings_ExampleSubtitle")}
        steps={exampleSteps}
      />
    </ToolPageShell>
  );
}
