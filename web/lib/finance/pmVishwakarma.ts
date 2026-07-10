import { emi } from "@/lib/finance/compound";

/** PM Vishwakarma — toolkit grant + optional credit EMI (educational). */

export const PM_VISHWAKARMA_TOOLKIT_GRANT = 15_000;
export const PM_VISHWAKARMA_DEFAULT_RATE = 5;
export const PM_VISHWAKARMA_MAX_CREDIT = 3_00_000;
export const PM_VISHWAKARMA_STIPEND_PER_DAY = 500;

export type PmVishwakarmaInput = {
  /** Optional credit / toolkit loan amount (₹). */
  loanAmount: number;
  annualRatePercent: number;
  tenureMonths: number;
  /** Training days for stipend estimate. */
  trainingDays: number;
};

export type PmVishwakarmaResult = {
  toolkitGrant: number;
  trainingStipend: number;
  totalBenefitCash: number;
  loanAmount: number;
  cappedLoan: number;
  capped: boolean;
  monthlyEmi: number;
  totalInterest: number;
  totalPayment: number;
};

export function calculatePmVishwakarma(input: PmVishwakarmaInput): PmVishwakarmaResult {
  const requested = Math.max(0, input.loanAmount);
  const cappedLoan = Math.min(requested, PM_VISHWAKARMA_MAX_CREDIT);
  const capped = requested > PM_VISHWAKARMA_MAX_CREDIT;
  const months = Math.max(0, Math.round(input.tenureMonths));
  const rate = Math.max(0, input.annualRatePercent);
  const days = Math.max(0, Math.round(input.trainingDays));
  const trainingStipend = days * PM_VISHWAKARMA_STIPEND_PER_DAY;
  const toolkitGrant = PM_VISHWAKARMA_TOOLKIT_GRANT;
  const totalBenefitCash = toolkitGrant + trainingStipend;

  if (cappedLoan <= 0 || months <= 0) {
    return {
      toolkitGrant,
      trainingStipend,
      totalBenefitCash,
      loanAmount: requested,
      cappedLoan: 0,
      capped,
      monthlyEmi: 0,
      totalInterest: 0,
      totalPayment: 0,
    };
  }

  const monthlyEmi = emi(cappedLoan, rate, months);
  const totalPayment = monthlyEmi * months;
  const totalInterest = Math.max(0, totalPayment - cappedLoan);

  return {
    toolkitGrant,
    trainingStipend,
    totalBenefitCash,
    loanAmount: requested,
    cappedLoan,
    capped,
    monthlyEmi,
    totalInterest,
    totalPayment,
  };
}
