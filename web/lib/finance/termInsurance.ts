/** Term life cover need estimator (educational — not a premium quote). */

export type TermCoverMethod = "income" | "expense";

export type TermInsuranceInput = {
  method: TermCoverMethod;
  /** Annual income (₹) — used for income × years method. */
  annualIncome: number;
  /** Income replacement years (e.g. 10–20). */
  incomeYears: number;
  /** Annual household expenses (₹) — used for expense method. */
  annualExpenses: number;
  /** Expense coverage years. */
  expenseYears: number;
  /** Outstanding loans / liabilities to cover. */
  liabilities?: number;
  /** Existing life cover (₹). */
  existingCover?: number;
};

export type TermInsuranceResult = {
  method: TermCoverMethod;
  incomeBasedNeed: number;
  expenseBasedNeed: number;
  liabilities: number;
  suggestedCover: number;
  existingCover: number;
  gap: number;
};

/**
 * Cover need ≈ income×years or expenses×years, plus liabilities, minus existing cover.
 */
export function calculateTermInsurance(input: TermInsuranceInput): TermInsuranceResult {
  const income = Math.max(0, input.annualIncome);
  const incomeYears = Math.max(0, input.incomeYears);
  const expenses = Math.max(0, input.annualExpenses);
  const expenseYears = Math.max(0, input.expenseYears);
  const liabilities = Math.max(0, input.liabilities ?? 0);
  const existingCover = Math.max(0, input.existingCover ?? 0);

  const incomeBasedNeed = income * incomeYears + liabilities;
  const expenseBasedNeed = expenses * expenseYears + liabilities;
  const suggestedCover =
    input.method === "expense" ? expenseBasedNeed : incomeBasedNeed;
  const gap = Math.max(0, suggestedCover - existingCover);

  return {
    method: input.method,
    incomeBasedNeed,
    expenseBasedNeed,
    liabilities,
    suggestedCover,
    existingCover,
    gap,
  };
}
