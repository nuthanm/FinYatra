import { fdMaturity, type FdCompounding } from "@/lib/finance/fd";

/** NRE / NRO fixed deposit maturity with NRO tax note (educational). */

export type NriFdAccountType = "nre" | "nro";

export type NriFdInput = {
  deposit: number;
  annualRatePercent: number;
  years: number;
  accountType: NriFdAccountType;
  compoundsPerYear?: FdCompounding;
  /** TDS on NRO interest % (default 30). NRE interest is tax-free in India. */
  nroTdsPercent?: number;
};

export type NriFdResult = {
  deposit: number;
  annualRatePercent: number;
  years: number;
  accountType: NriFdAccountType;
  maturityGross: number;
  interestGross: number;
  tds: number;
  netInterest: number;
  netMaturity: number;
  /** True when NRE — interest tax-free in India (educational). */
  taxFreeInIndia: boolean;
};

export function calculateNriFd(input: NriFdInput): NriFdResult {
  const deposit = Math.max(0, input.deposit);
  const rate = Math.max(0, input.annualRatePercent);
  const years = Math.max(0, input.years);
  const compounds = input.compoundsPerYear ?? 4;
  const accountType = input.accountType;
  const nroTds = Math.max(0, input.nroTdsPercent ?? 30);

  const fd = fdMaturity(deposit, rate, years, compounds);
  const taxFreeInIndia = accountType === "nre";
  const tds = taxFreeInIndia ? 0 : fd.interest * (nroTds / 100);
  const netInterest = fd.interest - tds;
  const netMaturity = deposit + netInterest;

  return {
    deposit,
    annualRatePercent: rate,
    years,
    accountType,
    maturityGross: fd.maturity,
    interestGross: fd.interest,
    tds,
    netInterest,
    netMaturity,
    taxFreeInIndia,
  };
}
