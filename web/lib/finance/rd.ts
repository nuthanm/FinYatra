/** Recurring deposit maturity (quarterly compounding — common bank convention). */

export type RdResult = {
  maturity: number;
  totalInvested: number;
  interest: number;
  months: number;
};

/**
 * Bank-style RD: monthly deposit P, annual rate R%, tenure in months.
 * Interest compounded quarterly.
 * M = P × [((1+i)^n − 1) / (1 − (1+i)^(−1/3))]
 * where i = R/400, n = tenure in quarters.
 */
export function calculateRd(monthlyDeposit: number, annualRatePercent: number, months: number): RdResult {
  const p = Math.max(0, monthlyDeposit);
  const m = Math.max(0, Math.floor(months));
  const invested = p * m;

  if (p <= 0 || m <= 0) {
    return { maturity: 0, totalInvested: 0, interest: 0, months: 0 };
  }

  const i = annualRatePercent / 400; // quarterly rate as decimal
  const n = m / 3; // quarters

  let maturity: number;
  if (i <= 0) {
    maturity = invested;
  } else {
    const factor = (Math.pow(1 + i, n) - 1) / (1 - Math.pow(1 + i, -1 / 3));
    maturity = p * factor;
  }

  return {
    maturity,
    totalInvested: invested,
    interest: Math.max(0, maturity - invested),
    months: m,
  };
}

export function rdYearlyRows(
  monthlyDeposit: number,
  annualRatePercent: number,
  months: number,
): { year: number; invested: number; value: number; interest: number }[] {
  const maxMonths = Math.max(0, Math.floor(months));
  const years = Math.ceil(maxMonths / 12);
  const rows: { year: number; invested: number; value: number; interest: number }[] = [];
  for (let y = 1; y <= years; y++) {
    const m = Math.min(y * 12, maxMonths);
    const r = calculateRd(monthlyDeposit, annualRatePercent, m);
    rows.push({ year: y, invested: r.totalInvested, value: r.maturity, interest: r.interest });
  }
  return rows;
}
