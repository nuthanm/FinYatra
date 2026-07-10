/** Dividend tax at slab (post-DDT abolition) — educational + surcharge note. */

export type DividendTaxInput = {
  /** Gross dividend income (₹). */
  dividendIncome: number;
  /** Marginal income-tax slab % (excluding cess). */
  taxSlabPercent: number;
  /** Total taxable income including dividend (for surcharge band note). */
  totalIncome?: number;
};

export type DividendTaxResult = {
  dividendIncome: number;
  taxSlabPercent: number;
  taxBeforeCess: number;
  cess: number;
  totalTax: number;
  /** Illustrative TDS @ 10% if dividend > ₹10,000 (Sec 194). */
  illustrativeTds: number;
  /** Surcharge band label for total income. */
  surchargeNote: "none" | "10" | "15" | "25" | "37";
  effectiveRate: number;
};

const CESS = 0.04;
const TDS_THRESHOLD = 10_000;
const TDS_RATE = 0.1;

function surchargeBand(totalIncome: number): DividendTaxResult["surchargeNote"] {
  if (totalIncome > 5_00_00_000) return "37";
  if (totalIncome > 2_00_00_000) return "25";
  if (totalIncome > 1_00_00_000) return "15";
  if (totalIncome > 50_00_000) return "10";
  return "none";
}

/**
 * Tax ≈ dividend × slab% + 4% cess. No DDT.
 * TDS note when dividend > ₹10k. Surcharge band from total income (simplified).
 */
export function calculateDividendTax(input: DividendTaxInput): DividendTaxResult {
  const dividendIncome = Math.max(0, input.dividendIncome);
  const taxSlabPercent = Math.min(42, Math.max(0, input.taxSlabPercent));
  const totalIncome = Math.max(dividendIncome, input.totalIncome ?? dividendIncome);

  const taxBeforeCess = (dividendIncome * taxSlabPercent) / 100;
  const cess = taxBeforeCess * CESS;
  const totalTax = taxBeforeCess + cess;
  const illustrativeTds =
    dividendIncome > TDS_THRESHOLD ? dividendIncome * TDS_RATE : 0;
  const surchargeNote = surchargeBand(totalIncome);
  const effectiveRate = dividendIncome > 0 ? (totalTax / dividendIncome) * 100 : 0;

  return {
    dividendIncome,
    taxSlabPercent,
    taxBeforeCess,
    cess,
    totalTax,
    illustrativeTds,
    surchargeNote,
    effectiveRate,
  };
}
