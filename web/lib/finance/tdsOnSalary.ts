/**
 * Section 192-style monthly TDS estimate from annual tax liability (educational).
 */

import { compareIncomeTax, type TaxAge, type TaxRegime } from "@/lib/finance/incomeTax";

export type TdsOnSalaryInput = {
  annualGross: number;
  age?: TaxAge;
  /** Old-regime deductions (80C, 80D, HRA, etc.). Ignored under new regime. */
  deductions?: number;
  regime?: TaxRegime;
};

export type TdsOnSalaryResult = {
  regime: TaxRegime;
  annualTax: number;
  monthlyTds: number;
  taxableIncome: number;
  standardDeduction: number;
  rebate: number;
  otherRegimeTax: number;
  otherRegimeMonthly: number;
  betterRegime: TaxRegime;
};

export function calculateTdsOnSalary(input: TdsOnSalaryInput): TdsOnSalaryResult {
  const annualGross = Math.max(0, input.annualGross);
  const age = input.age ?? "below60";
  const deductions = Math.max(0, input.deductions ?? 0);
  const regime = input.regime ?? "new";

  const comparison = compareIncomeTax({
    grossIncome: annualGross,
    age,
    deductions,
    isSalaried: true,
  });

  const chosen = regime === "old" ? comparison.old : comparison.new;
  const other = regime === "old" ? comparison.new : comparison.old;

  return {
    regime,
    annualTax: chosen.totalTax,
    monthlyTds: chosen.totalTax / 12,
    taxableIncome: chosen.taxableIncome,
    standardDeduction: chosen.standardDeduction,
    rebate: chosen.rebate,
    otherRegimeTax: other.totalTax,
    otherRegimeMonthly: other.totalTax / 12,
    betterRegime: comparison.better,
  };
}
