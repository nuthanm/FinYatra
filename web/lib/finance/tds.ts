/** Section-wise TDS estimates (illustrative; rates/thresholds change). */

export type TdsSectionId = "194A" | "194IA" | "194IB" | "194C" | "194H" | "194J" | "192";

export type TdsSectionConfig = {
  id: TdsSectionId;
  /** Rate % when PAN is available. */
  rateWithPan: number;
  /** Rate % when PAN is missing (often 20%). */
  rateWithoutPan: number;
  /** Threshold amount; TDS applies only above this (0 = always). */
  threshold: number;
  /** How threshold is interpreted. */
  thresholdKind: "annual" | "per_transaction" | "monthly" | "none";
};

export const TDS_SECTIONS: TdsSectionConfig[] = [
  { id: "194A", rateWithPan: 10, rateWithoutPan: 20, threshold: 40_000, thresholdKind: "annual" },
  { id: "194IA", rateWithPan: 1, rateWithoutPan: 20, threshold: 5_000_000, thresholdKind: "per_transaction" },
  { id: "194IB", rateWithPan: 2, rateWithoutPan: 20, threshold: 50_000, thresholdKind: "monthly" },
  { id: "194C", rateWithPan: 1, rateWithoutPan: 20, threshold: 30_000, thresholdKind: "per_transaction" },
  { id: "194H", rateWithPan: 2, rateWithoutPan: 20, threshold: 15_000, thresholdKind: "annual" },
  { id: "194J", rateWithPan: 10, rateWithoutPan: 20, threshold: 30_000, thresholdKind: "annual" },
  { id: "192", rateWithPan: 0, rateWithoutPan: 0, threshold: 0, thresholdKind: "none" },
];

export function getTdsSection(id: TdsSectionId): TdsSectionConfig {
  return TDS_SECTIONS.find((s) => s.id === id) ?? TDS_SECTIONS[0]!;
}

export type TdsInput = {
  sectionId: TdsSectionId;
  /** Payment / interest / consideration amount (context depends on section). */
  amount: number;
  panAvailable: boolean;
  /** For 194A: treat payee as senior citizen (₹50k threshold). */
  seniorCitizen: boolean;
  /** For 192: estimated annual tax liability (user/employer estimate). */
  estimatedAnnualTax: number;
};

export type TdsResult = {
  applicable: boolean;
  ratePercent: number;
  threshold: number;
  tdsAmount: number;
  netAmount: number;
  noteKey: "below_threshold" | "applied" | "salary_estimate";
};

export function calculateTds(input: TdsInput): TdsResult {
  const section = getTdsSection(input.sectionId);
  const amount = Math.max(0, input.amount);

  if (section.id === "192") {
    const annualTax = Math.max(0, input.estimatedAnnualTax);
    const monthly = annualTax / 12;
    return {
      applicable: annualTax > 0,
      ratePercent: 0,
      threshold: 0,
      tdsAmount: monthly,
      netAmount: Math.max(0, amount - monthly),
      noteKey: "salary_estimate",
    };
  }

  let threshold = section.threshold;
  if (section.id === "194A" && input.seniorCitizen) threshold = 50_000;

  const rate = input.panAvailable ? section.rateWithPan : section.rateWithoutPan;
  const above =
    section.thresholdKind === "none"
      ? true
      : section.thresholdKind === "monthly"
        ? amount > threshold
        : amount > threshold;

  if (!above) {
    return {
      applicable: false,
      ratePercent: rate,
      threshold,
      tdsAmount: 0,
      netAmount: amount,
      noteKey: "below_threshold",
    };
  }

  // 194C individual/HUF often 1%; companies 2% — we use 1% with PAN as base (user can note).
  const tdsAmount = (amount * rate) / 100;
  return {
    applicable: true,
    ratePercent: rate,
    threshold,
    tdsAmount,
    netAmount: Math.max(0, amount - tdsAmount),
    noteKey: "applied",
  };
}
