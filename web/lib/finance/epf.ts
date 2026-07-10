/** EPF balance projection (educational — EPS treated separately). */

export const EPF_DEFAULT_RATE = 8.25;
export const EPF_WAGE_CEILING = 15_000;

export type EpfYearRow = {
  year: number;
  employee: number;
  employer: number;
  interest: number;
  balance: number;
  invested: number;
};

export type EpfResult = {
  maturity: number;
  totalEmployee: number;
  totalEmployer: number;
  totalInterest: number;
  monthlyEmployee: number;
  monthlyEmployerEpf: number;
  monthlyEps: number;
  rows: EpfYearRow[];
};

/**
 * Project EPF corpus.
 * Employee: 12% of PF wages → EPF.
 * Employer: 3.67% → EPF, 8.33% → EPS (not added to EPF corpus).
 */
export function calculateEpf(
  monthlyBasic: number,
  years: number,
  annualRatePercent: number,
  existingBalance: number,
  pfOnActual: boolean,
): EpfResult {
  const basic = Math.max(0, monthlyBasic);
  const nYears = Math.max(0, Math.floor(years));
  const rate = Math.max(0, annualRatePercent) / 100;
  const wage = pfOnActual ? basic : Math.min(basic, EPF_WAGE_CEILING);

  const monthlyEmployee = wage * 0.12;
  const monthlyEmployerEpf = wage * 0.0367;
  const monthlyEps = wage * 0.0833;
  const monthlyToEpf = monthlyEmployee + monthlyEmployerEpf;

  let balance = Math.max(0, existingBalance);
  let totalEmployee = 0;
  let totalEmployer = 0;
  let totalInterest = 0;
  const rows: EpfYearRow[] = [];

  if (nYears <= 0) {
    return {
      maturity: balance,
      totalEmployee: 0,
      totalEmployer: 0,
      totalInterest: 0,
      monthlyEmployee,
      monthlyEmployerEpf,
      monthlyEps,
      rows: [],
    };
  }

  for (let y = 1; y <= nYears; y++) {
    let yearEmployee = 0;
    let yearEmployer = 0;
    let yearInterest = 0;
    for (let m = 0; m < 12; m++) {
      balance += monthlyToEpf;
      yearEmployee += monthlyEmployee;
      yearEmployer += monthlyEmployerEpf;
      const interest = balance * (rate / 12);
      balance += interest;
      yearInterest += interest;
    }
    totalEmployee += yearEmployee;
    totalEmployer += yearEmployer;
    totalInterest += yearInterest;
    rows.push({
      year: y,
      employee: yearEmployee,
      employer: yearEmployer,
      interest: yearInterest,
      balance,
      invested: totalEmployee + totalEmployer + Math.max(0, existingBalance),
    });
  }

  return {
    maturity: balance,
    totalEmployee,
    totalEmployer,
    totalInterest,
    monthlyEmployee,
    monthlyEmployerEpf,
    monthlyEps,
    rows,
  };
}
