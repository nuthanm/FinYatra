/** GST e-invoice threshold check (educational) + sample invoice tax. */

/** Aggregate turnover threshold commonly cited for e-invoice mandate (₹). */
export const GST_EINVOICE_TURNOVER_THRESHOLD = 5_00_00_000;

export type GstEInvoiceInput = {
  /** Aggregate turnover in previous FY (₹). */
  annualTurnover: number;
  /** Sample taxable value of one B2B invoice (₹). */
  invoiceTaxableValue: number;
  /** GST rate % on sample invoice. */
  gstRatePercent: number;
};

export type GstEInvoiceResult = {
  annualTurnover: number;
  threshold: number;
  /** True when turnover ≥ threshold (illustrative mandate). */
  eInvoiceLikelyRequired: boolean;
  invoiceTaxableValue: number;
  gstRatePercent: number;
  /** Tax on sample invoice = taxable × rate%. */
  sampleGst: number;
  invoiceTotal: number;
  /** Illustrative max penalty note amount (₹10k or 100% tax — show tax as reference). */
  penaltyReference: number;
};

export function calculateGstEInvoice(input: GstEInvoiceInput): GstEInvoiceResult {
  const annualTurnover = Math.max(0, input.annualTurnover);
  const invoiceTaxableValue = Math.max(0, input.invoiceTaxableValue);
  const gstRatePercent = Math.min(28, Math.max(0, input.gstRatePercent));
  const sampleGst = (invoiceTaxableValue * gstRatePercent) / 100;
  const invoiceTotal = invoiceTaxableValue + sampleGst;
  const eInvoiceLikelyRequired = annualTurnover >= GST_EINVOICE_TURNOVER_THRESHOLD;
  const penaltyReference = Math.max(10_000, sampleGst);

  return {
    annualTurnover,
    threshold: GST_EINVOICE_TURNOVER_THRESHOLD,
    eInvoiceLikelyRequired,
    invoiceTaxableValue,
    gstRatePercent,
    sampleGst,
    invoiceTotal,
    penaltyReference,
  };
}
