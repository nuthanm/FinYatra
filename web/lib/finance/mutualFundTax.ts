import { calculateCapitalGains, type CapGainResult } from "@/lib/finance/capitalGains";

/** Mutual fund capital gains tax — equity vs debt (reuses capital-gains rules). */

export type MfFundType = "equity" | "debt";

export type MutualFundTaxInput = {
  fundType: MfFundType;
  buyValue: number;
  sellValue: number;
  holdingMonths: number;
  /** Marginal slab % (used for debt STCG / equity STCG context). */
  taxSlabPercent: number;
};

export type MutualFundTaxResult = CapGainResult & {
  fundType: MfFundType;
  buyValue: number;
  sellValue: number;
  holdingMonths: number;
};

export function calculateMutualFundTax(input: MutualFundTaxInput): MutualFundTaxResult {
  const fundType = input.fundType;
  const asset = fundType === "equity" ? "equity" : "debt_mf";
  const base = calculateCapitalGains({
    asset,
    buyPrice: input.buyValue,
    sellPrice: input.sellValue,
    holdingMonths: input.holdingMonths,
    taxSlabPercent: input.taxSlabPercent,
    exemptionAmount: 0,
  });

  return {
    ...base,
    fundType,
    buyValue: Math.max(0, input.buyValue),
    sellValue: Math.max(0, input.sellValue),
    holdingMonths: Math.max(0, input.holdingMonths),
  };
}
