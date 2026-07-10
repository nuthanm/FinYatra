/**
 * India income tax estimate for FY 2025-26 (AY 2026-27).
 * Educational approximation — not a substitute for ITR software.
 */

export type TaxAge = "below60" | "senior" | "superSenior";
export type TaxRegime = "old" | "new";

export type TaxInput = {
  grossIncome: number;
  age: TaxAge;
  /** Old regime: 80C, 80D, HRA, home loan interest, etc. New: mostly ignored except employer NPS. */
  deductions: number;
  /** Other income already included in gross; kept for clarity. */
  isSalaried: boolean;
};

export type RegimeResult = {
  regime: TaxRegime;
  taxableIncome: number;
  taxBeforeCess: number;
  rebate: number;
  cess: number;
  totalTax: number;
  effectiveRate: number;
  standardDeduction: number;
};

export type TaxComparison = {
  old: RegimeResult;
  new: RegimeResult;
  better: TaxRegime;
  savings: number;
};

const CESS = 0.04;

const NEW_SLABS: { upTo: number; rate: number }[] = [
  { upTo: 400_000, rate: 0 },
  { upTo: 800_000, rate: 0.05 },
  { upTo: 1_200_000, rate: 0.1 },
  { upTo: 1_600_000, rate: 0.15 },
  { upTo: 2_000_000, rate: 0.2 },
  { upTo: 2_400_000, rate: 0.25 },
  { upTo: Infinity, rate: 0.3 },
];

function oldExemption(age: TaxAge): number {
  if (age === "superSenior") return 500_000;
  if (age === "senior") return 300_000;
  return 250_000;
}

function slabTax(income: number, slabs: { upTo: number; rate: number }[]): number {
  let tax = 0;
  let prev = 0;
  for (const slab of slabs) {
    if (income <= prev) break;
    const taxableInSlab = Math.min(income, slab.upTo) - prev;
    if (taxableInSlab > 0) tax += taxableInSlab * slab.rate;
    prev = slab.upTo;
  }
  return tax;
}

function oldSlabs(age: TaxAge): { upTo: number; rate: number }[] {
  const base = oldExemption(age);
  return [
    { upTo: base, rate: 0 },
    { upTo: 500_000, rate: 0.05 },
    { upTo: 1_000_000, rate: 0.2 },
    { upTo: Infinity, rate: 0.3 },
  ];
}

function computeRegime(input: TaxInput, regime: TaxRegime): RegimeResult {
  const gross = Math.max(0, input.grossIncome);
  const deductions = Math.max(0, input.deductions);

  const standardDeduction = input.isSalaried ? (regime === "new" ? 75_000 : 50_000) : 0;
  const allowedDeductions = regime === "old" ? deductions : 0;

  const taxable = Math.max(0, gross - standardDeduction - allowedDeductions);

  let taxBeforeRebate = 0;
  let rebate = 0;

  if (regime === "new") {
    taxBeforeRebate = slabTax(taxable, NEW_SLABS);
    // Budget 2025: rebate u/s 87A — tax nil if taxable income ≤ ₹12 lakh
    if (taxable <= 1_200_000) {
      rebate = taxBeforeRebate;
    }
  } else {
    taxBeforeRebate = slabTax(taxable, oldSlabs(input.age));
    // Old regime rebate: taxable ≤ ₹5 lakh → rebate up to ₹12,500
    if (taxable <= 500_000) {
      rebate = Math.min(taxBeforeRebate, 12_500);
    }
  }

  const taxAfterRebate = Math.max(0, taxBeforeRebate - rebate);
  const cess = taxAfterRebate * CESS;
  const totalTax = taxAfterRebate + cess;
  const effectiveRate = gross > 0 ? (totalTax / gross) * 100 : 0;

  return {
    regime,
    taxableIncome: taxable,
    taxBeforeCess: taxAfterRebate,
    rebate,
    cess,
    totalTax,
    effectiveRate,
    standardDeduction,
  };
}

export function compareIncomeTax(input: TaxInput): TaxComparison {
  const old = computeRegime(input, "old");
  const neu = computeRegime(input, "new");
  const better: TaxRegime = neu.totalTax <= old.totalTax ? "new" : "old";
  const savings = Math.abs(old.totalTax - neu.totalTax);
  return { old, new: neu, better, savings };
}
