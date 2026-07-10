/** GST outward tax minus ITC → net payable (educational). */

export type GstItcInput = {
  /** Output / outward GST liability (₹). */
  outwardTax: number;
  /** Eligible ITC available to set off (₹). */
  itcAvailable: number;
};

export type GstItcResult = {
  outwardTax: number;
  itcAvailable: number;
  /** max(0, outward − ITC). */
  netPayable: number;
  /** max(0, ITC − outward) leftover credit. */
  excessItc: number;
  status: "payable" | "credit" | "nil";
};

/**
 * Net GST cash payable = outward tax − ITC (floored at 0).
 * Excess ITC shown separately — educational only.
 */
export function calculateGstItc(input: GstItcInput): GstItcResult {
  const outwardTax = Math.max(0, input.outwardTax);
  const itcAvailable = Math.max(0, input.itcAvailable);
  const raw = outwardTax - itcAvailable;
  const netPayable = Math.max(0, raw);
  const excessItc = Math.max(0, -raw);
  const status: GstItcResult["status"] =
    Math.abs(raw) < 1 ? "nil" : raw > 0 ? "payable" : "credit";

  return { outwardTax, itcAvailable, netPayable, excessItc, status };
}
