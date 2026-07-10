/**
 * Section 80DDB — deduction for specified disease medical expenses (educational, old regime).
 * Limit ₹40,000 (non-senior) / ₹1,00,000 (senior / very senior).
 */

export const SECTION_80DDB_LIMIT = 40_000;
export const SECTION_80DDB_SENIOR_LIMIT = 1_00_000;

export type Section80ddbInput = {
  medicalExpense: number;
  isSenior: boolean;
  taxSlabPercent: number;
};

export type Section80ddbResult = {
  medicalExpense: number;
  isSenior: boolean;
  limit: number;
  eligibleDeduction: number;
  excessExpense: number;
  estimatedTaxSaving: number;
};

export function section80ddbLimit(isSenior: boolean): number {
  return isSenior ? SECTION_80DDB_SENIOR_LIMIT : SECTION_80DDB_LIMIT;
}

export function calculateSection80ddb(input: Section80ddbInput): Section80ddbResult {
  const medicalExpense = Math.max(0, input.medicalExpense);
  const isSenior = Boolean(input.isSenior);
  const limit = section80ddbLimit(isSenior);
  const eligibleDeduction = Math.min(medicalExpense, limit);
  const excessExpense = Math.max(0, medicalExpense - eligibleDeduction);
  const slab = Math.min(42, Math.max(0, input.taxSlabPercent)) / 100;

  return {
    medicalExpense,
    isSenior,
    limit,
    eligibleDeduction,
    excessExpense,
    estimatedTaxSaving: eligibleDeduction * slab,
  };
}
