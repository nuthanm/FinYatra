export function futureValue(present: number, annualRatePercent: number, years: number): number {
  return present * Math.pow(1 + annualRatePercent / 100, years);
}

export function sipFutureValue(monthlySip: number, annualRatePercent: number, months: number): number {
  if (monthlySip <= 0 || months <= 0) return 0;
  const r = annualRatePercent / 100 / 12;
  return r > 0 ? monthlySip * ((Math.pow(1 + r, months) - 1) / r) : monthlySip * months;
}

export function sipRequired(target: number, annualRatePercent: number, months: number): number {
  if (target <= 0 || months <= 0) return 0;
  const r = annualRatePercent / 100 / 12;
  return r > 0 ? (target * r) / (Math.pow(1 + r, months) - 1) : target / months;
}

export function emi(principal: number, annualRatePercent: number, months: number): number {
  if (principal <= 0 || months <= 0) return 0;
  const r = annualRatePercent / 100 / 12;
  if (r <= 0) return principal / months;
  const pow = Math.pow(1 + r, months);
  return principal * ((r * pow) / (pow - 1));
}

export function inflate(amount: number, inflationPercent: number, years: number): number {
  return futureValue(amount, inflationPercent, years);
}

export function cagr(beginning: number, ending: number, years: number): number {
  if (beginning <= 0 || ending <= 0 || years <= 0) return 0;
  return (Math.pow(ending / beginning, 1 / years) - 1) * 100;
}

export function compoundInterest(
  principal: number,
  annualRatePercent: number,
  years: number,
  compoundsPerYear = 1,
): number {
  if (principal <= 0 || years <= 0) return 0;
  const n = Math.max(1, compoundsPerYear);
  const r = annualRatePercent / 100;
  return principal * Math.pow(1 + r / n, n * years);
}

export function ruleOf72(ratePercent: number): number {
  if (ratePercent <= 0) return 0;
  return 72 / ratePercent;
}
