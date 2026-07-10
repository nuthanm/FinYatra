"use client";

import { useMemo, useState } from "react";
import { useT } from "@/components/providers/I18nProvider";
import {
  BreakdownTable,
  FormulaCard,
  ResultSummaryCards,
  ScenarioCompare,
  ToolInfoPanel,
  ToolPageShell,
  WorkedExample,
} from "@/components/calculator/CalculatorUi";
import { calculateHomeLoan } from "@/lib/finance/homeLoan";
import { emi } from "@/lib/finance/compound";
import { inr, percent } from "@/lib/finance/format";
import { emiYearly } from "@/lib/finance/projections";
import { getTool } from "@/lib/config/tools";
import { homeLoanEmiInfo } from "@/lib/tool-page-content";

export function HomeLoanEmiCalculator() {
  const t = useT();
  const tool = getTool("home-loan-emi")!;

  const [principal, setPrincipal] = useState(4_000_000);
  const [rate, setRate] = useState(8.5);
  const [years, setYears] = useState(20);
  const [selfOccupied, setSelfOccupied] = useState(true);
  const [taxSlab, setTaxSlab] = useState(30);

  const breakdownColumns = useMemo(
    () => [
      { key: "year", header: t("Common_Year"), alignRight: false as const },
      { key: "principal", header: t("Common_Col_Principal") },
      { key: "interest", header: t("Common_Col_Interest") },
      { key: "balance", header: t("Common_Col_Balance") },
    ],
    [t],
  );

  const exampleSteps = useMemo(
    () => [
      t("Tool_home_loan_emi_ExampleStep_1"),
      t("Tool_home_loan_emi_ExampleStep_2"),
      t("Tool_home_loan_emi_ExampleStep_3"),
      t("Tool_home_loan_emi_ExampleStep_4"),
      t("Tool_home_loan_emi_ExampleStep_5"),
    ],
    [t],
  );

  const { summaryCards, scenarios, breakdownRows, detail } = useMemo(() => {
    const result = calculateHomeLoan({
      principal: Math.max(0, principal),
      annualRatePercent: Math.max(0, rate),
      years: Math.max(0, years),
      selfOccupied,
      taxSlabPercent: taxSlab,
    });
    const shorter = Math.max(1, Math.round(years * 0.75));
    const longer = Math.round(years * 1.25);

    return {
      detail: result,
      summaryCards: [
        {
          label: t("Tool_home_loan_emi_Result_Emi"),
          value: inr(result.monthlyEmi),
          footnote: t("Tool_home_loan_emi_Result_EmiFootnote", years),
          variant: "primary" as const,
        },
        {
          label: t("Tool_home_loan_emi_Result_Interest"),
          value: inr(result.totalInterest),
          footnote: t("Common_Footnote_RatePa", percent(rate)),
          variant: "volatile" as const,
        },
        {
          label: t("Tool_home_loan_emi_Result_TaxSaving"),
          value: inr(result.estimatedAnnualTaxSaving),
          footnote: t("Tool_home_loan_emi_Result_TaxSavingFootnote"),
          variant: "secure" as const,
        },
      ],
      scenarios: [
        {
          name: t("Tool_home_loan_emi_Scenario_Shorter"),
          primaryLabel: t("Tool_home_loan_emi_Result_Emi"),
          primaryValue: inr(emi(principal, rate, Math.round(shorter * 12))),
          secondaryLabel: t("Common_Label_TenureYears"),
          secondaryValue: t("Tool_home_loan_emi_Years", shorter),
          variant: "best",
        },
        {
          name: t("Common_Scenario_Base"),
          primaryLabel: t("Tool_home_loan_emi_Result_Emi"),
          primaryValue: inr(result.monthlyEmi),
          secondaryLabel: t("Tool_home_loan_emi_Result_TaxSaving"),
          secondaryValue: inr(result.estimatedAnnualTaxSaving),
          variant: "base",
        },
        {
          name: t("Tool_home_loan_emi_Scenario_Longer"),
          primaryLabel: t("Tool_home_loan_emi_Result_Emi"),
          primaryValue: inr(emi(principal, rate, Math.round(longer * 12))),
          secondaryLabel: t("Common_Label_TenureYears"),
          secondaryValue: t("Tool_home_loan_emi_Years", longer),
          variant: "worst",
        },
      ],
      breakdownRows: emiYearly(Math.max(0, principal), Math.max(0, rate), Math.max(0, years)).map((r) => ({
        cells: {
          year: t("Common_YearN", r.year),
          principal: inr(r.principalPaid),
          interest: inr(r.interestPaid),
          balance: inr(r.balance),
        },
      })),
    };
  }, [principal, rate, years, selfOccupied, taxSlab, t]);

  return (
    <ToolPageShell
      title={t(tool.titleKey)}
      subtitle={t("Tool_home_loan_emi_Subtitle")}
      description={t(tool.descriptionKey)}
      icon={tool.icon}
      educate={
        <>
          <div className="fy-info-box">
            <strong>{t("Common_WhatYouLearn")}</strong>
            <p>{t("Tool_home_loan_emi_LearnText")}</p>
          </div>
          <FormulaCard
            title={t("Common_Formula")}
            code={"EMI = P × r × (1+r)^n / ((1+r)^n − 1)\n24(b) + 80C → tax saving"}
            note={t("Tool_home_loan_emi_FormulaNote")}
          />
        </>
      }
      below={<ToolInfoPanel info={homeLoanEmiInfo(t)} />}
    >
      <div className="fy-form-card">
        <h3>{t("Common_YourInputs")}</h3>
        <div className="fy-field">
          <label>{t("Tool_home_loan_emi_LabelPrincipal")}</label>
          <input
            type="number"
            min={0}
            step={10000}
            inputMode="decimal"
            value={principal}
            onChange={(e) => setPrincipal(Math.max(0, Number(e.target.value) || 0))}
          />
        </div>
        <div className="fy-field">
          <label>{t("Common_Label_RatePa")}</label>
          <input
            type="number"
            min={0}
            step={0.05}
            inputMode="decimal"
            value={rate}
            onChange={(e) => setRate(Math.max(0, Number(e.target.value) || 0))}
          />
        </div>
        <div className="fy-field">
          <label>{t("Common_Label_Years")}</label>
          <input
            type="number"
            min={1}
            max={30}
            step={1}
            inputMode="numeric"
            value={years}
            onChange={(e) => setYears(Math.max(1, Number(e.target.value) || 1))}
          />
        </div>
        <div className="fy-field">
          <label>
            <input type="checkbox" checked={selfOccupied} onChange={(e) => setSelfOccupied(e.target.checked)} />{" "}
            {t("Tool_home_loan_emi_LabelSelfOccupied")}
          </label>
          <p className="fy-field-hint">{t("Tool_home_loan_emi_SelfOccupiedHint")}</p>
        </div>
        <div className="fy-field">
          <label>{t("Tool_home_loan_emi_LabelSlab")}</label>
          <select value={taxSlab} onChange={(e) => setTaxSlab(Number(e.target.value))}>
            <option value={5}>5%</option>
            <option value={10}>10%</option>
            <option value={15}>15%</option>
            <option value={20}>20%</option>
            <option value={30}>30%</option>
          </select>
        </div>
        <button type="button" className="fy-btn-calc">
          {t("Common_Calculate")}
        </button>
      </div>

      <div className="fy-info-box fy-tax-verdict">
        <strong>{t("Tool_home_loan_emi_TaxTitle")}</strong>
        <p>
          {t(
            "Tool_home_loan_emi_TaxBody",
            inr(detail.section24bDeduction),
            inr(detail.section80cPrincipal),
            inr(detail.estimatedAnnualTaxSaving),
          )}
        </p>
      </div>

      <ResultSummaryCards cards={summaryCards} />
      <ScenarioCompare
        title={t("Tool_home_loan_emi_ScenarioTitle")}
        subtitle={t("Tool_home_loan_emi_ScenarioSubtitle")}
        scenarios={scenarios}
      />
      <BreakdownTable title={t("Tool_home_loan_emi_BreakdownTitle")} columns={breakdownColumns} rows={breakdownRows} />
      <WorkedExample
        title={t("Tool_home_loan_emi_ExampleTitle")}
        subtitle={t("Tool_home_loan_emi_ExampleSubtitle")}
        steps={exampleSteps}
      />
    </ToolPageShell>
  );
}
