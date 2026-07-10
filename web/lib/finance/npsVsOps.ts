import { futureValue, sipFutureValue } from "@/lib/finance/compound";

/** NPS corpus vs simplified OPS pension for a govt employee (educational). */

export type NpsVsOpsInput = {
  currentAge: number;
  retirementAge: number;
  /** Current / last basic + DA used for OPS (simplified last pay). */
  lastPay: number;
  /** Expected annual pay growth % until retirement. */
  payGrowthPercent: number;
  monthlyNpsContribution: number;
  existingNpsCorpus: number;
  npsReturnPercent: number;
  /** Annuity rate for NPS monthly pension estimate. */
  annuityRatePercent: number;
  /** Fraction of NPS corpus used for annuity (default 40%). */
  annuityFraction?: number;
};

export type NpsVsOpsResult = {
  years: number;
  npsCorpus: number;
  npsLumpSum: number;
  npsMonthlyPension: number;
  /** OPS: 50% of projected last pay (simplified). */
  opsMonthlyPension: number;
  projectedLastPay: number;
  totalNpsContributed: number;
  /** NPS monthly pension − OPS monthly (positive = NPS higher). */
  monthlyGap: number;
};

export function calculateNpsVsOps(input: NpsVsOpsInput): NpsVsOpsResult {
  const age = Math.max(18, Math.min(70, input.currentAge));
  const retire = Math.max(age + 1, Math.min(75, input.retirementAge));
  const years = retire - age;
  const months = years * 12;
  const lastPay = Math.max(0, input.lastPay);
  const growth = Math.max(0, input.payGrowthPercent);
  const monthly = Math.max(0, input.monthlyNpsContribution);
  const existing = Math.max(0, input.existingNpsCorpus);
  const ret = Math.max(0, input.npsReturnPercent);
  const annuityRate = Math.max(0, input.annuityRatePercent) / 100;
  const annuityFrac = Math.min(1, Math.max(0, input.annuityFraction ?? 0.4));

  const projectedLastPay = futureValue(lastPay, growth, years);
  const opsMonthlyPension = projectedLastPay * 0.5;

  const npsCorpus = futureValue(existing, ret, years) + sipFutureValue(monthly, ret, months);
  const totalNpsContributed = existing + monthly * months;
  const annuityCorpus = npsCorpus * annuityFrac;
  const npsLumpSum = npsCorpus - annuityCorpus;
  const npsMonthlyPension = annuityRate > 0 ? (annuityCorpus * annuityRate) / 12 : 0;

  return {
    years,
    npsCorpus,
    npsLumpSum,
    npsMonthlyPension,
    opsMonthlyPension,
    projectedLastPay,
    totalNpsContributed,
    monthlyGap: npsMonthlyPension - opsMonthlyPension,
  };
}
