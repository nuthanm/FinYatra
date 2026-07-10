/** Pension commutation — lump sum vs reduced pension (simplified educational model). */

export type PensionCommutationInput = {
  /** Full monthly pension before commutation (₹). */
  monthlyPension: number;
  /** Share of pension to commute (typically up to 40%). */
  commutationPercent: number;
  /**
   * Commutation factor (years of purchase). Official tables vary by age;
   * ~9.81 is a common illustrative age-60 factor.
   */
  commutationFactor: number;
};

export type PensionCommutationResult = {
  monthlyPension: number;
  commutationPercent: number;
  commutationFactor: number;
  /** Monthly pension amount being commuted. */
  commutedMonthly: number;
  /** Reduced monthly pension after commutation. */
  reducedMonthly: number;
  /** One-time lump sum = commutedMonthly × 12 × factor. */
  lumpSum: number;
  /** Years until lump sum ≈ forgone pension (break-even, simplified). */
  breakEvenYears: number;
};

const MAX_COMMUTATION_PCT = 40;

export function calculatePensionCommutation(
  input: PensionCommutationInput,
): PensionCommutationResult {
  const monthlyPension = Math.max(0, input.monthlyPension);
  const commutationPercent = Math.min(
    MAX_COMMUTATION_PCT,
    Math.max(0, input.commutationPercent),
  );
  const commutationFactor = Math.max(0, input.commutationFactor);

  const commutedMonthly = (monthlyPension * commutationPercent) / 100;
  const reducedMonthly = Math.max(0, monthlyPension - commutedMonthly);
  const lumpSum = commutedMonthly * 12 * commutationFactor;
  const annualForgone = commutedMonthly * 12;
  const breakEvenYears =
    annualForgone > 0 && commutationFactor > 0 ? commutationFactor : 0;

  return {
    monthlyPension,
    commutationPercent,
    commutationFactor,
    commutedMonthly,
    reducedMonthly,
    lumpSum,
    breakEvenYears,
  };
}
