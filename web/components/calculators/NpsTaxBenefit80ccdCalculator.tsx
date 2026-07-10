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
import { calculateNpsTaxBenefit80ccd } from "@/lib/finance/npsTaxBenefit80ccd";
import { inr, percent } from "@/lib/finance/format";
import { getTool } from "@/lib/config/tools";
import { npsTaxBenefit80ccdInfo } from "@/lib/tool-page-content";

export function NpsTaxBenefit80ccdCalculator() {
  const t = useT();
  const tool = getTool("80ccd-nps-tax-benefit")!;

  const [basicDa, setBasicDa] = useState(6_00_000);
  const [employeeNps, setEmployeeNps] = useState(1_50_000);
  const [employerNps, setEmployerNps] = useState(60_000);
  const [other80c, setOther80c] = useState(50_000);
  const [slab, setSlab] = useState(30);
  const [useOldRegime, setUseOldRegime] = useState(true);
  const [isCentralGovt, setIsCentralGovt] = useState(false);

  const exampleSteps = useMemo(
    () => [
      t("Tool_80ccd_nps_tax_benefit_ExampleStep_1"),
      t("Tool_80ccd_nps_tax_benefit_ExampleStep_2"),
      t("Tool_80ccd_nps_tax_benefit_ExampleStep_3"),
      t("Tool_80ccd_nps_tax_benefit_ExampleStep_4"),
      t("Tool_80ccd_nps_tax_benefit_ExampleStep_5"),
    ],
    [t],
  );

  const { summaryCards, scenarios } = useMemo(() => {
    const result = calculateNpsTaxBenefit80ccd({
      basicDaAnnual: basicDa,
      employeeNpsAnnual: employeeNps,
      employerNpsAnnual: employerNps,
      other80cUsed: other80c,
      taxSlabPercent: slab,
      useOldRegime,
      isCentralGovt,
    });
    const newRegime = calculateNpsTaxBenefit80ccd({
      basicDaAnnual: basicDa,
      employeeNpsAnnual: employeeNps,
      employerNpsAnnual: employerNps,
      other80cUsed: other80c,
      taxSlabPercent: slab,
      useOldRegime: false,
      isCentralGovt,
    });
    const moreEmployer = calculateNpsTaxBenefit80ccd({
      basicDaAnnual: basicDa,
      employeeNpsAnnual: employeeNps,
      employerNpsAnnual: Math.round(employerNps * 1.5),
      other80cUsed: other80c,
      taxSlabPercent: slab,
      useOldRegime,
      isCentralGovt,
    });

    return {
      summaryCards: [
        {
          label: t("Tool_80ccd_nps_tax_benefit_Result_Total"),
          value: inr(result.totalDeduction),
          footnote: t("Tool_80ccd_nps_tax_benefit_Result_TotalFootnote"),
          variant: "primary" as const,
        },
        {
          label: t("Tool_80ccd_nps_tax_benefit_Result_Saved"),
          value: inr(result.taxSaved),
          footnote: t("Tool_80ccd_nps_tax_benefit_Result_SavedFootnote", percent(slab)),
          variant: "secure" as const,
        },
        {
          label: t("Tool_80ccd_nps_tax_benefit_Result_Employer"),
          value: inr(result.deduction80ccd2),
          footnote: t(
            "Tool_80ccd_nps_tax_benefit_Result_EmployerFootnote",
            percent(result.employerLimitPercent),
          ),
        },
      ],
      scenarios: [
        {
          name: t("Tool_80ccd_nps_tax_benefit_Scenario_New"),
          primaryLabel: t("Tool_80ccd_nps_tax_benefit_Result_Total"),
          primaryValue: inr(newRegime.totalDeduction),
          secondaryLabel: t("Tool_80ccd_nps_tax_benefit_Result_Saved"),
          secondaryValue: inr(newRegime.taxSaved),
          variant: "worst" as const,
        },
        {
          name: t("Common_Scenario_Base"),
          primaryLabel: t("Tool_80ccd_nps_tax_benefit_Result_Total"),
          primaryValue: inr(result.totalDeduction),
          secondaryLabel: t("Tool_80ccd_nps_tax_benefit_Result_1b"),
          secondaryValue: inr(result.deduction80ccd1b),
          variant: "base" as const,
        },
        {
          name: t("Tool_80ccd_nps_tax_benefit_Scenario_MoreEmployer"),
          primaryLabel: t("Tool_80ccd_nps_tax_benefit_Result_Total"),
          primaryValue: inr(moreEmployer.totalDeduction),
          secondaryLabel: t("Tool_80ccd_nps_tax_benefit_Result_Employer"),
          secondaryValue: inr(moreEmployer.deduction80ccd2),
          variant: "best" as const,
        },
      ],
    };
  }, [basicDa, employeeNps, employerNps, other80c, slab, useOldRegime, isCentralGovt, t]);

  return (
    <ToolPageShell
      title={t(tool.titleKey)}
      subtitle={t("Tool_80ccd_nps_tax_benefit_Subtitle")}
      description={t(tool.descriptionKey)}
      icon={tool.icon}
      educate={
        <>
          <div className="fy-info-box">
            <strong>{t("Common_WhatYouLearn")}</strong>
            <p>{t("Tool_80ccd_nps_tax_benefit_LearnText")}</p>
          </div>
          <FormulaCard
            title={t("Common_Formula")}
            code={
              "80CCD(1) ≤ remaining 80C ₹1.5L\n80CCD(1B) ≤ ₹50K (old)\n80CCD(2) ≤ 10%/14% of Basic+DA\nTax saved ≈ deduction × slab × 1.04"
            }
            note={t("Tool_80ccd_nps_tax_benefit_FormulaNote")}
          />
        </>
      }
      below={<ToolInfoPanel info={npsTaxBenefit80ccdInfo(t)} />}
    >
      <div className="fy-form-card">
        <h3>{t("Common_YourInputs")}</h3>
        <div className="fy-field">
          <label>{t("Tool_80ccd_nps_tax_benefit_LabelBasicDa")}</label>
          <input
            type="number"
            min={0}
            step={10000}
            inputMode="decimal"
            value={basicDa}
            onChange={(e) => setBasicDa(Math.max(0, Number(e.target.value) || 0))}
          />
        </div>
        <div className="fy-field">
          <label>{t("Tool_80ccd_nps_tax_benefit_LabelEmployee")}</label>
          <input
            type="number"
            min={0}
            step={5000}
            inputMode="decimal"
            value={employeeNps}
            onChange={(e) => setEmployeeNps(Math.max(0, Number(e.target.value) || 0))}
          />
        </div>
        <div className="fy-field">
          <label>{t("Tool_80ccd_nps_tax_benefit_LabelEmployer")}</label>
          <input
            type="number"
            min={0}
            step={5000}
            inputMode="decimal"
            value={employerNps}
            onChange={(e) => setEmployerNps(Math.max(0, Number(e.target.value) || 0))}
          />
        </div>
        <div className="fy-field">
          <label>{t("Tool_80ccd_nps_tax_benefit_LabelOther80c")}</label>
          <input
            type="number"
            min={0}
            step={5000}
            inputMode="decimal"
            value={other80c}
            onChange={(e) => setOther80c(Math.max(0, Number(e.target.value) || 0))}
          />
          <p className="fy-field-hint">{t("Tool_80ccd_nps_tax_benefit_Other80cHint")}</p>
        </div>
        <div className="fy-field">
          <label>{t("Tool_80ccd_nps_tax_benefit_LabelSlab")}</label>
          <input
            type="number"
            min={0}
            max={42}
            step={1}
            inputMode="decimal"
            value={slab}
            onChange={(e) => setSlab(Math.max(0, Number(e.target.value) || 0))}
          />
        </div>
        <div className="fy-field">
          <label>{t("Tool_80ccd_nps_tax_benefit_LabelRegime")}</label>
          <select
            value={useOldRegime ? "old" : "new"}
            onChange={(e) => setUseOldRegime(e.target.value === "old")}
          >
            <option value="old">{t("Tool_80ccd_nps_tax_benefit_Regime_Old")}</option>
            <option value="new">{t("Tool_80ccd_nps_tax_benefit_Regime_New")}</option>
          </select>
        </div>
        <div className="fy-field">
          <label>{t("Tool_80ccd_nps_tax_benefit_LabelEmployerType")}</label>
          <select
            value={isCentralGovt ? "central" : "private"}
            onChange={(e) => setIsCentralGovt(e.target.value === "central")}
          >
            <option value="private">{t("Tool_80ccd_nps_tax_benefit_Employer_Private")}</option>
            <option value="central">{t("Tool_80ccd_nps_tax_benefit_Employer_Central")}</option>
          </select>
        </div>
        <button type="button" className="fy-btn-calc">
          {t("Common_Calculate")}
        </button>
      </div>

      <ResultSummaryCards cards={summaryCards} />
      <ScenarioCompare
        title={t("Tool_80ccd_nps_tax_benefit_ScenarioTitle")}
        subtitle={t("Tool_80ccd_nps_tax_benefit_ScenarioSubtitle")}
        scenarios={scenarios}
      />
      <WorkedExample
        title={t("Tool_80ccd_nps_tax_benefit_ExampleTitle")}
        subtitle={t("Tool_80ccd_nps_tax_benefit_ExampleSubtitle")}
        steps={exampleSteps}
      />
    </ToolPageShell>
  );
}
