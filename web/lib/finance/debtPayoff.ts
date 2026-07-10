/** Single-loan debt payoff with extra payment — snowball/avalanche (same for one debt). */

export type DebtPayoffStrategy = "snowball" | "avalanche";

export type DebtPayoffInput = {
  /** Outstanding principal. */
  balance: number;
  /** Annual interest rate %. */
  annualRatePercent: number;
  /** Scheduled monthly EMI / minimum payment. */
  monthlyPayment: number;
  /** Extra monthly payment toward principal. */
  extraPayment?: number;
  /** Strategy label (educational; one loan → same math). */
  strategy?: DebtPayoffStrategy;
};

export type DebtPayoffResult = {
  balance: number;
  annualRatePercent: number;
  monthlyPayment: number;
  extraPayment: number;
  totalMonthly: number;
  strategy: DebtPayoffStrategy;
  /** Months to clear with scheduled payment only. */
  monthsWithoutExtra: number;
  /** Months to clear with EMI + extra. */
  monthsWithExtra: number;
  interestWithoutExtra: number;
  interestWithExtra: number;
  interestSaved: number;
  monthsSaved: number;
  feasible: boolean;
};

const MAX_MONTHS = 600;

function simulatePayoff(
  balance: number,
  annualRatePercent: number,
  payment: number,
): { months: number; interest: number; feasible: boolean } {
  let principal = Math.max(0, balance);
  const r = Math.max(0, annualRatePercent) / 100 / 12;
  if (principal <= 0) return { months: 0, interest: 0, feasible: true };
  if (payment <= 0) return { months: MAX_MONTHS, interest: 0, feasible: false };

  let months = 0;
  let interestPaid = 0;
  while (principal > 0.01 && months < MAX_MONTHS) {
    const interest = principal * r;
    // Payment must cover interest or loan never clears
    if (payment <= interest + 0.01 && principal > payment) {
      return { months: MAX_MONTHS, interest: interestPaid, feasible: false };
    }
    const towardPrincipal = Math.min(principal, payment - interest);
    interestPaid += interest;
    principal = Math.max(0, principal - towardPrincipal);
    months += 1;
  }

  return {
    months,
    interest: interestPaid,
    feasible: principal <= 0.01,
  };
}

export function calculateDebtPayoff(input: DebtPayoffInput): DebtPayoffResult {
  const balance = Math.max(0, input.balance);
  const rate = Math.max(0, input.annualRatePercent);
  const monthlyPayment = Math.max(0, input.monthlyPayment);
  const extraPayment = Math.max(0, input.extraPayment ?? 0);
  const strategy = input.strategy ?? "avalanche";
  const totalMonthly = monthlyPayment + extraPayment;

  const base = simulatePayoff(balance, rate, monthlyPayment);
  const withExtra = simulatePayoff(balance, rate, totalMonthly);

  return {
    balance,
    annualRatePercent: rate,
    monthlyPayment,
    extraPayment,
    totalMonthly,
    strategy,
    monthsWithoutExtra: base.months,
    monthsWithExtra: withExtra.months,
    interestWithoutExtra: base.interest,
    interestWithExtra: withExtra.interest,
    interestSaved: Math.max(0, base.interest - withExtra.interest),
    monthsSaved: Math.max(0, base.months - withExtra.months),
    feasible: withExtra.feasible,
  };
}
