/**
 * Compare APY guaranteed pension path vs NPS SIP for the same monthly outlay (educational).
 */

import {
  APY_MAX_AGE,
  APY_MIN_AGE,
  APY_RETIREMENT_AGE,
  calculateAtalPension,
  type ApyPensionAmount,
} from "@/lib/finance/atalPension";
import { calculateNps } from "@/lib/finance/nps";

export type ApyVsNpsInput = {
  entryAge: number;
  /** Target APY pension (₹/month at 60). */
  apyPension: ApyPensionAmount;
  /** Expected NPS return % p.a. */
  npsReturnPercent?: number;
  /** Annuity rate for NPS pension estimate. */
  annuityRatePercent?: number;
};

export type ApyVsNpsResult = {
  entryAge: number;
  years: number;
  monthlyOutlay: number;
  apyValid: boolean;
  apyPension: number;
  apyTotalContributed: number;
  npsCorpus: number;
  npsTotalContributed: number;
  npsMonthlyPension: number;
  npsLumpSum: number;
  /** Rough: APY pension vs NPS illustrative monthly pension. */
  pensionGap: number;
  winner: "apy" | "nps" | "tie" | "invalid";
};

export function calculateApyVsNps(input: ApyVsNpsInput): ApyVsNpsResult {
  const age = Math.round(Math.min(APY_MAX_AGE, Math.max(APY_MIN_AGE, input.entryAge)));
  const apy = calculateAtalPension(age, input.apyPension);
  const years = Math.max(0, APY_RETIREMENT_AGE - age);
  const monthlyOutlay = apy.monthlyContribution;
  const npsReturn = input.npsReturnPercent ?? 10;
  const annuityRate = input.annuityRatePercent ?? 6;

  if (!apy.valid || monthlyOutlay <= 0) {
    return {
      entryAge: age,
      years,
      monthlyOutlay: 0,
      apyValid: false,
      apyPension: input.apyPension,
      apyTotalContributed: 0,
      npsCorpus: 0,
      npsTotalContributed: 0,
      npsMonthlyPension: 0,
      npsLumpSum: 0,
      pensionGap: 0,
      winner: "invalid",
    };
  }

  const nps = calculateNps({
    currentAge: age,
    retirementAge: APY_RETIREMENT_AGE,
    monthlyContribution: monthlyOutlay,
    employerMonthly: 0,
    existingCorpus: 0,
    expectedReturnPercent: npsReturn,
    annuityRatePercent: annuityRate,
    annuityFraction: 0.4,
  });

  const pensionGap = nps.monthlyPension - apy.pensionAmount;
  const winner: ApyVsNpsResult["winner"] =
    Math.abs(pensionGap) < 50 ? "tie" : pensionGap > 0 ? "nps" : "apy";

  return {
    entryAge: age,
    years,
    monthlyOutlay,
    apyValid: true,
    apyPension: apy.pensionAmount,
    apyTotalContributed: apy.totalContribution,
    npsCorpus: nps.corpus,
    npsTotalContributed: nps.totalContributed,
    npsMonthlyPension: nps.monthlyPension,
    npsLumpSum: nps.lumpSum,
    pensionGap,
    winner,
  };
}
