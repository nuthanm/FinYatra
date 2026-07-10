/** RBI Floating Rate Savings Bonds (FRSB) — half-yearly interest, fixed tenure. */

export const FRSB_DEFAULT_RATE = 8.05;
export const FRSB_TENURE_YEARS = 7;

export type FrsbInput = {
  deposit: number;
  annualRatePercent: number;
  tenureYears: number;
};

export type FrsbResult = {
  deposit: number;
  annualRatePercent: number;
  tenureYears: number;
  halfYearlyInterest: number;
  annualInterest: number;
  totalInterest: number;
  maturityAmount: number;
  payoutCount: number;
};

/**
 * Interest paid half-yearly; principal returned at maturity (not compounded).
 */
export function calculateFloatingRateSavingsBond(input: FrsbInput): FrsbResult {
  const deposit = Math.max(0, input.deposit);
  const annualRatePercent = Math.max(0, input.annualRatePercent);
  const tenureYears = Math.max(0, input.tenureYears);
  const annualInterest = (deposit * annualRatePercent) / 100;
  const halfYearlyInterest = annualInterest / 2;
  const payoutCount = Math.round(tenureYears * 2);
  const totalInterest = annualInterest * tenureYears;

  return {
    deposit,
    annualRatePercent,
    tenureYears,
    halfYearlyInterest,
    annualInterest,
    totalInterest,
    maturityAmount: deposit,
    payoutCount,
  };
}
