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
import { calculateGratuity, type GratuityCovered } from "@/lib/finance/gratuity";
import { inr } from "@/lib/finance/format";
import { getTool } from "@/lib/config/tools";
import { gratuityInfo } from "@/lib/tool-page-content";

export function GratuityCalculator() {
  const t = useT();
  const tool = getTool("gratuity")!;

  const [salary, setSalary] = useState(50_000);
  const [years, setYears] = useState(10);
  const [covered, setCovered] = useState<GratuityCovered>("act");
  const [isGovernment, setIsGovernment] = useState(false);

  const exampleSteps = useMemo(
    () => [
      t("Tool_gratuity_ExampleStep_1"),
      t("Tool_gratuity_ExampleStep_2"),
      t("Tool_gratuity_ExampleStep_3"),
      t("Tool_gratuity_ExampleStep_4"),
      t("Tool_gratuity_ExampleStep_5"),
    ],
    [t],
  );

  const { summaryCards, scenarios } = useMemo(() => {
    const result = calculateGratuity({
      lastDrawnSalary: Math.max(0, salary),
      yearsOfService: Math.max(0, years),
      covered,
      isGovernment,
    });
    const shorter = calculateGratuity({
      lastDrawnSalary: Math.max(0, salary),
      yearsOfService: Math.max(5, years - 3),
      covered,
      isGovernment,
    });
    const longer = calculateGratuity({
      lastDrawnSalary: Math.max(0, salary),
      yearsOfService: years + 5,
      covered,
      isGovernment,
    });

    return {
      summaryCards: [
        {
          label: t("Tool_gratuity_Result_Amount"),
          value: inr(result.gratuity),
          footnote: t("Tool_gratuity_Result_AmountFootnote", result.formulaDivisor),
          variant: "primary" as const,
        },
        {
          label: t("Tool_gratuity_Result_Exempt"),
          value: inr(result.exempt),
          footnote: t("Tool_gratuity_Result_ExemptFootnote"),
          variant: "secure" as const,
        },
        {
          label: t("Tool_gratuity_Result_Taxable"),
          value: inr(result.taxable),
          footnote: t("Tool_gratuity_Result_TaxableFootnote"),
          variant: result.taxable > 0 ? ("volatile" as const) : ("default" as const),
        },
      ],
      scenarios: [
        {
          name: t("Tool_gratuity_Scenario_FewerYears"),
          primaryLabel: t("Tool_gratuity_Result_Amount"),
          primaryValue: inr(shorter.gratuity),
          secondaryLabel: t("Common_Label_Years"),
          secondaryValue: String(Math.max(5, years - 3)),
          variant: "worst",
        },
        {
          name: t("Common_Scenario_Base"),
          primaryLabel: t("Tool_gratuity_Result_Amount"),
          primaryValue: inr(result.gratuity),
          secondaryLabel: t("Tool_gratuity_Result_Exempt"),
          secondaryValue: inr(result.exempt),
          variant: "base",
        },
        {
          name: t("Tool_gratuity_Scenario_MoreYears"),
          primaryLabel: t("Tool_gratuity_Result_Amount"),
          primaryValue: inr(longer.gratuity),
          secondaryLabel: t("Common_Label_Years"),
          secondaryValue: String(years + 5),
          variant: "best",
        },
      ],
    };
  }, [salary, years, covered, isGovernment, t]);

  return (
    <ToolPageShell
      title={t(tool.titleKey)}
      subtitle={t("Tool_gratuity_Subtitle")}
      description={t(tool.descriptionKey)}
      icon={tool.icon}
      educate={
        <>
          <div className="fy-info-box">
            <strong>{t("Common_WhatYouLearn")}</strong>
            <p>{t("Tool_gratuity_LearnText")}</p>
          </div>
          <FormulaCard
            title={t("Common_Formula")}
            code={"Gratuity = (Salary × 15 × Years) / 26\n(Act-covered employees)"}
            note={t("Tool_gratuity_FormulaNote")}
          />
        </>
      }
      below={<ToolInfoPanel info={gratuityInfo(t)} />}
    >
      <div className="fy-form-card">
        <h3>{t("Common_YourInputs")}</h3>
        <div className="fy-field">
          <label>{t("Tool_gratuity_LabelSalary")}</label>
          <input
            type="number"
            min={0}
            step={1000}
            inputMode="decimal"
            value={salary}
            onChange={(e) => setSalary(Math.max(0, Number(e.target.value) || 0))}
          />
          <p className="fy-field-hint">{t("Tool_gratuity_SalaryHint")}</p>
        </div>
        <div className="fy-field">
          <label>{t("Tool_gratuity_LabelYears")}</label>
          <input
            type="number"
            min={0}
            max={50}
            step={0.5}
            inputMode="decimal"
            value={years}
            onChange={(e) => setYears(Math.max(0, Number(e.target.value) || 0))}
          />
          <p className="fy-field-hint">{t("Tool_gratuity_YearsHint")}</p>
        </div>
        <div className="fy-field">
          <label>{t("Tool_gratuity_LabelCovered")}</label>
          <select value={covered} onChange={(e) => setCovered(e.target.value as GratuityCovered)}>
            <option value="act">{t("Tool_gratuity_Covered_Act")}</option>
            <option value="other">{t("Tool_gratuity_Covered_Other")}</option>
          </select>
        </div>
        <div className="fy-field">
          <label>
            <input type="checkbox" checked={isGovernment} onChange={(e) => setIsGovernment(e.target.checked)} />{" "}
            {t("Tool_gratuity_LabelGovernment")}
          </label>
        </div>
        <button type="button" className="fy-btn-calc">
          {t("Common_Calculate")}
        </button>
      </div>

      <ResultSummaryCards cards={summaryCards} />
      <ScenarioCompare
        title={t("Tool_gratuity_ScenarioTitle")}
        subtitle={t("Tool_gratuity_ScenarioSubtitle")}
        scenarios={scenarios}
      />
      <WorkedExample title={t("Tool_gratuity_ExampleTitle")} subtitle={t("Tool_gratuity_ExampleSubtitle")} steps={exampleSteps} />
    </ToolPageShell>
  );
}
