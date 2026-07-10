/** Compare HRA exemption vs home-loan tax benefit for similar housing cost (educational). */

import { calculateHraExemption } from "@/lib/finance/hra";
import { calculateHomeLoanTaxBenefit } from "@/lib/finance/homeLoanTaxBenefit";

export type HraVsHomeLoanInput = {
  /** Annual housing cost — rent paid OR EMI interest+principal proxy. */
  annualHousingCost: number;
  basicAnnual: number;
  hraReceivedAnnual: number;
  isMetro: boolean;
  /** Share of housing cost treated as interest (rest as principal) for loan path. */
  interestSharePercent?: number;
  taxSlabPercent: number;
  selfOccupied?: boolean;
};

export type HraVsHomeLoanSide = {
  deductionOrExemption: number;
  estimatedTaxSaving: number;
};

export type HraVsHomeLoanResult = {
  annualHousingCost: number;
  taxSlabPercent: number;
  hra: HraVsHomeLoanSide & {
    exemption: number;
    taxableHra: number;
  };
  homeLoan: HraVsHomeLoanSide & {
    section24b: number;
    section80c: number;
  };
  /** Home-loan tax saving − HRA tax saving. */
  advantage: number;
  winner: "hra" | "home_loan" | "tie";
};

export function calculateHraVsHomeLoan(input: HraVsHomeLoanInput): HraVsHomeLoanResult {
  const annualHousingCost = Math.max(0, input.annualHousingCost);
  const taxSlabPercent = Math.min(42, Math.max(0, input.taxSlabPercent));
  const slab = taxSlabPercent / 100;
  const interestShare = Math.min(100, Math.max(0, input.interestSharePercent ?? 70)) / 100;

  const hraResult = calculateHraExemption({
    basicAnnual: Math.max(0, input.basicAnnual),
    hraReceivedAnnual: Math.max(0, input.hraReceivedAnnual),
    rentPaidAnnual: annualHousingCost,
    isMetro: input.isMetro,
  });

  const annualInterest = annualHousingCost * interestShare;
  const annualPrincipal = annualHousingCost * (1 - interestShare);

  const loanResult = calculateHomeLoanTaxBenefit({
    annualInterest,
    annualPrincipal,
    selfOccupied: input.selfOccupied ?? true,
    taxSlabPercent,
    oldRegime: true,
  });

  const hraSaving = hraResult.exemption * slab;
  const loanSaving = loanResult.estimatedTaxSaving;
  const advantage = loanSaving - hraSaving;
  const winner: HraVsHomeLoanResult["winner"] =
    Math.abs(advantage) < 1 ? "tie" : advantage > 0 ? "home_loan" : "hra";

  return {
    annualHousingCost,
    taxSlabPercent,
    hra: {
      exemption: hraResult.exemption,
      taxableHra: hraResult.taxableHra,
      deductionOrExemption: hraResult.exemption,
      estimatedTaxSaving: hraSaving,
    },
    homeLoan: {
      section24b: loanResult.section24bDeduction,
      section80c: loanResult.section80cPrincipal,
      deductionOrExemption: loanResult.totalDeduction,
      estimatedTaxSaving: loanSaving,
    },
    advantage,
    winner,
  };
}
