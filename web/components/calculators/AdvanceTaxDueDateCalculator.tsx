"use client";

import { useMemo, useState } from "react";
import { useT } from "@/components/providers/I18nProvider";
import {
  BreakdownTable,
  FormulaCard,
  ResultSummaryCards,
  ScenarioCompare,
  ToolInfoPanel,
  ToolPageShell,
  WorkedExample,
} from "@/components/calculator/CalculatorUi";
import {
  ADVANCE_TAX_SCHEDULE,
  calculateAdvanceTaxDueDate,
} from "@/lib/finance/advanceTaxDueDate";
import {
  installmentFromDate,
  type AdvanceTaxInstallmentId,
} from "@/lib/finance/advanceTax";
import { inr } from "@/lib/finance/format";
import { getTool } from "@/lib/config/tools";
import { advanceTaxDueDateInfo } from "@/lib/tool-page-content";

function todayIsoDate(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function AdvanceTaxDueDateCalculator() {
  const t = useT();
  const tool = getTool("advance-tax-due-date")!;

  const [estimatedTax, setEstimatedTax] = useState(2_00_000);
  const [taxAlreadyPaid, setTaxAlreadyPaid] = useState(30_000);
  const [asOfDate, setAsOfDate] = useState(todayIsoDate);
  const [useDate, setUseDate] = useState(true);
  const [manualInstallment, setManualInstallment] =
    useState<AdvanceTaxInstallmentId>("sep");

  const selectedInstallment = useMemo(() => {
    if (!useDate) return manualInstallment;
    const [y, m, d] = asOfDate.split("-").map(Number);
    if (!y || !m || !d) return manualInstallment;
    return installmentFromDate(new Date(y, m - 1, d));
  }, [useDate, asOfDate, manualInstallment]);

  const exampleSteps = useMemo(
    () => [
      t("Tool_advance_tax_due_date_ExampleStep_1"),
      t("Tool_advance_tax_due_date_ExampleStep_2"),
      t("Tool_advance_tax_due_date_ExampleStep_3"),
      t("Tool_advance_tax_due_date_ExampleStep_4"),
      t("Tool_advance_tax_due_date_ExampleStep_5"),
    ],
    [t],
  );

  const { summaryCards, scenarios, breakdownRows } = useMemo(() => {
    const result = calculateAdvanceTaxDueDate({
      estimatedTax,
      taxAlreadyPaid,
      selectedInstallment,
    });
    const lessPaid = calculateAdvanceTaxDueDate({
      estimatedTax,
      taxAlreadyPaid: Math.max(0, taxAlreadyPaid * 0.5),
      selectedInstallment,
    });
    const morePaid = calculateAdvanceTaxDueDate({
      estimatedTax,
      taxAlreadyPaid: taxAlreadyPaid + 50_000,
      selectedInstallment,
    });

    return {
      result,
      summaryCards: [
        {
          label: t("Tool_advance_tax_due_date_Result_Remaining"),
          value: inr(result.remainingTax),
          footnote: t("Tool_advance_tax_due_date_Result_RemainingFootnote"),
          variant: "primary" as const,
        },
        {
          label: t("Tool_advance_tax_due_date_Result_Required"),
          value: inr(result.requiredBySelected),
          footnote: t(
            "Tool_advance_tax_due_date_Result_RequiredFootnote",
            result.selected.dueLabel,
            `${result.selected.cumulativePct}%`,
          ),
          variant: "secure" as const,
        },
        {
          label: t("Tool_advance_tax_due_date_Result_Shortfall"),
          value: inr(result.shortfall),
          footnote:
            result.shortfall > 0
              ? t("Tool_advance_tax_due_date_Result_ShortfallFootnote")
              : t("Tool_advance_tax_due_date_Result_OnTrackFootnote", inr(result.surplus)),
          variant: result.shortfall > 0 ? ("volatile" as const) : ("default" as const),
        },
      ],
      scenarios: [
        {
          name: t("Tool_advance_tax_due_date_Scenario_LessPaid"),
          primaryLabel: t("Tool_advance_tax_due_date_Result_Shortfall"),
          primaryValue: inr(lessPaid.shortfall),
          secondaryLabel: t("Tool_advance_tax_due_date_Result_Remaining"),
          secondaryValue: inr(lessPaid.remainingTax),
          variant: "worst" as const,
        },
        {
          name: t("Common_Scenario_Base"),
          primaryLabel: t("Tool_advance_tax_due_date_Result_Shortfall"),
          primaryValue: inr(result.shortfall),
          secondaryLabel: t("Tool_advance_tax_due_date_Result_Suggested"),
          secondaryValue: inr(result.suggestedThisInstallment),
          variant: "base" as const,
        },
        {
          name: t("Tool_advance_tax_due_date_Scenario_MorePaid"),
          primaryLabel: t("Tool_advance_tax_due_date_Result_Shortfall"),
          primaryValue: inr(morePaid.shortfall),
          secondaryLabel: t("Tool_advance_tax_due_date_Result_Remaining"),
          secondaryValue: inr(morePaid.remainingTax),
          variant: "best" as const,
        },
      ],
      breakdownRows: result.calendar.map((row) => ({
        cells: {
          due:
            row.id === selectedInstallment
              ? `${row.dueLabel} · ${t("Tool_advance_tax_due_date_SelectedMark")}`
              : row.dueLabel,
          cumulative: `${row.cumulativePct}%`,
          installment: `${row.installmentPct}%`,
          amount: inr(row.cumulativeDue),
          remaining: inr(row.remainingToMilestone),
        },
      })),
    };
  }, [estimatedTax, taxAlreadyPaid, selectedInstallment, t]);

  return (
    <ToolPageShell
      title={t(tool.titleKey)}
      subtitle={t("Tool_advance_tax_due_date_Subtitle")}
      description={t(tool.descriptionKey)}
      icon={tool.icon}
      educate={
        <>
          <div className="fy-info-box">
            <strong>{t("Common_WhatYouLearn")}</strong>
            <p>{t("Tool_advance_tax_due_date_LearnText")}</p>
          </div>
          <FormulaCard
            title={t("Common_Formula")}
            code={
              "15 Jun 15% · 15 Sep 45%\n15 Dec 75% · 15 Mar 100%\nshortfall = required − paid"
            }
            note={t("Tool_advance_tax_due_date_FormulaNote")}
          />
        </>
      }
      below={<ToolInfoPanel info={advanceTaxDueDateInfo(t)} />}
    >
      <div className="fy-form-card">
        <h3>{t("Common_YourInputs")}</h3>
        <div className="fy-field">
          <label>{t("Tool_advance_tax_due_date_LabelEstimated")}</label>
          <input
            type="number"
            min={0}
            step={10000}
            inputMode="decimal"
            value={estimatedTax}
            onChange={(e) => setEstimatedTax(Math.max(0, Number(e.target.value) || 0))}
          />
        </div>
        <div className="fy-field">
          <label>{t("Tool_advance_tax_due_date_LabelPaid")}</label>
          <input
            type="number"
            min={0}
            step={10000}
            inputMode="decimal"
            value={taxAlreadyPaid}
            onChange={(e) => setTaxAlreadyPaid(Math.max(0, Number(e.target.value) || 0))}
          />
          <p className="fy-field-hint">{t("Tool_advance_tax_due_date_PaidHint")}</p>
        </div>
        <div className="fy-field">
          <label>{t("Tool_advance_tax_due_date_LabelUseDate")}</label>
          <select
            value={useDate ? "date" : "manual"}
            onChange={(e) => setUseDate(e.target.value === "date")}
          >
            <option value="date">{t("Tool_advance_tax_due_date_UseDate_Yes")}</option>
            <option value="manual">{t("Tool_advance_tax_due_date_UseDate_No")}</option>
          </select>
        </div>
        {useDate ? (
          <div className="fy-field">
            <label>{t("Tool_advance_tax_due_date_LabelAsOf")}</label>
            <input
              type="date"
              value={asOfDate}
              onChange={(e) => setAsOfDate(e.target.value)}
            />
          </div>
        ) : (
          <div className="fy-field">
            <label>{t("Tool_advance_tax_due_date_LabelInstallment")}</label>
            <select
              value={manualInstallment}
              onChange={(e) =>
                setManualInstallment(e.target.value as AdvanceTaxInstallmentId)
              }
            >
              {ADVANCE_TAX_SCHEDULE.map((row) => (
                <option key={row.id} value={row.id}>
                  {row.dueLabel} ({row.cumulativePct}%)
                </option>
              ))}
            </select>
          </div>
        )}
        <button type="button" className="fy-btn-calc">
          {t("Common_Calculate")}
        </button>
      </div>

      <ResultSummaryCards cards={summaryCards} />
      <BreakdownTable
        title={t("Tool_advance_tax_due_date_CalendarTitle")}
        subtitle={t("Tool_advance_tax_due_date_CalendarSubtitle")}
        columns={[
          { key: "due", header: t("Tool_advance_tax_due_date_Col_Due"), alignRight: false },
          { key: "cumulative", header: t("Tool_advance_tax_due_date_Col_Cumulative") },
          { key: "installment", header: t("Tool_advance_tax_due_date_Col_Installment") },
          { key: "amount", header: t("Tool_advance_tax_due_date_Col_Amount") },
          { key: "remaining", header: t("Tool_advance_tax_due_date_Col_Remaining") },
        ]}
        rows={breakdownRows}
      />
      <ScenarioCompare
        title={t("Tool_advance_tax_due_date_ScenarioTitle")}
        subtitle={t("Tool_advance_tax_due_date_ScenarioSubtitle")}
        scenarios={scenarios}
      />
      <WorkedExample
        title={t("Tool_advance_tax_due_date_ExampleTitle")}
        subtitle={t("Tool_advance_tax_due_date_ExampleSubtitle")}
        steps={exampleSteps}
      />
    </ToolPageShell>
  );
}
