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
import { calculateSection80gg } from "@/lib/finance/section80gg";
import { inr } from "@/lib/finance/format";
import { getTool } from "@/lib/config/tools";
import { section80ggInfo } from "@/lib/tool-page-content";

export function Section80ggCalculator() {
  const t = useT();
  const tool = getTool("80gg-rent-deduction")!;

  const [monthlyRent, setMonthlyRent] = useState(20_000);
  const [ati, setAti] = useState(8_00_000);
  const [noHra, setNoHra] = useState(true);

  const exampleSteps = useMemo(
    () => [
      t("Tool_80gg_rent_deduction_ExampleStep_1"),
      t("Tool_80gg_rent_deduction_ExampleStep_2"),
      t("Tool_80gg_rent_deduction_ExampleStep_3"),
      t("Tool_80gg_rent_deduction_ExampleStep_4"),
      t("Tool_80gg_rent_deduction_ExampleStep_5"),
    ],
    [t],
  );

  const { summaryCards, scenarios, result } = useMemo(() => {
    const rentAnnual = monthlyRent * 12;
    const result = calculateSection80gg({
      rentPaidAnnual: rentAnnual,
      adjustedTotalIncome: ati,
      noHra,
    });
    const lowerRent = calculateSection80gg({
      rentPaidAnnual: Math.round(rentAnnual * 0.7),
      adjustedTotalIncome: ati,
      noHra,
    });
    const higherAti = calculateSection80gg({
      rentPaidAnnual: rentAnnual,
      adjustedTotalIncome: Math.round(ati * 1.3),
      noHra,
    });

    return {
      result,
      summaryCards: [
        {
          label: t("Tool_80gg_rent_deduction_Result_Deduction"),
          value: inr(result.deduction),
          footnote: result.eligible
            ? t("Tool_80gg_rent_deduction_Result_DeductionFootnote")
            : t("Tool_80gg_rent_deduction_Result_Ineligible"),
          variant: "primary" as const,
        },
        {
          label: t("Tool_80gg_rent_deduction_Result_Cap"),
          value: inr(result.limitMonthlyCap),
          footnote: t("Tool_80gg_rent_deduction_Result_CapFootnote"),
          variant: "secure" as const,
        },
        {
          label: t("Tool_80gg_rent_deduction_Result_Ati25"),
          value: inr(result.limit25PercentAti),
          footnote: t("Tool_80gg_rent_deduction_Result_Ati25Footnote"),
        },
      ],
      scenarios: [
        {
          name: t("Tool_80gg_rent_deduction_Scenario_LowerRent"),
          primaryLabel: t("Tool_80gg_rent_deduction_Result_Deduction"),
          primaryValue: inr(lowerRent.deduction),
          secondaryLabel: t("Tool_80gg_rent_deduction_Result_RentMinus"),
          secondaryValue: inr(lowerRent.limitRentMinus10Ati),
          variant: "worst" as const,
        },
        {
          name: t("Common_Scenario_Base"),
          primaryLabel: t("Tool_80gg_rent_deduction_Result_Deduction"),
          primaryValue: inr(result.deduction),
          secondaryLabel: t("Tool_80gg_rent_deduction_Result_RentMinus"),
          secondaryValue: inr(result.limitRentMinus10Ati),
          variant: "base" as const,
        },
        {
          name: t("Tool_80gg_rent_deduction_Scenario_HigherAti"),
          primaryLabel: t("Tool_80gg_rent_deduction_Result_Deduction"),
          primaryValue: inr(higherAti.deduction),
          secondaryLabel: t("Tool_80gg_rent_deduction_Result_Ati25"),
          secondaryValue: inr(higherAti.limit25PercentAti),
          variant: "best" as const,
        },
      ],
    };
  }, [monthlyRent, ati, noHra, t]);

  return (
    <ToolPageShell
      title={t(tool.titleKey)}
      subtitle={t("Tool_80gg_rent_deduction_Subtitle")}
      description={t(tool.descriptionKey)}
      icon={tool.icon}
      educate={
        <>
          <div className="fy-info-box">
            <strong>{t("Common_WhatYouLearn")}</strong>
            <p>{t("Tool_80gg_rent_deduction_LearnText")}</p>
          </div>
          <FormulaCard
            title={t("Common_Formula")}
            code={
              "Deduction = least of:\n1) ₹5,000 × 12\n2) 25% of ATI\n3) Rent − 10% of ATI\n(No HRA; old regime)"
            }
            note={t("Tool_80gg_rent_deduction_FormulaNote")}
          />
        </>
      }
      below={<ToolInfoPanel info={section80ggInfo(t)} />}
    >
      <div className="fy-form-card">
        <h3>{t("Common_YourInputs")}</h3>
        <div className="fy-field">
          <label>{t("Tool_80gg_rent_deduction_LabelRent")}</label>
          <input
            type="number"
            min={0}
            step={1000}
            inputMode="decimal"
            value={monthlyRent}
            onChange={(e) => setMonthlyRent(Math.max(0, Number(e.target.value) || 0))}
          />
        </div>
        <div className="fy-field">
          <label>{t("Tool_80gg_rent_deduction_LabelAti")}</label>
          <input
            type="number"
            min={0}
            step={10000}
            inputMode="decimal"
            value={ati}
            onChange={(e) => setAti(Math.max(0, Number(e.target.value) || 0))}
          />
          <p className="fy-field-hint">{t("Tool_80gg_rent_deduction_AtiHint")}</p>
        </div>
        <div className="fy-field">
          <label>{t("Tool_80gg_rent_deduction_LabelNoHra")}</label>
          <select value={noHra ? "yes" : "no"} onChange={(e) => setNoHra(e.target.value === "yes")}>
            <option value="yes">{t("Tool_80gg_rent_deduction_NoHra_Yes")}</option>
            <option value="no">{t("Tool_80gg_rent_deduction_NoHra_No")}</option>
          </select>
        </div>
        <button type="button" className="fy-btn-calc">
          {t("Common_Calculate")}
        </button>
      </div>

      <ResultSummaryCards cards={summaryCards} />
      {!result.eligible ? (
        <div className="fy-info-box">
          <p>{t("Tool_80gg_rent_deduction_VerdictIneligible")}</p>
        </div>
      ) : null}
      <ScenarioCompare
        title={t("Tool_80gg_rent_deduction_ScenarioTitle")}
        subtitle={t("Tool_80gg_rent_deduction_ScenarioSubtitle")}
        scenarios={scenarios}
      />
      <WorkedExample
        title={t("Tool_80gg_rent_deduction_ExampleTitle")}
        subtitle={t("Tool_80gg_rent_deduction_ExampleSubtitle")}
        steps={exampleSteps}
      />
    </ToolPageShell>
  );
}
