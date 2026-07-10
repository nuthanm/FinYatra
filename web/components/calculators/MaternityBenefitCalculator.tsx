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
  calculateMaternityBenefit,
  MATERNITY_DEFAULT_LEAVE_DAYS,
} from "@/lib/finance/maternityBenefit";
import { inr } from "@/lib/finance/format";
import { getTool } from "@/lib/config/tools";
import { maternityBenefitInfo } from "@/lib/tool-page-content";

export function MaternityBenefitCalculator() {
  const t = useT();
  const tool = getTool("maternity-benefit")!;

  const [averageDailyWage, setAverageDailyWage] = useState(1_500);
  const [leaveDays, setLeaveDays] = useState(MATERNITY_DEFAULT_LEAVE_DAYS);

  const exampleSteps = useMemo(
    () => [
      t("Tool_maternity_benefit_ExampleStep_1"),
      t("Tool_maternity_benefit_ExampleStep_2"),
      t("Tool_maternity_benefit_ExampleStep_3"),
      t("Tool_maternity_benefit_ExampleStep_4"),
      t("Tool_maternity_benefit_ExampleStep_5"),
    ],
    [t],
  );

  const { summaryCards, scenarios } = useMemo(() => {
    const result = calculateMaternityBenefit({ averageDailyWage, leaveDays });
    const weeks12 = calculateMaternityBenefit({ averageDailyWage, leaveDays: 84 });
    const weeks26 = calculateMaternityBenefit({
      averageDailyWage,
      leaveDays: MATERNITY_DEFAULT_LEAVE_DAYS,
    });

    return {
      summaryCards: [
        {
          label: t("Tool_maternity_benefit_Result_Benefit"),
          value: inr(result.benefitAmount),
          footnote: t(
            "Tool_maternity_benefit_Result_BenefitFootnote",
            leaveDays,
            inr(averageDailyWage),
          ),
          variant: "primary" as const,
        },
        {
          label: t("Tool_maternity_benefit_Result_Weeks"),
          value: result.leaveWeeks.toFixed(1),
          footnote: t("Tool_maternity_benefit_Result_WeeksFootnote"),
          variant: "secure" as const,
        },
        {
          label: t("Tool_maternity_benefit_Result_Monthly"),
          value: inr(result.monthlyEquivalent),
          footnote: t("Tool_maternity_benefit_Result_MonthlyFootnote"),
        },
      ],
      scenarios: [
        {
          name: t("Tool_maternity_benefit_Scenario_12"),
          primaryLabel: t("Tool_maternity_benefit_Result_Benefit"),
          primaryValue: inr(weeks12.benefitAmount),
          secondaryLabel: t("Tool_maternity_benefit_LabelDays"),
          secondaryValue: "84",
          variant: "worst",
        },
        {
          name: t("Common_Scenario_Base"),
          primaryLabel: t("Tool_maternity_benefit_Result_Benefit"),
          primaryValue: inr(result.benefitAmount),
          secondaryLabel: t("Tool_maternity_benefit_LabelDays"),
          secondaryValue: String(leaveDays),
          variant: "base",
        },
        {
          name: t("Tool_maternity_benefit_Scenario_26"),
          primaryLabel: t("Tool_maternity_benefit_Result_Benefit"),
          primaryValue: inr(weeks26.benefitAmount),
          secondaryLabel: t("Tool_maternity_benefit_LabelDays"),
          secondaryValue: String(MATERNITY_DEFAULT_LEAVE_DAYS),
          variant: "best",
        },
      ],
    };
  }, [averageDailyWage, leaveDays, t]);

  return (
    <ToolPageShell
      title={t(tool.titleKey)}
      subtitle={t("Tool_maternity_benefit_Subtitle")}
      description={t(tool.descriptionKey)}
      icon={tool.icon}
      educate={
        <>
          <div className="fy-info-box">
            <strong>{t("Common_WhatYouLearn")}</strong>
            <p>{t("Tool_maternity_benefit_LearnText")}</p>
          </div>
          <FormulaCard
            title={t("Common_Formula")}
            code={"Benefit = average daily wage × leave days\nDefault leave = 26 weeks (182 days)"}
            note={t("Tool_maternity_benefit_FormulaNote")}
          />
        </>
      }
      below={<ToolInfoPanel info={maternityBenefitInfo(t)} />}
    >
      <div className="fy-form-card">
        <h3>{t("Common_YourInputs")}</h3>
        <div className="fy-field">
          <label>{t("Tool_maternity_benefit_LabelWage")}</label>
          <input
            type="number"
            min={0}
            step={50}
            inputMode="decimal"
            value={averageDailyWage}
            onChange={(e) => setAverageDailyWage(Math.max(0, Number(e.target.value) || 0))}
          />
          <p className="fy-field-hint">{t("Tool_maternity_benefit_WageHint")}</p>
        </div>
        <div className="fy-field">
          <label>{t("Tool_maternity_benefit_LabelDays")}</label>
          <input
            type="number"
            min={0}
            step={1}
            inputMode="numeric"
            value={leaveDays}
            onChange={(e) => setLeaveDays(Math.max(0, Number(e.target.value) || 0))}
          />
          <p className="fy-field-hint">{t("Tool_maternity_benefit_DaysHint")}</p>
        </div>
        <button type="button" className="fy-btn-calc">
          {t("Common_Calculate")}
        </button>
      </div>

      <ResultSummaryCards cards={summaryCards} />
      <ScenarioCompare
        title={t("Tool_maternity_benefit_ScenarioTitle")}
        subtitle={t("Tool_maternity_benefit_ScenarioSubtitle")}
        scenarios={scenarios}
      />
      <WorkedExample
        title={t("Tool_maternity_benefit_ExampleTitle")}
        subtitle={t("Tool_maternity_benefit_ExampleSubtitle")}
        steps={exampleSteps}
      />
    </ToolPageShell>
  );
}
