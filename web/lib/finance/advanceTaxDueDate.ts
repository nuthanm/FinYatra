import {
  ADVANCE_TAX_SCHEDULE,
  calculateAdvanceTax,
  type AdvanceTaxInstallmentId,
  type AdvanceTaxResult,
  type AdvanceTaxScheduleRow,
} from "@/lib/finance/advanceTax";

/** Advance-tax due-date calendar with remaining tax (wraps advance-tax schedule). */

export type AdvanceTaxDueDateInput = {
  /** Total estimated tax liability for the FY (₹). */
  estimatedTax: number;
  /** Tax already paid (advance + TDS credited toward advance, simplified) (₹). */
  taxAlreadyPaid: number;
  selectedInstallment: AdvanceTaxInstallmentId;
};

export type AdvanceTaxDueDateRow = AdvanceTaxScheduleRow & {
  /** Amount still needed to reach this cumulative milestone. */
  remainingToMilestone: number;
};

export type AdvanceTaxDueDateResult = AdvanceTaxResult & {
  calendar: AdvanceTaxDueDateRow[];
};

export { ADVANCE_TAX_SCHEDULE };

export function calculateAdvanceTaxDueDate(
  input: AdvanceTaxDueDateInput,
): AdvanceTaxDueDateResult {
  const base = calculateAdvanceTax({
    estimatedTax: input.estimatedTax,
    taxAlreadyPaid: input.taxAlreadyPaid,
    selectedInstallment: input.selectedInstallment,
  });

  const calendar: AdvanceTaxDueDateRow[] = base.schedule.map((row) => ({
    ...row,
    remainingToMilestone: Math.max(0, row.cumulativeDue - base.taxAlreadyPaid),
  }));

  return {
    ...base,
    calendar,
  };
}
