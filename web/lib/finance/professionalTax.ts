/** State-wise professional tax (illustrative monthly slabs; Feb MH bump simplified into annual). */

export type PtStateId = "mh" | "ka" | "wb" | "tn" | "gj" | "tg" | "kl" | "none";

export type PtSlab = {
  upTo: number; // monthly salary exclusive upper bound; Infinity for last
  monthlyTax: number;
};

export type PtStateConfig = {
  id: PtStateId;
  slabs: PtSlab[];
  /** Soft annual cap used in some states (e.g. MH ~₹2,500). 0 = no cap modelled. */
  annualCap: number;
};

export const PT_STATES: PtStateConfig[] = [
  {
    id: "mh",
    annualCap: 2_500,
    slabs: [
      { upTo: 7_500, monthlyTax: 0 },
      { upTo: 10_000, monthlyTax: 175 },
      { upTo: Infinity, monthlyTax: 200 },
    ],
  },
  {
    id: "ka",
    annualCap: 2_400,
    slabs: [
      { upTo: 15_000, monthlyTax: 0 },
      { upTo: 25_000, monthlyTax: 150 },
      { upTo: Infinity, monthlyTax: 200 },
    ],
  },
  {
    id: "wb",
    annualCap: 2_500,
    slabs: [
      { upTo: 10_000, monthlyTax: 0 },
      { upTo: 15_000, monthlyTax: 110 },
      { upTo: 25_000, monthlyTax: 130 },
      { upTo: 40_000, monthlyTax: 150 },
      { upTo: Infinity, monthlyTax: 200 },
    ],
  },
  {
    id: "tn",
    annualCap: 2_500,
    slabs: [
      { upTo: 21_000, monthlyTax: 0 },
      { upTo: 30_000, monthlyTax: 135 },
      { upTo: 45_000, monthlyTax: 315 },
      { upTo: 60_000, monthlyTax: 690 },
      { upTo: 75_000, monthlyTax: 1_025 },
      { upTo: Infinity, monthlyTax: 1_250 },
    ],
  },
  {
    id: "gj",
    annualCap: 2_400,
    slabs: [
      { upTo: 12_000, monthlyTax: 0 },
      { upTo: Infinity, monthlyTax: 200 },
    ],
  },
  {
    id: "tg",
    annualCap: 2_400,
    slabs: [
      { upTo: 15_000, monthlyTax: 0 },
      { upTo: 20_000, monthlyTax: 150 },
      { upTo: Infinity, monthlyTax: 200 },
    ],
  },
  {
    id: "kl",
    annualCap: 2_500,
    slabs: [
      { upTo: 12_000, monthlyTax: 0 },
      { upTo: 17_500, monthlyTax: 120 },
      { upTo: 25_000, monthlyTax: 180 },
      { upTo: Infinity, monthlyTax: 250 },
    ],
  },
  { id: "none", annualCap: 0, slabs: [{ upTo: Infinity, monthlyTax: 0 }] },
];

export function getPtState(id: PtStateId): PtStateConfig {
  return PT_STATES.find((s) => s.id === id) ?? PT_STATES[PT_STATES.length - 1]!;
}

export type ProfessionalTaxResult = {
  monthlyTax: number;
  annualTax: number;
  capped: boolean;
  slabLabelUpTo: number;
};

export function calculateProfessionalTax(monthlySalary: number, stateId: PtStateId): ProfessionalTaxResult {
  const salary = Math.max(0, monthlySalary);
  const state = getPtState(stateId);
  let monthlyTax = 0;
  let slabLabelUpTo = Infinity;
  for (const slab of state.slabs) {
    if (slab.upTo === Infinity || salary <= slab.upTo) {
      monthlyTax = slab.monthlyTax;
      slabLabelUpTo = slab.upTo;
      break;
    }
  }
  let annualTax = monthlyTax * 12;
  let capped = false;
  if (state.annualCap > 0 && annualTax > state.annualCap) {
    annualTax = state.annualCap;
    monthlyTax = annualTax / 12;
    capped = true;
  }
  return { monthlyTax, annualTax, capped, slabLabelUpTo };
}
