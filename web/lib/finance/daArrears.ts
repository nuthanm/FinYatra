/** Dearness Allowance arrears when DA% is revised retrospectively. */

export type DaArrearsInput = {
  basicPay: number;
  oldDaPercent: number;
  newDaPercent: number;
  months: number;
};

export type DaArrearsResult = {
  basicPay: number;
  oldDaPercent: number;
  newDaPercent: number;
  months: number;
  daIncreasePercent: number;
  monthlyArrear: number;
  totalArrears: number;
  oldMonthlyDa: number;
  newMonthlyDa: number;
};

export function calculateDaArrears(input: DaArrearsInput): DaArrearsResult {
  const basicPay = Math.max(0, input.basicPay);
  const oldDaPercent = Math.max(0, input.oldDaPercent);
  const newDaPercent = Math.max(0, input.newDaPercent);
  const months = Math.max(0, Math.round(input.months));
  const daIncreasePercent = newDaPercent - oldDaPercent;
  const oldMonthlyDa = (basicPay * oldDaPercent) / 100;
  const newMonthlyDa = (basicPay * newDaPercent) / 100;
  const monthlyArrear = (basicPay * daIncreasePercent) / 100;
  const totalArrears = monthlyArrear * months;

  return {
    basicPay,
    oldDaPercent,
    newDaPercent,
    months,
    daIncreasePercent,
    monthlyArrear,
    totalArrears,
    oldMonthlyDa,
    newMonthlyDa,
  };
}
