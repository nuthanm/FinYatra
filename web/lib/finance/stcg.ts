import {
  calculateCapitalGains,
  type CapGainAsset,
  type CapGainResult,
} from "@/lib/finance/capitalGains";

/** Short-term capital gains — equity 20% or property at slab (educational). */

export type StcgAsset = "equity" | "property";

export type StcgInput = {
  asset: StcgAsset;
  buyPrice: number;
  sellPrice: number;
  holdingMonths: number;
  /** Marginal slab % (used for property STCG). */
  taxSlabPercent: number;
};

export type StcgResult = CapGainResult & {
  asset: StcgAsset;
  buyPrice: number;
  sellPrice: number;
  holdingMonths: number;
  /** Tax if held long enough for LTCG (wait-vs-sell). */
  ltcgTaxIfWaited: number;
  taxSavedByWaiting: number;
};

function toCapAsset(asset: StcgAsset): CapGainAsset {
  return asset;
}

export function calculateStcg(input: StcgInput): StcgResult {
  const asset = input.asset;
  const buyPrice = Math.max(0, input.buyPrice);
  const sellPrice = Math.max(0, input.sellPrice);
  const holdingMonths = Math.max(0, input.holdingMonths);
  const taxSlabPercent = Math.min(42, Math.max(0, input.taxSlabPercent));
  const threshold = asset === "equity" ? 12 : 24;

  // Force short-term path for STCG calculator focus.
  const shortMonths = Math.min(holdingMonths, Math.max(0, threshold - 1));
  const base = calculateCapitalGains({
    asset: toCapAsset(asset),
    buyPrice,
    sellPrice,
    holdingMonths: shortMonths,
    taxSlabPercent,
    exemptionAmount: 0,
  });

  const long = calculateCapitalGains({
    asset: toCapAsset(asset),
    buyPrice,
    sellPrice,
    holdingMonths: threshold + 1,
    taxSlabPercent,
    exemptionAmount: 0,
  });

  const ltcgTaxIfWaited = long.taxAmount;
  const taxSavedByWaiting = Math.max(0, base.taxAmount - ltcgTaxIfWaited);

  return {
    ...base,
    asset,
    buyPrice,
    sellPrice,
    holdingMonths,
    isLongTerm: false,
    holdingThresholdMonths: threshold,
    ltcgTaxIfWaited,
    taxSavedByWaiting,
  };
}
