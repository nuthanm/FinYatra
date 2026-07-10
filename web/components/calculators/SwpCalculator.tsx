"use client";

import { useMemo, useState } from "react";
import { useT } from "@/components/providers/I18nProvider";
import {
  BreakdownTable,
  FormulaCard,
  ResultSummaryCards,
  ScenarioCompare,
  ToolInfoPanel,
  ToolPageShell,
  WorkedExample,
} from "@/components/calculator/CalculatorUi";
import { calculateSwp, swpMonthsUntilDepleted } from "@/lib/finance/swp";
import { inr, percent } from "@/lib/finance/format";
import { getTool } from "@/lib/config/tools";
import { swpInfo } from "@/lib/tool-page-content";

export function SwpCalculator() {
  const t = useT();
  const tool = getTool("swp")!;

  const [corpus, setCorpus] = useState(5_000_000);
  const [withdrawal, setWithdrawal] = useState(30_000);
  const [returnPct, setReturnPct] = useState(10);
  const [years, setYears] = useState(20);

  const breakdownColumns = useMemo(
    () => [
      { key: "year", header: t("Common_Year"), alignRight: false as const },
      { key: "withdrawn", header: t("Tool_swp_Col_Withdrawn") },
      { key: "corpus", header: t("Tool_swp_Col_Corpus") },
    ],
    [t],
  );

  const exampleSteps = useMemo(
    () => [
      t("Tool_swp_ExampleStep_1"),
      t("Tool_swp_ExampleStep_2"),
      t("Tool_swp_ExampleStep_3"),
      t("Tool_swp_ExampleStep_4"),
      t("Tool_swp_ExampleStep_5"),
    ],
    [t],
  );

  const { summaryCards, scenarios, breakdownRows, longevityNote } = useMemo(() => {
    const result = calculateSwp(corpus, withdrawal, returnPct, years);
    const conservative = calculateSwp(corpus, withdrawal, 8, years);
    const aggressive = calculateSwp(corpus, withdrawal, 12, years);
    const monthsLeft = swpMonthsUntilDepleted(corpus, withdrawal, returnPct);
    const yearsLeft = monthsLeft / 12;

    return {
      longevityNote: result.depleted
        ? t("Tool_swp_Longevity_Depleted", yearsLeft.toFixed(1))
        : t("Tool_swp_Longevity_Ok", years, inr(result.endingCorpus)),
      summaryCards: [
        {
          label: t("Tool_swp_Result_Ending"),
          value: inr(result.endingCorpus),
          footnote: t("Tool_swp_Result_EndingFootnote", years),
          variant: result.depleted ? ("volatile" as const) : ("primary" as const),
        },
        {
          label: t("Tool_swp_Result_Withdrawn"),
          value: inr(result.totalWithdrawn),
          footnote: t("Tool_swp_Result_WithdrawnFootnote", result.monthsLasted),
        },
        {
          label: t("Tool_swp_Result_Longevity"),
          value: t("Tool_swp_Result_LongevityValue", yearsLeft.toFixed(1)),
          footnote: t("Common_Footnote_RatePa", percent(returnPct)),
          variant: "secure" as const,
        },
      ],
      scenarios: [
        {
          name: t("Tool_swp_Scenario_Conservative"),
          primaryLabel: t("Tool_swp_Result_Ending"),
          primaryValue: inr(conservative.endingCorpus),
          secondaryLabel: t("Tool_swp_Result_Withdrawn"),
          secondaryValue: inr(conservative.totalWithdrawn),
          variant: "worst",
        },
        {
          name: t("Common_Scenario_Base"),
          primaryLabel: t("Tool_swp_Result_Ending"),
          primaryValue: inr(result.endingCorpus),
          secondaryLabel: t("Common_Label_Return"),
          secondaryValue: percent(returnPct),
          variant: "base",
        },
        {
          name: t("Tool_swp_Scenario_Aggressive"),
          primaryLabel: t("Tool_swp_Result_Ending"),
          primaryValue: inr(aggressive.endingCorpus),
          secondaryLabel: t("Tool_swp_Result_Withdrawn"),
          secondaryValue: inr(aggressive.totalWithdrawn),
          variant: "best",
        },
      ],
      breakdownRows: result.yearly.map((r) => ({
        cells: {
          year: t("Common_YearN", r.year),
          withdrawn: inr(r.withdrawn),
          corpus: inr(r.corpus),
        },
      })),
    };
  }, [corpus, withdrawal, returnPct, years, t]);

  return (
    <ToolPageShell
      title={t(tool.titleKey)}
      subtitle={t("Tool_swp_Subtitle")}
      description={t(tool.descriptionKey)}
      icon={tool.icon}
      educate={
        <>
          <div className="fy-info-box">
            <strong>{t("Common_WhatYouLearn")}</strong>
            <p>{t("Tool_swp_LearnText")}</p>
          </div>
          <FormulaCard
            title={t("Common_Formula")}
            code={"each month:\n  corpus *= (1 + r)\n  corpus -= withdrawal"}
            note={t("Tool_swp_FormulaNote")}
          />
        </>
      }
      below={<ToolInfoPanel info={swpInfo(t)} />}
    >
      <div className="fy-form-card">
        <h3>{t("Common_YourInputs")}</h3>
        <div className="fy-field">
          <label>{t("Tool_swp_LabelCorpus")}</label>
          <input
            type="number"
            min={0}
            step={10000}
            inputMode="decimal"
            value={corpus}
            onChange={(e) => setCorpus(Math.max(0, Number(e.target.value) || 0))}
          />
        </div>
        <div className="fy-field">
          <label>{t("Tool_swp_LabelWithdrawal")}</label>
          <input
            type="number"
            min={0}
            step={1000}
            inputMode="decimal"
            value={withdrawal}
            onChange={(e) => setWithdrawal(Math.max(0, Number(e.target.value) || 0))}
          />
        </div>
        <div className="fy-field">
          <label>{t("Common_Label_RatePa")}</label>
          <input
            type="number"
            min={0}
            step={0.5}
            inputMode="decimal"
            value={returnPct}
            onChange={(e) => setReturnPct(Math.max(0, Number(e.target.value) || 0))}
          />
        </div>
        <div className="fy-field">
          <label>{t("Common_Label_Years")}</label>
          <input
            type="number"
            min={1}
            max={50}
            step={1}
            inputMode="numeric"
            value={years}
            onChange={(e) => setYears(Math.max(1, Number(e.target.value) || 1))}
          />
        </div>
        <button type="button" className="fy-btn-calc">
          {t("Common_Calculate")}
        </button>
      </div>

      <div className="fy-info-box fy-tax-verdict">
        <strong>{t("Tool_swp_LongevityTitle")}</strong>
        <p>{longevityNote}</p>
      </div>

      <ResultSummaryCards cards={summaryCards} />
      <ScenarioCompare title={t("Tool_swp_ScenarioTitle")} subtitle={t("Tool_swp_ScenarioSubtitle")} scenarios={scenarios} />
      <BreakdownTable title={t("Tool_swp_BreakdownTitle")} columns={breakdownColumns} rows={breakdownRows} />
      <WorkedExample title={t("Tool_swp_ExampleTitle")} subtitle={t("Tool_swp_ExampleSubtitle")} steps={exampleSteps} />
    </ToolPageShell>
  );
}
