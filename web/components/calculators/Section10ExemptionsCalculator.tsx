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
  calculateSection10Exemptions,
  SECTION_10_EDUCATIONAL_CAP,
} from "@/lib/finance/section10Exemptions";
import { inr } from "@/lib/finance/format";
import { getTool } from "@/lib/config/tools";
import { section10ExemptionsInfo } from "@/lib/tool-page-content";

export function Section10ExemptionsCalculator() {
  const t = useT();
  const tool = getTool("section-10-exemptions")!;

  const [hra, setHra] = useState(1_80_000);
  const [lta, setLta] = useState(40_000);
  const [leave, setLeave] = useState(0);
  const [gratuity, setGratuity] = useState(0);
  const [other, setOther] = useState(0);

  const exampleSteps = useMemo(
    () => [
      t("Tool_section_10_exemptions_ExampleStep_1"),
      t("Tool_section_10_exemptions_ExampleStep_2"),
      t("Tool_section_10_exemptions_ExampleStep_3"),
      t("Tool_section_10_exemptions_ExampleStep_4"),
      t("Tool_section_10_exemptions_ExampleStep_5"),
    ],
    [t],
  );

  const { summaryCards, scenarios, result } = useMemo(() => {
    const result = calculateSection10Exemptions({
      hraExempt: hra,
      ltaExempt: lta,
      leaveEncashmentExempt: leave,
      gratuityExempt: gratuity,
      otherExempt: other,
    });
    const hraOnly = calculateSection10Exemptions({
      hraExempt: hra,
      ltaExempt: 0,
      leaveEncashmentExempt: 0,
      gratuityExempt: 0,
      otherExempt: 0,
    });
    const withGratuity = calculateSection10Exemptions({
      hraExempt: hra,
      ltaExempt: lta,
      leaveEncashmentExempt: leave,
      gratuityExempt: Math.max(gratuity, 5_00_000),
      otherExempt: other,
    });

    return {
      result,
      summaryCards: [
        {
          label: t("Tool_section_10_exemptions_Result_Total"),
          value: inr(result.totalExempt),
          footnote: t(
            "Tool_section_10_exemptions_Result_TotalFootnote",
            inr(SECTION_10_EDUCATIONAL_CAP),
          ),
          variant: "primary" as const,
        },
        {
          label: t("Tool_section_10_exemptions_Result_Raw"),
          value: inr(result.rawTotal),
          footnote: t("Tool_section_10_exemptions_Result_RawFootnote"),
        },
        {
          label: t("Tool_section_10_exemptions_Result_Hra"),
          value: inr(result.hraExempt),
          footnote: t("Tool_section_10_exemptions_Result_HraFootnote"),
          variant: "secure" as const,
        },
      ],
      scenarios: [
        {
          name: t("Tool_section_10_exemptions_Scenario_HraOnly"),
          primaryLabel: t("Tool_section_10_exemptions_Result_Total"),
          primaryValue: inr(hraOnly.totalExempt),
          secondaryLabel: t("Tool_section_10_exemptions_Result_Hra"),
          secondaryValue: inr(hraOnly.hraExempt),
          variant: "worst" as const,
        },
        {
          name: t("Common_Scenario_Base"),
          primaryLabel: t("Tool_section_10_exemptions_Result_Total"),
          primaryValue: inr(result.totalExempt),
          secondaryLabel: t("Tool_section_10_exemptions_Result_Raw"),
          secondaryValue: inr(result.rawTotal),
          variant: "base" as const,
        },
        {
          name: t("Tool_section_10_exemptions_Scenario_PlusGratuity"),
          primaryLabel: t("Tool_section_10_exemptions_Result_Total"),
          primaryValue: inr(withGratuity.totalExempt),
          secondaryLabel: t("Tool_section_10_exemptions_Result_Raw"),
          secondaryValue: inr(withGratuity.rawTotal),
          variant: "best" as const,
        },
      ],
    };
  }, [hra, lta, leave, gratuity, other, t]);

  return (
    <ToolPageShell
      title={t(tool.titleKey)}
      subtitle={t("Tool_section_10_exemptions_Subtitle")}
      description={t(tool.descriptionKey)}
      icon={tool.icon}
      educate={
        <>
          <div className="fy-info-box">
            <strong>{t("Common_WhatYouLearn")}</strong>
            <p>{t("Tool_section_10_exemptions_LearnText")}</p>
          </div>
          <FormulaCard
            title={t("Common_Formula")}
            code={"Total = HRA + LTA + leave + gratuity + other\nCapped educationally at ₹25L"}
            note={t("Tool_section_10_exemptions_FormulaNote")}
          />
        </>
      }
      below={<ToolInfoPanel info={section10ExemptionsInfo(t)} />}
    >
      <div className="fy-form-card">
        <h3>{t("Common_YourInputs")}</h3>
        <div className="fy-field">
          <label>{t("Tool_section_10_exemptions_LabelHra")}</label>
          <input
            type="number"
            min={0}
            step={1000}
            inputMode="decimal"
            value={hra}
            onChange={(e) => setHra(Math.max(0, Number(e.target.value) || 0))}
          />
        </div>
        <div className="fy-field">
          <label>{t("Tool_section_10_exemptions_LabelLta")}</label>
          <input
            type="number"
            min={0}
            step={1000}
            inputMode="decimal"
            value={lta}
            onChange={(e) => setLta(Math.max(0, Number(e.target.value) || 0))}
          />
        </div>
        <div className="fy-field">
          <label>{t("Tool_section_10_exemptions_LabelLeave")}</label>
          <input
            type="number"
            min={0}
            step={1000}
            inputMode="decimal"
            value={leave}
            onChange={(e) => setLeave(Math.max(0, Number(e.target.value) || 0))}
          />
        </div>
        <div className="fy-field">
          <label>{t("Tool_section_10_exemptions_LabelGratuity")}</label>
          <input
            type="number"
            min={0}
            step={10000}
            inputMode="decimal"
            value={gratuity}
            onChange={(e) => setGratuity(Math.max(0, Number(e.target.value) || 0))}
          />
        </div>
        <div className="fy-field">
          <label>{t("Tool_section_10_exemptions_LabelOther")}</label>
          <input
            type="number"
            min={0}
            step={1000}
            inputMode="decimal"
            value={other}
            onChange={(e) => setOther(Math.max(0, Number(e.target.value) || 0))}
          />
        </div>
        <button type="button" className="fy-btn-calc">
          {t("Common_Calculate")}
        </button>
      </div>

      {result.capped && (
        <div className="fy-info-box">
          <strong>{t("Tool_section_10_exemptions_CappedTitle")}</strong>
          <p>
            {t(
              "Tool_section_10_exemptions_CappedNote",
              inr(result.rawTotal),
              inr(SECTION_10_EDUCATIONAL_CAP),
            )}
          </p>
        </div>
      )}

      <ResultSummaryCards cards={summaryCards} />
      <ScenarioCompare
        title={t("Tool_section_10_exemptions_ScenarioTitle")}
        subtitle={t("Tool_section_10_exemptions_ScenarioSubtitle")}
        scenarios={scenarios}
      />
      <WorkedExample
        title={t("Tool_section_10_exemptions_ExampleTitle")}
        subtitle={t("Tool_section_10_exemptions_ExampleSubtitle")}
        steps={exampleSteps}
      />
    </ToolPageShell>
  );
}
