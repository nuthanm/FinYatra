/**
 * NPS E/C/G allocation — validate sum ≈ 100%, blend expected return.
 * Educational; ignores age equity caps / Auto choice rules.
 */

export type NpsAssetAllocationInput = {
  equityPercent: number;
  corporatePercent: number;
  governmentPercent: number;
  /** Expected return % for Equity (E). */
  equityReturnPercent: number;
  /** Expected return % for Corporate (C). */
  corporateReturnPercent: number;
  /** Expected return % for Government (G). */
  governmentReturnPercent: number;
};

export type NpsAssetAllocationResult = {
  equityPercent: number;
  corporatePercent: number;
  governmentPercent: number;
  allocationSum: number;
  isValid: boolean;
  /** Weighted expected return % p.a. */
  blendedReturnPercent: number;
  equityReturnPercent: number;
  corporateReturnPercent: number;
  governmentReturnPercent: number;
};

export function calculateNpsAssetAllocation(
  input: NpsAssetAllocationInput,
): NpsAssetAllocationResult {
  const e = Math.max(0, input.equityPercent);
  const c = Math.max(0, input.corporatePercent);
  const g = Math.max(0, input.governmentPercent);
  const eRet = Math.max(0, input.equityReturnPercent);
  const cRet = Math.max(0, input.corporateReturnPercent);
  const gRet = Math.max(0, input.governmentReturnPercent);
  const allocationSum = e + c + g;
  const isValid = Math.abs(allocationSum - 100) < 0.51;

  const blendedReturnPercent =
    allocationSum > 0
      ? (e * eRet + c * cRet + g * gRet) / allocationSum
      : 0;

  return {
    equityPercent: e,
    corporatePercent: c,
    governmentPercent: g,
    allocationSum,
    isValid,
    blendedReturnPercent,
    equityReturnPercent: eRet,
    corporateReturnPercent: cRet,
    governmentReturnPercent: gRet,
  };
}
