import { emi } from "@/lib/finance/compound";

/** Invert EMI formula: solve annual interest rate from principal, EMI, and tenure. */

export type EmiToRateInput = {
  principal: number;
  monthlyEmi: number;
  tenureMonths: number;
};

export type EmiToRateResult = {
  principal: number;
  monthlyEmi: number;
  months: number;
  /** Implied annual interest rate (%). */
  annualRatePercent: number;
  /** Monthly rate equivalent (%). */
  monthlyRatePercent: number;
  totalPayment: number;
  totalInterest: number;
  /** True when EMI is too low to amortize principal (even at 0%). */
  impossible: boolean;
};

/**
 * Binary-search annual rate so that emi(P, rate, n) ≈ target EMI.
 * Returns 0 when EMI equals principal/n (zero interest).
 */
export function rateFromEmi(principal: number, monthlyEmi: number, months: number): number {
  if (principal <= 0 || months <= 0 || monthlyEmi <= 0) return 0;

  const zeroRateEmi = principal / months;
  if (monthlyEmi <= zeroRateEmi + 1e-9) return 0;

  let lo = 0;
  let hi = 500;
  // Ensure target is reachable within search bounds
  for (let expand = 0; expand < 8 && emi(principal, hi, months) < monthlyEmi; expand++) {
    hi *= 2;
  }

  for (let i = 0; i < 80; i++) {
    const mid = (lo + hi) / 2;
    const computed = emi(principal, mid, months);
    if (computed > monthlyEmi) hi = mid;
    else lo = mid;
  }

  return (lo + hi) / 2;
}

export function calculateEmiToRate(input: EmiToRateInput): EmiToRateResult {
  const principal = Math.max(0, input.principal);
  const monthlyEmi = Math.max(0, input.monthlyEmi);
  const months = Math.max(0, Math.round(input.tenureMonths));
  const totalPayment = monthlyEmi * months;
  const totalInterest = Math.max(0, totalPayment - principal);

  if (principal <= 0 || months <= 0 || monthlyEmi <= 0) {
    return {
      principal,
      monthlyEmi,
      months: 0,
      annualRatePercent: 0,
      monthlyRatePercent: 0,
      totalPayment: 0,
      totalInterest: 0,
      impossible: false,
    };
  }

  const zeroRateEmi = principal / months;
  const impossible = monthlyEmi + 1e-9 < zeroRateEmi;
  const annualRatePercent = impossible ? 0 : rateFromEmi(principal, monthlyEmi, months);

  return {
    principal,
    monthlyEmi,
    months,
    annualRatePercent,
    monthlyRatePercent: annualRatePercent / 12,
    totalPayment,
    totalInterest,
    impossible,
  };
}
