/** GSTR-9 style educational check: tax paid vs liability on outward supplies (not a filing tool). */

export type GstAnnualReturnInput = {
  /** Taxable outward supplies (₹) for the year. */
  outwardSupplies: number;
  /** Effective GST rate % on outward supplies (illustrative). */
  gstRatePercent: number;
  /** Tax already paid via GSTR-3B / cash / ITC (₹). */
  taxPaid: number;
};

export type GstAnnualReturnResult = {
  outwardSupplies: number;
  gstRatePercent: number;
  taxLiability: number;
  taxPaid: number;
  /** taxPaid − taxLiability (positive = excess paid / credit; negative = shortfall). */
  difference: number;
  status: "balanced" | "excess" | "shortfall";
};

/**
 * Liability = outward × rate%. Difference = paid − liability.
 * Educational reconciliation only — not GSTR-9 filing.
 */
export function calculateGstAnnualReturn(input: GstAnnualReturnInput): GstAnnualReturnResult {
  const outwardSupplies = Math.max(0, input.outwardSupplies);
  const gstRatePercent = Math.min(40, Math.max(0, input.gstRatePercent));
  const taxPaid = Math.max(0, input.taxPaid);
  const taxLiability = (outwardSupplies * gstRatePercent) / 100;
  const difference = taxPaid - taxLiability;
  const status: GstAnnualReturnResult["status"] =
    Math.abs(difference) < 1 ? "balanced" : difference > 0 ? "excess" : "shortfall";

  return {
    outwardSupplies,
    gstRatePercent,
    taxLiability,
    taxPaid,
    difference,
    status,
  };
}
