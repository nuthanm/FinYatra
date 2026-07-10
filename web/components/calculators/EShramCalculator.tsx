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
  calculateEShram,
  ESHRAM_PMJJBY_COVER,
  ESHRAM_PMJJBY_PREMIUM,
  ESHRAM_PMSBY_COVER,
  ESHRAM_PMSBY_PREMIUM,
  ESHRAM_PMSYM_PENSION,
} from "@/lib/finance/eShram";
import { inr } from "@/lib/finance/format";
import { getTool } from "@/lib/config/tools";
import { eShramInfo } from "@/lib/tool-page-content";

export function EShramCalculator() {
  const t = useT();
  const tool = getTool("e-shram")!;

  const [registered, setRegistered] = useState(true);
  const [pmsby, setPmsby] = useState(true);
  const [pmjjby, setPmjjby] = useState(true);
  const [pmsym, setPmsym] = useState(true);

  const exampleSteps = useMemo(
    () => [
      t("Tool_e_shram_ExampleStep_1"),
      t("Tool_e_shram_ExampleStep_2"),
      t("Tool_e_shram_ExampleStep_3"),
      t("Tool_e_shram_ExampleStep_4"),
      t("Tool_e_shram_ExampleStep_5"),
    ],
    [t],
  );

  const { summaryCards, scenarios, result } = useMemo(() => {
    const result = calculateEShram({
      registered,
      includePmsby: pmsby,
      includePmjjby: pmjjby,
      includePmsym: pmsym,
    });
    const none = calculateEShram({
      registered: false,
      includePmsby: true,
      includePmjjby: true,
      includePmsym: true,
    });
    const full = calculateEShram({
      registered: true,
      includePmsby: true,
      includePmjjby: true,
      includePmsym: true,
    });

    return {
      result,
      summaryCards: [
        {
          label: t("Tool_e_shram_Result_Premium"),
          value: inr(result.totalAnnualPremium),
          footnote: t("Tool_e_shram_Result_PremiumFootnote"),
          variant: "primary" as const,
        },
        {
          label: t("Tool_e_shram_Result_Cover"),
          value: inr(result.totalLifeAccidentCover),
          footnote: t("Tool_e_shram_Result_CoverFootnote"),
          variant: "secure" as const,
        },
        {
          label: t("Tool_e_shram_Result_Pension"),
          value: inr(result.pmsymMonthlyPension),
          footnote: t("Tool_e_shram_Result_PensionFootnote"),
        },
      ],
      scenarios: [
        {
          name: t("Tool_e_shram_Scenario_NotReg"),
          primaryLabel: t("Tool_e_shram_Result_Premium"),
          primaryValue: inr(none.totalAnnualPremium),
          secondaryLabel: t("Tool_e_shram_Result_Cover"),
          secondaryValue: inr(none.totalLifeAccidentCover),
          variant: "worst" as const,
        },
        {
          name: t("Common_Scenario_Base"),
          primaryLabel: t("Tool_e_shram_Result_Premium"),
          primaryValue: inr(result.totalAnnualPremium),
          secondaryLabel: t("Tool_e_shram_Result_Cover"),
          secondaryValue: inr(result.totalLifeAccidentCover),
          variant: "base" as const,
        },
        {
          name: t("Tool_e_shram_Scenario_Full"),
          primaryLabel: t("Tool_e_shram_Result_Premium"),
          primaryValue: inr(full.totalAnnualPremium),
          secondaryLabel: t("Tool_e_shram_Result_Pension"),
          secondaryValue: inr(full.pmsymMonthlyPension),
          variant: "best" as const,
        },
      ],
    };
  }, [registered, pmsby, pmjjby, pmsym, t]);

  return (
    <ToolPageShell
      title={t(tool.titleKey)}
      subtitle={t("Tool_e_shram_Subtitle")}
      description={t(tool.descriptionKey)}
      icon={tool.icon}
      educate={
        <>
          <div className="fy-info-box">
            <strong>{t("Common_WhatYouLearn")}</strong>
            <p>{t("Tool_e_shram_LearnText")}</p>
          </div>
          <FormulaCard
            title={t("Common_Formula")}
            code={`PMSBY ₹${ESHRAM_PMSBY_COVER.toLocaleString("en-IN")} @ ₹${ESHRAM_PMSBY_PREMIUM}/yr\nPMJJBY ₹${ESHRAM_PMJJBY_COVER.toLocaleString("en-IN")} @ ₹${ESHRAM_PMJJBY_PREMIUM}/yr\nPM-SYM ~₹${ESHRAM_PMSYM_PENSION.toLocaleString("en-IN")}/mo`}
            note={t("Tool_e_shram_FormulaNote")}
          />
        </>
      }
      below={<ToolInfoPanel info={eShramInfo(t)} />}
    >
      <div className="fy-form-card">
        <h3>{t("Common_YourInputs")}</h3>
        <div className="fy-field">
          <label>{t("Tool_e_shram_LabelRegistered")}</label>
          <select
            value={registered ? "yes" : "no"}
            onChange={(e) => setRegistered(e.target.value === "yes")}
          >
            <option value="yes">{t("Tool_e_shram_Registered_Yes")}</option>
            <option value="no">{t("Tool_e_shram_Registered_No")}</option>
          </select>
          <p className="fy-field-hint">{t("Tool_e_shram_RegisteredHint")}</p>
        </div>
        <div className="fy-field">
          <label>{t("Tool_e_shram_LabelPmsby")}</label>
          <select
            value={pmsby ? "yes" : "no"}
            onChange={(e) => setPmsby(e.target.value === "yes")}
          >
            <option value="yes">{t("Tool_e_shram_Opt_Yes")}</option>
            <option value="no">{t("Tool_e_shram_Opt_No")}</option>
          </select>
        </div>
        <div className="fy-field">
          <label>{t("Tool_e_shram_LabelPmjjby")}</label>
          <select
            value={pmjjby ? "yes" : "no"}
            onChange={(e) => setPmjjby(e.target.value === "yes")}
          >
            <option value="yes">{t("Tool_e_shram_Opt_Yes")}</option>
            <option value="no">{t("Tool_e_shram_Opt_No")}</option>
          </select>
        </div>
        <div className="fy-field">
          <label>{t("Tool_e_shram_LabelPmsym")}</label>
          <select
            value={pmsym ? "yes" : "no"}
            onChange={(e) => setPmsym(e.target.value === "yes")}
          >
            <option value="yes">{t("Tool_e_shram_Opt_Yes")}</option>
            <option value="no">{t("Tool_e_shram_Opt_No")}</option>
          </select>
        </div>
        <button type="button" className="fy-btn-calc">
          {t("Common_Calculate")}
        </button>
      </div>

      <div className="fy-info-box">
        <strong>{t("Tool_e_shram_VerdictTitle")}</strong>
        <p>
          {result.registered
            ? t(
                "Tool_e_shram_VerdictYes",
                String(result.benefitCount),
                inr(result.totalAnnualPremium),
              )
            : t("Tool_e_shram_VerdictNo")}
        </p>
      </div>

      <ResultSummaryCards cards={summaryCards} />
      <ScenarioCompare
        title={t("Tool_e_shram_ScenarioTitle")}
        subtitle={t("Tool_e_shram_ScenarioSubtitle")}
        scenarios={scenarios}
      />
      <WorkedExample
        title={t("Tool_e_shram_ExampleTitle")}
        subtitle={t("Tool_e_shram_ExampleSubtitle")}
        steps={exampleSteps}
      />
    </ToolPageShell>
  );
}
