/** Convert foreign currency to INR at a given rate, with optional fee %. */

export type ForexInput = {
  /** Amount in foreign currency units. */
  amount: number;
  /** INR per 1 unit of foreign currency. */
  rateInrPerUnit: number;
  /** Optional fee as % of converted INR (bank / card markup). */
  feePercent?: number;
};

export type ForexResult = {
  amount: number;
  rateInrPerUnit: number;
  feePercent: number;
  convertedInr: number;
  feeInr: number;
  netInr: number;
};

export function calculateForex(input: ForexInput): ForexResult {
  const amount = Math.max(0, input.amount);
  const rateInrPerUnit = Math.max(0, input.rateInrPerUnit);
  const feePercent = Math.max(0, input.feePercent ?? 0);
  const convertedInr = amount * rateInrPerUnit;
  const feeInr = (convertedInr * feePercent) / 100;
  const netInr = Math.max(0, convertedInr - feeInr);
  return {
    amount,
    rateInrPerUnit,
    feePercent,
    convertedInr,
    feeInr,
    netInr,
  };
}
