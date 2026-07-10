import { fdMaturity, fdYearlyRows, type FdCompounding, type FdResult } from "@/lib/finance/fd";

/** Tax-saving fixed deposit — 5-year lock-in, Section 80C (illustrative). */

export const TAX_SAVING_FD_LOCKIN_YEARS = 5;
export const TAX_SAVING_FD_80C_LIMIT = 150_000;
export const TAX_SAVING_FD_DEFAULT_RATE = 7.0;

export type TaxSavingFdCompounding = 1 | 4; // annual | quarterly

export type TaxSavingFdInput = {
  deposit: number;
  annualRatePercent: number;
  compoundsPerYear: TaxSavingFdCompounding;
  taxSlabPercent: number;
};

export type TaxSavingFdResult = {
  deposit: number;
  eligible80c: number;
  overLimit: number;
  maturity: number;
  interest: number;
  effectiveRate: number;
  estimatedTaxSaving: number;
  fd: FdResult;
};

export function calculateTaxSavingFd(input: TaxSavingFdInput): TaxSavingFdResult {
  const deposit = Math.max(0, input.deposit);
  const rate = Math.max(0, input.annualRatePercent);
  const n = input.compoundsPerYear as FdCompounding;
  const fd = fdMaturity(deposit, rate, TAX_SAVING_FD_LOCKIN_YEARS, n);

  const eligible80c = Math.min(deposit, TAX_SAVING_FD_80C_LIMIT);
  const overLimit = Math.max(0, deposit - TAX_SAVING_FD_80C_LIMIT);
  const slab = Math.min(42, Math.max(0, input.taxSlabPercent)) / 100;

  return {
    deposit,
    eligible80c,
    overLimit,
    maturity: fd.maturity,
    interest: fd.interest,
    effectiveRate: fd.effectiveRate,
    estimatedTaxSaving: eligible80c * slab,
    fd,
  };
}

export function taxSavingFdYearlyRows(
  deposit: number,
  annualRatePercent: number,
  compoundsPerYear: TaxSavingFdCompounding,
) {
  return fdYearlyRows(deposit, annualRatePercent, TAX_SAVING_FD_LOCKIN_YEARS, compoundsPerYear);
}
