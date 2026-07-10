/** ESI contributions — employee 0.75% + employer 3.25% (educational). */

export const ESI_EMPLOYEE_RATE = 0.75;
export const ESI_EMPLOYER_RATE = 3.25;
/** Monthly wage ceiling for ESI coverage (illustrative ₹21,000). */
export const ESI_WAGE_CEILING = 21_000;

export type EsiInput = {
  /** Monthly wages for ESI (₹). */
  monthlyWages: number;
};

export type EsiResult = {
  monthlyWages: number;
  wageCeiling: number;
  eligible: boolean;
  /** Wages used for contribution (capped at ceiling when eligible). */
  contributoryWages: number;
  employeeContribution: number;
  employerContribution: number;
  totalContribution: number;
};

/**
 * If wages ≤ ceiling → eligible; contrib on wages.
 * If wages > ceiling → typically not covered (simplified educational rule).
 */
export function calculateEsi(input: EsiInput): EsiResult {
  const monthlyWages = Math.max(0, input.monthlyWages);
  const eligible = monthlyWages > 0 && monthlyWages <= ESI_WAGE_CEILING;
  const contributoryWages = eligible ? monthlyWages : 0;
  const employeeContribution = (contributoryWages * ESI_EMPLOYEE_RATE) / 100;
  const employerContribution = (contributoryWages * ESI_EMPLOYER_RATE) / 100;
  const totalContribution = employeeContribution + employerContribution;

  return {
    monthlyWages,
    wageCeiling: ESI_WAGE_CEILING,
    eligible,
    contributoryWages,
    employeeContribution,
    employerContribution,
    totalContribution,
  };
}
