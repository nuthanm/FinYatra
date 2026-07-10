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
import { calculateTds, TDS_SECTIONS, type TdsSectionId } from "@/lib/finance/tds";
import { inr, percent } from "@/lib/finance/format";
import { getTool } from "@/lib/config/tools";
import { tdsInfo } from "@/lib/tool-page-content";

export function TdsCalculator() {
  const t = useT();
  const tool = getTool("tds")!;

  const [sectionId, setSectionId] = useState<TdsSectionId>("194A");
  const [amount, setAmount] = useState(100_000);
  const [panAvailable, setPanAvailable] = useState(true);
  const [seniorCitizen, setSeniorCitizen] = useState(false);
  const [estimatedAnnualTax, setEstimatedAnnualTax] = useState(120_000);

  const exampleSteps = useMemo(
    () => [
      t("Tool_tds_ExampleStep_1"),
      t("Tool_tds_ExampleStep_2"),
      t("Tool_tds_ExampleStep_3"),
      t("Tool_tds_ExampleStep_4"),
      t("Tool_tds_ExampleStep_5"),
    ],
    [t],
  );

  const { summaryCards, scenarios, detail } = useMemo(() => {
    const result = calculateTds({
      sectionId,
      amount,
      panAvailable,
      seniorCitizen,
      estimatedAnnualTax,
    });
    const noPan = calculateTds({
      sectionId,
      amount,
      panAvailable: false,
      seniorCitizen,
      estimatedAnnualTax,
    });
    const withPan = calculateTds({
      sectionId,
      amount,
      panAvailable: true,
      seniorCitizen,
      estimatedAnnualTax,
    });

    return {
      detail: result,
      summaryCards: [
        {
          label: t("Tool_tds_Result_Tds"),
          value: inr(result.tdsAmount),
          footnote:
            sectionId === "192"
              ? t("Tool_tds_Result_TdsFootnoteSalary")
              : t("Tool_tds_Result_TdsFootnote", percent(result.ratePercent, 0)),
          variant: "primary" as const,
        },
        {
          label: t("Tool_tds_Result_Net"),
          value: inr(result.netAmount),
          footnote: t("Tool_tds_Result_NetFootnote"),
          variant: "secure" as const,
        },
        {
          label: t("Tool_tds_Result_Threshold"),
          value: sectionId === "192" ? "—" : inr(result.threshold),
          footnote: t(`Tool_tds_ThresholdKind_${sectionId === "192" ? "none" : "show"}`),
        },
      ],
      scenarios: [
        {
          name: t("Tool_tds_Scenario_WithPan"),
          primaryLabel: t("Tool_tds_Result_Tds"),
          primaryValue: inr(withPan.tdsAmount),
          secondaryLabel: t("Tool_tds_Result_Net"),
          secondaryValue: inr(withPan.netAmount),
          variant: "best",
        },
        {
          name: t("Common_Scenario_Base"),
          primaryLabel: t("Tool_tds_Result_Tds"),
          primaryValue: inr(result.tdsAmount),
          secondaryLabel: t("Tool_tds_LabelSection"),
          secondaryValue: sectionId,
          variant: "base",
        },
        {
          name: t("Tool_tds_Scenario_NoPan"),
          primaryLabel: t("Tool_tds_Result_Tds"),
          primaryValue: inr(noPan.tdsAmount),
          secondaryLabel: t("Tool_tds_Result_Net"),
          secondaryValue: inr(noPan.netAmount),
          variant: "worst",
        },
      ],
    };
  }, [sectionId, amount, panAvailable, seniorCitizen, estimatedAnnualTax, t]);

  return (
    <ToolPageShell
      title={t(tool.titleKey)}
      subtitle={t("Tool_tds_Subtitle")}
      description={t(tool.descriptionKey)}
      icon={tool.icon}
      educate={
        <>
          <div className="fy-info-box">
            <strong>{t("Common_WhatYouLearn")}</strong>
            <p>{t("Tool_tds_LearnText")}</p>
          </div>
          <FormulaCard
            title={t("Common_Formula")}
            code={"If amount > threshold → TDS = amount × rate%\nNo PAN → often 20%"}
            note={t("Tool_tds_FormulaNote")}
          />
        </>
      }
      below={<ToolInfoPanel info={tdsInfo(t)} />}
    >
      <div className="fy-form-card">
        <h3>{t("Common_YourInputs")}</h3>
        <div className="fy-field">
          <label>{t("Tool_tds_LabelSection")}</label>
          <select value={sectionId} onChange={(e) => setSectionId(e.target.value as TdsSectionId)}>
            {TDS_SECTIONS.map((s) => (
              <option key={s.id} value={s.id}>
                {t(`Tool_tds_Section_${s.id}`)}
              </option>
            ))}
          </select>
        </div>
        <div className="fy-field">
          <label>
            {sectionId === "192" ? t("Tool_tds_LabelMonthlySalary") : t("Tool_tds_LabelAmount")}
          </label>
          <input
            type="number"
            min={0}
            step={1000}
            inputMode="decimal"
            value={amount}
            onChange={(e) => setAmount(Math.max(0, Number(e.target.value) || 0))}
          />
          <p className="fy-field-hint">{t(`Tool_tds_AmountHint_${sectionId}`)}</p>
        </div>
        {sectionId === "192" && (
          <div className="fy-field">
            <label>{t("Tool_tds_LabelAnnualTax")}</label>
            <input
              type="number"
              min={0}
              step={1000}
              inputMode="decimal"
              value={estimatedAnnualTax}
              onChange={(e) => setEstimatedAnnualTax(Math.max(0, Number(e.target.value) || 0))}
            />
            <p className="fy-field-hint">{t("Tool_tds_AnnualTaxHint")}</p>
          </div>
        )}
        {sectionId !== "192" && (
          <div className="fy-field">
            <label>
              <input
                type="checkbox"
                checked={panAvailable}
                onChange={(e) => setPanAvailable(e.target.checked)}
              />{" "}
              {t("Tool_tds_LabelPan")}
            </label>
          </div>
        )}
        {sectionId === "194A" && (
          <div className="fy-field">
            <label>
              <input
                type="checkbox"
                checked={seniorCitizen}
                onChange={(e) => setSeniorCitizen(e.target.checked)}
              />{" "}
              {t("Tool_tds_LabelSenior")}
            </label>
            <p className="fy-field-hint">{t("Tool_tds_SeniorHint")}</p>
          </div>
        )}
        <button type="button" className="fy-btn-calc">
          {t("Common_Calculate")}
        </button>
      </div>

      <div className="fy-info-box fy-tax-verdict">
        <strong>{t("Tool_tds_StatusTitle")}</strong>
        <p>
          {detail.noteKey === "below_threshold"
            ? t("Tool_tds_Status_Below", inr(detail.threshold))
            : detail.noteKey === "salary_estimate"
              ? t("Tool_tds_Status_Salary", inr(detail.tdsAmount))
              : t("Tool_tds_Status_Applied", percent(detail.ratePercent, 0), inr(detail.tdsAmount))}
        </p>
      </div>

      <ResultSummaryCards cards={summaryCards} />
      <ScenarioCompare
        title={t("Tool_tds_ScenarioTitle")}
        subtitle={t("Tool_tds_ScenarioSubtitle")}
        scenarios={scenarios}
      />
      <WorkedExample
        title={t("Tool_tds_ExampleTitle")}
        subtitle={t("Tool_tds_ExampleSubtitle")}
        steps={exampleSteps}
      />
    </ToolPageShell>
  );
}
