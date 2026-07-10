/** Mini EPFO passbook projection: opening + monthly contributions → closing (educational). */

export const EPFO_PASSBOOK_DEFAULT_RATE = 8.25;

export type EpfoPassbookInput = {
  openingBalance: number;
  /** Combined employee + employer EPF contribution per month (₹). */
  monthlyContribution: number;
  months: number;
  annualRatePercent: number;
};

export type EpfoPassbookResult = {
  openingBalance: number;
  monthlyContribution: number;
  months: number;
  annualRatePercent: number;
  totalContributions: number;
  totalInterest: number;
  closingBalance: number;
};

/**
 * Month-end: add contribution, then interest at rate/12 on new balance.
 * Simplified passbook-style projection — not official EPFO interest credit rules.
 */
export function calculateEpfoPassbook(input: EpfoPassbookInput): EpfoPassbookResult {
  const openingBalance = Math.max(0, input.openingBalance);
  const monthlyContribution = Math.max(0, input.monthlyContribution);
  const months = Math.max(0, Math.floor(input.months));
  const annualRatePercent = Math.max(0, input.annualRatePercent);
  const monthlyRate = annualRatePercent / 100 / 12;

  let balance = openingBalance;
  let totalContributions = 0;
  let totalInterest = 0;

  for (let m = 0; m < months; m++) {
    balance += monthlyContribution;
    totalContributions += monthlyContribution;
    const interest = balance * monthlyRate;
    balance += interest;
    totalInterest += interest;
  }

  return {
    openingBalance,
    monthlyContribution,
    months,
    annualRatePercent,
    totalContributions,
    totalInterest,
    closingBalance: balance,
  };
}
