import { emi } from "@/lib/finance/compound";

export type FlatVsReducingResult = {
  principal: number;
  months: number;
  flatTotalInterest: number;
  flatEmi: number;
  flatTotalPayment: number;
  reducingEmi: number;
  reducingTotalInterest: number;
  reducingTotalPayment: number;
  emiDifference: number;
  interestDifference: number;
};

/**
 * Compare flat-rate interest vs reducing-balance EMI for the same principal, rate, and tenure.
 * Flat: totalInterest = P × rate% × years; EMI = (P + totalInterest) / months.
 * Reducing: standard amortising EMI.
 */
export function compareFlatVsReducing(
  principal: number,
  annualRatePercent: number,
  years: number,
): FlatVsReducingResult {
  const p = Math.max(0, principal);
  const rate = Math.max(0, annualRatePercent);
  const y = Math.max(0, years);
  const months = Math.max(0, Math.round(y * 12));

  const flatTotalInterest = p * (rate / 100) * y;
  const flatTotalPayment = p + flatTotalInterest;
  const flatEmi = months > 0 ? flatTotalPayment / months : 0;

  const reducingEmi = emi(p, rate, months);
  const reducingTotalPayment = reducingEmi * months;
  const reducingTotalInterest = Math.max(0, reducingTotalPayment - p);

  return {
    principal: p,
    months,
    flatTotalInterest,
    flatEmi,
    flatTotalPayment,
    reducingEmi,
    reducingTotalInterest,
    reducingTotalPayment,
    emiDifference: flatEmi - reducingEmi,
    interestDifference: flatTotalInterest - reducingTotalInterest,
  };
}
