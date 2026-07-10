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
import { suggestItrForm, type ItrFormSources } from "@/lib/finance/itrForm";
import { getTool } from "@/lib/config/tools";
import { itrFormInfo } from "@/lib/tool-page-content";

const DEFAULT_SOURCES: ItrFormSources = {
  salaryOrPension: true,
  oneHouseProperty: false,
  moreThanOneHouse: false,
  otherSourcesInterest: true,
  capitalGains: false,
  businessProfession: false,
  presumptiveBusiness: false,
  foreignIncomeOrAssets: false,
  directorOrUnlistedEquity: false,
  incomeAbove50L: false,
};

export function ItrFormCalculator() {
  const t = useT();
  const tool = getTool("itr-form")!;

  const [sources, setSources] = useState<ItrFormSources>(DEFAULT_SOURCES);

  const toggle = (key: keyof ItrFormSources) => {
    setSources((prev) => {
      const next = { ...prev, [key]: !prev[key] };
      if (key === "moreThanOneHouse" && next.moreThanOneHouse) next.oneHouseProperty = false;
      if (key === "oneHouseProperty" && next.oneHouseProperty) next.moreThanOneHouse = false;
      if (key === "presumptiveBusiness" && next.presumptiveBusiness) next.businessProfession = true;
      if (key === "businessProfession" && !next.businessProfession) next.presumptiveBusiness = false;
      return next;
    });
  };

  const exampleSteps = useMemo(
    () => [
      t("Tool_itr_form_ExampleStep_1"),
      t("Tool_itr_form_ExampleStep_2"),
      t("Tool_itr_form_ExampleStep_3"),
      t("Tool_itr_form_ExampleStep_4"),
      t("Tool_itr_form_ExampleStep_5"),
    ],
    [t],
  );

  const { summaryCards, scenarios, result } = useMemo(() => {
    const result = suggestItrForm(sources);
    const withCg = suggestItrForm({ ...sources, capitalGains: true });
    const withBiz = suggestItrForm({
      ...sources,
      businessProfession: true,
      presumptiveBusiness: false,
    });

    return {
      result,
      summaryCards: [
        {
          label: t("Tool_itr_form_Result_Suggested"),
          value: result.suggested,
          footnote: t("Tool_itr_form_Result_SuggestedFootnote"),
          variant: "primary" as const,
        },
        {
          label: t("Tool_itr_form_Result_Reasons"),
          value: String(result.reasons.length),
          footnote: t(`Tool_itr_form_Reason_${result.reasons[0] ?? "default_itr2"}`),
        },
        {
          label: t("Tool_itr_form_Result_Note"),
          value: t("Tool_itr_form_Result_NoteValue"),
          footnote: t("Tool_itr_form_Result_NoteFootnote"),
        },
      ],
      scenarios: [
        {
          name: t("Tool_itr_form_Scenario_WithCg"),
          primaryLabel: t("Tool_itr_form_Result_Suggested"),
          primaryValue: withCg.suggested,
          secondaryLabel: t("Tool_itr_form_Result_Reasons"),
          secondaryValue: String(withCg.reasons.length),
          variant: "worst" as const,
        },
        {
          name: t("Common_Scenario_Base"),
          primaryLabel: t("Tool_itr_form_Result_Suggested"),
          primaryValue: result.suggested,
          secondaryLabel: t("Tool_itr_form_Result_Reasons"),
          secondaryValue: String(result.reasons.length),
          variant: "base" as const,
        },
        {
          name: t("Tool_itr_form_Scenario_WithBiz"),
          primaryLabel: t("Tool_itr_form_Result_Suggested"),
          primaryValue: withBiz.suggested,
          secondaryLabel: t("Tool_itr_form_Result_Reasons"),
          secondaryValue: String(withBiz.reasons.length),
          variant: "best" as const,
        },
      ],
    };
  }, [sources, t]);

  const checks: { key: keyof ItrFormSources; labelKey: string }[] = [
    { key: "salaryOrPension", labelKey: "Tool_itr_form_Check_Salary" },
    { key: "oneHouseProperty", labelKey: "Tool_itr_form_Check_OneHp" },
    { key: "moreThanOneHouse", labelKey: "Tool_itr_form_Check_MultiHp" },
    { key: "otherSourcesInterest", labelKey: "Tool_itr_form_Check_Other" },
    { key: "capitalGains", labelKey: "Tool_itr_form_Check_Cg" },
    { key: "businessProfession", labelKey: "Tool_itr_form_Check_Business" },
    { key: "presumptiveBusiness", labelKey: "Tool_itr_form_Check_Presumptive" },
    { key: "foreignIncomeOrAssets", labelKey: "Tool_itr_form_Check_Foreign" },
    { key: "directorOrUnlistedEquity", labelKey: "Tool_itr_form_Check_Director" },
    { key: "incomeAbove50L", labelKey: "Tool_itr_form_Check_Above50L" },
  ];

  return (
    <ToolPageShell
      title={t(tool.titleKey)}
      subtitle={t("Tool_itr_form_Subtitle")}
      description={t(tool.descriptionKey)}
      icon={tool.icon}
      educate={
        <>
          <div className="fy-info-box">
            <strong>{t("Common_WhatYouLearn")}</strong>
            <p>{t("Tool_itr_form_LearnText")}</p>
          </div>
          <FormulaCard
            title={t("Common_Formula")}
            code={"Biz → ITR-3 / 4\nCG / multi-HP / foreign → ITR-2\nSalary + simple → ITR-1"}
            note={t("Tool_itr_form_FormulaNote")}
          />
        </>
      }
      below={<ToolInfoPanel info={itrFormInfo(t)} />}
    >
      <div className="fy-form-card">
        <h3>{t("Common_YourInputs")}</h3>
        <p className="fy-field-hint">{t("Tool_itr_form_ChecklistHint")}</p>
        {checks.map(({ key, labelKey }) => (
          <div className="fy-field" key={key}>
            <label>
              <input type="checkbox" checked={sources[key]} onChange={() => toggle(key)} />{" "}
              {t(labelKey)}
            </label>
          </div>
        ))}
        <button type="button" className="fy-btn-calc">
          {t("Common_Calculate")}
        </button>
      </div>

      <ResultSummaryCards cards={summaryCards} />
      <div className="fy-info-box">
        <strong>{result.suggested}</strong>
        <p>
          {result.reasons.map((r) => t(`Tool_itr_form_Reason_${r}`)).join(" · ")}
        </p>
      </div>
      <ScenarioCompare
        title={t("Tool_itr_form_ScenarioTitle")}
        subtitle={t("Tool_itr_form_ScenarioSubtitle")}
        scenarios={scenarios}
      />
      <WorkedExample
        title={t("Tool_itr_form_ExampleTitle")}
        subtitle={t("Tool_itr_form_ExampleSubtitle")}
        steps={exampleSteps}
      />
    </ToolPageShell>
  );
}
