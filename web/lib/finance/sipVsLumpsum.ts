/**
 * Same total invested via monthly SIP vs one-time lumpsum — compare future values.
 */

import { futureValue, sipFutureValue } from "@/lib/finance/compound";

export type SipVsLumpsumInput = {
  /** Monthly SIP amount (₹). */
  monthlySip: number;
  years: number;
  annualReturnPercent: number;
};

export type SipVsLumpsumResult = {
  monthlySip: number;
  years: number;
  months: number;
  totalInvested: number;
  sipFv: number;
  lumpsumFv: number;
  /** Lumpsum FV − SIP FV (usually positive if money is invested earlier). */
  difference: number;
  annualReturnPercent: number;
};

export function calculateSipVsLumpsum(input: SipVsLumpsumInput): SipVsLumpsumResult {
  const monthlySip = Math.max(0, input.monthlySip);
  const years = Math.max(0, input.years);
  const annualReturnPercent = Math.max(0, input.annualReturnPercent);
  const months = Math.round(years * 12);
  const totalInvested = monthlySip * months;
  const sipFv = sipFutureValue(monthlySip, annualReturnPercent, months);
  const lumpsumFv = futureValue(totalInvested, annualReturnPercent, years);

  return {
    monthlySip,
    years,
    months,
    totalInvested,
    sipFv,
    lumpsumFv,
    difference: lumpsumFv - sipFv,
    annualReturnPercent,
  };
}
