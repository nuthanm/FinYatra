import { futureValue } from "@/lib/finance/compound";

/**
 * Same investment: debt MF vs FD post-tax (educational).
 * Debt MF gains taxed at slab (post-2023 style); FD interest taxed at slab each year (simplified).
 */

export type DebtMfVsFdInput = {
  investment: number;
  years: number;
  /** Pre-tax debt MF expected return % p.a. */
  debtMfRatePercent: number;
  /** Pre-tax FD rate % p.a. */
  fdRatePercent: number;
  /** Marginal tax slab %. */
  taxSlabPercent: number;
};

export type DebtMfVsFdResult = {
  investment: number;
  years: number;
  debtMfGross: number;
  debtMfGain: number;
  debtMfTax: number;
  debtMfNet: number;
  fdGross: number;
  fdInterest: number;
  fdTax: number;
  fdNet: number;
  /** debtMfNet − fdNet */
  advantage: number;
  winner: "debt_mf" | "fd" | "tie";
  taxSlabPercent: number;
};

export function calculateDebtMfVsFd(input: DebtMfVsFdInput): DebtMfVsFdResult {
  const investment = Math.max(0, input.investment);
  const years = Math.max(0, input.years);
  const debtRate = Math.max(0, input.debtMfRatePercent);
  const fdRate = Math.max(0, input.fdRatePercent);
  const slab = Math.min(42, Math.max(0, input.taxSlabPercent));

  const debtMfGross = futureValue(investment, debtRate, years);
  const debtMfGain = Math.max(0, debtMfGross - investment);
  const debtMfTax = (debtMfGain * slab) / 100;
  const debtMfNet = debtMfGross - debtMfTax;

  // Simplified: tax FD interest annually on simple interest approximation of FV growth.
  const fdGross = futureValue(investment, fdRate, years);
  const fdInterest = Math.max(0, fdGross - investment);
  const fdTax = (fdInterest * slab) / 100;
  const fdNet = fdGross - fdTax;

  const advantage = debtMfNet - fdNet;
  let winner: DebtMfVsFdResult["winner"] = "tie";
  if (advantage > 1) winner = "debt_mf";
  else if (advantage < -1) winner = "fd";

  return {
    investment,
    years,
    debtMfGross,
    debtMfGain,
    debtMfTax,
    debtMfNet,
    fdGross,
    fdInterest,
    fdTax,
    fdNet,
    advantage,
    winner,
    taxSlabPercent: slab,
  };
}
