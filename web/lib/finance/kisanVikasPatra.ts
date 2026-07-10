/** Kisan Vikas Patra — money doubles over a notified tenure (illustrative). */

export const KVP_DEFAULT_RATE = 7.5;
/** Official-style tenure at ~7.5%: money doubles in 115 months. */
export const KVP_DEFAULT_MONTHS = 115;

export type KvpResult = {
  principal: number;
  ratePercent: number;
  tenureMonths: number;
  tenureYears: number;
  maturity: number;
  interest: number;
};

/**
 * Tenure months from rate so that principal roughly doubles:
 * at 7.5% → 115 months; otherwise months ≈ 12 × ln(2) / ln(1 + r).
 * Maturity is always 2 × principal (KVP doubles your money).
 */
export function kvpTenureMonths(annualRatePercent: number): number {
  const r = Math.max(0, annualRatePercent);
  if (r <= 0) return 0;
  if (Math.abs(r - KVP_DEFAULT_RATE) < 0.05) return KVP_DEFAULT_MONTHS;
  return Math.round((12 * Math.log(2)) / Math.log(1 + r / 100));
}

export function calculateKvp(principal: number, annualRatePercent = KVP_DEFAULT_RATE): KvpResult {
  const p = Math.max(0, principal);
  const rate = Math.max(0, annualRatePercent);
  const tenureMonths = kvpTenureMonths(rate);
  const maturity = 2 * p;

  return {
    principal: p,
    ratePercent: rate,
    tenureMonths,
    tenureYears: tenureMonths / 12,
    maturity,
    interest: maturity - p,
  };
}
