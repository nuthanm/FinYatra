/**
 * Under-construction home loan — pre-possession interest + EMI after possession (educational).
 */

import { emi } from "@/lib/finance/compound";

export type UnderConstructionEmiInput = {
  loanAmount: number;
  annualRatePercent: number;
  /** Months before possession (simple interest on disbursed amount). */
  prePossessionMonths: number;
  /** Fraction of loan disbursed during construction (0–1). Default 0.7. */
  disbursedFraction?: number;
  /** Tenure after possession (months). */
  postPossessionMonths: number;
};

export type UnderConstructionEmiResult = {
  loanAmount: number;
  annualRatePercent: number;
  prePossessionMonths: number;
  disbursedAmount: number;
  /** Simple interest during construction on disbursed amount. */
  prePossessionInterest: number;
  monthlyEmi: number;
  postPossessionMonths: number;
  totalEmiPayments: number;
  totalInterestPost: number;
  /** Pre-possession interest + post EMI interest. */
  totalInterestAll: number;
};

export function calculateUnderConstructionEmi(input: UnderConstructionEmiInput): UnderConstructionEmiResult {
  const loanAmount = Math.max(0, input.loanAmount);
  const annualRatePercent = Math.max(0, input.annualRatePercent);
  const prePossessionMonths = Math.max(0, Math.floor(input.prePossessionMonths));
  const frac = Math.min(1, Math.max(0, input.disbursedFraction ?? 0.7));
  const postPossessionMonths = Math.max(0, Math.floor(input.postPossessionMonths));
  const disbursedAmount = loanAmount * frac;

  const monthlyRate = annualRatePercent / 12 / 100;
  const prePossessionInterest = disbursedAmount * monthlyRate * prePossessionMonths;

  const monthlyEmi =
    loanAmount > 0 && postPossessionMonths > 0
      ? emi(loanAmount, annualRatePercent, postPossessionMonths)
      : 0;
  const totalEmiPayments = monthlyEmi * postPossessionMonths;
  const totalInterestPost = Math.max(0, totalEmiPayments - loanAmount);
  const totalInterestAll = prePossessionInterest + totalInterestPost;

  return {
    loanAmount,
    annualRatePercent,
    prePossessionMonths,
    disbursedAmount,
    prePossessionInterest,
    monthlyEmi,
    postPossessionMonths,
    totalEmiPayments,
    totalInterestPost,
    totalInterestAll,
  };
}
