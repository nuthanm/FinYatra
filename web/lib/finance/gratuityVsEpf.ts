/** Side-by-side projected gratuity vs EPF corpus (educational). */

import { calculateGratuity } from "@/lib/finance/gratuity";
import { calculateEpf, EPF_DEFAULT_RATE } from "@/lib/finance/epf";

export type GratuityVsEpfInput = {
  /** Basic + DA monthly for gratuity formula (₹). */
  lastDrawnSalary: number;
  yearsOfService: number;
  /** Monthly basic / PF wages for EPF projection (₹). */
  monthlyBasic: number;
  epfRatePercent?: number;
  existingEpfBalance?: number;
  /** When true, PF on actual basic (not ₹15k ceiling). */
  pfOnActual?: boolean;
};

export type GratuityVsEpfResult = {
  yearsOfService: number;
  gratuity: number;
  epfCorpus: number;
  /** EPF − gratuity. */
  gap: number;
  winner: "epf" | "gratuity" | "tie";
  epfRatePercent: number;
  totalEpfContributed: number;
};

export function calculateGratuityVsEpf(input: GratuityVsEpfInput): GratuityVsEpfResult {
  const years = Math.max(0, input.yearsOfService);
  const epfRate = input.epfRatePercent ?? EPF_DEFAULT_RATE;

  const g = calculateGratuity({
    lastDrawnSalary: input.lastDrawnSalary,
    yearsOfService: years,
    covered: "act",
    isGovernment: false,
  });

  const epf = calculateEpf(
    input.monthlyBasic,
    Math.floor(years),
    epfRate,
    input.existingEpfBalance ?? 0,
    input.pfOnActual ?? true,
  );

  const gap = epf.maturity - g.gratuity;
  const winner: GratuityVsEpfResult["winner"] =
    Math.abs(gap) < 1 ? "tie" : gap > 0 ? "epf" : "gratuity";

  return {
    yearsOfService: years,
    gratuity: g.gratuity,
    epfCorpus: epf.maturity,
    gap,
    winner,
    epfRatePercent: epfRate,
    totalEpfContributed: epf.totalEmployee + epf.totalEmployer,
  };
}
