/** Post Office Monthly Income Scheme — monthly interest payout. */

export const MIS_DEFAULT_RATE = 7.4;
export const MIS_MAX_DEPOSIT_SINGLE = 900_000;
export const MIS_MAX_DEPOSIT_JOINT = 1_500_000;
export const MIS_TENURE_YEARS = 5;

export type MisAccountType = "single" | "joint";

export type PostOfficeMisResult = {
  deposit: number;
  monthlyInterest: number;
  annualInterest: number;
  totalInterest: number;
  maturityAmount: number;
  maxDeposit: number;
};

export function misMaxDeposit(accountType: MisAccountType): number {
  return accountType === "joint" ? MIS_MAX_DEPOSIT_JOINT : MIS_MAX_DEPOSIT_SINGLE;
}

/**
 * POMIS pays interest monthly; principal returned at maturity (not compounded into corpus).
 */
export function calculatePostOfficeMis(
  deposit: number,
  annualRatePercent: number,
  years = MIS_TENURE_YEARS,
  accountType: MisAccountType = "single",
): PostOfficeMisResult {
  const maxDeposit = misMaxDeposit(accountType);
  const d = Math.min(Math.max(0, deposit), maxDeposit);
  const rate = Math.max(0, annualRatePercent) / 100;
  const y = Math.max(0, years);

  const annualInterest = d * rate;
  const monthlyInterest = annualInterest / 12;
  const totalInterest = annualInterest * y;

  return {
    deposit: d,
    monthlyInterest,
    annualInterest,
    totalInterest,
    maturityAmount: d, // principal returned; interest already paid out
    maxDeposit,
  };
}
