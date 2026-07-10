/** Presumptive taxation under Sec 44AD / 44ADA (educational). */

export type PresumptiveScheme = "44ad_digital" | "44ad_other" | "44ada";

export const PRESUMPTIVE_RATES: Record<PresumptiveScheme, number> = {
  "44ad_digital": 6,
  "44ad_other": 8,
  "44ada": 50,
};

export type PresumptiveTaxInput = {
  turnover: number;
  scheme: PresumptiveScheme;
  /** Marginal tax slab % applied to presumptive income. */
  taxSlabPercent: number;
};

export type PresumptiveTaxResult = {
  turnover: number;
  scheme: PresumptiveScheme;
  presumptiveRatePercent: number;
  presumptiveIncome: number;
  taxSlabPercent: number;
  estimatedTax: number;
};

export function calculatePresumptiveTax(input: PresumptiveTaxInput): PresumptiveTaxResult {
  const turnover = Math.max(0, input.turnover);
  const presumptiveRatePercent = PRESUMPTIVE_RATES[input.scheme];
  const taxSlabPercent = Math.min(42, Math.max(0, input.taxSlabPercent));
  const presumptiveIncome = (turnover * presumptiveRatePercent) / 100;
  const estimatedTax = (presumptiveIncome * taxSlabPercent) / 100;

  return {
    turnover,
    scheme: input.scheme,
    presumptiveRatePercent,
    presumptiveIncome,
    taxSlabPercent,
    estimatedTax,
  };
}
