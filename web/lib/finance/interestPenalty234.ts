/** Sections 234A / 234B / 234C interest — simplified educational estimate. */

export type InterestPenalty234Input = {
  taxDue: number;
  monthsLate: number;
  /** Months of advance-tax shortfall for 234B (defaults to monthsLate). */
  months234B?: number;
  /** Number of quarterly instalment shortfalls for 234C (0–4). */
  instalmentShortfalls?: number;
};

export type InterestPenalty234Result = {
  taxDue: number;
  monthsLate: number;
  months234B: number;
  instalmentShortfalls: number;
  interest234A: number;
  interest234B: number;
  interest234C: number;
  totalInterest: number;
};

/** 1% per month on unpaid tax (234A / 234B style). */
const MONTHLY_RATE = 0.01;
/** Rough 234C: 1% per shortfall month on tax due / 4 (educational). */
const INSTALMENT_RATE = 0.01;

export function calculateInterestPenalty234(
  input: InterestPenalty234Input,
): InterestPenalty234Result {
  const taxDue = Math.max(0, input.taxDue);
  const monthsLate = Math.max(0, Math.round(input.monthsLate));
  const months234B = Math.max(0, Math.round(input.months234B ?? monthsLate));
  const instalmentShortfalls = Math.min(
    4,
    Math.max(0, Math.round(input.instalmentShortfalls ?? 0)),
  );

  const interest234A = taxDue * MONTHLY_RATE * monthsLate;
  const interest234B = taxDue * MONTHLY_RATE * months234B;
  const perInstalment = taxDue / 4;
  const interest234C = perInstalment * INSTALMENT_RATE * instalmentShortfalls;
  const totalInterest = interest234A + interest234B + interest234C;

  return {
    taxDue,
    monthsLate,
    months234B,
    instalmentShortfalls,
    interest234A,
    interest234B,
    interest234C,
    totalInterest,
  };
}
