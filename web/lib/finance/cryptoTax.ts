/** India VDA (crypto) tax — Section 115BBH / 194S style (illustrative). */

export const CRYPTO_TAX_RATE_PERCENT = 30;
export const CRYPTO_TDS_RATE_PERCENT = 1;
/** Illustrative 194S threshold for individuals (₹). */
export const CRYPTO_TDS_THRESHOLD = 50_000;

export type CryptoTaxInput = {
  buyValue: number;
  sellValue: number;
  /** When true, estimate 1% TDS on sell if above threshold. */
  includeTds: boolean;
};

export type CryptoTaxResult = {
  gain: number;
  taxableGain: number;
  taxAmount: number;
  taxRatePercent: number;
  tdsAmount: number;
  tdsApplies: boolean;
  tdsThreshold: number;
  /** Tax + TDS (TDS is usually credit, shown separately for planning). */
  totalOutflowEstimate: number;
  isLoss: boolean;
};

export function calculateCryptoTax(input: CryptoTaxInput): CryptoTaxResult {
  const buy = Math.max(0, input.buyValue);
  const sell = Math.max(0, input.sellValue);
  const gain = sell - buy;
  const taxableGain = Math.max(0, gain);
  const taxAmount = (taxableGain * CRYPTO_TAX_RATE_PERCENT) / 100;
  const tdsApplies = input.includeTds && sell > CRYPTO_TDS_THRESHOLD;
  const tdsAmount = tdsApplies ? (sell * CRYPTO_TDS_RATE_PERCENT) / 100 : 0;

  return {
    gain,
    taxableGain,
    taxAmount,
    taxRatePercent: CRYPTO_TAX_RATE_PERCENT,
    tdsAmount,
    tdsApplies,
    tdsThreshold: CRYPTO_TDS_THRESHOLD,
    totalOutflowEstimate: taxAmount + tdsAmount,
    isLoss: gain < 0,
  };
}
