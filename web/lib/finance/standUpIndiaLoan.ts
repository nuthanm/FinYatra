import { emi } from "@/lib/finance/compound";

/** Stand-Up India — SC/ST/women entrepreneurs ₹10L–₹1Cr EMI (educational). */

export const STAND_UP_INDIA_MIN = 10_00_000;
export const STAND_UP_INDIA_MAX = 1_00_00_000;
export const STAND_UP_INDIA_DEFAULT_RATE = 9.5;

export type StandUpIndiaLoanInput = {
  loanAmount: number;
  annualRatePercent: number;
  tenureMonths: number;
};

export type StandUpIndiaLoanResult = {
  requestedAmount: number;
  /** Clamped to scheme band ₹10L–₹1Cr. */
  eligibleAmount: number;
  belowMin: boolean;
  aboveMax: boolean;
  monthlyEmi: number;
  totalInterest: number;
  totalPayment: number;
};

export function calculateStandUpIndiaLoan(input: StandUpIndiaLoanInput): StandUpIndiaLoanResult {
  const requestedAmount = Math.max(0, input.loanAmount);
  const belowMin = requestedAmount > 0 && requestedAmount < STAND_UP_INDIA_MIN;
  const aboveMax = requestedAmount > STAND_UP_INDIA_MAX;
  let eligibleAmount = requestedAmount;
  if (requestedAmount > 0) {
    eligibleAmount = Math.min(STAND_UP_INDIA_MAX, Math.max(STAND_UP_INDIA_MIN, requestedAmount));
  }
  const months = Math.max(0, Math.round(input.tenureMonths));
  const rate = Math.max(0, input.annualRatePercent);

  if (eligibleAmount <= 0 || months <= 0) {
    return {
      requestedAmount,
      eligibleAmount: 0,
      belowMin,
      aboveMax,
      monthlyEmi: 0,
      totalInterest: 0,
      totalPayment: 0,
    };
  }

  const monthlyEmi = emi(eligibleAmount, rate, months);
  const totalPayment = monthlyEmi * months;
  const totalInterest = Math.max(0, totalPayment - eligibleAmount);

  return {
    requestedAmount,
    eligibleAmount,
    belowMin,
    aboveMax,
    monthlyEmi,
    totalInterest,
    totalPayment,
  };
}
