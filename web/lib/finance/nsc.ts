/** National Savings Certificate — 5-year annual compounding (illustrative). */

export const NSC_DEFAULT_RATE = 7.7;
export const NSC_TENURE_YEARS = 5;
export const NSC_80C_LIMIT = 150_000;

export type NscYearRow = {
  year: number;
  opening: number;
  interest: number;
  closing: number;
  /** Accrued interest typically reinvested; years 1–4 may qualify under 80C (simplified). */
  qualifies80cInterest: boolean;
};

export type NscResult = {
  deposit: number;
  maturity: number;
  totalInterest: number;
  deposit80c: number;
  intermediateInterest80c: number;
  rows: NscYearRow[];
};

/**
 * Maturity = P × (1 + r)^5 with annual compounding.
 * Year-wise interest is reinvested; intermediate-year interest (1–4) is noted for 80C.
 */
export function calculateNsc(
  deposit: number,
  annualRatePercent = NSC_DEFAULT_RATE,
  years = NSC_TENURE_YEARS,
): NscResult {
  const p = Math.max(0, deposit);
  const r = Math.max(0, annualRatePercent) / 100;
  const n = Math.max(0, Math.floor(years));

  if (p <= 0 || n <= 0) {
    return {
      deposit: 0,
      maturity: 0,
      totalInterest: 0,
      deposit80c: 0,
      intermediateInterest80c: 0,
      rows: [],
    };
  }

  const maturity = p * Math.pow(1 + r, n);
  const rows: NscYearRow[] = [];
  let balance = p;
  let intermediateInterest80c = 0;

  for (let y = 1; y <= n; y++) {
    const opening = balance;
    const interest = opening * r;
    const closing = opening + interest;
    const qualifies80cInterest = y < n; // years 1..n-1 reinvested interest
    if (qualifies80cInterest) intermediateInterest80c += interest;
    rows.push({ year: y, opening, interest, closing, qualifies80cInterest });
    balance = closing;
  }

  return {
    deposit: p,
    maturity,
    totalInterest: maturity - p,
    deposit80c: Math.min(p, NSC_80C_LIMIT),
    intermediateInterest80c,
    rows,
  };
}
