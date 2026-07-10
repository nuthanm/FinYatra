/** PMFBY-style crop insurance premium (educational — not a claim tool). */

export type CropSeason = "kharif" | "rabi" | "commercial";

export type CropInsuranceInput = {
  sumInsured: number;
  /** Farmer premium rate % (default by season if omitted). */
  premiumRatePercent?: number;
  season?: CropSeason;
};

export type CropInsuranceResult = {
  sumInsured: number;
  season: CropSeason;
  premiumRatePercent: number;
  farmerPremium: number;
  /** Illustrative: claim up to sum insured if total loss (educational note only). */
  maxClaimNote: number;
};

/** Typical farmer share under PMFBY (illustrative). */
export const CROP_PREMIUM_RATES: Record<CropSeason, number> = {
  kharif: 2,
  rabi: 1.5,
  commercial: 5,
};

export function calculateCropInsurance(input: CropInsuranceInput): CropInsuranceResult {
  const sumInsured = Math.max(0, input.sumInsured);
  const season = input.season ?? "kharif";
  const premiumRatePercent =
    input.premiumRatePercent ?? CROP_PREMIUM_RATES[season];
  const rate = Math.max(0, premiumRatePercent) / 100;
  const farmerPremium = sumInsured * rate;

  return {
    sumInsured,
    season,
    premiumRatePercent: Math.max(0, premiumRatePercent),
    farmerPremium,
    maxClaimNote: sumInsured,
  };
}
