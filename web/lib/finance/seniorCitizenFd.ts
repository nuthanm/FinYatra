/** Senior citizen FD maturity with higher rate and TDS note. */

import { applyFdTds, fdMaturity, type FdCompounding, type FdResult } from "@/lib/finance/fd";

export type SeniorCitizenFdInput = {
  principal: number;
  /** Senior citizen rate % p.a. (typically ~0.5% above regular). */
  annualRatePercent: number;
  years: number;
  compoundsPerYear?: FdCompounding;
  /** When true, apply senior TDS threshold (₹50k). */
  seniorCitizen?: boolean;
  includeTds?: boolean;
};

export type SeniorCitizenFdResult = FdResult & {
  principal: number;
  annualRatePercent: number;
  years: number;
  seniorCitizen: boolean;
  /** Illustrative regular (non-senior) rate for comparison. */
  regularRatePercent: number;
  regularMaturity: number;
};

/** Typical senior bump over regular FD. */
export const SENIOR_FD_RATE_BUMP = 0.5;

/**
 * Senior FD maturity using standard compounding; optional TDS at senior threshold.
 */
export function calculateSeniorCitizenFd(input: SeniorCitizenFdInput): SeniorCitizenFdResult {
  const principal = Math.max(0, input.principal);
  const rate = Math.max(0, input.annualRatePercent);
  const years = Math.max(0, input.years);
  const compounds = input.compoundsPerYear ?? 4;
  const senior = input.seniorCitizen !== false;
  const includeTds = input.includeTds !== false;

  let result = fdMaturity(principal, rate, years, compounds);
  if (includeTds) result = applyFdTds(result, senior);

  const regularRate = Math.max(0, rate - SENIOR_FD_RATE_BUMP);
  const regular = fdMaturity(principal, regularRate, years, compounds);

  return {
    ...result,
    principal,
    annualRatePercent: rate,
    years,
    seniorCitizen: senior,
    regularRatePercent: regularRate,
    regularMaturity: regular.maturity,
  };
}
