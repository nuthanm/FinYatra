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
  calculateSection80d,
  SECTION_80D_BASE_LIMIT,
  SECTION_80D_PREVENTIVE_CAP,
  SECTION_80D_SENIOR_LIMIT,
} from "@/lib/finance/section80d";
import { inr, percent } from "@/lib/finance/format";
import { getTool } from "@/lib/config/tools";
import { section80dInfo } from "@/lib/tool-page-content";

export function Section80dCalculator() {
  const t = useT();
  const tool = getTool("section-80d")!;

  const [selfFamilyPremium, setSelfFamilyPremium] = useState(20_000);
  const [parentsPremium, setParentsPremium] = useState(30_000);
  const [preventiveCheckup, setPreventiveCheckup] = useState(5_000);
  const [selfSenior, setSelfSenior] = useState(false);
  const [parentsSenior, setParentsSenior] = useState(true);
  const [taxSlab, setTaxSlab] = useState(30);

  const breakdownColumns = useMemo(
    () => [
      { key: "item", header: t("Tool_section_80d_Col_Item"), alignRight: false as const },
      { key: "amount", header: t("Tool_section_80d_Col_Amount") },
      { key: "limit", header: t("Tool_section_80d_Col_Limit") },
    ],
    [t],
  );

  const exampleSteps = useMemo(
    () => [
      t("Tool_section_80d_ExampleStep_1"),
      t("Tool_section_80d_ExampleStep_2"),
      t("Tool_section_80d_ExampleStep_3"),
      t("Tool_section_80d_ExampleStep_4"),
      t("Tool_section_80d_ExampleStep_5"),
    ],
    [t],
  );

  const { summaryCards, scenarios, breakdownRows } = useMemo(() => {
    const input = {
      selfFamilyPremium,
      parentsPremium,
      preventiveCheckup,
      selfSenior,
      parentsSenior,
      taxSlabPercent: taxSlab,
    };
    const result = calculateSection80d(input);
    const at20 = calculateSection80d({ ...input, taxSlabPercent: 20 });
    const at5 = calculateSection80d({ ...input, taxSlabPercent: 5 });

    return {
      summaryCards: [
        {
          label: t("Tool_section_80d_Result_Eligible"),
          value: inr(result.eligibleDeduction),
          footnote: t(
            "Tool_section_80d_Result_EligibleFootnote",
            inr(result.selfLimit),
            inr(result.parentsLimit),
          ),
          variant: "primary" as const,
        },
        {
          label: t("Tool_section_80d_Result_Saving"),
          value: inr(result.estimatedTaxSaving),
          footnote: t("Tool_section_80d_Result_SavingFootnote", percent(taxSlab, 0)),
          variant: "secure" as const,
        },
        {
          label: t("Tool_section_80d_Result_Preventive"),
          value: inr(result.preventiveEligible),
          footnote: t("Tool_section_80d_Result_PreventiveFootnote", inr(SECTION_80D_PREVENTIVE_CAP)),
        },
      ],
      scenarios: [
        {
          name: t("Tool_section_80d_Scenario_5"),
          primaryLabel: t("Tool_section_80d_Result_Saving"),
          primaryValue: inr(at5.estimatedTaxSaving),
          secondaryLabel: t("Tool_section_80d_LabelSlab"),
          secondaryValue: "5%",
          variant: "worst",
        },
        {
          name: t("Common_Scenario_Base"),
          primaryLabel: t("Tool_section_80d_Result_Saving"),
          primaryValue: inr(result.estimatedTaxSaving),
          secondaryLabel: t("Tool_section_80d_Result_Eligible"),
          secondaryValue: inr(result.eligibleDeduction),
          variant: "base",
        },
        {
          name: t("Tool_section_80d_Scenario_20"),
          primaryLabel: t("Tool_section_80d_Result_Saving"),
          primaryValue: inr(at20.estimatedTaxSaving),
          secondaryLabel: t("Tool_section_80d_LabelSlab"),
          secondaryValue: "20%",
          variant: "best",
        },
      ],
      breakdownRows: [
        {
          cells: {
            item: t("Tool_section_80d_Item_Self"),
            amount: inr(result.selfEligible),
            limit: inr(result.selfLimit),
          },
        },
        {
          cells: {
            item: t("Tool_section_80d_Item_Parents"),
            amount: inr(result.parentsEligible),
            limit: inr(result.parentsLimit),
          },
        },
        {
          cells: {
            item: t("Tool_section_80d_Item_Preventive"),
            amount: inr(result.preventiveEligible),
            limit: inr(SECTION_80D_PREVENTIVE_CAP),
          },
        },
      ],
    };
  }, [
    selfFamilyPremium,
    parentsPremium,
    preventiveCheckup,
    selfSenior,
    parentsSenior,
    taxSlab,
    t,
  ]);

  return (
    <ToolPageShell
      title={t(tool.titleKey)}
      subtitle={t("Tool_section_80d_Subtitle")}
      description={t(tool.descriptionKey)}
      icon={tool.icon}
      educate={
        <>
          <div className="fy-info-box">
            <strong>{t("Common_WhatYouLearn")}</strong>
            <p>{t("Tool_section_80d_LearnText")}</p>
          </div>
          <FormulaCard
            title={t("Common_Formula")}
            code={`Self limit ${inr(SECTION_80D_BASE_LIMIT)} / ${inr(SECTION_80D_SENIOR_LIMIT)} (senior)\nParents separate limit · Preventive ≤ ${inr(SECTION_80D_PREVENTIVE_CAP)} inside self\nTax saving ≈ Eligible × slab`}
            note={t("Tool_section_80d_FormulaNote")}
          />
        </>
      }
      below={<ToolInfoPanel info={section80dInfo(t)} />}
    >
      <div className="fy-form-card">
        <h3>{t("Common_YourInputs")}</h3>
        <div className="fy-field">
          <label>{t("Tool_section_80d_LabelSelf")}</label>
          <input
            type="number"
            min={0}
            step={1000}
            inputMode="decimal"
            value={selfFamilyPremium}
            onChange={(e) => setSelfFamilyPremium(Math.max(0, Number(e.target.value) || 0))}
          />
          <p className="fy-field-hint">{t("Tool_section_80d_SelfHint")}</p>
        </div>
        <div className="fy-field">
          <label>
            <input type="checkbox" checked={selfSenior} onChange={(e) => setSelfSenior(e.target.checked)} />{" "}
            {t("Tool_section_80d_LabelSelfSenior")}
          </label>
        </div>
        <div className="fy-field">
          <label>{t("Tool_section_80d_LabelParents")}</label>
          <input
            type="number"
            min={0}
            step={1000}
            inputMode="decimal"
            value={parentsPremium}
            onChange={(e) => setParentsPremium(Math.max(0, Number(e.target.value) || 0))}
          />
        </div>
        <div className="fy-field">
          <label>
            <input
              type="checkbox"
              checked={parentsSenior}
              onChange={(e) => setParentsSenior(e.target.checked)}
            />{" "}
            {t("Tool_section_80d_LabelParentsSenior")}
          </label>
        </div>
        <div className="fy-field">
          <label>{t("Tool_section_80d_LabelPreventive")}</label>
          <input
            type="number"
            min={0}
            step={500}
            inputMode="decimal"
            value={preventiveCheckup}
            onChange={(e) => setPreventiveCheckup(Math.max(0, Number(e.target.value) || 0))}
          />
          <p className="fy-field-hint">{t("Tool_section_80d_PreventiveHint")}</p>
        </div>
        <div className="fy-field">
          <label>{t("Tool_section_80d_LabelSlab")}</label>
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
        title={t("Tool_section_80d_ScenarioTitle")}
        subtitle={t("Tool_section_80d_ScenarioSubtitle")}
        scenarios={scenarios}
      />
      <BreakdownTable
        title={t("Tool_section_80d_BreakdownTitle")}
        columns={breakdownColumns}
        rows={breakdownRows}
      />
      <WorkedExample
        title={t("Tool_section_80d_ExampleTitle")}
        subtitle={t("Tool_section_80d_ExampleSubtitle")}
        steps={exampleSteps}
      />
    </ToolPageShell>
  );
}
