/** House property income — GAV → NAV (educational, Sec 22–27 style). */

export type HousePropertyIncomeInput = {
  gav: number;
  municipalTaxes: number;
  interestPaid: number;
  /** Marginal tax slab % applied to NAV. */
  taxSlabPercent: number;
};

export type HousePropertyIncomeResult = {
  gav: number;
  municipalTaxes: number;
  netAnnualValueBeforeStd: number;
  standardDeduction: number;
  interestPaid: number;
  nav: number;
  taxSlabPercent: number;
  estimatedTax: number;
};

const STD_DEDUCTION_RATE = 0.3;

export function calculateHousePropertyIncome(
  input: HousePropertyIncomeInput,
): HousePropertyIncomeResult {
  const gav = Math.max(0, input.gav);
  const municipalTaxes = Math.min(gav, Math.max(0, input.municipalTaxes));
  const interestPaid = Math.max(0, input.interestPaid);
  const taxSlabPercent = Math.min(42, Math.max(0, input.taxSlabPercent));

  const netAnnualValueBeforeStd = Math.max(0, gav - municipalTaxes);
  const standardDeduction = netAnnualValueBeforeStd * STD_DEDUCTION_RATE;
  const nav = netAnnualValueBeforeStd - standardDeduction - interestPaid;
  const estimatedTax = (Math.max(0, nav) * taxSlabPercent) / 100;

  return {
    gav,
    municipalTaxes,
    netAnnualValueBeforeStd,
    standardDeduction,
    interestPaid,
    nav,
    taxSlabPercent,
    estimatedTax,
  };
}
