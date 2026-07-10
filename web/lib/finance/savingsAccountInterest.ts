/** Savings account interest (educational) with Section 80TTA note. */

export type SavingsAccountInterestInput = {
  /** Average / minimum balance (₹). */
  balance: number;
  /** Annual interest rate % (typical ~2.7–3%). */
  annualRatePercent: number;
  /** Number of days interest is earned. */
  days: number;
};

export type SavingsAccountInterestResult = {
  balance: number;
  annualRatePercent: number;
  days: number;
  interest: number;
  /** Section 80TTA exemption limit for non-senior (₹10,000). */
  section80ttaLimit: number;
  /** Interest above 80TTA that may be taxable (illustrative). */
  taxableAbove80tta: number;
};

export const SECTION_80TTA_LIMIT = 10_000;

/**
 * Interest = balance × rate% × days / 365.
 * Banks may use daily product / min-balance methods — this is simplified.
 */
export function calculateSavingsAccountInterest(
  input: SavingsAccountInterestInput,
): SavingsAccountInterestResult {
  const balance = Math.max(0, input.balance);
  const rate = Math.max(0, input.annualRatePercent);
  const days = Math.max(0, Math.min(366, input.days));
  const interest = balance * (rate / 100) * (days / 365);
  const taxableAbove80tta = Math.max(0, interest - SECTION_80TTA_LIMIT);

  return {
    balance,
    annualRatePercent: rate,
    days,
    interest,
    section80ttaLimit: SECTION_80TTA_LIMIT,
    taxableAbove80tta,
  };
}
