import { sipFutureValue } from "@/lib/finance/compound";

/** NPS Tier-II corpus projection — liquid, no lock-in (educational). */

export type NpsTier2Input = {
  monthlyContribution: number;
  expectedReturnPercent: number;
  years: number;
  existingBalance?: number;
};

export type NpsTier2Result = {
  monthlyContribution: number;
  expectedReturnPercent: number;
  years: number;
  months: number;
  existingBalance: number;
  totalContributed: number;
  corpus: number;
  gains: number;
};

/**
 * Corpus = existing grown + SIP FV of monthly Tier-II contributions.
 * Tier-II is voluntary and withdrawable (unlike Tier-I).
 */
export function calculateNpsTier2(input: NpsTier2Input): NpsTier2Result {
  const monthlyContribution = Math.max(0, input.monthlyContribution);
  const expectedReturnPercent = Math.min(20, Math.max(0, input.expectedReturnPercent));
  const years = Math.min(50, Math.max(0, input.years));
  const existingBalance = Math.max(0, input.existingBalance ?? 0);
  const months = Math.floor(years * 12);

  const grownExisting =
    existingBalance * Math.pow(1 + expectedReturnPercent / 100, years);
  const sipCorpus = sipFutureValue(monthlyContribution, expectedReturnPercent, months);
  const corpus = grownExisting + sipCorpus;
  const totalContributed = existingBalance + monthlyContribution * months;
  const gains = corpus - totalContributed;

  return {
    monthlyContribution,
    expectedReturnPercent,
    years,
    months,
    existingBalance,
    totalContributed,
    corpus,
    gains,
  };
}
