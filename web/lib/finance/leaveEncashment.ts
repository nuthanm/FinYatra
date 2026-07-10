/** Leave encashment amount and simplified Sec 10(10AA) tax estimate. */

export type LeaveEncashmentRateMode = "monthly" | "daily";

export type LeaveEncashmentInput = {
  rateMode: LeaveEncashmentRateMode;
  /** Monthly basic pay (when rateMode = monthly). */
  monthlyBasic: number;
  /** Monthly DA (when rateMode = monthly). */
  monthlyDa: number;
  /** Days used to derive daily rate from monthly basic+DA (commonly 30). */
  workingDays: number;
  /** Basic+DA per day (when rateMode = daily). */
  dailyRate: number;
  leaveDays: number;
  isGovernment: boolean;
  /** Remaining lifetime exemption for non-govt (user-editable; default ₹10L). */
  exemptionRemaining: number;
};

export type LeaveEncashmentResult = {
  dailyRate: number;
  amount: number;
  exempt: number;
  taxable: number;
  exemptionCap: number;
};

/** Default remaining lifetime exemption for non-government employees (simplified). */
export const LEAVE_ENCASHMENT_DEFAULT_REMAINING = 1_000_000;

export function calculateLeaveEncashment(input: LeaveEncashmentInput): LeaveEncashmentResult {
  const leaveDays = Math.max(0, input.leaveDays);
  let dailyRate: number;

  if (input.rateMode === "daily") {
    dailyRate = Math.max(0, input.dailyRate);
  } else {
    const basicDa = Math.max(0, input.monthlyBasic) + Math.max(0, input.monthlyDa);
    const days = Math.max(1, input.workingDays);
    dailyRate = basicDa / days;
  }

  const amount = dailyRate * leaveDays;

  if (input.isGovernment) {
    return {
      dailyRate,
      amount,
      exempt: amount,
      taxable: 0,
      exemptionCap: amount,
    };
  }

  const exemptionCap = Math.max(0, input.exemptionRemaining);
  const exempt = Math.min(amount, exemptionCap);
  const taxable = Math.max(0, amount - exempt);

  return { dailyRate, amount, exempt, taxable, exemptionCap };
}
