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
import { calculateCreditScoreSimulator } from "@/lib/finance/creditScoreSimulator";
import { getTool } from "@/lib/config/tools";
import { creditScoreSimulatorInfo } from "@/lib/tool-page-content";

export function CreditScoreSimulatorCalculator() {
  const t = useT();
  const tool = getTool("credit-score-simulator")!;

  const [baseScore, setBaseScore] = useState(700);
  const [paymentHabit, setPaymentHabit] = useState<-1 | 0 | 1>(1);
  const [utilisationPercent, setUtilisationPercent] = useState(35);
  const [newEnquiries, setNewEnquiries] = useState(1);
  const [creditAgeYears, setCreditAgeYears] = useState(5);

  const exampleSteps = useMemo(
    () => [
      t("Tool_credit_score_simulator_ExampleStep_1"),
      t("Tool_credit_score_simulator_ExampleStep_2"),
      t("Tool_credit_score_simulator_ExampleStep_3"),
      t("Tool_credit_score_simulator_ExampleStep_4"),
      t("Tool_credit_score_simulator_ExampleStep_5"),
    ],
    [t],
  );

  const bandLabel = (band: string) => {
    if (band === "excellent") return t("Tool_credit_score_simulator_Band_Excellent");
    if (band === "good") return t("Tool_credit_score_simulator_Band_Good");
    if (band === "fair") return t("Tool_credit_score_simulator_Band_Fair");
    return t("Tool_credit_score_simulator_Band_Poor");
  };

  const { summaryCards, scenarios } = useMemo(() => {
    const input = {
      baseScore,
      paymentHabit,
      utilisationPercent,
      newEnquiries,
      creditAgeYears,
    };
    const result = calculateCreditScoreSimulator(input);
    const weak = calculateCreditScoreSimulator({
      ...input,
      paymentHabit: -1,
      utilisationPercent: 80,
      newEnquiries: 4,
    });
    const strong = calculateCreditScoreSimulator({
      ...input,
      paymentHabit: 1,
      utilisationPercent: 20,
      newEnquiries: 0,
      creditAgeYears: Math.max(creditAgeYears, 8),
    });

    return {
      summaryCards: [
        {
          label: t("Tool_credit_score_simulator_Result_Score"),
          value: String(result.simulatedScore),
          footnote: bandLabel(result.band),
          variant: "primary" as const,
        },
        {
          label: t("Tool_credit_score_simulator_Result_Delta"),
          value: `${result.totalDelta >= 0 ? "+" : ""}${result.totalDelta}`,
          footnote: t("Tool_credit_score_simulator_Result_DeltaFootnote"),
          variant: result.totalDelta >= 0 ? ("secure" as const) : ("volatile" as const),
        },
        {
          label: t("Tool_credit_score_simulator_Result_Base"),
          value: String(result.baseScore),
          footnote: t("Tool_credit_score_simulator_Result_BaseFootnote"),
        },
      ],
      scenarios: [
        {
          name: t("Tool_credit_score_simulator_Scenario_Weak"),
          primaryLabel: t("Tool_credit_score_simulator_Result_Score"),
          primaryValue: String(weak.simulatedScore),
          secondaryLabel: t("Tool_credit_score_simulator_Result_Delta"),
          secondaryValue: `${weak.totalDelta >= 0 ? "+" : ""}${weak.totalDelta}`,
          variant: "worst" as const,
        },
        {
          name: t("Common_Scenario_Base"),
          primaryLabel: t("Tool_credit_score_simulator_Result_Score"),
          primaryValue: String(result.simulatedScore),
          secondaryLabel: t("Tool_credit_score_simulator_Result_Delta"),
          secondaryValue: `${result.totalDelta >= 0 ? "+" : ""}${result.totalDelta}`,
          variant: "base" as const,
        },
        {
          name: t("Tool_credit_score_simulator_Scenario_Strong"),
          primaryLabel: t("Tool_credit_score_simulator_Result_Score"),
          primaryValue: String(strong.simulatedScore),
          secondaryLabel: t("Tool_credit_score_simulator_Result_Delta"),
          secondaryValue: `${strong.totalDelta >= 0 ? "+" : ""}${strong.totalDelta}`,
          variant: "best" as const,
        },
      ],
    };
  }, [baseScore, paymentHabit, utilisationPercent, newEnquiries, creditAgeYears, t]);

  return (
    <ToolPageShell
      title={t(tool.titleKey)}
      subtitle={t("Tool_credit_score_simulator_Subtitle")}
      description={t(tool.descriptionKey)}
      icon={tool.icon}
      educate={
        <>
          <div className="fy-info-box">
            <strong>{t("Common_WhatYouLearn")}</strong>
            <p>{t("Tool_credit_score_simulator_LearnText")}</p>
          </div>
          <FormulaCard
            title={t("Common_Formula")}
            code={"Score ≈ base + payment + util + enquiry + age\nEducational deltas only — not CIBIL/Experian"}
            note={t("Tool_credit_score_simulator_FormulaNote")}
          />
        </>
      }
      below={<ToolInfoPanel info={creditScoreSimulatorInfo(t)} />}
    >
      <div className="fy-form-card">
        <h3>{t("Common_YourInputs")}</h3>
        <div className="fy-field">
          <label>{t("Tool_credit_score_simulator_LabelBase")}</label>
          <input
            type="number"
            min={300}
            max={900}
            step={10}
            inputMode="decimal"
            value={baseScore}
            onChange={(e) => setBaseScore(Math.max(300, Number(e.target.value) || 300))}
          />
        </div>
        <div className="fy-field">
          <label>{t("Tool_credit_score_simulator_LabelPayment")}</label>
          <select
            value={String(paymentHabit)}
            onChange={(e) => setPaymentHabit(Number(e.target.value) as -1 | 0 | 1)}
          >
            <option value="1">{t("Tool_credit_score_simulator_Payment_Good")}</option>
            <option value="0">{t("Tool_credit_score_simulator_Payment_Mixed")}</option>
            <option value="-1">{t("Tool_credit_score_simulator_Payment_Late")}</option>
          </select>
        </div>
        <div className="fy-field">
          <label>{t("Tool_credit_score_simulator_LabelUtil")}</label>
          <input
            type="number"
            min={0}
            max={100}
            step={5}
            inputMode="decimal"
            value={utilisationPercent}
            onChange={(e) => setUtilisationPercent(Math.max(0, Number(e.target.value) || 0))}
          />
        </div>
        <div className="fy-field">
          <label>{t("Tool_credit_score_simulator_LabelEnquiries")}</label>
          <input
            type="number"
            min={0}
            max={20}
            step={1}
            inputMode="decimal"
            value={newEnquiries}
            onChange={(e) => setNewEnquiries(Math.max(0, Number(e.target.value) || 0))}
          />
        </div>
        <div className="fy-field">
          <label>{t("Tool_credit_score_simulator_LabelAge")}</label>
          <input
            type="number"
            min={0}
            max={40}
            step={1}
            inputMode="decimal"
            value={creditAgeYears}
            onChange={(e) => setCreditAgeYears(Math.max(0, Number(e.target.value) || 0))}
          />
        </div>
        <button type="button" className="fy-btn-calc">
          {t("Common_Calculate")}
        </button>
      </div>

      <ResultSummaryCards cards={summaryCards} />
      <ScenarioCompare
        title={t("Tool_credit_score_simulator_ScenarioTitle")}
        subtitle={t("Tool_credit_score_simulator_ScenarioSubtitle")}
        scenarios={scenarios}
      />
      <WorkedExample
        title={t("Tool_credit_score_simulator_ExampleTitle")}
        subtitle={t("Tool_credit_score_simulator_ExampleSubtitle")}
        steps={exampleSteps}
      />
    </ToolPageShell>
  );
}
