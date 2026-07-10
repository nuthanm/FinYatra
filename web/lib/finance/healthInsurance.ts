/** Educational health-cover need estimator (not a premium quote). */

export type CityTier = 1 | 2 | 3;

export type HealthInsuranceInput = {
  age: number;
  /** Total family members covered (including self). */
  familyMembers: number;
  cityTier: CityTier;
  /** Optional existing sum insured. */
  currentCover?: number;
};

export type HealthInsuranceResult = {
  baseCover: number;
  perMemberAdd: number;
  ageAdd: number;
  cityAdd: number;
  suggestedCover: number;
  currentCover: number;
  gap: number;
};

/** Base family floater starting point. */
export const HEALTH_BASE_COVER = 500_000;
/** Extra cover per family member (including self). */
export const HEALTH_PER_MEMBER = 200_000;
/** Metro (tier-1) bump for higher hospital costs. */
export const HEALTH_TIER1_BUMP = 300_000;
export const HEALTH_TIER2_BUMP = 100_000;

function ageAddOn(age: number): number {
  if (age >= 60) return 500_000;
  if (age >= 45) return 300_000;
  if (age >= 30) return 100_000;
  return 0;
}

function cityAddOn(tier: CityTier): number {
  if (tier === 1) return HEALTH_TIER1_BUMP;
  if (tier === 2) return HEALTH_TIER2_BUMP;
  return 0;
}

export function calculateHealthInsurance(input: HealthInsuranceInput): HealthInsuranceResult {
  const age = Math.max(0, Math.min(100, Math.round(input.age)));
  const members = Math.max(1, Math.round(input.familyMembers));
  const tier = ([1, 2, 3].includes(input.cityTier) ? input.cityTier : 2) as CityTier;
  const currentCover = Math.max(0, input.currentCover ?? 0);

  const baseCover = HEALTH_BASE_COVER;
  const perMemberAdd = HEALTH_PER_MEMBER * members;
  const ageAdd = ageAddOn(age);
  const cityAdd = cityAddOn(tier);
  const suggestedCover = baseCover + perMemberAdd + ageAdd + cityAdd;
  const gap = Math.max(0, suggestedCover - currentCover);

  return {
    baseCover,
    perMemberAdd,
    ageAdd,
    cityAdd,
    suggestedCover,
    currentCover,
    gap,
  };
}
