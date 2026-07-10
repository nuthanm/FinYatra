/** GST add / remove with CGST+SGST or IGST split. */

export type GstRate = 0 | 5 | 12 | 18 | 28;
export type GstMode = "exclusive" | "inclusive";
export type GstSupply = "intra" | "inter";

export type GstResult = {
  baseAmount: number;
  gstAmount: number;
  totalAmount: number;
  cgst: number;
  sgst: number;
  igst: number;
  rate: number;
};

export function calculateGst(
  amount: number,
  rate: GstRate,
  mode: GstMode,
  supply: GstSupply,
): GstResult {
  const a = Math.max(0, amount);
  const r = rate / 100;

  let baseAmount: number;
  let gstAmount: number;
  let totalAmount: number;

  if (mode === "exclusive") {
    baseAmount = a;
    gstAmount = a * r;
    totalAmount = a + gstAmount;
  } else {
    totalAmount = a;
    baseAmount = r > 0 ? a / (1 + r) : a;
    gstAmount = totalAmount - baseAmount;
  }

  const half = gstAmount / 2;
  const isIntra = supply === "intra";

  return {
    baseAmount,
    gstAmount,
    totalAmount,
    cgst: isIntra ? half : 0,
    sgst: isIntra ? half : 0,
    igst: isIntra ? 0 : gstAmount,
    rate,
  };
}
