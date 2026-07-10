/**
 * Section 80TTA / 80TTB — savings / deposit interest deduction (educational, old regime).
 * 80TTA: up to ₹10,000 (non-senior). 80TTB: up to ₹50,000 (senior citizen).
 */

export const SECTION_80TTA_LIMIT = 10_000;
export const SECTION_80TTB_LIMIT = 50_000;

export type Section80ttaInput = {
  savingsInterest: number;
  /** When true, apply 80TTB ₹50k cap instead of 80TTA ₹10k. */
  isSenior: boolean;
  taxSlabPercent: number;
};

export type Section80ttaResult = {
  savingsInterest: number;
  isSenior: boolean;
  limit: number;
  sectionLabel: "80TTA" | "80TTB";
  eligibleDeduction: number;
  taxableInterest: number;
  estimatedTaxSaving: number;
  unusedLimit: number;
};

export function section80ttaLimit(isSenior: boolean): number {
  return isSenior ? SECTION_80TTB_LIMIT : SECTION_80TTA_LIMIT;
}

export function calculateSection80tta(input: Section80ttaInput): Section80ttaResult {
  const savingsInterest = Math.max(0, input.savingsInterest);
  const isSenior = input.isSenior;
  const limit = section80ttaLimit(isSenior);
  const eligibleDeduction = Math.min(savingsInterest, limit);
  const taxableInterest = Math.max(0, savingsInterest - eligibleDeduction);
  const slab = Math.min(42, Math.max(0, input.taxSlabPercent)) / 100;
  const estimatedTaxSaving = eligibleDeduction * slab;

  return {
    savingsInterest,
    isSenior,
    limit,
    sectionLabel: isSenior ? "80TTB" : "80TTA",
    eligibleDeduction,
    taxableInterest,
    estimatedTaxSaving,
    unusedLimit: Math.max(0, limit - eligibleDeduction),
  };
}
