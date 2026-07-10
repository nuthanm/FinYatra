/** Nominal ↔ effective and monthly ↔ annual interest rate conversions. */

export type InterestRateConverterResult = {
  /** Input nominal annual rate (%) when converting nominal → effective. */
  nominalAnnualPercent: number;
  /** Compounds per year (e.g. 12 monthly). */
  compoundsPerYear: number;
  effectiveAnnualPercent: number;
  monthlyPercent: number;
  annualFromMonthlyPercent: number;
};

/**
 * Effective annual rate from nominal: EAR = (1 + r/n)^n − 1.
 * Monthly rate = nominal/12; annual-from-monthly = monthly × 12.
 */
export function nominalToEffective(
  nominalAnnualPercent: number,
  compoundsPerYear = 12,
): InterestRateConverterResult {
  const nom = Math.max(0, nominalAnnualPercent);
  const n = Math.max(1, Math.floor(compoundsPerYear));
  const ear = (Math.pow(1 + nom / 100 / n, n) - 1) * 100;
  const monthly = nom / 12;

  return {
    nominalAnnualPercent: nom,
    compoundsPerYear: n,
    effectiveAnnualPercent: ear,
    monthlyPercent: monthly,
    annualFromMonthlyPercent: monthly * 12,
  };
}

/**
 * Nominal annual rate from effective: r = n × ((1+EAR)^(1/n) − 1).
 */
export function effectiveToNominal(
  effectiveAnnualPercent: number,
  compoundsPerYear = 12,
): InterestRateConverterResult {
  const ear = Math.max(0, effectiveAnnualPercent) / 100;
  const n = Math.max(1, Math.floor(compoundsPerYear));
  const nom = n * (Math.pow(1 + ear, 1 / n) - 1) * 100;
  const monthly = nom / 12;

  return {
    nominalAnnualPercent: nom,
    compoundsPerYear: n,
    effectiveAnnualPercent: effectiveAnnualPercent,
    monthlyPercent: monthly,
    annualFromMonthlyPercent: monthly * 12,
  };
}

/** Convert a monthly rate (%) to equivalent nominal annual (%). */
export function monthlyToAnnual(monthlyPercent: number): number {
  return Math.max(0, monthlyPercent) * 12;
}

/** Convert a nominal annual rate (%) to monthly (%). */
export function annualToMonthly(annualPercent: number): number {
  return Math.max(0, annualPercent) / 12;
}

/** Effective annual from a monthly rate: (1 + m)^12 − 1. */
export function monthlyToEffectiveAnnual(monthlyPercent: number): number {
  const m = Math.max(0, monthlyPercent) / 100;
  return (Math.pow(1 + m, 12) - 1) * 100;
}
