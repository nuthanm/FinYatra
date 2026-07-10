/**
 * PMAY interest subsidy (CLSS-style) — simplified educational estimate by income category.
 */

export type PmayCategory = "ews" | "lig" | "mig1" | "mig2";

export type PmaySubsidyInput = {
  loanAmount: number;
  category: PmayCategory;
  /** Loan tenure in years (capped per category defaults). */
  tenureYears?: number;
};

export type PmaySubsidyResult = {
  loanAmount: number;
  category: PmayCategory;
  eligibleLoanCap: number;
  subsidyRatePercent: number;
  tenureYears: number;
  /** Loan amount used for subsidy (min of loan and cap). */
  subsidisedLoan: number;
  /** Simplified NPV-style interest subsidy estimate. */
  estimatedSubsidy: number;
};

/** Illustrative CLSS-style caps and rates. */
export const PMAY_RULES: Record<
  PmayCategory,
  { loanCap: number; subsidyRatePercent: number; maxTenureYears: number }
> = {
  ews: { loanCap: 600_000, subsidyRatePercent: 6.5, maxTenureYears: 20 },
  lig: { loanCap: 600_000, subsidyRatePercent: 6.5, maxTenureYears: 20 },
  mig1: { loanCap: 900_000, subsidyRatePercent: 4, maxTenureYears: 20 },
  mig2: { loanCap: 1_200_000, subsidyRatePercent: 3, maxTenureYears: 20 },
};

/**
 * Simplified subsidy ≈ PV of interest differential on subsidised loan.
 * Uses: subsidy ≈ loan × rate% × (1 − (1+r)^−n) / r with r = rate/100 (educational).
 * Falls back to loan × rate% × n / 2 when rate is 0.
 */
export function calculatePmaySubsidy(input: PmaySubsidyInput): PmaySubsidyResult {
  const loanAmount = Math.max(0, input.loanAmount);
  const category = input.category;
  const rules = PMAY_RULES[category];
  const tenureYears = Math.min(
    rules.maxTenureYears,
    Math.max(1, input.tenureYears ?? rules.maxTenureYears),
  );
  const subsidisedLoan = Math.min(loanAmount, rules.loanCap);
  const r = rules.subsidyRatePercent / 100;
  let estimatedSubsidy = 0;
  if (subsidisedLoan > 0 && r > 0) {
    estimatedSubsidy = (subsidisedLoan * r * (1 - Math.pow(1 + r, -tenureYears))) / r;
  } else if (subsidisedLoan > 0) {
    estimatedSubsidy = (subsidisedLoan * rules.subsidyRatePercent * tenureYears) / 200;
  }

  return {
    loanAmount,
    category,
    eligibleLoanCap: rules.loanCap,
    subsidyRatePercent: rules.subsidyRatePercent,
    tenureYears,
    subsidisedLoan,
    estimatedSubsidy,
  };
}
