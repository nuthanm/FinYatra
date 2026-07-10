/** TCS on foreign remittance under LRS — 5% / 20% (reuses TCS LRS logic). */

import {
  calculateTcs,
  TCS_LRS_HIGH_RATE,
  TCS_LRS_LOW_RATE,
  TCS_LRS_THRESHOLD,
  type TcsResult,
} from "@/lib/finance/tcs";

export { TCS_LRS_HIGH_RATE, TCS_LRS_LOW_RATE, TCS_LRS_THRESHOLD };

export type TcsOnForeignRemittanceInput = {
  /** LRS remittance amount (₹). */
  remittanceAmount: number;
};

export type TcsOnForeignRemittanceResult = TcsResult & {
  remittanceAmount: number;
};

export function calculateTcsOnForeignRemittance(
  input: TcsOnForeignRemittanceInput,
): TcsOnForeignRemittanceResult {
  const remittanceAmount = Math.max(0, input.remittanceAmount);
  const result = calculateTcs({ natureId: "lrs_foreign", amount: remittanceAmount });
  return { ...result, remittanceAmount };
}
