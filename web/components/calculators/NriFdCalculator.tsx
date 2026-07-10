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
import { calculateNriFd, type NriFdAccountType } from "@/lib/finance/nriFd";
import { inr, percent } from "@/lib/finance/format";
import { getTool } from "@/lib/config/tools";
import { nriFdInfo } from "@/lib/tool-page-content";

export function NriFdCalculator() {
  const t = useT();
  const tool = getTool("nri-fd")!;

  const [deposit, setDeposit] = useState(10_00_000);
  const [rate, setRate] = useState(6.5);
  const [years, setYears] = useState(3);
  const [accountType, setAccountType] = useState<NriFdAccountType>("nre");

  const exampleSteps = useMemo(
    () => [
      t("Tool_nri_fd_ExampleStep_1"),
      t("Tool_nri_fd_ExampleStep_2"),
      t("Tool_nri_fd_ExampleStep_3"),
      t("Tool_nri_fd_ExampleStep_4"),
      t("Tool_nri_fd_ExampleStep_5"),
    ],
    [t],
  );

  const { summaryCards, scenarios, result } = useMemo(() => {
    const result = calculateNriFd({
      deposit,
      annualRatePercent: rate,
      years,
      accountType,
    });
    const otherType = calculateNriFd({
      deposit,
      annualRatePercent: rate,
      years,
      accountType: accountType === "nre" ? "nro" : "nre",
    });
    const longer = calculateNriFd({
      deposit,
      annualRatePercent: rate,
      years: years + 2,
      accountType,
    });

    return {
      result,
      summaryCards: [
        {
          label: t("Tool_nri_fd_Result_NetMaturity"),
          value: inr(result.netMaturity),
          footnote: t("Tool_nri_fd_Result_NetMaturityFootnote", percent(rate)),
          variant: "primary" as const,
        },
        {
          label: t("Tool_nri_fd_Result_Interest"),
          value: inr(result.netInterest),
          footnote: result.taxFreeInIndia
            ? t("Tool_nri_fd_Result_InterestFootnoteNre")
            : t("Tool_nri_fd_Result_InterestFootnoteNro", inr(result.tds)),
          variant: "secure" as const,
        },
        {
          label: t("Tool_nri_fd_Result_Gross"),
          value: inr(result.maturityGross),
          footnote: t("Tool_nri_fd_Result_GrossFootnote"),
        },
      ],
      scenarios: [
        {
          name:
            accountType === "nre"
              ? t("Tool_nri_fd_Scenario_Nro")
              : t("Tool_nri_fd_Scenario_Nre"),
          primaryLabel: t("Tool_nri_fd_Result_NetMaturity"),
          primaryValue: inr(otherType.netMaturity),
          secondaryLabel: t("Tool_nri_fd_Result_Tds"),
          secondaryValue: inr(otherType.tds),
          variant: "worst" as const,
        },
        {
          name: t("Common_Scenario_Base"),
          primaryLabel: t("Tool_nri_fd_Result_NetMaturity"),
          primaryValue: inr(result.netMaturity),
          secondaryLabel: t("Tool_nri_fd_Result_Interest"),
          secondaryValue: inr(result.netInterest),
          variant: "base" as const,
        },
        {
          name: t("Tool_nri_fd_Scenario_Longer"),
          primaryLabel: t("Tool_nri_fd_Result_NetMaturity"),
          primaryValue: inr(longer.netMaturity),
          secondaryLabel: t("Tool_nri_fd_Result_Interest"),
          secondaryValue: inr(longer.netInterest),
          variant: "best" as const,
        },
      ],
    };
  }, [deposit, rate, years, accountType, t]);

  return (
    <ToolPageShell
      title={t(tool.titleKey)}
      subtitle={t("Tool_nri_fd_Subtitle")}
      description={t(tool.descriptionKey)}
      icon={tool.icon}
      educate={
        <>
          <div className="fy-info-box">
            <strong>{t("Common_WhatYouLearn")}</strong>
            <p>{t("Tool_nri_fd_LearnText")}</p>
          </div>
          <FormulaCard
            title={t("Common_Formula")}
            code={
              "Maturity = P × (1 + r/n)^(n×t)\nNRE: interest tax-free in India\nNRO: TDS ≈ 30% on interest"
            }
            note={t("Tool_nri_fd_FormulaNote")}
          />
        </>
      }
      below={<ToolInfoPanel info={nriFdInfo(t)} />}
    >
      <div className="fy-form-card">
        <h3>{t("Common_YourInputs")}</h3>
        <div className="fy-field">
          <label>{t("Tool_nri_fd_LabelDeposit")}</label>
          <input
            type="number"
            min={0}
            step={50000}
            inputMode="decimal"
            value={deposit}
            onChange={(e) => setDeposit(Math.max(0, Number(e.target.value) || 0))}
          />
        </div>
        <div className="fy-field">
          <label>{t("Tool_nri_fd_LabelRate")}</label>
          <input
            type="number"
            min={0}
            step={0.1}
            inputMode="decimal"
            value={rate}
            onChange={(e) => setRate(Math.max(0, Number(e.target.value) || 0))}
          />
        </div>
        <div className="fy-field">
          <label>{t("Tool_nri_fd_LabelYears")}</label>
          <input
            type="number"
            min={0.25}
            step={0.25}
            inputMode="decimal"
            value={years}
            onChange={(e) => setYears(Math.max(0.25, Number(e.target.value) || 1))}
          />
        </div>
        <div className="fy-field">
          <label>{t("Tool_nri_fd_LabelAccount")}</label>
          <select
            value={accountType}
            onChange={(e) => setAccountType(e.target.value as NriFdAccountType)}
          >
            <option value="nre">{t("Tool_nri_fd_Account_Nre")}</option>
            <option value="nro">{t("Tool_nri_fd_Account_Nro")}</option>
          </select>
        </div>
        <button type="button" className="fy-btn-calc">
          {t("Common_Calculate")}
        </button>
      </div>

      <ResultSummaryCards cards={summaryCards} />
      <div className="fy-info-box">
        <p>
          {result.taxFreeInIndia
            ? t("Tool_nri_fd_TaxNote_Nre")
            : t("Tool_nri_fd_TaxNote_Nro", inr(result.tds))}
        </p>
      </div>
      <ScenarioCompare
        title={t("Tool_nri_fd_ScenarioTitle")}
        subtitle={t("Tool_nri_fd_ScenarioSubtitle")}
        scenarios={scenarios}
      />
      <WorkedExample
        title={t("Tool_nri_fd_ExampleTitle")}
        subtitle={t("Tool_nri_fd_ExampleSubtitle")}
        steps={exampleSteps}
      />
    </ToolPageShell>
  );
}
