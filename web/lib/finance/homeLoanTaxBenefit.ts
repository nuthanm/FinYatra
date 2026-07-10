import { calculateHomeLoan } from "@/lib/finance/homeLoan";

/** Section 24(b) + 80C home-loan tax benefit (old regime, educational). */

export type HomeLoanTaxBenefitInput = {
  /** First-year interest paid (₹). If principal/rate/years given via loan fields, can derive. */
  annualInterest: number;
  /** First-year principal repaid (₹). */
  annualPrincipal: number;
  selfOccupied: boolean;
  /** Marginal slab % (old regime). */
  taxSlabPercent: number;
  /**
   * Old regime: 24(b)+80C apply. New regime: typically no these deductions (simplified).
   */
  oldRegime: boolean;
};

export type HomeLoanTaxBenefitResult = {
  annualInterest: number;
  annualPrincipal: number;
  selfOccupied: boolean;
  oldRegime: boolean;
  taxSlabPercent: number;
  section24bDeduction: number;
  section80cPrincipal: number;
  totalDeduction: number;
  estimatedTaxSaving: number;
};

const SECTION_24B_CAP = 200_000;
const SECTION_80C_CAP = 150_000;

export function calculateHomeLoanTaxBenefit(
  input: HomeLoanTaxBenefitInput,
): HomeLoanTaxBenefitResult {
  const annualInterest = Math.max(0, input.annualInterest);
  const annualPrincipal = Math.max(0, input.annualPrincipal);
  const taxSlabPercent = Math.min(42, Math.max(0, input.taxSlabPercent));
  const slab = taxSlabPercent / 100;

  if (!input.oldRegime) {
    return {
      annualInterest,
      annualPrincipal,
      selfOccupied: input.selfOccupied,
      oldRegime: false,
      taxSlabPercent,
      section24bDeduction: 0,
      section80cPrincipal: 0,
      totalDeduction: 0,
      estimatedTaxSaving: 0,
    };
  }

  const section24bDeduction = input.selfOccupied
    ? Math.min(annualInterest, SECTION_24B_CAP)
    : annualInterest;
  const section80cPrincipal = Math.min(annualPrincipal, SECTION_80C_CAP);
  const totalDeduction = section24bDeduction + section80cPrincipal;
  const estimatedTaxSaving = totalDeduction * slab;

  return {
    annualInterest,
    annualPrincipal,
    selfOccupied: input.selfOccupied,
    oldRegime: true,
    taxSlabPercent,
    section24bDeduction,
    section80cPrincipal,
    totalDeduction,
    estimatedTaxSaving,
  };
}

/** Derive first-year interest/principal from loan terms, then apply tax benefit. */
export function calculateHomeLoanTaxBenefitFromLoan(input: {
  principal: number;
  annualRatePercent: number;
  years: number;
  selfOccupied: boolean;
  taxSlabPercent: number;
  oldRegime: boolean;
}): HomeLoanTaxBenefitResult {
  const loan = calculateHomeLoan({
    principal: input.principal,
    annualRatePercent: input.annualRatePercent,
    years: input.years,
    selfOccupied: input.selfOccupied,
    taxSlabPercent: input.taxSlabPercent,
  });
  return calculateHomeLoanTaxBenefit({
    annualInterest: loan.firstYearInterest,
    annualPrincipal: loan.firstYearPrincipal,
    selfOccupied: input.selfOccupied,
    taxSlabPercent: input.taxSlabPercent,
    oldRegime: input.oldRegime,
  });
}
