/** Fixed deposit maturity with optional TDS estimate. */

export type FdCompounding = 1 | 2 | 4 | 12;

export type FdResult = {
  maturity: number;
  interest: number;
  effectiveRate: number;
  tds: number;
  netInterest: number;
  netMaturity: number;
};

export function fdMaturity(
  principal: number,
  annualRatePercent: number,
  years: number,
  compoundsPerYear: FdCompounding = 4,
): FdResult {
  const p = Math.max(0, principal);
  const r = Math.max(0, annualRatePercent) / 100;
  const t = Math.max(0, years);
  const n = compoundsPerYear;

  if (p <= 0 || t <= 0) {
    return { maturity: 0, interest: 0, effectiveRate: 0, tds: 0, netInterest: 0, netMaturity: 0 };
  }

  const maturity = p * Math.pow(1 + r / n, n * t);
  const interest = maturity - p;
  const effectiveRate = (Math.pow(maturity / p, 1 / t) - 1) * 100;

  return {
    maturity,
    interest,
    effectiveRate,
    tds: 0,
    netInterest: interest,
    netMaturity: maturity,
  };
}

/** TDS on FD interest: 10% above threshold (₹40k general / ₹50k senior from FY 2025-26). */
export function applyFdTds(
  result: FdResult,
  seniorCitizen: boolean,
  tdsRatePercent = 10,
): FdResult {
  const threshold = seniorCitizen ? 50_000 : 40_000;
  // Banks deduct TDS on interest credited; simplified: TDS on full interest if above threshold
  const tdsBase = result.interest > threshold ? result.interest : 0;
  const tds = tdsBase * (tdsRatePercent / 100);
  return {
    ...result,
    tds,
    netInterest: result.interest - tds,
    netMaturity: result.maturity - tds,
  };
}

export function fdYearlyRows(
  principal: number,
  annualRatePercent: number,
  years: number,
  compoundsPerYear: FdCompounding = 4,
): { year: number; value: number; interest: number }[] {
  const p = Math.max(0, principal);
  const r = Math.max(0, annualRatePercent) / 100;
  const n = compoundsPerYear;
  const maxY = Math.max(0, Math.floor(years));
  if (p <= 0 || maxY <= 0) return [];

  const rows: { year: number; value: number; interest: number }[] = [];
  for (let y = 1; y <= maxY; y++) {
    const value = p * Math.pow(1 + r / n, n * y);
    rows.push({ year: y, value, interest: value - p });
  }
  // Partial final year if tenure is not whole years
  if (years > maxY && years - maxY > 0.01) {
    const value = p * Math.pow(1 + r / n, n * years);
    rows.push({ year: years, value, interest: value - p });
  }
  return rows;
}
