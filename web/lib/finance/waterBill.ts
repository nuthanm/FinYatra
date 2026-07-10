/** Simple multi-slab water bill (educational / illustrative). */

export type WaterSlab = {
  /** Upper kl bound for this slab (inclusive). Use Infinity for last. */
  upTo: number;
  /** ₹ per kl in this slab. */
  ratePerKl: number;
};

export type WaterBillInput = {
  /** Consumption in kilolitres (kl). */
  kl: number;
  slabs: WaterSlab[];
  /** Fixed monthly / meter charge (₹). */
  fixedCharge?: number;
};

export type WaterSlabBreakdown = {
  fromKl: number;
  toKl: number;
  kl: number;
  ratePerKl: number;
  amount: number;
};

export type WaterBillResult = {
  kl: number;
  usageCharge: number;
  fixedCharge: number;
  totalBill: number;
  breakdown: WaterSlabBreakdown[];
};

/**
 * Bill = sum(kl in each slab × slab rate) + fixed charge.
 * Slabs should be ordered ascending by `upTo`.
 */
export function calculateWaterBill(input: WaterBillInput): WaterBillResult {
  const kl = Math.max(0, input.kl);
  const fixedCharge = Math.max(0, input.fixedCharge ?? 0);
  const slabs = [...input.slabs].sort((a, b) => a.upTo - b.upTo);

  const breakdown: WaterSlabBreakdown[] = [];
  let remaining = kl;
  let prev = 0;
  let usageCharge = 0;

  for (const slab of slabs) {
    if (remaining <= 0) break;
    const slabWidth = slab.upTo === Infinity ? remaining : Math.max(0, slab.upTo - prev);
    const used = Math.min(remaining, slabWidth);
    if (used > 0) {
      const amount = used * Math.max(0, slab.ratePerKl);
      usageCharge += amount;
      breakdown.push({
        fromKl: prev,
        toKl: prev + used,
        kl: used,
        ratePerKl: slab.ratePerKl,
        amount,
      });
      remaining -= used;
    }
    prev = slab.upTo === Infinity ? prev + used : slab.upTo;
  }

  if (remaining > 0 && slabs.length > 0) {
    const last = slabs[slabs.length - 1];
    const amount = remaining * Math.max(0, last.ratePerKl);
    usageCharge += amount;
    breakdown.push({
      fromKl: prev,
      toKl: prev + remaining,
      kl: remaining,
      ratePerKl: last.ratePerKl,
      amount,
    });
  }

  return {
    kl,
    usageCharge,
    fixedCharge,
    totalBill: usageCharge + fixedCharge,
    breakdown,
  };
}

/** Default illustrative 3-slab domestic water tariff (₹/kl). */
export const DEFAULT_WATER_SLABS: WaterSlab[] = [
  { upTo: 10, ratePerKl: 8 },
  { upTo: 25, ratePerKl: 15 },
  { upTo: Infinity, ratePerKl: 25 },
];
