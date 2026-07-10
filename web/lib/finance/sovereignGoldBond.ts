/** Sovereign Gold Bond (SGB) returns — educational. */

export type SovereignGoldBondInput = {
  /** Grams of gold (1 unit = 1 gram). */
  grams: number;
  /** Issue price ₹ per gram. */
  issuePricePerGram: number;
  /** Tenure in years (SGB is typically 8 years). */
  years?: number;
  /** Annual interest on issue price (default 2.5%). */
  annualInterestPercent?: number;
  /** Assumed gold price at redemption ₹/gram (for capital gains education). */
  redemptionPricePerGram?: number;
};

export type SovereignGoldBondResult = {
  grams: number;
  issuePricePerGram: number;
  invested: number;
  years: number;
  annualInterestPercent: number;
  /** Total interest over tenure (paid semi-annually in practice). */
  totalInterest: number;
  annualInterest: number;
  redemptionPricePerGram: number;
  redemptionValue: number;
  /** Capital gain at redemption (educational; SGB held to maturity is tax-free for individuals). */
  capitalGain: number;
  /** Invested + total interest + capital gain. */
  totalReturn: number;
};

export const SGB_DEFAULT_YEARS = 8;
export const SGB_ANNUAL_INTEREST_PERCENT = 2.5;

/**
 * SGB: 2.5% p.a. on issue price for 8 years; redemption at prevailing gold price.
 * Capital gains on maturity for individuals are tax-free (educational note).
 */
export function calculateSovereignGoldBond(input: SovereignGoldBondInput): SovereignGoldBondResult {
  const grams = Math.max(0, input.grams);
  const issuePrice = Math.max(0, input.issuePricePerGram);
  const years = Math.max(0, input.years ?? SGB_DEFAULT_YEARS);
  const interestPct = Math.max(0, input.annualInterestPercent ?? SGB_ANNUAL_INTEREST_PERCENT);
  const redemptionPrice = Math.max(0, input.redemptionPricePerGram ?? issuePrice);

  const invested = grams * issuePrice;
  const annualInterest = invested * (interestPct / 100);
  const totalInterest = annualInterest * years;
  const redemptionValue = grams * redemptionPrice;
  const capitalGain = redemptionValue - invested;
  const totalReturn = invested + totalInterest + capitalGain;

  return {
    grams,
    issuePricePerGram: issuePrice,
    invested,
    years,
    annualInterestPercent: interestPct,
    totalInterest,
    annualInterest,
    redemptionPricePerGram: redemptionPrice,
    redemptionValue,
    capitalGain,
    totalReturn,
  };
}
