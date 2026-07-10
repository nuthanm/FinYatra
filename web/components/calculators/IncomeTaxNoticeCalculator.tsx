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
  analyzeIncomeTaxNotice,
  type IncomeTaxNoticeType,
} from "@/lib/finance/incomeTaxNotice";
import { inr } from "@/lib/finance/format";
import { getTool } from "@/lib/config/tools";
import { incomeTaxNoticeInfo } from "@/lib/tool-page-content";

const NOTICE_TYPES: IncomeTaxNoticeType[] = ["143_1", "143_2", "148", "156", "245", "other"];

export function IncomeTaxNoticeCalculator() {
  const t = useT();
  const tool = getTool("income-tax-notice")!;

  const [noticeType, setNoticeType] = useState<IncomeTaxNoticeType>("143_1");
  const [demandAmount, setDemandAmount] = useState(0);

  const exampleSteps = useMemo(
    () => [
      t("Tool_income_tax_notice_ExampleStep_1"),
      t("Tool_income_tax_notice_ExampleStep_2"),
      t("Tool_income_tax_notice_ExampleStep_3"),
      t("Tool_income_tax_notice_ExampleStep_4"),
      t("Tool_income_tax_notice_ExampleStep_5"),
    ],
    [t],
  );

  const { summaryCards, scenarios, result } = useMemo(() => {
    const result = analyzeIncomeTaxNotice({ noticeType, demandAmount });
    const scrutiny = analyzeIncomeTaxNotice({ noticeType: "143_2", demandAmount });
    const demandNotice = analyzeIncomeTaxNotice({
      noticeType: "156",
      demandAmount: demandAmount || 50_000,
    });

    return {
      result,
      summaryCards: [
        {
          label: t("Tool_income_tax_notice_Result_Type"),
          value: t(`Tool_income_tax_notice_Type_${noticeType}`),
          footnote: t(`Tool_income_tax_notice_Deadline_${result.deadlineKey}`),
          variant: "primary" as const,
        },
        {
          label: t("Tool_income_tax_notice_Result_Demand"),
          value: result.hasDemand ? inr(result.demandAmount) : t("Tool_income_tax_notice_Result_NoDemand"),
          footnote: t("Tool_income_tax_notice_Result_DemandFootnote"),
        },
        {
          label: t("Tool_income_tax_notice_Result_Checks"),
          value: String(result.checklistKeys.length),
          footnote: t("Tool_income_tax_notice_Result_ChecksFootnote"),
          variant: "secure" as const,
        },
      ],
      scenarios: [
        {
          name: t("Tool_income_tax_notice_Scenario_Intimation"),
          primaryLabel: t("Tool_income_tax_notice_Result_Type"),
          primaryValue: t("Tool_income_tax_notice_Type_143_1"),
          secondaryLabel: t("Tool_income_tax_notice_Result_Checks"),
          secondaryValue: String(analyzeIncomeTaxNotice({ noticeType: "143_1" }).checklistKeys.length),
          variant: "best" as const,
        },
        {
          name: t("Tool_income_tax_notice_Scenario_Scrutiny"),
          primaryLabel: t("Tool_income_tax_notice_Result_Type"),
          primaryValue: t("Tool_income_tax_notice_Type_143_2"),
          secondaryLabel: t("Tool_income_tax_notice_Result_Checks"),
          secondaryValue: String(scrutiny.checklistKeys.length),
          variant: "base" as const,
        },
        {
          name: t("Tool_income_tax_notice_Scenario_Demand"),
          primaryLabel: t("Tool_income_tax_notice_Result_Demand"),
          primaryValue: inr(demandNotice.demandAmount),
          secondaryLabel: t("Tool_income_tax_notice_Result_Type"),
          secondaryValue: t("Tool_income_tax_notice_Type_156"),
          variant: "worst" as const,
        },
      ],
    };
  }, [noticeType, demandAmount, t]);

  return (
    <ToolPageShell
      title={t(tool.titleKey)}
      subtitle={t("Tool_income_tax_notice_Subtitle")}
      description={t(tool.descriptionKey)}
      icon={tool.icon}
      educate={
        <>
          <div className="fy-info-box">
            <strong>{t("Common_WhatYouLearn")}</strong>
            <p>{t("Tool_income_tax_notice_LearnText")}</p>
          </div>
          <FormulaCard
            title={t("Common_Formula")}
            code={"Pick notice section\n→ meaning + deadline\n→ checklist\n(+ demand if entered)"}
            note={t("Tool_income_tax_notice_FormulaNote")}
          />
        </>
      }
      below={<ToolInfoPanel info={incomeTaxNoticeInfo(t)} />}
    >
      <div className="fy-form-card">
        <h3>{t("Common_YourInputs")}</h3>
        <div className="fy-field">
          <label>{t("Tool_income_tax_notice_LabelType")}</label>
          <select
            value={noticeType}
            onChange={(e) => setNoticeType(e.target.value as IncomeTaxNoticeType)}
          >
            {NOTICE_TYPES.map((nt) => (
              <option key={nt} value={nt}>
                {t(`Tool_income_tax_notice_Type_${nt}`)}
              </option>
            ))}
          </select>
        </div>
        <div className="fy-field">
          <label>{t("Tool_income_tax_notice_LabelDemand")}</label>
          <input
            type="number"
            min={0}
            step={1000}
            inputMode="decimal"
            value={demandAmount}
            onChange={(e) => setDemandAmount(Math.max(0, Number(e.target.value) || 0))}
          />
          <p className="fy-field-hint">{t("Tool_income_tax_notice_DemandHint")}</p>
        </div>
        <button type="button" className="fy-btn-calc">
          {t("Common_Calculate")}
        </button>
      </div>

      <ResultSummaryCards cards={summaryCards} />
      <div className="fy-info-box">
        <strong>{t(`Tool_income_tax_notice_Type_${noticeType}`)}</strong>
        <p>{t(`Tool_income_tax_notice_Meaning_${result.meaningKey}`)}</p>
        <p>
          <strong>{t("Tool_income_tax_notice_ChecklistTitle")}</strong>
        </p>
        <ul>
          {result.checklistKeys.map((key) => (
            <li key={key}>{t(`Tool_income_tax_notice_Check_${key}`)}</li>
          ))}
        </ul>
      </div>
      <ScenarioCompare
        title={t("Tool_income_tax_notice_ScenarioTitle")}
        subtitle={t("Tool_income_tax_notice_ScenarioSubtitle")}
        scenarios={scenarios}
      />
      <WorkedExample
        title={t("Tool_income_tax_notice_ExampleTitle")}
        subtitle={t("Tool_income_tax_notice_ExampleSubtitle")}
        steps={exampleSteps}
      />
    </ToolPageShell>
  );
}
