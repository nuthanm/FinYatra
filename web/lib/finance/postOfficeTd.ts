/**
 * Post Office Time Deposit — illustrative rates, quarterly compounding (educational).
 * Confirm current rates with India Post / NSI.
 */

export type PostOfficeTdTenure = 1 | 2 | 3 | 5;

/** Illustrative annual rates (% p.a.) by tenure. */
export const POST_OFFICE_TD_RATES: Record<PostOfficeTdTenure, number> = {
  1: 6.9,
  2: 7.0,
  3: 7.1,
  5: 7.5,
};

export const POST_OFFICE_TD_TENURES: PostOfficeTdTenure[] = [1, 2, 3, 5];

export type PostOfficeTdInput = {
  deposit: number;
  tenureYears: PostOfficeTdTenure;
  /** Override rate; defaults to table rate for tenure. */
  annualRatePercent?: number;
};

export type PostOfficeTdResult = {
  deposit: number;
  tenureYears: PostOfficeTdTenure;
  annualRatePercent: number;
  maturityAmount: number;
  totalInterest: number;
  effectiveYieldPercent: number;
};

/**
 * Quarterly compounding: A = P × (1 + r/4)^(4×t)
 */
export function calculatePostOfficeTd(input: PostOfficeTdInput): PostOfficeTdResult {
  const deposit = Math.max(0, input.deposit);
  const tenureYears = input.tenureYears;
  const annualRatePercent =
    input.annualRatePercent !== undefined
      ? Math.max(0, input.annualRatePercent)
      : POST_OFFICE_TD_RATES[tenureYears];

  const r = annualRatePercent / 100;
  const n = 4;
  const t = tenureYears;
  const maturityAmount = deposit > 0 && t > 0 ? deposit * Math.pow(1 + r / n, n * t) : deposit;
  const totalInterest = Math.max(0, maturityAmount - deposit);
  const effectiveYieldPercent = deposit > 0 ? (totalInterest / deposit) * 100 : 0;

  return {
    deposit,
    tenureYears,
    annualRatePercent,
    maturityAmount,
    totalInterest,
    effectiveYieldPercent,
  };
}

export function postOfficeTdRate(tenure: PostOfficeTdTenure): number {
  return POST_OFFICE_TD_RATES[tenure];
}
