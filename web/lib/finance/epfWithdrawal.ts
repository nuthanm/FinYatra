/** EPF withdrawal taxability (educational simplification). */

export type EpfEmploymentStatus = "continuing" | "unemployed" | "retired";

export type EpfWithdrawalInput = {
  balance: number;
  /** Years of continuous EPF service. */
  serviceYears: number;
  employmentStatus: EpfEmploymentStatus;
  /** Assumed interest portion of balance (%). Used when withdrawal is taxable. */
  interestPortionPercent?: number;
  /** Marginal slab % for taxable portion. */
  taxSlabPercent: number;
};

export type EpfWithdrawalResult = {
  balance: number;
  serviceYears: number;
  employmentStatus: EpfEmploymentStatus;
  isFullyExempt: boolean;
  taxablePortion: number;
  taxFreePortion: number;
  estimatedTax: number;
  noteKey: "exempt5Plus" | "taxableBefore5" | "unemployedPartial";
};

/**
 * Simplified EPF withdrawal rules (educational):
 * - ≥ 5 years continuous service → generally tax-free (EEE).
 * - < 5 years → interest portion treated as taxable (simplified); principal often also taxable on premature exit.
 * - Unemployed / retired with < 5 years → still show taxable interest estimate for planning.
 */
export function calculateEpfWithdrawal(input: EpfWithdrawalInput): EpfWithdrawalResult {
  const balance = Math.max(0, input.balance);
  const serviceYears = Math.max(0, input.serviceYears);
  const interestPct = Math.min(100, Math.max(0, input.interestPortionPercent ?? 25)) / 100;
  const slab = Math.min(42, Math.max(0, input.taxSlabPercent)) / 100;

  if (serviceYears >= 5) {
    return {
      balance,
      serviceYears,
      employmentStatus: input.employmentStatus,
      isFullyExempt: true,
      taxablePortion: 0,
      taxFreePortion: balance,
      estimatedTax: 0,
      noteKey: "exempt5Plus",
    };
  }

  // Before 5 years: treat interest portion as taxable; remaining as tax-free principal (simplified).
  const taxablePortion = balance * interestPct;
  const taxFreePortion = balance - taxablePortion;

  return {
    balance,
    serviceYears,
    employmentStatus: input.employmentStatus,
    isFullyExempt: false,
    taxablePortion,
    taxFreePortion,
    estimatedTax: taxablePortion * slab,
    noteKey: input.employmentStatus === "unemployed" ? "unemployedPartial" : "taxableBefore5",
  };
}
