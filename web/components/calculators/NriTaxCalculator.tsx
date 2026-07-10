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
  calculateNriTax,
  type NriResidentialStatus,
} from "@/lib/finance/nriTax";
import { inr, percent } from "@/lib/finance/format";
import { getTool } from "@/lib/config/tools";
import { nriTaxInfo } from "@/lib/tool-page-content";

export function NriTaxCalculator() {
  const t = useT();
  const tool = getTool("nri-tax")!;

  const [status, setStatus] = useState<NriResidentialStatus>("nri");
  const [indiaIncome, setIndiaIncome] = useState(1_500_000);

  const exampleSteps = useMemo(
    () => [
      t("Tool_nri_tax_ExampleStep_1"),
      t("Tool_nri_tax_ExampleStep_2"),
      t("Tool_nri_tax_ExampleStep_3"),
      t("Tool_nri_tax_ExampleStep_4"),
      t("Tool_nri_tax_ExampleStep_5"),
    ],
    [t],
  );

  const { summaryCards, scenarios, result } = useMemo(() => {
    const result = calculateNriTax({ status, indiaIncome });
    const nri = calculateNriTax({ status: "nri", indiaIncome });
    const rnor = calculateNriTax({ status: "rnor", indiaIncome });
    const resident = calculateNriTax({ status: "resident", indiaIncome });

    return {
      result,
      summaryCards: [
        {
          label: t("Tool_nri_tax_Result_Tax"),
          value: inr(result.totalTax),
          footnote: t("Tool_nri_tax_Result_TaxFootnote"),
          variant: "primary" as const,
        },
        {
          label: t("Tool_nri_tax_Result_Income"),
          value: inr(result.indiaIncome),
          footnote: t("Tool_nri_tax_Result_IncomeFootnote"),
        },
        {
          label: t("Tool_nri_tax_Result_Effective"),
          value: percent(result.effectiveRate),
          footnote: t("Tool_nri_tax_Result_EffectiveFootnote"),
        },
      ],
      scenarios: [
        {
          name: t("Tool_nri_tax_Scenario_Nri"),
          primaryLabel: t("Tool_nri_tax_Result_Tax"),
          primaryValue: inr(nri.totalTax),
          secondaryLabel: t("Tool_nri_tax_Result_Effective"),
          secondaryValue: percent(nri.effectiveRate),
          variant: "best",
        },
        {
          name: t("Tool_nri_tax_Scenario_Rnor"),
          primaryLabel: t("Tool_nri_tax_Result_Tax"),
          primaryValue: inr(rnor.totalTax),
          secondaryLabel: t("Tool_nri_tax_Result_Effective"),
          secondaryValue: percent(rnor.effectiveRate),
          variant: "base",
        },
        {
          name: t("Tool_nri_tax_Scenario_Resident"),
          primaryLabel: t("Tool_nri_tax_Result_Tax"),
          primaryValue: inr(resident.totalTax),
          secondaryLabel: t("Tool_nri_tax_ForeignNote"),
          secondaryValue: resident.foreignIncomeTaxableInIndia
            ? t("Tool_nri_tax_ForeignYes")
            : t("Tool_nri_tax_ForeignNo"),
          variant: "worst",
        },
      ],
    };
  }, [status, indiaIncome, t]);

  return (
    <ToolPageShell
      title={t(tool.titleKey)}
      subtitle={t("Tool_nri_tax_Subtitle")}
      description={t(tool.descriptionKey)}
      icon={tool.icon}
      educate={
        <>
          <div className="fy-info-box">
            <strong>{t("Common_WhatYouLearn")}</strong>
            <p>{t("Tool_nri_tax_LearnText")}</p>
          </div>
          <FormulaCard
            title={t("Common_Formula")}
            code={"Status → tax scope\nTax ≈ slab(India income) + 4% cess\n(simplified new-regime style)"}
            note={t("Tool_nri_tax_FormulaNote")}
          />
        </>
      }
      below={<ToolInfoPanel info={nriTaxInfo(t)} />}
    >
      <div className="fy-form-card">
        <h3>{t("Common_YourInputs")}</h3>
        <div className="fy-field">
          <label>{t("Tool_nri_tax_LabelStatus")}</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as NriResidentialStatus)}
          >
            <option value="nri">{t("Tool_nri_tax_Status_Nri")}</option>
            <option value="rnor">{t("Tool_nri_tax_Status_Rnor")}</option>
            <option value="resident">{t("Tool_nri_tax_Status_Resident")}</option>
          </select>
          <p className="fy-field-hint">{t("Tool_nri_tax_StatusHint")}</p>
        </div>
        <div className="fy-field">
          <label>{t("Tool_nri_tax_LabelIncome")}</label>
          <input
            type="number"
            min={0}
            step={50000}
            inputMode="decimal"
            value={indiaIncome}
            onChange={(e) => setIndiaIncome(Math.max(0, Number(e.target.value) || 0))}
          />
          <p className="fy-field-hint">{t("Tool_nri_tax_IncomeHint")}</p>
        </div>
        <button type="button" className="fy-btn-calc">
          {t("Common_Calculate")}
        </button>
      </div>

      <div className="fy-info-box fy-tax-verdict">
        <strong>{t("Tool_nri_tax_VerdictTitle")}</strong>
        <p>
          {t(
            "Tool_nri_tax_VerdictNote",
            t(`Tool_nri_tax_Status_${status === "nri" ? "Nri" : status === "rnor" ? "Rnor" : "Resident"}`),
            inr(result.totalTax),
          )}
        </p>
        <p style={{ marginTop: "0.5rem" }}>
          {result.foreignIncomeTaxableInIndia
            ? t("Tool_nri_tax_VerdictResident")
            : t("Tool_nri_tax_VerdictNri")}
        </p>
      </div>

      <ResultSummaryCards cards={summaryCards} />
      <ScenarioCompare
        title={t("Tool_nri_tax_ScenarioTitle")}
        subtitle={t("Tool_nri_tax_ScenarioSubtitle")}
        scenarios={scenarios}
      />
      <WorkedExample
        title={t("Tool_nri_tax_ExampleTitle")}
        subtitle={t("Tool_nri_tax_ExampleSubtitle")}
        steps={exampleSteps}
      />
    </ToolPageShell>
  );
}
