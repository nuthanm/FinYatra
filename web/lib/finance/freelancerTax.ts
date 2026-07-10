/** Freelancer / professional tax estimate (educational — Sec 44ADA style). */

export const PRESUMPTIVE_44ADA_PCT = 50;

export type FreelancerTaxInput = {
  receipts: number;
  expenses: number;
  /** When true, taxable profit = 50% of receipts (44ADA presumptive). */
  usePresumptive44ADA: boolean;
  /** Marginal tax slab %. */
  taxSlabPercent: number;
};

export type FreelancerTaxResult = {
  receipts: number;
  expenses: number;
  actualProfit: number;
  taxableProfit: number;
  usePresumptive44ADA: boolean;
  estimatedTax: number;
  taxSlabPercent: number;
};

/**
 * Actual profit = receipts − expenses.
 * Presumptive 44ADA: taxable = 50% of receipts (expenses ignored).
 * Tax ≈ taxable × marginal slab (simplified).
 */
export function calculateFreelancerTax(input: FreelancerTaxInput): FreelancerTaxResult {
  const receipts = Math.max(0, input.receipts);
  const expenses = Math.min(receipts, Math.max(0, input.expenses));
  const taxSlabPercent = Math.min(42, Math.max(0, input.taxSlabPercent));
  const actualProfit = Math.max(0, receipts - expenses);
  const taxableProfit = input.usePresumptive44ADA
    ? (receipts * PRESUMPTIVE_44ADA_PCT) / 100
    : actualProfit;
  const estimatedTax = (taxableProfit * taxSlabPercent) / 100;

  return {
    receipts,
    expenses,
    actualProfit,
    taxableProfit,
    usePresumptive44ADA: input.usePresumptive44ADA,
    estimatedTax,
    taxSlabPercent,
  };
}
