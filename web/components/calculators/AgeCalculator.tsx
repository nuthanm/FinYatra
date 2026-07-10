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
import { calculateAge } from "@/lib/finance/age";
import { getTool } from "@/lib/config/tools";
import { ageInfo } from "@/lib/tool-page-content";

function todayIso(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function AgeCalculator() {
  const t = useT();
  const tool = getTool("age")!;

  const [fromDate, setFromDate] = useState("1995-06-15");
  const [toDate, setToDate] = useState(todayIso());

  const exampleSteps = useMemo(
    () => [
      t("Tool_age_ExampleStep_1"),
      t("Tool_age_ExampleStep_2"),
      t("Tool_age_ExampleStep_3"),
      t("Tool_age_ExampleStep_4"),
      t("Tool_age_ExampleStep_5"),
    ],
    [t],
  );

  const { summaryCards, scenarios } = useMemo(() => {
    const result = calculateAge({ fromDate, toDate });
    const plusOneYear = (() => {
      const d = new Date(toDate);
      d.setFullYear(d.getFullYear() + 1);
      const iso = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
      return calculateAge({ fromDate, toDate: iso });
    })();
    const plusFiveYears = (() => {
      const d = new Date(toDate);
      d.setFullYear(d.getFullYear() + 5);
      const iso = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
      return calculateAge({ fromDate, toDate: iso });
    })();

    const ageLabel = result.valid
      ? t("Tool_age_Result_AgeValue", String(result.years), String(result.months), String(result.days))
      : t("Tool_age_Result_Invalid");

    return {
      summaryCards: [
        {
          label: t("Tool_age_Result_Age"),
          value: ageLabel,
          footnote: t("Tool_age_Result_AgeFootnote"),
          variant: "primary" as const,
        },
        {
          label: t("Tool_age_Result_Years"),
          value: result.valid ? String(result.years) : "—",
          footnote: t("Tool_age_Result_YearsFootnote"),
        },
        {
          label: t("Tool_age_Result_TotalDays"),
          value: result.valid ? String(result.totalDays) : "—",
          footnote: t("Tool_age_Result_TotalDaysFootnote"),
          variant: "secure" as const,
        },
      ],
      scenarios: [
        {
          name: t("Tool_age_Scenario_Today"),
          primaryLabel: t("Tool_age_Result_Years"),
          primaryValue: result.valid ? String(result.years) : "—",
          secondaryLabel: t("Tool_age_Result_MonthsDays"),
          secondaryValue: result.valid
            ? t("Tool_age_Result_MonthsDaysValue", String(result.months), String(result.days))
            : "—",
          variant: "base" as const,
        },
        {
          name: t("Tool_age_Scenario_Plus1"),
          primaryLabel: t("Tool_age_Result_Years"),
          primaryValue: plusOneYear.valid ? String(plusOneYear.years) : "—",
          secondaryLabel: t("Tool_age_Result_MonthsDays"),
          secondaryValue: plusOneYear.valid
            ? t("Tool_age_Result_MonthsDaysValue", String(plusOneYear.months), String(plusOneYear.days))
            : "—",
          variant: "best" as const,
        },
        {
          name: t("Tool_age_Scenario_Plus5"),
          primaryLabel: t("Tool_age_Result_Years"),
          primaryValue: plusFiveYears.valid ? String(plusFiveYears.years) : "—",
          secondaryLabel: t("Tool_age_Result_MonthsDays"),
          secondaryValue: plusFiveYears.valid
            ? t(
                "Tool_age_Result_MonthsDaysValue",
                String(plusFiveYears.months),
                String(plusFiveYears.days),
              )
            : "—",
          variant: "worst" as const,
        },
      ],
    };
  }, [fromDate, toDate, t]);

  return (
    <ToolPageShell
      title={t(tool.titleKey)}
      subtitle={t("Tool_age_Subtitle")}
      description={t(tool.descriptionKey)}
      icon={tool.icon}
      educate={
        <>
          <div className="fy-info-box">
            <strong>{t("Common_WhatYouLearn")}</strong>
            <p>{t("Tool_age_LearnText")}</p>
          </div>
          <FormulaCard
            title={t("Common_Formula")}
            code={"age = calendar diff(from → to)\nyears, months, days (borrow months/days as needed)"}
            note={t("Tool_age_FormulaNote")}
          />
        </>
      }
      below={<ToolInfoPanel info={ageInfo(t)} />}
    >
      <div className="fy-form-card">
        <h3>{t("Common_YourInputs")}</h3>
        <div className="fy-field">
          <label>{t("Tool_age_LabelFrom")}</label>
          <input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} />
          <p className="fy-field-hint">{t("Tool_age_FromHint")}</p>
        </div>
        <div className="fy-field">
          <label>{t("Tool_age_LabelTo")}</label>
          <input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} />
          <p className="fy-field-hint">{t("Tool_age_ToHint")}</p>
        </div>
        <button type="button" className="fy-btn-calc">
          {t("Common_Calculate")}
        </button>
      </div>

      <ResultSummaryCards cards={summaryCards} />
      <ScenarioCompare
        title={t("Tool_age_ScenarioTitle")}
        subtitle={t("Tool_age_ScenarioSubtitle")}
        scenarios={scenarios}
      />
      <WorkedExample
        title={t("Tool_age_ExampleTitle")}
        subtitle={t("Tool_age_ExampleSubtitle")}
        steps={exampleSteps}
      />
    </ToolPageShell>
  );
}
