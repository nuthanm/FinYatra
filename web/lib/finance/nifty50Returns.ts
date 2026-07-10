import { futureValue, sipFutureValue } from "@/lib/finance/compound";

export type Nifty50Mode = "lumpsum" | "sip";

export type Nifty50ReturnsInput = {
  mode: Nifty50Mode;
  principal: number;
  monthlySip: number;
  /** Assumed CAGR % (illustrative; not historical guarantee). */
  assumedCagrPercent: number;
  years: number;
};

export type Nifty50ReturnsResult = {
  invested: number;
  estimatedValue: number;
  gain: number;
  months: number;
  cagrPercent: number;
};

export function calculateNifty50Returns(input: Nifty50ReturnsInput): Nifty50ReturnsResult {
  const rate = Math.max(0, input.assumedCagrPercent);
  const years = Math.max(0, input.years);
  const months = Math.round(years * 12);

  if (years <= 0) {
    return { invested: 0, estimatedValue: 0, gain: 0, months: 0, cagrPercent: rate };
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
      cagrPercent: rate,
    };
  }

  const principal = Math.max(0, input.principal);
  const estimatedValue = futureValue(principal, rate, years);
  return {
    invested: principal,
    estimatedValue,
    gain: Math.max(0, estimatedValue - principal),
    months,
    cagrPercent: rate,
  };
}

/** Fixed illustrative scenarios at 8% / 12% / 15% CAGR. */
export function nifty50Scenarios(
  mode: Nifty50Mode,
  principal: number,
  monthlySip: number,
  years: number,
  rates: number[] = [8, 12, 15],
): Nifty50ReturnsResult[] {
  return rates.map((assumedCagrPercent) =>
    calculateNifty50Returns({ mode, principal, monthlySip, assumedCagrPercent, years }),
  );
}
