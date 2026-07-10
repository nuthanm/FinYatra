import { calculateSalary, type SalaryBreakdown, type SalaryInput } from "@/lib/finance/salary";

/** Simplified CTC → in-hand wrapper around the salary calculator. */

export type InHandSalaryInput = {
  ctcAnnual: number;
  basicPercent?: number;
  hraPercentOfBasic?: number;
  monthlyRent?: number;
  isMetro?: boolean;
  useNewRegime?: boolean;
  pfOnActual?: boolean;
};

export type InHandSalaryResult = SalaryBreakdown & {
  takeHomeRatioPercent: number;
};

export function calculateInHandSalary(input: InHandSalaryInput): InHandSalaryResult {
  const salaryInput: SalaryInput = {
    ctcAnnual: Math.max(0, input.ctcAnnual),
    basicPercent: input.basicPercent ?? 40,
    hraPercentOfBasic: input.hraPercentOfBasic ?? 50,
    pfOnActual: input.pfOnActual ?? true,
    includeEmployerCosts: true,
    isMetro: input.isMetro ?? true,
    monthlyRent: input.monthlyRent ?? 0,
    useNewRegime: input.useNewRegime ?? true,
  };

  const result = calculateSalary(salaryInput);
  const takeHomeRatioPercent =
    result.ctcAnnual > 0 ? (result.inHandAnnual / result.ctcAnnual) * 100 : 0;

  return {
    ...result,
    takeHomeRatioPercent,
  };
}
