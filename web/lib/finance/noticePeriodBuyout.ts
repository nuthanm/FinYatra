/** Notice-period buyout cost from remaining days × daily CTC. */

export type NoticePeriodBuyoutInput = {
  /** Annual CTC (₹). */
  ctcAnnual: number;
  /** Remaining notice days to buy out. */
  remainingDays: number;
  /** Days in year for daily CTC (default 365). */
  daysInYear?: number;
};

export type NoticePeriodBuyoutResult = {
  ctcAnnual: number;
  remainingDays: number;
  daysInYear: number;
  dailyCtc: number;
  monthlyCtc: number;
  buyoutCost: number;
  /** Buyout as % of annual CTC. */
  buyoutPercentOfCtc: number;
};

export function calculateNoticePeriodBuyout(
  input: NoticePeriodBuyoutInput,
): NoticePeriodBuyoutResult {
  const ctc = Math.max(0, input.ctcAnnual);
  const days = Math.max(0, Math.floor(input.remainingDays));
  const daysInYear = Math.max(1, input.daysInYear ?? 365);
  const dailyCtc = ctc / daysInYear;
  const monthlyCtc = ctc / 12;
  const buyoutCost = dailyCtc * days;
  const buyoutPercentOfCtc = ctc > 0 ? (buyoutCost / ctc) * 100 : 0;

  return {
    ctcAnnual: ctc,
    remainingDays: days,
    daysInYear,
    dailyCtc,
    monthlyCtc,
    buyoutCost,
    buyoutPercentOfCtc,
  };
}
