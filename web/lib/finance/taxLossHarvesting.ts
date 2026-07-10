/** Tax-loss harvesting set-off (simplified India STCL/LTCL rules, educational). */

export type TaxLossHarvestingInput = {
  shortTermGains: number;
  longTermGains: number;
  shortTermLosses: number;
  longTermLosses: number;
  /** Rate applied to remaining STCG (equity often 20%). */
  stcgRatePercent: number;
  /** Rate applied to remaining LTCG (often 12.5%). */
  ltcgRatePercent: number;
};

export type TaxLossHarvestingResult = {
  shortTermGains: number;
  longTermGains: number;
  shortTermLosses: number;
  longTermLosses: number;
  /** STCL used against STCG. */
  stclAgainstStcg: number;
  /** Remaining STCL used against LTCG. */
  stclAgainstLtcg: number;
  /** LTCL used against LTCG only. */
  ltclAgainstLtcg: number;
  netStcg: number;
  netLtcg: number;
  carryForwardStcl: number;
  carryForwardLtcl: number;
  estimatedTaxWithoutHarvest: number;
  estimatedTaxAfterHarvest: number;
  taxSaved: number;
};

export function calculateTaxLossHarvesting(
  input: TaxLossHarvestingInput,
): TaxLossHarvestingResult {
  const shortTermGains = Math.max(0, input.shortTermGains);
  const longTermGains = Math.max(0, input.longTermGains);
  const shortTermLosses = Math.max(0, input.shortTermLosses);
  const longTermLosses = Math.max(0, input.longTermLosses);
  const stcgRate = Math.min(42, Math.max(0, input.stcgRatePercent)) / 100;
  const ltcgRate = Math.min(42, Math.max(0, input.ltcgRatePercent)) / 100;

  // 1) STCL → STCG first
  const stclAgainstStcg = Math.min(shortTermLosses, shortTermGains);
  let stclLeft = shortTermLosses - stclAgainstStcg;
  const netStcg = shortTermGains - stclAgainstStcg;

  // 2) Remaining STCL → LTCG
  const stclAgainstLtcg = Math.min(stclLeft, longTermGains);
  stclLeft -= stclAgainstLtcg;
  let netLtcg = longTermGains - stclAgainstLtcg;

  // 3) LTCL → LTCG only
  const ltclAgainstLtcg = Math.min(longTermLosses, netLtcg);
  netLtcg -= ltclAgainstLtcg;
  const ltclLeft = longTermLosses - ltclAgainstLtcg;

  const estimatedTaxWithoutHarvest =
    shortTermGains * stcgRate + longTermGains * ltcgRate;
  const estimatedTaxAfterHarvest = netStcg * stcgRate + netLtcg * ltcgRate;
  const taxSaved = Math.max(0, estimatedTaxWithoutHarvest - estimatedTaxAfterHarvest);

  return {
    shortTermGains,
    longTermGains,
    shortTermLosses,
    longTermLosses,
    stclAgainstStcg,
    stclAgainstLtcg,
    ltclAgainstLtcg,
    netStcg,
    netLtcg,
    carryForwardStcl: stclLeft,
    carryForwardLtcl: ltclLeft,
    estimatedTaxWithoutHarvest,
    estimatedTaxAfterHarvest,
    taxSaved,
  };
}
