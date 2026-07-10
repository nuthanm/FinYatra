/** Section 80GG rent deduction for tenants without HRA (old regime, educational). */

export type Section80ggInput = {
  /** Annual rent paid. */
  rentPaidAnnual: number;
  /** Adjusted total income (ATI) — roughly total income after Chapter VI-A except 80GG. */
  adjustedTotalIncome: number;
  /** Must be true: no HRA received. */
  noHra: boolean;
};

export type Section80ggResult = {
  rentPaidAnnual: number;
  adjustedTotalIncome: number;
  eligible: boolean;
  /** Limit 1: ₹5,000 × 12. */
  limitMonthlyCap: number;
  /** Limit 2: 25% of ATI. */
  limit25PercentAti: number;
  /** Limit 3: rent − 10% of ATI. */
  limitRentMinus10Ati: number;
  /** Least of the three (0 if ineligible). */
  deduction: number;
  bindingLimit: "monthly" | "ati25" | "rentMinus10" | "none";
};

const MONTHLY_CAP = 5_000;
const ANNUAL_CAP = MONTHLY_CAP * 12;

export function calculateSection80gg(input: Section80ggInput): Section80ggResult {
  const rent = Math.max(0, input.rentPaidAnnual);
  const ati = Math.max(0, input.adjustedTotalIncome);
  const eligible = input.noHra && rent > 0 && ati > 0;

  const limitMonthlyCap = ANNUAL_CAP;
  const limit25PercentAti = ati * 0.25;
  const limitRentMinus10Ati = Math.max(0, rent - ati * 0.1);

  if (!eligible) {
    return {
      rentPaidAnnual: rent,
      adjustedTotalIncome: ati,
      eligible: false,
      limitMonthlyCap,
      limit25PercentAti,
      limitRentMinus10Ati,
      deduction: 0,
      bindingLimit: "none",
    };
  }

  const deduction = Math.min(limitMonthlyCap, limit25PercentAti, limitRentMinus10Ati);
  let bindingLimit: Section80ggResult["bindingLimit"] = "monthly";
  if (deduction === limitRentMinus10Ati) bindingLimit = "rentMinus10";
  else if (deduction === limit25PercentAti) bindingLimit = "ati25";
  else bindingLimit = "monthly";

  return {
    rentPaidAnnual: rent,
    adjustedTotalIncome: ati,
    eligible: true,
    limitMonthlyCap,
    limit25PercentAti,
    limitRentMinus10Ati,
    deduction,
    bindingLimit,
  };
}
