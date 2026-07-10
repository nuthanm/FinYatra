"use client";

import { useMemo, useState } from "react";
import { useT } from "@/components/providers/I18nProvider";
import {
  BreakdownTable,
  FormulaCard,
  ResultSummaryCards,
  ScenarioCompare,
  ToolInfoPanel,
  ToolPageShell,
  WorkedExample,
} from "@/components/calculator/CalculatorUi";
import { calculateSalary } from "@/lib/finance/salary";
import { inr } from "@/lib/finance/format";
import { getTool } from "@/lib/config/tools";
import { salaryInfo } from "@/lib/tool-page-content";

export function SalaryCalculator() {
  const t = useT();
  const tool = getTool("salary")!;

  const [ctc, setCtc] = useState(1_200_000);
  const [basicPercent, setBasicPercent] = useState(40);
  const [hraPercent, setHraPercent] = useState(50);
  const [monthlyRent, setMonthlyRent] = useState(25_000);
  const [pfOnActual, setPfOnActual] = useState(true);
  const [isMetro, setIsMetro] = useState(true);
  const [useNewRegime, setUseNewRegime] = useState(true);

  const exampleSteps = useMemo(
    () => [
      t("Tool_salary_ExampleStep_1"),
      t("Tool_salary_ExampleStep_2"),
      t("Tool_salary_ExampleStep_3"),
      t("Tool_salary_ExampleStep_4"),
      t("Tool_salary_ExampleStep_5"),
    ],
    [t],
  );

  const breakdownColumns = useMemo(
    () => [
      { key: "item", header: t("Tool_salary_Col_Item"), alignRight: false as const },
      { key: "annual", header: t("Tool_salary_Col_Annual") },
      { key: "monthly", header: t("Tool_salary_Col_Monthly") },
    ],
    [t],
  );

  const { summaryCards, scenarios, breakdownRows } = useMemo(() => {
    const base = calculateSalary({
      ctcAnnual: Math.max(0, ctc),
      basicPercent,
      hraPercentOfBasic: hraPercent,
      pfOnActual,
      includeEmployerCosts: true,
      isMetro,
      monthlyRent,
      useNewRegime,
    });
    const oldRegime = calculateSalary({
      ctcAnnual: Math.max(0, ctc),
      basicPercent,
      hraPercentOfBasic: hraPercent,
      pfOnActual,
      includeEmployerCosts: true,
      isMetro,
      monthlyRent,
      useNewRegime: false,
    });
    const higherBasic = calculateSalary({
      ctcAnnual: Math.max(0, ctc),
      basicPercent: 50,
      hraPercentOfBasic: hraPercent,
      pfOnActual,
      includeEmployerCosts: true,
      isMetro,
      monthlyRent,
      useNewRegime,
    });

    return {
      summaryCards: [
        {
          label: t("Tool_salary_Result_InHandMonthly"),
          value: inr(base.inHandMonthly),
          footnote: t("Tool_salary_Result_InHandFootnote"),
          variant: "primary" as const,
        },
        {
          label: t("Tool_salary_Result_MonthlyGross"),
          value: inr(base.monthlyGross),
          footnote: t("Tool_salary_Result_GrossFootnote"),
        },
        {
          label: t("Tool_salary_Result_Deductions"),
          value: inr(base.monthlyEmployeePf + base.monthlyPt + base.monthlyTax),
          footnote: t("Tool_salary_Result_DeductionsFootnote"),
          variant: "volatile" as const,
        },
      ],
      scenarios: [
        {
          name: t("Tool_salary_Scenario_Old"),
          primaryLabel: t("Tool_salary_Result_InHandMonthly"),
          primaryValue: inr(oldRegime.inHandMonthly),
          secondaryLabel: t("Tool_salary_Result_TaxMonthly"),
          secondaryValue: inr(oldRegime.monthlyTax),
          variant: "worst",
        },
        {
          name: t("Common_Scenario_Base"),
          primaryLabel: t("Tool_salary_Result_InHandMonthly"),
          primaryValue: inr(base.inHandMonthly),
          secondaryLabel: t("Tool_salary_Result_TaxMonthly"),
          secondaryValue: inr(base.monthlyTax),
          variant: "base",
        },
        {
          name: t("Tool_salary_Scenario_HigherBasic"),
          primaryLabel: t("Tool_salary_Result_InHandMonthly"),
          primaryValue: inr(higherBasic.inHandMonthly),
          secondaryLabel: t("Tool_salary_LabelBasicPct"),
          secondaryValue: "50%",
          variant: "best",
        },
      ],
      breakdownRows: [
        { cells: { item: t("Tool_salary_Row_Basic"), annual: inr(base.basicAnnual), monthly: inr(base.basicAnnual / 12) } },
        { cells: { item: t("Tool_salary_Row_Hra"), annual: inr(base.hraAnnual), monthly: inr(base.hraAnnual / 12) } },
        { cells: { item: t("Tool_salary_Row_Special"), annual: inr(base.specialAllowanceAnnual), monthly: inr(base.specialAllowanceAnnual / 12) } },
        { cells: { item: t("Tool_salary_Row_EmployerPf"), annual: inr(base.employerPfAnnual), monthly: inr(base.employerPfAnnual / 12) } },
        { cells: { item: t("Tool_salary_Row_Gratuity"), annual: inr(base.gratuityAnnual), monthly: inr(base.gratuityAnnual / 12) } },
        { cells: { item: t("Tool_salary_Row_EmployeePf"), annual: inr(base.employeePfAnnual), monthly: inr(base.monthlyEmployeePf) } },
        { cells: { item: t("Tool_salary_Row_Pt"), annual: inr(base.professionalTaxAnnual), monthly: inr(base.monthlyPt) } },
        { cells: { item: t("Tool_salary_Row_Tax"), annual: inr(base.estimatedTaxAnnual), monthly: inr(base.monthlyTax) } },
        { cells: { item: t("Tool_salary_Row_InHand"), annual: inr(base.inHandAnnual), monthly: inr(base.inHandMonthly) } },
      ],
    };
  }, [ctc, basicPercent, hraPercent, monthlyRent, pfOnActual, isMetro, useNewRegime, t]);

  return (
    <ToolPageShell
      title={t(tool.titleKey)}
      subtitle={t("Tool_salary_Subtitle")}
      description={t(tool.descriptionKey)}
      icon={tool.icon}
      educate={
        <>
          <div className="fy-info-box">
            <strong>{t("Common_WhatYouLearn")}</strong>
            <p>{t("Tool_salary_LearnText")}</p>
          </div>
          <FormulaCard
            title={t("Common_Formula")}
            code={"in-hand = gross − employee PF − PT − tax\ngross ≈ CTC − employer PF − gratuity"}
            note={t("Tool_salary_FormulaNote")}
          />
        </>
      }
      below={<ToolInfoPanel info={salaryInfo(t)} />}
    >
      <div className="fy-form-card">
        <h3>{t("Common_YourInputs")}</h3>
        <div className="fy-field">
          <label>{t("Tool_salary_LabelCtc")}</label>
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
          <label>{t("Tool_salary_LabelBasicPct")}</label>
          <input
            type="number"
            min={20}
            max={80}
            step={1}
            inputMode="numeric"
            value={basicPercent}
            onChange={(e) => setBasicPercent(Math.min(80, Math.max(20, Number(e.target.value) || 40)))}
          />
        </div>
        <div className="fy-field">
          <label>{t("Tool_salary_LabelHraPct")}</label>
          <input
            type="number"
            min={0}
            max={60}
            step={1}
            inputMode="numeric"
            value={hraPercent}
            onChange={(e) => setHraPercent(Math.min(60, Math.max(0, Number(e.target.value) || 0)))}
          />
        </div>
        <div className="fy-field">
          <label>{t("Tool_salary_LabelRent")}</label>
          <input
            type="number"
            min={0}
            step={500}
            inputMode="decimal"
            value={monthlyRent}
            onChange={(e) => setMonthlyRent(Math.max(0, Number(e.target.value) || 0))}
          />
          <p className="fy-field-hint">{t("Tool_salary_RentHint")}</p>
        </div>
        <div className="fy-field">
          <label>
            <input type="checkbox" checked={pfOnActual} onChange={(e) => setPfOnActual(e.target.checked)} />{" "}
            {t("Tool_salary_LabelPfActual")}
          </label>
        </div>
        <div className="fy-field">
          <label>
            <input type="checkbox" checked={isMetro} onChange={(e) => setIsMetro(e.target.checked)} />{" "}
            {t("Tool_salary_LabelMetro")}
          </label>
        </div>
        <div className="fy-field">
          <label>
            <input type="checkbox" checked={useNewRegime} onChange={(e) => setUseNewRegime(e.target.checked)} />{" "}
            {t("Tool_salary_LabelNewRegime")}
          </label>
        </div>
        <button type="button" className="fy-btn-calc">
          {t("Common_Calculate")}
        </button>
      </div>

      <ResultSummaryCards cards={summaryCards} />
      <ScenarioCompare title={t("Tool_salary_ScenarioTitle")} subtitle={t("Tool_salary_ScenarioSubtitle")} scenarios={scenarios} />
      <BreakdownTable title={t("Tool_salary_BreakdownTitle")} columns={breakdownColumns} rows={breakdownRows} />
      <WorkedExample title={t("Tool_salary_ExampleTitle")} subtitle={t("Tool_salary_ExampleSubtitle")} steps={exampleSteps} />
    </ToolPageShell>
  );
}
