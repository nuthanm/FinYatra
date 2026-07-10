import { emi } from "@/lib/finance/compound";

/** Compare staying on current loan vs transferring to a lower rate (with fee). */

export type LoanBalanceTransferInput = {
  outstanding: number;
  currentRatePercent: number;
  remainingMonths: number;
  newRatePercent: number;
  /** Processing / transfer fee as % of outstanding. */
  processingFeePercent: number;
};

export type LoanBalanceTransferResult = {
  outstanding: number;
  remainingMonths: number;
  currentEmi: number;
  currentTotalInterest: number;
  currentTotalPayment: number;
  newEmi: number;
  newTotalInterest: number;
  newTotalPayment: number;
  processingFee: number;
  /** Interest saved before fee. */
  interestSaved: number;
  /** Interest saved minus processing fee. */
  netSavings: number;
  monthlyEmiSaving: number;
  /**
   * Months until processing fee is recovered via lower EMI.
   * Infinity when there is no monthly EMI saving.
   */
  breakEvenMonths: number;
  worthTransferring: boolean;
};

export function calculateLoanBalanceTransfer(
  input: LoanBalanceTransferInput,
): LoanBalanceTransferResult {
  const outstanding = Math.max(0, input.outstanding);
  const currentRate = Math.max(0, input.currentRatePercent);
  const newRate = Math.max(0, input.newRatePercent);
  const months = Math.max(0, Math.round(input.remainingMonths));
  const feePct = Math.max(0, input.processingFeePercent);
  const processingFee = outstanding * (feePct / 100);

  if (outstanding <= 0 || months <= 0) {
    return {
      outstanding,
      remainingMonths: 0,
      currentEmi: 0,
      currentTotalInterest: 0,
      currentTotalPayment: 0,
      newEmi: 0,
      newTotalInterest: 0,
      newTotalPayment: 0,
      processingFee,
      interestSaved: 0,
      netSavings: -processingFee,
      monthlyEmiSaving: 0,
      breakEvenMonths: Infinity,
      worthTransferring: false,
    };
  }

  const currentEmi = emi(outstanding, currentRate, months);
  const currentTotalPayment = currentEmi * months;
  const currentTotalInterest = Math.max(0, currentTotalPayment - outstanding);

  const newEmi = emi(outstanding, newRate, months);
  const newTotalPayment = newEmi * months;
  const newTotalInterest = Math.max(0, newTotalPayment - outstanding);

  const interestSaved = currentTotalInterest - newTotalInterest;
  const netSavings = interestSaved - processingFee;
  const monthlyEmiSaving = currentEmi - newEmi;
  const breakEvenMonths =
    monthlyEmiSaving > 1e-9 ? processingFee / monthlyEmiSaving : Infinity;

  return {
    outstanding,
    remainingMonths: months,
    currentEmi,
    currentTotalInterest,
    currentTotalPayment,
    newEmi,
    newTotalInterest,
    newTotalPayment,
    processingFee,
    interestSaved,
    netSavings,
    monthlyEmiSaving,
    breakEvenMonths,
    worthTransferring: netSavings > 0,
  };
}
