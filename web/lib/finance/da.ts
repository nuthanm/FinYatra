/** Dearness Allowance from basic pay and DA %. */

export type DaInput = {
  basicPay: number;
  daPercent: number;
};

export type DaResult = {
  basicPay: number;
  daPercent: number;
  daAmount: number;
  total: number;
};

export function calculateDa(input: DaInput): DaResult {
  const basicPay = Math.max(0, input.basicPay);
  const daPercent = Math.max(0, input.daPercent);
  const daAmount = (basicPay * daPercent) / 100;
  return {
    basicPay,
    daPercent,
    daAmount,
    total: basicPay + daAmount,
  };
}
