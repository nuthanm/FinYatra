import {
  calculateCapitalGains,
  type CapGainAsset,
  type CapGainResult,
} from "@/lib/finance/capitalGains";

/** Long-term capital gains only — equity / property (reuses capital-gains rules). */

export type LtcgAsset = "equity" | "property";

export type LtcgInput = {
  asset: LtcgAsset;
  buyPrice: number;
  sellPrice: number;
  holdingMonths: number;
  /** Optional Sec 54 / 54EC / 54F exemption (₹). */
  exemptionAmount: number;
};

export type LtcgResult = CapGainResult & {
  asset: LtcgAsset;
  buyPrice: number;
  sellPrice: number;
  holdingMonths: number;
  /** True when holding is below LTCG threshold (tax computed as STCG for reference). */
  belowThreshold: boolean;
};

function toCapAsset(asset: LtcgAsset): CapGainAsset {
  return asset;
}

export function calculateLtcg(input: LtcgInput): LtcgResult {
  const asset = input.asset;
  const buyPrice = Math.max(0, input.buyPrice);
  const sellPrice = Math.max(0, input.sellPrice);
  const holdingMonths = Math.max(0, input.holdingMonths);
  const threshold = asset === "equity" ? 12 : 24;

  // Force long-term path when at/above threshold; otherwise show actual classification.
  const effectiveMonths = Math.max(holdingMonths, threshold);
  const base = calculateCapitalGains({
    asset: toCapAsset(asset),
    buyPrice,
    sellPrice,
    holdingMonths: effectiveMonths,
    taxSlabPercent: 30,
    exemptionAmount: Math.max(0, input.exemptionAmount),
  });

  const belowThreshold = holdingMonths < threshold;

  return {
    ...base,
    asset,
    buyPrice,
    sellPrice,
    holdingMonths,
    belowThreshold,
    // If user holding is short, still report LTCG math on forced long path but flag it.
    isLongTerm: !belowThreshold,
    holdingThresholdMonths: threshold,
  };
}
