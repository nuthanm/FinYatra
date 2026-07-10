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
import { calculateAgriculturalIncome } from "@/lib/finance/agriculturalIncome";
import { inr } from "@/lib/finance/format";
import { getTool } from "@/lib/config/tools";
import { agriculturalIncomeInfo } from "@/lib/tool-page-content";

export function AgriculturalIncomeCalculator() {
  const t = useT();
  const tool = getTool("agricultural-income")!;

  const [agri, setAgri] = useState(2_00_000);
  const [other, setOther] = useState(8_00_000);

  const exampleSteps = useMemo(
    () => [
      t("Tool_agricultural_income_ExampleStep_1"),
      t("Tool_agricultural_income_ExampleStep_2"),
      t("Tool_agricultural_income_ExampleStep_3"),
      t("Tool_agricultural_income_ExampleStep_4"),
      t("Tool_agricultural_income_ExampleStep_5"),
    ],
    [t],
  );

  const { summaryCards, scenarios } = useMemo(() => {
    const result = calculateAgriculturalIncome({
      agriculturalIncome: agri,
      otherIncome: other,
    });
    const lessAgri = calculateAgriculturalIncome({
      agriculturalIncome: Math.max(0, agri - 1_00_000),
      otherIncome: other,
    });
    const moreAgri = calculateAgriculturalIncome({
      agriculturalIncome: agri + 1_00_000,
      otherIncome: other,
    });

    return {
      summaryCards: [
        {
          label: t("Tool_agricultural_income_Result_Integration"),
          value: inr(result.taxDueToIntegration),
          footnote: t("Tool_agricultural_income_Result_IntegrationFootnote"),
          variant: "primary" as const,
        },
        {
          label: t("Tool_agricultural_income_Result_OtherAlone"),
          value: inr(result.taxOnOtherAlone),
          footnote: t("Tool_agricultural_income_Result_OtherAloneFootnote"),
        },
        {
          label: t("Tool_agricultural_income_Result_Total"),
          value: inr(result.totalIncome),
          footnote: t("Tool_agricultural_income_Result_TotalFootnote"),
          variant: "secure" as const,
        },
      ],
      scenarios: [
        {
          name: t("Tool_agricultural_income_Scenario_Less"),
          primaryLabel: t("Tool_agricultural_income_Result_Integration"),
          primaryValue: inr(lessAgri.taxDueToIntegration),
          secondaryLabel: t("Tool_agricultural_income_LabelAgri"),
          secondaryValue: inr(lessAgri.agriculturalIncome),
          variant: "best" as const,
        },
        {
          name: t("Common_Scenario_Base"),
          primaryLabel: t("Tool_agricultural_income_Result_Integration"),
          primaryValue: inr(result.taxDueToIntegration),
          secondaryLabel: t("Tool_agricultural_income_Result_OtherAlone"),
          secondaryValue: inr(result.taxOnOtherAlone),
          variant: "base" as const,
        },
        {
          name: t("Tool_agricultural_income_Scenario_More"),
          primaryLabel: t("Tool_agricultural_income_Result_Integration"),
          primaryValue: inr(moreAgri.taxDueToIntegration),
          secondaryLabel: t("Tool_agricultural_income_LabelAgri"),
          secondaryValue: inr(moreAgri.agriculturalIncome),
          variant: "worst" as const,
        },
      ],
    };
  }, [agri, other, t]);

  return (
    <ToolPageShell
      title={t(tool.titleKey)}
      subtitle={t("Tool_agricultural_income_Subtitle")}
      description={t(tool.descriptionKey)}
      icon={tool.icon}
      educate={
        <>
          <div className="fy-info-box">
            <strong>{t("Common_WhatYouLearn")}</strong>
            <p>{t("Tool_agricultural_income_LearnText")}</p>
          </div>
          <FormulaCard
            title={t("Common_Formula")}
            code={
              "tax(total) − tax(agri + exemption)\n≈ extra tax from rate bump\n(agri itself stays exempt)"
            }
            note={t("Tool_agricultural_income_FormulaNote")}
          />
        </>
      }
      below={<ToolInfoPanel info={agriculturalIncomeInfo(t)} />}
    >
      <div className="fy-form-card">
        <h3>{t("Common_YourInputs")}</h3>
        <div className="fy-field">
          <label>{t("Tool_agricultural_income_LabelAgri")}</label>
          <input
            type="number"
            min={0}
            step={10000}
            inputMode="decimal"
            value={agri}
            onChange={(e) => setAgri(Math.max(0, Number(e.target.value) || 0))}
          />
        </div>
        <div className="fy-field">
          <label>{t("Tool_agricultural_income_LabelOther")}</label>
          <input
            type="number"
            min={0}
            step={10000}
            inputMode="decimal"
            value={other}
            onChange={(e) => setOther(Math.max(0, Number(e.target.value) || 0))}
          />
          <p className="fy-field-hint">{t("Tool_agricultural_income_OtherHint")}</p>
        </div>
        <button type="button" className="fy-btn-calc">
          {t("Common_Calculate")}
        </button>
      </div>

      <ResultSummaryCards cards={summaryCards} />
      <ScenarioCompare
        title={t("Tool_agricultural_income_ScenarioTitle")}
        subtitle={t("Tool_agricultural_income_ScenarioSubtitle")}
        scenarios={scenarios}
      />
      <WorkedExample
        title={t("Tool_agricultural_income_ExampleTitle")}
        subtitle={t("Tool_agricultural_income_ExampleSubtitle")}
        steps={exampleSteps}
      />
    </ToolPageShell>
  );
}
