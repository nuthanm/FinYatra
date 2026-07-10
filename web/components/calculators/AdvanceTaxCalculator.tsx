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
  calculateAdvanceTax,
  installmentFromDate,
  type AdvanceTaxInstallmentId,
} from "@/lib/finance/advanceTax";
import { inr } from "@/lib/finance/format";
import { getTool } from "@/lib/config/tools";
import { advanceTaxInfo } from "@/lib/tool-page-content";

function todayIsoDate(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function AdvanceTaxCalculator() {
  const t = useT();
  const tool = getTool("advance-tax")!;

  const [estimatedTax, setEstimatedTax] = useState(200_000);
  const [taxAlreadyPaid, setTaxAlreadyPaid] = useState(20_000);
  const [asOfDate, setAsOfDate] = useState(todayIsoDate);
  const [useDate, setUseDate] = useState(true);
  const [manualInstallment, setManualInstallment] = useState<AdvanceTaxInstallmentId>("sep");

  const selectedInstallment = useMemo(() => {
    if (!useDate) return manualInstallment;
    const [y, m, d] = asOfDate.split("-").map(Number);
    if (!y || !m || !d) return manualInstallment;
    return installmentFromDate(new Date(y, m - 1, d));
  }, [useDate, asOfDate, manualInstallment]);

  const exampleSteps = useMemo(
    () => [
      t("Tool_advance_tax_ExampleStep_1"),
      t("Tool_advance_tax_ExampleStep_2"),
      t("Tool_advance_tax_ExampleStep_3"),
      t("Tool_advance_tax_ExampleStep_4"),
      t("Tool_advance_tax_ExampleStep_5"),
    ],
    [t],
  );

  const { summaryCards, scenarios, result } = useMemo(() => {
    const result = calculateAdvanceTax({
      estimatedTax,
      taxAlreadyPaid,
      selectedInstallment,
    });
    const lessPaid = calculateAdvanceTax({
      estimatedTax,
      taxAlreadyPaid: Math.max(0, taxAlreadyPaid * 0.5),
      selectedInstallment,
    });
    const morePaid = calculateAdvanceTax({
      estimatedTax,
      taxAlreadyPaid: taxAlreadyPaid + result.schedule.find((r) => r.id === selectedInstallment)!.installmentAmount,
      selectedInstallment,
    });

    return {
      result,
      summaryCards: [
        {
          label: t("Tool_advance_tax_Result_Remaining"),
          value: inr(result.remainingTax),
          footnote: t("Tool_advance_tax_Result_RemainingFootnote"),
          variant: "primary" as const,
        },
        {
          label: t("Tool_advance_tax_Result_Required"),
          value: inr(result.requiredBySelected),
          footnote: t(
            "Tool_advance_tax_Result_RequiredFootnote",
            result.selected.dueLabel,
            `${result.selected.cumulativePct}%`,
          ),
          variant: "secure" as const,
        },
        {
          label: t("Tool_advance_tax_Result_Shortfall"),
          value: inr(result.shortfall),
          footnote:
            result.shortfall > 0
              ? t("Tool_advance_tax_Result_ShortfallFootnote")
              : t("Tool_advance_tax_Result_OnTrackFootnote", inr(result.surplus)),
          variant: result.shortfall > 0 ? ("volatile" as const) : ("default" as const),
        },
      ],
      scenarios: [
        {
          name: t("Tool_advance_tax_Scenario_LessPaid"),
          primaryLabel: t("Tool_advance_tax_Result_Shortfall"),
          primaryValue: inr(lessPaid.shortfall),
          secondaryLabel: t("Tool_advance_tax_Result_Remaining"),
          secondaryValue: inr(lessPaid.remainingTax),
          variant: "worst",
        },
        {
          name: t("Common_Scenario_Base"),
          primaryLabel: t("Tool_advance_tax_Result_Shortfall"),
          primaryValue: inr(result.shortfall),
          secondaryLabel: t("Tool_advance_tax_Result_Suggested"),
          secondaryValue: inr(result.suggestedThisInstallment),
          variant: "base",
        },
        {
          name: t("Tool_advance_tax_Scenario_MorePaid"),
          primaryLabel: t("Tool_advance_tax_Result_Shortfall"),
          primaryValue: inr(morePaid.shortfall),
          secondaryLabel: t("Tool_advance_tax_Result_Remaining"),
          secondaryValue: inr(morePaid.remainingTax),
          variant: "best",
        },
      ],
    };
  }, [estimatedTax, taxAlreadyPaid, selectedInstallment, t]);

  return (
    <ToolPageShell
      title={t(tool.titleKey)}
      subtitle={t("Tool_advance_tax_Subtitle")}
      description={t(tool.descriptionKey)}
      icon={tool.icon}
      educate={
        <>
          <div className="fy-info-box">
            <strong>{t("Common_WhatYouLearn")}</strong>
            <p>{t("Tool_advance_tax_LearnText")}</p>
          </div>
          <FormulaCard
            title={t("Common_Formula")}
            code={"15 Jun 15% · 15 Sep 45% · 15 Dec 75% · 15 Mar 100%\nShortfall = required cumulative − tax already paid"}
            note={t("Tool_advance_tax_FormulaNote")}
          />
        </>
      }
      below={<ToolInfoPanel info={advanceTaxInfo(t)} />}
    >
      <div className="fy-form-card">
        <h3>{t("Common_YourInputs")}</h3>
        <div className="fy-field">
          <label>{t("Tool_advance_tax_LabelEstimated")}</label>
          <input
            type="number"
            min={0}
            step={10_000}
            inputMode="decimal"
            value={estimatedTax}
            onChange={(e) => setEstimatedTax(Math.max(0, Number(e.target.value) || 0))}
          />
          <p className="fy-field-hint">{t("Tool_advance_tax_EstimatedHint")}</p>
        </div>
        <div className="fy-field">
          <label>{t("Tool_advance_tax_LabelPaid")}</label>
          <input
            type="number"
            min={0}
            step={5_000}
            inputMode="decimal"
            value={taxAlreadyPaid}
            onChange={(e) => setTaxAlreadyPaid(Math.max(0, Number(e.target.value) || 0))}
          />
          <p className="fy-field-hint">{t("Tool_advance_tax_PaidHint")}</p>
        </div>
        <div className="fy-field">
          <label>
            <input type="checkbox" checked={useDate} onChange={(e) => setUseDate(e.target.checked)} />{" "}
            {t("Tool_advance_tax_LabelUseDate")}
          </label>
        </div>
        {useDate ? (
          <div className="fy-field">
            <label>{t("Tool_advance_tax_LabelAsOf")}</label>
            <input type="date" value={asOfDate} onChange={(e) => setAsOfDate(e.target.value)} />
            <p className="fy-field-hint">
              {t("Tool_advance_tax_AsOfHint", result.selected.dueLabel)}
            </p>
          </div>
        ) : (
          <div className="fy-field">
            <label>{t("Tool_advance_tax_LabelInstallment")}</label>
            <select
              value={manualInstallment}
              onChange={(e) => setManualInstallment(e.target.value as AdvanceTaxInstallmentId)}
            >
              {ADVANCE_TAX_SCHEDULE.map((row) => (
                <option key={row.id} value={row.id}>
                  {t(`Tool_advance_tax_Installment_${row.id}`)}
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
        title={t("Tool_advance_tax_ScheduleTitle")}
        subtitle={t("Tool_advance_tax_ScheduleSubtitle")}
        columns={[
          { key: "due", header: t("Tool_advance_tax_Col_Due"), alignRight: false },
          { key: "cumulative", header: t("Tool_advance_tax_Col_Cumulative") },
          { key: "installment", header: t("Tool_advance_tax_Col_Installment") },
          { key: "amount", header: t("Tool_advance_tax_Col_Amount") },
        ]}
        rows={result.schedule.map((row) => ({
          cells: {
            due:
              row.id === selectedInstallment
                ? `${row.dueLabel} · ${t("Tool_advance_tax_SelectedMark")}`
                : row.dueLabel,
            cumulative: `${row.cumulativePct}%`,
            installment: `${row.installmentPct}%`,
            amount: inr(row.installmentAmount),
          },
        }))}
      />
      <div className="fy-info-box">
        <p>{t("Tool_advance_tax_SuggestedNote", inr(result.suggestedThisInstallment), result.selected.dueLabel)}</p>
      </div>

      <ScenarioCompare
        title={t("Tool_advance_tax_ScenarioTitle")}
        subtitle={t("Tool_advance_tax_ScenarioSubtitle")}
        scenarios={scenarios}
      />
      <WorkedExample
        title={t("Tool_advance_tax_ExampleTitle")}
        subtitle={t("Tool_advance_tax_ExampleSubtitle")}
        steps={exampleSteps}
      />
    </ToolPageShell>
  );
}
