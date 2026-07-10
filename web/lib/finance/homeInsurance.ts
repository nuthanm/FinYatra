/**
 * Home insurance premium estimate — property value × rate% (educational).
 */

export const DEFAULT_HOME_INSURANCE_RATE = 0.1; // 0.1% of sum insured (illustrative)

export type HomeInsuranceInput = {
  propertyValue: number;
  /** Premium rate as % of property value (e.g. 0.1). */
  ratePercent: number;
};

export type HomeInsuranceResult = {
  propertyValue: number;
  ratePercent: number;
  estimatedPremium: number;
};

export function calculateHomeInsurance(input: HomeInsuranceInput): HomeInsuranceResult {
  const propertyValue = Math.max(0, input.propertyValue);
  const ratePercent = Math.max(0, input.ratePercent);
  const estimatedPremium = (propertyValue * ratePercent) / 100;

  return {
    propertyValue,
    ratePercent,
    estimatedPremium,
  };
}
