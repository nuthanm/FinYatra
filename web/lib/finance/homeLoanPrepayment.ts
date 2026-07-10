import { emi } from "@/lib/finance/compound";

/** Compare reduce-EMI vs reduce-tenure after a lump-sum prepayment. */

export type HomeLoanPrepaymentInput = {
  outstandingPrincipal: number;
  annualRatePercent: number;
  remainingMonths: number;
  prepaymentAmount: number;
};

export type HomeLoanPrepaymentResult = {
  outstandingPrincipal: number;
  prepaymentApplied: number;
  newPrincipal: number;
  currentEmi: number;
  originalTotalInterest: number;
  /** Same remaining tenure, lower EMI. */
  reduceEmi: {
    emi: number;
    months: number;
    totalInterest: number;
    interestSaved: number;
  };
  /** Same EMI, shorter tenure. */
  reduceTenure: {
    emi: number;
    months: number;
    totalInterest: number;
    interestSaved: number;
  };
};

/** Months needed to amortize principal at a fixed EMI (reducing balance). */
export function monthsForEmi(
  principal: number,
  annualRatePercent: number,
  monthlyEmi: number,
): number {
  if (principal <= 0) return 0;
  if (monthlyEmi <= 0) return Infinity;
  const r = annualRatePercent / 100 / 12;
  if (r <= 0) return Math.ceil(principal / monthlyEmi);
  if (monthlyEmi <= principal * r) return Infinity;
  const n = Math.log(monthlyEmi / (monthlyEmi - principal * r)) / Math.log(1 + r);
  return Math.max(1, Math.ceil(n));
}

export function calculateHomeLoanPrepayment(input: HomeLoanPrepaymentInput): HomeLoanPrepaymentResult {
  const outstanding = Math.max(0, input.outstandingPrincipal);
  const rate = Math.max(0, input.annualRatePercent);
  const months = Math.max(0, Math.round(input.remainingMonths));
  const prepay = Math.min(outstanding, Math.max(0, input.prepaymentAmount));
  const newPrincipal = Math.max(0, outstanding - prepay);

  const currentEmi = emi(outstanding, rate, months);
  const originalTotalInterest = Math.max(0, currentEmi * months - outstanding);

  if (outstanding <= 0 || months <= 0) {
    return {
      outstandingPrincipal: outstanding,
      prepaymentApplied: prepay,
      newPrincipal,
      currentEmi: 0,
      originalTotalInterest: 0,
      reduceEmi: { emi: 0, months: 0, totalInterest: 0, interestSaved: 0 },
      reduceTenure: { emi: 0, months: 0, totalInterest: 0, interestSaved: 0 },
    };
  }

  if (newPrincipal <= 0) {
    return {
      outstandingPrincipal: outstanding,
      prepaymentApplied: prepay,
      newPrincipal: 0,
      currentEmi,
      originalTotalInterest,
      reduceEmi: { emi: 0, months: 0, totalInterest: 0, interestSaved: originalTotalInterest },
      reduceTenure: { emi: 0, months: 0, totalInterest: 0, interestSaved: originalTotalInterest },
    };
  }

  const reduceEmiAmount = emi(newPrincipal, rate, months);
  const reduceEmiInterest = Math.max(0, reduceEmiAmount * months - newPrincipal);

  const reduceTenureMonths = monthsForEmi(newPrincipal, rate, currentEmi);
  const cappedMonths = Number.isFinite(reduceTenureMonths)
    ? Math.min(months, reduceTenureMonths)
    : months;
  const reduceTenureInterest = Math.max(0, currentEmi * cappedMonths - newPrincipal);

  return {
    outstandingPrincipal: outstanding,
    prepaymentApplied: prepay,
    newPrincipal,
    currentEmi,
    originalTotalInterest,
    reduceEmi: {
      emi: reduceEmiAmount,
      months,
      totalInterest: reduceEmiInterest,
      interestSaved: Math.max(0, originalTotalInterest - reduceEmiInterest),
    },
    reduceTenure: {
      emi: currentEmi,
      months: cappedMonths,
      totalInterest: reduceTenureInterest,
      interestSaved: Math.max(0, originalTotalInterest - reduceTenureInterest),
    },
  };
}
