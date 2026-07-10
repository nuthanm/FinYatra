/**
 * Post Office Savings Account — deposit × rate with compounding (educational).
 * Confirm current rates with India Post / NSI.
 */

export const POST_OFFICE_SAVINGS_DEFAULT_RATE = 4.0;

export type PostOfficeSavingsCompounding = "annual" | "quarterly" | "monthly";

export type PostOfficeSavingsInput = {
  deposit: number;
  annualRatePercent: number;
  years: number;
  compounding: PostOfficeSavingsCompounding;
};

export type PostOfficeSavingsResult = {
  deposit: number;
  annualRatePercent: number;
  years: number;
  compounding: PostOfficeSavingsCompounding;
  compoundsPerYear: number;
  maturityAmount: number;
  totalInterest: number;
};

const FREQ: Record<PostOfficeSavingsCompounding, number> = {
  annual: 1,
  quarterly: 4,
  monthly: 12,
};

/**
 * A = P × (1 + r/n)^(n×t)
 */
export function calculatePostOfficeSavings(input: PostOfficeSavingsInput): PostOfficeSavingsResult {
  const deposit = Math.max(0, input.deposit);
  const annualRatePercent = Math.max(0, input.annualRatePercent);
  const years = Math.max(0, input.years);
  const compounding = input.compounding;
  const n = FREQ[compounding];
  const r = annualRatePercent / 100;

  const maturityAmount =
    deposit > 0 && years > 0 ? deposit * Math.pow(1 + r / n, n * years) : deposit;
  const totalInterest = Math.max(0, maturityAmount - deposit);

  return {
    deposit,
    annualRatePercent,
    years,
    compounding,
    compoundsPerYear: n,
    maturityAmount,
    totalInterest,
  };
}
