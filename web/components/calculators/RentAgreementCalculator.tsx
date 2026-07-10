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
  calculateRentAgreement,
  RENT_AGREEMENT_STATES,
  type RentAgreementStateId,
} from "@/lib/finance/rentAgreement";
import { inr, percent } from "@/lib/finance/format";
import { getTool } from "@/lib/config/tools";
import { rentAgreementInfo } from "@/lib/tool-page-content";

export function RentAgreementCalculator() {
  const t = useT();
  const tool = getTool("rent-agreement")!;

  const [monthlyRent, setMonthlyRent] = useState(25_000);
  const [months, setMonths] = useState(11);
  const [stateId, setStateId] = useState<RentAgreementStateId>("mh");
  const [depositMonths, setDepositMonths] = useState(2);

  const exampleSteps = useMemo(
    () => [
      t("Tool_rent_agreement_ExampleStep_1"),
      t("Tool_rent_agreement_ExampleStep_2"),
      t("Tool_rent_agreement_ExampleStep_3"),
      t("Tool_rent_agreement_ExampleStep_4"),
      t("Tool_rent_agreement_ExampleStep_5"),
    ],
    [t],
  );

  const { summaryCards, scenarios } = useMemo(() => {
    const result = calculateRentAgreement({
      monthlyRent,
      months,
      stateId,
      depositMonths,
    });
    const twelve = calculateRentAgreement({
      monthlyRent,
      months: 12,
      stateId,
      depositMonths,
    });
    const moreDeposit = calculateRentAgreement({
      monthlyRent,
      months,
      stateId,
      depositMonths: depositMonths + 1,
    });

    return {
      summaryCards: [
        {
          label: t("Tool_rent_agreement_Result_Stamp"),
          value: inr(result.stampDuty),
          footnote: t("Tool_rent_agreement_Result_StampFootnote", percent(result.stampPercent)),
          variant: "primary" as const,
        },
        {
          label: t("Tool_rent_agreement_Result_Deposit"),
          value: inr(result.securityDeposit),
          footnote: t("Tool_rent_agreement_Result_DepositFootnote", depositMonths),
        },
        {
          label: t("Tool_rent_agreement_Result_Upfront"),
          value: inr(result.upfrontTotal),
          footnote: t("Tool_rent_agreement_Result_UpfrontFootnote"),
          variant: "secure" as const,
        },
      ],
      scenarios: [
        {
          name: t("Tool_rent_agreement_Scenario_11m"),
          primaryLabel: t("Tool_rent_agreement_Result_Stamp"),
          primaryValue: inr(result.stampDuty),
          secondaryLabel: t("Tool_rent_agreement_LabelMonths"),
          secondaryValue: String(months),
          variant: "base",
        },
        {
          name: t("Tool_rent_agreement_Scenario_12m"),
          primaryLabel: t("Tool_rent_agreement_Result_Stamp"),
          primaryValue: inr(twelve.stampDuty),
          secondaryLabel: t("Tool_rent_agreement_LabelMonths"),
          secondaryValue: "12",
          variant: "worst",
        },
        {
          name: t("Tool_rent_agreement_Scenario_MoreDeposit"),
          primaryLabel: t("Tool_rent_agreement_Result_Upfront"),
          primaryValue: inr(moreDeposit.upfrontTotal),
          secondaryLabel: t("Tool_rent_agreement_Result_Deposit"),
          secondaryValue: inr(moreDeposit.securityDeposit),
          variant: "best",
        },
      ],
    };
  }, [monthlyRent, months, stateId, depositMonths, t]);

  return (
    <ToolPageShell
      title={t(tool.titleKey)}
      subtitle={t("Tool_rent_agreement_Subtitle")}
      description={t(tool.descriptionKey)}
      icon={tool.icon}
      educate={
        <>
          <div className="fy-info-box">
            <strong>{t("Common_WhatYouLearn")}</strong>
            <p>{t("Tool_rent_agreement_LearnText")}</p>
          </div>
          <FormulaCard
            title={t("Common_Formula")}
            code={"Total rent = rent × months\nStamp ≈ total × stamp%\nUpfront ≈ stamp + reg + deposit"}
            note={t("Tool_rent_agreement_FormulaNote")}
          />
        </>
      }
      below={<ToolInfoPanel info={rentAgreementInfo(t)} />}
    >
      <div className="fy-form-card">
        <h3>{t("Common_YourInputs")}</h3>
        <div className="fy-field">
          <label>{t("Tool_rent_agreement_LabelRent")}</label>
          <input
            type="number"
            min={0}
            step={1000}
            inputMode="decimal"
            value={monthlyRent}
            onChange={(e) => setMonthlyRent(Math.max(0, Number(e.target.value) || 0))}
          />
        </div>
        <div className="fy-field">
          <label>{t("Tool_rent_agreement_LabelMonths")}</label>
          <input
            type="number"
            min={1}
            step={1}
            inputMode="numeric"
            value={months}
            onChange={(e) => setMonths(Math.max(1, Number(e.target.value) || 1))}
          />
          <p className="fy-field-hint">{t("Tool_rent_agreement_MonthsHint")}</p>
        </div>
        <div className="fy-field">
          <label>{t("Tool_rent_agreement_LabelState")}</label>
          <select value={stateId} onChange={(e) => setStateId(e.target.value as RentAgreementStateId)}>
            {RENT_AGREEMENT_STATES.map((s) => (
              <option key={s.id} value={s.id}>
                {t(`Tool_rent_agreement_State_${s.id}`)}
              </option>
            ))}
          </select>
        </div>
        <div className="fy-field">
          <label>{t("Tool_rent_agreement_LabelDeposit")}</label>
          <input
            type="number"
            min={0}
            step={0.5}
            inputMode="decimal"
            value={depositMonths}
            onChange={(e) => setDepositMonths(Math.max(0, Number(e.target.value) || 0))}
          />
          <p className="fy-field-hint">{t("Tool_rent_agreement_DepositHint")}</p>
        </div>
        <button type="button" className="fy-btn-calc">
          {t("Common_Calculate")}
        </button>
      </div>

      <ResultSummaryCards cards={summaryCards} />
      <ScenarioCompare
        title={t("Tool_rent_agreement_ScenarioTitle")}
        subtitle={t("Tool_rent_agreement_ScenarioSubtitle")}
        scenarios={scenarios}
      />
      <WorkedExample
        title={t("Tool_rent_agreement_ExampleTitle")}
        subtitle={t("Tool_rent_agreement_ExampleSubtitle")}
        steps={exampleSteps}
      />
    </ToolPageShell>
  );
}
