/** Simple multi-slab electricity bill (educational / illustrative). */

export type ElectricitySlab = {
  /** Upper unit bound for this slab (inclusive). Use Infinity for last. */
  upTo: number;
  /** ₹ per unit in this slab. */
  ratePerUnit: number;
};

export type ElectricityBillInput = {
  units: number;
  slabs: ElectricitySlab[];
  /** Fixed monthly charge (₹). */
  fixedCharge?: number;
};

export type ElectricitySlabBreakdown = {
  fromUnit: number;
  toUnit: number;
  units: number;
  ratePerUnit: number;
  amount: number;
};

export type ElectricityBillResult = {
  units: number;
  energyCharge: number;
  fixedCharge: number;
  totalBill: number;
  breakdown: ElectricitySlabBreakdown[];
};

/**
 * Bill = sum(units in each slab × slab rate) + fixed charge.
 * Slabs should be ordered ascending by `upTo`.
 */
export function calculateElectricityBill(input: ElectricityBillInput): ElectricityBillResult {
  const units = Math.max(0, input.units);
  const fixedCharge = Math.max(0, input.fixedCharge ?? 0);
  const slabs = [...input.slabs].sort((a, b) => a.upTo - b.upTo);

  const breakdown: ElectricitySlabBreakdown[] = [];
  let remaining = units;
  let prev = 0;
  let energyCharge = 0;

  for (const slab of slabs) {
    if (remaining <= 0) break;
    const slabWidth = slab.upTo === Infinity ? remaining : Math.max(0, slab.upTo - prev);
    const used = Math.min(remaining, slabWidth);
    if (used > 0) {
      const amount = used * Math.max(0, slab.ratePerUnit);
      energyCharge += amount;
      breakdown.push({
        fromUnit: prev + 1,
        toUnit: prev + used,
        units: used,
        ratePerUnit: slab.ratePerUnit,
        amount,
      });
      remaining -= used;
    }
    prev = slab.upTo === Infinity ? prev + used : slab.upTo;
  }

  // Any leftover units (if slabs don't cover) at last rate or 0
  if (remaining > 0 && slabs.length > 0) {
    const last = slabs[slabs.length - 1];
    const amount = remaining * Math.max(0, last.ratePerUnit);
    energyCharge += amount;
    breakdown.push({
      fromUnit: prev + 1,
      toUnit: prev + remaining,
      units: remaining,
      ratePerUnit: last.ratePerUnit,
      amount,
    });
  }

  return {
    units,
    energyCharge,
    fixedCharge,
    totalBill: energyCharge + fixedCharge,
    breakdown,
  };
}

/** Default illustrative 3-slab domestic tariff. */
export const DEFAULT_ELECTRICITY_SLABS: ElectricitySlab[] = [
  { upTo: 100, ratePerUnit: 3.5 },
  { upTo: 300, ratePerUnit: 5.5 },
  { upTo: Infinity, ratePerUnit: 7.5 },
];
