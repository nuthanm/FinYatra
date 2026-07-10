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
  annualToMonthly,
  effectiveToNominal,
  monthlyToAnnual,
  monthlyToEffectiveAnnual,
  nominalToEffective,
} from "@/lib/finance/interestRateConverter";
import { percent } from "@/lib/finance/format";
import { getTool } from "@/lib/config/tools";
import { interestRateConverterInfo } from "@/lib/tool-page-content";

type Mode = "nominal_to_effective" | "effective_to_nominal" | "monthly_annual";

export function InterestRateConverterCalculator() {
  const t = useT();
  const tool = getTool("interest-rate-converter")!;

  const [mode, setMode] = useState<Mode>("nominal_to_effective");
  const [nominal, setNominal] = useState(12);
  const [effective, setEffective] = useState(12.68);
  const [monthly, setMonthly] = useState(1);
  const [compounds, setCompounds] = useState(12);

  const exampleSteps = useMemo(
    () => [
      t("Tool_interest_rate_converter_ExampleStep_1"),
      t("Tool_interest_rate_converter_ExampleStep_2"),
      t("Tool_interest_rate_converter_ExampleStep_3"),
      t("Tool_interest_rate_converter_ExampleStep_4"),
      t("Tool_interest_rate_converter_ExampleStep_5"),
    ],
    [t],
  );

  const { summaryCards, scenarios } = useMemo(() => {
    if (mode === "effective_to_nominal") {
      const result = effectiveToNominal(effective, compounds);
      const q = effectiveToNominal(effective, 4);
      const a = effectiveToNominal(effective, 1);
      return {
        summaryCards: [
          {
            label: t("Tool_interest_rate_converter_Result_Nominal"),
            value: percent(result.nominalAnnualPercent),
            footnote: t("Tool_interest_rate_converter_Result_NominalFootnote", compounds),
            variant: "primary" as const,
          },
          {
            label: t("Tool_interest_rate_converter_Result_Effective"),
            value: percent(result.effectiveAnnualPercent),
            footnote: t("Tool_interest_rate_converter_Result_EffectiveFootnote"),
            variant: "secure" as const,
          },
          {
            label: t("Tool_interest_rate_converter_Result_Monthly"),
            value: percent(result.monthlyPercent, 3),
            footnote: t("Tool_interest_rate_converter_Result_MonthlyFootnote"),
          },
        ],
        scenarios: [
          {
            name: t("Tool_interest_rate_converter_Scenario_Annual"),
            primaryLabel: t("Tool_interest_rate_converter_Result_Nominal"),
            primaryValue: percent(a.nominalAnnualPercent),
            secondaryLabel: t("Tool_interest_rate_converter_LabelCompounds"),
            secondaryValue: "1",
            variant: "worst",
          },
          {
            name: t("Common_Scenario_Base"),
            primaryLabel: t("Tool_interest_rate_converter_Result_Nominal"),
            primaryValue: percent(result.nominalAnnualPercent),
            secondaryLabel: t("Tool_interest_rate_converter_LabelCompounds"),
            secondaryValue: String(compounds),
            variant: "base",
          },
          {
            name: t("Tool_interest_rate_converter_Scenario_Quarterly"),
            primaryLabel: t("Tool_interest_rate_converter_Result_Nominal"),
            primaryValue: percent(q.nominalAnnualPercent),
            secondaryLabel: t("Tool_interest_rate_converter_LabelCompounds"),
            secondaryValue: "4",
            variant: "best",
          },
        ],
      };
    }

    if (mode === "monthly_annual") {
      const annual = monthlyToAnnual(monthly);
      const fromAnnual = annualToMonthly(annual);
      const ear = monthlyToEffectiveAnnual(monthly);
      return {
        summaryCards: [
          {
            label: t("Tool_interest_rate_converter_Result_AnnualFromMonthly"),
            value: percent(annual),
            footnote: t("Tool_interest_rate_converter_Result_AnnualFromMonthlyFootnote"),
            variant: "primary" as const,
          },
          {
            label: t("Tool_interest_rate_converter_Result_Monthly"),
            value: percent(fromAnnual, 3),
            footnote: t("Tool_interest_rate_converter_Result_MonthlySimple"),
            variant: "secure" as const,
          },
          {
            label: t("Tool_interest_rate_converter_Result_Effective"),
            value: percent(ear),
            footnote: t("Tool_interest_rate_converter_Result_EarFromMonthly"),
          },
        ],
        scenarios: [
          {
            name: t("Tool_interest_rate_converter_Scenario_HalfMonth"),
            primaryLabel: t("Tool_interest_rate_converter_Result_AnnualFromMonthly"),
            primaryValue: percent(monthlyToAnnual(monthly / 2)),
            secondaryLabel: t("Tool_interest_rate_converter_LabelMonthly"),
            secondaryValue: percent(monthly / 2, 3),
            variant: "worst",
          },
          {
            name: t("Common_Scenario_Base"),
            primaryLabel: t("Tool_interest_rate_converter_Result_AnnualFromMonthly"),
            primaryValue: percent(annual),
            secondaryLabel: t("Tool_interest_rate_converter_Result_Effective"),
            secondaryValue: percent(ear),
            variant: "base",
          },
          {
            name: t("Tool_interest_rate_converter_Scenario_DoubleMonth"),
            primaryLabel: t("Tool_interest_rate_converter_Result_AnnualFromMonthly"),
            primaryValue: percent(monthlyToAnnual(monthly * 2)),
            secondaryLabel: t("Tool_interest_rate_converter_LabelMonthly"),
            secondaryValue: percent(monthly * 2, 3),
            variant: "best",
          },
        ],
      };
    }

    const result = nominalToEffective(nominal, compounds);
    const q = nominalToEffective(nominal, 4);
    const a = nominalToEffective(nominal, 1);
    return {
      summaryCards: [
        {
          label: t("Tool_interest_rate_converter_Result_Effective"),
          value: percent(result.effectiveAnnualPercent),
          footnote: t("Tool_interest_rate_converter_Result_EffectiveFromNom", compounds),
          variant: "primary" as const,
        },
        {
          label: t("Tool_interest_rate_converter_Result_Nominal"),
          value: percent(result.nominalAnnualPercent),
          footnote: t("Tool_interest_rate_converter_Result_NominalInput"),
          variant: "secure" as const,
        },
        {
          label: t("Tool_interest_rate_converter_Result_Monthly"),
          value: percent(result.monthlyPercent, 3),
          footnote: t("Tool_interest_rate_converter_Result_MonthlyFootnote"),
        },
      ],
      scenarios: [
        {
          name: t("Tool_interest_rate_converter_Scenario_Annual"),
          primaryLabel: t("Tool_interest_rate_converter_Result_Effective"),
          primaryValue: percent(a.effectiveAnnualPercent),
          secondaryLabel: t("Tool_interest_rate_converter_LabelCompounds"),
          secondaryValue: "1",
          variant: "worst",
        },
        {
          name: t("Common_Scenario_Base"),
          primaryLabel: t("Tool_interest_rate_converter_Result_Effective"),
          primaryValue: percent(result.effectiveAnnualPercent),
          secondaryLabel: t("Tool_interest_rate_converter_LabelCompounds"),
          secondaryValue: String(compounds),
          variant: "base",
        },
        {
          name: t("Tool_interest_rate_converter_Scenario_Quarterly"),
          primaryLabel: t("Tool_interest_rate_converter_Result_Effective"),
          primaryValue: percent(q.effectiveAnnualPercent),
          secondaryLabel: t("Tool_interest_rate_converter_LabelCompounds"),
          secondaryValue: "4",
          variant: "best",
        },
      ],
    };
  }, [mode, nominal, effective, monthly, compounds, t]);

  return (
    <ToolPageShell
      title={t(tool.titleKey)}
      subtitle={t("Tool_interest_rate_converter_Subtitle")}
      description={t(tool.descriptionKey)}
      icon={tool.icon}
      educate={
        <>
          <div className="fy-info-box">
            <strong>{t("Common_WhatYouLearn")}</strong>
            <p>{t("Tool_interest_rate_converter_LearnText")}</p>
          </div>
          <FormulaCard
            title={t("Common_Formula")}
            code={"EAR = (1 + r/n)^n − 1\nMonthly = annual / 12"}
            note={t("Tool_interest_rate_converter_FormulaNote")}
          />
        </>
      }
      below={<ToolInfoPanel info={interestRateConverterInfo(t)} />}
    >
      <div className="fy-form-card">
        <h3>{t("Common_YourInputs")}</h3>
        <div className="fy-field">
          <label>{t("Tool_interest_rate_converter_LabelMode")}</label>
          <select value={mode} onChange={(e) => setMode(e.target.value as Mode)}>
            <option value="nominal_to_effective">
              {t("Tool_interest_rate_converter_Mode_NomToEff")}
            </option>
            <option value="effective_to_nominal">
              {t("Tool_interest_rate_converter_Mode_EffToNom")}
            </option>
            <option value="monthly_annual">
              {t("Tool_interest_rate_converter_Mode_MonthlyAnnual")}
            </option>
          </select>
        </div>
        {mode === "nominal_to_effective" && (
          <div className="fy-field">
            <label>{t("Tool_interest_rate_converter_LabelNominal")}</label>
            <input
              type="number"
              min={0}
              step={0.1}
              inputMode="decimal"
              value={nominal}
              onChange={(e) => setNominal(Math.max(0, Number(e.target.value) || 0))}
            />
          </div>
        )}
        {mode === "effective_to_nominal" && (
          <div className="fy-field">
            <label>{t("Tool_interest_rate_converter_LabelEffective")}</label>
            <input
              type="number"
              min={0}
              step={0.1}
              inputMode="decimal"
              value={effective}
              onChange={(e) => setEffective(Math.max(0, Number(e.target.value) || 0))}
            />
          </div>
        )}
        {mode === "monthly_annual" && (
          <div className="fy-field">
            <label>{t("Tool_interest_rate_converter_LabelMonthly")}</label>
            <input
              type="number"
              min={0}
              step={0.01}
              inputMode="decimal"
              value={monthly}
              onChange={(e) => setMonthly(Math.max(0, Number(e.target.value) || 0))}
            />
          </div>
        )}
        {mode !== "monthly_annual" && (
          <div className="fy-field">
            <label>{t("Tool_interest_rate_converter_LabelCompounds")}</label>
            <input
              type="number"
              min={1}
              step={1}
              inputMode="decimal"
              value={compounds}
              onChange={(e) => setCompounds(Math.max(1, Math.floor(Number(e.target.value) || 1)))}
            />
            <p className="fy-field-hint">{t("Tool_interest_rate_converter_CompoundsHint")}</p>
          </div>
        )}
        <button type="button" className="fy-btn-calc">
          {t("Common_Calculate")}
        </button>
      </div>

      <ResultSummaryCards cards={summaryCards} />
      <ScenarioCompare
        title={t("Tool_interest_rate_converter_ScenarioTitle")}
        subtitle={t("Tool_interest_rate_converter_ScenarioSubtitle")}
        scenarios={scenarios}
      />
      <WorkedExample
        title={t("Tool_interest_rate_converter_ExampleTitle")}
        subtitle={t("Tool_interest_rate_converter_ExampleSubtitle")}
        steps={exampleSteps}
      />
    </ToolPageShell>
  );
}
