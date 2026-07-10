/** Ayushman Bharat PM-JAY cover display (educational eligibility note). */

export const AYUSHMAN_COVER = 500_000;

export type AyushmanEligibility =
  | "secc"
  | "senior70"
  | "state_scheme"
  | "not_listed";

export type AyushmanBharatInput = {
  familySize: number;
  eligibility: AyushmanEligibility;
  /** Existing private health cover (₹) for gap note. */
  existingCover?: number;
};

export type AyushmanBharatResult = {
  familySize: number;
  eligibility: AyushmanEligibility;
  eligible: boolean;
  coverAmount: number;
  existingCover: number;
  /** Cover still useful after existing private cover (illustrative). */
  gapVsPrivate: number;
  noteKey: "eligible" | "senior70" | "state" | "not_eligible";
};

/**
 * Educational: PM-JAY shows ₹5L/family/year when eligibility category suggests cover.
 * Not an official eligibility check.
 */
export function calculateAyushmanBharat(input: AyushmanBharatInput): AyushmanBharatResult {
  const familySize = Math.max(1, Math.min(20, Math.floor(input.familySize)));
  const existingCover = Math.max(0, input.existingCover ?? 0);
  const eligibility = input.eligibility;

  const eligible =
    eligibility === "secc" || eligibility === "senior70" || eligibility === "state_scheme";

  const coverAmount = eligible ? AYUSHMAN_COVER : 0;
  const gapVsPrivate = Math.max(0, coverAmount - existingCover);

  const noteKey: AyushmanBharatResult["noteKey"] =
    eligibility === "not_listed"
      ? "not_eligible"
      : eligibility === "senior70"
        ? "senior70"
        : eligibility === "state_scheme"
          ? "state"
          : "eligible";

  return {
    familySize,
    eligibility,
    eligible,
    coverAmount,
    existingCover,
    gapVsPrivate,
    noteKey,
  };
}
