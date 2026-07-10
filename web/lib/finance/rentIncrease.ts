/** Project rent with annual % increase over years. */

export type RentIncreaseInput = {
  currentMonthlyRent: number;
  increasePercentPerYear: number;
  years: number;
};

export type RentIncreaseYearRow = {
  year: number;
  monthlyRent: number;
  annualRent: number;
};

export type RentIncreaseResult = {
  currentMonthlyRent: number;
  increasePercentPerYear: number;
  years: number;
  finalMonthlyRent: number;
  finalAnnualRent: number;
  totalRentPaid: number;
  rows: RentIncreaseYearRow[];
};

export function calculateRentIncrease(input: RentIncreaseInput): RentIncreaseResult {
  const current = Math.max(0, input.currentMonthlyRent);
  const pct = Math.max(0, input.increasePercentPerYear);
  const years = Math.max(0, Math.floor(input.years));
  const rows: RentIncreaseYearRow[] = [];
  let monthly = current;
  let totalRentPaid = 0;

  for (let y = 1; y <= years; y++) {
    if (y > 1) {
      monthly = monthly * (1 + pct / 100);
    }
    const annual = monthly * 12;
    totalRentPaid += annual;
    rows.push({ year: y, monthlyRent: monthly, annualRent: annual });
  }

  const finalMonthlyRent = years > 0 ? rows[rows.length - 1]!.monthlyRent : current;
  const finalAnnualRent = finalMonthlyRent * 12;

  return {
    currentMonthlyRent: current,
    increasePercentPerYear: pct,
    years,
    finalMonthlyRent,
    finalAnnualRent,
    totalRentPaid,
    rows,
  };
}
