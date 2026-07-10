/** Emergency fund target and optional months-to-reach. */

export type EmergencyFundInput = {
  monthlyExpense: number;
  /** Months of expenses to cover (commonly 3, 6, or 12). */
  monthsOfCover: number;
  /** Optional monthly amount you can save toward the fund. */
  monthlySavings?: number;
  /** Amount already set aside. */
  existingSavings?: number;
};

export type EmergencyFundResult = {
  monthlyExpense: number;
  monthsOfCover: number;
  target: number;
  existingSavings: number;
  gap: number;
  monthlySavings: number;
  /** Calendar months to close the gap at the given savings rate; null if not saving. */
  monthsToReach: number | null;
};

export function calculateEmergencyFund(input: EmergencyFundInput): EmergencyFundResult {
  const monthlyExpense = Math.max(0, input.monthlyExpense);
  const monthsOfCover = Math.max(0, input.monthsOfCover);
  const existingSavings = Math.max(0, input.existingSavings ?? 0);
  const monthlySavings = Math.max(0, input.monthlySavings ?? 0);
  const target = monthlyExpense * monthsOfCover;
  const gap = Math.max(0, target - existingSavings);

  let monthsToReach: number | null = null;
  if (gap <= 0) {
    monthsToReach = 0;
  } else if (monthlySavings > 0) {
    monthsToReach = Math.ceil(gap / monthlySavings);
  }

  return {
    monthlyExpense,
    monthsOfCover,
    target,
    existingSavings,
    gap,
    monthlySavings,
    monthsToReach,
  };
}
