/** Systematic Withdrawal Plan — corpus longevity and ending balance. */

export type SwpResult = {
  endingCorpus: number;
  totalWithdrawn: number;
  monthsLasted: number;
  depleted: boolean;
  yearly: { year: number; withdrawn: number; corpus: number }[];
};

/**
 * Monthly SWP: start with corpus, earn monthly return, withdraw fixed amount.
 * Stops early if corpus is exhausted.
 */
export function calculateSwp(
  corpus: number,
  monthlyWithdrawal: number,
  annualReturnPercent: number,
  years: number,
): SwpResult {
  let balance = Math.max(0, corpus);
  const withdrawal = Math.max(0, monthlyWithdrawal);
  const r = annualReturnPercent / 100 / 12;
  const maxMonths = Math.max(0, Math.floor(years * 12));

  let totalWithdrawn = 0;
  let monthsLasted = 0;
  const yearly: { year: number; withdrawn: number; corpus: number }[] = [];
  let yearWithdrawn = 0;

  for (let m = 1; m <= maxMonths; m++) {
    if (balance <= 0) break;
    balance = balance * (1 + r);
    const take = Math.min(withdrawal, balance);
    balance -= take;
    totalWithdrawn += take;
    yearWithdrawn += take;
    monthsLasted = m;

    if (m % 12 === 0 || m === maxMonths) {
      yearly.push({
        year: Math.ceil(m / 12),
        withdrawn: yearWithdrawn,
        corpus: Math.max(0, balance),
      });
      yearWithdrawn = 0;
    }

    if (balance <= 0.01) {
      balance = 0;
      break;
    }
  }

  return {
    endingCorpus: Math.max(0, balance),
    totalWithdrawn,
    monthsLasted,
    depleted: balance <= 0 && monthsLasted < maxMonths,
    yearly,
  };
}

/** Approximate months until corpus runs out (cap at 600 months). */
export function swpMonthsUntilDepleted(
  corpus: number,
  monthlyWithdrawal: number,
  annualReturnPercent: number,
): number {
  const result = calculateSwp(corpus, monthlyWithdrawal, annualReturnPercent, 50);
  return result.monthsLasted;
}
