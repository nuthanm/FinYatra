/** Section 80G donation deduction (illustrative old regime). */

export type Section80gInput = {
  donationAmount: number;
  /** 50 or 100 — share of donation eligible for deduction. */
  eligibilityPercent: 50 | 100;
  /** When true, deduction base is capped at 10% of annual income (qualifying limit). */
  applyIncomeLimit: boolean;
  annualIncome: number;
  taxSlabPercent: number;
};

export type Section80gResult = {
  donationAmount: number;
  eligibilityPercent: number;
  incomeLimit: number;
  cappedDonation: number;
  eligibleDeduction: number;
  estimatedTaxSaving: number;
  applyIncomeLimit: boolean;
};

export function calculateSection80g(input: Section80gInput): Section80gResult {
  const donationAmount = Math.max(0, input.donationAmount);
  const eligibilityPercent = input.eligibilityPercent === 50 ? 50 : 100;
  const annualIncome = Math.max(0, input.annualIncome);
  const incomeLimit = annualIncome * 0.1;
  const cappedDonation = input.applyIncomeLimit
    ? Math.min(donationAmount, incomeLimit)
    : donationAmount;
  const eligibleDeduction = (cappedDonation * eligibilityPercent) / 100;
  const slab = Math.min(42, Math.max(0, input.taxSlabPercent)) / 100;
  const estimatedTaxSaving = eligibleDeduction * slab;

  return {
    donationAmount,
    eligibilityPercent,
    incomeLimit,
    cappedDonation,
    eligibleDeduction,
    estimatedTaxSaving,
    applyIncomeLimit: input.applyIncomeLimit,
  };
}
