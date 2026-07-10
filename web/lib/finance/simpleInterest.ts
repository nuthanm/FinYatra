export type SimpleInterestResult = {
  principal: number;
  ratePercent: number;
  years: number;
  interest: number;
  amount: number;
};

/**
 * Simple interest: SI = P × R × T / 100; Amount = P + SI.
 * Time may be fractional (e.g. 2.5 years).
 */
export function calculateSimpleInterest(
  principal: number,
  ratePercent: number,
  years: number,
): SimpleInterestResult {
  const p = Math.max(0, principal);
  const r = Math.max(0, ratePercent);
  const t = Math.max(0, years);
  const interest = (p * r * t) / 100;

  return {
    principal: p,
    ratePercent: r,
    years: t,
    interest,
    amount: p + interest,
  };
}
