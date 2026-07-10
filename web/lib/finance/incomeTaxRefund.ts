/** ITR refund / tax due from taxes paid vs liability. */

export type IncomeTaxRefundInput = {
  tds: number;
  advanceTax: number;
  selfAssessment: number;
  taxLiability: number;
};

export type IncomeTaxRefundResult = {
  tds: number;
  advanceTax: number;
  selfAssessment: number;
  taxPaid: number;
  taxLiability: number;
  refund: number;
  taxDue: number;
  isRefund: boolean;
};

export function calculateIncomeTaxRefund(input: IncomeTaxRefundInput): IncomeTaxRefundResult {
  const tds = Math.max(0, input.tds);
  const advanceTax = Math.max(0, input.advanceTax);
  const selfAssessment = Math.max(0, input.selfAssessment);
  const taxLiability = Math.max(0, input.taxLiability);
  const taxPaid = tds + advanceTax + selfAssessment;
  const refund = Math.max(0, taxPaid - taxLiability);
  const taxDue = Math.max(0, taxLiability - taxPaid);

  return {
    tds,
    advanceTax,
    selfAssessment,
    taxPaid,
    taxLiability,
    refund,
    taxDue,
    isRefund: refund > 0 || (refund === 0 && taxDue === 0),
  };
}
