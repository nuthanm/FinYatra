/**
 * International equity tax — gains taxed as debt/other (slab) educational sketch.
 * (Foreign shares / FoFs often not equity LTCG 12.5% — illustrative slab tax.)
 */

export type InternationalEquityTaxInput = {
  saleProceeds: number;
  costOfAcquisition: number;
  /** Holding period in months (educational note only). */
  holdingMonths: number;
  taxSlabPercent: number;
};

export type InternationalEquityTaxResult = {
  saleProceeds: number;
  costOfAcquisition: number;
  holdingMonths: number;
  gain: number;
  loss: number;
  taxSlabPercent: number;
  /** Educational: taxed at slab (debt/other style), not listed-equity LTCG. */
  estimatedTax: number;
  cess: number;
  totalTax: number;
};

export function calculateInternationalEquityTax(
  input: InternationalEquityTaxInput,
): InternationalEquityTaxResult {
  const saleProceeds = Math.max(0, input.saleProceeds);
  const costOfAcquisition = Math.max(0, input.costOfAcquisition);
  const holdingMonths = Math.max(0, input.holdingMonths);
  const gain = Math.max(0, saleProceeds - costOfAcquisition);
  const loss = Math.max(0, costOfAcquisition - saleProceeds);
  const taxSlabPercent = Math.min(42, Math.max(0, input.taxSlabPercent));
  const estimatedTax = (gain * taxSlabPercent) / 100;
  const cess = estimatedTax * 0.04;
  const totalTax = estimatedTax + cess;

  return {
    saleProceeds,
    costOfAcquisition,
    holdingMonths,
    gain,
    loss,
    taxSlabPercent,
    estimatedTax,
    cess,
    totalTax,
  };
}
