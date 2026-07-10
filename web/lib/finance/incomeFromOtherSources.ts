/**
 * Income from other sources (IFOS) — interest / other income taxed at slab (educational).
 * Optional 80TTA/80TTB-style deduction on savings interest only.
 */

import { section80ttaLimit } from "@/lib/finance/section80tta";

const CESS = 0.04;

export type IncomeFromOtherSourcesInput = {
  /** Savings / FD interest (₹). */
  interestIncome: number;
  /** Other IFOS: gifts taxable, family pension, lottery share, etc. (₹). */
  otherIncome: number;
  taxSlabPercent: number;
  /** Apply 80TTA (₹10k) or 80TTB (₹50k) on interest only. */
  apply80tta: boolean;
  isSenior?: boolean;
};

export type IncomeFromOtherSourcesResult = {
  interestIncome: number;
  otherIncome: number;
  grossIfos: number;
  deduction80tta: number;
  taxableIfos: number;
  taxSlabPercent: number;
  taxBeforeCess: number;
  cess: number;
  totalTax: number;
  effectiveRate: number;
};

export function calculateIncomeFromOtherSources(
  input: IncomeFromOtherSourcesInput,
): IncomeFromOtherSourcesResult {
  const interestIncome = Math.max(0, input.interestIncome);
  const otherIncome = Math.max(0, input.otherIncome);
  const taxSlabPercent = Math.min(42, Math.max(0, input.taxSlabPercent));
  const grossIfos = interestIncome + otherIncome;

  const limit = section80ttaLimit(Boolean(input.isSenior));
  const deduction80tta = input.apply80tta ? Math.min(interestIncome, limit) : 0;
  const taxableIfos = Math.max(0, grossIfos - deduction80tta);

  const taxBeforeCess = (taxableIfos * taxSlabPercent) / 100;
  const cess = taxBeforeCess * CESS;
  const totalTax = taxBeforeCess + cess;
  const effectiveRate = grossIfos > 0 ? (totalTax / grossIfos) * 100 : 0;

  return {
    interestIncome,
    otherIncome,
    grossIfos,
    deduction80tta,
    taxableIfos,
    taxSlabPercent,
    taxBeforeCess,
    cess,
    totalTax,
    effectiveRate,
  };
}
