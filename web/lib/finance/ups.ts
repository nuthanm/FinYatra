/** Unified Pension Scheme vs NPS — educational comparison (simplified). */

export type UpsInput = {
  /** Average / last monthly basic pay (₹). */
  monthlyBasic: number;
  /** Qualifying service years. */
  yearsOfService: number;
  /** Employee contribution % of basic (UPS default ~10%). */
  employeeContribPercent: number;
  /** Government contribution % of basic (UPS default ~18.5%). */
  govtContribPercent: number;
  /** Assumed NPS Tier-I return % p.a. for comparison. */
  npsReturnPercent: number;
  /** Annuity rate % p.a. to convert NPS corpus to monthly pension. */
  annuityRatePercent: number;
};

export type UpsResult = {
  monthlyBasic: number;
  yearsOfService: number;
  /** Assured pension as % of basic (50% at 25+ years, pro-rata below). */
  assuredPensionPercent: number;
  upsMonthlyPension: number;
  employeeMonthlyContrib: number;
  govtMonthlyContrib: number;
  totalMonthlyContrib: number;
  npsCorpus: number;
  npsMonthlyPension: number;
  /** upsMonthlyPension − npsMonthlyPension. */
  pensionGap: number;
};

const FULL_SERVICE_YEARS = 25;
const FULL_ASSURED_PERCENT = 50;

/**
 * UPS assured pension ≈ basic × min(50%, 50% × years/25).
 * NPS side: invest emp+govt monthly contrib at return for years → corpus × annuity%/12.
 */
export function calculateUps(input: UpsInput): UpsResult {
  const monthlyBasic = Math.max(0, input.monthlyBasic);
  const yearsOfService = Math.min(40, Math.max(0, input.yearsOfService));
  const employeeContribPercent = Math.min(20, Math.max(0, input.employeeContribPercent));
  const govtContribPercent = Math.min(30, Math.max(0, input.govtContribPercent));
  const npsReturnPercent = Math.min(20, Math.max(0, input.npsReturnPercent));
  const annuityRatePercent = Math.min(12, Math.max(0, input.annuityRatePercent));

  const assuredPensionPercent =
    yearsOfService <= 0
      ? 0
      : Math.min(
          FULL_ASSURED_PERCENT,
          (FULL_ASSURED_PERCENT * yearsOfService) / FULL_SERVICE_YEARS,
        );
  const upsMonthlyPension = (monthlyBasic * assuredPensionPercent) / 100;

  const employeeMonthlyContrib = (monthlyBasic * employeeContribPercent) / 100;
  const govtMonthlyContrib = (monthlyBasic * govtContribPercent) / 100;
  const totalMonthlyContrib = employeeMonthlyContrib + govtMonthlyContrib;

  const months = Math.floor(yearsOfService * 12);
  const r = npsReturnPercent / 100 / 12;
  const npsCorpus =
    totalMonthlyContrib <= 0 || months <= 0
      ? 0
      : r > 0
        ? totalMonthlyContrib * ((Math.pow(1 + r, months) - 1) / r)
        : totalMonthlyContrib * months;
  const npsMonthlyPension = (npsCorpus * (annuityRatePercent / 100)) / 12;
  const pensionGap = upsMonthlyPension - npsMonthlyPension;

  return {
    monthlyBasic,
    yearsOfService,
    assuredPensionPercent,
    upsMonthlyPension,
    employeeMonthlyContrib,
    govtMonthlyContrib,
    totalMonthlyContrib,
    npsCorpus,
    npsMonthlyPension,
    pensionGap,
  };
}
