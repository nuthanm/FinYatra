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
import { calculateNetWorth } from "@/lib/finance/netWorth";
import { inr } from "@/lib/finance/format";
import { getTool } from "@/lib/config/tools";
import { netWorthInfo } from "@/lib/tool-page-content";

export function NetWorthCalculator() {
  const t = useT();
  const tool = getTool("net-worth")!;

  const [cashAndBank, setCashAndBank] = useState(200_000);
  const [investments, setInvestments] = useState(1_500_000);
  const [property, setProperty] = useState(5_000_000);
  const [otherAssets, setOtherAssets] = useState(100_000);
  const [homeLoan, setHomeLoan] = useState(3_000_000);
  const [otherLoans, setOtherLoans] = useState(200_000);
  const [creditCards, setCreditCards] = useState(50_000);
  const [otherLiabilities, setOtherLiabilities] = useState(0);

  const exampleSteps = useMemo(
    () => [
      t("Tool_net_worth_ExampleStep_1"),
      t("Tool_net_worth_ExampleStep_2"),
      t("Tool_net_worth_ExampleStep_3"),
      t("Tool_net_worth_ExampleStep_4"),
      t("Tool_net_worth_ExampleStep_5"),
    ],
    [t],
  );

  const { summaryCards, scenarios } = useMemo(() => {
    const input = {
      cashAndBank,
      investments,
      property,
      otherAssets,
      homeLoan,
      otherLoans,
      creditCards,
      otherLiabilities,
    };
    const result = calculateNetWorth(input);
    const noDebt = calculateNetWorth({
      ...input,
      homeLoan: 0,
      otherLoans: 0,
      creditCards: 0,
      otherLiabilities: 0,
    });
    const higherDebt = calculateNetWorth({
      ...input,
      homeLoan: homeLoan * 1.2,
      otherLoans: otherLoans * 1.2,
    });

    return {
      summaryCards: [
        {
          label: t("Tool_net_worth_Result_Net"),
          value: inr(result.netWorth),
          footnote: t("Tool_net_worth_Result_NetFootnote"),
          variant: (result.netWorth >= 0 ? "primary" : "volatile") as "primary" | "volatile",
        },
        {
          label: t("Tool_net_worth_Result_Assets"),
          value: inr(result.totalAssets),
          footnote: t("Tool_net_worth_Result_AssetsFootnote"),
          variant: "secure" as const,
        },
        {
          label: t("Tool_net_worth_Result_Liabilities"),
          value: inr(result.totalLiabilities),
          footnote: t("Tool_net_worth_Result_LiabilitiesFootnote"),
          variant: "volatile" as const,
        },
      ],
      scenarios: [
        {
          name: t("Tool_net_worth_Scenario_Current"),
          primaryLabel: t("Tool_net_worth_Result_Net"),
          primaryValue: inr(result.netWorth),
          secondaryLabel: t("Tool_net_worth_Result_Liabilities"),
          secondaryValue: inr(result.totalLiabilities),
          variant: "base",
        },
        {
          name: t("Tool_net_worth_Scenario_NoDebt"),
          primaryLabel: t("Tool_net_worth_Result_Net"),
          primaryValue: inr(noDebt.netWorth),
          secondaryLabel: t("Tool_net_worth_Result_Liabilities"),
          secondaryValue: inr(noDebt.totalLiabilities),
          variant: "best",
        },
        {
          name: t("Tool_net_worth_Scenario_MoreDebt"),
          primaryLabel: t("Tool_net_worth_Result_Net"),
          primaryValue: inr(higherDebt.netWorth),
          secondaryLabel: t("Tool_net_worth_Result_Liabilities"),
          secondaryValue: inr(higherDebt.totalLiabilities),
          variant: "worst",
        },
      ],
    };
  }, [
    cashAndBank,
    investments,
    property,
    otherAssets,
    homeLoan,
    otherLoans,
    creditCards,
    otherLiabilities,
    t,
  ]);

  return (
    <ToolPageShell
      title={t(tool.titleKey)}
      subtitle={t("Tool_net_worth_Subtitle")}
      description={t(tool.descriptionKey)}
      icon={tool.icon}
      educate={
        <>
          <div className="fy-info-box">
            <strong>{t("Common_WhatYouLearn")}</strong>
            <p>{t("Tool_net_worth_LearnText")}</p>
          </div>
          <FormulaCard
            title={t("Common_Formula")}
            code={"netWorth = totalAssets − totalLiabilities"}
            note={t("Tool_net_worth_FormulaNote")}
          />
        </>
      }
      below={<ToolInfoPanel info={netWorthInfo(t)} />}
    >
      <div className="fy-form-card">
        <h3>{t("Tool_net_worth_AssetsHeading")}</h3>
        <div className="fy-field">
          <label>{t("Tool_net_worth_LabelCash")}</label>
          <input
            type="number"
            min={0}
            step={10000}
            inputMode="decimal"
            value={cashAndBank}
            onChange={(e) => setCashAndBank(Math.max(0, Number(e.target.value) || 0))}
          />
        </div>
        <div className="fy-field">
          <label>{t("Tool_net_worth_LabelInvestments")}</label>
          <input
            type="number"
            min={0}
            step={10000}
            inputMode="decimal"
            value={investments}
            onChange={(e) => setInvestments(Math.max(0, Number(e.target.value) || 0))}
          />
        </div>
        <div className="fy-field">
          <label>{t("Tool_net_worth_LabelProperty")}</label>
          <input
            type="number"
            min={0}
            step={50000}
            inputMode="decimal"
            value={property}
            onChange={(e) => setProperty(Math.max(0, Number(e.target.value) || 0))}
          />
        </div>
        <div className="fy-field">
          <label>{t("Tool_net_worth_LabelOtherAssets")}</label>
          <input
            type="number"
            min={0}
            step={5000}
            inputMode="decimal"
            value={otherAssets}
            onChange={(e) => setOtherAssets(Math.max(0, Number(e.target.value) || 0))}
          />
        </div>

        <h3>{t("Tool_net_worth_LiabilitiesHeading")}</h3>
        <div className="fy-field">
          <label>{t("Tool_net_worth_LabelHomeLoan")}</label>
          <input
            type="number"
            min={0}
            step={50000}
            inputMode="decimal"
            value={homeLoan}
            onChange={(e) => setHomeLoan(Math.max(0, Number(e.target.value) || 0))}
          />
        </div>
        <div className="fy-field">
          <label>{t("Tool_net_worth_LabelOtherLoans")}</label>
          <input
            type="number"
            min={0}
            step={10000}
            inputMode="decimal"
            value={otherLoans}
            onChange={(e) => setOtherLoans(Math.max(0, Number(e.target.value) || 0))}
          />
        </div>
        <div className="fy-field">
          <label>{t("Tool_net_worth_LabelCreditCards")}</label>
          <input
            type="number"
            min={0}
            step={1000}
            inputMode="decimal"
            value={creditCards}
            onChange={(e) => setCreditCards(Math.max(0, Number(e.target.value) || 0))}
          />
        </div>
        <div className="fy-field">
          <label>{t("Tool_net_worth_LabelOtherLiabilities")}</label>
          <input
            type="number"
            min={0}
            step={1000}
            inputMode="decimal"
            value={otherLiabilities}
            onChange={(e) => setOtherLiabilities(Math.max(0, Number(e.target.value) || 0))}
          />
        </div>
        <button type="button" className="fy-btn-calc">
          {t("Common_Calculate")}
        </button>
      </div>

      <ResultSummaryCards cards={summaryCards} />
      <ScenarioCompare
        title={t("Tool_net_worth_ScenarioTitle")}
        subtitle={t("Tool_net_worth_ScenarioSubtitle")}
        scenarios={scenarios}
      />
      <WorkedExample
        title={t("Tool_net_worth_ExampleTitle")}
        subtitle={t("Tool_net_worth_ExampleSubtitle")}
        steps={exampleSteps}
      />
    </ToolPageShell>
  );
}
