/** Exact age / date difference in years, months, and days. */

export type AgeInput = {
  /** ISO date YYYY-MM-DD (birth or start). */
  fromDate: string;
  /** ISO date YYYY-MM-DD (as-of / end). Defaults to today when omitted in UI. */
  toDate: string;
};

export type AgeResult = {
  years: number;
  months: number;
  days: number;
  totalDays: number;
  fromDate: string;
  toDate: string;
  valid: boolean;
};

function parseIsoDate(iso: string): Date | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso.trim());
  if (!m) return null;
  const y = Number(m[1]);
  const mo = Number(m[2]);
  const d = Number(m[3]);
  const dt = new Date(y, mo - 1, d);
  if (dt.getFullYear() !== y || dt.getMonth() !== mo - 1 || dt.getDate() !== d) return null;
  return dt;
}

function daysInMonth(year: number, monthIndex: number): number {
  return new Date(year, monthIndex + 1, 0).getDate();
}

/** Calendar difference: years, months, days (non-negative when to ≥ from). */
export function diffYmd(from: Date, to: Date): { years: number; months: number; days: number } {
  let years = to.getFullYear() - from.getFullYear();
  let months = to.getMonth() - from.getMonth();
  let days = to.getDate() - from.getDate();

  if (days < 0) {
    months -= 1;
    const prevMonth = to.getMonth() === 0 ? 11 : to.getMonth() - 1;
    const prevYear = to.getMonth() === 0 ? to.getFullYear() - 1 : to.getFullYear();
    days += daysInMonth(prevYear, prevMonth);
  }
  if (months < 0) {
    years -= 1;
    months += 12;
  }
  return { years, months, days };
}

export function calculateAge(input: AgeInput): AgeResult {
  const from = parseIsoDate(input.fromDate);
  const to = parseIsoDate(input.toDate);
  if (!from || !to || to < from) {
    return {
      years: 0,
      months: 0,
      days: 0,
      totalDays: 0,
      fromDate: input.fromDate,
      toDate: input.toDate,
      valid: false,
    };
  }
  const { years, months, days } = diffYmd(from, to);
  const totalDays = Math.round((to.getTime() - from.getTime()) / 86_400_000);
  return {
    years,
    months,
    days,
    totalDays,
    fromDate: input.fromDate,
    toDate: input.toDate,
    valid: true,
  };
}
