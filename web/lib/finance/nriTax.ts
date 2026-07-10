/**
 * Simplified NRI / residential-status tax note on India-sourced income.
 * Educational only — not a substitute for DTAA / CA advice.
 */

export type NriResidentialStatus = "resident" | "rnor" | "nri";

export type NriTaxInput = {
  status: NriResidentialStatus;
  /** India-sourced taxable income (₹). */
  indiaIncome: number;
};

export type NriTaxResult = {
  status: NriResidentialStatus;
  indiaIncome: number;
  /** Rough tax before cess using simplified new-regime-style slabs. */
  taxBeforeCess: number;
  cess: number;
  totalTax: number;
  effectiveRate: number;
  /** Whether foreign income is typically outside Indian tax (illustrative). */
  foreignIncomeTaxableInIndia: boolean;
};

const CESS = 0.04;

/** Simplified new-regime style slabs for educational estimate. */
const SLABS: { upTo: number; rate: number }[] = [
  { upTo: 400_000, rate: 0 },
  { upTo: 800_000, rate: 0.05 },
  { upTo: 1_200_000, rate: 0.1 },
  { upTo: 1_600_000, rate: 0.15 },
  { upTo: 2_000_000, rate: 0.2 },
  { upTo: 2_400_000, rate: 0.25 },
  { upTo: Infinity, rate: 0.3 },
];

function slabTax(income: number): number {
  let tax = 0;
  let prev = 0;
  for (const slab of SLABS) {
    if (income <= prev) break;
    const taxableInSlab = Math.min(income, slab.upTo) - prev;
    if (taxableInSlab > 0) tax += taxableInSlab * slab.rate;
    prev = slab.upTo;
  }
  return tax;
}

/**
 * Rough tax on India income. NRI/RNOR: typically India-sourced only.
 * Resident: world income in real law — here we only tax the India income input.
 */
export function calculateNriTax(input: NriTaxInput): NriTaxResult {
  const status = input.status;
  const indiaIncome = Math.max(0, input.indiaIncome);

  let taxBeforeCess = slabTax(indiaIncome);
  // Illustrative 87A-style rebate if taxable ≤ ₹12 lakh (new regime framing)
  if (indiaIncome <= 1_200_000) {
    taxBeforeCess = 0;
  }

  const cess = taxBeforeCess * CESS;
  const totalTax = taxBeforeCess + cess;
  const effectiveRate = indiaIncome > 0 ? (totalTax / indiaIncome) * 100 : 0;

  return {
    status,
    indiaIncome,
    taxBeforeCess,
    cess,
    totalTax,
    effectiveRate,
    foreignIncomeTaxableInIndia: status === "resident",
  };
}
