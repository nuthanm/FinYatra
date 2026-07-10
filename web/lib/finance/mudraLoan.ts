import { emi } from "@/lib/finance/compound";

/** PMMY MUDRA categories — Shishu / Kishore / Tarun max limits → EMI. */

export type MudraCategory = "shishu" | "kishore" | "tarun";

export const MUDRA_LIMITS: Record<MudraCategory, number> = {
  shishu: 50_000,
  kishore: 5_00_000,
  tarun: 10_00_000,
};

export const MUDRA_DEFAULT_RATE = 11;

export type MudraLoanInput = {
  category: MudraCategory;
  loanAmount: number;
  annualRatePercent: number;
  tenureMonths: number;
};

export type MudraLoanResult = {
  category: MudraCategory;
  categoryLimit: number;
  requestedAmount: number;
  /** min(requested, category limit). */
  eligibleAmount: number;
  capped: boolean;
  monthlyEmi: number;
  totalInterest: number;
  totalPayment: number;
};

export function calculateMudraLoan(input: MudraLoanInput): MudraLoanResult {
  const category = input.category;
  const categoryLimit = MUDRA_LIMITS[category];
  const requestedAmount = Math.max(0, input.loanAmount);
  const eligibleAmount = Math.min(requestedAmount, categoryLimit);
  const capped = requestedAmount > categoryLimit;
  const months = Math.max(0, Math.round(input.tenureMonths));
  const rate = Math.max(0, input.annualRatePercent);

  if (eligibleAmount <= 0 || months <= 0) {
    return {
      category,
      categoryLimit,
      requestedAmount,
      eligibleAmount: 0,
      capped,
      monthlyEmi: 0,
      totalInterest: 0,
      totalPayment: 0,
    };
  }

  const monthlyEmi = emi(eligibleAmount, rate, months);
  const totalPayment = monthlyEmi * months;
  const totalInterest = Math.max(0, totalPayment - eligibleAmount);

  return {
    category,
    categoryLimit,
    requestedAmount,
    eligibleAmount,
    capped,
    monthlyEmi,
    totalInterest,
    totalPayment,
  };
}
