/** Educational car insurance premium estimate (not an insurer quote). */

export type CarInsuranceInput = {
  idv: number;
  /** Own-damage rate as % of IDV. */
  odRatePercent: number;
  /** Flat third-party liability premium estimate. */
  thirdPartyPremium: number;
};

export type CarInsuranceResult = {
  idv: number;
  odRatePercent: number;
  ownDamagePremium: number;
  thirdPartyPremium: number;
  totalPremium: number;
};

/** Default illustrative TP premium for a private car (varies by cubic capacity). */
export const DEFAULT_TP_PREMIUM = 3_500;

export function calculateCarInsurance(input: CarInsuranceInput): CarInsuranceResult {
  const idv = Math.max(0, input.idv);
  const odRatePercent = Math.max(0, input.odRatePercent);
  const thirdPartyPremium = Math.max(0, input.thirdPartyPremium);
  const ownDamagePremium = (idv * odRatePercent) / 100;

  return {
    idv,
    odRatePercent,
    ownDamagePremium,
    thirdPartyPremium,
    totalPremium: ownDamagePremium + thirdPartyPremium,
  };
}
