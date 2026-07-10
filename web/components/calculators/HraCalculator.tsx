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
import { calculateHraExemption } from "@/lib/finance/hra";
import { inr } from "@/lib/finance/format";
import { getTool } from "@/lib/config/tools";
import { hraInfo } from "@/lib/tool-page-content";

export function HraCalculator() {
  const t = useT();
  const tool = getTool("hra")!;

  const [basic, setBasic] = useState(600_000);
  const [hraReceived, setHraReceived] = useState(240_000);
  const [rentPaid, setRentPaid] = useState(300_000);
  const [isMetro, setIsMetro] = useState(true);

  const exampleSteps = useMemo(
    () => [
      t("Tool_hra_ExampleStep_1"),
      t("Tool_hra_ExampleStep_2"),
      t("Tool_hra_ExampleStep_3"),
      t("Tool_hra_ExampleStep_4"),
      t("Tool_hra_ExampleStep_5"),
    ],
    [t],
  );

  const { summaryCards, scenarios, limiting } = useMemo(() => {
    const result = calculateHraExemption({
      basicAnnual: Math.max(0, basic),
      hraReceivedAnnual: Math.max(0, hraReceived),
      rentPaidAnnual: Math.max(0, rentPaid),
      isMetro,
    });

    const nonMetro = calculateHraExemption({
      basicAnnual: Math.max(0, basic),
      hraReceivedAnnual: Math.max(0, hraReceived),
      rentPaidAnnual: Math.max(0, rentPaid),
      isMetro: false,
    });

    let limitingKey = "Tool_hra_Limit_Actual";
    if (result.exemption === result.rentMinus10PercentBasic) limitingKey = "Tool_hra_Limit_Rent";
    else if (result.exemption === result.percentOfBasic) limitingKey = "Tool_hra_Limit_Percent";

    return {
      limiting: t(limitingKey),
      summaryCards: [
        {
          label: t("Tool_hra_Result_Exemption"),
          value: inr(result.exemption),
          footnote: t("Tool_hra_Result_ExemptionFootnote", t(limitingKey)),
          variant: "primary" as const,
        },
        {
          label: t("Tool_hra_Result_Taxable"),
          value: inr(result.taxableHra),
          footnote: t("Tool_hra_Result_TaxableFootnote"),
          variant: "volatile" as const,
        },
        {
          label: t("Tool_hra_Result_Received"),
          value: inr(result.actualHra),
          footnote: t("Tool_hra_Result_ReceivedFootnote"),
        },
      ],
      scenarios: [
        {
          name: t("Tool_hra_Scenario_NonMetro"),
          primaryLabel: t("Tool_hra_Result_Exemption"),
          primaryValue: inr(nonMetro.exemption),
          secondaryLabel: t("Tool_hra_Result_Taxable"),
          secondaryValue: inr(nonMetro.taxableHra),
          variant: "worst",
        },
        {
          name: t("Common_Scenario_Base"),
          primaryLabel: t("Tool_hra_Result_Exemption"),
          primaryValue: inr(result.exemption),
          secondaryLabel: t("Tool_hra_LimitingFactor"),
          secondaryValue: t(limitingKey),
          variant: "base",
        },
        {
          name: t("Tool_hra_Scenario_Metro"),
          primaryLabel: t("Tool_hra_Result_Exemption"),
          primaryValue: inr(
            calculateHraExemption({
              basicAnnual: Math.max(0, basic),
              hraReceivedAnnual: Math.max(0, hraReceived),
              rentPaidAnnual: Math.max(0, rentPaid),
              isMetro: true,
            }).exemption,
          ),
          secondaryLabel: t("Tool_hra_MetroRule"),
          secondaryValue: "50%",
          variant: "best",
        },
      ],
    };
  }, [basic, hraReceived, rentPaid, isMetro, t]);

  return (
    <ToolPageShell
      title={t(tool.titleKey)}
      subtitle={t("Tool_hra_Subtitle")}
      description={t(tool.descriptionKey)}
      icon={tool.icon}
      educate={
        <>
          <div className="fy-info-box">
            <strong>{t("Common_WhatYouLearn")}</strong>
            <p>{t("Tool_hra_LearnText")}</p>
          </div>
          <FormulaCard
            title={t("Common_Formula")}
            code={"exemption = min(\n  actual HRA,\n  rent − 10% of basic,\n  50%/40% of basic\n)"}
            note={t("Tool_hra_FormulaNote")}
          />
        </>
      }
      below={<ToolInfoPanel info={hraInfo(t)} />}
    >
      <div className="fy-form-card">
        <h3>{t("Common_YourInputs")}</h3>
        <div className="fy-field">
          <label>{t("Tool_hra_LabelBasic")}</label>
          <input
            type="number"
            min={0}
            step={1000}
            inputMode="decimal"
            value={basic}
            onChange={(e) => setBasic(Math.max(0, Number(e.target.value) || 0))}
          />
        </div>
        <div className="fy-field">
          <label>{t("Tool_hra_LabelHra")}</label>
          <input
            type="number"
            min={0}
            step={1000}
            inputMode="decimal"
            value={hraReceived}
            onChange={(e) => setHraReceived(Math.max(0, Number(e.target.value) || 0))}
          />
        </div>
        <div className="fy-field">
          <label>{t("Tool_hra_LabelRent")}</label>
          <input
            type="number"
            min={0}
            step={1000}
            inputMode="decimal"
            value={rentPaid}
            onChange={(e) => setRentPaid(Math.max(0, Number(e.target.value) || 0))}
          />
        </div>
        <div className="fy-field">
          <label>
            <input type="checkbox" checked={isMetro} onChange={(e) => setIsMetro(e.target.checked)} />{" "}
            {t("Tool_hra_LabelMetro")}
          </label>
          <p className="fy-field-hint">{t("Tool_hra_MetroHint")}</p>
        </div>
        <button type="button" className="fy-btn-calc">
          {t("Common_Calculate")}
        </button>
      </div>

      <div className="fy-info-box fy-tax-verdict">
        <strong>{t("Tool_hra_LimitingTitle")}</strong>
        <p>{t("Tool_hra_LimitingBody", limiting)}</p>
      </div>

      <ResultSummaryCards cards={summaryCards} />
      <ScenarioCompare title={t("Tool_hra_ScenarioTitle")} subtitle={t("Tool_hra_ScenarioSubtitle")} scenarios={scenarios} />
      <WorkedExample title={t("Tool_hra_ExampleTitle")} subtitle={t("Tool_hra_ExampleSubtitle")} steps={exampleSteps} />
    </ToolPageShell>
  );
}
