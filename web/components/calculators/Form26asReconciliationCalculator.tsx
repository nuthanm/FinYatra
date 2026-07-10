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
import { calculateForm26asReconciliation } from "@/lib/finance/form26asReconciliation";
import { inr } from "@/lib/finance/format";
import { getTool } from "@/lib/config/tools";
import { form26asReconciliationInfo } from "@/lib/tool-page-content";

export function Form26asReconciliationCalculator() {
  const t = useT();
  const tool = getTool("form-26as-reconciliation")!;

  const [tds26as, setTds26as] = useState(1_20_000);
  const [tdsBooks, setTdsBooks] = useState(1_05_000);

  const exampleSteps = useMemo(
    () => [
      t("Tool_form_26as_reconciliation_ExampleStep_1"),
      t("Tool_form_26as_reconciliation_ExampleStep_2"),
      t("Tool_form_26as_reconciliation_ExampleStep_3"),
      t("Tool_form_26as_reconciliation_ExampleStep_4"),
      t("Tool_form_26as_reconciliation_ExampleStep_5"),
    ],
    [t],
  );

  const { summaryCards, scenarios, result } = useMemo(() => {
    const result = calculateForm26asReconciliation({
      tdsAsPer26as: tds26as,
      tdsAsPerBooks: tdsBooks,
    });
    const match = calculateForm26asReconciliation({
      tdsAsPer26as: tds26as,
      tdsAsPerBooks: tds26as,
    });
    const booksHigher = calculateForm26asReconciliation({
      tdsAsPer26as: tds26as,
      tdsAsPerBooks: tds26as + 25_000,
    });

    const statusKey =
      result.status === "match"
        ? "Tool_form_26as_reconciliation_Status_Match"
        : result.status === "26as_higher"
          ? "Tool_form_26as_reconciliation_Status_26asHigher"
          : "Tool_form_26as_reconciliation_Status_BooksHigher";

    return {
      result,
      summaryCards: [
        {
          label: t("Tool_form_26as_reconciliation_Result_26as"),
          value: inr(result.tdsAsPer26as),
          footnote: t("Tool_form_26as_reconciliation_Result_26asFootnote"),
          variant: "primary" as const,
        },
        {
          label: t("Tool_form_26as_reconciliation_Result_Books"),
          value: inr(result.tdsAsPerBooks),
          footnote: t("Tool_form_26as_reconciliation_Result_BooksFootnote"),
        },
        {
          label: t("Tool_form_26as_reconciliation_Result_Diff"),
          value: inr(result.difference),
          footnote: t(statusKey),
          variant:
            result.status === "match"
              ? ("secure" as const)
              : ("volatile" as const),
        },
      ],
      scenarios: [
        {
          name: t("Tool_form_26as_reconciliation_Scenario_Match"),
          primaryLabel: t("Tool_form_26as_reconciliation_Result_Diff"),
          primaryValue: inr(match.difference),
          secondaryLabel: t("Tool_form_26as_reconciliation_Result_26as"),
          secondaryValue: inr(match.tdsAsPer26as),
          variant: "best" as const,
        },
        {
          name: t("Common_Scenario_Base"),
          primaryLabel: t("Tool_form_26as_reconciliation_Result_Diff"),
          primaryValue: inr(result.difference),
          secondaryLabel: t("Tool_form_26as_reconciliation_Result_Books"),
          secondaryValue: inr(result.tdsAsPerBooks),
          variant: "base" as const,
        },
        {
          name: t("Tool_form_26as_reconciliation_Scenario_BooksHigher"),
          primaryLabel: t("Tool_form_26as_reconciliation_Result_Diff"),
          primaryValue: inr(booksHigher.difference),
          secondaryLabel: t("Tool_form_26as_reconciliation_Result_Books"),
          secondaryValue: inr(booksHigher.tdsAsPerBooks),
          variant: "worst" as const,
        },
      ],
    };
  }, [tds26as, tdsBooks, t]);

  return (
    <ToolPageShell
      title={t(tool.titleKey)}
      subtitle={t("Tool_form_26as_reconciliation_Subtitle")}
      description={t(tool.descriptionKey)}
      icon={tool.icon}
      educate={
        <>
          <div className="fy-info-box">
            <strong>{t("Common_WhatYouLearn")}</strong>
            <p>{t("Tool_form_26as_reconciliation_LearnText")}</p>
          </div>
          <FormulaCard
            title={t("Common_Formula")}
            code={"difference = TDS (26AS) − TDS (books)\nmatch if |diff| ≈ 0"}
            note={t("Tool_form_26as_reconciliation_FormulaNote")}
          />
        </>
      }
      below={<ToolInfoPanel info={form26asReconciliationInfo(t)} />}
    >
      <div className="fy-form-card">
        <h3>{t("Common_YourInputs")}</h3>
        <div className="fy-field">
          <label>{t("Tool_form_26as_reconciliation_Label26as")}</label>
          <input
            type="number"
            min={0}
            step={1000}
            inputMode="decimal"
            value={tds26as}
            onChange={(e) => setTds26as(Math.max(0, Number(e.target.value) || 0))}
          />
        </div>
        <div className="fy-field">
          <label>{t("Tool_form_26as_reconciliation_LabelBooks")}</label>
          <input
            type="number"
            min={0}
            step={1000}
            inputMode="decimal"
            value={tdsBooks}
            onChange={(e) => setTdsBooks(Math.max(0, Number(e.target.value) || 0))}
          />
          <p className="fy-field-hint">{t("Tool_form_26as_reconciliation_BooksHint")}</p>
        </div>
        <button type="button" className="fy-btn-calc">
          {t("Common_Calculate")}
        </button>
      </div>

      <div className="fy-info-box">
        <strong>{t("Tool_form_26as_reconciliation_VerdictTitle")}</strong>
        <p>
          {result.status === "match"
            ? t("Tool_form_26as_reconciliation_VerdictMatch")
            : result.status === "26as_higher"
              ? t(
                  "Tool_form_26as_reconciliation_Verdict26as",
                  inr(result.absDifference),
                )
              : t(
                  "Tool_form_26as_reconciliation_VerdictBooks",
                  inr(result.absDifference),
                )}
        </p>
      </div>

      <ResultSummaryCards cards={summaryCards} />
      <ScenarioCompare
        title={t("Tool_form_26as_reconciliation_ScenarioTitle")}
        subtitle={t("Tool_form_26as_reconciliation_ScenarioSubtitle")}
        scenarios={scenarios}
      />
      <WorkedExample
        title={t("Tool_form_26as_reconciliation_ExampleTitle")}
        subtitle={t("Tool_form_26as_reconciliation_ExampleSubtitle")}
        steps={exampleSteps}
      />
    </ToolPageShell>
  );
}
