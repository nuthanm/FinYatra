/**
 * Simplified SSY partial / premature withdrawal (educational).
 * Real rules use balance at end of preceding FY and purpose proofs — confirm with Post Office.
 */

export type SsyWithdrawalPurpose = "education" | "marriage" | "premature";

export type SsyWithdrawalInput = {
  balance: number;
  /** Girl's current age in years. */
  girlAge: number;
  /** Account year (1 = first year). */
  accountYear: number;
  purpose: SsyWithdrawalPurpose;
};

export type SsyWithdrawalResult = {
  balance: number;
  girlAge: number;
  accountYear: number;
  purpose: SsyWithdrawalPurpose;
  eligible: boolean;
  maxAmount: number;
  /** Fraction of balance used (0–1). */
  fraction: number;
  noteKey: "too_early_year" | "too_young" | "partial_ok" | "premature_ok" | "mature";
};

/** Partial withdrawal for education/marriage typically after girl turns 18; simplified 50%. */
export const SSY_PARTIAL_MIN_AGE = 18;
export const SSY_PARTIAL_FRACTION = 0.5;
/** Premature closure simplified: after year 1, up to 100% with note (rate cut not modelled). */
export const SSY_PREMATURE_MIN_YEAR = 2;
export const SSY_MATURITY_AGE = 21;

export function calculateSsyWithdrawal(input: SsyWithdrawalInput): SsyWithdrawalResult {
  const balance = Math.max(0, input.balance);
  const girlAge = Math.max(0, Math.round(input.girlAge));
  const accountYear = Math.max(1, Math.round(input.accountYear));
  const purpose = input.purpose;

  if (girlAge >= SSY_MATURITY_AGE) {
    return {
      balance,
      girlAge,
      accountYear,
      purpose,
      eligible: true,
      maxAmount: balance,
      fraction: 1,
      noteKey: "mature",
    };
  }

  if (purpose === "premature") {
    if (accountYear < SSY_PREMATURE_MIN_YEAR) {
      return {
        balance,
        girlAge,
        accountYear,
        purpose,
        eligible: false,
        maxAmount: 0,
        fraction: 0,
        noteKey: "too_early_year",
      };
    }
    return {
      balance,
      girlAge,
      accountYear,
      purpose,
      eligible: true,
      maxAmount: balance,
      fraction: 1,
      noteKey: "premature_ok",
    };
  }

  // education / marriage — partial after year 1 and age 18
  if (accountYear < 2) {
    return {
      balance,
      girlAge,
      accountYear,
      purpose,
      eligible: false,
      maxAmount: 0,
      fraction: 0,
      noteKey: "too_early_year",
    };
  }
  if (girlAge < SSY_PARTIAL_MIN_AGE) {
    return {
      balance,
      girlAge,
      accountYear,
      purpose,
      eligible: false,
      maxAmount: 0,
      fraction: 0,
      noteKey: "too_young",
    };
  }
  return {
    balance,
    girlAge,
    accountYear,
    purpose,
    eligible: true,
    maxAmount: balance * SSY_PARTIAL_FRACTION,
    fraction: SSY_PARTIAL_FRACTION,
    noteKey: "partial_ok",
  };
}
