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
import { calculateSection80c, SECTION_80C_LIMIT } from "@/lib/finance/section80c";
import { inr, percent } from "@/lib/finance/format";
import { getTool } from "@/lib/config/tools";
import { section80cInfo } from "@/lib/tool-page-content";

export function Section80cCalculator() {
  const t = useT();
  const tool = getTool("section-80c")!;

  const [epf, setEpf] = useState(60_000);
  const [ppf, setPpf] = useState(50_000);
  const [elss, setElss] = useState(40_000);
  const [lifeInsurance, setLifeInsurance] = useState(0);
  const [homeLoanPrincipal, setHomeLoanPrincipal] = useState(0);
  const [nsc, setNsc] = useState(0);
  const [taxSavingFd, setTaxSavingFd] = useState(0);
  const [tuitionFees, setTuitionFees] = useState(0);
  const [other, setOther] = useState(0);
  const [taxSlab, setTaxSlab] = useState(30);

  const breakdownColumns = useMemo(
    () => [
      { key: "item", header: t("Tool_section_80c_Col_Item"), alignRight: false as const },
      { key: "amount", header: t("Tool_section_80c_Col_Amount") },
    ],
    [t],
  );

  const exampleSteps = useMemo(
    () => [
      t("Tool_section_80c_ExampleStep_1"),
      t("Tool_section_80c_ExampleStep_2"),
      t("Tool_section_80c_ExampleStep_3"),
      t("Tool_section_80c_ExampleStep_4"),
      t("Tool_section_80c_ExampleStep_5"),
    ],
    [t],
  );

  const { summaryCards, scenarios, breakdownRows, detail } = useMemo(() => {
    const result = calculateSection80c({
      epf,
      ppf,
      elss,
      lifeInsurance,
      homeLoanPrincipal,
      nsc,
      taxSavingFd,
      tuitionFees,
      other,
      taxSlabPercent: taxSlab,
    });
    const at20 = calculateSection80c({
      epf,
      ppf,
      elss,
      lifeInsurance,
      homeLoanPrincipal,
      nsc,
      taxSavingFd,
      tuitionFees,
      other,
      taxSlabPercent: 20,
    });
    const at5 = calculateSection80c({
      epf,
      ppf,
      elss,
      lifeInsurance,
      homeLoanPrincipal,
      nsc,
      taxSavingFd,
      tuitionFees,
      other,
      taxSlabPercent: 5,
    });

    return {
      detail: result,
      summaryCards: [
        {
          label: t("Tool_section_80c_Result_Eligible"),
          value: inr(result.eligibleDeduction),
          footnote: t("Tool_section_80c_Result_EligibleFootnote", inr(SECTION_80C_LIMIT)),
          variant: "primary" as const,
        },
        {
          label: t("Tool_section_80c_Result_Saving"),
          value: inr(result.estimatedTaxSaving),
          footnote: t("Tool_section_80c_Result_SavingFootnote", percent(taxSlab, 0)),
          variant: "secure" as const,
        },
        {
          label:
            result.unusedLimit > 0
              ? t("Tool_section_80c_Result_Unused")
              : t("Tool_section_80c_Result_Over"),
          value: inr(result.unusedLimit > 0 ? result.unusedLimit : result.overLimit),
          footnote:
            result.unusedLimit > 0
              ? t("Tool_section_80c_Result_UnusedFootnote")
              : t("Tool_section_80c_Result_OverFootnote"),
        },
      ],
      scenarios: [
        {
          name: t("Tool_section_80c_Scenario_5"),
          primaryLabel: t("Tool_section_80c_Result_Saving"),
          primaryValue: inr(at5.estimatedTaxSaving),
          secondaryLabel: t("Tool_section_80c_LabelSlab"),
          secondaryValue: "5%",
          variant: "worst",
        },
        {
          name: t("Common_Scenario_Base"),
          primaryLabel: t("Tool_section_80c_Result_Saving"),
          primaryValue: inr(result.estimatedTaxSaving),
          secondaryLabel: t("Tool_section_80c_Result_Eligible"),
          secondaryValue: inr(result.eligibleDeduction),
          variant: "base",
        },
        {
          name: t("Tool_section_80c_Scenario_20"),
          primaryLabel: t("Tool_section_80c_Result_Saving"),
          primaryValue: inr(at20.estimatedTaxSaving),
          secondaryLabel: t("Tool_section_80c_LabelSlab"),
          secondaryValue: "20%",
          variant: "best",
        },
      ],
      breakdownRows: result.breakdown.map((row) => ({
        cells: {
          item: t(`Tool_section_80c_Item_${row.key}`),
          amount: inr(row.amount),
        },
      })),
    };
  }, [
    epf,
    ppf,
    elss,
    lifeInsurance,
    homeLoanPrincipal,
    nsc,
    taxSavingFd,
    tuitionFees,
    other,
    taxSlab,
    t,
  ]);

  const field = (
    labelKey: string,
    value: number,
    set: (n: number) => void,
  ) => (
    <div className="fy-field">
      <label>{t(labelKey)}</label>
      <input
        type="number"
        min={0}
        step={1000}
        inputMode="decimal"
        value={value}
        onChange={(e) => set(Math.max(0, Number(e.target.value) || 0))}
      />
    </div>
  );

  return (
    <ToolPageShell
      title={t(tool.titleKey)}
      subtitle={t("Tool_section_80c_Subtitle")}
      description={t(tool.descriptionKey)}
      icon={tool.icon}
      educate={
        <>
          <div className="fy-info-box">
            <strong>{t("Common_WhatYouLearn")}</strong>
            <p>{t("Tool_section_80c_LearnText")}</p>
          </div>
          <FormulaCard
            title={t("Common_Formula")}
            code={"Eligible = min(sum of 80C items, ₹1.5L)\nTax saving ≈ Eligible × slab"}
            note={t("Tool_section_80c_FormulaNote")}
          />
        </>
      }
      below={<ToolInfoPanel info={section80cInfo(t)} />}
    >
      <div className="fy-form-card">
        <h3>{t("Common_YourInputs")}</h3>
        {field("Tool_section_80c_LabelEpf", epf, setEpf)}
        {field("Tool_section_80c_LabelPpf", ppf, setPpf)}
        {field("Tool_section_80c_LabelElss", elss, setElss)}
        {field("Tool_section_80c_LabelLife", lifeInsurance, setLifeInsurance)}
        {field("Tool_section_80c_LabelHome", homeLoanPrincipal, setHomeLoanPrincipal)}
        {field("Tool_section_80c_LabelNsc", nsc, setNsc)}
        {field("Tool_section_80c_LabelFd", taxSavingFd, setTaxSavingFd)}
        {field("Tool_section_80c_LabelTuition", tuitionFees, setTuitionFees)}
        {field("Tool_section_80c_LabelOther", other, setOther)}
        <div className="fy-field">
          <label>{t("Tool_section_80c_LabelSlab")}</label>
          <select value={taxSlab} onChange={(e) => setTaxSlab(Number(e.target.value))}>
            <option value={5}>5%</option>
            <option value={10}>10%</option>
            <option value={20}>20%</option>
            <option value={30}>30%</option>
          </select>
        </div>
        <button type="button" className="fy-btn-calc">
          {t("Common_Calculate")}
        </button>
      </div>

      <div className="fy-info-box fy-tax-verdict">
        <strong>{t("Tool_section_80c_StatusTitle")}</strong>
        <p>
          {t(
            "Tool_section_80c_StatusBody",
            inr(detail.totalInvested),
            inr(detail.eligibleDeduction),
            inr(detail.estimatedTaxSaving),
          )}
        </p>
      </div>

      <ResultSummaryCards cards={summaryCards} />
      <ScenarioCompare
        title={t("Tool_section_80c_ScenarioTitle")}
        subtitle={t("Tool_section_80c_ScenarioSubtitle")}
        scenarios={scenarios}
      />
      <BreakdownTable
        title={t("Tool_section_80c_BreakdownTitle")}
        columns={breakdownColumns}
        rows={breakdownRows}
      />
      <WorkedExample
        title={t("Tool_section_80c_ExampleTitle")}
        subtitle={t("Tool_section_80c_ExampleSubtitle")}
        steps={exampleSteps}
      />
    </ToolPageShell>
  );
}
