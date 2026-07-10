/** Section 194IA — TDS on purchase of immovable property (illustrative). */

export const TDS_PROPERTY_RATE_PERCENT = 1;
export const TDS_PROPERTY_THRESHOLD = 5_000_000; // ₹50 lakh

export type TdsOnPropertyInput = {
  /** Total consideration / stamp duty value (whichever higher in practice). */
  consideration: number;
  /** TDS rate % (default 1%; higher if PAN missing — user override). */
  ratePercent: number;
  /** Number of joint buyers (for share note; TDS still on full consideration). */
  buyerCount: number;
};

export type TdsOnPropertyResult = {
  applicable: boolean;
  ratePercent: number;
  threshold: number;
  tdsAmount: number;
  netPayable: number;
  /** Illustrative share if split equally among buyers. */
  perBuyerShare: number;
  buyerCount: number;
  noteKey: "below_threshold" | "applied";
};

export function calculateTdsOnProperty(input: TdsOnPropertyInput): TdsOnPropertyResult {
  const consideration = Math.max(0, input.consideration);
  const ratePercent = Math.max(0, input.ratePercent);
  const buyerCount = Math.max(1, Math.floor(input.buyerCount) || 1);
  const threshold = TDS_PROPERTY_THRESHOLD;

  if (consideration <= threshold) {
    return {
      applicable: false,
      ratePercent,
      threshold,
      tdsAmount: 0,
      netPayable: consideration,
      perBuyerShare: consideration / buyerCount,
      buyerCount,
      noteKey: "below_threshold",
    };
  }

  const tdsAmount = (consideration * ratePercent) / 100;
  return {
    applicable: true,
    ratePercent,
    threshold,
    tdsAmount,
    netPayable: Math.max(0, consideration - tdsAmount),
    perBuyerShare: consideration / buyerCount,
    buyerCount,
    noteKey: "applied",
  };
}
