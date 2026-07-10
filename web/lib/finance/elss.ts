import { sipFutureValue } from "@/lib/finance/compound";

/** ELSS SIP projection with simplified LTCG estimate (Finance Act 2024 rates). */

export const ELSS_LTCG_RATE = 0.125;
export const ELSS_LTCG_EXEMPTION = 125_000;
export const ELSS_LOCKIN_YEARS = 3;

export type ElssResult = {
  invested: number;
  maturity: number;
  gains: number;
  taxableGains: number;
  ltcgTax: number;
  postTaxValue: number;
  lockInEndsYear: number;
};

export function calculateElss(
  monthlySip: number,
  annualReturnPercent: number,
  years: number,
): ElssResult {
  const sip = Math.max(0, monthlySip);
  const y = Math.max(0, years);
  const months = Math.round(y * 12);
  const invested = sip * months;
  const maturity = sipFutureValue(sip, annualReturnPercent, months);
  const gains = Math.max(0, maturity - invested);
  const taxableGains = Math.max(0, gains - ELSS_LTCG_EXEMPTION);
  const ltcgTax = taxableGains * ELSS_LTCG_RATE;
  const postTaxValue = maturity - ltcgTax;

  return {
    invested,
    maturity,
    gains,
    taxableGains,
    ltcgTax,
    postTaxValue,
    lockInEndsYear: ELSS_LOCKIN_YEARS,
  };
}

export function elssYearlyRows(
  monthlySip: number,
  annualReturnPercent: number,
  years: number,
): { year: number; invested: number; value: number; gain: number }[] {
  const n = Math.max(0, Math.floor(years));
  const rows: { year: number; invested: number; value: number; gain: number }[] = [];
  for (let y = 1; y <= n; y++) {
    const months = y * 12;
    const invested = monthlySip * months;
    const value = sipFutureValue(monthlySip, annualReturnPercent, months);
    rows.push({ year: y, invested, value, gain: value - invested });
  }
  return rows;
}
