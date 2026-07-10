import { emi } from "@/lib/finance/compound";

/** Gold loan eligibility (LTV) and EMI. */

export type GoldPurity = 22 | 24;

export type GoldLoanInput = {
  weightGrams: number;
  purity: GoldPurity;
  /** Market rate for 24K gold per gram (₹). */
  ratePerGram24k: number;
  ltvPercent: number;
  annualRatePercent: number;
  tenureMonths: number;
};

export type GoldLoanResult = {
  pureGoldEquivalentGrams: number;
  goldValue: number;
  maxLoan: number;
  monthlyEmi: number;
  totalInterest: number;
  totalPayment: number;
};

export function calculateGoldLoan(input: GoldLoanInput): GoldLoanResult {
  const weight = Math.max(0, input.weightGrams);
  const rate24 = Math.max(0, input.ratePerGram24k);
  const purityFactor = input.purity / 24;
  const pureGoldEquivalentGrams = weight * purityFactor;
  const goldValue = pureGoldEquivalentGrams * rate24;
  const ltv = Math.min(100, Math.max(0, input.ltvPercent)) / 100;
  const maxLoan = goldValue * ltv;
  const months = Math.max(0, Math.round(input.tenureMonths));
  const rate = Math.max(0, input.annualRatePercent);
  const monthlyEmi = emi(maxLoan, rate, months);
  const totalPayment = monthlyEmi * months;
  const totalInterest = Math.max(0, totalPayment - maxLoan);

  return {
    pureGoldEquivalentGrams,
    goldValue,
    maxLoan,
    monthlyEmi,
    totalInterest,
    totalPayment,
  };
}
