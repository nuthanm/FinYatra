import { emi } from "@/lib/finance/compound";

/** Home loan eligibility from income, FOIR, existing EMIs, rate, and tenure. */

export type HomeLoanEligibilityInput = {
  monthlyIncome: number;
  existingEmis: number;
  annualRatePercent: number;
  years: number;
  foirPercent: number;
};

export type HomeLoanEligibilityResult = {
  eligibleEmi: number;
  maxLoan: number;
  sampleEmi: number;
  totalInterest: number;
  totalPayment: number;
};

/** Invert EMI: P = EMI × ((1+r)^n − 1) / (r × (1+r)^n). */
export function principalFromEmi(monthlyEmi: number, annualRatePercent: number, months: number): number {
  if (monthlyEmi <= 0 || months <= 0) return 0;
  const r = annualRatePercent / 100 / 12;
  if (r <= 0) return monthlyEmi * months;
  const pow = Math.pow(1 + r, months);
  return monthlyEmi * ((pow - 1) / (r * pow));
}

export function calculateHomeLoanEligibility(input: HomeLoanEligibilityInput): HomeLoanEligibilityResult {
  const income = Math.max(0, input.monthlyIncome);
  const existing = Math.max(0, input.existingEmis);
  const foir = Math.min(100, Math.max(0, input.foirPercent)) / 100;
  const rate = Math.max(0, input.annualRatePercent);
  const years = Math.max(0, input.years);
  const months = Math.round(years * 12);

  const eligibleEmi = Math.max(0, income * foir - existing);

  if (eligibleEmi <= 0 || months <= 0) {
    return {
      eligibleEmi: 0,
      maxLoan: 0,
      sampleEmi: 0,
      totalInterest: 0,
      totalPayment: 0,
    };
  }

  const maxLoan = principalFromEmi(eligibleEmi, rate, months);
  const sampleEmi = emi(maxLoan, rate, months);
  const totalPayment = sampleEmi * months;
  const totalInterest = Math.max(0, totalPayment - maxLoan);

  return { eligibleEmi, maxLoan, sampleEmi, totalInterest, totalPayment };
}
