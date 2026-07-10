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
  calculateGstEInvoice,
  GST_EINVOICE_TURNOVER_THRESHOLD,
} from "@/lib/finance/gstEInvoice";
import { inr, percent } from "@/lib/finance/format";
import { getTool } from "@/lib/config/tools";
import { gstEInvoiceInfo } from "@/lib/tool-page-content";

export function GstEInvoiceCalculator() {
  const t = useT();
  const tool = getTool("gst-e-invoice")!;

  const [turnover, setTurnover] = useState(6_00_00_000);
  const [taxable, setTaxable] = useState(1_00_000);
  const [gstRate, setGstRate] = useState(18);

  const exampleSteps = useMemo(
    () => [
      t("Tool_gst_e_invoice_ExampleStep_1"),
      t("Tool_gst_e_invoice_ExampleStep_2"),
      t("Tool_gst_e_invoice_ExampleStep_3"),
      t("Tool_gst_e_invoice_ExampleStep_4"),
      t("Tool_gst_e_invoice_ExampleStep_5"),
    ],
    [t],
  );

  const { summaryCards, scenarios, result } = useMemo(() => {
    const result = calculateGstEInvoice({
      annualTurnover: turnover,
      invoiceTaxableValue: taxable,
      gstRatePercent: gstRate,
    });
    const below = calculateGstEInvoice({
      annualTurnover: Math.max(0, GST_EINVOICE_TURNOVER_THRESHOLD - 1_00_00_000),
      invoiceTaxableValue: taxable,
      gstRatePercent: gstRate,
    });
    const above = calculateGstEInvoice({
      annualTurnover: GST_EINVOICE_TURNOVER_THRESHOLD * 2,
      invoiceTaxableValue: taxable,
      gstRatePercent: gstRate,
    });

    return {
      result,
      summaryCards: [
        {
          label: t("Tool_gst_e_invoice_Result_Status"),
          value: result.eInvoiceLikelyRequired
            ? t("Tool_gst_e_invoice_Status_Required")
            : t("Tool_gst_e_invoice_Status_NotRequired"),
          footnote: t(
            "Tool_gst_e_invoice_Result_StatusFootnote",
            inr(GST_EINVOICE_TURNOVER_THRESHOLD),
          ),
          variant: result.eInvoiceLikelyRequired
            ? ("volatile" as const)
            : ("secure" as const),
        },
        {
          label: t("Tool_gst_e_invoice_Result_SampleGst"),
          value: inr(result.sampleGst),
          footnote: t(
            "Tool_gst_e_invoice_Result_SampleGstFootnote",
            percent(gstRate, 0),
          ),
          variant: "primary" as const,
        },
        {
          label: t("Tool_gst_e_invoice_Result_InvoiceTotal"),
          value: inr(result.invoiceTotal),
          footnote: t("Tool_gst_e_invoice_Result_InvoiceTotalFootnote"),
        },
      ],
      scenarios: [
        {
          name: t("Tool_gst_e_invoice_Scenario_Below"),
          primaryLabel: t("Tool_gst_e_invoice_Result_Status"),
          primaryValue: below.eInvoiceLikelyRequired
            ? t("Tool_gst_e_invoice_Status_Required")
            : t("Tool_gst_e_invoice_Status_NotRequired"),
          secondaryLabel: t("Tool_gst_e_invoice_Result_SampleGst"),
          secondaryValue: inr(below.sampleGst),
          variant: "best" as const,
        },
        {
          name: t("Common_Scenario_Base"),
          primaryLabel: t("Tool_gst_e_invoice_Result_SampleGst"),
          primaryValue: inr(result.sampleGst),
          secondaryLabel: t("Tool_gst_e_invoice_LabelTurnover"),
          secondaryValue: inr(turnover),
          variant: "base" as const,
        },
        {
          name: t("Tool_gst_e_invoice_Scenario_Above"),
          primaryLabel: t("Tool_gst_e_invoice_Result_Status"),
          primaryValue: above.eInvoiceLikelyRequired
            ? t("Tool_gst_e_invoice_Status_Required")
            : t("Tool_gst_e_invoice_Status_NotRequired"),
          secondaryLabel: t("Tool_gst_e_invoice_Result_SampleGst"),
          secondaryValue: inr(above.sampleGst),
          variant: "worst" as const,
        },
      ],
    };
  }, [turnover, taxable, gstRate, t]);

  return (
    <ToolPageShell
      title={t(tool.titleKey)}
      subtitle={t("Tool_gst_e_invoice_Subtitle")}
      description={t(tool.descriptionKey)}
      icon={tool.icon}
      educate={
        <>
          <div className="fy-info-box">
            <strong>{t("Common_WhatYouLearn")}</strong>
            <p>{t("Tool_gst_e_invoice_LearnText")}</p>
          </div>
          <FormulaCard
            title={t("Common_Formula")}
            code={`If turnover ≥ ₹${(GST_EINVOICE_TURNOVER_THRESHOLD / 1_00_00_000).toFixed(0)} Cr → e-invoice likely\nGST = taxable × rate%`}
            note={t("Tool_gst_e_invoice_FormulaNote")}
          />
        </>
      }
      below={<ToolInfoPanel info={gstEInvoiceInfo(t)} />}
    >
      <div className="fy-form-card">
        <h3>{t("Common_YourInputs")}</h3>
        <div className="fy-field">
          <label>{t("Tool_gst_e_invoice_LabelTurnover")}</label>
          <input
            type="number"
            min={0}
            step={100000}
            inputMode="decimal"
            value={turnover}
            onChange={(e) => setTurnover(Math.max(0, Number(e.target.value) || 0))}
          />
          <p className="fy-field-hint">{t("Tool_gst_e_invoice_TurnoverHint")}</p>
        </div>
        <div className="fy-field">
          <label>{t("Tool_gst_e_invoice_LabelTaxable")}</label>
          <input
            type="number"
            min={0}
            step={1000}
            inputMode="decimal"
            value={taxable}
            onChange={(e) => setTaxable(Math.max(0, Number(e.target.value) || 0))}
          />
        </div>
        <div className="fy-field">
          <label>{t("Tool_gst_e_invoice_LabelGstRate")}</label>
          <input
            type="number"
            min={0}
            max={28}
            step={1}
            inputMode="decimal"
            value={gstRate}
            onChange={(e) => setGstRate(Math.max(0, Number(e.target.value) || 0))}
          />
        </div>
        <button type="button" className="fy-btn-calc">
          {t("Common_Calculate")}
        </button>
      </div>

      <div className="fy-info-box">
        <strong>{t("Tool_gst_e_invoice_VerdictTitle")}</strong>
        <p>
          {result.eInvoiceLikelyRequired
            ? t("Tool_gst_e_invoice_VerdictYes", inr(result.sampleGst))
            : t("Tool_gst_e_invoice_VerdictNo", inr(result.sampleGst))}
        </p>
      </div>

      <ResultSummaryCards cards={summaryCards} />
      <ScenarioCompare
        title={t("Tool_gst_e_invoice_ScenarioTitle")}
        subtitle={t("Tool_gst_e_invoice_ScenarioSubtitle")}
        scenarios={scenarios}
      />
      <WorkedExample
        title={t("Tool_gst_e_invoice_ExampleTitle")}
        subtitle={t("Tool_gst_e_invoice_ExampleSubtitle")}
        steps={exampleSteps}
      />
    </ToolPageShell>
  );
}
