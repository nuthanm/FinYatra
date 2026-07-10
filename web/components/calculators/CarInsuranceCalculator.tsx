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
import { calculateCarInsurance, DEFAULT_TP_PREMIUM } from "@/lib/finance/carInsurance";
import { inr, percent } from "@/lib/finance/format";
import { getTool } from "@/lib/config/tools";
import { carInsuranceInfo } from "@/lib/tool-page-content";

export function CarInsuranceCalculator() {
  const t = useT();
  const tool = getTool("car-insurance")!;

  const [idv, setIdv] = useState(600_000);
  const [odRate, setOdRate] = useState(2.5);
  const [thirdParty, setThirdParty] = useState(DEFAULT_TP_PREMIUM);

  const exampleSteps = useMemo(
    () => [
      t("Tool_car_insurance_ExampleStep_1"),
      t("Tool_car_insurance_ExampleStep_2"),
      t("Tool_car_insurance_ExampleStep_3"),
      t("Tool_car_insurance_ExampleStep_4"),
      t("Tool_car_insurance_ExampleStep_5"),
    ],
    [t],
  );

  const { summaryCards, scenarios } = useMemo(() => {
    const result = calculateCarInsurance({
      idv,
      odRatePercent: odRate,
      thirdPartyPremium: thirdParty,
    });
    const lowerOd = calculateCarInsurance({
      idv,
      odRatePercent: Math.max(0, odRate - 0.5),
      thirdPartyPremium: thirdParty,
    });
    const higherIdv = calculateCarInsurance({
      idv: idv * 1.2,
      odRatePercent: odRate,
      thirdPartyPremium: thirdParty,
    });

    return {
      summaryCards: [
        {
          label: t("Tool_car_insurance_Result_Od"),
          value: inr(result.ownDamagePremium),
          footnote: t("Tool_car_insurance_Result_OdFootnote", percent(result.odRatePercent)),
          variant: "primary" as const,
        },
        {
          label: t("Tool_car_insurance_Result_Tp"),
          value: inr(result.thirdPartyPremium),
          footnote: t("Tool_car_insurance_Result_TpFootnote"),
        },
        {
          label: t("Tool_car_insurance_Result_Total"),
          value: inr(result.totalPremium),
          footnote: t("Tool_car_insurance_Result_TotalFootnote"),
          variant: "secure" as const,
        },
      ],
      scenarios: [
        {
          name: t("Tool_car_insurance_Scenario_LowerOd"),
          primaryLabel: t("Tool_car_insurance_Result_Total"),
          primaryValue: inr(lowerOd.totalPremium),
          secondaryLabel: t("Tool_car_insurance_Result_Od"),
          secondaryValue: inr(lowerOd.ownDamagePremium),
          variant: "best",
        },
        {
          name: t("Common_Scenario_Base"),
          primaryLabel: t("Tool_car_insurance_Result_Total"),
          primaryValue: inr(result.totalPremium),
          secondaryLabel: t("Tool_car_insurance_LabelIdv"),
          secondaryValue: inr(idv),
          variant: "base",
        },
        {
          name: t("Tool_car_insurance_Scenario_HigherIdv"),
          primaryLabel: t("Tool_car_insurance_Result_Total"),
          primaryValue: inr(higherIdv.totalPremium),
          secondaryLabel: t("Tool_car_insurance_LabelIdv"),
          secondaryValue: inr(idv * 1.2),
          variant: "worst",
        },
      ],
    };
  }, [idv, odRate, thirdParty, t]);

  return (
    <ToolPageShell
      title={t(tool.titleKey)}
      subtitle={t("Tool_car_insurance_Subtitle")}
      description={t(tool.descriptionKey)}
      icon={tool.icon}
      educate={
        <>
          <div className="fy-info-box">
            <strong>{t("Common_WhatYouLearn")}</strong>
            <p>{t("Tool_car_insurance_LearnText")}</p>
          </div>
          <FormulaCard
            title={t("Common_Formula")}
            code={"OD = IDV × rate%\nTotal ≈ OD + TP (flat)"}
            note={t("Tool_car_insurance_FormulaNote")}
          />
        </>
      }
      below={<ToolInfoPanel info={carInsuranceInfo(t)} />}
    >
      <div className="fy-form-card">
        <h3>{t("Common_YourInputs")}</h3>
        <div className="fy-field">
          <label>{t("Tool_car_insurance_LabelIdv")}</label>
          <input
            type="number"
            min={0}
            step={10000}
            inputMode="decimal"
            value={idv}
            onChange={(e) => setIdv(Math.max(0, Number(e.target.value) || 0))}
          />
          <p className="fy-field-hint">{t("Tool_car_insurance_IdvHint")}</p>
        </div>
        <div className="fy-field">
          <label>{t("Tool_car_insurance_LabelOdRate")}</label>
          <input
            type="number"
            min={0}
            step={0.1}
            inputMode="decimal"
            value={odRate}
            onChange={(e) => setOdRate(Math.max(0, Number(e.target.value) || 0))}
          />
          <p className="fy-field-hint">{t("Tool_car_insurance_OdRateHint")}</p>
        </div>
        <div className="fy-field">
          <label>{t("Tool_car_insurance_LabelTp")}</label>
          <input
            type="number"
            min={0}
            step={100}
            inputMode="decimal"
            value={thirdParty}
            onChange={(e) => setThirdParty(Math.max(0, Number(e.target.value) || 0))}
          />
          <p className="fy-field-hint">{t("Tool_car_insurance_TpHint")}</p>
        </div>
        <button type="button" className="fy-btn-calc">
          {t("Common_Calculate")}
        </button>
      </div>

      <ResultSummaryCards cards={summaryCards} />
      <ScenarioCompare
        title={t("Tool_car_insurance_ScenarioTitle")}
        subtitle={t("Tool_car_insurance_ScenarioSubtitle")}
        scenarios={scenarios}
      />
      <WorkedExample
        title={t("Tool_car_insurance_ExampleTitle")}
        subtitle={t("Tool_car_insurance_ExampleSubtitle")}
        steps={exampleSteps}
      />
    </ToolPageShell>
  );
}
