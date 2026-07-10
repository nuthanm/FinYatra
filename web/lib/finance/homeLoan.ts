import { emi } from "@/lib/finance/compound";
import { emiYearly } from "@/lib/finance/projections";

/** Home loan EMI with Section 24(b) / 80C tax-benefit estimates (old regime). */

export type HomeLoanInput = {
  principal: number;
  annualRatePercent: number;
  years: number;
  /** Self-occupied: interest deduction capped at ₹2L under 24(b). */
  selfOccupied: boolean;
  /** Marginal tax slab % for benefit estimate (e.g. 30). */
  taxSlabPercent: number;
};

export type HomeLoanResult = {
  monthlyEmi: number;
  totalPayment: number;
  totalInterest: number;
  firstYearInterest: number;
  firstYearPrincipal: number;
  section24bDeduction: number;
  section80cPrincipal: number;
  estimatedAnnualTaxSaving: number;
};

const SECTION_24B_CAP = 200_000;
const SECTION_80C_CAP = 150_000;

export function calculateHomeLoan(input: HomeLoanInput): HomeLoanResult {
  const principal = Math.max(0, input.principal);
  const rate = Math.max(0, input.annualRatePercent);
  const years = Math.max(0, input.years);
  const months = Math.round(years * 12);
  const slab = Math.min(42, Math.max(0, input.taxSlabPercent)) / 100;

  if (principal <= 0 || months <= 0) {
    return {
      monthlyEmi: 0,
      totalPayment: 0,
      totalInterest: 0,
      firstYearInterest: 0,
      firstYearPrincipal: 0,
      section24bDeduction: 0,
      section80cPrincipal: 0,
      estimatedAnnualTaxSaving: 0,
    };
  }

  const monthlyEmi = emi(principal, rate, months);
  const totalPayment = monthlyEmi * months;
  const totalInterest = Math.max(0, totalPayment - principal);
  const yearly = emiYearly(principal, rate, years);
  const first = yearly[0] ?? { interestPaid: 0, principalPaid: 0 };

  const section24bDeduction = input.selfOccupied
    ? Math.min(first.interestPaid, SECTION_24B_CAP)
    : first.interestPaid; // let-out: interest generally fully deductible (simplified)
  const section80cPrincipal = Math.min(first.principalPaid, SECTION_80C_CAP);
  const estimatedAnnualTaxSaving = (section24bDeduction + section80cPrincipal) * slab;

  return {
    monthlyEmi,
    totalPayment,
    totalInterest,
    firstYearInterest: first.interestPaid,
    firstYearPrincipal: first.principalPaid,
    section24bDeduction,
    section80cPrincipal,
    estimatedAnnualTaxSaving,
  };
}
