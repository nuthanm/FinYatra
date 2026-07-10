import { emi } from "@/lib/finance/compound";

/** Loan / overdraft against fixed deposit — LTV on FD amount → max loan and EMI. */

export const LAF_DEFAULT_LTV = 85;

export type LoanAgainstFdInput = {
  fdAmount: number;
  ltvPercent: number;
  annualRatePercent: number;
  tenureMonths: number;
};

export type LoanAgainstFdResult = {
  fdAmount: number;
  ltvPercent: number;
  maxLoan: number;
  monthlyEmi: number;
  totalInterest: number;
  totalPayment: number;
};

export function calculateLoanAgainstFd(input: LoanAgainstFdInput): LoanAgainstFdResult {
  const fdAmount = Math.max(0, input.fdAmount);
  const ltvPercent = Math.min(100, Math.max(0, input.ltvPercent));
  const maxLoan = (fdAmount * ltvPercent) / 100;
  const months = Math.max(0, Math.round(input.tenureMonths));
  const rate = Math.max(0, input.annualRatePercent);

  if (maxLoan <= 0 || months <= 0) {
    return {
      fdAmount,
      ltvPercent,
      maxLoan: 0,
      monthlyEmi: 0,
      totalInterest: 0,
      totalPayment: 0,
    };
  }

  const monthlyEmi = emi(maxLoan, rate, months);
  const totalPayment = monthlyEmi * months;
  const totalInterest = Math.max(0, totalPayment - maxLoan);

  return {
    fdAmount,
    ltvPercent,
    maxLoan,
    monthlyEmi,
    totalInterest,
    totalPayment,
  };
}
