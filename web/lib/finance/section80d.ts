/** Section 80D — health insurance premium deduction (illustrative old regime). */

export const SECTION_80D_BASE_LIMIT = 25_000;
export const SECTION_80D_SENIOR_LIMIT = 50_000;
export const SECTION_80D_PREVENTIVE_CAP = 5_000;

export type Section80dInput = {
  selfFamilyPremium: number;
  parentsPremium: number;
  preventiveCheckup: number;
  selfSenior: boolean;
  parentsSenior: boolean;
  taxSlabPercent: number;
};

export type Section80dResult = {
  selfLimit: number;
  parentsLimit: number;
  preventiveEligible: number;
  selfEligible: number;
  parentsEligible: number;
  eligibleDeduction: number;
  estimatedTaxSaving: number;
  unusedSelf: number;
  unusedParents: number;
};

export function section80dLimit(senior: boolean): number {
  return senior ? SECTION_80D_SENIOR_LIMIT : SECTION_80D_BASE_LIMIT;
}

/**
 * Preventive checkup (capped at ₹5,000) counts within the self/family limit — not over it.
 * Parents premium has a separate limit (₹25k / ₹50k if senior parents).
 */
export function calculateSection80d(input: Section80dInput): Section80dResult {
  const selfPremium = Math.max(0, input.selfFamilyPremium);
  const parentsPremium = Math.max(0, input.parentsPremium);
  const preventive = Math.max(0, input.preventiveCheckup);
  const selfLimit = section80dLimit(input.selfSenior);
  const parentsLimit = section80dLimit(input.parentsSenior);

  const preventiveEligible = Math.min(preventive, SECTION_80D_PREVENTIVE_CAP);
  const selfGross = selfPremium + preventiveEligible;
  const selfEligible = Math.min(selfGross, selfLimit);
  const parentsEligible = Math.min(parentsPremium, parentsLimit);
  const eligibleDeduction = selfEligible + parentsEligible;

  const slab = Math.min(42, Math.max(0, input.taxSlabPercent)) / 100;
  const estimatedTaxSaving = eligibleDeduction * slab;

  return {
    selfLimit,
    parentsLimit,
    preventiveEligible,
    selfEligible,
    parentsEligible,
    eligibleDeduction,
    estimatedTaxSaving,
    unusedSelf: Math.max(0, selfLimit - selfEligible),
    unusedParents: Math.max(0, parentsLimit - parentsEligible),
  };
}
