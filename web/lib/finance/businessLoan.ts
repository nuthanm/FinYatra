import { emi } from "@/lib/finance/compound";

/**
 * Business / MSME loan EMI with optional moratorium months.
 * Moratorium capitalises simple interest on the original principal, then EMI starts.
 */

export type BusinessLoanInput = {
  principal: number;
  annualRatePercent: number;
  years: number;
  /** Optional moratorium in months; simple interest is capitalised before EMI. */
  moratoriumMonths: number;
};

export type BusinessLoanResult = {
  accruedInterestDuringMoratorium: number;
  repaymentPrincipal: number;
  monthlyEmi: number;
  totalPayment: number;
  totalInterestDuringRepayment: number;
  totalInterestOverall: number;
  repaymentMonths: number;
};

export function calculateBusinessLoan(input: BusinessLoanInput): BusinessLoanResult {
  const principal = Math.max(0, input.principal);
  const rate = Math.max(0, input.annualRatePercent);
  const years = Math.max(0, input.years);
  const repaymentMonths = Math.round(years * 12);
  const moratoriumMonths = Math.max(0, Math.round(input.moratoriumMonths));

  const accruedInterestDuringMoratorium = principal * (rate / 100) * (moratoriumMonths / 12);
  const repaymentPrincipal = principal + accruedInterestDuringMoratorium;

  if (repaymentPrincipal <= 0 || repaymentMonths <= 0) {
    return {
      accruedInterestDuringMoratorium,
      repaymentPrincipal,
      monthlyEmi: 0,
      totalPayment: 0,
      totalInterestDuringRepayment: 0,
      totalInterestOverall: accruedInterestDuringMoratorium,
      repaymentMonths: 0,
    };
  }

  const monthlyEmi = emi(repaymentPrincipal, rate, repaymentMonths);
  const totalPayment = monthlyEmi * repaymentMonths;
  const totalInterestDuringRepayment = Math.max(0, totalPayment - repaymentPrincipal);
  const totalInterestOverall = accruedInterestDuringMoratorium + totalInterestDuringRepayment;

  return {
    accruedInterestDuringMoratorium,
    repaymentPrincipal,
    monthlyEmi,
    totalPayment,
    totalInterestDuringRepayment,
    totalInterestOverall,
    repaymentMonths,
  };
}
