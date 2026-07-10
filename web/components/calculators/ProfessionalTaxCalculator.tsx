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
  calculateProfessionalTax,
  PT_STATES,
  type PtStateId,
} from "@/lib/finance/professionalTax";
import { inr } from "@/lib/finance/format";
import { getTool } from "@/lib/config/tools";
import { professionalTaxInfo } from "@/lib/tool-page-content";

export function ProfessionalTaxCalculator() {
  const t = useT();
  const tool = getTool("professional-tax")!;

  const [monthlySalary, setMonthlySalary] = useState(40_000);
  const [stateId, setStateId] = useState<PtStateId>("mh");

  const exampleSteps = useMemo(
    () => [
      t("Tool_professional_tax_ExampleStep_1"),
      t("Tool_professional_tax_ExampleStep_2"),
      t("Tool_professional_tax_ExampleStep_3"),
      t("Tool_professional_tax_ExampleStep_4"),
      t("Tool_professional_tax_ExampleStep_5"),
    ],
    [t],
  );

  const { summaryCards, scenarios, detail } = useMemo(() => {
    const result = calculateProfessionalTax(monthlySalary, stateId);
    const lower = calculateProfessionalTax(Math.max(0, monthlySalary * 0.7), stateId);
    const higher = calculateProfessionalTax(monthlySalary * 1.3, stateId);

    return {
      detail: result,
      summaryCards: [
        {
          label: t("Tool_professional_tax_Result_Monthly"),
          value: inr(result.monthlyTax),
          footnote: t("Tool_professional_tax_Result_MonthlyFootnote"),
          variant: "primary" as const,
        },
        {
          label: t("Tool_professional_tax_Result_Annual"),
          value: inr(result.annualTax),
          footnote: result.capped
            ? t("Tool_professional_tax_Result_Capped")
            : t("Tool_professional_tax_Result_AnnualFootnote"),
          variant: "secure" as const,
        },
        {
          label: t("Tool_professional_tax_Result_TakeHomeHit"),
          value: inr(result.monthlyTax),
          footnote: t("Tool_professional_tax_Result_TakeHomeFootnote"),
        },
      ],
      scenarios: [
        {
          name: t("Tool_professional_tax_Scenario_Lower"),
          primaryLabel: t("Tool_professional_tax_Result_Monthly"),
          primaryValue: inr(lower.monthlyTax),
          secondaryLabel: t("Tool_professional_tax_LabelSalary"),
          secondaryValue: inr(Math.max(0, monthlySalary * 0.7)),
          variant: "best",
        },
        {
          name: t("Common_Scenario_Base"),
          primaryLabel: t("Tool_professional_tax_Result_Monthly"),
          primaryValue: inr(result.monthlyTax),
          secondaryLabel: t("Tool_professional_tax_Result_Annual"),
          secondaryValue: inr(result.annualTax),
          variant: "base",
        },
        {
          name: t("Tool_professional_tax_Scenario_Higher"),
          primaryLabel: t("Tool_professional_tax_Result_Monthly"),
          primaryValue: inr(higher.monthlyTax),
          secondaryLabel: t("Tool_professional_tax_LabelSalary"),
          secondaryValue: inr(monthlySalary * 1.3),
          variant: "worst",
        },
      ],
    };
  }, [monthlySalary, stateId, t]);

  return (
    <ToolPageShell
      title={t(tool.titleKey)}
      subtitle={t("Tool_professional_tax_Subtitle")}
      description={t(tool.descriptionKey)}
      icon={tool.icon}
      educate={
        <>
          <div className="fy-info-box">
            <strong>{t("Common_WhatYouLearn")}</strong>
            <p>{t("Tool_professional_tax_LearnText")}</p>
          </div>
          <FormulaCard
            title={t("Common_Formula")}
            code={"Find state slab for monthly salary\nAnnual PT = monthly × 12 (cap if any)"}
            note={t("Tool_professional_tax_FormulaNote")}
          />
        </>
      }
      below={<ToolInfoPanel info={professionalTaxInfo(t)} />}
    >
      <div className="fy-form-card">
        <h3>{t("Common_YourInputs")}</h3>
        <div className="fy-field">
          <label>{t("Tool_professional_tax_LabelSalary")}</label>
          <input
            type="number"
            min={0}
            step={1000}
            inputMode="decimal"
            value={monthlySalary}
            onChange={(e) => setMonthlySalary(Math.max(0, Number(e.target.value) || 0))}
          />
        </div>
        <div className="fy-field">
          <label>{t("Tool_professional_tax_LabelState")}</label>
          <select value={stateId} onChange={(e) => setStateId(e.target.value as PtStateId)}>
            {PT_STATES.map((s) => (
              <option key={s.id} value={s.id}>
                {t(`Tool_professional_tax_State_${s.id}`)}
              </option>
            ))}
          </select>
          <p className="fy-field-hint">{t("Tool_professional_tax_StateHint")}</p>
        </div>
        <button type="button" className="fy-btn-calc">
          {t("Common_Calculate")}
        </button>
      </div>

      {detail.capped && (
        <div className="fy-info-box fy-tax-verdict">
          <strong>{t("Tool_professional_tax_CapTitle")}</strong>
          <p>{t("Tool_professional_tax_CapBody", inr(detail.annualTax))}</p>
        </div>
      )}

      <ResultSummaryCards cards={summaryCards} />
      <ScenarioCompare
        title={t("Tool_professional_tax_ScenarioTitle")}
        subtitle={t("Tool_professional_tax_ScenarioSubtitle")}
        scenarios={scenarios}
      />
      <WorkedExample
        title={t("Tool_professional_tax_ExampleTitle")}
        subtitle={t("Tool_professional_tax_ExampleSubtitle")}
        steps={exampleSteps}
      />
    </ToolPageShell>
  );
}
