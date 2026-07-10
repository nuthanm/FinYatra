/** Mahila Samman Savings Certificate (MSSC) — women savings scheme (illustrative). */

export const MSSC_DEFAULT_RATE = 7.5;
export const MSSC_TENURE_YEARS = 2;
export const MSSC_MAX_DEPOSIT = 200_000;

export type MahilaSammanResult = {
  deposit: number;
  ratePercent: number;
  years: number;
  capped: boolean;
  annualInterest: number;
  totalInterest: number;
  maturity: number;
  quarterlyInterest: number;
};

/**
 * Interest payout on MSSC: simple annual interest × tenure (illustrative).
 * Deposit capped at ₹2 lakh; standard tenure 2 years at ~7.5%.
 */
export function calculateMahilaSamman(
  deposit: number,
  annualRatePercent = MSSC_DEFAULT_RATE,
  years = MSSC_TENURE_YEARS,
): MahilaSammanResult {
  const raw = Math.max(0, deposit);
  const d = Math.min(raw, MSSC_MAX_DEPOSIT);
  const rate = Math.max(0, annualRatePercent) / 100;
  const y = Math.max(0, years);

  const annualInterest = d * rate;
  const totalInterest = annualInterest * y;

  return {
    deposit: d,
    ratePercent: annualRatePercent,
    years: y,
    capped: raw > MSSC_MAX_DEPOSIT,
    annualInterest,
    totalInterest,
    maturity: d + totalInterest,
    quarterlyInterest: annualInterest / 4,
  };
}
