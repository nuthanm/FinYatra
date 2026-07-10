/** DPIIT startup tax note: 80-IAC + angel tax abolished + simple tax on profit (educational). */

const CESS = 0.04;

export type StartupTaxInput = {
  /** Business profit for the year (₹). */
  profit: number;
  /** DPIIT-recognised startup eligible for 80-IAC in this year. */
  dpiitEligible: boolean;
  /** Marginal slab % excluding cess (used when 80-IAC does not apply). */
  taxSlabPercent: number;
};

export type StartupTaxResult = {
  profit: number;
  dpiitEligible: boolean;
  taxSlabPercent: number;
  /** 100% of profit when DPIIT eligible (illustrative 80-IAC). */
  deduction80Iac: number;
  taxableProfit: number;
  taxBeforeCess: number;
  cess: number;
  totalTax: number;
  /** Tax if 80-IAC did not apply (same profit × slab). */
  taxWithout80Iac: number;
  taxSaved: number;
  angelTaxNote: "abolished_dpiit" | "not_applicable";
};

/**
 * If DPIIT eligible → 80-IAC deducts 100% of profit (simplified one-year view).
 * Angel tax on share premium is treated as abolished for DPIIT startups (note only).
 * Otherwise tax ≈ profit × slab% + 4% cess.
 */
export function calculateStartupTax(input: StartupTaxInput): StartupTaxResult {
  const profit = Math.max(0, input.profit);
  const taxSlabPercent = Math.min(42, Math.max(0, input.taxSlabPercent));
  const dpiitEligible = input.dpiitEligible;

  const deduction80Iac = dpiitEligible ? profit : 0;
  const taxableProfit = Math.max(0, profit - deduction80Iac);
  const taxBeforeCess = (taxableProfit * taxSlabPercent) / 100;
  const cess = taxBeforeCess * CESS;
  const totalTax = taxBeforeCess + cess;

  const taxWithout80Iac = (profit * taxSlabPercent) / 100 * (1 + CESS);
  const taxSaved = Math.max(0, taxWithout80Iac - totalTax);

  return {
    profit,
    dpiitEligible,
    taxSlabPercent,
    deduction80Iac,
    taxableProfit,
    taxBeforeCess,
    cess,
    totalTax,
    taxWithout80Iac,
    taxSaved,
    angelTaxNote: dpiitEligible ? "abolished_dpiit" : "not_applicable",
  };
}
