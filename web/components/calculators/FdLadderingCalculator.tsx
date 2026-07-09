"use client";

import { useMemo, useState } from "react";
import { useT } from "@/components/providers/I18nProvider";
import {
  BreakdownTable,
  FormulaCard,
  ToolInfoPanel,
  ToolPageShell,
  WorkedExample,
} from "@/components/calculator/CalculatorUi";
import { inr } from "@/lib/finance/format";
import { getTool } from "@/lib/config/tools";
import { fdInfo } from "@/lib/tool-page-content";

export function FdLadderingCalculator() {
  const t = useT();
  const tool = getTool("fd")!;

  const [amount, setAmount] = useState(300000);
  const [count, setCount] = useState(3);
  const [startYears, setStartYears] = useState(1);
  const [rate, setRate] = useState(7);

  const breakdownColumns = useMemo(
    () => [
      { key: "tenure", header: t("Common_Col_Tenure"), alignRight: false as const },
      { key: "principal", header: t("Common_Col_Principal") },
      { key: "maturity", header: t("Common_Col_Maturity") },
    ],
    [t],
  );

  const exampleSteps = useMemo(
    () => [
      t("Tool_fd_ExampleStep_1"),
      t("Tool_fd_ExampleStep_2"),
      t("Tool_fd_ExampleStep_3"),
      t("Tool_fd_ExampleStep_4"),
    ],
    [t],
  );

  const { breakdownRows, breakdownSubtitle } = useMemo(() => {
    const safeCount = Math.min(10, Math.max(1, count));
    const safeAmount = Math.max(0, amount);
    const safeRate = Math.max(0, rate);
    const perFd = safeAmount / safeCount;
    const rows: { tenure: string; maturity: number }[] = [];

    for (let i = 0; i < safeCount; i++) {
      const tenure = startYears + i;
      const maturity = perFd * Math.pow(1 + safeRate / 100, tenure);
      rows.push({ tenure: t("Common_TenureYearsShort", tenure), maturity });
    }

    return {
      breakdownSubtitle: t("Tool_fd_BreakdownSubtitle", inr(perFd)),
      breakdownRows: rows.map((r) => ({
        cells: {
          tenure: r.tenure,
          principal: inr(perFd),
          maturity: inr(r.maturity),
        },
      })),
    };
  }, [amount, count, startYears, rate, t]);

  return (
    <ToolPageShell
      title={t(tool.titleKey)}
      subtitle={t("Tool_fd_Subtitle")}
      description={t(tool.descriptionKey)}
      icon={tool.icon}
      educate={
        <>
          <div className="fy-info-box">
            <strong>{t("Common_WhatYouLearn")}</strong>
            <p>{t("Tool_fd_LearnText")}</p>
          </div>
          <FormulaCard title={t("Common_Formula")} code="maturity = P * (1 + r)^t" note={t("Tool_fd_FormulaNote")} />
        </>
      }
      below={<ToolInfoPanel info={fdInfo(t)} />}
    >
      <div className="fy-form-card">
        <h3>{t("Common_YourInputs")}</h3>
        <div className="fy-fd-inputs">
          <div className="fy-field">
            <label>{t("Tool_fd_LabelAmount")}</label>
            <input
              type="number"
              min={0}
              inputMode="decimal"
              value={amount}
              onChange={(e) => setAmount(Math.max(0, Number(e.target.value) || 0))}
            />
          </div>
          <div className="fy-field">
            <label>{t("Tool_fd_LabelCount")}</label>
            <input
              type="number"
              min={1}
              max={10}
              inputMode="numeric"
              value={count}
              onChange={(e) => setCount(Math.min(10, Math.max(1, Number(e.target.value) || 1)))}
            />
          </div>
          <div className="fy-field">
            <label>{t("Tool_fd_LabelStartTenure")}</label>
            <select
              value={startYears}
              onChange={(e) => setStartYears(Number(e.target.value))}
              aria-label={t("Tool_fd_LabelStartTenure")}
            >
              {[1, 2, 3, 4, 5].map((y) => (
                <option key={y} value={y}>
                  {t("Tool_fd_TenureYear", y)}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="fy-field">
          <label>{t("Common_Label_RatePa")}</label>
          <input
            type="number"
            min={0}
            step={0.1}
            inputMode="decimal"
            value={rate}
            onChange={(e) => setRate(Math.max(0, Number(e.target.value) || 0))}
          />
        </div>
        <button type="button" className="fy-btn-calc">
          {t("Common_Calculate")}
        </button>
      </div>

      <BreakdownTable
        title={t("Tool_fd_BreakdownTitle")}
        subtitle={breakdownSubtitle}
        columns={breakdownColumns}
        rows={breakdownRows}
      />
      <WorkedExample
        title={t("Tool_fd_ExampleTitle")}
        subtitle={t("Tool_fd_ExampleSubtitle")}
        steps={exampleSteps}
      />
    </ToolPageShell>
  );
}
