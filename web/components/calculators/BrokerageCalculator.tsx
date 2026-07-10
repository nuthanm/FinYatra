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
  BROKERAGE_STACKS,
  calculateBrokerage,
  type BrokerageFeeMode,
  type BrokerageTradeType,
} from "@/lib/finance/brokerage";
import { inr, percent } from "@/lib/finance/format";
import { getTool } from "@/lib/config/tools";
import { brokerageInfo } from "@/lib/tool-page-content";

export function BrokerageCalculator() {
  const t = useT();
  const tool = getTool("brokerage")!;

  const [tradeValue, setTradeValue] = useState(100_000);
  const [tradeType, setTradeType] = useState<BrokerageTradeType>("delivery");
  const [feeMode, setFeeMode] = useState<BrokerageFeeMode>("flat");
  const [brokeragePercent, setBrokeragePercent] = useState(0.03);
  const [brokerageFlat, setBrokerageFlat] = useState(20);
  const [useCustomFees, setUseCustomFees] = useState(false);
  const [sttPercent, setSttPercent] = useState(0.1);
  const [exchangePercent, setExchangePercent] = useState(0.003);
  const [gstPercent, setGstPercent] = useState(18);

  const exampleSteps = useMemo(
    () => [
      t("Tool_brokerage_ExampleStep_1"),
      t("Tool_brokerage_ExampleStep_2"),
      t("Tool_brokerage_ExampleStep_3"),
      t("Tool_brokerage_ExampleStep_4"),
      t("Tool_brokerage_ExampleStep_5"),
    ],
    [t],
  );

  const { summaryCards, scenarios, detail } = useMemo(() => {
    const stack = BROKERAGE_STACKS[tradeType];
    const inputBase = {
      tradeValue,
      tradeType,
      feeMode,
      brokeragePercent:
        feeMode === "percent" ? brokeragePercent : stack.defaultBrokeragePercent,
      brokerageFlat: feeMode === "flat" ? brokerageFlat : stack.defaultBrokerageFlat,
      sttPercent: useCustomFees ? sttPercent : null,
      exchangePercent: useCustomFees ? exchangePercent : null,
      gstPercent,
    };
    const result = calculateBrokerage(inputBase);
    const delivery = calculateBrokerage({ ...inputBase, tradeType: "delivery" });
    const intraday = calculateBrokerage({ ...inputBase, tradeType: "intraday" });
    const larger = calculateBrokerage({ ...inputBase, tradeValue: tradeValue * 2 });

    return {
      detail: result,
      summaryCards: [
        {
          label: t("Tool_brokerage_Result_Charges"),
          value: inr(result.totalCharges, 2),
          footnote: t("Tool_brokerage_Result_ChargesFootnote"),
          variant: "volatile" as const,
        },
        {
          label: t("Tool_brokerage_Result_Net"),
          value: inr(result.netProceeds, 2),
          footnote: t("Tool_brokerage_Result_NetFootnote"),
          variant: "primary" as const,
        },
        {
          label: t("Tool_brokerage_Result_Brokerage"),
          value: inr(result.brokerage, 2),
          footnote: t(
            "Tool_brokerage_Result_BrokerageFootnote",
            percent(result.brokeragePercentEffective, 3),
          ),
        },
      ],
      scenarios: [
        {
          name: t("Tool_brokerage_Scenario_Delivery"),
          primaryLabel: t("Tool_brokerage_Result_Charges"),
          primaryValue: inr(delivery.totalCharges, 2),
          secondaryLabel: t("Tool_brokerage_Result_Net"),
          secondaryValue: inr(delivery.netProceeds, 2),
          variant: "best",
        },
        {
          name: t("Tool_brokerage_Scenario_Intraday"),
          primaryLabel: t("Tool_brokerage_Result_Charges"),
          primaryValue: inr(intraday.totalCharges, 2),
          secondaryLabel: t("Tool_brokerage_Result_Net"),
          secondaryValue: inr(intraday.netProceeds, 2),
          variant: "base",
        },
        {
          name: t("Tool_brokerage_Scenario_Larger"),
          primaryLabel: t("Tool_brokerage_Result_Charges"),
          primaryValue: inr(larger.totalCharges, 2),
          secondaryLabel: t("Tool_brokerage_LabelTrade"),
          secondaryValue: inr(tradeValue * 2),
          variant: "worst",
        },
      ],
    };
  }, [
    tradeValue,
    tradeType,
    feeMode,
    brokeragePercent,
    brokerageFlat,
    useCustomFees,
    sttPercent,
    exchangePercent,
    gstPercent,
    t,
  ]);

  return (
    <ToolPageShell
      title={t(tool.titleKey)}
      subtitle={t("Tool_brokerage_Subtitle")}
      description={t(tool.descriptionKey)}
      icon={tool.icon}
      educate={
        <>
          <div className="fy-info-box">
            <strong>{t("Common_WhatYouLearn")}</strong>
            <p>{t("Tool_brokerage_LearnText")}</p>
          </div>
          <FormulaCard
            title={t("Common_Formula")}
            code={"Brokerage = % × value or flat\nSTT + Exchange on trade value\nGST = 18% × (brokerage + exchange)\nNet = Trade − total charges"}
            note={t("Tool_brokerage_FormulaNote")}
          />
        </>
      }
      below={<ToolInfoPanel info={brokerageInfo(t)} />}
    >
      <div className="fy-form-card">
        <h3>{t("Common_YourInputs")}</h3>
        <div className="fy-field">
          <label>{t("Tool_brokerage_LabelTrade")}</label>
          <input
            type="number"
            min={0}
            step={1000}
            inputMode="decimal"
            value={tradeValue}
            onChange={(e) => setTradeValue(Math.max(0, Number(e.target.value) || 0))}
          />
        </div>
        <div className="fy-field">
          <label>{t("Tool_brokerage_LabelType")}</label>
          <select
            value={tradeType}
            onChange={(e) => setTradeType(e.target.value as BrokerageTradeType)}
          >
            <option value="delivery">{t("Tool_brokerage_Type_delivery")}</option>
            <option value="intraday">{t("Tool_brokerage_Type_intraday")}</option>
          </select>
          <p className="fy-field-hint">{t("Tool_brokerage_TypeHint")}</p>
        </div>
        <div className="fy-field">
          <label>{t("Tool_brokerage_LabelFeeMode")}</label>
          <select
            value={feeMode}
            onChange={(e) => setFeeMode(e.target.value as BrokerageFeeMode)}
          >
            <option value="flat">{t("Tool_brokerage_FeeMode_flat")}</option>
            <option value="percent">{t("Tool_brokerage_FeeMode_percent")}</option>
          </select>
        </div>
        {feeMode === "flat" ? (
          <div className="fy-field">
            <label>{t("Tool_brokerage_LabelFlat")}</label>
            <input
              type="number"
              min={0}
              step={1}
              inputMode="decimal"
              value={brokerageFlat}
              onChange={(e) => setBrokerageFlat(Math.max(0, Number(e.target.value) || 0))}
            />
          </div>
        ) : (
          <div className="fy-field">
            <label>{t("Tool_brokerage_LabelPercent")}</label>
            <input
              type="number"
              min={0}
              step={0.01}
              inputMode="decimal"
              value={brokeragePercent}
              onChange={(e) => setBrokeragePercent(Math.max(0, Number(e.target.value) || 0))}
            />
          </div>
        )}
        <div className="fy-field">
          <label>
            <input
              type="checkbox"
              checked={useCustomFees}
              onChange={(e) => setUseCustomFees(e.target.checked)}
            />{" "}
            {t("Tool_brokerage_LabelCustomFees")}
          </label>
        </div>
        {useCustomFees && (
          <>
            <div className="fy-field">
              <label>{t("Tool_brokerage_LabelStt")}</label>
              <input
                type="number"
                min={0}
                step={0.001}
                inputMode="decimal"
                value={sttPercent}
                onChange={(e) => setSttPercent(Math.max(0, Number(e.target.value) || 0))}
              />
            </div>
            <div className="fy-field">
              <label>{t("Tool_brokerage_LabelExchange")}</label>
              <input
                type="number"
                min={0}
                step={0.001}
                inputMode="decimal"
                value={exchangePercent}
                onChange={(e) => setExchangePercent(Math.max(0, Number(e.target.value) || 0))}
              />
            </div>
          </>
        )}
        <div className="fy-field">
          <label>{t("Tool_brokerage_LabelGst")}</label>
          <input
            type="number"
            min={0}
            max={28}
            step={1}
            inputMode="decimal"
            value={gstPercent}
            onChange={(e) => setGstPercent(Math.max(0, Number(e.target.value) || 0))}
          />
        </div>
        <button type="button" className="fy-btn-calc">
          {t("Common_Calculate")}
        </button>
      </div>

      <div className="fy-info-box fy-tax-verdict">
        <strong>{t("Tool_brokerage_BreakdownTitle")}</strong>
        <p>
          {t(
            "Tool_brokerage_BreakdownBody",
            inr(detail.brokerage, 2),
            inr(detail.stt, 2),
            inr(detail.exchange, 2),
            inr(detail.gst, 2),
            inr(detail.totalCharges, 2),
          )}
        </p>
      </div>

      <ResultSummaryCards cards={summaryCards} />
      <ScenarioCompare
        title={t("Tool_brokerage_ScenarioTitle")}
        subtitle={t("Tool_brokerage_ScenarioSubtitle")}
        scenarios={scenarios}
      />
      <WorkedExample
        title={t("Tool_brokerage_ExampleTitle")}
        subtitle={t("Tool_brokerage_ExampleSubtitle")}
        steps={exampleSteps}
      />
    </ToolPageShell>
  );
}
