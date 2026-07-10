/**
 * Leave Travel Allowance — aliases Section 10(5) LTA logic.
 * Same maths as `calculateLta` for the leave-travel-allowance catalog tool.
 */

import { calculateLta, LTA_BLOCK_YEARS, LTA_TRIPS_PER_BLOCK, type LtaResult } from "@/lib/finance/lta";

export type LeaveTravelAllowanceInput = {
  claimed: number;
  exemptLimit: number;
  tripsUsed?: number;
};

export type LeaveTravelAllowanceResult = LtaResult;

export { LTA_BLOCK_YEARS, LTA_TRIPS_PER_BLOCK };

export function calculateLeaveTravelAllowance(
  input: LeaveTravelAllowanceInput,
): LeaveTravelAllowanceResult {
  return calculateLta(input.claimed, input.exemptLimit, input.tripsUsed ?? 1);
}
