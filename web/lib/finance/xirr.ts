/** XIRR via Newton–Raphson (educational). */

export type XirrCashflow = {
  /** ISO date string YYYY-MM-DD */
  date: string;
  /** Negative = investment/outflow; positive = redemption/inflow. */
  amount: number;
};

export type XirrResult = {
  rate: number | null;
  converged: boolean;
  cashflowCount: number;
  totalInvested: number;
  finalValue: number;
  profit: number;
};

const MS_PER_DAY = 86_400_000;
const MAX_ITER = 100;
const TOL = 1e-7;

function daysFrom(base: Date, d: Date): number {
  return (d.getTime() - base.getTime()) / MS_PER_DAY;
}

function parseDate(iso: string): Date | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso.trim());
  if (!m) return null;
  const d = new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
  return Number.isNaN(d.getTime()) ? null : d;
}

/**
 * Compute annualised XIRR for irregular cashflows.
 * Include investments as negative amounts and a final positive redemption/value.
 */
export function calculateXirr(cashflows: XirrCashflow[]): XirrResult {
  const parsed = cashflows
    .map((cf) => {
      const date = parseDate(cf.date);
      return date ? { date, amount: cf.amount } : null;
    })
    .filter((x): x is { date: Date; amount: number } => x !== null && x.amount !== 0);

  const totalInvested = parsed.filter((c) => c.amount < 0).reduce((s, c) => s + Math.abs(c.amount), 0);
  const finalValue = parsed.filter((c) => c.amount > 0).reduce((s, c) => s + c.amount, 0);
  const profit = finalValue - totalInvested;

  if (parsed.length < 2) {
    return { rate: null, converged: false, cashflowCount: parsed.length, totalInvested, finalValue, profit };
  }

  const hasPos = parsed.some((c) => c.amount > 0);
  const hasNeg = parsed.some((c) => c.amount < 0);
  if (!hasPos || !hasNeg) {
    return { rate: null, converged: false, cashflowCount: parsed.length, totalInvested, finalValue, profit };
  }

  parsed.sort((a, b) => a.date.getTime() - b.date.getTime());
  const t0 = parsed[0].date;

  const npv = (r: number) =>
    parsed.reduce((sum, c) => {
      const years = daysFrom(t0, c.date) / 365;
      return sum + c.amount / Math.pow(1 + r, years);
    }, 0);

  const dNpv = (r: number) =>
    parsed.reduce((sum, c) => {
      const years = daysFrom(t0, c.date) / 365;
      if (years === 0) return sum;
      return sum - (years * c.amount) / Math.pow(1 + r, years + 1);
    }, 0);

  let rate = 0.1;
  let converged = false;
  for (let i = 0; i < MAX_ITER; i++) {
    const f = npv(rate);
    const df = dNpv(rate);
    if (Math.abs(df) < 1e-12) break;
    const next = rate - f / df;
    if (!Number.isFinite(next) || next <= -0.9999) break;
    if (Math.abs(next - rate) < TOL) {
      rate = next;
      converged = Math.abs(npv(rate)) < 1e-4;
      break;
    }
    rate = next;
  }

  if (!converged) {
    converged = Math.abs(npv(rate)) < 1e-3 && Number.isFinite(rate);
  }

  return {
    rate: converged ? rate : null,
    converged,
    cashflowCount: parsed.length,
    totalInvested,
    finalValue,
    profit,
  };
}
