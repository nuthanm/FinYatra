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
  APY_MAX_AGE,
  APY_MIN_AGE,
  APY_PENSION_OPTIONS,
  APY_RETIREMENT_AGE,
  calculateAtalPension,
  type ApyPensionAmount,
} from "@/lib/finance/atalPension";
import { inr } from "@/lib/finance/format";
import { getTool } from "@/lib/config/tools";
import { atalPensionInfo } from "@/lib/tool-page-content";

export function AtalPensionCalculator() {
  const t = useT();
  const tool = getTool("atal-pension")!;

  const [entryAge, setEntryAge] = useState(30);
  const [pension, setPension] = useState<ApyPensionAmount>(5000);

  const exampleSteps = useMemo(
    () => [
      t("Tool_atal_pension_ExampleStep_1"),
      t("Tool_atal_pension_ExampleStep_2"),
      t("Tool_atal_pension_ExampleStep_3"),
      t("Tool_atal_pension_ExampleStep_4"),
      t("Tool_atal_pension_ExampleStep_5"),
    ],
    [t],
  );

  const { summaryCards, scenarios, detail } = useMemo(() => {
    const result = calculateAtalPension(entryAge, pension);
    const lowPension = calculateAtalPension(entryAge, 1000);
    const midPension = calculateAtalPension(entryAge, 3000);
    const younger = calculateAtalPension(Math.max(APY_MIN_AGE, entryAge - 5), pension);

    return {
      detail: result,
      summaryCards: [
        {
          label: t("Tool_atal_pension_Result_Monthly"),
          value: result.valid ? inr(result.monthlyContribution) : "—",
          footnote: t("Tool_atal_pension_Result_MonthlyFootnote", APY_RETIREMENT_AGE),
          variant: "primary" as const,
        },
        {
          label: t("Tool_atal_pension_Result_Pension"),
          value: inr(pension),
          footnote: t("Tool_atal_pension_Result_PensionFootnote"),
          variant: "secure" as const,
        },
        {
          label: t("Tool_atal_pension_Result_Total"),
          value: result.valid ? inr(result.totalContribution) : "—",
          footnote: t("Tool_atal_pension_Result_TotalFootnote", result.yearsOfContribution),
        },
      ],
      scenarios: [
        {
          name: t("Tool_atal_pension_Scenario_1k"),
          primaryLabel: t("Tool_atal_pension_Result_Monthly"),
          primaryValue: inr(lowPension.monthlyContribution),
          secondaryLabel: t("Tool_atal_pension_Result_Pension"),
          secondaryValue: inr(1000),
          variant: "best",
        },
        {
          name: t("Tool_atal_pension_Scenario_3k"),
          primaryLabel: t("Tool_atal_pension_Result_Monthly"),
          primaryValue: inr(midPension.monthlyContribution),
          secondaryLabel: t("Tool_atal_pension_Result_Total"),
          secondaryValue: inr(midPension.totalContribution),
          variant: "base",
        },
        {
          name: t("Tool_atal_pension_Scenario_Younger"),
          primaryLabel: t("Tool_atal_pension_Result_Monthly"),
          primaryValue: inr(younger.monthlyContribution),
          secondaryLabel: t("Tool_atal_pension_LabelAge"),
          secondaryValue: String(Math.max(APY_MIN_AGE, entryAge - 5)),
          variant: "worst",
        },
      ],
    };
  }, [entryAge, pension, t]);

  return (
    <ToolPageShell
      title={t(tool.titleKey)}
      subtitle={t("Tool_atal_pension_Subtitle")}
      description={t(tool.descriptionKey)}
      icon={tool.icon}
      educate={
        <>
          <div className="fy-info-box">
            <strong>{t("Common_WhatYouLearn")}</strong>
            <p>{t("Tool_atal_pension_LearnText")}</p>
          </div>
          <FormulaCard
            title={t("Common_Formula")}
            code={"Monthly contribution = APY chart(age, pension)\nTotal = monthly × 12 × (60 − age)"}
            note={t("Tool_atal_pension_FormulaNote")}
          />
        </>
      }
      below={<ToolInfoPanel info={atalPensionInfo(t)} />}
    >
      <div className="fy-form-card">
        <h3>{t("Common_YourInputs")}</h3>
        <div className="fy-field">
          <label>{t("Tool_atal_pension_LabelAge")}</label>
          <input
            type="number"
            min={APY_MIN_AGE}
            max={APY_MAX_AGE}
            step={1}
            inputMode="numeric"
            value={entryAge}
            onChange={(e) =>
              setEntryAge(
                Math.min(APY_MAX_AGE, Math.max(APY_MIN_AGE, Number(e.target.value) || APY_MIN_AGE)),
              )
            }
          />
          <p className="fy-field-hint">{t("Tool_atal_pension_AgeHint", APY_MIN_AGE, APY_MAX_AGE)}</p>
        </div>
        <div className="fy-field">
          <label>{t("Tool_atal_pension_LabelPension")}</label>
          <select
            value={pension}
            onChange={(e) => setPension(Number(e.target.value) as ApyPensionAmount)}
          >
            {APY_PENSION_OPTIONS.map((p) => (
              <option key={p} value={p}>
                {t("Tool_atal_pension_PensionOption", inr(p))}
              </option>
            ))}
          </select>
        </div>
        <button type="button" className="fy-btn-calc">
          {t("Common_Calculate")}
        </button>
      </div>

      {!detail.valid && (
        <div className="fy-info-box fy-tax-verdict">
          <strong>{t("Tool_atal_pension_InvalidTitle")}</strong>
          <p>{t("Tool_atal_pension_InvalidBody", APY_MIN_AGE, APY_MAX_AGE)}</p>
        </div>
      )}

      {detail.valid && (
        <div className="fy-info-box fy-tax-verdict">
          <strong>{t("Tool_atal_pension_SummaryTitle")}</strong>
          <p>
            {t(
              "Tool_atal_pension_SummaryBody",
              inr(detail.monthlyContribution),
              detail.yearsOfContribution,
              inr(pension),
            )}
          </p>
        </div>
      )}

      <ResultSummaryCards cards={summaryCards} />
      <ScenarioCompare
        title={t("Tool_atal_pension_ScenarioTitle")}
        subtitle={t("Tool_atal_pension_ScenarioSubtitle")}
        scenarios={scenarios}
      />
      <WorkedExample
        title={t("Tool_atal_pension_ExampleTitle")}
        subtitle={t("Tool_atal_pension_ExampleSubtitle")}
        steps={exampleSteps}
      />
    </ToolPageShell>
  );
}
