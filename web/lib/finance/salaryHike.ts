/** Simple CTC hike: new CTC and monthly increase (no tax modelling). */

export type SalaryHikeInput = {
  currentCtc: number;
  hikePercent: number;
};

export type SalaryHikeResult = {
  currentCtc: number;
  hikePercent: number;
  hikeAmount: number;
  newCtc: number;
  monthlyIncrease: number;
  currentMonthly: number;
  newMonthly: number;
};

export function calculateSalaryHike(input: SalaryHikeInput): SalaryHikeResult {
  const currentCtc = Math.max(0, input.currentCtc);
  const hikePercent = Math.max(0, input.hikePercent);
  const hikeAmount = (currentCtc * hikePercent) / 100;
  const newCtc = currentCtc + hikeAmount;
  const currentMonthly = currentCtc / 12;
  const newMonthly = newCtc / 12;
  const monthlyIncrease = newMonthly - currentMonthly;

  return {
    currentCtc,
    hikePercent,
    hikeAmount,
    newCtc,
    monthlyIncrease,
    currentMonthly,
    newMonthly,
  };
}
