/** Gross / net rental yield on investment property (educational). */

export type RentalYieldInput = {
  /** Property value / purchase price (₹). */
  propertyValue: number;
  /** Annual rent received (₹). Or monthly × 12 if you pass monthly via UI. */
  annualRent: number;
  /** Annual expenses: tax, maintenance, insurance, vacancy (₹). */
  annualExpenses?: number;
};

export type RentalYieldResult = {
  propertyValue: number;
  annualRent: number;
  annualExpenses: number;
  netRent: number;
  grossYieldPercent: number;
  netYieldPercent: number;
};

export function calculateRentalYield(input: RentalYieldInput): RentalYieldResult {
  const propertyValue = Math.max(0, input.propertyValue);
  const annualRent = Math.max(0, input.annualRent);
  const annualExpenses = Math.max(0, input.annualExpenses ?? 0);
  const netRent = Math.max(0, annualRent - annualExpenses);

  const grossYieldPercent = propertyValue > 0 ? (annualRent / propertyValue) * 100 : 0;
  const netYieldPercent = propertyValue > 0 ? (netRent / propertyValue) * 100 : 0;

  return {
    propertyValue,
    annualRent,
    annualExpenses,
    netRent,
    grossYieldPercent,
    netYieldPercent,
  };
}
