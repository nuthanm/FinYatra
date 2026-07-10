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
  calculateEpfoPassbook,
  EPFO_PASSBOOK_DEFAULT_RATE,
} from "@/lib/finance/epfoPassbook";
import { inr, percent } from "@/lib/finance/format";
import { getTool } from "@/lib/config/tools";
import { epfoPassbookInfo } from "@/lib/tool-page-content";

export function EpfoPassbookCalculator() {
  const t = useT();
  const tool = getTool("epfo-passbook")!;

  const [opening, setOpening] = useState(2_00_000);
  const [monthly, setMonthly] = useState(5_000);
  const [months, setMonths] = useState(12);
  const [rate, setRate] = useState(EPFO_PASSBOOK_DEFAULT_RATE);

  const exampleSteps = useMemo(
    () => [
      t("Tool_epfo_passbook_ExampleStep_1"),
      t("Tool_epfo_passbook_ExampleStep_2"),
      t("Tool_epfo_passbook_ExampleStep_3"),
      t("Tool_epfo_passbook_ExampleStep_4"),
      t("Tool_epfo_passbook_ExampleStep_5"),
    ],
    [t],
  );

  const { summaryCards, scenarios } = useMemo(() => {
    const result = calculateEpfoPassbook({
      openingBalance: opening,
      monthlyContribution: monthly,
      months,
      annualRatePercent: rate,
    });
    const fewer = calculateEpfoPassbook({
      openingBalance: opening,
      monthlyContribution: monthly,
      months: Math.max(1, months - 6),
      annualRatePercent: rate,
    });
    const more = calculateEpfoPassbook({
      openingBalance: opening,
      monthlyContribution: monthly,
      months: months + 12,
      annualRatePercent: rate,
    });

    return {
      summaryCards: [
        {
          label: t("Tool_epfo_passbook_Result_Closing"),
          value: inr(result.closingBalance),
          footnote: t("Tool_epfo_passbook_Result_ClosingFootnote", months),
          variant: "primary" as const,
        },
        {
          label: t("Tool_epfo_passbook_Result_Contributions"),
          value: inr(result.totalContributions),
          footnote: t("Tool_epfo_passbook_Result_ContributionsFootnote", inr(monthly)),
        },
        {
          label: t("Tool_epfo_passbook_Result_Interest"),
          value: inr(result.totalInterest),
          footnote: t("Tool_epfo_passbook_Result_InterestFootnote", percent(rate)),
          variant: "secure" as const,
        },
      ],
      scenarios: [
        {
          name: t("Tool_epfo_passbook_Scenario_Fewer"),
          primaryLabel: t("Tool_epfo_passbook_Result_Closing"),
          primaryValue: inr(fewer.closingBalance),
          secondaryLabel: t("Tool_epfo_passbook_Result_Interest"),
          secondaryValue: inr(fewer.totalInterest),
          variant: "worst" as const,
        },
        {
          name: t("Common_Scenario_Base"),
          primaryLabel: t("Tool_epfo_passbook_Result_Closing"),
          primaryValue: inr(result.closingBalance),
          secondaryLabel: t("Tool_epfo_passbook_Result_Interest"),
          secondaryValue: inr(result.totalInterest),
          variant: "base" as const,
        },
        {
          name: t("Tool_epfo_passbook_Scenario_More"),
          primaryLabel: t("Tool_epfo_passbook_Result_Closing"),
          primaryValue: inr(more.closingBalance),
          secondaryLabel: t("Tool_epfo_passbook_Result_Interest"),
          secondaryValue: inr(more.totalInterest),
          variant: "best" as const,
        },
      ],
    };
  }, [opening, monthly, months, rate, t]);

  return (
    <ToolPageShell
      title={t(tool.titleKey)}
      subtitle={t("Tool_epfo_passbook_Subtitle")}
      description={t(tool.descriptionKey)}
      icon={tool.icon}
      educate={
        <>
          <div className="fy-info-box">
            <strong>{t("Common_WhatYouLearn")}</strong>
            <p>{t("Tool_epfo_passbook_LearnText")}</p>
          </div>
          <FormulaCard
            title={t("Common_Formula")}
            code={"each month: balance += contribution\ninterest = balance × rate/12\nclosing = opening + contrib + interest"}
            note={t("Tool_epfo_passbook_FormulaNote")}
          />
        </>
      }
      below={<ToolInfoPanel info={epfoPassbookInfo(t)} />}
    >
      <div className="fy-form-card">
        <h3>{t("Common_YourInputs")}</h3>
        <div className="fy-field">
          <label>{t("Tool_epfo_passbook_LabelOpening")}</label>
          <input
            type="number"
            min={0}
            step={1000}
            inputMode="decimal"
            value={opening}
            onChange={(e) => setOpening(Math.max(0, Number(e.target.value) || 0))}
          />
        </div>
        <div className="fy-field">
          <label>{t("Tool_epfo_passbook_LabelMonthly")}</label>
          <input
            type="number"
            min={0}
            step={100}
            inputMode="decimal"
            value={monthly}
            onChange={(e) => setMonthly(Math.max(0, Number(e.target.value) || 0))}
          />
          <p className="fy-field-hint">{t("Tool_epfo_passbook_MonthlyHint")}</p>
        </div>
        <div className="fy-field">
          <label>{t("Tool_epfo_passbook_LabelMonths")}</label>
          <input
            type="number"
            min={0}
            max={480}
            step={1}
            inputMode="decimal"
            value={months}
            onChange={(e) => setMonths(Math.max(0, Math.floor(Number(e.target.value) || 0)))}
          />
        </div>
        <div className="fy-field">
          <label>{t("Tool_epfo_passbook_LabelRate")}</label>
          <input
            type="number"
            min={0}
            max={15}
            step={0.05}
            inputMode="decimal"
            value={rate}
            onChange={(e) => setRate(Math.max(0, Number(e.target.value) || 0))}
          />
        </div>
        <button type="button" className="fy-btn-calc">
          {t("Common_Calculate")}
        </button>
      </div>

      <ResultSummaryCards cards={summaryCards} />
      <ScenarioCompare
        title={t("Tool_epfo_passbook_ScenarioTitle")}
        subtitle={t("Tool_epfo_passbook_ScenarioSubtitle")}
        scenarios={scenarios}
      />
      <WorkedExample
        title={t("Tool_epfo_passbook_ExampleTitle")}
        subtitle={t("Tool_epfo_passbook_ExampleSubtitle")}
        steps={exampleSteps}
      />
    </ToolPageShell>
  );
}
