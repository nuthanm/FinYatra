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
  calculatePmaySubsidy,
  type PmayCategory,
} from "@/lib/finance/pmaySubsidy";
import { inr } from "@/lib/finance/format";
import { getTool } from "@/lib/config/tools";
import { pmaySubsidyInfo } from "@/lib/tool-page-content";

export function PmaySubsidyCalculator() {
  const t = useT();
  const tool = getTool("pmay-subsidy")!;

  const [loanAmount, setLoanAmount] = useState(800_000);
  const [category, setCategory] = useState<PmayCategory>("lig");
  const [tenureYears, setTenureYears] = useState(20);

  const exampleSteps = useMemo(
    () => [
      t("Tool_pmay_subsidy_ExampleStep_1"),
      t("Tool_pmay_subsidy_ExampleStep_2"),
      t("Tool_pmay_subsidy_ExampleStep_3"),
      t("Tool_pmay_subsidy_ExampleStep_4"),
      t("Tool_pmay_subsidy_ExampleStep_5"),
    ],
    [t],
  );

  const { summaryCards, scenarios, result } = useMemo(() => {
    const result = calculatePmaySubsidy({ loanAmount, category, tenureYears });
    const ews = calculatePmaySubsidy({ loanAmount, category: "ews", tenureYears });
    const mig1 = calculatePmaySubsidy({ loanAmount, category: "mig1", tenureYears });
    const mig2 = calculatePmaySubsidy({ loanAmount, category: "mig2", tenureYears });

    return {
      result,
      summaryCards: [
        {
          label: t("Tool_pmay_subsidy_Result_Subsidy"),
          value: inr(result.estimatedSubsidy),
          footnote: t(
            "Tool_pmay_subsidy_Result_SubsidyFootnote",
            String(result.subsidyRatePercent),
          ),
          variant: "primary" as const,
        },
        {
          label: t("Tool_pmay_subsidy_Result_Subsidised"),
          value: inr(result.subsidisedLoan),
          footnote: t(
            "Tool_pmay_subsidy_Result_SubsidisedFootnote",
            inr(result.eligibleLoanCap),
          ),
          variant: "secure" as const,
        },
        {
          label: t("Tool_pmay_subsidy_Result_Loan"),
          value: inr(result.loanAmount),
          footnote: t("Tool_pmay_subsidy_Result_LoanFootnote", String(result.tenureYears)),
        },
      ],
      scenarios: [
        {
          name: t("Tool_pmay_subsidy_Scenario_Ews"),
          primaryLabel: t("Tool_pmay_subsidy_Result_Subsidy"),
          primaryValue: inr(ews.estimatedSubsidy),
          secondaryLabel: t("Tool_pmay_subsidy_Result_Rate"),
          secondaryValue: `${ews.subsidyRatePercent}%`,
          variant: "best",
        },
        {
          name: t("Tool_pmay_subsidy_Scenario_Mig1"),
          primaryLabel: t("Tool_pmay_subsidy_Result_Subsidy"),
          primaryValue: inr(mig1.estimatedSubsidy),
          secondaryLabel: t("Tool_pmay_subsidy_Result_Rate"),
          secondaryValue: `${mig1.subsidyRatePercent}%`,
          variant: "base",
        },
        {
          name: t("Tool_pmay_subsidy_Scenario_Mig2"),
          primaryLabel: t("Tool_pmay_subsidy_Result_Subsidy"),
          primaryValue: inr(mig2.estimatedSubsidy),
          secondaryLabel: t("Tool_pmay_subsidy_Result_Rate"),
          secondaryValue: `${mig2.subsidyRatePercent}%`,
          variant: "worst",
        },
      ],
    };
  }, [loanAmount, category, tenureYears, t]);

  return (
    <ToolPageShell
      title={t(tool.titleKey)}
      subtitle={t("Tool_pmay_subsidy_Subtitle")}
      description={t(tool.descriptionKey)}
      icon={tool.icon}
      educate={
        <>
          <div className="fy-info-box">
            <strong>{t("Common_WhatYouLearn")}</strong>
            <p>{t("Tool_pmay_subsidy_LearnText")}</p>
          </div>
          <FormulaCard
            title={t("Common_Formula")}
            code={
              "EWS/LIG: 6.5% on ≤ ₹6L · MIG-I: 4% on ≤ ₹9L\nMIG-II: 3% on ≤ ₹12L\nSubsidy ≈ PV of interest differential"
            }
            note={t("Tool_pmay_subsidy_FormulaNote")}
          />
        </>
      }
      below={<ToolInfoPanel info={pmaySubsidyInfo(t)} />}
    >
      <div className="fy-form-card">
        <h3>{t("Common_YourInputs")}</h3>
        <div className="fy-field">
          <label>{t("Tool_pmay_subsidy_LabelLoan")}</label>
          <input
            type="number"
            min={0}
            step={50000}
            inputMode="decimal"
            value={loanAmount}
            onChange={(e) => setLoanAmount(Math.max(0, Number(e.target.value) || 0))}
          />
        </div>
        <div className="fy-field">
          <label>{t("Tool_pmay_subsidy_LabelCategory")}</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as PmayCategory)}
          >
            <option value="ews">{t("Tool_pmay_subsidy_Cat_Ews")}</option>
            <option value="lig">{t("Tool_pmay_subsidy_Cat_Lig")}</option>
            <option value="mig1">{t("Tool_pmay_subsidy_Cat_Mig1")}</option>
            <option value="mig2">{t("Tool_pmay_subsidy_Cat_Mig2")}</option>
          </select>
          <p className="fy-field-hint">{t("Tool_pmay_subsidy_CategoryHint")}</p>
        </div>
        <div className="fy-field">
          <label>{t("Tool_pmay_subsidy_LabelTenure")}</label>
          <input
            type="number"
            min={1}
            max={20}
            step={1}
            inputMode="numeric"
            value={tenureYears}
            onChange={(e) =>
              setTenureYears(Math.min(20, Math.max(1, Number(e.target.value) || 1)))
            }
          />
        </div>
        <button type="button" className="fy-btn-calc">
          {t("Common_Calculate")}
        </button>
      </div>

      <div className="fy-info-box">
        <strong>{t("Tool_pmay_subsidy_VerdictTitle")}</strong>
        <p>
          {t(
            "Tool_pmay_subsidy_VerdictNote",
            inr(result.estimatedSubsidy),
            inr(result.subsidisedLoan),
            String(result.subsidyRatePercent),
          )}
        </p>
      </div>

      <ResultSummaryCards cards={summaryCards} />
      <ScenarioCompare
        title={t("Tool_pmay_subsidy_ScenarioTitle")}
        subtitle={t("Tool_pmay_subsidy_ScenarioSubtitle")}
        scenarios={scenarios}
      />
      <WorkedExample
        title={t("Tool_pmay_subsidy_ExampleTitle")}
        subtitle={t("Tool_pmay_subsidy_ExampleSubtitle")}
        steps={exampleSteps}
      />
    </ToolPageShell>
  );
}
