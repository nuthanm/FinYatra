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
import { calculateUnderConstructionEmi } from "@/lib/finance/underConstructionEmi";
import { inr, percent } from "@/lib/finance/format";
import { getTool } from "@/lib/config/tools";
import { underConstructionEmiInfo } from "@/lib/tool-page-content";

export function UnderConstructionEmiCalculator() {
  const t = useT();
  const tool = getTool("under-construction-emi")!;

  const [loanAmount, setLoanAmount] = useState(50_00_000);
  const [annualRatePercent, setAnnualRatePercent] = useState(8.5);
  const [prePossessionMonths, setPrePossessionMonths] = useState(24);
  const [postPossessionMonths, setPostPossessionMonths] = useState(240);

  const exampleSteps = useMemo(
    () => [
      t("Tool_under_construction_emi_ExampleStep_1"),
      t("Tool_under_construction_emi_ExampleStep_2"),
      t("Tool_under_construction_emi_ExampleStep_3"),
      t("Tool_under_construction_emi_ExampleStep_4"),
      t("Tool_under_construction_emi_ExampleStep_5"),
    ],
    [t],
  );

  const { summaryCards, scenarios } = useMemo(() => {
    const input = {
      loanAmount,
      annualRatePercent,
      prePossessionMonths,
      postPossessionMonths,
    };
    const result = calculateUnderConstructionEmi(input);
    const shortPre = calculateUnderConstructionEmi({ ...input, prePossessionMonths: 12 });
    const longPre = calculateUnderConstructionEmi({ ...input, prePossessionMonths: 36 });

    return {
      summaryCards: [
        {
          label: t("Tool_under_construction_emi_Result_Emi"),
          value: inr(result.monthlyEmi),
          footnote: t("Tool_under_construction_emi_Result_EmiFootnote"),
          variant: "primary" as const,
        },
        {
          label: t("Tool_under_construction_emi_Result_PreInterest"),
          value: inr(result.prePossessionInterest),
          footnote: t(
            "Tool_under_construction_emi_Result_PreInterestFootnote",
            inr(result.disbursedAmount),
          ),
          variant: "volatile" as const,
        },
        {
          label: t("Tool_under_construction_emi_Result_TotalInterest"),
          value: inr(result.totalInterestAll),
          footnote: t("Tool_under_construction_emi_Result_TotalInterestFootnote"),
        },
      ],
      scenarios: [
        {
          name: t("Tool_under_construction_emi_Scenario_Short"),
          primaryLabel: t("Tool_under_construction_emi_Result_PreInterest"),
          primaryValue: inr(shortPre.prePossessionInterest),
          secondaryLabel: t("Tool_under_construction_emi_Result_TotalInterest"),
          secondaryValue: inr(shortPre.totalInterestAll),
          variant: "best" as const,
        },
        {
          name: t("Common_Scenario_Base"),
          primaryLabel: t("Tool_under_construction_emi_Result_Emi"),
          primaryValue: inr(result.monthlyEmi),
          secondaryLabel: t("Tool_under_construction_emi_Result_PreInterest"),
          secondaryValue: inr(result.prePossessionInterest),
          variant: "base" as const,
        },
        {
          name: t("Tool_under_construction_emi_Scenario_Long"),
          primaryLabel: t("Tool_under_construction_emi_Result_PreInterest"),
          primaryValue: inr(longPre.prePossessionInterest),
          secondaryLabel: t("Tool_under_construction_emi_Result_TotalInterest"),
          secondaryValue: inr(longPre.totalInterestAll),
          variant: "worst" as const,
        },
      ],
    };
  }, [loanAmount, annualRatePercent, prePossessionMonths, postPossessionMonths, t]);

  return (
    <ToolPageShell
      title={t(tool.titleKey)}
      subtitle={t("Tool_under_construction_emi_Subtitle")}
      description={t(tool.descriptionKey)}
      icon={tool.icon}
      educate={
        <>
          <div className="fy-info-box">
            <strong>{t("Common_WhatYouLearn")}</strong>
            <p>{t("Tool_under_construction_emi_LearnText")}</p>
          </div>
          <FormulaCard
            title={t("Common_Formula")}
            code={"Pre-int ≈ disbursed × r/12 × months\nEMI after possession on full loan\nTotal int = pre + EMI interest"}
            note={t("Tool_under_construction_emi_FormulaNote")}
          />
        </>
      }
      below={<ToolInfoPanel info={underConstructionEmiInfo(t)} />}
    >
      <div className="fy-form-card">
        <h3>{t("Common_YourInputs")}</h3>
        <div className="fy-field">
          <label>{t("Tool_under_construction_emi_LabelLoan")}</label>
          <input
            type="number"
            min={0}
            step={100000}
            inputMode="decimal"
            value={loanAmount}
            onChange={(e) => setLoanAmount(Math.max(0, Number(e.target.value) || 0))}
          />
        </div>
        <div className="fy-field">
          <label>{t("Tool_under_construction_emi_LabelRate")}</label>
          <input
            type="number"
            min={0}
            max={20}
            step={0.1}
            inputMode="decimal"
            value={annualRatePercent}
            onChange={(e) => setAnnualRatePercent(Math.max(0, Number(e.target.value) || 0))}
          />
          <p className="fy-field-hint">{percent(annualRatePercent, 1)}</p>
        </div>
        <div className="fy-field">
          <label>{t("Tool_under_construction_emi_LabelPreMonths")}</label>
          <input
            type="number"
            min={0}
            max={120}
            step={1}
            inputMode="decimal"
            value={prePossessionMonths}
            onChange={(e) => setPrePossessionMonths(Math.max(0, Number(e.target.value) || 0))}
          />
        </div>
        <div className="fy-field">
          <label>{t("Tool_under_construction_emi_LabelPostMonths")}</label>
          <input
            type="number"
            min={0}
            max={360}
            step={12}
            inputMode="decimal"
            value={postPossessionMonths}
            onChange={(e) => setPostPossessionMonths(Math.max(0, Number(e.target.value) || 0))}
          />
        </div>
        <button type="button" className="fy-btn-calc">
          {t("Common_Calculate")}
        </button>
      </div>

      <ResultSummaryCards cards={summaryCards} />
      <ScenarioCompare
        title={t("Tool_under_construction_emi_ScenarioTitle")}
        subtitle={t("Tool_under_construction_emi_ScenarioSubtitle")}
        scenarios={scenarios}
      />
      <WorkedExample
        title={t("Tool_under_construction_emi_ExampleTitle")}
        subtitle={t("Tool_under_construction_emi_ExampleSubtitle")}
        steps={exampleSteps}
      />
    </ToolPageShell>
  );
}
