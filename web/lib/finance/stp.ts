import { futureValue, sipFutureValue } from "@/lib/finance/compound";

export type StpInput = {
  /** Lumpsum parked in debt at start. */
  debtCorpus: number;
  /** Amount transferred from debt → equity each month. */
  monthlyTransfer: number;
  /** Number of monthly STP instalments. */
  months: number;
  equityReturnPercent: number;
  debtReturnPercent: number;
};

export type StpYearRow = {
  year: number;
  transferred: number;
  equityValue: number;
  debtValue: number;
  totalValue: number;
};

export type StpResult = {
  totalTransferred: number;
  equityValue: number;
  debtResidual: number;
  totalValue: number;
  months: number;
  yearly: StpYearRow[];
};

/**
 * Simplified STP: start with lumpsum in debt; each month transfer a fixed amount
 * to equity. Equity grows as an SIP of those transfers; remaining debt compounds.
 * If monthly transfer × months exceeds debt corpus, transfer is capped by balance.
 */
export function calculateStp(input: StpInput): StpResult {
  const months = Math.max(0, Math.floor(input.months));
  const transfer = Math.max(0, input.monthlyTransfer);
  const equityR = input.equityReturnPercent / 100 / 12;
  const debtR = input.debtReturnPercent / 100 / 12;

  let debt = Math.max(0, input.debtCorpus);
  let equity = 0;
  let totalTransferred = 0;
  const yearly: StpYearRow[] = [];
  let yearTransferred = 0;

  for (let m = 1; m <= months; m++) {
    debt = debt * (1 + debtR);
    equity = equity * (1 + equityR);
    const move = Math.min(transfer, debt);
    debt -= move;
    equity += move;
    totalTransferred += move;
    yearTransferred += move;

    if (m % 12 === 0 || m === months) {
      yearly.push({
        year: Math.ceil(m / 12),
        transferred: yearTransferred,
        equityValue: Math.max(0, equity),
        debtValue: Math.max(0, debt),
        totalValue: Math.max(0, equity + debt),
      });
      yearTransferred = 0;
    }
  }

  return {
    totalTransferred,
    equityValue: Math.max(0, equity),
    debtResidual: Math.max(0, debt),
    totalValue: Math.max(0, equity + debt),
    months,
    yearly,
  };
}

/**
 * Closed-form approximation: equity FV of STP instalments + remaining debt FV.
 * Assumes transfers complete without mid-schedule shortfall (use calculateStp for caps).
 */
export function approximateStp(
  debtCorpus: number,
  monthlyTransfer: number,
  months: number,
  equityReturnPercent: number,
  debtReturnPercent: number,
): { equityValue: number; debtResidual: number; totalValue: number; totalTransferred: number } {
  const n = Math.max(0, Math.floor(months));
  const transfer = Math.max(0, monthlyTransfer);
  const effectiveMonths = transfer > 0 ? Math.min(n, Math.floor(Math.max(0, debtCorpus) / transfer)) : 0;
  const totalTransferred = transfer * effectiveMonths;
  const equityValue = sipFutureValue(transfer, equityReturnPercent, effectiveMonths);
  const remainingPrincipal = Math.max(0, debtCorpus - totalTransferred);
  const debtResidual = futureValue(remainingPrincipal, debtReturnPercent, n / 12);
  return {
    equityValue,
    debtResidual,
    totalValue: equityValue + debtResidual,
    totalTransferred,
  };
}
