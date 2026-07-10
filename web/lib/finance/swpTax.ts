import { calculateCapitalGains } from "@/lib/finance/capitalGains";

/**
 * SWP tax on equity MF — rough capital gains on redeemed units (educational).
 * Cost of redeemed units ≈ withdrawal × (cost / NAV) style via costRatio.
 */

export type SwpTaxInput = {
  /** SWP withdrawal amount (₹). */
  withdrawalAmount: number;
  /** Average cost per unit (₹). */
  costPerUnit: number;
  /** Current NAV (₹). */
  nav: number;
  /** Holding period of redeemed units (months). */
  holdingMonths: number;
  /** Marginal slab (unused for equity LTCG/STCG rates but kept for consistency). */
  taxSlabPercent: number;
};

export type SwpTaxResult = {
  withdrawalAmount: number;
  unitsRedeemed: number;
  costBasis: number;
  gain: number;
  isLongTerm: boolean;
  taxableGain: number;
  taxAmount: number;
  taxRatePercent: number;
  netProceeds: number;
};

export function calculateSwpTax(input: SwpTaxInput): SwpTaxResult {
  const withdrawal = Math.max(0, input.withdrawalAmount);
  const costPerUnit = Math.max(0, input.costPerUnit);
  const nav = Math.max(0, input.nav);
  const months = Math.max(0, input.holdingMonths);
  const slab = Math.min(42, Math.max(0, input.taxSlabPercent));

  const unitsRedeemed = nav > 0 ? withdrawal / nav : 0;
  const costBasis = unitsRedeemed * costPerUnit;

  const cg = calculateCapitalGains({
    asset: "equity",
    buyPrice: costBasis,
    sellPrice: withdrawal,
    holdingMonths: months,
    taxSlabPercent: slab,
    exemptionAmount: 0,
  });

  return {
    withdrawalAmount: withdrawal,
    unitsRedeemed,
    costBasis,
    gain: cg.gain,
    isLongTerm: cg.isLongTerm,
    taxableGain: cg.taxableGain,
    taxAmount: cg.taxAmount,
    taxRatePercent: cg.taxRatePercent,
    netProceeds: withdrawal - cg.taxAmount,
  };
}
