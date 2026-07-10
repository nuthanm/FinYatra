/** Section-wise TCS estimates (illustrative; rates/thresholds change). */

export type TcsNatureId = "lrs_foreign" | "sale_of_goods" | "scrap";

export type TcsNatureConfig = {
  id: TcsNatureId;
  /** Default rate % when TCS applies (LRS uses tiered rates). */
  ratePercent: number;
  /** Amount above which TCS applies (0 = always / tiered). */
  threshold: number;
};

export const TCS_NATURES: TcsNatureConfig[] = [
  { id: "lrs_foreign", ratePercent: 5, threshold: 700_000 },
  { id: "sale_of_goods", ratePercent: 0.1, threshold: 5_000_000 },
  { id: "scrap", ratePercent: 1, threshold: 0 },
];

/** LRS: illustrative 5% up to ₹7L, 20% when remittance exceeds ₹7L. */
export const TCS_LRS_LOW_RATE = 5;
export const TCS_LRS_HIGH_RATE = 20;
export const TCS_LRS_THRESHOLD = 700_000;

export function getTcsNature(id: TcsNatureId): TcsNatureConfig {
  return TCS_NATURES.find((n) => n.id === id) ?? TCS_NATURES[0]!;
}

export type TcsInput = {
  natureId: TcsNatureId;
  amount: number;
};

export type TcsResult = {
  applicable: boolean;
  ratePercent: number;
  threshold: number;
  tcsAmount: number;
  netAmount: number;
  noteKey: "below_threshold" | "applied" | "lrs_low" | "lrs_high";
};

export function calculateTcs(input: TcsInput): TcsResult {
  const nature = getTcsNature(input.natureId);
  const amount = Math.max(0, input.amount);

  if (nature.id === "lrs_foreign") {
    if (amount <= 0) {
      return {
        applicable: false,
        ratePercent: TCS_LRS_LOW_RATE,
        threshold: TCS_LRS_THRESHOLD,
        tcsAmount: 0,
        netAmount: 0,
        noteKey: "below_threshold",
      };
    }
    if (amount <= TCS_LRS_THRESHOLD) {
      const tcsAmount = (amount * TCS_LRS_LOW_RATE) / 100;
      return {
        applicable: true,
        ratePercent: TCS_LRS_LOW_RATE,
        threshold: TCS_LRS_THRESHOLD,
        tcsAmount,
        netAmount: Math.max(0, amount - tcsAmount),
        noteKey: "lrs_low",
      };
    }
    const tcsAmount = (amount * TCS_LRS_HIGH_RATE) / 100;
    return {
      applicable: true,
      ratePercent: TCS_LRS_HIGH_RATE,
      threshold: TCS_LRS_THRESHOLD,
      tcsAmount,
      netAmount: Math.max(0, amount - tcsAmount),
      noteKey: "lrs_high",
    };
  }

  const rate = nature.ratePercent;
  const threshold = nature.threshold;
  const above = threshold <= 0 ? amount > 0 : amount > threshold;

  if (!above) {
    return {
      applicable: false,
      ratePercent: rate,
      threshold,
      tcsAmount: 0,
      netAmount: amount,
      noteKey: "below_threshold",
    };
  }

  const tcsAmount = (amount * rate) / 100;
  return {
    applicable: true,
    ratePercent: rate,
    threshold,
    tcsAmount,
    netAmount: Math.max(0, amount - tcsAmount),
    noteKey: "applied",
  };
}
