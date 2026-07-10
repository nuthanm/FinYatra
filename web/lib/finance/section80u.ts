/**
 * Section 80U — disability deduction for self (educational, old regime).
 * ₹75,000 (disability) / ₹1,25,000 (severe disability).
 */

export const SECTION_80U_LIMIT = 75_000;
export const SECTION_80U_SEVERE_LIMIT = 1_25_000;

export type Section80uInput = {
  /** Severe disability (≥80%) → higher fixed deduction. */
  isSevere: boolean;
  taxSlabPercent: number;
};

export type Section80uResult = {
  isSevere: boolean;
  limit: number;
  eligibleDeduction: number;
  estimatedTaxSaving: number;
};

export function section80uLimit(isSevere: boolean): number {
  return isSevere ? SECTION_80U_SEVERE_LIMIT : SECTION_80U_LIMIT;
}

export function calculateSection80u(input: Section80uInput): Section80uResult {
  const isSevere = Boolean(input.isSevere);
  const limit = section80uLimit(isSevere);
  const slab = Math.min(42, Math.max(0, input.taxSlabPercent)) / 100;

  return {
    isSevere,
    limit,
    eligibleDeduction: limit,
    estimatedTaxSaving: limit * slab,
  };
}
