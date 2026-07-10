import { emi, futureValue, sipFutureValue } from "./compound";

export type ProjectionRow = { year: number; invested: number; value: number; gain: number };
export type AmortizationRow = { year: number; principalPaid: number; interestPaid: number; balance: number };

export function sipYearly(monthlySip: number, annualRatePercent: number, years: number): ProjectionRow[] {
  if (years <= 0 || monthlySip <= 0) return [];
  const rows: ProjectionRow[] = [];
  for (let y = 1; y <= years; y++) {
    const months = y * 12;
    const invested = monthlySip * months;
    const value = sipFutureValue(monthlySip, annualRatePercent, months);
    rows.push({ year: y, invested, value, gain: value - invested });
  }
  return rows;
}

export function lumpsumYearly(principal: number, annualRatePercent: number, years: number): ProjectionRow[] {
  if (years <= 0 || principal <= 0) return [];
  const rows: ProjectionRow[] = [];
  for (let y = 1; y <= years; y++) {
    const value = futureValue(principal, annualRatePercent, y);
    rows.push({ year: y, invested: principal, value, gain: value - principal });
  }
  return rows;
}

export function compoundYearly(
  principal: number,
  annualRatePercent: number,
  years: number,
  compoundsPerYear = 1,
): ProjectionRow[] {
  if (years <= 0 || principal <= 0) return [];
  const n = Math.max(1, compoundsPerYear);
  const r = annualRatePercent / 100;
  const rows: ProjectionRow[] = [];
  for (let y = 1; y <= years; y++) {
    const value = principal * Math.pow(1 + r / n, n * y);
    rows.push({ year: y, invested: principal, value, gain: value - principal });
  }
  return rows;
}

export function inflationYearly(present: number, inflationPercent: number, years: number): ProjectionRow[] {
  if (years <= 0) return [];
  const rows: ProjectionRow[] = [];
  for (let y = 1; y <= years; y++) {
    const value = futureValue(present, inflationPercent, y);
    rows.push({ year: y, invested: present, value, gain: value - present });
  }
  return rows;
}

export function emiYearly(principal: number, annualRatePercent: number, years: number): AmortizationRow[] {
  const months = Math.round(years * 12);
  if (principal <= 0 || months <= 0) return [];

  const monthlyEmi = emi(principal, annualRatePercent, months);
  let balance = principal;
  const r = annualRatePercent / 100 / 12;
  const yearly: AmortizationRow[] = [];

  for (let y = 1; y <= Math.max(1, Math.ceil(months / 12)); y++) {
    let principalPaid = 0;
    let interestPaid = 0;
    const monthsInYear = Math.min(12, months - (y - 1) * 12);
    if (monthsInYear <= 0) break;

    for (let m = 0; m < monthsInYear; m++) {
      const interest = r > 0 ? balance * r : 0;
      let principalPart = monthlyEmi - interest;
      if (principalPart > balance) principalPart = balance;
      interestPaid += interest;
      principalPaid += principalPart;
      balance -= principalPart;
      if (balance <= 0) balance = 0;
    }

    yearly.push({ year: y, principalPaid, interestPaid, balance });
    if (balance <= 0) break;
  }

  return yearly;
}
