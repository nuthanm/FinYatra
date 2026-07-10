import { futureValue, sipRequired } from "@/lib/finance/compound";

/** Retirement corpus from inflated expenses and optional SIP gap. */

export type RetirementInput = {
  currentAge: number;
  retireAge: number;
  monthlyExpense: number;
  inflationPercent: number;
  /** Years of annual expenses to fund (default 25 ≈ 4% SWR). */
  corpusMultiplier?: number;
  /** If set, multiplier = 100 / postRetireReturnPercent (e.g. 4 → 25×). */
  postRetireReturnPercent?: number;
  /** Expected return on investments while accumulating. */
  preRetireReturnPercent?: number;
  existingSavings?: number;
};

export type RetirementResult = {
  currentAge: number;
  retireAge: number;
  yearsToRetire: number;
  monthlyExpense: number;
  futureMonthlyExpense: number;
  corpusMultiplier: number;
  targetCorpus: number;
  existingSavings: number;
  existingAtRetirement: number;
  corpusGap: number;
  monthlySipRequired: number;
  preRetireReturnPercent: number;
};

export function corpusMultiplierFromReturn(postRetireReturnPercent: number): number {
  const r = Math.max(0.1, postRetireReturnPercent);
  return 100 / r;
}

export function calculateRetirement(input: RetirementInput): RetirementResult {
  const currentAge = Math.max(0, Math.floor(input.currentAge));
  const retireAge = Math.max(currentAge, Math.floor(input.retireAge));
  const yearsToRetire = Math.max(0, retireAge - currentAge);
  const monthlyExpense = Math.max(0, input.monthlyExpense);
  const inflationPercent = Math.max(0, input.inflationPercent);
  const preRetireReturnPercent = Math.max(0, input.preRetireReturnPercent ?? 10);
  const existingSavings = Math.max(0, input.existingSavings ?? 0);

  let corpusMultiplier =
    input.corpusMultiplier != null && input.corpusMultiplier > 0
      ? input.corpusMultiplier
      : 25;
  if (input.postRetireReturnPercent != null && input.postRetireReturnPercent > 0) {
    corpusMultiplier = corpusMultiplierFromReturn(input.postRetireReturnPercent);
  }

  const futureMonthlyExpense = futureValue(monthlyExpense, inflationPercent, yearsToRetire);
  const targetCorpus = futureMonthlyExpense * 12 * corpusMultiplier;
  const existingAtRetirement = futureValue(existingSavings, preRetireReturnPercent, yearsToRetire);
  const corpusGap = Math.max(0, targetCorpus - existingAtRetirement);
  const months = yearsToRetire * 12;
  const monthlySipRequired = sipRequired(corpusGap, preRetireReturnPercent, months);

  return {
    currentAge,
    retireAge,
    yearsToRetire,
    monthlyExpense,
    futureMonthlyExpense,
    corpusMultiplier,
    targetCorpus,
    existingSavings,
    existingAtRetirement,
    corpusGap,
    monthlySipRequired,
    preRetireReturnPercent,
  };
}
