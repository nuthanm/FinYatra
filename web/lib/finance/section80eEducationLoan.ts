/**
 * Section 80E — full interest deduction on education loan (no amount cap).
 * Educational: tax saving = interest × slab% (old regime context).
 */

export const SECTION_80E_MAX_YEARS = 8;

export type Section80eEducationLoanInput = {
  /** Interest paid in the FY (₹). */
  interestPaid: number;
  /** Marginal tax slab %. */
  taxSlabPercent: number;
  /** Years since repayment started (for 8-year window note). */
  yearsSinceRepaymentStart: number;
};

export type Section80eEducationLoanResult = {
  interestPaid: number;
  taxSlabPercent: number;
  deduction: number;
  taxSaving: number;
  yearsSinceRepaymentStart: number;
  withinWindow: boolean;
  windowYearsLeft: number;
};

export function calculateSection80eEducationLoan(
  input: Section80eEducationLoanInput,
): Section80eEducationLoanResult {
  const interestPaid = Math.max(0, input.interestPaid);
  const slab = Math.min(42, Math.max(0, input.taxSlabPercent));
  const years = Math.max(0, Math.floor(input.yearsSinceRepaymentStart));
  const withinWindow = years < SECTION_80E_MAX_YEARS;
  const windowYearsLeft = Math.max(0, SECTION_80E_MAX_YEARS - years);
  const deduction = withinWindow ? interestPaid : 0;
  const taxSaving = (deduction * slab) / 100;

  return {
    interestPaid,
    taxSlabPercent: slab,
    deduction,
    taxSaving,
    yearsSinceRepaymentStart: years,
    withinWindow,
    windowYearsLeft,
  };
}
