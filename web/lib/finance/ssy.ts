/** Sukanya Samriddhi Yojana projection. */

export const SSY_MAX_ANNUAL = 150_000;
export const SSY_DEFAULT_RATE = 8.2;
export const SSY_DEPOSIT_YEARS = 15;
export const SSY_MATURITY_YEARS = 21;

export type SsyYearRow = {
  year: number;
  deposit: number;
  interest: number;
  balance: number;
  invested: number;
};

export type SsyResult = {
  maturity: number;
  totalInvested: number;
  totalInterest: number;
  rows: SsyYearRow[];
};

/**
 * Annual deposits for first `depositYears` (max 15), account matures at `maturityYears` (21).
 * Interest compounded annually; deposit at start of year.
 */
export function calculateSsy(
  annualDeposit: number,
  annualRatePercent: number,
  depositYears = SSY_DEPOSIT_YEARS,
  maturityYears = SSY_MATURITY_YEARS,
): SsyResult {
  const deposit = Math.min(Math.max(0, annualDeposit), SSY_MAX_ANNUAL);
  const rate = Math.max(0, annualRatePercent) / 100;
  const depY = Math.min(Math.max(0, Math.floor(depositYears)), maturityYears);
  const matY = Math.max(depY, Math.floor(maturityYears));

  if (deposit <= 0 || matY <= 0) {
    return { maturity: 0, totalInvested: 0, totalInterest: 0, rows: [] };
  }

  let balance = 0;
  let invested = 0;
  const rows: SsyYearRow[] = [];

  for (let y = 1; y <= matY; y++) {
    const yearDeposit = y <= depY ? deposit : 0;
    balance += yearDeposit;
    invested += yearDeposit;
    const interest = balance * rate;
    balance += interest;
    rows.push({ year: y, deposit: yearDeposit, interest, balance, invested });
  }

  return {
    maturity: balance,
    totalInvested: invested,
    totalInterest: balance - invested,
    rows,
  };
}
