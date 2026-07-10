/**
 * e-Shram registration educational + linked social-security benefit summary.
 * Not a heavy calculator — shows illustrative annual premiums / covers.
 */

export const ESHRAM_PMSBY_COVER = 2_00_000;
export const ESHRAM_PMSBY_PREMIUM = 20;
export const ESHRAM_PMJJBY_COVER = 2_00_000;
export const ESHRAM_PMJJBY_PREMIUM = 436;
export const ESHRAM_PMSYM_PENSION = 3_000;

export type EShramInput = {
  /** Whether worker is registered / plans to register on e-Shram. */
  registered: boolean;
  /** Include PMSBY (accident) in summary. */
  includePmsby: boolean;
  /** Include PMJJBY (life) in summary. */
  includePmjjby: boolean;
  /** Include PM-SYM pension note. */
  includePmsym: boolean;
};

export type EShramResult = {
  registered: boolean;
  totalAnnualPremium: number;
  totalLifeAccidentCover: number;
  pmsymMonthlyPension: number;
  benefitCount: number;
};

export function calculateEShram(input: EShramInput): EShramResult {
  const registered = Boolean(input.registered);
  if (!registered) {
    return {
      registered: false,
      totalAnnualPremium: 0,
      totalLifeAccidentCover: 0,
      pmsymMonthlyPension: 0,
      benefitCount: 0,
    };
  }

  let totalAnnualPremium = 0;
  let totalLifeAccidentCover = 0;
  let benefitCount = 0;
  let pmsymMonthlyPension = 0;

  if (input.includePmsby) {
    totalAnnualPremium += ESHRAM_PMSBY_PREMIUM;
    totalLifeAccidentCover += ESHRAM_PMSBY_COVER;
    benefitCount += 1;
  }
  if (input.includePmjjby) {
    totalAnnualPremium += ESHRAM_PMJJBY_PREMIUM;
    totalLifeAccidentCover += ESHRAM_PMJJBY_COVER;
    benefitCount += 1;
  }
  if (input.includePmsym) {
    pmsymMonthlyPension = ESHRAM_PMSYM_PENSION;
    benefitCount += 1;
  }

  return {
    registered: true,
    totalAnnualPremium,
    totalLifeAccidentCover,
    pmsymMonthlyPension,
    benefitCount,
  };
}
