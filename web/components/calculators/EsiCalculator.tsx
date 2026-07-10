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
import { calculateEsi, ESI_EMPLOYEE_RATE, ESI_EMPLOYER_RATE, ESI_WAGE_CEILING } from "@/lib/finance/esi";
import { inr, percent } from "@/lib/finance/format";
import { getTool } from "@/lib/config/tools";
import { esiInfo } from "@/lib/tool-page-content";

export function EsiCalculator() {
  const t = useT();
  const tool = getTool("esi")!;

  const [monthlyWages, setMonthlyWages] = useState(18_000);

  const exampleSteps = useMemo(
    () => [
      t("Tool_esi_ExampleStep_1"),
      t("Tool_esi_ExampleStep_2"),
      t("Tool_esi_ExampleStep_3"),
      t("Tool_esi_ExampleStep_4"),
      t("Tool_esi_ExampleStep_5"),
    ],
    [t],
  );

  const { summaryCards, scenarios } = useMemo(() => {
    const result = calculateEsi({ monthlyWages });
    const lower = calculateEsi({ monthlyWages: Math.max(0, monthlyWages - 3_000) });
    const higher = calculateEsi({ monthlyWages: monthlyWages + 3_000 });

    return {
      summaryCards: [
        {
          label: t("Tool_esi_Result_Total"),
          value: inr(result.totalContribution),
          footnote: result.eligible
            ? t("Tool_esi_Result_Eligible")
            : t("Tool_esi_Result_NotEligible", inr(ESI_WAGE_CEILING)),
          variant: "primary" as const,
        },
        {
          label: t("Tool_esi_Result_Employee"),
          value: inr(result.employeeContribution),
          footnote: t("Tool_esi_Result_EmployeeFootnote", percent(ESI_EMPLOYEE_RATE, 2)),
        },
        {
          label: t("Tool_esi_Result_Employer"),
          value: inr(result.employerContribution),
          footnote: t("Tool_esi_Result_EmployerFootnote", percent(ESI_EMPLOYER_RATE, 2)),
        },
      ],
      scenarios: [
        {
          name: t("Tool_esi_Scenario_Lower"),
          primaryLabel: t("Tool_esi_Result_Total"),
          primaryValue: inr(lower.totalContribution),
          secondaryLabel: t("Tool_esi_Result_Employee"),
          secondaryValue: inr(lower.employeeContribution),
          variant: "best" as const,
        },
        {
          name: t("Common_Scenario_Base"),
          primaryLabel: t("Tool_esi_Result_Total"),
          primaryValue: inr(result.totalContribution),
          secondaryLabel: t("Tool_esi_Result_Employer"),
          secondaryValue: inr(result.employerContribution),
          variant: "base" as const,
        },
        {
          name: t("Tool_esi_Scenario_Higher"),
          primaryLabel: t("Tool_esi_Result_Total"),
          primaryValue: inr(higher.totalContribution),
          secondaryLabel: t("Tool_esi_Result_Employee"),
          secondaryValue: inr(higher.employeeContribution),
          variant: "worst" as const,
        },
      ],
    };
  }, [monthlyWages, t]);

  return (
    <ToolPageShell
      title={t(tool.titleKey)}
      subtitle={t("Tool_esi_Subtitle")}
      description={t(tool.descriptionKey)}
      icon={tool.icon}
      educate={
        <>
          <div className="fy-info-box">
            <strong>{t("Common_WhatYouLearn")}</strong>
            <p>{t("Tool_esi_LearnText")}</p>
          </div>
          <FormulaCard
            title={t("Common_Formula")}
            code={"Employee = wages × 0.75%\nEmployer = wages × 3.25%\nCeiling ≈ ₹21,000/month"}
            note={t("Tool_esi_FormulaNote")}
          />
        </>
      }
      below={<ToolInfoPanel info={esiInfo(t)} />}
    >
      <div className="fy-form-card">
        <h3>{t("Common_YourInputs")}</h3>
        <div className="fy-field">
          <label>{t("Tool_esi_LabelWages")}</label>
          <input
            type="number"
            min={0}
            step={500}
            inputMode="decimal"
            value={monthlyWages}
            onChange={(e) => setMonthlyWages(Math.max(0, Number(e.target.value) || 0))}
          />
          <p className="fy-field-hint">{t("Tool_esi_WagesHint", inr(ESI_WAGE_CEILING))}</p>
        </div>
        <button type="button" className="fy-btn-calc">
          {t("Common_Calculate")}
        </button>
      </div>

      <ResultSummaryCards cards={summaryCards} />
      <ScenarioCompare
        title={t("Tool_esi_ScenarioTitle")}
        subtitle={t("Tool_esi_ScenarioSubtitle")}
        scenarios={scenarios}
      />
      <WorkedExample
        title={t("Tool_esi_ExampleTitle")}
        subtitle={t("Tool_esi_ExampleSubtitle")}
        steps={exampleSteps}
      />
    </ToolPageShell>
  );
}
