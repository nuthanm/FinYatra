/** Agricultural income partial integration — rough educational estimate. */

export type AgriculturalIncomeInput = {
  agriculturalIncome: number;
  otherIncome: number;
  /** Basic exemption used in the agri-only leg (e.g. ₹3L new regime). */
  basicExemption?: number;
};

export type AgriculturalIncomeResult = {
  agriculturalIncome: number;
  otherIncome: number;
  basicExemption: number;
  totalIncome: number;
  taxOnOtherAlone: number;
  taxOnTotal: number;
  taxOnAgriPlusExemption: number;
  /** Extra tax from partial integration ≈ tax(total) − tax(agri+exemption). */
  taxDueToIntegration: number;
  /** Rough tax on non-agri after rate bump. */
  effectiveTaxOnOther: number;
};

/** Simplified progressive slabs (new-regime style, no cess/rebate). */
function roughTax(income: number): number {
  const x = Math.max(0, income);
  let tax = 0;
  const bands: [number, number][] = [
    [300_000, 0],
    [700_000, 0.05],
    [1_000_000, 0.1],
    [1_200_000, 0.15],
    [1_500_000, 0.2],
    [Infinity, 0.3],
  ];
  let prev = 0;
  for (const [upTo, rate] of bands) {
    const slice = Math.min(x, upTo) - prev;
    if (slice > 0) tax += slice * rate;
    if (x <= upTo) break;
    prev = upTo;
  }
  return tax;
}

export function calculateAgriculturalIncome(
  input: AgriculturalIncomeInput,
): AgriculturalIncomeResult {
  const agriculturalIncome = Math.max(0, input.agriculturalIncome);
  const otherIncome = Math.max(0, input.otherIncome);
  const basicExemption = Math.max(0, input.basicExemption ?? 300_000);
  const totalIncome = agriculturalIncome + otherIncome;

  const taxOnOtherAlone = roughTax(otherIncome);
  const taxOnTotal = roughTax(totalIncome);
  const taxOnAgriPlusExemption = roughTax(agriculturalIncome + basicExemption);
  const taxDueToIntegration = Math.max(0, taxOnTotal - taxOnAgriPlusExemption);
  const effectiveTaxOnOther = Math.max(taxOnOtherAlone, taxDueToIntegration);

  return {
    agriculturalIncome,
    otherIncome,
    basicExemption,
    totalIncome,
    taxOnOtherAlone,
    taxOnTotal,
    taxOnAgriPlusExemption,
    taxDueToIntegration,
    effectiveTaxOnOther,
  };
}
