import { emi, futureValue } from "@/lib/finance/compound";

/** Simplified property equity + rent income over a hold period. */

export type RealEstateInput = {
  propertyPrice: number;
  /** Down payment as % of property price. */
  downPaymentPercent: number;
  loanRatePercent: number;
  /** Loan tenure in years. */
  loanTenureYears: number;
  /** Expected annual property appreciation %. */
  appreciationPercent: number;
  /** Gross annual rent as % of property price (yield). */
  rentYieldPercent: number;
  /** Analysis horizon in years. */
  holdYears: number;
};

export type RealEstateResult = {
  propertyPrice: number;
  downPayment: number;
  loanAmount: number;
  monthlyEmi: number;
  futurePropertyValue: number;
  /** Principal repaid over hold (capped at loan). */
  principalPaid: number;
  /** Remaining loan balance after hold years. */
  loanBalance: number;
  /** Equity ≈ future value − remaining loan. */
  equity: number;
  /** Cumulative gross rent over hold (no vacancy/tax). */
  totalRentIncome: number;
  /** Equity + rent − down payment (illustrative net). */
  illustrativeNet: number;
};

export function calculateRealEstate(input: RealEstateInput): RealEstateResult {
  const price = Math.max(0, input.propertyPrice);
  const downPct = Math.min(100, Math.max(0, input.downPaymentPercent));
  const downPayment = (price * downPct) / 100;
  const loanAmount = Math.max(0, price - downPayment);
  const rate = Math.max(0, input.loanRatePercent);
  const tenureYears = Math.max(0, input.loanTenureYears);
  const tenureMonths = Math.round(tenureYears * 12);
  const holdYears = Math.max(0, input.holdYears);
  const holdMonths = Math.min(tenureMonths, Math.round(holdYears * 12));
  const appreciation = Math.max(0, input.appreciationPercent);
  const yieldPct = Math.max(0, input.rentYieldPercent);

  const monthlyEmi = emi(loanAmount, rate, tenureMonths);
  const futurePropertyValue = futureValue(price, appreciation, holdYears);

  // Approximate amortisation: interest portion ≈ balance × monthly rate; rest principal.
  let balance = loanAmount;
  let principalPaid = 0;
  const r = rate / 100 / 12;
  for (let m = 0; m < holdMonths && balance > 0; m++) {
    const interest = r > 0 ? balance * r : 0;
    const principalPart = Math.min(balance, Math.max(0, monthlyEmi - interest));
    balance -= principalPart;
    principalPaid += principalPart;
  }
  if (holdMonths >= tenureMonths) {
    balance = 0;
    principalPaid = loanAmount;
  }

  const annualRent = (price * yieldPct) / 100;
  const totalRentIncome = annualRent * holdYears;
  const equity = Math.max(0, futurePropertyValue - balance);
  const illustrativeNet = equity + totalRentIncome - downPayment;

  return {
    propertyPrice: price,
    downPayment,
    loanAmount,
    monthlyEmi,
    futurePropertyValue,
    principalPaid,
    loanBalance: Math.max(0, balance),
    equity,
    totalRentIncome,
    illustrativeNet,
  };
}
