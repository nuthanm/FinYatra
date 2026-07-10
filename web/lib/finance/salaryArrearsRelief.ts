/** Section 89(1) arrears relief — simplified educational estimate. */

export type SalaryArrearsReliefInput = {
  arrearsAmount: number;
  /** Number of prior years the arrears relate to (spread). */
  years: number;
  /** Marginal slab % in the year of receipt. */
  taxSlabPercent: number;
};

export type SalaryArrearsReliefResult = {
  arrearsAmount: number;
  years: number;
  taxSlabPercent: number;
  priorYearSlabPercent: number;
  taxIfLumpSum: number;
  taxIfSpread: number;
  /** Rough 89(1) relief ≈ lump tax − spread tax. */
  estimatedRelief: number;
  perYearArrear: number;
};

export function calculateSalaryArrearsRelief(
  input: SalaryArrearsReliefInput,
): SalaryArrearsReliefResult {
  const arrearsAmount = Math.max(0, input.arrearsAmount);
  const years = Math.max(1, Math.round(input.years));
  const taxSlabPercent = Math.min(42, Math.max(0, input.taxSlabPercent));
  // Educational: assume prior years were ~5 points lower (floor 0).
  const priorYearSlabPercent = Math.max(0, taxSlabPercent - 5);

  const taxIfLumpSum = (arrearsAmount * taxSlabPercent) / 100;
  const perYearArrear = arrearsAmount / years;
  const taxIfSpread = (arrearsAmount * priorYearSlabPercent) / 100;
  const estimatedRelief = Math.max(0, taxIfLumpSum - taxIfSpread);

  return {
    arrearsAmount,
    years,
    taxSlabPercent,
    priorYearSlabPercent,
    taxIfLumpSum,
    taxIfSpread,
    estimatedRelief,
    perYearArrear,
  };
}
