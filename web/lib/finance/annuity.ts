/** Annuity / pension from a retirement corpus (illustrative). */

export type AnnuityMode = "finite" | "forever";

export type AnnuityResult = {
  corpus: number;
  ratePercent: number;
  years: number;
  forever: boolean;
  monthlyPension: number;
  annualPension: number;
  totalPayout: number | null;
};

/**
 * Forever (perpetuity): monthly ≈ corpus × r / 12.
 * Finite: ordinary annuity PMT = corpus × r_m / (1 − (1+r_m)^(−n))
 * where r_m = annual/12 and n = years×12.
 */
export function calculateAnnuity(
  corpus: number,
  annualRatePercent: number,
  years: number,
  forever: boolean,
): AnnuityResult {
  const c = Math.max(0, corpus);
  const rate = Math.max(0, annualRatePercent);
  const y = Math.max(0, years);
  const r = rate / 100;

  if (c <= 0 || r <= 0) {
    return {
      corpus: c,
      ratePercent: rate,
      years: y,
      forever,
      monthlyPension: 0,
      annualPension: 0,
      totalPayout: forever ? null : 0,
    };
  }

  if (forever) {
    const monthlyPension = (c * r) / 12;
    return {
      corpus: c,
      ratePercent: rate,
      years: y,
      forever: true,
      monthlyPension,
      annualPension: monthlyPension * 12,
      totalPayout: null,
    };
  }

  const n = Math.max(1, Math.round(y * 12));
  const rm = r / 12;
  const monthlyPension = (c * rm) / (1 - Math.pow(1 + rm, -n));
  const annualPension = monthlyPension * 12;

  return {
    corpus: c,
    ratePercent: rate,
    years: y,
    forever: false,
    monthlyPension,
    annualPension,
    totalPayout: monthlyPension * n,
  };
}
