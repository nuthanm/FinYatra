/** Side-by-side SSY vs PPF maturity for the same annual deposit (educational). */

import { calculateSsy, SSY_DEFAULT_RATE, SSY_DEPOSIT_YEARS, SSY_MATURITY_YEARS, SSY_MAX_ANNUAL } from "@/lib/finance/ssy";
import { ppfAnnualProjection, PPF_DEFAULT_RATE, PPF_DEFAULT_YEARS, PPF_MAX_ANNUAL } from "@/lib/finance/ppf";

export type SsyVsPpfInput = {
  annualDeposit: number;
  ssyRatePercent?: number;
  ppfRatePercent?: number;
  /** PPF tenure years (default 15). SSY uses deposit 15 / maturity 21. */
  ppfYears?: number;
};

export type SsyVsPpfSide = {
  maturity: number;
  totalInvested: number;
  totalInterest: number;
  ratePercent: number;
  years: number;
};

export type SsyVsPpfResult = {
  annualDeposit: number;
  ssy: SsyVsPpfSide;
  ppf: SsyVsPpfSide;
  /** SSY maturity − PPF maturity. */
  maturityGap: number;
  winner: "ssy" | "ppf" | "tie";
};

export function calculateSsyVsPpf(input: SsyVsPpfInput): SsyVsPpfResult {
  const annualDeposit = Math.min(
    Math.max(0, input.annualDeposit),
    Math.min(SSY_MAX_ANNUAL, PPF_MAX_ANNUAL),
  );
  const ssyRate = input.ssyRatePercent ?? SSY_DEFAULT_RATE;
  const ppfRate = input.ppfRatePercent ?? PPF_DEFAULT_RATE;
  const ppfYears = input.ppfYears ?? PPF_DEFAULT_YEARS;

  const ssy = calculateSsy(annualDeposit, ssyRate, SSY_DEPOSIT_YEARS, SSY_MATURITY_YEARS);
  const ppf = ppfAnnualProjection(annualDeposit, ppfRate, ppfYears);

  const maturityGap = ssy.maturity - ppf.maturity;
  const winner: SsyVsPpfResult["winner"] =
    Math.abs(maturityGap) < 1 ? "tie" : maturityGap > 0 ? "ssy" : "ppf";

  return {
    annualDeposit,
    ssy: {
      maturity: ssy.maturity,
      totalInvested: ssy.totalInvested,
      totalInterest: ssy.totalInterest,
      ratePercent: ssyRate,
      years: SSY_MATURITY_YEARS,
    },
    ppf: {
      maturity: ppf.maturity,
      totalInvested: ppf.totalInvested,
      totalInterest: ppf.totalInterest,
      ratePercent: ppfRate,
      years: ppfYears,
    },
    maturityGap,
    winner,
  };
}
