/** House property rental income tax (educational — Sec 24 style). */

export const RENTAL_STANDARD_DEDUCTION_PCT = 30;

export type RentalIncomeTaxInput = {
  annualRent: number;
  municipalTaxes: number;
  /** Marginal tax slab % (e.g. 5, 20, 30). */
  taxSlabPercent: number;
};

export type RentalIncomeTaxResult = {
  annualRent: number;
  municipalTaxes: number;
  netAnnualValue: number;
  standardDeduction: number;
  taxableIncome: number;
  estimatedTax: number;
  taxSlabPercent: number;
};

/**
 * Taxable house-property income ≈ (annual rent − municipal taxes) − 30% standard deduction.
 * Tax estimate = taxable × marginal slab (simplified; ignores other income stacking).
 */
export function calculateRentalIncomeTax(input: RentalIncomeTaxInput): RentalIncomeTaxResult {
  const annualRent = Math.max(0, input.annualRent);
  const municipalTaxes = Math.min(annualRent, Math.max(0, input.municipalTaxes));
  const taxSlabPercent = Math.min(42, Math.max(0, input.taxSlabPercent));

  const netAnnualValue = Math.max(0, annualRent - municipalTaxes);
  const standardDeduction = (netAnnualValue * RENTAL_STANDARD_DEDUCTION_PCT) / 100;
  const taxableIncome = Math.max(0, netAnnualValue - standardDeduction);
  const estimatedTax = (taxableIncome * taxSlabPercent) / 100;

  return {
    annualRent,
    municipalTaxes,
    netAnnualValue,
    standardDeduction,
    taxableIncome,
    estimatedTax,
    taxSlabPercent,
  };
}
