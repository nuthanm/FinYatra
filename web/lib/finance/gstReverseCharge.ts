/**
 * GST reverse charge (RCM) — taxable value × rate → GST liability (educational).
 */

export type GstReverseChargeSupply = "intra" | "inter";

export type GstReverseChargeInput = {
  taxableValue: number;
  /** GST rate % (e.g. 5, 12, 18). */
  gstRatePercent: number;
  /** Intra-state → CGST+SGST; inter-state → IGST. */
  supply: GstReverseChargeSupply;
};

export type GstReverseChargeResult = {
  taxableValue: number;
  gstRatePercent: number;
  supply: GstReverseChargeSupply;
  totalGst: number;
  cgst: number;
  sgst: number;
  igst: number;
  /** Recipient pays RCM; ITC may be claimable if eligible (educational flag). */
  itcEligibleNote: boolean;
};

export function calculateGstReverseCharge(input: GstReverseChargeInput): GstReverseChargeResult {
  const taxableValue = Math.max(0, input.taxableValue);
  const gstRatePercent = Math.min(40, Math.max(0, input.gstRatePercent));
  const supply = input.supply;
  const totalGst = (taxableValue * gstRatePercent) / 100;

  if (supply === "inter") {
    return {
      taxableValue,
      gstRatePercent,
      supply,
      totalGst,
      cgst: 0,
      sgst: 0,
      igst: totalGst,
      itcEligibleNote: true,
    };
  }

  const half = totalGst / 2;
  return {
    taxableValue,
    gstRatePercent,
    supply,
    totalGst,
    cgst: half,
    sgst: half,
    igst: 0,
    itcEligibleNote: true,
  };
}
