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
  calculateLeaveEncashment,
  LEAVE_ENCASHMENT_DEFAULT_REMAINING,
  type LeaveEncashmentRateMode,
} from "@/lib/finance/leaveEncashment";
import { inr } from "@/lib/finance/format";
import { getTool } from "@/lib/config/tools";
import { leaveEncashmentInfo } from "@/lib/tool-page-content";

export function LeaveEncashmentCalculator() {
  const t = useT();
  const tool = getTool("leave-encashment")!;

  const [rateMode, setRateMode] = useState<LeaveEncashmentRateMode>("monthly");
  const [monthlyBasic, setMonthlyBasic] = useState(40_000);
  const [monthlyDa, setMonthlyDa] = useState(10_000);
  const [workingDays, setWorkingDays] = useState(30);
  const [dailyRate, setDailyRate] = useState(1_667);
  const [leaveDays, setLeaveDays] = useState(30);
  const [isGovernment, setIsGovernment] = useState(false);
  const [exemptionRemaining, setExemptionRemaining] = useState(LEAVE_ENCASHMENT_DEFAULT_REMAINING);

  const exampleSteps = useMemo(
    () => [
      t("Tool_leave_encashment_ExampleStep_1"),
      t("Tool_leave_encashment_ExampleStep_2"),
      t("Tool_leave_encashment_ExampleStep_3"),
      t("Tool_leave_encashment_ExampleStep_4"),
      t("Tool_leave_encashment_ExampleStep_5"),
    ],
    [t],
  );

  const { summaryCards, scenarios } = useMemo(() => {
    const baseInput = {
      rateMode,
      monthlyBasic,
      monthlyDa,
      workingDays,
      dailyRate,
      leaveDays,
      isGovernment,
      exemptionRemaining,
    };
    const result = calculateLeaveEncashment(baseInput);
    const fewer = calculateLeaveEncashment({ ...baseInput, leaveDays: Math.max(0, leaveDays - 10) });
    const more = calculateLeaveEncashment({ ...baseInput, leaveDays: leaveDays + 15 });

    return {
      summaryCards: [
        {
          label: t("Tool_leave_encashment_Result_Amount"),
          value: inr(result.amount),
          footnote: t("Tool_leave_encashment_Result_AmountFootnote", inr(result.dailyRate)),
          variant: "primary" as const,
        },
        {
          label: t("Tool_leave_encashment_Result_Exempt"),
          value: inr(result.exempt),
          footnote: isGovernment
            ? t("Tool_leave_encashment_Result_ExemptGovt")
            : t("Tool_leave_encashment_Result_ExemptFootnote", inr(result.exemptionCap)),
          variant: "secure" as const,
        },
        {
          label: t("Tool_leave_encashment_Result_Taxable"),
          value: inr(result.taxable),
          footnote: t("Tool_leave_encashment_Result_TaxableFootnote"),
          variant: result.taxable > 0 ? ("volatile" as const) : ("default" as const),
        },
      ],
      scenarios: [
        {
          name: t("Tool_leave_encashment_Scenario_FewerDays"),
          primaryLabel: t("Tool_leave_encashment_Result_Amount"),
          primaryValue: inr(fewer.amount),
          secondaryLabel: t("Tool_leave_encashment_Result_Taxable"),
          secondaryValue: inr(fewer.taxable),
          variant: "worst",
        },
        {
          name: t("Common_Scenario_Base"),
          primaryLabel: t("Tool_leave_encashment_Result_Amount"),
          primaryValue: inr(result.amount),
          secondaryLabel: t("Tool_leave_encashment_Result_Exempt"),
          secondaryValue: inr(result.exempt),
          variant: "base",
        },
        {
          name: t("Tool_leave_encashment_Scenario_MoreDays"),
          primaryLabel: t("Tool_leave_encashment_Result_Amount"),
          primaryValue: inr(more.amount),
          secondaryLabel: t("Tool_leave_encashment_Result_Taxable"),
          secondaryValue: inr(more.taxable),
          variant: "best",
        },
      ],
    };
  }, [
    rateMode,
    monthlyBasic,
    monthlyDa,
    workingDays,
    dailyRate,
    leaveDays,
    isGovernment,
    exemptionRemaining,
    t,
  ]);

  return (
    <ToolPageShell
      title={t(tool.titleKey)}
      subtitle={t("Tool_leave_encashment_Subtitle")}
      description={t(tool.descriptionKey)}
      icon={tool.icon}
      educate={
        <>
          <div className="fy-info-box">
            <strong>{t("Common_WhatYouLearn")}</strong>
            <p>{t("Tool_leave_encashment_LearnText")}</p>
          </div>
          <FormulaCard
            title={t("Common_Formula")}
            code={"Amount = (Basic + DA) / 30 × leave days\nTaxable ≈ max(0, Amount − exemption remaining)"}
            note={t("Tool_leave_encashment_FormulaNote")}
          />
        </>
      }
      below={<ToolInfoPanel info={leaveEncashmentInfo(t)} />}
    >
      <div className="fy-form-card">
        <h3>{t("Common_YourInputs")}</h3>
        <div className="fy-field">
          <label>{t("Tool_leave_encashment_LabelRateMode")}</label>
          <select value={rateMode} onChange={(e) => setRateMode(e.target.value as LeaveEncashmentRateMode)}>
            <option value="monthly">{t("Tool_leave_encashment_RateMode_Monthly")}</option>
            <option value="daily">{t("Tool_leave_encashment_RateMode_Daily")}</option>
          </select>
        </div>
        {rateMode === "monthly" ? (
          <>
            <div className="fy-field">
              <label>{t("Tool_leave_encashment_LabelBasic")}</label>
              <input
                type="number"
                min={0}
                step={1000}
                inputMode="decimal"
                value={monthlyBasic}
                onChange={(e) => setMonthlyBasic(Math.max(0, Number(e.target.value) || 0))}
              />
            </div>
            <div className="fy-field">
              <label>{t("Tool_leave_encashment_LabelDa")}</label>
              <input
                type="number"
                min={0}
                step={500}
                inputMode="decimal"
                value={monthlyDa}
                onChange={(e) => setMonthlyDa(Math.max(0, Number(e.target.value) || 0))}
              />
            </div>
            <div className="fy-field">
              <label>{t("Tool_leave_encashment_LabelWorkingDays")}</label>
              <input
                type="number"
                min={1}
                max={31}
                step={1}
                inputMode="decimal"
                value={workingDays}
                onChange={(e) => setWorkingDays(Math.max(1, Number(e.target.value) || 30))}
              />
              <p className="fy-field-hint">{t("Tool_leave_encashment_WorkingDaysHint")}</p>
            </div>
          </>
        ) : (
          <div className="fy-field">
            <label>{t("Tool_leave_encashment_LabelDailyRate")}</label>
            <input
              type="number"
              min={0}
              step={100}
              inputMode="decimal"
              value={dailyRate}
              onChange={(e) => setDailyRate(Math.max(0, Number(e.target.value) || 0))}
            />
            <p className="fy-field-hint">{t("Tool_leave_encashment_DailyRateHint")}</p>
          </div>
        )}
        <div className="fy-field">
          <label>{t("Tool_leave_encashment_LabelLeaveDays")}</label>
          <input
            type="number"
            min={0}
            max={365}
            step={1}
            inputMode="decimal"
            value={leaveDays}
            onChange={(e) => setLeaveDays(Math.max(0, Number(e.target.value) || 0))}
          />
        </div>
        <div className="fy-field">
          <label>
            <input type="checkbox" checked={isGovernment} onChange={(e) => setIsGovernment(e.target.checked)} />{" "}
            {t("Tool_leave_encashment_LabelGovernment")}
          </label>
        </div>
        {!isGovernment && (
          <div className="fy-field">
            <label>{t("Tool_leave_encashment_LabelExemptionRemaining")}</label>
            <input
              type="number"
              min={0}
              step={50_000}
              inputMode="decimal"
              value={exemptionRemaining}
              onChange={(e) => setExemptionRemaining(Math.max(0, Number(e.target.value) || 0))}
            />
            <p className="fy-field-hint">{t("Tool_leave_encashment_ExemptionHint")}</p>
          </div>
        )}
        <button type="button" className="fy-btn-calc">
          {t("Common_Calculate")}
        </button>
      </div>

      <ResultSummaryCards cards={summaryCards} />
      <ScenarioCompare
        title={t("Tool_leave_encashment_ScenarioTitle")}
        subtitle={t("Tool_leave_encashment_ScenarioSubtitle")}
        scenarios={scenarios}
      />
      <WorkedExample
        title={t("Tool_leave_encashment_ExampleTitle")}
        subtitle={t("Tool_leave_encashment_ExampleSubtitle")}
        steps={exampleSteps}
      />
    </ToolPageShell>
  );
}
