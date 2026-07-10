import { futureValue, sipFutureValue } from "@/lib/finance/compound";

export type MutualFundMode = "lumpsum" | "sip";

export type MutualFundReturnsInput = {
  mode: MutualFundMode;
  /** Lumpsum principal (used when mode = lumpsum). */
  principal: number;
  /** Monthly SIP (used when mode = sip). */
  monthlySip: number;
  annualRatePercent: number;
  years: number;
};

export type MutualFundReturnsResult = {
  invested: number;
  estimatedValue: number;
  gain: number;
  months: number;
};

export function calculateMutualFundReturns(input: MutualFundReturnsInput): MutualFundReturnsResult {
  const rate = Math.max(0, input.annualRatePercent);
  const years = Math.max(0, input.years);
  const months = Math.round(years * 12);

  if (years <= 0) {
    return { invested: 0, estimatedValue: 0, gain: 0, months: 0 };
  }

  if (input.mode === "sip") {
    const monthly = Math.max(0, input.monthlySip);
    const invested = monthly * months;
    const estimatedValue = sipFutureValue(monthly, rate, months);
    return {
      invested,
      estimatedValue,
      gain: Math.max(0, estimatedValue - invested),
      months,
    };
  }

  const principal = Math.max(0, input.principal);
  const estimatedValue = futureValue(principal, rate, years);
  return {
    invested: principal,
    estimatedValue,
    gain: Math.max(0, estimatedValue - principal),
    months,
  };
}
