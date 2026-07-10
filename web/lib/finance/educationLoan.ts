import { emi } from "@/lib/finance/compound";
import { emiYearly } from "@/lib/finance/projections";

/**
 * Education loan with moratorium: simple interest accrues during study years,
 * is capitalised at repayment start, then standard EMI. Section 80E tax estimate.
 */

export type EducationLoanInput = {
  principal: number;
  annualRatePercent: number;
  /** Course / moratorium years (interest accrues, no EMI). */
  courseYears: number;
  /** Repayment tenure after course (years). */
  repaymentYears: number;
  /** Marginal tax slab % for 80E benefit estimate. */
  taxSlabPercent: number;
};

export type EducationLoanResult = {
  accruedInterestDuringCourse: number;
  repaymentPrincipal: number;
  monthlyEmi: number;
  totalInterestDuringRepayment: number;
  totalInterestOverall: number;
  totalPayment: number;
  firstYearInterest: number;
  estimatedAnnualTaxSaving80e: number;
};

export function calculateEducationLoan(input: EducationLoanInput): EducationLoanResult {
  const principal = Math.max(0, input.principal);
  const rate = Math.max(0, input.annualRatePercent);
  const courseYears = Math.max(0, input.courseYears);
  const repaymentYears = Math.max(0, input.repaymentYears);
  const months = Math.round(repaymentYears * 12);
  const slab = Math.min(42, Math.max(0, input.taxSlabPercent)) / 100;

  const accruedInterestDuringCourse = principal * (rate / 100) * courseYears;
  const repaymentPrincipal = principal + accruedInterestDuringCourse;

  if (repaymentPrincipal <= 0 || months <= 0) {
    return {
      accruedInterestDuringCourse,
      repaymentPrincipal,
      monthlyEmi: 0,
      totalInterestDuringRepayment: 0,
      totalInterestOverall: accruedInterestDuringCourse,
      totalPayment: 0,
      firstYearInterest: 0,
      estimatedAnnualTaxSaving80e: 0,
    };
  }

  const monthlyEmi = emi(repaymentPrincipal, rate, months);
  const totalPayment = monthlyEmi * months;
  const totalInterestDuringRepayment = Math.max(0, totalPayment - repaymentPrincipal);
  const totalInterestOverall = accruedInterestDuringCourse + totalInterestDuringRepayment;
  const yearly = emiYearly(repaymentPrincipal, rate, repaymentYears);
  const firstYearInterest = yearly[0]?.interestPaid ?? 0;
  // 80E: interest on education loan fully deductible (old regime) — no monetary cap.
  const estimatedAnnualTaxSaving80e = firstYearInterest * slab;

  return {
    accruedInterestDuringCourse,
    repaymentPrincipal,
    monthlyEmi,
    totalInterestDuringRepayment,
    totalInterestOverall,
    totalPayment,
    firstYearInterest,
    estimatedAnnualTaxSaving80e,
  };
}
