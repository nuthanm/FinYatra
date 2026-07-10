import { compareIncomeTax } from "@/lib/finance/incomeTax";

/** CTC → monthly in-hand estimate for Indian salaried employees. */

export type SalaryInput = {
  ctcAnnual: number;
  /** Basic as % of CTC (typical 40–50). */
  basicPercent: number;
  /** HRA as % of basic (typical 40–50). */
  hraPercentOfBasic: number;
  /** Employee PF on actual basic (true) or statutory wage ceiling ₹15,000 (false). */
  pfOnActual: boolean;
  /** Include employer PF + gratuity inside CTC (standard). */
  includeEmployerCosts: boolean;
  isMetro: boolean;
  /** Monthly rent — used only for HRA exemption estimate in old-regime tax path. */
  monthlyRent: number;
  useNewRegime: boolean;
};

export type SalaryBreakdown = {
  ctcAnnual: number;
  basicAnnual: number;
  hraAnnual: number;
  specialAllowanceAnnual: number;
  employeePfAnnual: number;
  employerPfAnnual: number;
  gratuityAnnual: number;
  grossAnnual: number;
  professionalTaxAnnual: number;
  estimatedTaxAnnual: number;
  inHandAnnual: number;
  inHandMonthly: number;
  monthlyGross: number;
  monthlyEmployeePf: number;
  monthlyPt: number;
  monthlyTax: number;
};

const PF_WAGE_CEILING = 15_000;
const EMPLOYEE_PF_RATE = 0.12;
const EMPLOYER_PF_RATE = 0.12;
const GRATUITY_RATE = 0.0481;

/** Simplified Maharashtra-style PT: ₹200/month if monthly gross > ₹10,000 (Feb ₹300 ignored for simplicity). */
function professionalTaxMonthly(monthlyGross: number): number {
  if (monthlyGross <= 7_500) return 0;
  if (monthlyGross <= 10_000) return 175;
  return 200;
}

export function calculateSalary(input: SalaryInput): SalaryBreakdown {
  const ctc = Math.max(0, input.ctcAnnual);
  const basicPct = Math.min(80, Math.max(20, input.basicPercent)) / 100;
  const hraPct = Math.min(60, Math.max(0, input.hraPercentOfBasic)) / 100;

  let employerPfAnnual = 0;
  let gratuityAnnual = 0;

  // Iterate once: basic derived from CTC after removing employer costs if included
  let basicAnnual: number;
  if (input.includeEmployerCosts) {
    // Approximate: basic = basicPct * CTC; employer costs scale with basic
    basicAnnual = ctc * basicPct;
    const pfBaseMonthly = input.pfOnActual ? basicAnnual / 12 : Math.min(basicAnnual / 12, PF_WAGE_CEILING);
    employerPfAnnual = pfBaseMonthly * 12 * EMPLOYER_PF_RATE;
    gratuityAnnual = basicAnnual * GRATUITY_RATE;
    // Recalculate basic so CTC = gross components + employer PF + gratuity
    // CTC ≈ basic + hra + special + employerPf + gratuity
    // special = CTC - employerPf - gratuity - basic - hra
    // Keep basic as % of (CTC - employer costs) for cleaner math
    const employeeFacing = Math.max(0, ctc - employerPfAnnual - gratuityAnnual);
    basicAnnual = employeeFacing * basicPct;
    const pfBase2 = input.pfOnActual ? basicAnnual / 12 : Math.min(basicAnnual / 12, PF_WAGE_CEILING);
    employerPfAnnual = pfBase2 * 12 * EMPLOYER_PF_RATE;
    gratuityAnnual = basicAnnual * GRATUITY_RATE;
  } else {
    basicAnnual = ctc * basicPct;
  }

  const hraAnnual = basicAnnual * hraPct;
  const employerCosts = input.includeEmployerCosts ? employerPfAnnual + gratuityAnnual : 0;
  const specialAllowanceAnnual = Math.max(0, ctc - basicAnnual - hraAnnual - employerCosts);

  const pfWageMonthly = input.pfOnActual ? basicAnnual / 12 : Math.min(basicAnnual / 12, PF_WAGE_CEILING);
  const employeePfAnnual = pfWageMonthly * 12 * EMPLOYEE_PF_RATE;
  if (!input.includeEmployerCosts) {
    employerPfAnnual = pfWageMonthly * 12 * EMPLOYER_PF_RATE;
    gratuityAnnual = basicAnnual * GRATUITY_RATE;
  }

  const grossAnnual = basicAnnual + hraAnnual + specialAllowanceAnnual;
  const monthlyGross = grossAnnual / 12;
  const monthlyPt = professionalTaxMonthly(monthlyGross);
  const professionalTaxAnnual = monthlyPt * 12;

  // Taxable income estimate
  let deductions = 0;
  if (!input.useNewRegime) {
    // 80C: employee PF (capped conceptually inside 1.5L with other investments — use PF only)
    deductions += Math.min(employeePfAnnual, 150_000);
    // Rough HRA exemption for old regime
    const rentAnnual = Math.max(0, input.monthlyRent) * 12;
    if (rentAnnual > 0 && hraAnnual > 0) {
      const metroPct = input.isMetro ? 0.5 : 0.4;
      const exemption = Math.min(hraAnnual, Math.max(0, rentAnnual - basicAnnual * 0.1), basicAnnual * metroPct);
      deductions += exemption;
    }
  }

  const taxCompare = compareIncomeTax({
    grossIncome: grossAnnual,
    deductions,
    age: "below60",
    isSalaried: true,
  });
  const estimatedTaxAnnual = input.useNewRegime ? taxCompare.new.totalTax : taxCompare.old.totalTax;

  const inHandAnnual = Math.max(0, grossAnnual - employeePfAnnual - professionalTaxAnnual - estimatedTaxAnnual);

  return {
    ctcAnnual: ctc,
    basicAnnual,
    hraAnnual,
    specialAllowanceAnnual,
    employeePfAnnual,
    employerPfAnnual,
    gratuityAnnual,
    grossAnnual,
    professionalTaxAnnual,
    estimatedTaxAnnual,
    inHandAnnual,
    inHandMonthly: inHandAnnual / 12,
    monthlyGross,
    monthlyEmployeePf: employeePfAnnual / 12,
    monthlyPt,
    monthlyTax: estimatedTaxAnnual / 12,
  };
}
