/** Compare EPF vs PPF for the same monthly / annual employee-side contribution. */

import { calculateEpf, EPF_DEFAULT_RATE } from "@/lib/finance/epf";
import { ppfAnnualProjection, PPF_DEFAULT_RATE, PPF_DEFAULT_YEARS, PPF_MAX_ANNUAL } from "@/lib/finance/ppf";

export type EpfVsPpfInput = {
  /** Monthly contribution to compare (employee side for EPF; annualised for PPF). */
  monthlyContribution: number;
  years: number;
  epfRatePercent?: number;
  ppfRatePercent?: number;
  /**
   * If true, EPF also adds employer 3.67% on wages implied by employee 12%.
   * monthlyContribution is treated as employee 12% → wage = contrib / 0.12.
   */
  includeEmployerMatch: boolean;
};

export type EpfVsPpfSide = {
  maturity: number;
  totalInvested: number;
  totalInterest: number;
  ratePercent: number;
};

export type EpfVsPpfResult = {
  monthlyContribution: number;
  annualContribution: number;
  years: number;
  epf: EpfVsPpfSide;
  ppf: EpfVsPpfSide;
  maturityGap: number;
  winner: "epf" | "ppf" | "tie";
};

export function calculateEpfVsPpf(input: EpfVsPpfInput): EpfVsPpfResult {
  const monthlyContribution = Math.max(0, input.monthlyContribution);
  const years = Math.max(0, Math.floor(input.years));
  const epfRate = input.epfRatePercent ?? EPF_DEFAULT_RATE;
  const ppfRate = input.ppfRatePercent ?? PPF_DEFAULT_RATE;
  const annualContribution = monthlyContribution * 12;

  // PPF: same annual outlay (capped at ₹1.5L).
  const ppfAnnual = Math.min(annualContribution, PPF_MAX_ANNUAL);
  const ppf = ppfAnnualProjection(ppfAnnual, ppfRate, years || PPF_DEFAULT_YEARS);

  // EPF: derive basic from employee 12% = monthlyContribution.
  const monthlyBasic =
    monthlyContribution > 0 ? monthlyContribution / 0.12 : 0;
  const epfFull = calculateEpf(monthlyBasic, years, epfRate, 0, true);

  let epfMaturity: number;
  let epfInvested: number;
  let epfInterest: number;

  if (input.includeEmployerMatch) {
    epfMaturity = epfFull.maturity;
    epfInvested = epfFull.totalEmployee + epfFull.totalEmployer;
    epfInterest = epfFull.totalInterest;
  } else {
    // Employee-only path: project monthlyContribution alone at EPF rate (no employer).
    const rate = epfRate / 100;
    let balance = 0;
    let invested = 0;
    let interest = 0;
    for (let y = 0; y < years; y++) {
      for (let m = 0; m < 12; m++) {
        balance += monthlyContribution;
        invested += monthlyContribution;
        const i = balance * (rate / 12);
        balance += i;
        interest += i;
      }
    }
    epfMaturity = balance;
    epfInvested = invested;
    epfInterest = interest;
  }

  const maturityGap = epfMaturity - ppf.maturity;
  const winner: EpfVsPpfResult["winner"] =
    Math.abs(maturityGap) < 1 ? "tie" : maturityGap > 0 ? "epf" : "ppf";

  return {
    monthlyContribution,
    annualContribution,
    years,
    epf: {
      maturity: epfMaturity,
      totalInvested: epfInvested,
      totalInterest: epfInterest,
      ratePercent: epfRate,
    },
    ppf: {
      maturity: ppf.maturity,
      totalInvested: ppf.totalInvested,
      totalInterest: ppf.totalInterest,
      ratePercent: ppfRate,
    },
    maturityGap,
    winner,
  };
}
