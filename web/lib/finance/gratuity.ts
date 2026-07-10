/** Gratuity under the Payment of Gratuity Act, 1972 (educational estimate). */

export type GratuityCovered = "act" | "other";

export type GratuityInput = {
  lastDrawnSalary: number; // basic + DA monthly
  yearsOfService: number;
  covered: GratuityCovered;
  /** Government employee — gratuity often fully exempt. */
  isGovernment: boolean;
};

export type GratuityResult = {
  gratuity: number;
  taxable: number;
  exempt: number;
  formulaDivisor: number;
  exemptionLimit: number;
};

/** Income-tax exemption ceiling for non-government employees (₹20 lakh). */
export const GRATUITY_EXEMPTION_LIMIT = 2_000_000;

export function calculateGratuity(input: GratuityInput): GratuityResult {
  const salary = Math.max(0, input.lastDrawnSalary);
  const years = Math.max(0, Math.floor(input.yearsOfService));
  // Partial year ≥ 6 months counts as full year under the Act (simplified: round)
  const roundedYears =
    input.yearsOfService - years >= 0.5 ? years + 1 : years;

  const divisor = input.covered === "act" ? 26 : 30;
  const gratuity = salary <= 0 || roundedYears <= 0 ? 0 : (salary * 15 * roundedYears) / divisor;

  const exemptionLimit = input.isGovernment ? Infinity : GRATUITY_EXEMPTION_LIMIT;
  const exempt = input.isGovernment ? gratuity : Math.min(gratuity, GRATUITY_EXEMPTION_LIMIT);
  const taxable = Math.max(0, gratuity - exempt);

  return {
    gratuity,
    taxable,
    exempt: Number.isFinite(exempt) ? exempt : gratuity,
    formulaDivisor: divisor,
    exemptionLimit: Number.isFinite(exemptionLimit) ? exemptionLimit : gratuity,
  };
}
