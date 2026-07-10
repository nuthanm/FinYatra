/** PPF projection helpers. Interest is compounded annually (India Post / bank convention). */

export const PPF_MAX_ANNUAL = 150_000;
export const PPF_DEFAULT_RATE = 7.1;
export const PPF_DEFAULT_YEARS = 15;

export type PpfYearRow = {
  year: number;
  deposit: number;
  interest: number;
  balance: number;
  invested: number;
};

/**
 * Annual deposit assumed at the start of each financial year (max benefit).
 * Interest credited yearly on the closing balance.
 */
export function ppfAnnualProjection(
  annualDeposit: number,
  annualRatePercent: number,
  years: number,
): { maturity: number; totalInvested: number; totalInterest: number; rows: PpfYearRow[] } {
  const deposit = Math.min(Math.max(0, annualDeposit), PPF_MAX_ANNUAL);
  const rate = Math.max(0, annualRatePercent) / 100;
  const n = Math.max(0, Math.floor(years));
  if (deposit <= 0 || n <= 0) {
    return { maturity: 0, totalInvested: 0, totalInterest: 0, rows: [] };
  }

  let balance = 0;
  let invested = 0;
  const rows: PpfYearRow[] = [];

  for (let y = 1; y <= n; y++) {
    balance += deposit;
    invested += deposit;
    const interest = balance * rate;
    balance += interest;
    rows.push({ year: y, deposit, interest, balance, invested });
  }

  return {
    maturity: balance,
    totalInvested: invested,
    totalInterest: balance - invested,
    rows,
  };
}

/**
 * Monthly deposits: each month's contribution earns interest for remaining months of the year,
 * then annual compounding on year-end balance (simplified bank-style approximation).
 */
export function ppfMonthlyProjection(
  monthlyDeposit: number,
  annualRatePercent: number,
  years: number,
): { maturity: number; totalInvested: number; totalInterest: number; rows: PpfYearRow[] } {
  const monthly = Math.max(0, monthlyDeposit);
  const annualCap = Math.min(monthly * 12, PPF_MAX_ANNUAL);
  const effectiveMonthly = annualCap / 12;
  return ppfAnnualProjection(effectiveMonthly * 12, annualRatePercent, years);
}
