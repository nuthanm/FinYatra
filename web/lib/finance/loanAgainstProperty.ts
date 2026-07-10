import { emi } from "@/lib/finance/compound";

/** Loan against property (LAP): LTV on property value → max loan and EMI. */

export type LoanAgainstPropertyInput = {
  propertyValue: number;
  ltvPercent: number;
  annualRatePercent: number;
  years: number;
};

export type LoanAgainstPropertyResult = {
  maxLoan: number;
  monthlyEmi: number;
  totalInterest: number;
  totalPayment: number;
};

export function calculateLoanAgainstProperty(input: LoanAgainstPropertyInput): LoanAgainstPropertyResult {
  const propertyValue = Math.max(0, input.propertyValue);
  const ltv = Math.min(100, Math.max(0, input.ltvPercent)) / 100;
  const maxLoan = propertyValue * ltv;
  const years = Math.max(0, input.years);
  const months = Math.round(years * 12);
  const rate = Math.max(0, input.annualRatePercent);

  if (maxLoan <= 0 || months <= 0) {
    return { maxLoan: 0, monthlyEmi: 0, totalInterest: 0, totalPayment: 0 };
  }

  const monthlyEmi = emi(maxLoan, rate, months);
  const totalPayment = monthlyEmi * months;
  const totalInterest = Math.max(0, totalPayment - maxLoan);

  return { maxLoan, monthlyEmi, totalInterest, totalPayment };
}
