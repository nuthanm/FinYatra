/** Section 80C planner — ₹1.5 lakh cap (old regime). */

export const SECTION_80C_LIMIT = 150_000;

export type Section80cInput = {
  epf: number;
  ppf: number;
  elss: number;
  lifeInsurance: number;
  homeLoanPrincipal: number;
  nsc: number;
  taxSavingFd: number;
  tuitionFees: number;
  other: number;
  taxSlabPercent: number;
};

export type Section80cResult = {
  totalInvested: number;
  eligibleDeduction: number;
  unusedLimit: number;
  overLimit: number;
  estimatedTaxSaving: number;
  breakdown: { key: string; amount: number }[];
};

export function calculateSection80c(input: Section80cInput): Section80cResult {
  const items: { key: string; amount: number }[] = [
    { key: "epf", amount: Math.max(0, input.epf) },
    { key: "ppf", amount: Math.max(0, input.ppf) },
    { key: "elss", amount: Math.max(0, input.elss) },
    { key: "lifeInsurance", amount: Math.max(0, input.lifeInsurance) },
    { key: "homeLoanPrincipal", amount: Math.max(0, input.homeLoanPrincipal) },
    { key: "nsc", amount: Math.max(0, input.nsc) },
    { key: "taxSavingFd", amount: Math.max(0, input.taxSavingFd) },
    { key: "tuitionFees", amount: Math.max(0, input.tuitionFees) },
    { key: "other", amount: Math.max(0, input.other) },
  ];
  const totalInvested = items.reduce((s, i) => s + i.amount, 0);
  const eligibleDeduction = Math.min(SECTION_80C_LIMIT, totalInvested);
  const unusedLimit = Math.max(0, SECTION_80C_LIMIT - totalInvested);
  const overLimit = Math.max(0, totalInvested - SECTION_80C_LIMIT);
  const slab = Math.min(42, Math.max(0, input.taxSlabPercent)) / 100;
  const estimatedTaxSaving = eligibleDeduction * slab;

  return {
    totalInvested,
    eligibleDeduction,
    unusedLimit,
    overLimit,
    estimatedTaxSaving,
    breakdown: items.filter((i) => i.amount > 0),
  };
}
