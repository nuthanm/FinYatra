/**
 * Motor insurance NCB — OD premium × NCB% → discount and net premium (educational).
 */

export type MotorInsuranceNcbInput = {
  /** Own-damage premium before NCB. */
  odPremium: number;
  /** No-claim bonus % (0–50 typical). */
  ncbPercent: number;
  /** Third-party premium (no NCB). */
  tpPremium?: number;
};

export type MotorInsuranceNcbResult = {
  odPremium: number;
  ncbPercent: number;
  tpPremium: number;
  ncbDiscount: number;
  odAfterNcb: number;
  totalPremium: number;
};

export function calculateMotorInsuranceNcb(input: MotorInsuranceNcbInput): MotorInsuranceNcbResult {
  const odPremium = Math.max(0, input.odPremium);
  const ncbPercent = Math.min(50, Math.max(0, input.ncbPercent));
  const tpPremium = Math.max(0, input.tpPremium ?? 0);
  const ncbDiscount = (odPremium * ncbPercent) / 100;
  const odAfterNcb = Math.max(0, odPremium - ncbDiscount);

  return {
    odPremium,
    ncbPercent,
    tpPremium,
    ncbDiscount,
    odAfterNcb,
    totalPremium: odAfterNcb + tpPremium,
  };
}
