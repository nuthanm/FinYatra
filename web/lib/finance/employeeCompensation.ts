/** CTC components → employer cost vs employee in-hand (rough educational). */

const PF_WAGE_CEILING = 15_000;
const EMPLOYEE_PF_RATE = 0.12;
const EMPLOYER_PF_RATE = 0.12;
const GRATUITY_RATE = 0.0481;
/** Rough ESI employer share when applicable (illustrative). */
const ESI_EMPLOYER_RATE = 0.0325;
const ESI_EMPLOYEE_RATE = 0.0075;
const ESI_WAGE_CEILING_MONTHLY = 21_000;
/** EDLI-style employer cost on PF wages (illustrative ~0.5%). */
const EDLI_RATE = 0.005;

export type EmployeeCompensationInput = {
  /** Annual CTC as quoted to employee. */
  ctcAnnual: number;
  /** Basic as % of CTC. */
  basicPercent?: number;
  /** Whether PF is on actual basic or ₹15k ceiling. */
  pfOnActual?: boolean;
  /** Include ESI when monthly gross ≤ ceiling. */
  includeEsi?: boolean;
  /** Rough annual tax + PT deduction for in-hand (₹). */
  annualDeductions?: number;
};

export type EmployeeCompensationResult = {
  ctcAnnual: number;
  basicAnnual: number;
  hraAnnual: number;
  specialAllowanceAnnual: number;
  employeePfAnnual: number;
  employerPfAnnual: number;
  gratuityAnnual: number;
  esiEmployerAnnual: number;
  esiEmployeeAnnual: number;
  edliAnnual: number;
  /** CTC + ESI employer + EDLI (if not already in CTC). */
  employerTotalCost: number;
  grossAnnual: number;
  inHandAnnual: number;
  inHandMonthly: number;
  employerExtraAnnual: number;
};

export function calculateEmployeeCompensation(
  input: EmployeeCompensationInput,
): EmployeeCompensationResult {
  const ctc = Math.max(0, input.ctcAnnual);
  const basicPct = Math.min(80, Math.max(20, input.basicPercent ?? 40)) / 100;
  const pfOnActual = input.pfOnActual ?? true;
  const includeEsi = input.includeEsi ?? false;
  const annualDeductions = Math.max(0, input.annualDeductions ?? 0);

  // First pass: estimate employer PF + gratuity from basic% of CTC
  let basicAnnual = ctc * basicPct;
  const pfBaseMonthly = (b: number) =>
    pfOnActual ? b / 12 : Math.min(b / 12, PF_WAGE_CEILING);

  let employerPfAnnual = pfBaseMonthly(basicAnnual) * 12 * EMPLOYER_PF_RATE;
  let gratuityAnnual = basicAnnual * GRATUITY_RATE;

  const employeeFacing = Math.max(0, ctc - employerPfAnnual - gratuityAnnual);
  basicAnnual = employeeFacing * basicPct;
  employerPfAnnual = pfBaseMonthly(basicAnnual) * 12 * EMPLOYER_PF_RATE;
  gratuityAnnual = basicAnnual * GRATUITY_RATE;

  const hraAnnual = basicAnnual * 0.4;
  const specialAllowanceAnnual = Math.max(
    0,
    employeeFacing - basicAnnual - hraAnnual,
  );
  const employeePfAnnual = pfBaseMonthly(basicAnnual) * 12 * EMPLOYEE_PF_RATE;
  const edliAnnual = pfBaseMonthly(basicAnnual) * 12 * EDLI_RATE;

  const grossAnnual = basicAnnual + hraAnnual + specialAllowanceAnnual;
  const monthlyGross = grossAnnual / 12;

  let esiEmployerAnnual = 0;
  let esiEmployeeAnnual = 0;
  if (includeEsi && monthlyGross <= ESI_WAGE_CEILING_MONTHLY) {
    esiEmployerAnnual = grossAnnual * ESI_EMPLOYER_RATE;
    esiEmployeeAnnual = grossAnnual * ESI_EMPLOYEE_RATE;
  }

  const employerExtraAnnual = esiEmployerAnnual + edliAnnual;
  const employerTotalCost = ctc + employerExtraAnnual;

  const inHandAnnual = Math.max(
    0,
    grossAnnual - employeePfAnnual - esiEmployeeAnnual - annualDeductions,
  );

  return {
    ctcAnnual: ctc,
    basicAnnual,
    hraAnnual,
    specialAllowanceAnnual,
    employeePfAnnual,
    employerPfAnnual,
    gratuityAnnual,
    esiEmployerAnnual,
    esiEmployeeAnnual,
    edliAnnual,
    employerTotalCost,
    grossAnnual,
    inHandAnnual,
    inHandMonthly: inHandAnnual / 12,
    employerExtraAnnual,
  };
}
