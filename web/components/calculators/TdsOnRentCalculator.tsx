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
  calculateTdsOnRent,
  TDS_RENT_MONTHLY_THRESHOLD,
  TDS_RENT_RATE_PERCENT,
} from "@/lib/finance/tdsOnRent";
import { inr, percent } from "@/lib/finance/format";
import { getTool } from "@/lib/config/tools";
import { tdsOnRentInfo } from "@/lib/tool-page-content";

export function TdsOnRentCalculator() {
  const t = useT();
  const tool = getTool("tds-on-rent")!;

  const [monthlyRent, setMonthlyRent] = useState(60_000);
  const [ratePercent, setRatePercent] = useState(TDS_RENT_RATE_PERCENT);

  const exampleSteps = useMemo(
    () => [
      t("Tool_tds_on_rent_ExampleStep_1"),
      t("Tool_tds_on_rent_ExampleStep_2"),
      t("Tool_tds_on_rent_ExampleStep_3"),
      t("Tool_tds_on_rent_ExampleStep_4"),
      t("Tool_tds_on_rent_ExampleStep_5"),
    ],
    [t],
  );

  const { summaryCards, scenarios, detail } = useMemo(() => {
    const result = calculateTdsOnRent({ monthlyRent, ratePercent });
    const below = calculateTdsOnRent({
      monthlyRent: TDS_RENT_MONTHLY_THRESHOLD,
      ratePercent,
    });
    const higher = calculateTdsOnRent({
      monthlyRent: monthlyRent * 1.25,
      ratePercent,
    });

    return {
      detail: result,
      summaryCards: [
        {
          label: t("Tool_tds_on_rent_Result_MonthlyTds"),
          value: inr(result.monthlyTds),
          footnote: t("Tool_tds_on_rent_Result_MonthlyTdsFootnote", percent(result.ratePercent, 0)),
          variant: "primary" as const,
        },
        {
          label: t("Tool_tds_on_rent_Result_AnnualTds"),
          value: inr(result.annualTds),
          footnote: t("Tool_tds_on_rent_Result_AnnualTdsFootnote"),
          variant: "secure" as const,
        },
        {
          label: t("Tool_tds_on_rent_Result_AnnualRent"),
          value: inr(result.annualRent),
          footnote: t("Tool_tds_on_rent_Result_AnnualRentFootnote"),
        },
      ],
      scenarios: [
        {
          name: t("Tool_tds_on_rent_Scenario_Below"),
          primaryLabel: t("Tool_tds_on_rent_Result_MonthlyTds"),
          primaryValue: inr(below.monthlyTds),
          secondaryLabel: t("Tool_tds_on_rent_Result_AnnualTds"),
          secondaryValue: inr(below.annualTds),
          variant: "best",
        },
        {
          name: t("Common_Scenario_Base"),
          primaryLabel: t("Tool_tds_on_rent_Result_MonthlyTds"),
          primaryValue: inr(result.monthlyTds),
          secondaryLabel: t("Tool_tds_on_rent_Result_AnnualTds"),
          secondaryValue: inr(result.annualTds),
          variant: "base",
        },
        {
          name: t("Tool_tds_on_rent_Scenario_Higher"),
          primaryLabel: t("Tool_tds_on_rent_Result_MonthlyTds"),
          primaryValue: inr(higher.monthlyTds),
          secondaryLabel: t("Tool_tds_on_rent_Result_AnnualTds"),
          secondaryValue: inr(higher.annualTds),
          variant: "worst",
        },
      ],
    };
  }, [monthlyRent, ratePercent, t]);

  return (
    <ToolPageShell
      title={t(tool.titleKey)}
      subtitle={t("Tool_tds_on_rent_Subtitle")}
      description={t(tool.descriptionKey)}
      icon={tool.icon}
      educate={
        <>
          <div className="fy-info-box">
            <strong>{t("Common_WhatYouLearn")}</strong>
            <p>{t("Tool_tds_on_rent_LearnText")}</p>
          </div>
          <FormulaCard
            title={t("Common_Formula")}
            code={"If monthly rent > ₹50,000 → TDS = rent × 2%\nAnnual TDS = monthly TDS × 12\nDeposit via Form 26QC"}
            note={t("Tool_tds_on_rent_FormulaNote")}
          />
        </>
      }
      below={<ToolInfoPanel info={tdsOnRentInfo(t)} />}
    >
      <div className="fy-form-card">
        <h3>{t("Common_YourInputs")}</h3>
        <div className="fy-field">
          <label>{t("Tool_tds_on_rent_LabelRent")}</label>
          <input
            type="number"
            min={0}
            step={1000}
            inputMode="decimal"
            value={monthlyRent}
            onChange={(e) => setMonthlyRent(Math.max(0, Number(e.target.value) || 0))}
          />
          <p className="fy-field-hint">
            {t("Tool_tds_on_rent_RentHint", inr(TDS_RENT_MONTHLY_THRESHOLD))}
          </p>
        </div>
        <div className="fy-field">
          <label>{t("Tool_tds_on_rent_LabelRate")}</label>
          <input
            type="number"
            min={0}
            max={100}
            step={0.1}
            inputMode="decimal"
            value={ratePercent}
            onChange={(e) => setRatePercent(Math.max(0, Number(e.target.value) || 0))}
          />
          <p className="fy-field-hint">{t("Tool_tds_on_rent_RateHint")}</p>
        </div>
        <button type="button" className="fy-btn-calc">
          {t("Common_Calculate")}
        </button>
      </div>

      <div className="fy-info-box fy-tax-verdict">
        <strong>{t("Tool_tds_on_rent_StatusTitle")}</strong>
        <p>
          {detail.noteKey === "below_threshold"
            ? t("Tool_tds_on_rent_Status_Below", inr(detail.monthlyThreshold))
            : t(
                "Tool_tds_on_rent_Status_Applied",
                percent(detail.ratePercent, 0),
                inr(detail.monthlyTds),
                inr(detail.annualTds),
              )}
        </p>
        {detail.applicable && <p className="fy-field-hint">{t("Tool_tds_on_rent_Form26qcNote")}</p>}
      </div>

      <ResultSummaryCards cards={summaryCards} />
      <ScenarioCompare
        title={t("Tool_tds_on_rent_ScenarioTitle")}
        subtitle={t("Tool_tds_on_rent_ScenarioSubtitle")}
        scenarios={scenarios}
      />
      <WorkedExample
        title={t("Tool_tds_on_rent_ExampleTitle")}
        subtitle={t("Tool_tds_on_rent_ExampleSubtitle")}
        steps={exampleSteps}
      />
    </ToolPageShell>
  );
}
