import { emi } from "@/lib/finance/compound";

/** Two-wheeler (bike/scooter) loan EMI from on-road price and down payment. */

export type TwoWheelerLoanInput = {
  onRoadPrice: number;
  downPayment: number;
  annualRatePercent: number;
  years: number;
};

export type TwoWheelerLoanResult = {
  loanAmount: number;
  monthlyEmi: number;
  totalInterest: number;
  totalPayment: number;
  downPaymentPercent: number;
};

export function calculateTwoWheelerLoan(input: TwoWheelerLoanInput): TwoWheelerLoanResult {
  const price = Math.max(0, input.onRoadPrice);
  const down = Math.min(price, Math.max(0, input.downPayment));
  const rate = Math.max(0, input.annualRatePercent);
  const years = Math.max(0, input.years);
  const months = Math.round(years * 12);
  const loanAmount = Math.max(0, price - down);
  const downPaymentPercent = price > 0 ? (down / price) * 100 : 0;

  if (loanAmount <= 0 || months <= 0) {
    return {
      loanAmount: 0,
      monthlyEmi: 0,
      totalInterest: 0,
      totalPayment: 0,
      downPaymentPercent,
    };
  }

  const monthlyEmi = emi(loanAmount, rate, months);
  const totalPayment = monthlyEmi * months;
  const totalInterest = Math.max(0, totalPayment - loanAmount);

  return { loanAmount, monthlyEmi, totalInterest, totalPayment, downPaymentPercent };
}
