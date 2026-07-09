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
import { emi } from "@/lib/finance/compound";
import { inr, percent } from "@/lib/finance/format";
import { emiYearly } from "@/lib/finance/projections";
import { getTool } from "@/lib/config/tools";
import { emiInfo } from "@/lib/tool-page-content";

export function EmiCalculator() {
  const t = useT();
  const tool = getTool("emi")!;

  const [principal, setPrincipal] = useState(1000000);
  const [annualRate, setAnnualRate] = useState(10);
  const [years, setYears] = useState(10);

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
      t("Tool_emi_ExampleStep_1"),
      t("Tool_emi_ExampleStep_2"),
      t("Tool_emi_ExampleStep_3"),
      t("Tool_emi_ExampleStep_4"),
      t("Tool_emi_ExampleStep_5"),
    ],
    [t],
  );

  const { summaryCards, scenarios, breakdownRows } = useMemo(() => {
    const safePrincipal = Math.max(0, principal);
    const safeRate = Math.max(0, annualRate);
    const safeYears = Math.max(0, years);
    const n = Math.round(safeYears * 12);

    if (safePrincipal <= 0 || n <= 0) {
      return { summaryCards: [], scenarios: [], breakdownRows: [] };
    }

    const monthlyEmi = emi(safePrincipal, safeRate, n);
    const totalPayment = monthlyEmi * n;
    const totalInterest = Math.max(0, totalPayment - safePrincipal);
    const shorterMonths = Math.max(1, Math.round(n * 0.75));
    const longerMonths = Math.round(n * 1.25);
    const shorterEmi = emi(safePrincipal, safeRate, shorterMonths);
    const longerEmi = emi(safePrincipal, safeRate, longerMonths);

    return {
      summaryCards: [
        {
          label: t("Tool_emi_Result_MonthlyEmi"),
          value: inr(monthlyEmi),
          footnote: t("Tool_emi_Result_TenureFootnote", safeYears),
          variant: "primary" as const,
        },
        {
          label: t("Tool_emi_Result_TotalInterest"),
          value: inr(totalInterest),
          footnote: t("Common_Footnote_RatePa", percent(safeRate)),
        },
        {
          label: t("Tool_emi_Result_TotalPayment"),
          value: inr(totalPayment),
          footnote: t("Tool_emi_Result_PaymentFootnote"),
          variant: "secure" as const,
        },
      ],
      scenarios: [
        {
          name: t("Tool_emi_Scenario_Shorter"),
          primaryLabel: t("Common_Col_Emi"),
          primaryValue: inr(shorterEmi),
          secondaryLabel: t("Common_Label_Months"),
          secondaryValue: String(shorterMonths),
          variant: "best",
        },
        {
          name: t("Common_Scenario_YourTenure"),
          primaryLabel: t("Common_Col_Emi"),
          primaryValue: inr(monthlyEmi),
          secondaryLabel: t("Common_Label_Months"),
          secondaryValue: String(n),
          variant: "base",
        },
        {
          name: t("Tool_emi_Scenario_Longer"),
          primaryLabel: t("Common_Col_Emi"),
          primaryValue: inr(longerEmi),
          secondaryLabel: t("Common_Label_Months"),
          secondaryValue: String(longerMonths),
          variant: "worst",
        },
      ],
      breakdownRows: emiYearly(safePrincipal, safeRate, safeYears).map((r) => ({
        cells: {
          year: t("Common_YearN", r.year),
          principal: inr(r.principalPaid),
          interest: inr(r.interestPaid),
          balance: inr(r.balance),
        },
      })),
    };
  }, [principal, annualRate, years, t]);

  return (
    <ToolPageShell
      title={t(tool.titleKey)}
      subtitle={t("Tool_emi_Subtitle")}
      description={t(tool.descriptionKey)}
      icon={tool.icon}
      educate={
        <>
          <div className="fy-info-box">
            <strong>{t("Common_WhatYouLearn")}</strong>
            <p>{t("Tool_emi_LearnText")}</p>
          </div>
          <FormulaCard
            title={t("Common_Formula")}
            code={"r = annual_rate / 12        (monthly rate)\nn = years * 12             (months)\nEMI = P * r * (1 + r)^n / ((1 + r)^n - 1)"}
            note={t("Tool_emi_FormulaNote")}
          />
        </>
      }
      below={<ToolInfoPanel info={emiInfo(t)} />}
    >
      <div className="fy-form-card">
        <h3>{t("Common_YourInputs")}</h3>
        <div className="fy-field">
          <label>{t("Tool_emi_LabelPrincipal")}</label>
          <input
            type="number"
            min={0}
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
            value={annualRate}
            onChange={(e) => setAnnualRate(Math.max(0, Number(e.target.value) || 0))}
          />
        </div>
        <div className="fy-field">
          <label>{t("Common_Label_TenureYears")}</label>
          <input
            type="number"
            min={0}
            step={0.5}
            inputMode="decimal"
            value={years}
            onChange={(e) => setYears(Math.max(0, Number(e.target.value) || 0))}
          />
        </div>
        <button type="button" className="fy-btn-calc">
          {t("Common_Calculate")}
        </button>
      </div>

      <ResultSummaryCards cards={summaryCards} />
      <ScenarioCompare
        title={t("Tool_emi_ScenarioTitle")}
        subtitle={t("Tool_emi_ScenarioSubtitle")}
        scenarios={scenarios}
      />
      <BreakdownTable
        title={t("Tool_emi_BreakdownTitle")}
        subtitle={t("Tool_emi_BreakdownSubtitle")}
        columns={breakdownColumns}
        rows={breakdownRows}
      />
      <WorkedExample title={t("Tool_emi_ExampleTitle")} steps={exampleSteps} />
    </ToolPageShell>
  );
}
