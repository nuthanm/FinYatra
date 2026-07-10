/** Section 80CCD NPS tax benefit — educational (old/new regime). */

export type NpsTaxBenefit80ccdInput = {
  /** Basic + DA (annual) — used for 80CCD(2) employer limit. */
  basicDaAnnual: number;
  /** Employee NPS contribution (annual). */
  employeeNpsAnnual: number;
  /** Employer NPS contribution (annual). */
  employerNpsAnnual: number;
  /** Other 80C investments already used (ELSS, PPF, etc.) — old regime. */
  other80cUsed?: number;
  /** Marginal tax slab % (e.g. 30). */
  taxSlabPercent: number;
  /** Old regime enables 80CCD(1)/(1B); new regime keeps 80CCD(2) only. */
  useOldRegime: boolean;
  /** Central govt employee → 14% of salary for 80CCD(2); else 10%. */
  isCentralGovt?: boolean;
};

export type NpsTaxBenefit80ccdResult = {
  basicDaAnnual: number;
  employeeNpsAnnual: number;
  employerNpsAnnual: number;
  useOldRegime: boolean;
  /** 80CCD(1) within remaining 80C ₹1.5L (old regime). */
  deduction80ccd1: number;
  /** Extra 80CCD(1B) up to ₹50,000 (old regime). */
  deduction80ccd1b: number;
  /** Employer NPS 80CCD(2) — both regimes. */
  deduction80ccd2: number;
  employerLimitPercent: number;
  employerLimitAmount: number;
  totalDeduction: number;
  taxSlabPercent: number;
  /** Approximate tax saved = totalDeduction × slab% × 1.04 cess. */
  taxSaved: number;
  remaining80cRoom: number;
};

const LIMIT_80C = 1_50_000;
const LIMIT_80CCD_1B = 50_000;

export function calculateNpsTaxBenefit80ccd(
  input: NpsTaxBenefit80ccdInput,
): NpsTaxBenefit80ccdResult {
  const basicDa = Math.max(0, input.basicDaAnnual);
  const employee = Math.max(0, input.employeeNpsAnnual);
  const employer = Math.max(0, input.employerNpsAnnual);
  const other80c = Math.max(0, input.other80cUsed ?? 0);
  const slab = Math.max(0, Math.min(42, input.taxSlabPercent));
  const old = input.useOldRegime;
  const employerPct = input.isCentralGovt ? 14 : 10;
  const employerLimitAmount = basicDa * (employerPct / 100);

  const remaining80cRoom = Math.max(0, LIMIT_80C - other80c);

  let deduction80ccd1 = 0;
  let deduction80ccd1b = 0;
  if (old) {
    deduction80ccd1 = Math.min(employee, remaining80cRoom);
    const leftoverEmployee = Math.max(0, employee - deduction80ccd1);
    deduction80ccd1b = Math.min(leftoverEmployee, LIMIT_80CCD_1B);
  }

  const deduction80ccd2 = Math.min(employer, employerLimitAmount);
  const totalDeduction = deduction80ccd1 + deduction80ccd1b + deduction80ccd2;
  const taxSaved = totalDeduction * (slab / 100) * 1.04;

  return {
    basicDaAnnual: basicDa,
    employeeNpsAnnual: employee,
    employerNpsAnnual: employer,
    useOldRegime: old,
    deduction80ccd1,
    deduction80ccd1b,
    deduction80ccd2,
    employerLimitPercent: employerPct,
    employerLimitAmount,
    totalDeduction,
    taxSlabPercent: slab,
    taxSaved,
    remaining80cRoom,
  };
}
