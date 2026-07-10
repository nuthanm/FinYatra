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
  calculateTaxSavingFd,
  TAX_SAVING_FD_80C_LIMIT,
  TAX_SAVING_FD_DEFAULT_RATE,
  TAX_SAVING_FD_LOCKIN_YEARS,
  taxSavingFdYearlyRows,
  type TaxSavingFdCompounding,
} from "@/lib/finance/taxSavingFd";
import { inr, percent } from "@/lib/finance/format";
import { getTool } from "@/lib/config/tools";
import { standardGrowthColumns, taxSavingFdInfo } from "@/lib/tool-page-content";

const COMPOUND_OPTIONS: { value: TaxSavingFdCompounding; labelKey: string }[] = [
  { value: 1, labelKey: "Tool_tax_saving_fd_Compound_Annual" },
  { value: 4, labelKey: "Tool_tax_saving_fd_Compound_Quarterly" },
];

export function TaxSavingFdCalculator() {
  const t = useT();
  const tool = getTool("tax-saving-fd")!;

  const [deposit, setDeposit] = useState(150_000);
  const [rate, setRate] = useState(TAX_SAVING_FD_DEFAULT_RATE);
  const [compounds, setCompounds] = useState<TaxSavingFdCompounding>(4);
  const [taxSlab, setTaxSlab] = useState(30);

  const breakdownColumns = useMemo(() => standardGrowthColumns(t), [t]);

  const exampleSteps = useMemo(
    () => [
      t("Tool_tax_saving_fd_ExampleStep_1"),
      t("Tool_tax_saving_fd_ExampleStep_2"),
      t("Tool_tax_saving_fd_ExampleStep_3"),
      t("Tool_tax_saving_fd_ExampleStep_4"),
      t("Tool_tax_saving_fd_ExampleStep_5"),
    ],
    [t],
  );

  const { summaryCards, scenarios, breakdownRows } = useMemo(() => {
    const input = {
      deposit,
      annualRatePercent: rate,
      compoundsPerYear: compounds,
      taxSlabPercent: taxSlab,
    };
    const result = calculateTaxSavingFd(input);
    const at20 = calculateTaxSavingFd({ ...input, taxSlabPercent: 20 });
    const at5 = calculateTaxSavingFd({ ...input, taxSlabPercent: 5 });

    return {
      summaryCards: [
        {
          label: t("Tool_tax_saving_fd_Result_Maturity"),
          value: inr(result.maturity),
          footnote: t("Common_Footnote_RatePa", percent(rate)),
          variant: "primary" as const,
        },
        {
          label: t("Tool_tax_saving_fd_Result_Interest"),
          value: inr(result.interest),
          footnote: t("Tool_tax_saving_fd_Result_InterestFootnote", percent(result.effectiveRate)),
          variant: "secure" as const,
        },
        {
          label: t("Tool_tax_saving_fd_Result_80c"),
          value: inr(result.estimatedTaxSaving),
          footnote: t(
            "Tool_tax_saving_fd_Result_80cFootnote",
            inr(result.eligible80c),
            percent(taxSlab, 0),
          ),
        },
      ],
      scenarios: [
        {
          name: t("Tool_tax_saving_fd_Scenario_5"),
          primaryLabel: t("Tool_tax_saving_fd_Result_80c"),
          primaryValue: inr(at5.estimatedTaxSaving),
          secondaryLabel: t("Tool_tax_saving_fd_LabelSlab"),
          secondaryValue: "5%",
          variant: "worst",
        },
        {
          name: t("Common_Scenario_Base"),
          primaryLabel: t("Tool_tax_saving_fd_Result_Maturity"),
          primaryValue: inr(result.maturity),
          secondaryLabel: t("Tool_tax_saving_fd_Result_80c"),
          secondaryValue: inr(result.estimatedTaxSaving),
          variant: "base",
        },
        {
          name: t("Tool_tax_saving_fd_Scenario_20"),
          primaryLabel: t("Tool_tax_saving_fd_Result_80c"),
          primaryValue: inr(at20.estimatedTaxSaving),
          secondaryLabel: t("Tool_tax_saving_fd_LabelSlab"),
          secondaryValue: "20%",
          variant: "best",
        },
      ],
      breakdownRows: taxSavingFdYearlyRows(deposit, rate, compounds).map((row) => ({
        cells: {
          year: t("Common_YearN", Math.floor(row.year)),
          invested: inr(deposit),
          value: inr(row.value),
          gain: inr(row.interest),
        },
      })),
    };
  }, [deposit, rate, compounds, taxSlab, t]);

  return (
    <ToolPageShell
      title={t(tool.titleKey)}
      subtitle={t("Tool_tax_saving_fd_Subtitle")}
      description={t(tool.descriptionKey)}
      icon={tool.icon}
      educate={
        <>
          <div className="fy-info-box">
            <strong>{t("Common_WhatYouLearn")}</strong>
            <p>{t("Tool_tax_saving_fd_LearnText")}</p>
          </div>
          <FormulaCard
            title={t("Common_Formula")}
            code={"A = P × (1 + r/n)^(n×5)\n80C eligible = min(P, ₹1.5L)\nTax saving ≈ Eligible × slab"}
            note={t("Tool_tax_saving_fd_FormulaNote")}
          />
        </>
      }
      below={<ToolInfoPanel info={taxSavingFdInfo(t)} />}
    >
      <div className="fy-form-card">
        <h3>{t("Common_YourInputs")}</h3>
        <div className="fy-field">
          <label>{t("Tool_tax_saving_fd_LabelDeposit")}</label>
          <input
            type="number"
            min={0}
            step={1000}
            inputMode="decimal"
            value={deposit}
            onChange={(e) => setDeposit(Math.max(0, Number(e.target.value) || 0))}
          />
          <p className="fy-field-hint">
            {t("Tool_tax_saving_fd_DepositHint", inr(TAX_SAVING_FD_80C_LIMIT))}
          </p>
        </div>
        <div className="fy-field">
          <label>{t("Common_Label_RatePa")}</label>
          <input
            type="number"
            min={0}
            step={0.05}
            inputMode="decimal"
            value={rate}
            onChange={(e) => setRate(Math.max(0, Number(e.target.value) || 0))}
          />
        </div>
        <div className="fy-field">
          <label>{t("Common_Label_Years")}</label>
          <input type="number" value={TAX_SAVING_FD_LOCKIN_YEARS} disabled readOnly />
          <p className="fy-field-hint">{t("Tool_tax_saving_fd_LockinHint")}</p>
        </div>
        <div className="fy-field">
          <label>{t("Tool_tax_saving_fd_LabelFrequency")}</label>
          <select
            value={compounds}
            onChange={(e) => setCompounds(Number(e.target.value) as TaxSavingFdCompounding)}
          >
            {COMPOUND_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {t(opt.labelKey)}
              </option>
            ))}
          </select>
        </div>
        <div className="fy-field">
          <label>{t("Tool_tax_saving_fd_LabelSlab")}</label>
          <input
            type="number"
            min={0}
            max={42}
            step={1}
            inputMode="decimal"
            value={taxSlab}
            onChange={(e) => setTaxSlab(Math.min(42, Math.max(0, Number(e.target.value) || 0)))}
          />
        </div>
        <button type="button" className="fy-btn-calc">
          {t("Common_Calculate")}
        </button>
      </div>

      <ResultSummaryCards cards={summaryCards} />
      <ScenarioCompare
        title={t("Tool_tax_saving_fd_ScenarioTitle")}
        subtitle={t("Tool_tax_saving_fd_ScenarioSubtitle")}
        scenarios={scenarios}
      />
      <BreakdownTable
        title={t("Tool_tax_saving_fd_BreakdownTitle")}
        columns={breakdownColumns}
        rows={breakdownRows}
      />
      <WorkedExample
        title={t("Tool_tax_saving_fd_ExampleTitle")}
        subtitle={t("Tool_tax_saving_fd_ExampleSubtitle")}
        steps={exampleSteps}
      />
    </ToolPageShell>
  );
}
