/** Gift tax / income from gifts (educational — Sec 56(2)(x) style). */

export const GIFT_EXEMPTION_THRESHOLD = 50_000;

export type GiftTaxInput = {
  giftAmount: number;
  /** Gifts from specified relatives are generally exempt. */
  fromRelative: boolean;
  /** Marginal tax slab % when taxable. */
  taxSlabPercent: number;
};

export type GiftTaxResult = {
  giftAmount: number;
  fromRelative: boolean;
  isTaxable: boolean;
  taxableAmount: number;
  estimatedTax: number;
  taxSlabPercent: number;
  threshold: number;
};

/**
 * Relative gifts → exempt.
 * Non-relative: if aggregate gift > ₹50,000 → entire amount taxable as “income from other sources”
 * (simplified; real rules have property/share nuances).
 */
export function calculateGiftTax(input: GiftTaxInput): GiftTaxResult {
  const giftAmount = Math.max(0, input.giftAmount);
  const taxSlabPercent = Math.min(42, Math.max(0, input.taxSlabPercent));

  if (input.fromRelative) {
    return {
      giftAmount,
      fromRelative: true,
      isTaxable: false,
      taxableAmount: 0,
      estimatedTax: 0,
      taxSlabPercent,
      threshold: GIFT_EXEMPTION_THRESHOLD,
    };
  }

  const isTaxable = giftAmount > GIFT_EXEMPTION_THRESHOLD;
  const taxableAmount = isTaxable ? giftAmount : 0;
  const estimatedTax = (taxableAmount * taxSlabPercent) / 100;

  return {
    giftAmount,
    fromRelative: false,
    isTaxable,
    taxableAmount,
    estimatedTax,
    taxSlabPercent,
    threshold: GIFT_EXEMPTION_THRESHOLD,
  };
}
