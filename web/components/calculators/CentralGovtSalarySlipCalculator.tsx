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
import { calculateCentralGovtSalarySlip } from "@/lib/finance/centralGovtSalarySlip";
import { inr, percent } from "@/lib/finance/format";
import { getTool } from "@/lib/config/tools";
import { centralGovtSalarySlipInfo } from "@/lib/tool-page-content";

export function CentralGovtSalarySlipCalculator() {
  const t = useT();
  const tool = getTool("central-govt-salary-slip")!;

  const [basic, setBasic] = useState(56_100);
  const [daPercent, setDaPercent] = useState(50);
  const [hraPercent, setHraPercent] = useState(27);
  const [otherAllowances, setOtherAllowances] = useState(5_400);
  const [deductions, setDeductions] = useState(12_000);

  const exampleSteps = useMemo(
    () => [
      t("Tool_central_govt_salary_slip_ExampleStep_1"),
      t("Tool_central_govt_salary_slip_ExampleStep_2"),
      t("Tool_central_govt_salary_slip_ExampleStep_3"),
      t("Tool_central_govt_salary_slip_ExampleStep_4"),
      t("Tool_central_govt_salary_slip_ExampleStep_5"),
    ],
    [t],
  );

  const { summaryCards, scenarios } = useMemo(() => {
    const result = calculateCentralGovtSalarySlip({
      basicPay: basic,
      daPercent,
      hraPercent,
      otherAllowances,
      deductions,
    });
    const lowerDa = calculateCentralGovtSalarySlip({
      basicPay: basic,
      daPercent: Math.max(0, daPercent - 5),
      hraPercent,
      otherAllowances,
      deductions,
    });
    const higherDa = calculateCentralGovtSalarySlip({
      basicPay: basic,
      daPercent: daPercent + 5,
      hraPercent,
      otherAllowances,
      deductions,
    });

    return {
      summaryCards: [
        {
          label: t("Tool_central_govt_salary_slip_Result_Gross"),
          value: inr(result.grossPay),
          footnote: t(
            "Tool_central_govt_salary_slip_Result_GrossFootnote",
            inr(result.daAmount),
            inr(result.hraAmount),
          ),
          variant: "primary" as const,
        },
        {
          label: t("Tool_central_govt_salary_slip_Result_Net"),
          value: inr(result.netPay),
          footnote: t("Tool_central_govt_salary_slip_Result_NetFootnote", inr(result.deductions)),
          variant: "secure" as const,
        },
        {
          label: t("Tool_central_govt_salary_slip_Result_Da"),
          value: inr(result.daAmount),
          footnote: t("Tool_central_govt_salary_slip_Result_DaFootnote", percent(daPercent, 0)),
        },
      ],
      scenarios: [
        {
          name: t("Tool_central_govt_salary_slip_Scenario_LowerDa"),
          primaryLabel: t("Tool_central_govt_salary_slip_Result_Net"),
          primaryValue: inr(lowerDa.netPay),
          secondaryLabel: t("Tool_central_govt_salary_slip_Result_Gross"),
          secondaryValue: inr(lowerDa.grossPay),
          variant: "worst" as const,
        },
        {
          name: t("Common_Scenario_Base"),
          primaryLabel: t("Tool_central_govt_salary_slip_Result_Net"),
          primaryValue: inr(result.netPay),
          secondaryLabel: t("Tool_central_govt_salary_slip_Result_Gross"),
          secondaryValue: inr(result.grossPay),
          variant: "base" as const,
        },
        {
          name: t("Tool_central_govt_salary_slip_Scenario_HigherDa"),
          primaryLabel: t("Tool_central_govt_salary_slip_Result_Net"),
          primaryValue: inr(higherDa.netPay),
          secondaryLabel: t("Tool_central_govt_salary_slip_Result_Gross"),
          secondaryValue: inr(higherDa.grossPay),
          variant: "best" as const,
        },
      ],
    };
  }, [basic, daPercent, hraPercent, otherAllowances, deductions, t]);

  return (
    <ToolPageShell
      title={t(tool.titleKey)}
      subtitle={t("Tool_central_govt_salary_slip_Subtitle")}
      description={t(tool.descriptionKey)}
      icon={tool.icon}
      educate={
        <>
          <div className="fy-info-box">
            <strong>{t("Common_WhatYouLearn")}</strong>
            <p>{t("Tool_central_govt_salary_slip_LearnText")}</p>
          </div>
          <FormulaCard
            title={t("Common_Formula")}
            code={"DA = basic × DA%\nHRA = basic × HRA%\ngross = basic + DA + HRA + other\nnet = gross − deductions"}
            note={t("Tool_central_govt_salary_slip_FormulaNote")}
          />
        </>
      }
      below={<ToolInfoPanel info={centralGovtSalarySlipInfo(t)} />}
    >
      <div className="fy-form-card">
        <h3>{t("Common_YourInputs")}</h3>
        <div className="fy-field">
          <label>{t("Tool_central_govt_salary_slip_LabelBasic")}</label>
          <input
            type="number"
            min={0}
            step={100}
            inputMode="decimal"
            value={basic}
            onChange={(e) => setBasic(Math.max(0, Number(e.target.value) || 0))}
          />
        </div>
        <div className="fy-field">
          <label>{t("Tool_central_govt_salary_slip_LabelDa")}</label>
          <input
            type="number"
            min={0}
            max={200}
            step={1}
            inputMode="decimal"
            value={daPercent}
            onChange={(e) => setDaPercent(Math.max(0, Number(e.target.value) || 0))}
          />
        </div>
        <div className="fy-field">
          <label>{t("Tool_central_govt_salary_slip_LabelHra")}</label>
          <input
            type="number"
            min={0}
            max={50}
            step={1}
            inputMode="decimal"
            value={hraPercent}
            onChange={(e) => setHraPercent(Math.max(0, Number(e.target.value) || 0))}
          />
          <p className="fy-field-hint">{t("Tool_central_govt_salary_slip_HraHint")}</p>
        </div>
        <div className="fy-field">
          <label>{t("Tool_central_govt_salary_slip_LabelOther")}</label>
          <input
            type="number"
            min={0}
            step={100}
            inputMode="decimal"
            value={otherAllowances}
            onChange={(e) => setOtherAllowances(Math.max(0, Number(e.target.value) || 0))}
          />
        </div>
        <div className="fy-field">
          <label>{t("Tool_central_govt_salary_slip_LabelDeductions")}</label>
          <input
            type="number"
            min={0}
            step={100}
            inputMode="decimal"
            value={deductions}
            onChange={(e) => setDeductions(Math.max(0, Number(e.target.value) || 0))}
          />
          <p className="fy-field-hint">{t("Tool_central_govt_salary_slip_DeductionsHint")}</p>
        </div>
        <button type="button" className="fy-btn-calc">
          {t("Common_Calculate")}
        </button>
      </div>

      <ResultSummaryCards cards={summaryCards} />
      <ScenarioCompare
        title={t("Tool_central_govt_salary_slip_ScenarioTitle")}
        subtitle={t("Tool_central_govt_salary_slip_ScenarioSubtitle")}
        scenarios={scenarios}
      />
      <WorkedExample
        title={t("Tool_central_govt_salary_slip_ExampleTitle")}
        subtitle={t("Tool_central_govt_salary_slip_ExampleSubtitle")}
        steps={exampleSteps}
      />
    </ToolPageShell>
  );
}
