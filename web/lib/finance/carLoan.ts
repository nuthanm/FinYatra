import { emi } from "@/lib/finance/compound";
import { emiYearly } from "@/lib/finance/projections";

/** Car loan EMI with optional insurance financed and simple prepayment impact. */

export type CarLoanInput = {
  carPrice: number;
  downPayment: number;
  annualRatePercent: number;
  years: number;
  /** Optional insurance / accessories added to the financed amount. */
  insuranceAmount: number;
  /** Optional one-time prepayment after year 1 (illustrative). */
  prepaymentAfterYear1: number;
};

export type CarLoanResult = {
  loanAmount: number;
  monthlyEmi: number;
  totalPayment: number;
  totalInterest: number;
  downPaymentPercent: number;
  /** Interest saved if prepayment is applied after year 1 (simplified). */
  interestSavedByPrepay: number;
  revisedEmiAfterPrepay: number;
};

export function calculateCarLoan(input: CarLoanInput): CarLoanResult {
  const price = Math.max(0, input.carPrice);
  const down = Math.min(price, Math.max(0, input.downPayment));
  const insurance = Math.max(0, input.insuranceAmount);
  const rate = Math.max(0, input.annualRatePercent);
  const years = Math.max(0, input.years);
  const months = Math.round(years * 12);
  const loanAmount = Math.max(0, price - down + insurance);
  const prepay = Math.max(0, input.prepaymentAfterYear1);

  if (loanAmount <= 0 || months <= 0) {
    return {
      loanAmount: 0,
      monthlyEmi: 0,
      totalPayment: 0,
      totalInterest: 0,
      downPaymentPercent: price > 0 ? (down / price) * 100 : 0,
      interestSavedByPrepay: 0,
      revisedEmiAfterPrepay: 0,
    };
  }

  const monthlyEmi = emi(loanAmount, rate, months);
  const totalPayment = monthlyEmi * months;
  const totalInterest = Math.max(0, totalPayment - loanAmount);

  let interestSavedByPrepay = 0;
  let revisedEmiAfterPrepay = monthlyEmi;

  if (prepay > 0 && years > 1) {
    const year1 = emiYearly(loanAmount, rate, years)[0];
    const balanceAfterYear1 = year1?.balance ?? loanAmount;
    const newBalance = Math.max(0, balanceAfterYear1 - Math.min(prepay, balanceAfterYear1));
    const remainingMonths = Math.max(1, months - 12);
    revisedEmiAfterPrepay = emi(newBalance, rate, remainingMonths);
    const remainingInterestOriginal = Math.max(0, monthlyEmi * remainingMonths - balanceAfterYear1);
    const remainingInterestNew = Math.max(0, revisedEmiAfterPrepay * remainingMonths - newBalance);
    interestSavedByPrepay = Math.max(0, remainingInterestOriginal - remainingInterestNew);
  }

  return {
    loanAmount,
    monthlyEmi,
    totalPayment,
    totalInterest,
    downPaymentPercent: price > 0 ? (down / price) * 100 : 0,
    interestSavedByPrepay,
    revisedEmiAfterPrepay,
  };
}
