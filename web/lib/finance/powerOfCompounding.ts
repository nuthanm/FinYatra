/** Power of compounding: yearly growth table + rule of 72 (educational). */

import { compoundInterest, ruleOf72 } from "@/lib/finance/compound";
import { compoundYearly } from "@/lib/finance/projections";

export type PowerOfCompoundingInput = {
  principal: number;
  annualRatePercent: number;
  years: number;
};

export type PowerOfCompoundingYearRow = {
  year: number;
  invested: number;
  value: number;
  gain: number;
};

export type PowerOfCompoundingResult = {
  principal: number;
  annualRatePercent: number;
  years: number;
  maturity: number;
  totalGain: number;
  yearsToDouble: number;
  rows: PowerOfCompoundingYearRow[];
};

export function calculatePowerOfCompounding(
  input: PowerOfCompoundingInput,
): PowerOfCompoundingResult {
  const principal = Math.max(0, input.principal);
  const annualRatePercent = Math.max(0, input.annualRatePercent);
  const years = Math.max(0, Math.min(50, Math.floor(input.years)));

  const maturity = compoundInterest(principal, annualRatePercent, years, 1);
  const rows = compoundYearly(principal, annualRatePercent, years, 1);
  const yearsToDouble = ruleOf72(annualRatePercent);

  return {
    principal,
    annualRatePercent,
    years,
    maturity,
    totalGain: maturity - principal,
    yearsToDouble,
    rows,
  };
}
