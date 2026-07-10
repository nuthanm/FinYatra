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
import { calculateSeniorCitizenFd } from "@/lib/finance/seniorCitizenFd";
import { inr, percent } from "@/lib/finance/format";
import { getTool } from "@/lib/config/tools";
import { seniorCitizenFdInfo } from "@/lib/tool-page-content";

export function SeniorCitizenFdCalculator() {
  const t = useT();
  const tool = getTool("senior-citizen-fd")!;

  const [principal, setPrincipal] = useState(500_000);
  const [rate, setRate] = useState(7.75);
  const [years, setYears] = useState(3);
  const [senior, setSenior] = useState(true);

  const exampleSteps = useMemo(
    () => [
      t("Tool_senior_citizen_fd_ExampleStep_1"),
      t("Tool_senior_citizen_fd_ExampleStep_2"),
      t("Tool_senior_citizen_fd_ExampleStep_3"),
      t("Tool_senior_citizen_fd_ExampleStep_4"),
      t("Tool_senior_citizen_fd_ExampleStep_5"),
    ],
    [t],
  );

  const { summaryCards, scenarios, result } = useMemo(() => {
    const result = calculateSeniorCitizenFd({
      principal,
      annualRatePercent: rate,
      years,
      seniorCitizen: senior,
      includeTds: true,
    });
    const lower = calculateSeniorCitizenFd({
      principal,
      annualRatePercent: rate - 0.5,
      years,
      seniorCitizen: senior,
      includeTds: true,
    });
    const higher = calculateSeniorCitizenFd({
      principal,
      annualRatePercent: rate + 0.5,
      years,
      seniorCitizen: senior,
      includeTds: true,
    });

    return {
      result,
      summaryCards: [
        {
          label: t("Tool_senior_citizen_fd_Result_Maturity"),
          value: inr(result.netMaturity),
          footnote: t("Common_Footnote_RatePa", percent(rate)),
          variant: "primary" as const,
        },
        {
          label: t("Tool_senior_citizen_fd_Result_Interest"),
          value: inr(result.netInterest),
          footnote:
            result.tds > 0
              ? t("Tool_senior_citizen_fd_Result_TdsFootnote", inr(result.tds))
              : t("Tool_senior_citizen_fd_Result_InterestFootnote"),
          variant: "secure" as const,
        },
        {
          label: t("Tool_senior_citizen_fd_Result_VsRegular"),
          value: inr(result.netMaturity - result.regularMaturity),
          footnote: t(
            "Tool_senior_citizen_fd_Result_VsRegularFootnote",
            percent(result.regularRatePercent),
          ),
        },
      ],
      scenarios: [
        {
          name: t("Tool_senior_citizen_fd_Scenario_Lower"),
          primaryLabel: t("Tool_senior_citizen_fd_Result_Maturity"),
          primaryValue: inr(lower.netMaturity),
          secondaryLabel: t("Common_Label_Return"),
          secondaryValue: percent(rate - 0.5),
          variant: "worst",
        },
        {
          name: t("Common_Scenario_Base"),
          primaryLabel: t("Tool_senior_citizen_fd_Result_Maturity"),
          primaryValue: inr(result.netMaturity),
          secondaryLabel: t("Common_Label_Return"),
          secondaryValue: percent(rate),
          variant: "base",
        },
        {
          name: t("Tool_senior_citizen_fd_Scenario_Higher"),
          primaryLabel: t("Tool_senior_citizen_fd_Result_Maturity"),
          primaryValue: inr(higher.netMaturity),
          secondaryLabel: t("Common_Label_Return"),
          secondaryValue: percent(rate + 0.5),
          variant: "best",
        },
      ],
    };
  }, [principal, rate, years, senior, t]);

  return (
    <ToolPageShell
      title={t(tool.titleKey)}
      subtitle={t("Tool_senior_citizen_fd_Subtitle")}
      description={t(tool.descriptionKey)}
      icon={tool.icon}
      educate={
        <>
          <div className="fy-info-box">
            <strong>{t("Common_WhatYouLearn")}</strong>
            <p>{t("Tool_senior_citizen_fd_LearnText")}</p>
          </div>
          <FormulaCard
            title={t("Common_Formula")}
            code={"M = P × (1 + r/n)^(n×t)\nTDS if interest > ₹50k (senior)"}
            note={t("Tool_senior_citizen_fd_FormulaNote")}
          />
        </>
      }
      below={<ToolInfoPanel info={seniorCitizenFdInfo(t)} />}
    >
      <div className="fy-form-card">
        <h3>{t("Common_YourInputs")}</h3>
        <div className="fy-field">
          <label>{t("Tool_senior_citizen_fd_LabelPrincipal")}</label>
          <input
            type="number"
            min={0}
            step={10000}
            inputMode="decimal"
            value={principal}
            onChange={(e) => setPrincipal(Math.max(0, Number(e.target.value) || 0))}
          />
        </div>
        <div className="fy-field">
          <label>{t("Tool_senior_citizen_fd_LabelRate")}</label>
          <input
            type="number"
            min={0}
            max={15}
            step={0.05}
            inputMode="decimal"
            value={rate}
            onChange={(e) => setRate(Math.max(0, Number(e.target.value) || 0))}
          />
          <p className="fy-field-hint">{t("Tool_senior_citizen_fd_RateHint")}</p>
        </div>
        <div className="fy-field">
          <label>{t("Tool_senior_citizen_fd_LabelYears")}</label>
          <input
            type="number"
            min={0.25}
            max={10}
            step={0.25}
            inputMode="decimal"
            value={years}
            onChange={(e) => setYears(Math.max(0.25, Number(e.target.value) || 0.25))}
          />
        </div>
        <div className="fy-field">
          <label>{t("Tool_senior_citizen_fd_LabelSenior")}</label>
          <select
            value={senior ? "yes" : "no"}
            onChange={(e) => setSenior(e.target.value === "yes")}
          >
            <option value="yes">{t("Tool_senior_citizen_fd_SeniorYes")}</option>
            <option value="no">{t("Tool_senior_citizen_fd_SeniorNo")}</option>
          </select>
          <p className="fy-field-hint">{t("Tool_senior_citizen_fd_SeniorHint")}</p>
        </div>
        <button type="button" className="fy-btn-calc">
          {t("Common_Calculate")}
        </button>
      </div>

      <div className="fy-info-box fy-tax-verdict">
        <strong>{t("Tool_senior_citizen_fd_VerdictTitle")}</strong>
        <p>
          {result.tds > 0
            ? t(
                "Tool_senior_citizen_fd_VerdictTds",
                inr(result.netMaturity),
                inr(result.tds),
              )
            : t("Tool_senior_citizen_fd_VerdictOk", inr(result.netMaturity))}
        </p>
      </div>

      <ResultSummaryCards cards={summaryCards} />
      <ScenarioCompare
        title={t("Tool_senior_citizen_fd_ScenarioTitle")}
        subtitle={t("Tool_senior_citizen_fd_ScenarioSubtitle")}
        scenarios={scenarios}
      />
      <WorkedExample
        title={t("Tool_senior_citizen_fd_ExampleTitle")}
        subtitle={t("Tool_senior_citizen_fd_ExampleSubtitle")}
        steps={exampleSteps}
      />
    </ToolPageShell>
  );
}
