/** Monthly budget: income vs expense categories + 50/30/20 suggestion. */

export type MonthlyBudgetInput = {
  monthlyIncome: number;
  /** Needs — rent, groceries, EMIs, utilities, etc. */
  needs: number;
  /** Wants — dining, entertainment, shopping. */
  wants: number;
  /** Planned savings / investments this month. */
  savings: number;
};

export type MonthlyBudgetResult = {
  monthlyIncome: number;
  needs: number;
  wants: number;
  savings: number;
  totalExpenses: number;
  /** Income − (needs + wants + savings). Positive = surplus. */
  surplus: number;
  suggestedNeeds: number;
  suggestedWants: number;
  suggestedSavings: number;
  needsPct: number;
  wantsPct: number;
  savingsPct: number;
};

export function calculateMonthlyBudget(input: MonthlyBudgetInput): MonthlyBudgetResult {
  const monthlyIncome = Math.max(0, input.monthlyIncome);
  const needs = Math.max(0, input.needs);
  const wants = Math.max(0, input.wants);
  const savings = Math.max(0, input.savings);
  const totalExpenses = needs + wants + savings;
  const surplus = monthlyIncome - totalExpenses;
  const suggestedNeeds = monthlyIncome * 0.5;
  const suggestedWants = monthlyIncome * 0.3;
  const suggestedSavings = monthlyIncome * 0.2;
  const denom = monthlyIncome > 0 ? monthlyIncome : 1;
  return {
    monthlyIncome,
    needs,
    wants,
    savings,
    totalExpenses,
    surplus,
    suggestedNeeds,
    suggestedWants,
    suggestedSavings,
    needsPct: (needs / denom) * 100,
    wantsPct: (wants / denom) * 100,
    savingsPct: (savings / denom) * 100,
  };
}
