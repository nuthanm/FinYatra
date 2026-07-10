/** Senior Citizen Savings Scheme — quarterly interest payout. */

export const SCSS_DEFAULT_RATE = 8.2;
export const SCSS_MAX_DEPOSIT = 3_000_000;
export const SCSS_TENURE_YEARS = 5;

export type ScssResult = {
  deposit: number;
  quarterlyInterest: number;
  annualInterest: number;
  totalInterest: number;
  maturityAmount: number;
  effectiveMonthly: number;
};

/**
 * SCSS pays interest quarterly; principal returned at maturity (not compounded into corpus).
 */
export function calculateScss(
  deposit: number,
  annualRatePercent: number,
  years = SCSS_TENURE_YEARS,
): ScssResult {
  const d = Math.min(Math.max(0, deposit), SCSS_MAX_DEPOSIT);
  const rate = Math.max(0, annualRatePercent) / 100;
  const y = Math.max(0, years);

  const annualInterest = d * rate;
  const quarterlyInterest = annualInterest / 4;
  const totalInterest = annualInterest * y;

  return {
    deposit: d,
    quarterlyInterest,
    annualInterest,
    totalInterest,
    maturityAmount: d, // principal returned; interest already paid out
    effectiveMonthly: annualInterest / 12,
  };
}
