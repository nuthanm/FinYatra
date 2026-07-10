/** Quarterly advance-tax schedule (illustrative; no 234B/234C interest). */

export type AdvanceTaxInstallmentId = "jun" | "sep" | "dec" | "mar";

export type AdvanceTaxInstallment = {
  id: AdvanceTaxInstallmentId;
  /** Display label, e.g. 15 Jun. */
  dueLabel: string;
  /** Month (1–12) and day of due date within the financial year. */
  month: number;
  day: number;
  /** Cumulative % of estimated annual tax that should be paid by this date. */
  cumulativePct: number;
  /** Incremental % due in this installment (vs previous cumulative). */
  installmentPct: number;
};

export const ADVANCE_TAX_SCHEDULE: AdvanceTaxInstallment[] = [
  { id: "jun", dueLabel: "15 Jun", month: 6, day: 15, cumulativePct: 15, installmentPct: 15 },
  { id: "sep", dueLabel: "15 Sep", month: 9, day: 15, cumulativePct: 45, installmentPct: 30 },
  { id: "dec", dueLabel: "15 Dec", month: 12, day: 15, cumulativePct: 75, installmentPct: 30 },
  { id: "mar", dueLabel: "15 Mar", month: 3, day: 15, cumulativePct: 100, installmentPct: 25 },
];

export type AdvanceTaxInput = {
  estimatedTax: number;
  taxAlreadyPaid: number;
  selectedInstallment: AdvanceTaxInstallmentId;
};

export type AdvanceTaxScheduleRow = {
  id: AdvanceTaxInstallmentId;
  dueLabel: string;
  cumulativePct: number;
  installmentPct: number;
  cumulativeDue: number;
  installmentAmount: number;
};

export type AdvanceTaxResult = {
  estimatedTax: number;
  taxAlreadyPaid: number;
  remainingTax: number;
  selected: AdvanceTaxInstallment;
  requiredBySelected: number;
  shortfall: number;
  surplus: number;
  suggestedThisInstallment: number;
  schedule: AdvanceTaxScheduleRow[];
};

/** Pick the current / next installment based on calendar date (FY Apr–Mar). */
export function installmentFromDate(date: Date): AdvanceTaxInstallmentId {
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const md = month * 100 + day;

  // Apr 1 – Jun 15 → Jun; Jun 16 – Sep 15 → sep; Sep 16 – Dec 15 → dec; Dec 16 – Mar 31 → mar
  if (md >= 401 && md <= 615) return "jun";
  if (md >= 616 && md <= 915) return "sep";
  if (md >= 916 && md <= 1215) return "dec";
  return "mar";
}

export function getAdvanceTaxInstallment(id: AdvanceTaxInstallmentId): AdvanceTaxInstallment {
  return ADVANCE_TAX_SCHEDULE.find((s) => s.id === id) ?? ADVANCE_TAX_SCHEDULE[0]!;
}

export function calculateAdvanceTax(input: AdvanceTaxInput): AdvanceTaxResult {
  const estimatedTax = Math.max(0, input.estimatedTax);
  const taxAlreadyPaid = Math.max(0, input.taxAlreadyPaid);
  const remainingTax = Math.max(0, estimatedTax - taxAlreadyPaid);
  const selected = getAdvanceTaxInstallment(input.selectedInstallment);

  const schedule: AdvanceTaxScheduleRow[] = ADVANCE_TAX_SCHEDULE.map((row) => ({
    id: row.id,
    dueLabel: row.dueLabel,
    cumulativePct: row.cumulativePct,
    installmentPct: row.installmentPct,
    cumulativeDue: (estimatedTax * row.cumulativePct) / 100,
    installmentAmount: (estimatedTax * row.installmentPct) / 100,
  }));

  const requiredBySelected = (estimatedTax * selected.cumulativePct) / 100;
  const shortfall = Math.max(0, requiredBySelected - taxAlreadyPaid);
  const surplus = Math.max(0, taxAlreadyPaid - requiredBySelected);
  const suggestedThisInstallment = shortfall;

  return {
    estimatedTax,
    taxAlreadyPaid,
    remainingTax,
    selected,
    requiredBySelected,
    shortfall,
    surplus,
    suggestedThisInstallment,
    schedule,
  };
}
