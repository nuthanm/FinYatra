import { sipRequired } from "@/lib/finance/compound";

export type GoalSipInput = {
  targetAmount: number;
  years: number;
  expectedReturnPercent: number;
};

export type GoalSipResult = {
  monthlySip: number;
  totalInvested: number;
  months: number;
  targetAmount: number;
};

export function calculateGoalSip(input: GoalSipInput): GoalSipResult {
  const target = Math.max(0, input.targetAmount);
  const years = Math.max(0, input.years);
  const rate = Math.max(0, input.expectedReturnPercent);
  const months = Math.round(years * 12);
  const monthlySip = sipRequired(target, rate, months);
  return {
    monthlySip,
    totalInvested: monthlySip * months,
    months,
    targetAmount: target,
  };
}

/** Required SIP at several return assumptions for the same goal. */
export function goalSipScenarios(
  targetAmount: number,
  years: number,
  rates: number[],
): { rate: number; monthlySip: number; totalInvested: number }[] {
  return rates.map((rate) => {
    const r = calculateGoalSip({ targetAmount, years, expectedReturnPercent: rate });
    return { rate, monthlySip: r.monthlySip, totalInvested: r.totalInvested };
  });
}
