"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useT } from "@/components/providers/I18nProvider";
import {
  BreakdownTable,
  FormulaCard,
  ResultSummaryCards,
  ToolInfoPanel,
  ToolPageShell,
  WorkedExample,
} from "@/components/calculator/CalculatorUi";
import { calculateRentReceipt } from "@/lib/finance/rentReceipt";
import { inr } from "@/lib/finance/format";
import { getTool } from "@/lib/config/tools";
import { rentReceiptInfo } from "@/lib/tool-page-content";

export function RentReceiptCalculator() {
  const t = useT();
  const tool = getTool("rent-receipt")!;

  const [monthlyRent, setMonthlyRent] = useState(25_000);
  const [months, setMonths] = useState(12);
  const [landlordName, setLandlordName] = useState("");
  const [tenantName, setTenantName] = useState("");
  const [propertyAddress, setPropertyAddress] = useState("");

  const breakdownColumns = useMemo(
    () => [
      { key: "month", header: t("Tool_rent_receipt_Col_Month"), alignRight: false as const },
      { key: "amount", header: t("Tool_rent_receipt_Col_Amount") },
    ],
    [t],
  );

  const exampleSteps = useMemo(
    () => [
      t("Tool_rent_receipt_ExampleStep_1"),
      t("Tool_rent_receipt_ExampleStep_2"),
      t("Tool_rent_receipt_ExampleStep_3"),
      t("Tool_rent_receipt_ExampleStep_4"),
      t("Tool_rent_receipt_ExampleStep_5"),
    ],
    [t],
  );

  const { summaryCards, breakdownRows, result } = useMemo(() => {
    const r = calculateRentReceipt({
      monthlyRent,
      months,
      landlordName,
      tenantName,
      propertyAddress,
    });

    return {
      result: r,
      summaryCards: [
        {
          label: t("Tool_rent_receipt_Result_Total"),
          value: inr(r.totalRent),
          footnote: t("Tool_rent_receipt_Result_TotalFootnote", String(r.months)),
          variant: "primary" as const,
        },
        {
          label: t("Tool_rent_receipt_Result_Monthly"),
          value: inr(r.monthlyRent),
          footnote: t("Tool_rent_receipt_Result_MonthlyFootnote"),
        },
        {
          label: t("Tool_rent_receipt_Result_Months"),
          value: String(r.months),
          footnote: t("Tool_rent_receipt_Result_MonthsFootnote"),
        },
      ],
      breakdownRows: r.rows.map((row) => ({
        cells: {
          month: t("Tool_rent_receipt_MonthLabel", String(row.monthIndex)),
          amount: inr(row.amount),
        },
      })),
    };
  }, [monthlyRent, months, landlordName, tenantName, propertyAddress, t]);

  return (
    <ToolPageShell
      title={t(tool.titleKey)}
      subtitle={t("Tool_rent_receipt_Subtitle")}
      description={t(tool.descriptionKey)}
      icon={tool.icon}
      educate={
        <>
          <div className="fy-info-box">
            <strong>{t("Common_WhatYouLearn")}</strong>
            <p>{t("Tool_rent_receipt_LearnText")}</p>
          </div>
          <FormulaCard
            title={t("Common_Formula")}
            code={"totalRent = monthlyRent × months"}
            note={t("Tool_rent_receipt_FormulaNote")}
          />
        </>
      }
      below={<ToolInfoPanel info={rentReceiptInfo(t)} />}
    >
      <div className="fy-form-card">
        <h3>{t("Common_YourInputs")}</h3>
        <div className="fy-field">
          <label>{t("Tool_rent_receipt_LabelRent")}</label>
          <input
            type="number"
            min={0}
            step={500}
            inputMode="decimal"
            value={monthlyRent}
            onChange={(e) => setMonthlyRent(Math.max(0, Number(e.target.value) || 0))}
          />
        </div>
        <div className="fy-field">
          <label>{t("Tool_rent_receipt_LabelMonths")}</label>
          <input
            type="number"
            min={1}
            max={120}
            step={1}
            inputMode="numeric"
            value={months}
            onChange={(e) => setMonths(Math.max(1, Math.min(120, Number(e.target.value) || 1)))}
          />
        </div>
        <div className="fy-field">
          <label>{t("Tool_rent_receipt_LabelLandlord")}</label>
          <input
            type="text"
            value={landlordName}
            onChange={(e) => setLandlordName(e.target.value)}
            placeholder={t("Tool_rent_receipt_PlaceholderOptional")}
          />
        </div>
        <div className="fy-field">
          <label>{t("Tool_rent_receipt_LabelTenant")}</label>
          <input
            type="text"
            value={tenantName}
            onChange={(e) => setTenantName(e.target.value)}
            placeholder={t("Tool_rent_receipt_PlaceholderOptional")}
          />
        </div>
        <div className="fy-field">
          <label>{t("Tool_rent_receipt_LabelAddress")}</label>
          <input
            type="text"
            value={propertyAddress}
            onChange={(e) => setPropertyAddress(e.target.value)}
            placeholder={t("Tool_rent_receipt_PlaceholderOptional")}
          />
        </div>
        <button type="button" className="fy-btn-calc">
          {t("Common_Calculate")}
        </button>
      </div>

      {(result.landlordName || result.tenantName || result.propertyAddress) && (
        <div className="fy-info-box">
          <strong>{t("Tool_rent_receipt_SummaryTitle")}</strong>
          {result.landlordName ? (
            <p>{t("Tool_rent_receipt_SummaryLandlord", result.landlordName)}</p>
          ) : null}
          {result.tenantName ? <p>{t("Tool_rent_receipt_SummaryTenant", result.tenantName)}</p> : null}
          {result.propertyAddress ? (
            <p>{t("Tool_rent_receipt_SummaryAddress", result.propertyAddress)}</p>
          ) : null}
        </div>
      )}

      <div className="fy-info-box fy-tax-verdict">
        <strong>{t("Tool_rent_receipt_HraTipTitle")}</strong>
        <p>
          {t("Tool_rent_receipt_HraTipBody")}{" "}
          <Link href="/calc/hra">{t("Tool_rent_receipt_HraTipLink")}</Link>
        </p>
      </div>

      <ResultSummaryCards cards={summaryCards} />
      <BreakdownTable
        title={t("Tool_rent_receipt_BreakdownTitle")}
        subtitle={t("Tool_rent_receipt_BreakdownSubtitle")}
        columns={breakdownColumns}
        rows={breakdownRows}
      />
      <WorkedExample
        title={t("Tool_rent_receipt_ExampleTitle")}
        subtitle={t("Tool_rent_receipt_ExampleSubtitle")}
        steps={exampleSteps}
      />
    </ToolPageShell>
  );
}
