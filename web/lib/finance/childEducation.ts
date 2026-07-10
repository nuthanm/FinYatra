import { inflate, sipRequired } from "@/lib/finance/compound";

/** Future education cost with inflation + SIP to fund it. */

export type ChildEducationInput = {
  currentCost: number;
  yearsUntilNeeded: number;
  inflationPercent: number;
  expectedReturnPercent: number;
};

export type ChildEducationResult = {
  currentCost: number;
  yearsUntilNeeded: number;
  futureCost: number;
  monthlySip: number;
  totalInvested: number;
  months: number;
};

export function calculateChildEducation(input: ChildEducationInput): ChildEducationResult {
  const currentCost = Math.max(0, input.currentCost);
  const years = Math.max(0, input.yearsUntilNeeded);
  const inflation = Math.max(0, input.inflationPercent);
  const rate = Math.max(0, input.expectedReturnPercent);
  const futureCost = inflate(currentCost, inflation, years);
  const months = Math.round(years * 12);
  const monthlySip = sipRequired(futureCost, rate, months);
  return {
    currentCost,
    yearsUntilNeeded: years,
    futureCost,
    monthlySip,
    totalInvested: monthlySip * months,
    months,
  };
}
