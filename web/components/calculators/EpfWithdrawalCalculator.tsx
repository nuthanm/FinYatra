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
  calculateEpfWithdrawal,
  type EpfEmploymentStatus,
} from "@/lib/finance/epfWithdrawal";
import { inr, percent } from "@/lib/finance/format";
import { getTool } from "@/lib/config/tools";
import { epfWithdrawalInfo } from "@/lib/tool-page-content";

export function EpfWithdrawalCalculator() {
  const t = useT();
  const tool = getTool("epf-withdrawal")!;

  const [balance, setBalance] = useState(500_000);
  const [serviceYears, setServiceYears] = useState(4);
  const [status, setStatus] = useState<EpfEmploymentStatus>("continuing");
  const [taxSlab, setTaxSlab] = useState(30);
  const [interestPortion, setInterestPortion] = useState(25);

  const exampleSteps = useMemo(
    () => [
      t("Tool_epf_withdrawal_ExampleStep_1"),
      t("Tool_epf_withdrawal_ExampleStep_2"),
      t("Tool_epf_withdrawal_ExampleStep_3"),
      t("Tool_epf_withdrawal_ExampleStep_4"),
      t("Tool_epf_withdrawal_ExampleStep_5"),
    ],
    [t],
  );

  const { summaryCards, scenarios, result } = useMemo(() => {
    const result = calculateEpfWithdrawal({
      balance,
      serviceYears,
      employmentStatus: status,
      interestPortionPercent: interestPortion,
      taxSlabPercent: taxSlab,
    });
    const after5 = calculateEpfWithdrawal({
      balance,
      serviceYears: 5,
      employmentStatus: status,
      interestPortionPercent: interestPortion,
      taxSlabPercent: taxSlab,
    });
    const early = calculateEpfWithdrawal({
      balance,
      serviceYears: 2,
      employmentStatus: status,
      interestPortionPercent: interestPortion,
      taxSlabPercent: taxSlab,
    });

    const note =
      result.noteKey === "exempt5Plus"
        ? t("Tool_epf_withdrawal_Note_Exempt")
        : result.noteKey === "unemployedPartial"
          ? t("Tool_epf_withdrawal_Note_Unemployed")
          : t("Tool_epf_withdrawal_Note_Taxable");

    return {
      result: { ...result, note },
      summaryCards: [
        {
          label: t("Tool_epf_withdrawal_Result_Taxable"),
          value: inr(result.taxablePortion),
          footnote: note,
          variant: "primary" as const,
        },
        {
          label: t("Tool_epf_withdrawal_Result_Tax"),
          value: inr(result.estimatedTax),
          footnote: t("Tool_epf_withdrawal_Result_TaxFootnote", percent(taxSlab)),
          variant: "volatile" as const,
        },
        {
          label: t("Tool_epf_withdrawal_Result_TaxFree"),
          value: inr(result.taxFreePortion),
          footnote: t("Tool_epf_withdrawal_Result_TaxFreeFootnote"),
        },
      ],
      scenarios: [
        {
          name: t("Tool_epf_withdrawal_Scenario_After5"),
          primaryLabel: t("Tool_epf_withdrawal_Result_Tax"),
          primaryValue: inr(after5.estimatedTax),
          secondaryLabel: t("Tool_epf_withdrawal_Result_Taxable"),
          secondaryValue: inr(after5.taxablePortion),
          variant: "best",
        },
        {
          name: t("Common_Scenario_Base"),
          primaryLabel: t("Tool_epf_withdrawal_Result_Tax"),
          primaryValue: inr(result.estimatedTax),
          secondaryLabel: t("Common_Label_Years"),
          secondaryValue: String(serviceYears),
          variant: "base",
        },
        {
          name: t("Tool_epf_withdrawal_Scenario_Early"),
          primaryLabel: t("Tool_epf_withdrawal_Result_Tax"),
          primaryValue: inr(early.estimatedTax),
          secondaryLabel: t("Tool_epf_withdrawal_Result_Taxable"),
          secondaryValue: inr(early.taxablePortion),
          variant: "worst",
        },
      ],
    };
  }, [balance, serviceYears, status, taxSlab, interestPortion, t]);

  return (
    <ToolPageShell
      title={t(tool.titleKey)}
      subtitle={t("Tool_epf_withdrawal_Subtitle")}
      description={t(tool.descriptionKey)}
      icon={tool.icon}
      educate={
        <>
          <div className="fy-info-box">
            <strong>{t("Common_WhatYouLearn")}</strong>
            <p>{t("Tool_epf_withdrawal_LearnText")}</p>
          </div>
          <FormulaCard
            title={t("Common_Formula")}
            code={"≥ 5 yrs → generally tax-free\n< 5 yrs → interest portion taxable\nTax ≈ taxable × slab"}
            note={t("Tool_epf_withdrawal_FormulaNote")}
          />
        </>
      }
      below={<ToolInfoPanel info={epfWithdrawalInfo(t)} />}
    >
      <div className="fy-form-card">
        <h3>{t("Common_YourInputs")}</h3>
        <div className="fy-field">
          <label>{t("Tool_epf_withdrawal_LabelBalance")}</label>
          <input
            type="number"
            min={0}
            step={10000}
            inputMode="decimal"
            value={balance}
            onChange={(e) => setBalance(Math.max(0, Number(e.target.value) || 0))}
          />
        </div>
        <div className="fy-field">
          <label>{t("Tool_epf_withdrawal_LabelYears")}</label>
          <input
            type="number"
            min={0}
            step={0.5}
            inputMode="decimal"
            value={serviceYears}
            onChange={(e) => setServiceYears(Math.max(0, Number(e.target.value) || 0))}
          />
        </div>
        <div className="fy-field">
          <label>{t("Tool_epf_withdrawal_LabelStatus")}</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as EpfEmploymentStatus)}
          >
            <option value="continuing">{t("Tool_epf_withdrawal_Status_Continuing")}</option>
            <option value="unemployed">{t("Tool_epf_withdrawal_Status_Unemployed")}</option>
            <option value="retired">{t("Tool_epf_withdrawal_Status_Retired")}</option>
          </select>
        </div>
        <div className="fy-field">
          <label>{t("Tool_epf_withdrawal_LabelInterestPct")}</label>
          <input
            type="number"
            min={0}
            max={100}
            step={1}
            inputMode="decimal"
            value={interestPortion}
            onChange={(e) => setInterestPortion(Math.max(0, Math.min(100, Number(e.target.value) || 0)))}
          />
          <p className="fy-field-hint">{t("Tool_epf_withdrawal_InterestHint")}</p>
        </div>
        <div className="fy-field">
          <label>{t("Tool_epf_withdrawal_LabelSlab")}</label>
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

      <div className="fy-info-box">
        <strong>{t("Tool_epf_withdrawal_VerdictTitle")}</strong>
        <p>{result.note}</p>
      </div>

      <ResultSummaryCards cards={summaryCards} />
      <ScenarioCompare
        title={t("Tool_epf_withdrawal_ScenarioTitle")}
        subtitle={t("Tool_epf_withdrawal_ScenarioSubtitle")}
        scenarios={scenarios}
      />
      <WorkedExample
        title={t("Tool_epf_withdrawal_ExampleTitle")}
        subtitle={t("Tool_epf_withdrawal_ExampleSubtitle")}
        steps={exampleSteps}
      />
    </ToolPageShell>
  );
}
