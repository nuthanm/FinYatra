import { emi } from "@/lib/finance/compound";
import { principalFromEmi } from "@/lib/finance/homeLoanEligibility";

/** NRI home loan eligibility vs income + EMI (educational; rates often higher). */

export const NRI_HOME_DEFAULT_RATE = 9.5;
export const NRI_HOME_DEFAULT_FOIR = 50;

export type NriHomeLoanInput = {
  monthlyIncomeInr: number;
  existingEmis: number;
  requestedLoan: number;
  annualRatePercent: number;
  tenureYears: number;
  foirPercent: number;
};

export type NriHomeLoanResult = {
  eligibleEmi: number;
  maxLoan: number;
  requestedLoan: number;
  /** min(requested, maxLoan). */
  sanctionedEstimate: number;
  withinEligibility: boolean;
  monthlyEmi: number;
  totalInterest: number;
  totalPayment: number;
};

export function calculateNriHomeLoan(input: NriHomeLoanInput): NriHomeLoanResult {
  const income = Math.max(0, input.monthlyIncomeInr);
  const existing = Math.max(0, input.existingEmis);
  const foir = Math.min(100, Math.max(0, input.foirPercent)) / 100;
  const rate = Math.max(0, input.annualRatePercent);
  const years = Math.max(0, input.tenureYears);
  const months = Math.round(years * 12);
  const requestedLoan = Math.max(0, input.requestedLoan);

  const eligibleEmi = Math.max(0, income * foir - existing);
  const maxLoan = eligibleEmi > 0 && months > 0 ? principalFromEmi(eligibleEmi, rate, months) : 0;
  const sanctionedEstimate = Math.min(requestedLoan, maxLoan);
  const withinEligibility = requestedLoan > 0 && requestedLoan <= maxLoan + 1;

  if (sanctionedEstimate <= 0 || months <= 0) {
    return {
      eligibleEmi,
      maxLoan,
      requestedLoan,
      sanctionedEstimate: 0,
      withinEligibility: false,
      monthlyEmi: 0,
      totalInterest: 0,
      totalPayment: 0,
    };
  }

  const monthlyEmi = emi(sanctionedEstimate, rate, months);
  const totalPayment = monthlyEmi * months;
  const totalInterest = Math.max(0, totalPayment - sanctionedEstimate);

  return {
    eligibleEmi,
    maxLoan,
    requestedLoan,
    sanctionedEstimate,
    withinEligibility,
    monthlyEmi,
    totalInterest,
    totalPayment,
  };
}
