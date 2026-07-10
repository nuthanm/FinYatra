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
import { calculateRealEstate } from "@/lib/finance/realEstate";
import { inr, percent } from "@/lib/finance/format";
import { getTool } from "@/lib/config/tools";
import { realEstateInfo } from "@/lib/tool-page-content";

export function RealEstateCalculator() {
  const t = useT();
  const tool = getTool("real-estate")!;

  const [price, setPrice] = useState(80_00_000);
  const [downPct, setDownPct] = useState(20);
  const [loanRate, setLoanRate] = useState(8.5);
  const [tenure, setTenure] = useState(20);
  const [appreciation, setAppreciation] = useState(5);
  const [rentYield, setRentYield] = useState(2.5);
  const [holdYears, setHoldYears] = useState(10);

  const exampleSteps = useMemo(
    () => [
      t("Tool_real_estate_ExampleStep_1"),
      t("Tool_real_estate_ExampleStep_2"),
      t("Tool_real_estate_ExampleStep_3"),
      t("Tool_real_estate_ExampleStep_4"),
      t("Tool_real_estate_ExampleStep_5"),
    ],
    [t],
  );

  const { summaryCards, scenarios } = useMemo(() => {
    const base = calculateRealEstate({
      propertyPrice: price,
      downPaymentPercent: downPct,
      loanRatePercent: loanRate,
      loanTenureYears: tenure,
      appreciationPercent: appreciation,
      rentYieldPercent: rentYield,
      holdYears,
    });
    const lowApp = calculateRealEstate({
      propertyPrice: price,
      downPaymentPercent: downPct,
      loanRatePercent: loanRate,
      loanTenureYears: tenure,
      appreciationPercent: Math.max(0, appreciation - 2),
      rentYieldPercent: rentYield,
      holdYears,
    });
    const highApp = calculateRealEstate({
      propertyPrice: price,
      downPaymentPercent: downPct,
      loanRatePercent: loanRate,
      loanTenureYears: tenure,
      appreciationPercent: appreciation + 2,
      rentYieldPercent: rentYield,
      holdYears,
    });

    return {
      summaryCards: [
        {
          label: t("Tool_real_estate_Result_Equity"),
          value: inr(base.equity),
          footnote: t("Tool_real_estate_Result_EquityFootnote", holdYears),
          variant: "primary" as const,
        },
        {
          label: t("Tool_real_estate_Result_Rent"),
          value: inr(base.totalRentIncome),
          footnote: t("Tool_real_estate_Result_RentFootnote", percent(rentYield)),
        },
        {
          label: t("Tool_real_estate_Result_Emi"),
          value: inr(base.monthlyEmi),
          footnote: t("Tool_real_estate_Result_EmiFootnote", inr(base.loanAmount)),
        },
        {
          label: t("Tool_real_estate_Result_Net"),
          value: inr(base.illustrativeNet),
          footnote: t("Tool_real_estate_Result_NetFootnote"),
          variant: "secure" as const,
        },
      ],
      scenarios: [
        {
          name: t("Tool_real_estate_Scenario_Low"),
          primaryLabel: t("Tool_real_estate_Result_Equity"),
          primaryValue: inr(lowApp.equity),
          secondaryLabel: t("Tool_real_estate_LabelAppreciation"),
          secondaryValue: percent(Math.max(0, appreciation - 2)),
          variant: "worst" as const,
        },
        {
          name: t("Common_Scenario_Base"),
          primaryLabel: t("Tool_real_estate_Result_Equity"),
          primaryValue: inr(base.equity),
          secondaryLabel: t("Tool_real_estate_LabelAppreciation"),
          secondaryValue: percent(appreciation),
          variant: "base" as const,
        },
        {
          name: t("Tool_real_estate_Scenario_High"),
          primaryLabel: t("Tool_real_estate_Result_Equity"),
          primaryValue: inr(highApp.equity),
          secondaryLabel: t("Tool_real_estate_LabelAppreciation"),
          secondaryValue: percent(appreciation + 2),
          variant: "best" as const,
        },
      ],
    };
  }, [price, downPct, loanRate, tenure, appreciation, rentYield, holdYears, t]);

  return (
    <ToolPageShell
      title={t(tool.titleKey)}
      subtitle={t("Tool_real_estate_Subtitle")}
      description={t(tool.descriptionKey)}
      icon={tool.icon}
      educate={
        <>
          <div className="fy-info-box">
            <strong>{t("Common_WhatYouLearn")}</strong>
            <p>{t("Tool_real_estate_LearnText")}</p>
          </div>
          <FormulaCard
            title={t("Common_Formula")}
            code={
              "loan = price − down%\nFV = price × (1+app)^years\nequity ≈ FV − loan balance\nrent = price × yield% × years"
            }
            note={t("Tool_real_estate_FormulaNote")}
          />
        </>
      }
      below={<ToolInfoPanel info={realEstateInfo(t)} />}
    >
      <div className="fy-form-card">
        <h3>{t("Common_YourInputs")}</h3>
        <div className="fy-field">
          <label>{t("Tool_real_estate_LabelPrice")}</label>
          <input
            type="number"
            min={0}
            step={100000}
            inputMode="decimal"
            value={price}
            onChange={(e) => setPrice(Math.max(0, Number(e.target.value) || 0))}
          />
        </div>
        <div className="fy-field">
          <label>{t("Tool_real_estate_LabelDown")}</label>
          <input
            type="number"
            min={0}
            max={100}
            step={1}
            inputMode="decimal"
            value={downPct}
            onChange={(e) => setDownPct(Math.max(0, Number(e.target.value) || 0))}
          />
        </div>
        <div className="fy-field">
          <label>{t("Tool_real_estate_LabelLoanRate")}</label>
          <input
            type="number"
            min={0}
            step={0.1}
            inputMode="decimal"
            value={loanRate}
            onChange={(e) => setLoanRate(Math.max(0, Number(e.target.value) || 0))}
          />
        </div>
        <div className="fy-field">
          <label>{t("Tool_real_estate_LabelTenure")}</label>
          <input
            type="number"
            min={1}
            max={30}
            step={1}
            inputMode="numeric"
            value={tenure}
            onChange={(e) => setTenure(Math.max(1, Number(e.target.value) || 1))}
          />
        </div>
        <div className="fy-field">
          <label>{t("Tool_real_estate_LabelAppreciation")}</label>
          <input
            type="number"
            min={0}
            step={0.1}
            inputMode="decimal"
            value={appreciation}
            onChange={(e) => setAppreciation(Math.max(0, Number(e.target.value) || 0))}
          />
        </div>
        <div className="fy-field">
          <label>{t("Tool_real_estate_LabelYield")}</label>
          <input
            type="number"
            min={0}
            step={0.1}
            inputMode="decimal"
            value={rentYield}
            onChange={(e) => setRentYield(Math.max(0, Number(e.target.value) || 0))}
          />
          <p className="fy-field-hint">{t("Tool_real_estate_YieldHint")}</p>
        </div>
        <div className="fy-field">
          <label>{t("Tool_real_estate_LabelHold")}</label>
          <input
            type="number"
            min={1}
            max={40}
            step={1}
            inputMode="numeric"
            value={holdYears}
            onChange={(e) => setHoldYears(Math.max(1, Number(e.target.value) || 1))}
          />
        </div>
        <button type="button" className="fy-btn-calc">
          {t("Common_Calculate")}
        </button>
      </div>

      <ResultSummaryCards cards={summaryCards} />
      <ScenarioCompare
        title={t("Tool_real_estate_ScenarioTitle")}
        subtitle={t("Tool_real_estate_ScenarioSubtitle")}
        scenarios={scenarios}
      />
      <WorkedExample
        title={t("Tool_real_estate_ExampleTitle")}
        subtitle={t("Tool_real_estate_ExampleSubtitle")}
        steps={exampleSteps}
      />
    </ToolPageShell>
  );
}
