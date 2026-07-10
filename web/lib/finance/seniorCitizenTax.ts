/**
 * Senior / super-senior tax education: higher basic exemption + 87A rebate vs regular.
 * Simplified old-regime-style slabs — educational only.
 */

export type SeniorTaxCategory = "regular" | "senior" | "super-senior";

export type SeniorCitizenTaxInput = {
  /** Gross / taxable income before basic exemption (₹). */
  income: number;
  category: SeniorTaxCategory;
};

export type SeniorCitizenTaxResult = {
  income: number;
  category: SeniorTaxCategory;
  basicExemption: number;
  taxableIncome: number;
  taxBeforeRebate: number;
  rebate87A: number;
  taxAfterRebate: number;
  /** Same income taxed as a regular (non-senior) taxpayer. */
  regularTaxAfterRebate: number;
  /** Tax saved vs regular due to higher exemption / rebate path. */
  savingVsRegular: number;
  rebateEligible: boolean;
};

/** Old-regime style basic exemption limits. */
export const BASIC_EXEMPTION: Record<SeniorTaxCategory, number> = {
  regular: 250_000,
  senior: 300_000,
  "super-senior": 500_000,
};

/** Section 87A (old-regime framing): rebate if total income ≤ ₹5 lakh. */
export const REBATE_87A_INCOME_LIMIT = 500_000;
export const REBATE_87A_MAX = 12_500;

function slabTaxOnTaxable(taxable: number): number {
  // Educational: apply 5%/20%/30% bands on income above basic exemption.
  let tax = 0;
  const bands = [
    { width: 250_000, rate: 0.05 },
    { width: 500_000, rate: 0.2 },
    { width: Infinity, rate: 0.3 },
  ];
  let remaining = Math.max(0, taxable);
  for (const band of bands) {
    if (remaining <= 0) break;
    const take = Math.min(remaining, band.width === Infinity ? remaining : band.width);
    tax += take * band.rate;
    remaining -= take;
  }
  return tax;
}

function taxFor(income: number, category: SeniorTaxCategory): {
  basicExemption: number;
  taxableIncome: number;
  taxBeforeRebate: number;
  rebate87A: number;
  taxAfterRebate: number;
  rebateEligible: boolean;
} {
  const basicExemption = BASIC_EXEMPTION[category];
  const taxableIncome = Math.max(0, income - basicExemption);
  const taxBeforeRebate = slabTaxOnTaxable(taxableIncome);
  const rebateEligible = income <= REBATE_87A_INCOME_LIMIT;
  const rebate87A = rebateEligible ? Math.min(taxBeforeRebate, REBATE_87A_MAX) : 0;
  return {
    basicExemption,
    taxableIncome,
    taxBeforeRebate,
    rebate87A,
    taxAfterRebate: Math.max(0, taxBeforeRebate - rebate87A),
    rebateEligible,
  };
}

export function calculateSeniorCitizenTax(input: SeniorCitizenTaxInput): SeniorCitizenTaxResult {
  const income = Math.max(0, input.income);
  const category = input.category;
  const own = taxFor(income, category);
  const regular = taxFor(income, "regular");

  return {
    income,
    category,
    basicExemption: own.basicExemption,
    taxableIncome: own.taxableIncome,
    taxBeforeRebate: own.taxBeforeRebate,
    rebate87A: own.rebate87A,
    taxAfterRebate: own.taxAfterRebate,
    regularTaxAfterRebate: regular.taxAfterRebate,
    savingVsRegular: Math.max(0, regular.taxAfterRebate - own.taxAfterRebate),
    rebateEligible: own.rebateEligible,
  };
}
