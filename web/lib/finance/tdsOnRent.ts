/** Section 194IB — TDS on rent by individuals/HUF (illustrative). */

export const TDS_RENT_RATE_PERCENT = 2;
export const TDS_RENT_MONTHLY_THRESHOLD = 50_000;

export type TdsOnRentInput = {
  monthlyRent: number;
  /** TDS rate % (default 2%). */
  ratePercent: number;
};

export type TdsOnRentResult = {
  applicable: boolean;
  ratePercent: number;
  monthlyThreshold: number;
  monthlyRent: number;
  annualRent: number;
  monthlyTds: number;
  annualTds: number;
  noteKey: "below_threshold" | "applied";
};

export function calculateTdsOnRent(input: TdsOnRentInput): TdsOnRentResult {
  const monthlyRent = Math.max(0, input.monthlyRent);
  const ratePercent = Math.max(0, input.ratePercent);
  const annualRent = monthlyRent * 12;
  const threshold = TDS_RENT_MONTHLY_THRESHOLD;

  if (monthlyRent <= threshold) {
    return {
      applicable: false,
      ratePercent,
      monthlyThreshold: threshold,
      monthlyRent,
      annualRent,
      monthlyTds: 0,
      annualTds: 0,
      noteKey: "below_threshold",
    };
  }

  const monthlyTds = (monthlyRent * ratePercent) / 100;
  return {
    applicable: true,
    ratePercent,
    monthlyThreshold: threshold,
    monthlyRent,
    annualRent,
    monthlyTds,
    annualTds: monthlyTds * 12,
    noteKey: "applied",
  };
}
