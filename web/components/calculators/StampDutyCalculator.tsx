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
  calculateStampDuty,
  STAMP_DUTY_STATES,
  type StampDutyStateId,
} from "@/lib/finance/stampDuty";
import { inr, percent } from "@/lib/finance/format";
import { getTool } from "@/lib/config/tools";
import { stampDutyInfo } from "@/lib/tool-page-content";

export function StampDutyCalculator() {
  const t = useT();
  const tool = getTool("stamp-duty")!;

  const [propertyValue, setPropertyValue] = useState(5_000_000);
  const [stateId, setStateId] = useState<StampDutyStateId>("mh");
  const [womenBuyer, setWomenBuyer] = useState(false);

  const exampleSteps = useMemo(
    () => [
      t("Tool_stamp_duty_ExampleStep_1"),
      t("Tool_stamp_duty_ExampleStep_2"),
      t("Tool_stamp_duty_ExampleStep_3"),
      t("Tool_stamp_duty_ExampleStep_4"),
      t("Tool_stamp_duty_ExampleStep_5"),
    ],
    [t],
  );

  const { summaryCards, scenarios, detail } = useMemo(() => {
    const result = calculateStampDuty({
      propertyValue: Math.max(0, propertyValue),
      stateId,
      womenBuyer,
    });
    const withWomen = calculateStampDuty({ propertyValue, stateId, womenBuyer: true });
    const withoutWomen = calculateStampDuty({ propertyValue, stateId, womenBuyer: false });
    const higherValue = calculateStampDuty({
      propertyValue: propertyValue * 1.2,
      stateId,
      womenBuyer,
    });

    return {
      detail: result,
      summaryCards: [
        {
          label: t("Tool_stamp_duty_Result_Stamp"),
          value: inr(result.stampDuty),
          footnote: t("Tool_stamp_duty_Result_StampFootnote", percent(result.stampPercentApplied)),
          variant: "primary" as const,
        },
        {
          label: t("Tool_stamp_duty_Result_Registration"),
          value: inr(result.registration),
          footnote: t("Tool_stamp_duty_Result_RegistrationFootnote", percent(result.registrationPercent)),
        },
        {
          label: t("Tool_stamp_duty_Result_Total"),
          value: inr(result.totalCharges),
          footnote: t("Tool_stamp_duty_Result_TotalFootnote"),
          variant: "secure" as const,
        },
      ],
      scenarios: [
        {
          name: t("Tool_stamp_duty_Scenario_Women"),
          primaryLabel: t("Tool_stamp_duty_Result_Total"),
          primaryValue: inr(withWomen.totalCharges),
          secondaryLabel: t("Tool_stamp_duty_Result_Stamp"),
          secondaryValue: inr(withWomen.stampDuty),
          variant: "best",
        },
        {
          name: t("Tool_stamp_duty_Scenario_General"),
          primaryLabel: t("Tool_stamp_duty_Result_Total"),
          primaryValue: inr(withoutWomen.totalCharges),
          secondaryLabel: t("Tool_stamp_duty_Result_Stamp"),
          secondaryValue: inr(withoutWomen.stampDuty),
          variant: "base",
        },
        {
          name: t("Tool_stamp_duty_Scenario_Higher"),
          primaryLabel: t("Tool_stamp_duty_Result_Total"),
          primaryValue: inr(higherValue.totalCharges),
          secondaryLabel: t("Tool_stamp_duty_LabelValue"),
          secondaryValue: inr(propertyValue * 1.2),
          variant: "worst",
        },
      ],
    };
  }, [propertyValue, stateId, womenBuyer, t]);

  return (
    <ToolPageShell
      title={t(tool.titleKey)}
      subtitle={t("Tool_stamp_duty_Subtitle")}
      description={t(tool.descriptionKey)}
      icon={tool.icon}
      educate={
        <>
          <div className="fy-info-box">
            <strong>{t("Common_WhatYouLearn")}</strong>
            <p>{t("Tool_stamp_duty_LearnText")}</p>
          </div>
          <FormulaCard
            title={t("Common_Formula")}
            code={"Stamp = Value × stamp%\nRegistration = Value × reg%\nTotal = Stamp + Registration"}
            note={t("Tool_stamp_duty_FormulaNote")}
          />
        </>
      }
      below={<ToolInfoPanel info={stampDutyInfo(t)} />}
    >
      <div className="fy-form-card">
        <h3>{t("Common_YourInputs")}</h3>
        <div className="fy-field">
          <label>{t("Tool_stamp_duty_LabelValue")}</label>
          <input
            type="number"
            min={0}
            step={50000}
            inputMode="decimal"
            value={propertyValue}
            onChange={(e) => setPropertyValue(Math.max(0, Number(e.target.value) || 0))}
          />
        </div>
        <div className="fy-field">
          <label>{t("Tool_stamp_duty_LabelState")}</label>
          <select value={stateId} onChange={(e) => setStateId(e.target.value as StampDutyStateId)}>
            {STAMP_DUTY_STATES.map((s) => (
              <option key={s.id} value={s.id}>
                {t(`Tool_stamp_duty_State_${s.id}`)}
              </option>
            ))}
          </select>
          <p className="fy-field-hint">{t("Tool_stamp_duty_StateHint")}</p>
        </div>
        <div className="fy-field">
          <label>
            <input type="checkbox" checked={womenBuyer} onChange={(e) => setWomenBuyer(e.target.checked)} />{" "}
            {t("Tool_stamp_duty_LabelWomen")}
          </label>
          <p className="fy-field-hint">{t("Tool_stamp_duty_WomenHint")}</p>
        </div>
        <button type="button" className="fy-btn-calc">
          {t("Common_Calculate")}
        </button>
      </div>

      {detail.concessionAmount > 0 && (
        <div className="fy-info-box fy-tax-verdict">
          <strong>{t("Tool_stamp_duty_ConcessionTitle")}</strong>
          <p>{t("Tool_stamp_duty_ConcessionBody", inr(detail.concessionAmount))}</p>
        </div>
      )}

      <ResultSummaryCards cards={summaryCards} />
      <ScenarioCompare
        title={t("Tool_stamp_duty_ScenarioTitle")}
        subtitle={t("Tool_stamp_duty_ScenarioSubtitle")}
        scenarios={scenarios}
      />
      <WorkedExample
        title={t("Tool_stamp_duty_ExampleTitle")}
        subtitle={t("Tool_stamp_duty_ExampleSubtitle")}
        steps={exampleSteps}
      />
    </ToolPageShell>
  );
}
