/** Simplified capital gains tax (illustrative post-Budget rates). */

export type CapGainAsset = "equity" | "property" | "gold" | "debt_mf";

export type CapGainInput = {
  asset: CapGainAsset;
  buyPrice: number;
  sellPrice: number;
  holdingMonths: number;
  /** Marginal slab % for STCG where slab applies. */
  taxSlabPercent: number;
  /** Optional exemption under 54 / 54EC / 54F (reduces taxable LTCG). */
  exemptionAmount: number;
};

export type CapGainResult = {
  gain: number;
  isLongTerm: boolean;
  holdingThresholdMonths: number;
  taxableGain: number;
  taxRatePercent: number;
  taxAmount: number;
  exemptionApplied: number;
  ltcgExemptionUsed: number;
};

const EQUITY_LTCG_EXEMPTION = 125_000;

function longTermMonths(asset: CapGainAsset): number {
  if (asset === "equity") return 12;
  return 24;
}

function ltcgRate(asset: CapGainAsset): number {
  // Simplified: equity / most assets often cited at 12.5% LTCG (illustrative).
  if (asset === "debt_mf") return 0; // debt MF post-2023 often always STCG at slab
  return 12.5;
}

function stcgRate(asset: CapGainAsset, slab: number): number {
  if (asset === "equity") return 20;
  return slab;
}

export function calculateCapitalGains(input: CapGainInput): CapGainResult {
  const buy = Math.max(0, input.buyPrice);
  const sell = Math.max(0, input.sellPrice);
  const months = Math.max(0, input.holdingMonths);
  const slab = Math.min(42, Math.max(0, input.taxSlabPercent));
  const gain = sell - buy;
  const threshold = longTermMonths(input.asset);

  if (gain <= 0) {
    return {
      gain,
      isLongTerm: months >= threshold,
      holdingThresholdMonths: threshold,
      taxableGain: 0,
      taxRatePercent: 0,
      taxAmount: 0,
      exemptionApplied: 0,
      ltcgExemptionUsed: 0,
    };
  }

  // Debt MF: treat as short-term at slab regardless of holding (simplified).
  if (input.asset === "debt_mf") {
    return {
      gain,
      isLongTerm: false,
      holdingThresholdMonths: threshold,
      taxableGain: gain,
      taxRatePercent: slab,
      taxAmount: (gain * slab) / 100,
      exemptionApplied: 0,
      ltcgExemptionUsed: 0,
    };
  }

  const isLongTerm = months >= threshold;
  if (!isLongTerm) {
    const rate = stcgRate(input.asset, slab);
    return {
      gain,
      isLongTerm: false,
      holdingThresholdMonths: threshold,
      taxableGain: gain,
      taxRatePercent: rate,
      taxAmount: (gain * rate) / 100,
      exemptionApplied: 0,
      ltcgExemptionUsed: 0,
    };
  }

  let taxable = gain;
  let ltcgExemptionUsed = 0;
  if (input.asset === "equity") {
    ltcgExemptionUsed = Math.min(EQUITY_LTCG_EXEMPTION, taxable);
    taxable = Math.max(0, taxable - ltcgExemptionUsed);
  }

  const exemptionApplied = Math.min(Math.max(0, input.exemptionAmount), taxable);
  taxable = Math.max(0, taxable - exemptionApplied);
  const rate = ltcgRate(input.asset);

  return {
    gain,
    isLongTerm: true,
    holdingThresholdMonths: threshold,
    taxableGain: taxable,
    taxRatePercent: rate,
    taxAmount: (taxable * rate) / 100,
    exemptionApplied,
    ltcgExemptionUsed,
  };
}
