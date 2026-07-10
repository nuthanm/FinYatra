/**
 * Health insurance portability — waiting period leftover + gap cover note (educational).
 */

export type HealthInsurancePortInput = {
  /** Original PED / waiting period (months). */
  originalWaitingMonths: number;
  /** Months already completed with current insurer. */
  monthsCompleted: number;
  /** Current sum insured (₹). */
  currentSumInsured: number;
  /** Desired sum insured after port (₹). */
  newSumInsured: number;
};

export type HealthInsurancePortResult = {
  originalWaitingMonths: number;
  monthsCompleted: number;
  waitingLeftMonths: number;
  waitingFullyServed: boolean;
  currentSumInsured: number;
  newSumInsured: number;
  /** Increase in cover that may restart waiting on the incremental amount. */
  coverIncrease: number;
  hasGapCoverNote: boolean;
};

export function calculateHealthInsurancePort(
  input: HealthInsurancePortInput,
): HealthInsurancePortResult {
  const original = Math.max(0, Math.round(input.originalWaitingMonths));
  const completed = Math.max(0, Math.round(input.monthsCompleted));
  const waitingLeftMonths = Math.max(0, original - completed);
  const currentSumInsured = Math.max(0, input.currentSumInsured);
  const newSumInsured = Math.max(0, input.newSumInsured);
  const coverIncrease = Math.max(0, newSumInsured - currentSumInsured);

  return {
    originalWaitingMonths: original,
    monthsCompleted: completed,
    waitingLeftMonths,
    waitingFullyServed: waitingLeftMonths === 0,
    currentSumInsured,
    newSumInsured,
    coverIncrease,
    hasGapCoverNote: coverIncrease > 0,
  };
}
