import { emi } from "@/lib/finance/compound";

/** Personal loan EMI with optional processing-fee cost note. */

export type PersonalLoanInput = {
  principal: number;
  annualRatePercent: number;
  years: number;
  /** Optional processing fee as % of principal (illustrative effective cost). */
  processingFeePercent: number;
};

export type PersonalLoanResult = {
  monthlyEmi: number;
  totalPayment: number;
  totalInterest: number;
  months: number;
  processingFeeAmount: number;
  /** Principal + interest + processing fee (cash cost view). */
  effectiveTotalCost: number;
};

export function calculatePersonalLoan(input: PersonalLoanInput): PersonalLoanResult {
  const principal = Math.max(0, input.principal);
  const rate = Math.max(0, input.annualRatePercent);
  const years = Math.max(0, input.years);
  const months = Math.round(years * 12);
  const feePct = Math.max(0, input.processingFeePercent);
  const processingFeeAmount = principal * (feePct / 100);

  if (principal <= 0 || months <= 0) {
    return {
      monthlyEmi: 0,
      totalPayment: 0,
      totalInterest: 0,
      months: 0,
      processingFeeAmount,
      effectiveTotalCost: processingFeeAmount,
    };
  }

  const monthlyEmi = emi(principal, rate, months);
  const totalPayment = monthlyEmi * months;
  const totalInterest = Math.max(0, totalPayment - principal);

  return {
    monthlyEmi,
    totalPayment,
    totalInterest,
    months,
    processingFeeAmount,
    effectiveTotalCost: totalPayment + processingFeeAmount,
  };
}
