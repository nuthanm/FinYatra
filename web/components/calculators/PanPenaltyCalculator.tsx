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
  calculatePanPenalty,
  type PanPenaltyIssue,
} from "@/lib/finance/panPenalty";
import { inr } from "@/lib/finance/format";
import { getTool } from "@/lib/config/tools";
import { panPenaltyInfo } from "@/lib/tool-page-content";

export function PanPenaltyCalculator() {
  const t = useT();
  const tool = getTool("pan-penalty")!;

  const [issue, setIssue] = useState<PanPenaltyIssue>("both");
  const [afterDeadline, setAfterDeadline] = useState(true);
  const [paymentWithoutPan, setPaymentWithoutPan] = useState(100_000);
  const [normalTdsPercent, setNormalTdsPercent] = useState(10);

  const exampleSteps = useMemo(
    () => [
      t("Tool_pan_penalty_ExampleStep_1"),
      t("Tool_pan_penalty_ExampleStep_2"),
      t("Tool_pan_penalty_ExampleStep_3"),
      t("Tool_pan_penalty_ExampleStep_4"),
      t("Tool_pan_penalty_ExampleStep_5"),
    ],
    [t],
  );

  const { summaryCards, scenarios } = useMemo(() => {
    const result = calculatePanPenalty({
      issue,
      afterDeadline,
      paymentWithoutPan,
      normalTdsPercent,
    });
    const lateOnly = calculatePanPenalty({
      issue: "late_link",
      afterDeadline,
      paymentWithoutPan,
      normalTdsPercent,
    });
    const noPanOnly = calculatePanPenalty({
      issue: "no_pan",
      afterDeadline,
      paymentWithoutPan,
      normalTdsPercent,
    });
    const before = calculatePanPenalty({
      issue,
      afterDeadline: false,
      paymentWithoutPan,
      normalTdsPercent,
    });

    return {
      summaryCards: [
        {
          label: t("Tool_pan_penalty_Result_Total"),
          value: inr(result.totalIllustrative),
          footnote: t("Tool_pan_penalty_Result_TotalFootnote"),
          variant: "primary" as const,
        },
        {
          label: t("Tool_pan_penalty_Result_LateLink"),
          value: inr(result.lateLinkPenalty),
          footnote: afterDeadline
            ? t("Tool_pan_penalty_Result_LateAfter")
            : t("Tool_pan_penalty_Result_LateBefore"),
        },
        {
          label: t("Tool_pan_penalty_Result_ExtraTds"),
          value: inr(result.extraTds206aa + result.section272bPenalty),
          footnote: t(
            "Tool_pan_penalty_Result_ExtraFootnote",
            inr(result.extraTds206aa),
            inr(result.section272bPenalty),
          ),
          variant: "volatile" as const,
        },
      ],
      scenarios: [
        {
          name: t("Tool_pan_penalty_Scenario_Late"),
          primaryLabel: t("Tool_pan_penalty_Result_Total"),
          primaryValue: inr(lateOnly.totalIllustrative),
          secondaryLabel: t("Tool_pan_penalty_Result_LateLink"),
          secondaryValue: inr(lateOnly.lateLinkPenalty),
          variant: "base" as const,
        },
        {
          name: t("Tool_pan_penalty_Scenario_NoPan"),
          primaryLabel: t("Tool_pan_penalty_Result_Total"),
          primaryValue: inr(noPanOnly.totalIllustrative),
          secondaryLabel: t("Tool_pan_penalty_Result_ExtraTds"),
          secondaryValue: inr(noPanOnly.extraTds206aa),
          variant: "worst" as const,
        },
        {
          name: t("Tool_pan_penalty_Scenario_Before"),
          primaryLabel: t("Tool_pan_penalty_Result_Total"),
          primaryValue: inr(before.totalIllustrative),
          secondaryLabel: t("Tool_pan_penalty_Result_LateLink"),
          secondaryValue: inr(before.lateLinkPenalty),
          variant: "best" as const,
        },
      ],
    };
  }, [issue, afterDeadline, paymentWithoutPan, normalTdsPercent, t]);

  return (
    <ToolPageShell
      title={t(tool.titleKey)}
      subtitle={t("Tool_pan_penalty_Subtitle")}
      description={t(tool.descriptionKey)}
      icon={tool.icon}
      educate={
        <>
          <div className="fy-info-box">
            <strong>{t("Common_WhatYouLearn")}</strong>
            <p>{t("Tool_pan_penalty_LearnText")}</p>
          </div>
          <FormulaCard
            title={t("Common_Formula")}
            code={"Late link ≈ ₹500 / ₹1,000\n206AA TDS = 20% if no PAN\nExtra ≈ 20% − normal%\n+ illustrative 272B"}
            note={t("Tool_pan_penalty_FormulaNote")}
          />
        </>
      }
      below={<ToolInfoPanel info={panPenaltyInfo(t)} />}
    >
      <div className="fy-form-card">
        <h3>{t("Common_YourInputs")}</h3>
        <div className="fy-field">
          <label>{t("Tool_pan_penalty_LabelIssue")}</label>
          <select value={issue} onChange={(e) => setIssue(e.target.value as PanPenaltyIssue)}>
            <option value="late_link">{t("Tool_pan_penalty_Issue_Late")}</option>
            <option value="no_pan">{t("Tool_pan_penalty_Issue_NoPan")}</option>
            <option value="both">{t("Tool_pan_penalty_Issue_Both")}</option>
          </select>
        </div>
        <div className="fy-field">
          <label>{t("Tool_pan_penalty_LabelDeadline")}</label>
          <select
            value={afterDeadline ? "after" : "before"}
            onChange={(e) => setAfterDeadline(e.target.value === "after")}
          >
            <option value="before">{t("Tool_pan_penalty_Deadline_Before")}</option>
            <option value="after">{t("Tool_pan_penalty_Deadline_After")}</option>
          </select>
        </div>
        <div className="fy-field">
          <label>{t("Tool_pan_penalty_LabelPayment")}</label>
          <input
            type="number"
            min={0}
            step={1000}
            inputMode="decimal"
            value={paymentWithoutPan}
            onChange={(e) => setPaymentWithoutPan(Math.max(0, Number(e.target.value) || 0))}
          />
          <p className="fy-field-hint">{t("Tool_pan_penalty_PaymentHint")}</p>
        </div>
        <div className="fy-field">
          <label>{t("Tool_pan_penalty_LabelNormalTds")}</label>
          <input
            type="number"
            min={0}
            max={30}
            step={1}
            inputMode="decimal"
            value={normalTdsPercent}
            onChange={(e) => setNormalTdsPercent(Math.max(0, Number(e.target.value) || 0))}
          />
        </div>
        <button type="button" className="fy-btn-calc">
          {t("Common_Calculate")}
        </button>
      </div>

      <ResultSummaryCards cards={summaryCards} />
      <ScenarioCompare
        title={t("Tool_pan_penalty_ScenarioTitle")}
        subtitle={t("Tool_pan_penalty_ScenarioSubtitle")}
        scenarios={scenarios}
      />
      <WorkedExample
        title={t("Tool_pan_penalty_ExampleTitle")}
        subtitle={t("Tool_pan_penalty_ExampleSubtitle")}
        steps={exampleSteps}
      />
    </ToolPageShell>
  );
}
