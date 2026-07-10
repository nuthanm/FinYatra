/**
 * NPS withdrawal at exit — lump % (max 60%) + annuity corpus (educational).
 * At normal retirement, lump up to 60% is tax-free; annuity purchase is mandatory for the rest.
 */

export const NPS_MAX_LUMP_PERCENT = 60;
/** Illustrative annuity payout rate (% of annuity corpus per year). */
export const NPS_DEFAULT_ANNUITY_RATE = 6;

export type NpsWithdrawalInput = {
  corpus: number;
  /** Desired lump-sum % of corpus (capped at 60). */
  lumpPercent: number;
  /** Assumed annual annuity payout rate (%). */
  annuityRatePercent?: number;
  /** Optional slab % to estimate tax if lump were taxable (educational). */
  taxSlabPercent?: number;
};

export type NpsWithdrawalResult = {
  corpus: number;
  lumpPercent: number;
  lumpAmount: number;
  annuityCorpus: number;
  /** Illustrative annual pension from annuity corpus. */
  estimatedAnnualAnnuity: number;
  estimatedMonthlyAnnuity: number;
  /**
   * Educational: at normal exit lump ≤60% is tax-free → 0.
   * If user enters >60%, excess is treated as potentially taxable.
   */
  taxableLumpEstimate: number;
  estimatedTaxOnExcess: number;
};

export function calculateNpsWithdrawal(input: NpsWithdrawalInput): NpsWithdrawalResult {
  const corpus = Math.max(0, input.corpus);
  const requested = Math.max(0, input.lumpPercent);
  const lumpPercent = Math.min(NPS_MAX_LUMP_PERCENT, requested);
  const lumpAmount = (corpus * lumpPercent) / 100;
  const annuityCorpus = Math.max(0, corpus - lumpAmount);
  const annuityRate = Math.max(0, input.annuityRatePercent ?? NPS_DEFAULT_ANNUITY_RATE) / 100;
  const estimatedAnnualAnnuity = annuityCorpus * annuityRate;
  const excessPercent = Math.max(0, requested - NPS_MAX_LUMP_PERCENT);
  const taxableLumpEstimate = (corpus * excessPercent) / 100;
  const slab = Math.min(42, Math.max(0, input.taxSlabPercent ?? 20)) / 100;
  const estimatedTaxOnExcess = taxableLumpEstimate * slab;

  return {
    corpus,
    lumpPercent,
    lumpAmount,
    annuityCorpus,
    estimatedAnnualAnnuity,
    estimatedMonthlyAnnuity: estimatedAnnualAnnuity / 12,
    taxableLumpEstimate,
    estimatedTaxOnExcess,
  };
}
