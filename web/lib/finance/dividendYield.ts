/** Dividend yield from per-share or total dividend inputs. */

export type DividendYieldMode = "perShare" | "total";

export type DividendYieldInput = {
  mode: DividendYieldMode;
  /** Annual dividend per share (₹). */
  annualDividendPerShare: number;
  /** Current / purchase price per share (₹). */
  pricePerShare: number;
  /** Total annual dividend received (₹). */
  totalDividend: number;
  /** Total investment / market value (₹). */
  investment: number;
  /** Shares held — used for income estimate. */
  sharesHeld: number;
};

export type DividendYieldResult = {
  yieldPercent: number;
  annualIncome: number;
  dividendPerShare: number;
  effectivePrice: number;
};

export function calculateDividendYield(input: DividendYieldInput): DividendYieldResult {
  const dps = Math.max(0, input.annualDividendPerShare);
  const price = Math.max(0, input.pricePerShare);
  const totalDiv = Math.max(0, input.totalDividend);
  const investment = Math.max(0, input.investment);
  const shares = Math.max(0, input.sharesHeld);

  if (input.mode === "perShare") {
    const yieldPercent = price > 0 ? (dps / price) * 100 : 0;
    const annualIncome = shares > 0 ? shares * dps : dps;
    return {
      yieldPercent,
      annualIncome,
      dividendPerShare: dps,
      effectivePrice: price,
    };
  }

  const yieldPercent = investment > 0 ? (totalDiv / investment) * 100 : 0;
  const impliedDps = shares > 0 ? totalDiv / shares : 0;
  const annualIncome = shares > 0 && impliedDps > 0 ? shares * impliedDps : totalDiv;
  const effectivePrice = shares > 0 ? investment / shares : investment;

  return {
    yieldPercent,
    annualIncome,
    dividendPerShare: impliedDps,
    effectivePrice,
  };
}
