import { emi } from "@/lib/finance/compound";
import { compareFlatVsReducing } from "@/lib/finance/flatVsReducing";

/** Credit-card / consumer EMI: reducing balance with flat-rate comparison. */

export type CreditCardEmiInput = {
  purchaseAmount: number;
  tenureMonths: number;
  /** Interest rate as entered by the user. */
  ratePercent: number;
  /** When true, `ratePercent` is monthly; otherwise annual. */
  rateIsMonthly: boolean;
};

export type CreditCardEmiResult = {
  purchaseAmount: number;
  months: number;
  annualRatePercent: number;
  monthlyRatePercent: number;
  reducingEmi: number;
  reducingTotalInterest: number;
  reducingTotalPayment: number;
  flatEmi: number;
  flatTotalInterest: number;
  flatTotalPayment: number;
  interestDifference: number;
  emiDifference: number;
};

export function calculateCreditCardEmi(input: CreditCardEmiInput): CreditCardEmiResult {
  const purchaseAmount = Math.max(0, input.purchaseAmount);
  const months = Math.max(0, Math.round(input.tenureMonths));
  const ratePercent = Math.max(0, input.ratePercent);

  const annualRatePercent = input.rateIsMonthly ? ratePercent * 12 : ratePercent;
  const monthlyRatePercent = input.rateIsMonthly ? ratePercent : ratePercent / 12;
  const years = months / 12;

  if (purchaseAmount <= 0 || months <= 0) {
    return {
      purchaseAmount,
      months: 0,
      annualRatePercent,
      monthlyRatePercent,
      reducingEmi: 0,
      reducingTotalInterest: 0,
      reducingTotalPayment: 0,
      flatEmi: 0,
      flatTotalInterest: 0,
      flatTotalPayment: 0,
      interestDifference: 0,
      emiDifference: 0,
    };
  }

  const cmp = compareFlatVsReducing(purchaseAmount, annualRatePercent, years);
  const reducingEmi = emi(purchaseAmount, annualRatePercent, months);
  const reducingTotalPayment = reducingEmi * months;
  const reducingTotalInterest = Math.max(0, reducingTotalPayment - purchaseAmount);

  return {
    purchaseAmount,
    months,
    annualRatePercent,
    monthlyRatePercent,
    reducingEmi,
    reducingTotalInterest,
    reducingTotalPayment,
    flatEmi: cmp.flatEmi,
    flatTotalInterest: cmp.flatTotalInterest,
    flatTotalPayment: cmp.flatTotalPayment,
    interestDifference: cmp.interestDifference,
    emiDifference: cmp.emiDifference,
  };
}
