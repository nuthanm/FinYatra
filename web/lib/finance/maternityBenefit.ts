/**
 * Maternity Benefit Act — simplified average daily wage × leave days (educational).
 * Default 26 weeks = 182 days for first two children.
 */

export const MATERNITY_DEFAULT_LEAVE_DAYS = 182; // 26 weeks
export const MATERNITY_WEEKS_DEFAULT = 26;

export type MaternityBenefitInput = {
  averageDailyWage: number;
  leaveDays: number;
};

export type MaternityBenefitResult = {
  averageDailyWage: number;
  leaveDays: number;
  leaveWeeks: number;
  benefitAmount: number;
  monthlyEquivalent: number;
};

export function calculateMaternityBenefit(input: MaternityBenefitInput): MaternityBenefitResult {
  const averageDailyWage = Math.max(0, input.averageDailyWage);
  const leaveDays = Math.max(0, input.leaveDays);
  const benefitAmount = averageDailyWage * leaveDays;
  const leaveWeeks = leaveDays / 7;

  return {
    averageDailyWage,
    leaveDays,
    leaveWeeks,
    benefitAmount,
    monthlyEquivalent: leaveDays > 0 ? (benefitAmount / leaveDays) * 30 : 0,
  };
}

/** Convenience: monthly wage → average daily wage (÷ 26 working days, simplified). */
export function dailyWageFromMonthly(monthlyWage: number, workingDays = 26): number {
  return Math.max(0, monthlyWage) / Math.max(1, workingDays);
}
