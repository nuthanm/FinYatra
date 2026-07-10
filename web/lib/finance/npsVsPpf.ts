/** Compare NPS vs PPF maturity for the same annual contribution (educational). */

import { calculateNps } from "@/lib/finance/nps";
import { ppfAnnualProjection, PPF_DEFAULT_RATE, PPF_DEFAULT_YEARS, PPF_MAX_ANNUAL } from "@/lib/finance/ppf";

export const NPS_VS_PPF_DEFAULT_NPS_RATE = 10;
export const NPS_VS_PPF_DEFAULT_YEARS = 15;

export type NpsVsPpfInput = {
  /** Same annual outlay for both (₹). Capped at PPF max for fair compare. */
  annualContribution: number;
  years?: number;
  npsRatePercent?: number;
  ppfRatePercent?: number;
};

export type NpsVsPpfSide = {
  maturity: number;
  totalInvested: number;
  totalInterest: number;
  ratePercent: number;
  years: number;
};

export type NpsVsPpfResult = {
  annualContribution: number;
  nps: NpsVsPpfSide;
  ppf: NpsVsPpfSide;
  /** NPS corpus − PPF maturity. */
  maturityGap: number;
  winner: "nps" | "ppf" | "tie";
};

export function calculateNpsVsPpf(input: NpsVsPpfInput): NpsVsPpfResult {
  const annual = Math.min(Math.max(0, input.annualContribution), PPF_MAX_ANNUAL);
  const years = input.years ?? NPS_VS_PPF_DEFAULT_YEARS;
  const npsRate = input.npsRatePercent ?? NPS_VS_PPF_DEFAULT_NPS_RATE;
  const ppfRate = input.ppfRatePercent ?? PPF_DEFAULT_RATE;
  const nYears = Math.max(1, Math.min(40, Math.floor(years)));

  const monthly = annual / 12;
  const nps = calculateNps({
    currentAge: 30,
    retirementAge: 30 + nYears,
    monthlyContribution: monthly,
    employerMonthly: 0,
    existingCorpus: 0,
    expectedReturnPercent: npsRate,
    annuityRatePercent: 6,
    annuityFraction: 0,
  });

  const ppf = ppfAnnualProjection(annual, ppfRate, nYears || PPF_DEFAULT_YEARS);

  const maturityGap = nps.corpus - ppf.maturity;
  const winner: NpsVsPpfResult["winner"] =
    Math.abs(maturityGap) < 1 ? "tie" : maturityGap > 0 ? "nps" : "ppf";

  return {
    annualContribution: annual,
    nps: {
      maturity: nps.corpus,
      totalInvested: nps.totalContributed,
      totalInterest: Math.max(0, nps.corpus - nps.totalContributed),
      ratePercent: npsRate,
      years: nYears,
    },
    ppf: {
      maturity: ppf.maturity,
      totalInvested: ppf.totalInvested,
      totalInterest: ppf.totalInterest,
      ratePercent: ppfRate,
      years: nYears,
    },
    maturityGap,
    winner,
  };
}
