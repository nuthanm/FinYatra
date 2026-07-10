/** Statutory / performance bonus — amount or % of basic (educational). */

export type BonusMode = "percent" | "amount";

export type BonusInput = {
  basicPay: number;
  mode: BonusMode;
  /** Bonus as % of basic when mode = percent. */
  bonusPercent: number;
  /** Fixed bonus when mode = amount. */
  bonusAmount: number;
  /** Optional marginal slab for tax tip. */
  taxSlabPercent?: number;
};

export type BonusResult = {
  basicPay: number;
  mode: BonusMode;
  bonusPercent: number;
  bonusAmount: number;
  bonus: number;
  taxSlabPercent: number;
  estimatedTaxOnBonus: number;
};

export function calculateBonus(input: BonusInput): BonusResult {
  const basicPay = Math.max(0, input.basicPay);
  const bonusPercent = Math.min(100, Math.max(0, input.bonusPercent));
  const bonusAmount = Math.max(0, input.bonusAmount);
  const taxSlabPercent = Math.min(42, Math.max(0, input.taxSlabPercent ?? 30));

  const bonus =
    input.mode === "amount" ? bonusAmount : (basicPay * bonusPercent) / 100;
  const estimatedTaxOnBonus = (bonus * taxSlabPercent) / 100;

  return {
    basicPay,
    mode: input.mode,
    bonusPercent,
    bonusAmount,
    bonus,
    taxSlabPercent,
    estimatedTaxOnBonus,
  };
}
