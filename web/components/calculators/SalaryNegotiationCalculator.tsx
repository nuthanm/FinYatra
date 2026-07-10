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
import { calculateSalaryNegotiation } from "@/lib/finance/salaryNegotiation";
import { inr, percent } from "@/lib/finance/format";
import { getTool } from "@/lib/config/tools";
import { salaryNegotiationInfo } from "@/lib/tool-page-content";

export function SalaryNegotiationCalculator() {
  const t = useT();
  const tool = getTool("salary-negotiation")!;

  const [currentCtc, setCurrentCtc] = useState(1_200_000);
  const [offerCtc, setOfferCtc] = useState(1_350_000);
  const [desiredHikePercent, setDesiredHikePercent] = useState(20);

  const exampleSteps = useMemo(
    () => [
      t("Tool_salary_negotiation_ExampleStep_1"),
      t("Tool_salary_negotiation_ExampleStep_2"),
      t("Tool_salary_negotiation_ExampleStep_3"),
      t("Tool_salary_negotiation_ExampleStep_4"),
      t("Tool_salary_negotiation_ExampleStep_5"),
    ],
    [t],
  );

  const verdictKey = {
    below: "Tool_salary_negotiation_Verdict_Below",
    meets: "Tool_salary_negotiation_Verdict_Meets",
    above: "Tool_salary_negotiation_Verdict_Above",
  } as const;

  const { summaryCards, scenarios } = useMemo(() => {
    const result = calculateSalaryNegotiation({ currentCtc, offerCtc, desiredHikePercent });
    const lowerAsk = calculateSalaryNegotiation({
      currentCtc,
      offerCtc,
      desiredHikePercent: Math.max(0, desiredHikePercent - 5),
    });
    const higherAsk = calculateSalaryNegotiation({
      currentCtc,
      offerCtc,
      desiredHikePercent: desiredHikePercent + 5,
    });

    return {
      summaryCards: [
        {
          label: t("Tool_salary_negotiation_Result_OfferHike"),
          value: percent(result.offerHikePercent),
          footnote: t("Tool_salary_negotiation_Result_OfferHikeFootnote", inr(result.offerHikeAmount)),
          variant: "primary" as const,
        },
        {
          label: t("Tool_salary_negotiation_Result_Counter"),
          value: inr(result.counterCtc),
          footnote: t(
            "Tool_salary_negotiation_Result_CounterFootnote",
            percent(desiredHikePercent),
          ),
          variant: "secure" as const,
        },
        {
          label: t("Tool_salary_negotiation_Result_Verdict"),
          value: t(verdictKey[result.verdict]),
          footnote: t(
            "Tool_salary_negotiation_Result_GapFootnote",
            inr(Math.abs(result.gapVsDesired)),
          ),
          variant:
            result.verdict === "below"
              ? ("volatile" as const)
              : result.verdict === "above"
                ? ("secure" as const)
                : ("default" as const),
        },
      ],
      scenarios: [
        {
          name: t("Tool_salary_negotiation_Scenario_LowerAsk", percent(Math.max(0, desiredHikePercent - 5))),
          primaryLabel: t("Tool_salary_negotiation_Result_Counter"),
          primaryValue: inr(lowerAsk.counterCtc),
          secondaryLabel: t("Tool_salary_negotiation_Result_Verdict"),
          secondaryValue: t(verdictKey[lowerAsk.verdict]),
          variant: "worst",
        },
        {
          name: t("Common_Scenario_Base"),
          primaryLabel: t("Tool_salary_negotiation_Result_OfferHike"),
          primaryValue: percent(result.offerHikePercent),
          secondaryLabel: t("Tool_salary_negotiation_Result_Counter"),
          secondaryValue: inr(result.counterCtc),
          variant: "base",
        },
        {
          name: t("Tool_salary_negotiation_Scenario_HigherAsk", percent(desiredHikePercent + 5)),
          primaryLabel: t("Tool_salary_negotiation_Result_Counter"),
          primaryValue: inr(higherAsk.counterCtc),
          secondaryLabel: t("Tool_salary_negotiation_Result_Verdict"),
          secondaryValue: t(verdictKey[higherAsk.verdict]),
          variant: "best",
        },
      ],
    };
  }, [currentCtc, offerCtc, desiredHikePercent, t]);

  return (
    <ToolPageShell
      title={t(tool.titleKey)}
      subtitle={t("Tool_salary_negotiation_Subtitle")}
      description={t(tool.descriptionKey)}
      icon={tool.icon}
      educate={
        <>
          <div className="fy-info-box">
            <strong>{t("Common_WhatYouLearn")}</strong>
            <p>{t("Tool_salary_negotiation_LearnText")}</p>
          </div>
          <FormulaCard
            title={t("Common_Formula")}
            code={"offerHike% = (offer − current) / current × 100\ncounter = current × (1 + desired%/100)"}
            note={t("Tool_salary_negotiation_FormulaNote")}
          />
        </>
      }
      below={<ToolInfoPanel info={salaryNegotiationInfo(t)} />}
    >
      <div className="fy-form-card">
        <h3>{t("Common_YourInputs")}</h3>
        <div className="fy-field">
          <label>{t("Tool_salary_negotiation_LabelCurrent")}</label>
          <input
            type="number"
            min={0}
            step={10000}
            inputMode="decimal"
            value={currentCtc}
            onChange={(e) => setCurrentCtc(Math.max(0, Number(e.target.value) || 0))}
          />
        </div>
        <div className="fy-field">
          <label>{t("Tool_salary_negotiation_LabelOffer")}</label>
          <input
            type="number"
            min={0}
            step={10000}
            inputMode="decimal"
            value={offerCtc}
            onChange={(e) => setOfferCtc(Math.max(0, Number(e.target.value) || 0))}
          />
        </div>
        <div className="fy-field">
          <label>{t("Tool_salary_negotiation_LabelDesired")}</label>
          <input
            type="number"
            min={0}
            step={1}
            inputMode="decimal"
            value={desiredHikePercent}
            onChange={(e) => setDesiredHikePercent(Math.max(0, Number(e.target.value) || 0))}
          />
          <p className="fy-field-hint">{t("Tool_salary_negotiation_DesiredHint")}</p>
        </div>
        <button type="button" className="fy-btn-calc">
          {t("Common_Calculate")}
        </button>
      </div>

      <ResultSummaryCards cards={summaryCards} />
      <ScenarioCompare
        title={t("Tool_salary_negotiation_ScenarioTitle")}
        subtitle={t("Tool_salary_negotiation_ScenarioSubtitle")}
        scenarios={scenarios}
      />
      <WorkedExample
        title={t("Tool_salary_negotiation_ExampleTitle")}
        subtitle={t("Tool_salary_negotiation_ExampleSubtitle")}
        steps={exampleSteps}
      />
    </ToolPageShell>
  );
}
