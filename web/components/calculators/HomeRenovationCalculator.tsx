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
  calculateHomeRenovationCost,
  calculateHomeRenovationLoan,
  type HomeRenovationMode,
} from "@/lib/finance/homeRenovation";
import { inr, percent } from "@/lib/finance/format";
import { getTool } from "@/lib/config/tools";
import { homeRenovationInfo } from "@/lib/tool-page-content";

export function HomeRenovationCalculator() {
  const t = useT();
  const tool = getTool("home-renovation")!;

  const [mode, setMode] = useState<HomeRenovationMode>("cost");
  const [civil, setCivil] = useState(200_000);
  const [electrical, setElectrical] = useState(80_000);
  const [plumbing, setPlumbing] = useState(60_000);
  const [painting, setPainting] = useState(50_000);
  const [furniture, setFurniture] = useState(150_000);
  const [miscellaneous, setMiscellaneous] = useState(40_000);
  const [contingencyPercent, setContingencyPercent] = useState(10);
  const [loanAmount, setLoanAmount] = useState(500_000);
  const [loanRate, setLoanRate] = useState(10.5);
  const [tenureYears, setTenureYears] = useState(5);

  const exampleSteps = useMemo(
    () => [
      t("Tool_home_renovation_ExampleStep_1"),
      t("Tool_home_renovation_ExampleStep_2"),
      t("Tool_home_renovation_ExampleStep_3"),
      t("Tool_home_renovation_ExampleStep_4"),
      t("Tool_home_renovation_ExampleStep_5"),
    ],
    [t],
  );

  const { summaryCards, scenarios } = useMemo(() => {
    if (mode === "loan") {
      const result = calculateHomeRenovationLoan({
        loanAmount,
        annualRatePercent: loanRate,
        tenureYears,
      });
      const shorter = calculateHomeRenovationLoan({
        loanAmount,
        annualRatePercent: loanRate,
        tenureYears: Math.max(1, tenureYears - 2),
      });
      const longer = calculateHomeRenovationLoan({
        loanAmount,
        annualRatePercent: loanRate,
        tenureYears: tenureYears + 2,
      });

      return {
        summaryCards: [
          {
            label: t("Tool_home_renovation_Result_Emi"),
            value: inr(result.monthlyEmi),
            footnote: t(
              "Tool_home_renovation_Result_EmiFootnote",
              percent(loanRate),
              tenureYears,
            ),
            variant: "primary" as const,
          },
          {
            label: t("Tool_home_renovation_Result_Interest"),
            value: inr(result.totalInterest),
            footnote: t("Tool_home_renovation_Result_InterestFootnote"),
            variant: "volatile" as const,
          },
          {
            label: t("Tool_home_renovation_Result_TotalPay"),
            value: inr(result.totalPayment),
            footnote: t("Tool_home_renovation_Result_TotalPayFootnote", inr(loanAmount)),
          },
        ],
        scenarios: [
          {
            name: t("Tool_home_renovation_Scenario_Shorter"),
            primaryLabel: t("Tool_home_renovation_Result_Emi"),
            primaryValue: inr(shorter.monthlyEmi),
            secondaryLabel: t("Tool_home_renovation_Result_Interest"),
            secondaryValue: inr(shorter.totalInterest),
            variant: "worst",
          },
          {
            name: t("Common_Scenario_Base"),
            primaryLabel: t("Tool_home_renovation_Result_Emi"),
            primaryValue: inr(result.monthlyEmi),
            secondaryLabel: t("Tool_home_renovation_Result_Interest"),
            secondaryValue: inr(result.totalInterest),
            variant: "base",
          },
          {
            name: t("Tool_home_renovation_Scenario_Longer"),
            primaryLabel: t("Tool_home_renovation_Result_Emi"),
            primaryValue: inr(longer.monthlyEmi),
            secondaryLabel: t("Tool_home_renovation_Result_Interest"),
            secondaryValue: inr(longer.totalInterest),
            variant: "best",
          },
        ],
      };
    }

    const result = calculateHomeRenovationCost({
      civil,
      electrical,
      plumbing,
      painting,
      furniture,
      miscellaneous,
      contingencyPercent,
    });
    const lowBuf = calculateHomeRenovationCost({
      civil,
      electrical,
      plumbing,
      painting,
      furniture,
      miscellaneous,
      contingencyPercent: Math.max(0, contingencyPercent - 5),
    });
    const highBuf = calculateHomeRenovationCost({
      civil,
      electrical,
      plumbing,
      painting,
      furniture,
      miscellaneous,
      contingencyPercent: contingencyPercent + 5,
    });

    return {
      summaryCards: [
        {
          label: t("Tool_home_renovation_Result_Total"),
          value: inr(result.total),
          footnote: t(
            "Tool_home_renovation_Result_TotalFootnote",
            percent(contingencyPercent),
          ),
          variant: "primary" as const,
        },
        {
          label: t("Tool_home_renovation_Result_Subtotal"),
          value: inr(result.subtotal),
          footnote: t("Tool_home_renovation_Result_SubtotalFootnote"),
        },
        {
          label: t("Tool_home_renovation_Result_Contingency"),
          value: inr(result.contingencyAmount),
          footnote: t("Tool_home_renovation_Result_ContingencyFootnote"),
          variant: "secure" as const,
        },
      ],
      scenarios: [
        {
          name: t("Tool_home_renovation_Scenario_LowBuf"),
          primaryLabel: t("Tool_home_renovation_Result_Total"),
          primaryValue: inr(lowBuf.total),
          secondaryLabel: t("Tool_home_renovation_Result_Contingency"),
          secondaryValue: inr(lowBuf.contingencyAmount),
          variant: "worst",
        },
        {
          name: t("Common_Scenario_Base"),
          primaryLabel: t("Tool_home_renovation_Result_Total"),
          primaryValue: inr(result.total),
          secondaryLabel: t("Tool_home_renovation_Result_Subtotal"),
          secondaryValue: inr(result.subtotal),
          variant: "base",
        },
        {
          name: t("Tool_home_renovation_Scenario_HighBuf"),
          primaryLabel: t("Tool_home_renovation_Result_Total"),
          primaryValue: inr(highBuf.total),
          secondaryLabel: t("Tool_home_renovation_Result_Contingency"),
          secondaryValue: inr(highBuf.contingencyAmount),
          variant: "best",
        },
      ],
    };
  }, [
    mode,
    civil,
    electrical,
    plumbing,
    painting,
    furniture,
    miscellaneous,
    contingencyPercent,
    loanAmount,
    loanRate,
    tenureYears,
    t,
  ]);

  return (
    <ToolPageShell
      title={t(tool.titleKey)}
      subtitle={t("Tool_home_renovation_Subtitle")}
      description={t(tool.descriptionKey)}
      icon={tool.icon}
      educate={
        <>
          <div className="fy-info-box">
            <strong>{t("Common_WhatYouLearn")}</strong>
            <p>{t("Tool_home_renovation_LearnText")}</p>
          </div>
          <FormulaCard
            title={t("Common_Formula")}
            code={"Cost: total = Σ categories × (1 + contingency%)\nLoan: EMI on amount, rate, tenure"}
            note={t("Tool_home_renovation_FormulaNote")}
          />
        </>
      }
      below={<ToolInfoPanel info={homeRenovationInfo(t)} />}
    >
      <div className="fy-form-card">
        <h3>{t("Common_YourInputs")}</h3>
        <div className="fy-field">
          <label>{t("Tool_home_renovation_LabelMode")}</label>
          <select value={mode} onChange={(e) => setMode(e.target.value as HomeRenovationMode)}>
            <option value="cost">{t("Tool_home_renovation_Mode_Cost")}</option>
            <option value="loan">{t("Tool_home_renovation_Mode_Loan")}</option>
          </select>
        </div>

        {mode === "cost" ? (
          <>
            <div className="fy-field">
              <label>{t("Tool_home_renovation_LabelCivil")}</label>
              <input
                type="number"
                min={0}
                step={1000}
                inputMode="decimal"
                value={civil}
                onChange={(e) => setCivil(Math.max(0, Number(e.target.value) || 0))}
              />
            </div>
            <div className="fy-field">
              <label>{t("Tool_home_renovation_LabelElectrical")}</label>
              <input
                type="number"
                min={0}
                step={1000}
                inputMode="decimal"
                value={electrical}
                onChange={(e) => setElectrical(Math.max(0, Number(e.target.value) || 0))}
              />
            </div>
            <div className="fy-field">
              <label>{t("Tool_home_renovation_LabelPlumbing")}</label>
              <input
                type="number"
                min={0}
                step={1000}
                inputMode="decimal"
                value={plumbing}
                onChange={(e) => setPlumbing(Math.max(0, Number(e.target.value) || 0))}
              />
            </div>
            <div className="fy-field">
              <label>{t("Tool_home_renovation_LabelPainting")}</label>
              <input
                type="number"
                min={0}
                step={1000}
                inputMode="decimal"
                value={painting}
                onChange={(e) => setPainting(Math.max(0, Number(e.target.value) || 0))}
              />
            </div>
            <div className="fy-field">
              <label>{t("Tool_home_renovation_LabelFurniture")}</label>
              <input
                type="number"
                min={0}
                step={1000}
                inputMode="decimal"
                value={furniture}
                onChange={(e) => setFurniture(Math.max(0, Number(e.target.value) || 0))}
              />
            </div>
            <div className="fy-field">
              <label>{t("Tool_home_renovation_LabelMisc")}</label>
              <input
                type="number"
                min={0}
                step={1000}
                inputMode="decimal"
                value={miscellaneous}
                onChange={(e) => setMiscellaneous(Math.max(0, Number(e.target.value) || 0))}
              />
            </div>
            <div className="fy-field">
              <label>{t("Tool_home_renovation_LabelContingency")}</label>
              <input
                type="number"
                min={0}
                step={1}
                inputMode="decimal"
                value={contingencyPercent}
                onChange={(e) => setContingencyPercent(Math.max(0, Number(e.target.value) || 0))}
              />
            </div>
          </>
        ) : (
          <>
            <div className="fy-field">
              <label>{t("Tool_home_renovation_LabelLoan")}</label>
              <input
                type="number"
                min={0}
                step={10000}
                inputMode="decimal"
                value={loanAmount}
                onChange={(e) => setLoanAmount(Math.max(0, Number(e.target.value) || 0))}
              />
            </div>
            <div className="fy-field">
              <label>{t("Common_Label_RatePa")}</label>
              <input
                type="number"
                min={0}
                step={0.1}
                inputMode="decimal"
                value={loanRate}
                onChange={(e) => setLoanRate(Math.max(0, Number(e.target.value) || 0))}
              />
            </div>
            <div className="fy-field">
              <label>{t("Tool_home_renovation_LabelTenure")}</label>
              <input
                type="number"
                min={1}
                step={1}
                inputMode="numeric"
                value={tenureYears}
                onChange={(e) => setTenureYears(Math.max(1, Number(e.target.value) || 1))}
              />
            </div>
          </>
        )}

        <button type="button" className="fy-btn-calc">
          {t("Common_Calculate")}
        </button>
      </div>

      <ResultSummaryCards cards={summaryCards} />
      <ScenarioCompare
        title={t("Tool_home_renovation_ScenarioTitle")}
        subtitle={t("Tool_home_renovation_ScenarioSubtitle")}
        scenarios={scenarios}
      />
      <WorkedExample
        title={t("Tool_home_renovation_ExampleTitle")}
        subtitle={t("Tool_home_renovation_ExampleSubtitle")}
        steps={exampleSteps}
      />
    </ToolPageShell>
  );
}
