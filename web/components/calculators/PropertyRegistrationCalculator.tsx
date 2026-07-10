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
  calculatePropertyRegistration,
  type StampDutyStateId,
} from "@/lib/finance/propertyRegistration";
import { STAMP_DUTY_STATES } from "@/lib/finance/stampDuty";
import { inr, percent } from "@/lib/finance/format";
import { getTool } from "@/lib/config/tools";
import { propertyRegistrationInfo } from "@/lib/tool-page-content";

export function PropertyRegistrationCalculator() {
  const t = useT();
  const tool = getTool("property-registration")!;

  const [propertyValue, setPropertyValue] = useState(5_000_000);
  const [mode, setMode] = useState<"state" | "custom">("state");
  const [stateId, setStateId] = useState<StampDutyStateId>("mh");
  const [stampPercent, setStampPercent] = useState(5);
  const [registrationPercent, setRegistrationPercent] = useState(1);
  const [womenBuyer, setWomenBuyer] = useState(false);

  const exampleSteps = useMemo(
    () => [
      t("Tool_property_registration_ExampleStep_1"),
      t("Tool_property_registration_ExampleStep_2"),
      t("Tool_property_registration_ExampleStep_3"),
      t("Tool_property_registration_ExampleStep_4"),
      t("Tool_property_registration_ExampleStep_5"),
    ],
    [t],
  );

  const { summaryCards, scenarios, detail } = useMemo(() => {
    const result =
      mode === "state"
        ? calculatePropertyRegistration({ propertyValue, stateId, womenBuyer })
        : calculatePropertyRegistration({
            propertyValue,
            stampPercent,
            registrationPercent,
          });

    const withWomen =
      mode === "state"
        ? calculatePropertyRegistration({ propertyValue, stateId, womenBuyer: true })
        : result;
    const withoutWomen =
      mode === "state"
        ? calculatePropertyRegistration({ propertyValue, stateId, womenBuyer: false })
        : result;
    const higher = calculatePropertyRegistration(
      mode === "state"
        ? { propertyValue: propertyValue * 1.2, stateId, womenBuyer }
        : {
            propertyValue: propertyValue * 1.2,
            stampPercent,
            registrationPercent,
          },
    );

    return {
      detail: result,
      summaryCards: [
        {
          label: t("Tool_property_registration_Result_Stamp"),
          value: inr(result.stampDuty),
          footnote: t(
            "Tool_property_registration_Result_StampFootnote",
            percent(result.stampPercentApplied),
          ),
          variant: "primary" as const,
        },
        {
          label: t("Tool_property_registration_Result_Reg"),
          value: inr(result.registration),
          footnote: t(
            "Tool_property_registration_Result_RegFootnote",
            percent(result.registrationPercent),
          ),
        },
        {
          label: t("Tool_property_registration_Result_Total"),
          value: inr(result.totalCharges),
          footnote:
            result.concessionAmount > 0
              ? t("Tool_property_registration_Result_Concession", inr(result.concessionAmount))
              : t("Tool_property_registration_Result_TotalFootnote"),
          variant: "secure" as const,
        },
      ],
      scenarios: [
        {
          name: t("Tool_property_registration_Scenario_Women"),
          primaryLabel: t("Tool_property_registration_Result_Total"),
          primaryValue: inr(withWomen.totalCharges),
          secondaryLabel: t("Tool_property_registration_Result_Stamp"),
          secondaryValue: inr(withWomen.stampDuty),
          variant: "best" as const,
        },
        {
          name: t("Tool_property_registration_Scenario_General"),
          primaryLabel: t("Tool_property_registration_Result_Total"),
          primaryValue: inr(withoutWomen.totalCharges),
          secondaryLabel: t("Tool_property_registration_Result_Stamp"),
          secondaryValue: inr(withoutWomen.stampDuty),
          variant: "base" as const,
        },
        {
          name: t("Tool_property_registration_Scenario_Higher"),
          primaryLabel: t("Tool_property_registration_Result_Total"),
          primaryValue: inr(higher.totalCharges),
          secondaryLabel: t("Tool_property_registration_LabelValue"),
          secondaryValue: inr(propertyValue * 1.2),
          variant: "worst" as const,
        },
      ],
    };
  }, [propertyValue, mode, stateId, stampPercent, registrationPercent, womenBuyer, t]);

  return (
    <ToolPageShell
      title={t(tool.titleKey)}
      subtitle={t("Tool_property_registration_Subtitle")}
      description={t(tool.descriptionKey)}
      icon={tool.icon}
      educate={
        <>
          <div className="fy-info-box">
            <strong>{t("Common_WhatYouLearn")}</strong>
            <p>{t("Tool_property_registration_LearnText")}</p>
          </div>
          <FormulaCard
            title={t("Common_Formula")}
            code={"Stamp = value × stamp%\nReg = value × reg%\nTotal = Stamp + Reg"}
            note={t("Tool_property_registration_FormulaNote")}
          />
        </>
      }
      below={<ToolInfoPanel info={propertyRegistrationInfo(t)} />}
    >
      <div className="fy-form-card">
        <h3>{t("Common_YourInputs")}</h3>
        <div className="fy-field">
          <label>{t("Tool_property_registration_LabelValue")}</label>
          <input
            type="number"
            min={0}
            step={100000}
            inputMode="decimal"
            value={propertyValue}
            onChange={(e) => setPropertyValue(Math.max(0, Number(e.target.value) || 0))}
          />
        </div>
        <div className="fy-field">
          <label>{t("Tool_property_registration_LabelMode")}</label>
          <select value={mode} onChange={(e) => setMode(e.target.value as "state" | "custom")}>
            <option value="state">{t("Tool_property_registration_Mode_State")}</option>
            <option value="custom">{t("Tool_property_registration_Mode_Custom")}</option>
          </select>
        </div>
        {mode === "state" ? (
          <>
            <div className="fy-field">
              <label>{t("Tool_property_registration_LabelState")}</label>
              <select
                value={stateId}
                onChange={(e) => setStateId(e.target.value as StampDutyStateId)}
              >
                {STAMP_DUTY_STATES.map((s) => (
                  <option key={s.id} value={s.id}>
                    {t(`Tool_stamp_duty_State_${s.id}`)}
                  </option>
                ))}
              </select>
            </div>
            <div className="fy-field">
              <label>
                <input
                  type="checkbox"
                  checked={womenBuyer}
                  onChange={(e) => setWomenBuyer(e.target.checked)}
                />{" "}
                {t("Tool_property_registration_LabelWomen")}
              </label>
            </div>
          </>
        ) : (
          <>
            <div className="fy-field">
              <label>{t("Tool_property_registration_LabelStamp")}</label>
              <input
                type="number"
                min={0}
                max={15}
                step={0.1}
                inputMode="decimal"
                value={stampPercent}
                onChange={(e) => setStampPercent(Math.max(0, Number(e.target.value) || 0))}
              />
            </div>
            <div className="fy-field">
              <label>{t("Tool_property_registration_LabelReg")}</label>
              <input
                type="number"
                min={0}
                max={5}
                step={0.1}
                inputMode="decimal"
                value={registrationPercent}
                onChange={(e) => setRegistrationPercent(Math.max(0, Number(e.target.value) || 0))}
              />
            </div>
          </>
        )}
        <button type="button" className="fy-btn-calc">
          {t("Common_Calculate")}
        </button>
      </div>

      <ResultSummaryCards cards={summaryCards} />
      <div className="fy-info-box">
        <strong>{t("Tool_property_registration_VerdictTitle")}</strong>
        <p>
          {t(
            "Tool_property_registration_VerdictNote",
            inr(detail.totalCharges),
            inr(detail.stampDuty),
            inr(detail.registration),
          )}
        </p>
      </div>
      <ScenarioCompare
        title={t("Tool_property_registration_ScenarioTitle")}
        subtitle={t("Tool_property_registration_ScenarioSubtitle")}
        scenarios={scenarios}
      />
      <WorkedExample
        title={t("Tool_property_registration_ExampleTitle")}
        subtitle={t("Tool_property_registration_ExampleSubtitle")}
        steps={exampleSteps}
      />
    </ToolPageShell>
  );
}
