/**
 * GST HSN educational — pick a category (illustrative rate) → GST on amount.
 * Not a full HSN database; category presets only.
 */

export type GstHsnCategory =
  | "exempt"
  | "five"
  | "twelve"
  | "eighteen"
  | "twentyeight";

export const GST_HSN_RATES: Record<GstHsnCategory, number> = {
  exempt: 0,
  five: 5,
  twelve: 12,
  eighteen: 18,
  twentyeight: 28,
};

export type GstHsnCodeInput = {
  category: GstHsnCategory;
  taxableAmount: number;
  /** If true, split as CGST+SGST; else IGST. */
  intraState: boolean;
};

export type GstHsnCodeResult = {
  category: GstHsnCategory;
  ratePercent: number;
  taxableAmount: number;
  gstAmount: number;
  cgst: number;
  sgst: number;
  igst: number;
  invoiceTotal: number;
  intraState: boolean;
};

export function calculateGstHsnCode(input: GstHsnCodeInput): GstHsnCodeResult {
  const category = input.category;
  const ratePercent = GST_HSN_RATES[category];
  const taxableAmount = Math.max(0, input.taxableAmount);
  const gstAmount = (taxableAmount * ratePercent) / 100;
  const intraState = Boolean(input.intraState);
  const half = gstAmount / 2;

  return {
    category,
    ratePercent,
    taxableAmount,
    gstAmount,
    cgst: intraState ? half : 0,
    sgst: intraState ? half : 0,
    igst: intraState ? 0 : gstAmount,
    invoiceTotal: taxableAmount + gstAmount,
    intraState,
  };
}
