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
import { calculateSection80g } from "@/lib/finance/section80g";
import { inr, percent } from "@/lib/finance/format";
import { getTool } from "@/lib/config/tools";
import { section80gInfo } from "@/lib/tool-page-content";

export function Section80gDonationCalculator() {
  const t = useT();
  const tool = getTool("80g-donation")!;

  const [donation, setDonation] = useState(50_000);
  const [eligibility, setEligibility] = useState<50 | 100>(50);
  const [applyLimit, setApplyLimit] = useState(true);
  const [income, setIncome] = useState(1_200_000);
  const [taxSlab, setTaxSlab] = useState(30);

  const exampleSteps = useMemo(
    () => [
      t("Tool_80g_donation_ExampleStep_1"),
      t("Tool_80g_donation_ExampleStep_2"),
      t("Tool_80g_donation_ExampleStep_3"),
      t("Tool_80g_donation_ExampleStep_4"),
      t("Tool_80g_donation_ExampleStep_5"),
    ],
    [t],
  );

  const { summaryCards, scenarios } = useMemo(() => {
    const input = {
      donationAmount: donation,
      eligibilityPercent: eligibility,
      applyIncomeLimit: applyLimit,
      annualIncome: income,
      taxSlabPercent: taxSlab,
    };
    const result = calculateSection80g(input);
    const full = calculateSection80g({ ...input, eligibilityPercent: 100 });
    const half = calculateSection80g({ ...input, eligibilityPercent: 50 });
    const noLimit = calculateSection80g({ ...input, applyIncomeLimit: false });

    return {
      summaryCards: [
        {
          label: t("Tool_80g_donation_Result_Deduction"),
          value: inr(result.eligibleDeduction),
          footnote: t(
            "Tool_80g_donation_Result_DeductionFootnote",
            percent(eligibility, 0),
            applyLimit ? t("Tool_80g_donation_WithLimit") : t("Tool_80g_donation_NoLimit"),
          ),
          variant: "primary" as const,
        },
        {
          label: t("Tool_80g_donation_Result_Saving"),
          value: inr(result.estimatedTaxSaving),
          footnote: t("Tool_80g_donation_Result_SavingFootnote", percent(taxSlab, 0)),
          variant: "secure" as const,
        },
        {
          label: t("Tool_80g_donation_Result_Capped"),
          value: inr(result.cappedDonation),
          footnote: applyLimit
            ? t("Tool_80g_donation_Result_CappedFootnote", inr(result.incomeLimit))
            : t("Tool_80g_donation_Result_CappedNone"),
        },
      ],
      scenarios: [
        {
          name: t("Tool_80g_donation_Scenario_50"),
          primaryLabel: t("Tool_80g_donation_Result_Deduction"),
          primaryValue: inr(half.eligibleDeduction),
          secondaryLabel: t("Tool_80g_donation_Result_Saving"),
          secondaryValue: inr(half.estimatedTaxSaving),
          variant: "worst",
        },
        {
          name: t("Tool_80g_donation_Scenario_100"),
          primaryLabel: t("Tool_80g_donation_Result_Deduction"),
          primaryValue: inr(full.eligibleDeduction),
          secondaryLabel: t("Tool_80g_donation_Result_Saving"),
          secondaryValue: inr(full.estimatedTaxSaving),
          variant: "best",
        },
        {
          name: t("Tool_80g_donation_Scenario_NoLimit"),
          primaryLabel: t("Tool_80g_donation_Result_Deduction"),
          primaryValue: inr(noLimit.eligibleDeduction),
          secondaryLabel: t("Tool_80g_donation_Result_Saving"),
          secondaryValue: inr(noLimit.estimatedTaxSaving),
          variant: "base",
        },
      ],
    };
  }, [donation, eligibility, applyLimit, income, taxSlab, t]);

  return (
    <ToolPageShell
      title={t(tool.titleKey)}
      subtitle={t("Tool_80g_donation_Subtitle")}
      description={t(tool.descriptionKey)}
      icon={tool.icon}
      educate={
        <>
          <div className="fy-info-box">
            <strong>{t("Common_WhatYouLearn")}</strong>
            <p>{t("Tool_80g_donation_LearnText")}</p>
          </div>
          <FormulaCard
            title={t("Common_Formula")}
            code={"base = min(donation, 10% income) if limited\ndeduction = base × 50% or 100%\nsaving ≈ deduction × slab"}
            note={t("Tool_80g_donation_FormulaNote")}
          />
        </>
      }
      below={<ToolInfoPanel info={section80gInfo(t)} />}
    >
      <div className="fy-form-card">
        <h3>{t("Common_YourInputs")}</h3>
        <div className="fy-field">
          <label>{t("Tool_80g_donation_LabelDonation")}</label>
          <input
            type="number"
            min={0}
            step={1000}
            inputMode="decimal"
            value={donation}
            onChange={(e) => setDonation(Math.max(0, Number(e.target.value) || 0))}
          />
        </div>
        <div className="fy-field">
          <label>{t("Tool_80g_donation_LabelEligibility")}</label>
          <select
            value={eligibility}
            onChange={(e) => setEligibility(Number(e.target.value) === 100 ? 100 : 50)}
          >
            <option value={50}>{t("Tool_80g_donation_Elig_50")}</option>
            <option value={100}>{t("Tool_80g_donation_Elig_100")}</option>
          </select>
          <p className="fy-field-hint">{t("Tool_80g_donation_EligHint")}</p>
        </div>
        <div className="fy-field">
          <label>{t("Tool_80g_donation_LabelLimit")}</label>
          <select
            value={applyLimit ? "yes" : "no"}
            onChange={(e) => setApplyLimit(e.target.value === "yes")}
          >
            <option value="yes">{t("Tool_80g_donation_LimitYes")}</option>
            <option value="no">{t("Tool_80g_donation_LimitNo")}</option>
          </select>
          <p className="fy-field-hint">{t("Tool_80g_donation_LimitHint")}</p>
        </div>
        <div className="fy-field">
          <label>{t("Tool_80g_donation_LabelIncome")}</label>
          <input
            type="number"
            min={0}
            step={10000}
            inputMode="decimal"
            value={income}
            onChange={(e) => setIncome(Math.max(0, Number(e.target.value) || 0))}
          />
        </div>
        <div className="fy-field">
          <label>{t("Tool_80g_donation_LabelSlab")}</label>
          <select value={taxSlab} onChange={(e) => setTaxSlab(Number(e.target.value))}>
            <option value={5}>5%</option>
            <option value={10}>10%</option>
            <option value={20}>20%</option>
            <option value={30}>30%</option>
          </select>
        </div>
        <button type="button" className="fy-btn-calc">
          {t("Common_Calculate")}
        </button>
      </div>

      <ResultSummaryCards cards={summaryCards} />
      <ScenarioCompare
        title={t("Tool_80g_donation_ScenarioTitle")}
        subtitle={t("Tool_80g_donation_ScenarioSubtitle")}
        scenarios={scenarios}
      />
      <WorkedExample
        title={t("Tool_80g_donation_ExampleTitle")}
        subtitle={t("Tool_80g_donation_ExampleSubtitle")}
        steps={exampleSteps}
      />
    </ToolPageShell>
  );
}
