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
  AYUSHMAN_COVER,
  calculateAyushmanBharat,
  type AyushmanEligibility,
} from "@/lib/finance/ayushmanBharat";
import { inr } from "@/lib/finance/format";
import { getTool } from "@/lib/config/tools";
import { ayushmanBharatInfo } from "@/lib/tool-page-content";

export function AyushmanBharatCalculator() {
  const t = useT();
  const tool = getTool("ayushman-bharat")!;

  const [familySize, setFamilySize] = useState(4);
  const [eligibility, setEligibility] = useState<AyushmanEligibility>("secc");
  const [existingCover, setExistingCover] = useState(0);

  const exampleSteps = useMemo(
    () => [
      t("Tool_ayushman_bharat_ExampleStep_1"),
      t("Tool_ayushman_bharat_ExampleStep_2"),
      t("Tool_ayushman_bharat_ExampleStep_3"),
      t("Tool_ayushman_bharat_ExampleStep_4"),
      t("Tool_ayushman_bharat_ExampleStep_5"),
    ],
    [t],
  );

  const { summaryCards, scenarios } = useMemo(() => {
    const result = calculateAyushmanBharat({ familySize, eligibility, existingCover });
    const senior = calculateAyushmanBharat({
      familySize,
      eligibility: "senior70",
      existingCover,
    });
    const notListed = calculateAyushmanBharat({
      familySize,
      eligibility: "not_listed",
      existingCover,
    });

    const statusKey =
      result.noteKey === "not_eligible"
        ? "Tool_ayushman_bharat_Status_NotEligible"
        : result.noteKey === "senior70"
          ? "Tool_ayushman_bharat_Status_Senior70"
          : result.noteKey === "state"
            ? "Tool_ayushman_bharat_Status_State"
            : "Tool_ayushman_bharat_Status_Eligible";

    return {
      summaryCards: [
        {
          label: t("Tool_ayushman_bharat_Result_Cover"),
          value: inr(result.coverAmount),
          footnote: t("Tool_ayushman_bharat_Result_CoverFootnote"),
          variant: "primary" as const,
        },
        {
          label: t("Tool_ayushman_bharat_Result_Status"),
          value: t(statusKey),
          footnote: t("Tool_ayushman_bharat_Result_StatusFootnote", familySize),
        },
        {
          label: t("Tool_ayushman_bharat_Result_Gap"),
          value: inr(result.gapVsPrivate),
          footnote: t("Tool_ayushman_bharat_Result_GapFootnote"),
          variant: "secure" as const,
        },
      ],
      scenarios: [
        {
          name: t("Tool_ayushman_bharat_Scenario_Secc"),
          primaryLabel: t("Tool_ayushman_bharat_Result_Cover"),
          primaryValue: inr(AYUSHMAN_COVER),
          secondaryLabel: t("Tool_ayushman_bharat_Result_Status"),
          secondaryValue: t("Tool_ayushman_bharat_Status_Eligible"),
          variant: "best" as const,
        },
        {
          name: t("Tool_ayushman_bharat_Scenario_Senior"),
          primaryLabel: t("Tool_ayushman_bharat_Result_Cover"),
          primaryValue: inr(senior.coverAmount),
          secondaryLabel: t("Tool_ayushman_bharat_Result_Status"),
          secondaryValue: t("Tool_ayushman_bharat_Status_Senior70"),
          variant: "base" as const,
        },
        {
          name: t("Tool_ayushman_bharat_Scenario_Not"),
          primaryLabel: t("Tool_ayushman_bharat_Result_Cover"),
          primaryValue: inr(notListed.coverAmount),
          secondaryLabel: t("Tool_ayushman_bharat_Result_Status"),
          secondaryValue: t("Tool_ayushman_bharat_Status_NotEligible"),
          variant: "worst" as const,
        },
      ],
    };
  }, [familySize, eligibility, existingCover, t]);

  return (
    <ToolPageShell
      title={t(tool.titleKey)}
      subtitle={t("Tool_ayushman_bharat_Subtitle")}
      description={t(tool.descriptionKey)}
      icon={tool.icon}
      educate={
        <>
          <div className="fy-info-box">
            <strong>{t("Common_WhatYouLearn")}</strong>
            <p>{t("Tool_ayushman_bharat_LearnText")}</p>
          </div>
          <FormulaCard
            title={t("Common_Formula")}
            code={"PM-JAY cover = ₹5,00,000 / family / year\neligible categories → show cover\nnot a live eligibility API"}
            note={t("Tool_ayushman_bharat_FormulaNote")}
          />
        </>
      }
      below={<ToolInfoPanel info={ayushmanBharatInfo(t)} />}
    >
      <div className="fy-form-card">
        <h3>{t("Common_YourInputs")}</h3>
        <div className="fy-field">
          <label>{t("Tool_ayushman_bharat_LabelFamily")}</label>
          <input
            type="number"
            min={1}
            max={20}
            step={1}
            inputMode="numeric"
            value={familySize}
            onChange={(e) =>
              setFamilySize(Math.min(20, Math.max(1, Number(e.target.value) || 1)))
            }
          />
        </div>
        <div className="fy-field">
          <label>{t("Tool_ayushman_bharat_LabelEligibility")}</label>
          <select
            value={eligibility}
            onChange={(e) => setEligibility(e.target.value as AyushmanEligibility)}
          >
            <option value="secc">{t("Tool_ayushman_bharat_Elig_Secc")}</option>
            <option value="senior70">{t("Tool_ayushman_bharat_Elig_Senior70")}</option>
            <option value="state_scheme">{t("Tool_ayushman_bharat_Elig_State")}</option>
            <option value="not_listed">{t("Tool_ayushman_bharat_Elig_Not")}</option>
          </select>
          <p className="fy-field-hint">{t("Tool_ayushman_bharat_EligHint")}</p>
        </div>
        <div className="fy-field">
          <label>{t("Tool_ayushman_bharat_LabelExisting")}</label>
          <input
            type="number"
            min={0}
            step={10000}
            inputMode="decimal"
            value={existingCover}
            onChange={(e) => setExistingCover(Math.max(0, Number(e.target.value) || 0))}
          />
        </div>
        <button type="button" className="fy-btn-calc">
          {t("Common_Calculate")}
        </button>
      </div>

      <ResultSummaryCards cards={summaryCards} />
      <ScenarioCompare
        title={t("Tool_ayushman_bharat_ScenarioTitle")}
        subtitle={t("Tool_ayushman_bharat_ScenarioSubtitle")}
        scenarios={scenarios}
      />
      <WorkedExample
        title={t("Tool_ayushman_bharat_ExampleTitle")}
        subtitle={t("Tool_ayushman_bharat_ExampleSubtitle")}
        steps={exampleSteps}
      />
    </ToolPageShell>
  );
}
