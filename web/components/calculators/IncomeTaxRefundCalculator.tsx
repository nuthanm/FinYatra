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
import { calculateIncomeTaxRefund } from "@/lib/finance/incomeTaxRefund";
import { inr } from "@/lib/finance/format";
import { getTool } from "@/lib/config/tools";
import { incomeTaxRefundInfo } from "@/lib/tool-page-content";

export function IncomeTaxRefundCalculator() {
  const t = useT();
  const tool = getTool("income-tax-refund")!;

  const [tds, setTds] = useState(80_000);
  const [advanceTax, setAdvanceTax] = useState(40_000);
  const [selfAssessment, setSelfAssessment] = useState(0);
  const [liability, setLiability] = useState(1_00_000);

  const exampleSteps = useMemo(
    () => [
      t("Tool_income_tax_refund_ExampleStep_1"),
      t("Tool_income_tax_refund_ExampleStep_2"),
      t("Tool_income_tax_refund_ExampleStep_3"),
      t("Tool_income_tax_refund_ExampleStep_4"),
      t("Tool_income_tax_refund_ExampleStep_5"),
    ],
    [t],
  );

  const { summaryCards, scenarios, result } = useMemo(() => {
    const base = calculateIncomeTaxRefund({
      tds,
      advanceTax,
      selfAssessment,
      taxLiability: liability,
    });
    const lowerPaid = calculateIncomeTaxRefund({
      tds: Math.max(0, tds - 20_000),
      advanceTax,
      selfAssessment,
      taxLiability: liability,
    });
    const higherPaid = calculateIncomeTaxRefund({
      tds: tds + 20_000,
      advanceTax,
      selfAssessment,
      taxLiability: liability,
    });

    const outcomeLabel = base.taxDue > 0
      ? t("Tool_income_tax_refund_Result_Due")
      : t("Tool_income_tax_refund_Result_Refund");
    const outcomeValue = base.taxDue > 0 ? inr(base.taxDue) : inr(base.refund);

    return {
      result: base,
      summaryCards: [
        {
          label: outcomeLabel,
          value: outcomeValue,
          footnote:
            base.taxDue > 0
              ? t("Tool_income_tax_refund_Result_DueFootnote")
              : t("Tool_income_tax_refund_Result_RefundFootnote"),
          variant: (base.taxDue > 0 ? "volatile" : "secure") as "volatile" | "secure",
        },
        {
          label: t("Tool_income_tax_refund_Result_Paid"),
          value: inr(base.taxPaid),
          footnote: t("Tool_income_tax_refund_Result_PaidFootnote"),
          variant: "primary" as const,
        },
        {
          label: t("Tool_income_tax_refund_Result_Liability"),
          value: inr(base.taxLiability),
          footnote: t("Tool_income_tax_refund_Result_LiabilityFootnote"),
        },
      ],
      scenarios: [
        {
          name: t("Tool_income_tax_refund_Scenario_LessPaid"),
          primaryLabel: t("Tool_income_tax_refund_Result_Paid"),
          primaryValue: inr(lowerPaid.taxPaid),
          secondaryLabel:
            lowerPaid.taxDue > 0
              ? t("Tool_income_tax_refund_Result_Due")
              : t("Tool_income_tax_refund_Result_Refund"),
          secondaryValue: inr(lowerPaid.taxDue > 0 ? lowerPaid.taxDue : lowerPaid.refund),
          variant: "worst" as const,
        },
        {
          name: t("Common_Scenario_Base"),
          primaryLabel: t("Tool_income_tax_refund_Result_Paid"),
          primaryValue: inr(base.taxPaid),
          secondaryLabel: outcomeLabel,
          secondaryValue: outcomeValue,
          variant: "base" as const,
        },
        {
          name: t("Tool_income_tax_refund_Scenario_MorePaid"),
          primaryLabel: t("Tool_income_tax_refund_Result_Paid"),
          primaryValue: inr(higherPaid.taxPaid),
          secondaryLabel:
            higherPaid.taxDue > 0
              ? t("Tool_income_tax_refund_Result_Due")
              : t("Tool_income_tax_refund_Result_Refund"),
          secondaryValue: inr(higherPaid.taxDue > 0 ? higherPaid.taxDue : higherPaid.refund),
          variant: "best" as const,
        },
      ],
    };
  }, [tds, advanceTax, selfAssessment, liability, t]);

  return (
    <ToolPageShell
      title={t(tool.titleKey)}
      subtitle={t("Tool_income_tax_refund_Subtitle")}
      description={t(tool.descriptionKey)}
      icon={tool.icon}
      educate={
        <>
          <div className="fy-info-box">
            <strong>{t("Common_WhatYouLearn")}</strong>
            <p>{t("Tool_income_tax_refund_LearnText")}</p>
          </div>
          <FormulaCard
            title={t("Common_Formula")}
            code={"paid = TDS + advance + SA\nrefund = max(0, paid − liability)\ndue = max(0, liability − paid)"}
            note={t("Tool_income_tax_refund_FormulaNote")}
          />
        </>
      }
      below={<ToolInfoPanel info={incomeTaxRefundInfo(t)} />}
    >
      <div className="fy-form-card">
        <h3>{t("Common_YourInputs")}</h3>
        <div className="fy-field">
          <label>{t("Tool_income_tax_refund_LabelTds")}</label>
          <input
            type="number"
            min={0}
            step={1000}
            inputMode="decimal"
            value={tds}
            onChange={(e) => setTds(Math.max(0, Number(e.target.value) || 0))}
          />
        </div>
        <div className="fy-field">
          <label>{t("Tool_income_tax_refund_LabelAdvance")}</label>
          <input
            type="number"
            min={0}
            step={1000}
            inputMode="decimal"
            value={advanceTax}
            onChange={(e) => setAdvanceTax(Math.max(0, Number(e.target.value) || 0))}
          />
        </div>
        <div className="fy-field">
          <label>{t("Tool_income_tax_refund_LabelSa")}</label>
          <input
            type="number"
            min={0}
            step={1000}
            inputMode="decimal"
            value={selfAssessment}
            onChange={(e) => setSelfAssessment(Math.max(0, Number(e.target.value) || 0))}
          />
        </div>
        <div className="fy-field">
          <label>{t("Tool_income_tax_refund_LabelLiability")}</label>
          <input
            type="number"
            min={0}
            step={1000}
            inputMode="decimal"
            value={liability}
            onChange={(e) => setLiability(Math.max(0, Number(e.target.value) || 0))}
          />
          <p className="fy-field-hint">{t("Tool_income_tax_refund_LiabilityHint")}</p>
        </div>
        <button type="button" className="fy-btn-calc">
          {t("Common_Calculate")}
        </button>
      </div>

      <ResultSummaryCards cards={summaryCards} />
      <ScenarioCompare
        title={t("Tool_income_tax_refund_ScenarioTitle")}
        subtitle={t("Tool_income_tax_refund_ScenarioSubtitle")}
        scenarios={scenarios}
      />
      <WorkedExample
        title={t("Tool_income_tax_refund_ExampleTitle")}
        subtitle={t("Tool_income_tax_refund_ExampleSubtitle")}
        steps={exampleSteps}
      />
      {result.taxPaid === result.taxLiability ? (
        <p className="fy-field-hint" style={{ marginTop: "0.75rem" }}>
          {t("Tool_income_tax_refund_BalancedNote")}
        </p>
      ) : null}
    </ToolPageShell>
  );
}
