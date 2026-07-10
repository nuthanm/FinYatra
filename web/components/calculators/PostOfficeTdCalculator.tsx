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
  calculatePostOfficeTd,
  POST_OFFICE_TD_RATES,
  POST_OFFICE_TD_TENURES,
  type PostOfficeTdTenure,
} from "@/lib/finance/postOfficeTd";
import { inr, percent } from "@/lib/finance/format";
import { getTool } from "@/lib/config/tools";
import { postOfficeTdInfo } from "@/lib/tool-page-content";

export function PostOfficeTdCalculator() {
  const t = useT();
  const tool = getTool("post-office-td")!;

  const [deposit, setDeposit] = useState(100_000);
  const [tenureYears, setTenureYears] = useState<PostOfficeTdTenure>(5);

  const exampleSteps = useMemo(
    () => [
      t("Tool_post_office_td_ExampleStep_1"),
      t("Tool_post_office_td_ExampleStep_2"),
      t("Tool_post_office_td_ExampleStep_3"),
      t("Tool_post_office_td_ExampleStep_4"),
      t("Tool_post_office_td_ExampleStep_5"),
    ],
    [t],
  );

  const { summaryCards, scenarios } = useMemo(() => {
    const result = calculatePostOfficeTd({ deposit, tenureYears });
    const y1 = calculatePostOfficeTd({ deposit, tenureYears: 1 });
    const y3 = calculatePostOfficeTd({ deposit, tenureYears: 3 });
    const y5 = calculatePostOfficeTd({ deposit, tenureYears: 5 });

    return {
      summaryCards: [
        {
          label: t("Tool_post_office_td_Result_Maturity"),
          value: inr(result.maturityAmount),
          footnote: t(
            "Tool_post_office_td_Result_MaturityFootnote",
            tenureYears,
            percent(result.annualRatePercent),
          ),
          variant: "primary" as const,
        },
        {
          label: t("Tool_post_office_td_Result_Interest"),
          value: inr(result.totalInterest),
          footnote: t("Tool_post_office_td_Result_InterestFootnote"),
          variant: "secure" as const,
        },
        {
          label: t("Tool_post_office_td_Result_Yield"),
          value: percent(result.effectiveYieldPercent),
          footnote: t("Tool_post_office_td_Result_YieldFootnote"),
        },
      ],
      scenarios: [
        {
          name: t("Tool_post_office_td_Scenario_1", percent(POST_OFFICE_TD_RATES[1])),
          primaryLabel: t("Tool_post_office_td_Result_Maturity"),
          primaryValue: inr(y1.maturityAmount),
          secondaryLabel: t("Tool_post_office_td_Result_Interest"),
          secondaryValue: inr(y1.totalInterest),
          variant: "worst",
        },
        {
          name: t("Tool_post_office_td_Scenario_3", percent(POST_OFFICE_TD_RATES[3])),
          primaryLabel: t("Tool_post_office_td_Result_Maturity"),
          primaryValue: inr(y3.maturityAmount),
          secondaryLabel: t("Tool_post_office_td_Result_Interest"),
          secondaryValue: inr(y3.totalInterest),
          variant: "base",
        },
        {
          name: t("Tool_post_office_td_Scenario_5", percent(POST_OFFICE_TD_RATES[5])),
          primaryLabel: t("Tool_post_office_td_Result_Maturity"),
          primaryValue: inr(y5.maturityAmount),
          secondaryLabel: t("Tool_post_office_td_Result_Interest"),
          secondaryValue: inr(y5.totalInterest),
          variant: "best",
        },
      ],
    };
  }, [deposit, tenureYears, t]);

  return (
    <ToolPageShell
      title={t(tool.titleKey)}
      subtitle={t("Tool_post_office_td_Subtitle")}
      description={t(tool.descriptionKey)}
      icon={tool.icon}
      educate={
        <>
          <div className="fy-info-box">
            <strong>{t("Common_WhatYouLearn")}</strong>
            <p>{t("Tool_post_office_td_LearnText")}</p>
          </div>
          <FormulaCard
            title={t("Common_Formula")}
            code={"A = P × (1 + r/4)^(4×t)\nRates (illustrative): 1y 6.9%, 2y 7%, 3y 7.1%, 5y 7.5%"}
            note={t("Tool_post_office_td_FormulaNote")}
          />
        </>
      }
      below={<ToolInfoPanel info={postOfficeTdInfo(t)} />}
    >
      <div className="fy-form-card">
        <h3>{t("Common_YourInputs")}</h3>
        <div className="fy-field">
          <label>{t("Tool_post_office_td_LabelDeposit")}</label>
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
          <label>{t("Tool_post_office_td_LabelTenure")}</label>
          <select
            value={tenureYears}
            onChange={(e) => setTenureYears(Number(e.target.value) as PostOfficeTdTenure)}
          >
            {POST_OFFICE_TD_TENURES.map((y) => (
              <option key={y} value={y}>
                {t("Tool_post_office_td_TenureOption", y, percent(POST_OFFICE_TD_RATES[y]))}
              </option>
            ))}
          </select>
          <p className="fy-field-hint">{t("Tool_post_office_td_TenureHint")}</p>
        </div>
        <button type="button" className="fy-btn-calc">
          {t("Common_Calculate")}
        </button>
      </div>

      <ResultSummaryCards cards={summaryCards} />
      <ScenarioCompare
        title={t("Tool_post_office_td_ScenarioTitle")}
        subtitle={t("Tool_post_office_td_ScenarioSubtitle")}
        scenarios={scenarios}
      />
      <WorkedExample
        title={t("Tool_post_office_td_ExampleTitle")}
        subtitle={t("Tool_post_office_td_ExampleSubtitle")}
        steps={exampleSteps}
      />
    </ToolPageShell>
  );
}
