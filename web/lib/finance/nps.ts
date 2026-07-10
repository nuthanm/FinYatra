import { futureValue, sipFutureValue } from "@/lib/finance/compound";

/** NPS corpus and pension projection (educational). */

export type NpsInput = {
  currentAge: number;
  retirementAge: number;
  monthlyContribution: number;
  /** Employer monthly NPS (optional). */
  employerMonthly: number;
  existingCorpus: number;
  expectedReturnPercent: number;
  /** Annuity purchase rate for pension estimate (e.g. 6%). */
  annuityRatePercent: number;
  /** Fraction of corpus used to buy annuity at exit (default 40%). */
  annuityFraction?: number;
};

export type NpsResult = {
  years: number;
  months: number;
  totalContributed: number;
  corpus: number;
  lumpSum: number;
  annuityCorpus: number;
  monthlyPension: number;
};

export function calculateNps(input: NpsInput): NpsResult {
  const age = Math.max(18, Math.min(70, input.currentAge));
  const retire = Math.max(age + 1, Math.min(75, input.retirementAge));
  const years = retire - age;
  const months = years * 12;
  const monthly = Math.max(0, input.monthlyContribution) + Math.max(0, input.employerMonthly);
  const existing = Math.max(0, input.existingCorpus);
  const ret = Math.max(0, input.expectedReturnPercent);
  const annuityRate = Math.max(0, input.annuityRatePercent) / 100;
  const annuityFrac = Math.min(1, Math.max(0, input.annuityFraction ?? 0.4));

  const growthExisting = futureValue(existing, ret, years);
  const growthSip = sipFutureValue(monthly, ret, months);
  const corpus = growthExisting + growthSip;
  const totalContributed = existing + monthly * months;
  const annuityCorpus = corpus * annuityFrac;
  const lumpSum = corpus - annuityCorpus;
  // Simple annuity: annual pension ≈ corpus × rate; monthly = /12
  const monthlyPension = annuityRate > 0 ? (annuityCorpus * annuityRate) / 12 : 0;

  return {
    years,
    months,
    totalContributed,
    corpus,
    lumpSum,
    annuityCorpus,
    monthlyPension,
  };
}

export function npsYearlyRows(
  existing: number,
  monthly: number,
  annualRatePercent: number,
  years: number,
): { year: number; invested: number; value: number }[] {
  const rows: { year: number; invested: number; value: number }[] = [];
  const n = Math.max(0, Math.floor(years));
  for (let y = 1; y <= n; y++) {
    const invested = existing + monthly * y * 12;
    const value = futureValue(existing, annualRatePercent, y) + sipFutureValue(monthly, annualRatePercent, y * 12);
    rows.push({ year: y, invested, value });
  }
  return rows;
}
