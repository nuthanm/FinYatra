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
import { calculateEmployeeCompensation } from "@/lib/finance/employeeCompensation";
import { inr } from "@/lib/finance/format";
import { getTool } from "@/lib/config/tools";
import { employeeCompensationInfo } from "@/lib/tool-page-content";

export function EmployeeCompensationCalculator() {
  const t = useT();
  const tool = getTool("employee-compensation")!;

  const [ctc, setCtc] = useState(12_00_000);
  const [basicPercent, setBasicPercent] = useState(40);
  const [pfOnActual, setPfOnActual] = useState(true);
  const [includeEsi, setIncludeEsi] = useState(false);
  const [deductions, setDeductions] = useState(1_20_000);

  const exampleSteps = useMemo(
    () => [
      t("Tool_employee_compensation_ExampleStep_1"),
      t("Tool_employee_compensation_ExampleStep_2"),
      t("Tool_employee_compensation_ExampleStep_3"),
      t("Tool_employee_compensation_ExampleStep_4"),
      t("Tool_employee_compensation_ExampleStep_5"),
    ],
    [t],
  );

  const { summaryCards, scenarios } = useMemo(() => {
    const result = calculateEmployeeCompensation({
      ctcAnnual: ctc,
      basicPercent,
      pfOnActual,
      includeEsi,
      annualDeductions: deductions,
    });
    const ceiling = calculateEmployeeCompensation({
      ctcAnnual: ctc,
      basicPercent,
      pfOnActual: false,
      includeEsi,
      annualDeductions: deductions,
    });
    const withEsi = calculateEmployeeCompensation({
      ctcAnnual: Math.min(ctc, 2_50_000),
      basicPercent,
      pfOnActual,
      includeEsi: true,
      annualDeductions: Math.min(deductions, 30_000),
    });

    return {
      summaryCards: [
        {
          label: t("Tool_employee_compensation_Result_Employer"),
          value: inr(result.employerTotalCost),
          footnote: t(
            "Tool_employee_compensation_Result_EmployerFootnote",
            inr(result.employerExtraAnnual),
          ),
          variant: "primary" as const,
        },
        {
          label: t("Tool_employee_compensation_Result_InHand"),
          value: inr(result.inHandMonthly),
          footnote: t(
            "Tool_employee_compensation_Result_InHandFootnote",
            inr(result.inHandAnnual),
          ),
          variant: "secure" as const,
        },
        {
          label: t("Tool_employee_compensation_Result_Gross"),
          value: inr(result.grossAnnual),
          footnote: t("Tool_employee_compensation_Result_GrossFootnote"),
        },
      ],
      scenarios: [
        {
          name: t("Tool_employee_compensation_Scenario_Ceiling"),
          primaryLabel: t("Tool_employee_compensation_Result_InHand"),
          primaryValue: inr(ceiling.inHandMonthly),
          secondaryLabel: t("Tool_employee_compensation_Result_Employer"),
          secondaryValue: inr(ceiling.employerTotalCost),
          variant: "best" as const,
        },
        {
          name: t("Common_Scenario_Base"),
          primaryLabel: t("Tool_employee_compensation_Result_InHand"),
          primaryValue: inr(result.inHandMonthly),
          secondaryLabel: t("Tool_employee_compensation_Result_Employer"),
          secondaryValue: inr(result.employerTotalCost),
          variant: "base" as const,
        },
        {
          name: t("Tool_employee_compensation_Scenario_Esi"),
          primaryLabel: t("Tool_employee_compensation_Result_Employer"),
          primaryValue: inr(withEsi.employerTotalCost),
          secondaryLabel: t("Tool_employee_compensation_Result_InHand"),
          secondaryValue: inr(withEsi.inHandMonthly),
          variant: "worst" as const,
        },
      ],
    };
  }, [ctc, basicPercent, pfOnActual, includeEsi, deductions, t]);

  return (
    <ToolPageShell
      title={t(tool.titleKey)}
      subtitle={t("Tool_employee_compensation_Subtitle")}
      description={t(tool.descriptionKey)}
      icon={tool.icon}
      educate={
        <>
          <div className="fy-info-box">
            <strong>{t("Common_WhatYouLearn")}</strong>
            <p>{t("Tool_employee_compensation_LearnText")}</p>
          </div>
          <FormulaCard
            title={t("Common_Formula")}
            code={"CTC ≈ gross + employer PF + gratuity\nemployer cost ≈ CTC + ESI + EDLI\nin-hand ≈ gross − PF − tax"}
            note={t("Tool_employee_compensation_FormulaNote")}
          />
        </>
      }
      below={<ToolInfoPanel info={employeeCompensationInfo(t)} />}
    >
      <div className="fy-form-card">
        <h3>{t("Common_YourInputs")}</h3>
        <div className="fy-field">
          <label>{t("Tool_employee_compensation_LabelCtc")}</label>
          <input
            type="number"
            min={0}
            step={10000}
            inputMode="decimal"
            value={ctc}
            onChange={(e) => setCtc(Math.max(0, Number(e.target.value) || 0))}
          />
        </div>
        <div className="fy-field">
          <label>{t("Tool_employee_compensation_LabelBasic")}</label>
          <input
            type="number"
            min={20}
            max={80}
            step={1}
            inputMode="decimal"
            value={basicPercent}
            onChange={(e) =>
              setBasicPercent(Math.min(80, Math.max(20, Number(e.target.value) || 40)))
            }
          />
        </div>
        <div className="fy-field">
          <label>{t("Tool_employee_compensation_LabelPf")}</label>
          <select
            value={pfOnActual ? "actual" : "ceiling"}
            onChange={(e) => setPfOnActual(e.target.value === "actual")}
          >
            <option value="actual">{t("Tool_employee_compensation_Pf_Actual")}</option>
            <option value="ceiling">{t("Tool_employee_compensation_Pf_Ceiling")}</option>
          </select>
        </div>
        <div className="fy-field">
          <label>{t("Tool_employee_compensation_LabelEsi")}</label>
          <select
            value={includeEsi ? "yes" : "no"}
            onChange={(e) => setIncludeEsi(e.target.value === "yes")}
          >
            <option value="no">{t("Tool_employee_compensation_Esi_No")}</option>
            <option value="yes">{t("Tool_employee_compensation_Esi_Yes")}</option>
          </select>
        </div>
        <div className="fy-field">
          <label>{t("Tool_employee_compensation_LabelDeductions")}</label>
          <input
            type="number"
            min={0}
            step={1000}
            inputMode="decimal"
            value={deductions}
            onChange={(e) => setDeductions(Math.max(0, Number(e.target.value) || 0))}
          />
          <p className="fy-field-hint">{t("Tool_employee_compensation_DeductionsHint")}</p>
        </div>
        <button type="button" className="fy-btn-calc">
          {t("Common_Calculate")}
        </button>
      </div>

      <ResultSummaryCards cards={summaryCards} />
      <ScenarioCompare
        title={t("Tool_employee_compensation_ScenarioTitle")}
        subtitle={t("Tool_employee_compensation_ScenarioSubtitle")}
        scenarios={scenarios}
      />
      <WorkedExample
        title={t("Tool_employee_compensation_ExampleTitle")}
        subtitle={t("Tool_employee_compensation_ExampleSubtitle")}
        steps={exampleSteps}
      />
    </ToolPageShell>
  );
}
