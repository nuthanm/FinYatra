/** Rough educational LIC-style premium estimate (not a quote). */

export type LicPremiumInput = {
  sumAssured: number;
  age: number;
  /** Policy term in years. */
  termYears: number;
  /**
   * Rough premium rate per ₹1,000 sum assured per year
   * (illustrative; real quotes depend on plan, health, riders).
   */
  ratePerThousand: number;
};

export type LicPremiumResult = {
  sumAssured: number;
  age: number;
  termYears: number;
  ratePerThousand: number;
  annualPremium: number;
  totalPremiums: number;
  /** Total premiums as % of sum assured. */
  premiumToCoverPct: number;
};

export function calculateLicPremium(input: LicPremiumInput): LicPremiumResult {
  const sumAssured = Math.max(0, input.sumAssured);
  const age = Math.max(18, Math.min(70, input.age));
  const termYears = Math.max(1, Math.min(40, input.termYears));
  // Slight age loading for illustration: +0.5 per thousand per 5 years above 30.
  const baseRate = Math.max(0, input.ratePerThousand);
  const ageLoad = Math.max(0, Math.floor((age - 30) / 5)) * 0.5;
  const ratePerThousand = baseRate + ageLoad;
  const annualPremium = (sumAssured / 1000) * ratePerThousand;
  const totalPremiums = annualPremium * termYears;
  const premiumToCoverPct = sumAssured > 0 ? (totalPremiums / sumAssured) * 100 : 0;

  return {
    sumAssured,
    age,
    termYears,
    ratePerThousand,
    annualPremium,
    totalPremiums,
    premiumToCoverPct,
  };
}
