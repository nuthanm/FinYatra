import { fdMaturity, type FdCompounding } from "@/lib/finance/fd";

/** Split a lump sum into N FD rungs with staggered tenures. */

export type FdLadderInput = {
  /** Total amount to ladder. */
  totalAmount: number;
  /** Number of rungs (e.g. 5). */
  rungs: number;
  /** Shortest tenure in years (first rung). */
  shortestYears: number;
  /** Step between rungs in years (e.g. 1 → 1y, 2y, 3y…). */
  stepYears?: number;
  /** Interest rate % p.a. (same across rungs for simplicity). */
  annualRatePercent: number;
  compoundsPerYear?: FdCompounding;
};

export type FdLadderRung = {
  index: number;
  principal: number;
  years: number;
  maturity: number;
  interest: number;
};

export type FdLadderResult = {
  totalAmount: number;
  rungs: number;
  annualRatePercent: number;
  perRungPrincipal: number;
  ladder: FdLadderRung[];
  totalMaturity: number;
  totalInterest: number;
  /** Weighted-average maturity years (by principal). */
  averageMaturityYears: number;
  /** First and last rung tenures. */
  shortestYears: number;
  longestYears: number;
};

export function calculateFdLadder(input: FdLadderInput): FdLadderResult {
  const total = Math.max(0, input.totalAmount);
  const n = Math.max(1, Math.min(20, Math.floor(input.rungs)));
  const shortest = Math.max(0.25, input.shortestYears);
  const step = Math.max(0.25, input.stepYears ?? 1);
  const rate = Math.max(0, input.annualRatePercent);
  const compounds = input.compoundsPerYear ?? 4;
  const perRung = total / n;

  const ladder: FdLadderRung[] = [];
  let totalMaturity = 0;
  let totalInterest = 0;
  let weightedYears = 0;

  for (let i = 0; i < n; i++) {
    const years = shortest + i * step;
    const fd = fdMaturity(perRung, rate, years, compounds);
    ladder.push({
      index: i + 1,
      principal: perRung,
      years,
      maturity: fd.maturity,
      interest: fd.interest,
    });
    totalMaturity += fd.maturity;
    totalInterest += fd.interest;
    weightedYears += years * perRung;
  }

  const averageMaturityYears = total > 0 ? weightedYears / total : 0;
  const longestYears = shortest + (n - 1) * step;

  return {
    totalAmount: total,
    rungs: n,
    annualRatePercent: rate,
    perRungPrincipal: perRung,
    ladder,
    totalMaturity,
    totalInterest,
    averageMaturityYears,
    shortestYears: shortest,
    longestYears,
  };
}
