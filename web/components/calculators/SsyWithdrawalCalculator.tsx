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
  calculateSsyWithdrawal,
  type SsyWithdrawalPurpose,
} from "@/lib/finance/ssyWithdrawal";
import { inr, percent } from "@/lib/finance/format";
import { getTool } from "@/lib/config/tools";
import { ssyWithdrawalInfo } from "@/lib/tool-page-content";

export function SsyWithdrawalCalculator() {
  const t = useT();
  const tool = getTool("ssy-withdrawal")!;

  const [balance, setBalance] = useState(500_000);
  const [girlAge, setGirlAge] = useState(18);
  const [accountYear, setAccountYear] = useState(10);
  const [purpose, setPurpose] = useState<SsyWithdrawalPurpose>("education");

  const exampleSteps = useMemo(
    () => [
      t("Tool_ssy_withdrawal_ExampleStep_1"),
      t("Tool_ssy_withdrawal_ExampleStep_2"),
      t("Tool_ssy_withdrawal_ExampleStep_3"),
      t("Tool_ssy_withdrawal_ExampleStep_4"),
      t("Tool_ssy_withdrawal_ExampleStep_5"),
    ],
    [t],
  );

  const noteMap = {
    too_early_year: "Tool_ssy_withdrawal_Note_TooEarlyYear",
    too_young: "Tool_ssy_withdrawal_Note_TooYoung",
    partial_ok: "Tool_ssy_withdrawal_Note_PartialOk",
    premature_ok: "Tool_ssy_withdrawal_Note_PrematureOk",
    mature: "Tool_ssy_withdrawal_Note_Mature",
  } as const;

  const { summaryCards, scenarios, note } = useMemo(() => {
    const result = calculateSsyWithdrawal({ balance, girlAge, accountYear, purpose });
    const asEdu = calculateSsyWithdrawal({
      balance,
      girlAge,
      accountYear,
      purpose: "education",
    });
    const asPremature = calculateSsyWithdrawal({
      balance,
      girlAge,
      accountYear,
      purpose: "premature",
    });
    const later = calculateSsyWithdrawal({
      balance,
      girlAge: Math.min(21, girlAge + 2),
      accountYear: accountYear + 2,
      purpose: "education",
    });

    return {
      note: t(noteMap[result.noteKey]),
      summaryCards: [
        {
          label: t("Tool_ssy_withdrawal_Result_Max"),
          value: inr(result.maxAmount),
          footnote: result.eligible
            ? t("Tool_ssy_withdrawal_Result_MaxFootnote", percent(result.fraction * 100))
            : t("Tool_ssy_withdrawal_Result_NotEligible"),
          variant: "primary" as const,
        },
        {
          label: t("Tool_ssy_withdrawal_Result_Balance"),
          value: inr(result.balance),
          footnote: t("Tool_ssy_withdrawal_Result_BalanceFootnote", girlAge, accountYear),
        },
        {
          label: t("Tool_ssy_withdrawal_Result_Status"),
          value: result.eligible
            ? t("Tool_ssy_withdrawal_Status_Eligible")
            : t("Tool_ssy_withdrawal_Status_NotEligible"),
          footnote: t(noteMap[result.noteKey]),
          variant: result.eligible ? ("secure" as const) : ("volatile" as const),
        },
      ],
      scenarios: [
        {
          name: t("Tool_ssy_withdrawal_Scenario_Education"),
          primaryLabel: t("Tool_ssy_withdrawal_Result_Max"),
          primaryValue: inr(asEdu.maxAmount),
          secondaryLabel: t("Tool_ssy_withdrawal_Result_Status"),
          secondaryValue: asEdu.eligible
            ? t("Tool_ssy_withdrawal_Status_Eligible")
            : t("Tool_ssy_withdrawal_Status_NotEligible"),
          variant: "base",
        },
        {
          name: t("Tool_ssy_withdrawal_Scenario_Premature"),
          primaryLabel: t("Tool_ssy_withdrawal_Result_Max"),
          primaryValue: inr(asPremature.maxAmount),
          secondaryLabel: t("Tool_ssy_withdrawal_LabelYear"),
          secondaryValue: String(accountYear),
          variant: "worst",
        },
        {
          name: t("Tool_ssy_withdrawal_Scenario_Later"),
          primaryLabel: t("Tool_ssy_withdrawal_Result_Max"),
          primaryValue: inr(later.maxAmount),
          secondaryLabel: t("Tool_ssy_withdrawal_LabelAge"),
          secondaryValue: String(Math.min(21, girlAge + 2)),
          variant: "best",
        },
      ],
    };
  }, [balance, girlAge, accountYear, purpose, t]);

  return (
    <ToolPageShell
      title={t(tool.titleKey)}
      subtitle={t("Tool_ssy_withdrawal_Subtitle")}
      description={t(tool.descriptionKey)}
      icon={tool.icon}
      educate={
        <>
          <div className="fy-info-box">
            <strong>{t("Common_WhatYouLearn")}</strong>
            <p>{t("Tool_ssy_withdrawal_LearnText")}</p>
          </div>
          <FormulaCard
            title={t("Common_Formula")}
            code={"Age ≥ 18 + year ≥ 2: ≈ 50% (edu/marriage)\nPremature (year ≥ 2): full (rate cut not modelled)\nAge ≥ 21: full maturity"}
            note={t("Tool_ssy_withdrawal_FormulaNote")}
          />
        </>
      }
      below={<ToolInfoPanel info={ssyWithdrawalInfo(t)} />}
    >
      <div className="fy-form-card">
        <h3>{t("Common_YourInputs")}</h3>
        <div className="fy-field">
          <label>{t("Tool_ssy_withdrawal_LabelBalance")}</label>
          <input
            type="number"
            min={0}
            step={1000}
            inputMode="decimal"
            value={balance}
            onChange={(e) => setBalance(Math.max(0, Number(e.target.value) || 0))}
          />
        </div>
        <div className="fy-field">
          <label>{t("Tool_ssy_withdrawal_LabelAge")}</label>
          <input
            type="number"
            min={0}
            max={30}
            step={1}
            inputMode="numeric"
            value={girlAge}
            onChange={(e) => setGirlAge(Math.max(0, Number(e.target.value) || 0))}
          />
        </div>
        <div className="fy-field">
          <label>{t("Tool_ssy_withdrawal_LabelYear")}</label>
          <input
            type="number"
            min={1}
            max={21}
            step={1}
            inputMode="numeric"
            value={accountYear}
            onChange={(e) => setAccountYear(Math.max(1, Number(e.target.value) || 1))}
          />
          <p className="fy-field-hint">{t("Tool_ssy_withdrawal_YearHint")}</p>
        </div>
        <div className="fy-field">
          <label>{t("Tool_ssy_withdrawal_LabelPurpose")}</label>
          <select
            value={purpose}
            onChange={(e) => setPurpose(e.target.value as SsyWithdrawalPurpose)}
          >
            <option value="education">{t("Tool_ssy_withdrawal_Purpose_Education")}</option>
            <option value="marriage">{t("Tool_ssy_withdrawal_Purpose_Marriage")}</option>
            <option value="premature">{t("Tool_ssy_withdrawal_Purpose_Premature")}</option>
          </select>
        </div>
        <button type="button" className="fy-btn-calc">
          {t("Common_Calculate")}
        </button>
      </div>

      <div className="fy-info-box">
        <p>{note}</p>
      </div>

      <ResultSummaryCards cards={summaryCards} />
      <ScenarioCompare
        title={t("Tool_ssy_withdrawal_ScenarioTitle")}
        subtitle={t("Tool_ssy_withdrawal_ScenarioSubtitle")}
        scenarios={scenarios}
      />
      <WorkedExample
        title={t("Tool_ssy_withdrawal_ExampleTitle")}
        subtitle={t("Tool_ssy_withdrawal_ExampleSubtitle")}
        steps={exampleSteps}
      />
    </ToolPageShell>
  );
}
