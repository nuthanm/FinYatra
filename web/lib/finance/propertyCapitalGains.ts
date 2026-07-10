import { calculateLtcg, type LtcgResult } from "@/lib/finance/ltcg";

/** Property buy/sell → LTCG (wraps capital-gains property path). */

export type PropertyCapitalGainsInput = {
  buyPrice: number;
  sellPrice: number;
  holdingMonths: number;
  /** Optional Sec 54 / 54EC exemption (₹). */
  exemptionAmount: number;
};

export type PropertyCapitalGainsResult = LtcgResult & {
  buyPrice: number;
  sellPrice: number;
};

export function calculatePropertyCapitalGains(
  input: PropertyCapitalGainsInput,
): PropertyCapitalGainsResult {
  const base = calculateLtcg({
    asset: "property",
    buyPrice: input.buyPrice,
    sellPrice: input.sellPrice,
    holdingMonths: input.holdingMonths,
    exemptionAmount: input.exemptionAmount,
  });

  return {
    ...base,
    buyPrice: Math.max(0, input.buyPrice),
    sellPrice: Math.max(0, input.sellPrice),
  };
}
