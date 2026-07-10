/** Central government salary slip estimate: basic + DA + HRA + allowances − deductions. */

export type CentralGovtSalarySlipInput = {
  basicPay: number;
  daPercent: number;
  hraPercent: number;
  /** Other allowances (TA, special, etc.) monthly ₹. */
  otherAllowances: number;
  /** Total monthly deductions (NPS, CGEGIS, income tax, etc.). */
  deductions: number;
};

export type CentralGovtSalarySlipResult = {
  basicPay: number;
  daPercent: number;
  hraPercent: number;
  daAmount: number;
  hraAmount: number;
  otherAllowances: number;
  grossPay: number;
  deductions: number;
  netPay: number;
};

/**
 * DA = basic × DA%; HRA = basic × HRA%; gross = basic + DA + HRA + other; net = gross − deductions.
 */
export function calculateCentralGovtSalarySlip(
  input: CentralGovtSalarySlipInput,
): CentralGovtSalarySlipResult {
  const basicPay = Math.max(0, input.basicPay);
  const daPercent = Math.max(0, input.daPercent);
  const hraPercent = Math.max(0, input.hraPercent);
  const otherAllowances = Math.max(0, input.otherAllowances);
  const deductions = Math.max(0, input.deductions);

  const daAmount = (basicPay * daPercent) / 100;
  const hraAmount = (basicPay * hraPercent) / 100;
  const grossPay = basicPay + daAmount + hraAmount + otherAllowances;
  const netPay = Math.max(0, grossPay - deductions);

  return {
    basicPay,
    daPercent,
    hraPercent,
    daAmount,
    hraAmount,
    otherAllowances,
    grossPay,
    deductions,
    netPay,
  };
}
