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
  calculatePanAadhaarLink,
  PAN_PENALTY_AFTER_DEADLINE,
  PAN_PENALTY_BEFORE_DEADLINE,
  type PanLinkStatus,
} from "@/lib/finance/panAadhaarLink";
import { inr } from "@/lib/finance/format";
import { getTool } from "@/lib/config/tools";
import { panAadhaarLinkInfo } from "@/lib/tool-page-content";

export function PanAadhaarLinkCalculator() {
  const t = useT();
  const tool = getTool("pan-aadhaar-link")!;

  const [status, setStatus] = useState<PanLinkStatus>("not_linked");
  const [afterDeadline, setAfterDeadline] = useState(true);

  const exampleSteps = useMemo(
    () => [
      t("Tool_pan_aadhaar_link_ExampleStep_1"),
      t("Tool_pan_aadhaar_link_ExampleStep_2"),
      t("Tool_pan_aadhaar_link_ExampleStep_3"),
      t("Tool_pan_aadhaar_link_ExampleStep_4"),
      t("Tool_pan_aadhaar_link_ExampleStep_5"),
    ],
    [t],
  );

  const consequenceMap = {
    ok: "Tool_pan_aadhaar_link_Consequence_Ok",
    inoperative: "Tool_pan_aadhaar_link_Consequence_Inoperative",
    unknown: "Tool_pan_aadhaar_link_Consequence_Unknown",
  } as const;

  const { summaryCards, scenarios, consequence } = useMemo(() => {
    const result = calculatePanAadhaarLink({ status, afterDeadline });
    const before = calculatePanAadhaarLink({ status: "not_linked", afterDeadline: false });
    const after = calculatePanAadhaarLink({ status: "not_linked", afterDeadline: true });
    const linked = calculatePanAadhaarLink({ status: "linked", afterDeadline });

    return {
      consequence: t(consequenceMap[result.consequenceKey]),
      summaryCards: [
        {
          label: t("Tool_pan_aadhaar_link_Result_Penalty"),
          value: inr(result.estimatedPenalty),
          footnote: t("Tool_pan_aadhaar_link_Result_PenaltyFootnote"),
          variant: "primary" as const,
        },
        {
          label: t("Tool_pan_aadhaar_link_Result_Status"),
          value: t(`Tool_pan_aadhaar_link_Status_${status}`),
          footnote: t("Tool_pan_aadhaar_link_Result_StatusFootnote"),
        },
        {
          label: t("Tool_pan_aadhaar_link_Result_Edu"),
          value: t("Tool_pan_aadhaar_link_EduBadge"),
          footnote: t("Tool_pan_aadhaar_link_Result_EduFootnote"),
          variant: "volatile" as const,
        },
      ],
      scenarios: [
        {
          name: t("Tool_pan_aadhaar_link_Scenario_Before"),
          primaryLabel: t("Tool_pan_aadhaar_link_Result_Penalty"),
          primaryValue: inr(before.estimatedPenalty),
          secondaryLabel: t("Tool_pan_aadhaar_link_LabelDeadline"),
          secondaryValue: t("Tool_pan_aadhaar_link_Deadline_Before"),
          variant: "best",
        },
        {
          name: t("Tool_pan_aadhaar_link_Scenario_After"),
          primaryLabel: t("Tool_pan_aadhaar_link_Result_Penalty"),
          primaryValue: inr(after.estimatedPenalty),
          secondaryLabel: t("Tool_pan_aadhaar_link_LabelDeadline"),
          secondaryValue: t("Tool_pan_aadhaar_link_Deadline_After"),
          variant: "worst",
        },
        {
          name: t("Tool_pan_aadhaar_link_Scenario_Linked"),
          primaryLabel: t("Tool_pan_aadhaar_link_Result_Penalty"),
          primaryValue: inr(linked.estimatedPenalty),
          secondaryLabel: t("Tool_pan_aadhaar_link_Result_Status"),
          secondaryValue: t("Tool_pan_aadhaar_link_Status_linked"),
          variant: "base",
        },
      ],
    };
  }, [status, afterDeadline, t]);

  return (
    <ToolPageShell
      title={t(tool.titleKey)}
      subtitle={t("Tool_pan_aadhaar_link_Subtitle")}
      description={t(tool.descriptionKey)}
      icon={tool.icon}
      educate={
        <>
          <div className="fy-info-box">
            <strong>{t("Common_WhatYouLearn")}</strong>
            <p>{t("Tool_pan_aadhaar_link_LearnText")}</p>
          </div>
          <FormulaCard
            title={t("Common_Formula")}
            code={`Illustrative fee ≈ ₹${PAN_PENALTY_BEFORE_DEADLINE} or ₹${PAN_PENALTY_AFTER_DEADLINE}\n(Not a live status API)`}
            note={t("Tool_pan_aadhaar_link_FormulaNote")}
          />
        </>
      }
      below={<ToolInfoPanel info={panAadhaarLinkInfo(t)} />}
    >
      <div className="fy-form-card">
        <h3>{t("Common_YourInputs")}</h3>
        <div className="fy-field">
          <label>{t("Tool_pan_aadhaar_link_LabelStatus")}</label>
          <select value={status} onChange={(e) => setStatus(e.target.value as PanLinkStatus)}>
            <option value="linked">{t("Tool_pan_aadhaar_link_Status_linked")}</option>
            <option value="not_linked">{t("Tool_pan_aadhaar_link_Status_not_linked")}</option>
            <option value="unknown">{t("Tool_pan_aadhaar_link_Status_unknown")}</option>
          </select>
          <p className="fy-field-hint">{t("Tool_pan_aadhaar_link_StatusHint")}</p>
        </div>
        <div className="fy-field">
          <label>{t("Tool_pan_aadhaar_link_LabelDeadline")}</label>
          <select
            value={afterDeadline ? "after" : "before"}
            onChange={(e) => setAfterDeadline(e.target.value === "after")}
          >
            <option value="before">{t("Tool_pan_aadhaar_link_Deadline_Before")}</option>
            <option value="after">{t("Tool_pan_aadhaar_link_Deadline_After")}</option>
          </select>
          <p className="fy-field-hint">{t("Tool_pan_aadhaar_link_DeadlineHint")}</p>
        </div>
        <button type="button" className="fy-btn-calc">
          {t("Common_Calculate")}
        </button>
      </div>

      <div className="fy-info-box">
        <strong>{t("Tool_pan_aadhaar_link_DisclaimerTitle")}</strong>
        <p>{t("Tool_pan_aadhaar_link_Disclaimer")}</p>
        <p>{consequence}</p>
      </div>

      <ResultSummaryCards cards={summaryCards} />
      <ScenarioCompare
        title={t("Tool_pan_aadhaar_link_ScenarioTitle")}
        subtitle={t("Tool_pan_aadhaar_link_ScenarioSubtitle")}
        scenarios={scenarios}
      />
      <WorkedExample
        title={t("Tool_pan_aadhaar_link_ExampleTitle")}
        subtitle={t("Tool_pan_aadhaar_link_ExampleSubtitle")}
        steps={exampleSteps}
      />
    </ToolPageShell>
  );
}
