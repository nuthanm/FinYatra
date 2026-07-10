/** SSY maturity vs simplified LIC endowment for same annual outlay (educational). */

import { calculateSsy, SSY_DEFAULT_RATE, SSY_DEPOSIT_YEARS, SSY_MATURITY_YEARS, SSY_MAX_ANNUAL } from "@/lib/finance/ssy";

export const LIC_ENDOWMENT_DEFAULT_IRR = 5;

export type SukanyaVsLicInput = {
  annualOutlay: number;
  ssyRatePercent?: number;
  /** Simplified endowment IRR % (illustrative ~4–6%). */
  licIrrPercent?: number;
  /** LIC premium-paying / endowment years (default 21 to match SSY horizon). */
  licYears?: number;
};

export type SukanyaVsLicSide = {
  maturity: number;
  totalInvested: number;
  totalGain: number;
  ratePercent: number;
  years: number;
};

export type SukanyaVsLicResult = {
  annualOutlay: number;
  ssy: SukanyaVsLicSide;
  lic: SukanyaVsLicSide;
  maturityGap: number;
  winner: "ssy" | "lic" | "tie";
};

/**
 * LIC endowment simplified: annual premium compounds at illustrative IRR for `licYears`.
 * Not a real LIC quote — endowment returns are typically lower than SSY.
 */
function licEndowmentMaturity(
  annualPremium: number,
  irrPercent: number,
  years: number,
): { maturity: number; totalInvested: number } {
  const rate = Math.max(0, irrPercent) / 100;
  let balance = 0;
  let invested = 0;
  for (let y = 1; y <= years; y++) {
    balance += annualPremium;
    invested += annualPremium;
    balance *= 1 + rate;
  }
  return { maturity: balance, totalInvested: invested };
}

export function calculateSukanyaVsLic(input: SukanyaVsLicInput): SukanyaVsLicResult {
  const annualOutlay = Math.min(Math.max(0, input.annualOutlay), SSY_MAX_ANNUAL);
  const ssyRate = input.ssyRatePercent ?? SSY_DEFAULT_RATE;
  const licIrr = input.licIrrPercent ?? LIC_ENDOWMENT_DEFAULT_IRR;
  const licYears = input.licYears ?? SSY_MATURITY_YEARS;

  const ssy = calculateSsy(annualOutlay, ssyRate, SSY_DEPOSIT_YEARS, SSY_MATURITY_YEARS);
  const lic = licEndowmentMaturity(annualOutlay, licIrr, licYears);

  const maturityGap = ssy.maturity - lic.maturity;
  const winner: SukanyaVsLicResult["winner"] =
    Math.abs(maturityGap) < 1 ? "tie" : maturityGap > 0 ? "ssy" : "lic";

  return {
    annualOutlay,
    ssy: {
      maturity: ssy.maturity,
      totalInvested: ssy.totalInvested,
      totalGain: ssy.totalInterest,
      ratePercent: ssyRate,
      years: SSY_MATURITY_YEARS,
    },
    lic: {
      maturity: lic.maturity,
      totalInvested: lic.totalInvested,
      totalGain: lic.maturity - lic.totalInvested,
      ratePercent: licIrr,
      years: licYears,
    },
    maturityGap,
    winner,
  };
}
