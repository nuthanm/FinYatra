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
import { calculateHraVsHomeLoan } from "@/lib/finance/hraVsHomeLoan";
import { inr, percent } from "@/lib/finance/format";
import { getTool } from "@/lib/config/tools";
import { hraVsHomeLoanInfo } from "@/lib/tool-page-content";

export function HraVsHomeLoanCalculator() {
  const t = useT();
  const tool = getTool("hra-vs-home-loan")!;

  const [housingCost, setHousingCost] = useState(3_60_000);
  const [basic, setBasic] = useState(6_00_000);
  const [hraReceived, setHraReceived] = useState(2_40_000);
  const [isMetro, setIsMetro] = useState(true);
  const [interestShare, setInterestShare] = useState(70);
  const [slab, setSlab] = useState(30);

  const exampleSteps = useMemo(
    () => [
      t("Tool_hra_vs_home_loan_ExampleStep_1"),
      t("Tool_hra_vs_home_loan_ExampleStep_2"),
      t("Tool_hra_vs_home_loan_ExampleStep_3"),
      t("Tool_hra_vs_home_loan_ExampleStep_4"),
      t("Tool_hra_vs_home_loan_ExampleStep_5"),
    ],
    [t],
  );

  const { summaryCards, scenarios } = useMemo(() => {
    const result = calculateHraVsHomeLoan({
      annualHousingCost: housingCost,
      basicAnnual: basic,
      hraReceivedAnnual: hraReceived,
      isMetro,
      interestSharePercent: interestShare,
      taxSlabPercent: slab,
    });
    const lowerSlab = calculateHraVsHomeLoan({
      annualHousingCost: housingCost,
      basicAnnual: basic,
      hraReceivedAnnual: hraReceived,
      isMetro,
      interestSharePercent: interestShare,
      taxSlabPercent: Math.max(5, slab - 10),
    });
    const nonMetro = calculateHraVsHomeLoan({
      annualHousingCost: housingCost,
      basicAnnual: basic,
      hraReceivedAnnual: hraReceived,
      isMetro: false,
      interestSharePercent: interestShare,
      taxSlabPercent: slab,
    });

    const winnerKey =
      result.winner === "hra"
        ? "Tool_hra_vs_home_loan_Result_WinnerHra"
        : result.winner === "home_loan"
          ? "Tool_hra_vs_home_loan_Result_WinnerLoan"
          : "Tool_hra_vs_home_loan_Result_WinnerTie";

    return {
      summaryCards: [
        {
          label: t("Tool_hra_vs_home_loan_Result_HraSaving"),
          value: inr(result.hra.estimatedTaxSaving),
          footnote: t(
            "Tool_hra_vs_home_loan_Result_HraFootnote",
            inr(result.hra.exemption),
          ),
          variant: "secure" as const,
        },
        {
          label: t("Tool_hra_vs_home_loan_Result_LoanSaving"),
          value: inr(result.homeLoan.estimatedTaxSaving),
          footnote: t(
            "Tool_hra_vs_home_loan_Result_LoanFootnote",
            inr(result.homeLoan.deductionOrExemption),
          ),
          variant: "primary" as const,
        },
        {
          label: t("Tool_hra_vs_home_loan_Result_Advantage"),
          value: inr(result.advantage),
          footnote: t(winnerKey),
          variant: "volatile" as const,
        },
      ],
      scenarios: [
        {
          name: t("Tool_hra_vs_home_loan_Scenario_NonMetro"),
          primaryLabel: t("Tool_hra_vs_home_loan_Result_HraSaving"),
          primaryValue: inr(nonMetro.hra.estimatedTaxSaving),
          secondaryLabel: t("Tool_hra_vs_home_loan_Result_LoanSaving"),
          secondaryValue: inr(nonMetro.homeLoan.estimatedTaxSaving),
          variant: "worst" as const,
        },
        {
          name: t("Common_Scenario_Base"),
          primaryLabel: t("Tool_hra_vs_home_loan_Result_HraSaving"),
          primaryValue: inr(result.hra.estimatedTaxSaving),
          secondaryLabel: t("Tool_hra_vs_home_loan_Result_LoanSaving"),
          secondaryValue: inr(result.homeLoan.estimatedTaxSaving),
          variant: "base" as const,
        },
        {
          name: t("Tool_hra_vs_home_loan_Scenario_LowerSlab"),
          primaryLabel: t("Tool_hra_vs_home_loan_Result_Advantage"),
          primaryValue: inr(lowerSlab.advantage),
          secondaryLabel: t("Tool_hra_vs_home_loan_LabelSlab"),
          secondaryValue: percent(lowerSlab.taxSlabPercent),
          variant: "best" as const,
        },
      ],
    };
  }, [housingCost, basic, hraReceived, isMetro, interestShare, slab, t]);

  return (
    <ToolPageShell
      title={t(tool.titleKey)}
      subtitle={t("Tool_hra_vs_home_loan_Subtitle")}
      description={t(tool.descriptionKey)}
      icon={tool.icon}
      educate={
        <>
          <div className="fy-info-box">
            <strong>{t("Common_WhatYouLearn")}</strong>
            <p>{t("Tool_hra_vs_home_loan_LearnText")}</p>
          </div>
          <FormulaCard
            title={t("Common_Formula")}
            code={"HRA exempt = min(HRA, rent−10% basic, % basic)\n24(b)+80C on loan path\nsaving ≈ deduction × slab%"}
            note={t("Tool_hra_vs_home_loan_FormulaNote")}
          />
        </>
      }
      below={<ToolInfoPanel info={hraVsHomeLoanInfo(t)} />}
    >
      <div className="fy-form-card">
        <h3>{t("Common_YourInputs")}</h3>
        <div className="fy-field">
          <label>{t("Tool_hra_vs_home_loan_LabelHousing")}</label>
          <input
            type="number"
            min={0}
            step={1000}
            inputMode="decimal"
            value={housingCost}
            onChange={(e) => setHousingCost(Math.max(0, Number(e.target.value) || 0))}
          />
          <p className="fy-field-hint">{t("Tool_hra_vs_home_loan_HousingHint")}</p>
        </div>
        <div className="fy-field">
          <label>{t("Tool_hra_vs_home_loan_LabelBasic")}</label>
          <input
            type="number"
            min={0}
            step={1000}
            inputMode="decimal"
            value={basic}
            onChange={(e) => setBasic(Math.max(0, Number(e.target.value) || 0))}
          />
        </div>
        <div className="fy-field">
          <label>{t("Tool_hra_vs_home_loan_LabelHra")}</label>
          <input
            type="number"
            min={0}
            step={1000}
            inputMode="decimal"
            value={hraReceived}
            onChange={(e) => setHraReceived(Math.max(0, Number(e.target.value) || 0))}
          />
        </div>
        <div className="fy-field">
          <label>{t("Tool_hra_vs_home_loan_LabelMetro")}</label>
          <select
            value={isMetro ? "metro" : "non"}
            onChange={(e) => setIsMetro(e.target.value === "metro")}
          >
            <option value="metro">{t("Tool_hra_vs_home_loan_Metro_Yes")}</option>
            <option value="non">{t("Tool_hra_vs_home_loan_Metro_No")}</option>
          </select>
        </div>
        <div className="fy-field">
          <label>{t("Tool_hra_vs_home_loan_LabelInterestShare")}</label>
          <input
            type="number"
            min={0}
            max={100}
            step={5}
            inputMode="decimal"
            value={interestShare}
            onChange={(e) =>
              setInterestShare(Math.min(100, Math.max(0, Number(e.target.value) || 0)))
            }
          />
          <p className="fy-field-hint">{t("Tool_hra_vs_home_loan_InterestHint")}</p>
        </div>
        <div className="fy-field">
          <label>{t("Tool_hra_vs_home_loan_LabelSlab")}</label>
          <input
            type="number"
            min={0}
            max={42}
            step={1}
            inputMode="decimal"
            value={slab}
            onChange={(e) => setSlab(Math.min(42, Math.max(0, Number(e.target.value) || 0)))}
          />
        </div>
        <button type="button" className="fy-btn-calc">
          {t("Common_Calculate")}
        </button>
      </div>

      <ResultSummaryCards cards={summaryCards} />
      <ScenarioCompare
        title={t("Tool_hra_vs_home_loan_ScenarioTitle")}
        subtitle={t("Tool_hra_vs_home_loan_ScenarioSubtitle")}
        scenarios={scenarios}
      />
      <WorkedExample
        title={t("Tool_hra_vs_home_loan_ExampleTitle")}
        subtitle={t("Tool_hra_vs_home_loan_ExampleSubtitle")}
        steps={exampleSteps}
      />
    </ToolPageShell>
  );
}
