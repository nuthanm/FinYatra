/** Leave Travel Allowance (LTA) exemption estimate under Section 10(5) (simplified). */

/** Note: typically up to 2 journeys in a 4-year block (illustrative). */
export const LTA_TRIPS_PER_BLOCK = 2;
export const LTA_BLOCK_YEARS = 4;

export type LtaResult = {
  claimed: number;
  exemptLimit: number;
  exempt: number;
  taxable: number;
  tripsUsed: number;
  tripsAllowed: number;
};

/**
 * Taxable LTA = max(0, claimed − exempt).
 * Exempt is the lesser of claimed and the user-entered exempt limit
 * (actual exemption also depends on fare rules and 2 trips / 4-year block).
 */
export function calculateLta(
  claimed: number,
  exemptLimit: number,
  tripsUsed = 1,
): LtaResult {
  const c = Math.max(0, claimed);
  const limit = Math.max(0, exemptLimit);
  const trips = Math.max(0, Math.floor(tripsUsed));
  const eligible = trips > 0 && trips <= LTA_TRIPS_PER_BLOCK;
  const exempt = eligible ? Math.min(c, limit) : 0;
  const taxable = Math.max(0, c - exempt);

  return {
    claimed: c,
    exemptLimit: limit,
    exempt,
    taxable,
    tripsUsed: trips,
    tripsAllowed: LTA_TRIPS_PER_BLOCK,
  };
}
