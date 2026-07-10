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
  calculatePmKisan,
  PM_KISAN_ANNUAL,
  PM_KISAN_PER_INSTALLMENT,
} from "@/lib/finance/pmKisan";
import { inr } from "@/lib/finance/format";
import { getTool } from "@/lib/config/tools";
import { pmKisanInfo } from "@/lib/tool-page-content";

export function PmKisanCalculator() {
  const t = useT();
  const tool = getTool("pm-kisan")!;

  const [eligible, setEligible] = useState(true);

  const exampleSteps = useMemo(
    () => [
      t("Tool_pm_kisan_ExampleStep_1"),
      t("Tool_pm_kisan_ExampleStep_2"),
      t("Tool_pm_kisan_ExampleStep_3"),
      t("Tool_pm_kisan_ExampleStep_4"),
      t("Tool_pm_kisan_ExampleStep_5"),
    ],
    [t],
  );

  const { summaryCards, scenarios, result } = useMemo(() => {
    const result = calculatePmKisan({ eligible });
    const yes = calculatePmKisan({ eligible: true });
    const no = calculatePmKisan({ eligible: false });

    return {
      result,
      summaryCards: [
        {
          label: t("Tool_pm_kisan_Result_Annual"),
          value: inr(result.annualBenefit),
          footnote: t("Tool_pm_kisan_Result_AnnualFootnote"),
          variant: "primary" as const,
        },
        {
          label: t("Tool_pm_kisan_Result_Installment"),
          value: inr(result.installmentAmount),
          footnote: t("Tool_pm_kisan_Result_InstallmentFootnote", String(result.installmentCount)),
          variant: "secure" as const,
        },
        {
          label: t("Tool_pm_kisan_Result_Status"),
          value: result.eligible
            ? t("Tool_pm_kisan_Status_Eligible")
            : t("Tool_pm_kisan_Status_NotEligible"),
          footnote: t("Tool_pm_kisan_Result_StatusFootnote"),
        },
      ],
      scenarios: [
        {
          name: t("Tool_pm_kisan_Scenario_No"),
          primaryLabel: t("Tool_pm_kisan_Result_Annual"),
          primaryValue: inr(no.annualBenefit),
          secondaryLabel: t("Tool_pm_kisan_Result_Installment"),
          secondaryValue: inr(no.installmentAmount),
          variant: "worst",
        },
        {
          name: t("Common_Scenario_Base"),
          primaryLabel: t("Tool_pm_kisan_Result_Annual"),
          primaryValue: inr(result.annualBenefit),
          secondaryLabel: t("Tool_pm_kisan_Result_Installment"),
          secondaryValue: inr(result.installmentAmount),
          variant: "base",
        },
        {
          name: t("Tool_pm_kisan_Scenario_Yes"),
          primaryLabel: t("Tool_pm_kisan_Result_Annual"),
          primaryValue: inr(yes.annualBenefit),
          secondaryLabel: t("Tool_pm_kisan_Result_Installment"),
          secondaryValue: inr(yes.installmentAmount),
          variant: "best",
        },
      ],
    };
  }, [eligible, t]);

  return (
    <ToolPageShell
      title={t(tool.titleKey)}
      subtitle={t("Tool_pm_kisan_Subtitle")}
      description={t(tool.descriptionKey)}
      icon={tool.icon}
      educate={
        <>
          <div className="fy-info-box">
            <strong>{t("Common_WhatYouLearn")}</strong>
            <p>{t("Tool_pm_kisan_LearnText")}</p>
          </div>
          <FormulaCard
            title={t("Common_Formula")}
            code={`If eligible → ₹${PM_KISAN_ANNUAL.toLocaleString("en-IN")}/year\nin 3 instalments of ₹${PM_KISAN_PER_INSTALLMENT.toLocaleString("en-IN")} each`}
            note={t("Tool_pm_kisan_FormulaNote")}
          />
        </>
      }
      below={<ToolInfoPanel info={pmKisanInfo(t)} />}
    >
      <div className="fy-form-card">
        <h3>{t("Common_YourInputs")}</h3>
        <div className="fy-field">
          <label>{t("Tool_pm_kisan_LabelEligible")}</label>
          <select
            value={eligible ? "yes" : "no"}
            onChange={(e) => setEligible(e.target.value === "yes")}
          >
            <option value="yes">{t("Tool_pm_kisan_Eligible_Yes")}</option>
            <option value="no">{t("Tool_pm_kisan_Eligible_No")}</option>
          </select>
          <p className="fy-field-hint">{t("Tool_pm_kisan_EligibleHint")}</p>
        </div>
        <button type="button" className="fy-btn-calc">
          {t("Common_Calculate")}
        </button>
      </div>

      <div className="fy-info-box">
        <strong>{t("Tool_pm_kisan_VerdictTitle")}</strong>
        <p>
          {result.eligible
            ? t(
                "Tool_pm_kisan_VerdictYes",
                inr(result.annualBenefit),
                inr(result.installmentAmount),
              )
            : t("Tool_pm_kisan_VerdictNo")}
        </p>
        {result.eligible && (
          <ul style={{ marginTop: "0.5rem", paddingLeft: "1.25rem" }}>
            {result.installments.map((inst) => (
              <li key={inst.index}>
                {t("Tool_pm_kisan_InstallmentRow", String(inst.index), inr(inst.amount))}
              </li>
            ))}
          </ul>
        )}
      </div>

      <ResultSummaryCards cards={summaryCards} />
      <ScenarioCompare
        title={t("Tool_pm_kisan_ScenarioTitle")}
        subtitle={t("Tool_pm_kisan_ScenarioSubtitle")}
        scenarios={scenarios}
      />
      <WorkedExample
        title={t("Tool_pm_kisan_ExampleTitle")}
        subtitle={t("Tool_pm_kisan_ExampleSubtitle")}
        steps={exampleSteps}
      />
    </ToolPageShell>
  );
}
