/** Pay commission revised basic — 7th CPC fitment-style estimate. */

export type PayCommissionInput = {
  currentBasic: number;
  /** Fitment factor (e.g. 2.57 for 7th CPC). */
  fitmentFactor: number;
};

export type PayCommissionResult = {
  currentBasic: number;
  fitmentFactor: number;
  revisedBasic: number;
  increase: number;
  increasePercent: number;
};

export function calculatePayCommission(input: PayCommissionInput): PayCommissionResult {
  const currentBasic = Math.max(0, input.currentBasic);
  const fitmentFactor = Math.max(0, input.fitmentFactor);
  const revisedBasic = currentBasic * fitmentFactor;
  const increase = revisedBasic - currentBasic;
  const increasePercent = currentBasic > 0 ? (increase / currentBasic) * 100 : 0;

  return {
    currentBasic,
    fitmentFactor,
    revisedBasic,
    increase,
    increasePercent,
  };
}
