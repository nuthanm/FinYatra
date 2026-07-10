/**
 * Simplified PPF withdrawal / loan eligibility (educational).
 * Real rules use balances at end of specific prior FYs — confirm with your bank/PO.
 */

export type PpfMode = "withdrawal" | "loan";

export type PpfWithdrawalInput = {
  /** Current financial year of the account (1 = first FY). */
  accountYear: number;
  balance: number;
  mode: PpfMode;
};

export type PpfWithdrawalResult = {
  accountYear: number;
  balance: number;
  mode: PpfMode;
  eligible: boolean;
  maxAmount: number;
  /** Fraction of balance used for the estimate (0–1). */
  fraction: number;
  noteKey: "too_early" | "loan_window" | "withdrawal_ok" | "loan_closed" | "mature";
};

/** Partial withdrawal typically from 7th FY; simplified cap 50% of current balance. */
export const PPF_WITHDRAWAL_MIN_YEAR = 7;
export const PPF_WITHDRAWAL_FRACTION = 0.5;

/** Loan typically from 3rd to 6th FY; simplified cap 25% of current balance. */
export const PPF_LOAN_MIN_YEAR = 3;
export const PPF_LOAN_MAX_YEAR = 6;
export const PPF_LOAN_FRACTION = 0.25;

export function calculatePpfWithdrawal(input: PpfWithdrawalInput): PpfWithdrawalResult {
  const accountYear = Math.max(1, Math.round(input.accountYear));
  const balance = Math.max(0, input.balance);
  const mode = input.mode;

  if (mode === "loan") {
    if (accountYear < PPF_LOAN_MIN_YEAR) {
      return {
        accountYear,
        balance,
        mode,
        eligible: false,
        maxAmount: 0,
        fraction: 0,
        noteKey: "too_early",
      };
    }
    if (accountYear > PPF_LOAN_MAX_YEAR) {
      return {
        accountYear,
        balance,
        mode,
        eligible: false,
        maxAmount: 0,
        fraction: 0,
        noteKey: "loan_closed",
      };
    }
    return {
      accountYear,
      balance,
      mode,
      eligible: true,
      maxAmount: balance * PPF_LOAN_FRACTION,
      fraction: PPF_LOAN_FRACTION,
      noteKey: "loan_window",
    };
  }

  // withdrawal
  if (accountYear < PPF_WITHDRAWAL_MIN_YEAR) {
    return {
      accountYear,
      balance,
      mode,
      eligible: false,
      maxAmount: 0,
      fraction: 0,
      noteKey: "too_early",
    };
  }
  if (accountYear > 15) {
    return {
      accountYear,
      balance,
      mode,
      eligible: true,
      maxAmount: balance,
      fraction: 1,
      noteKey: "mature",
    };
  }
  return {
    accountYear,
    balance,
    mode,
    eligible: true,
    maxAmount: balance * PPF_WITHDRAWAL_FRACTION,
    fraction: PPF_WITHDRAWAL_FRACTION,
    noteKey: "withdrawal_ok",
  };
}
