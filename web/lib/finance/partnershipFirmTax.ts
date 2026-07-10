/**
 * Partnership firm tax — flat 30% + surcharge sketch (educational).
 */

export const PARTNERSHIP_FLAT_RATE = 30;
export const PARTNERSHIP_CESS = 4;
/** Illustrative surcharge when taxable income > ₹1 crore. */
export const PARTNERSHIP_SURCHARGE_THRESHOLD = 1_00_00_000;
export const PARTNERSHIP_SURCHARGE_RATE = 12;

export type PartnershipFirmTaxInput = {
  firmProfit: number;
  /** Optional partner remuneration already deducted (for display). */
  partnerRemuneration?: number;
};

export type PartnershipFirmTaxResult = {
  firmProfit: number;
  partnerRemuneration: number;
  taxableProfit: number;
  baseTax: number;
  surcharge: number;
  cess: number;
  totalTax: number;
  effectiveRatePercent: number;
};

export function calculatePartnershipFirmTax(input: PartnershipFirmTaxInput): PartnershipFirmTaxResult {
  const firmProfit = Math.max(0, input.firmProfit);
  const partnerRemuneration = Math.max(0, input.partnerRemuneration ?? 0);
  /** Educational: profit after remuneration is taxed at firm level. */
  const taxableProfit = Math.max(0, firmProfit);
  const baseTax = (taxableProfit * PARTNERSHIP_FLAT_RATE) / 100;
  const surcharge =
    taxableProfit > PARTNERSHIP_SURCHARGE_THRESHOLD
      ? (baseTax * PARTNERSHIP_SURCHARGE_RATE) / 100
      : 0;
  const cess = ((baseTax + surcharge) * PARTNERSHIP_CESS) / 100;
  const totalTax = baseTax + surcharge + cess;
  const effectiveRatePercent = taxableProfit > 0 ? (totalTax / taxableProfit) * 100 : 0;

  return {
    firmProfit,
    partnerRemuneration,
    taxableProfit,
    baseTax,
    surcharge,
    cess,
    totalTax,
    effectiveRatePercent,
  };
}
