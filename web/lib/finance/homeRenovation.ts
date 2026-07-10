import { emi } from "@/lib/finance/compound";

/** Home renovation: cost categories sum OR loan EMI (educational). */

export type HomeRenovationMode = "cost" | "loan";

export type HomeRenovationCostInput = {
  civil: number;
  electrical: number;
  plumbing: number;
  painting: number;
  furniture: number;
  miscellaneous: number;
  /** Contingency % of subtotal. */
  contingencyPercent: number;
};

export type HomeRenovationLoanInput = {
  loanAmount: number;
  annualRatePercent: number;
  tenureYears: number;
};

export type HomeRenovationCostResult = {
  mode: "cost";
  subtotal: number;
  contingencyAmount: number;
  contingencyPercent: number;
  total: number;
  items: { key: string; amount: number }[];
};

export type HomeRenovationLoanResult = {
  mode: "loan";
  loanAmount: number;
  annualRatePercent: number;
  tenureYears: number;
  monthlyEmi: number;
  totalPayment: number;
  totalInterest: number;
};

export type HomeRenovationResult = HomeRenovationCostResult | HomeRenovationLoanResult;

export function calculateHomeRenovationCost(input: HomeRenovationCostInput): HomeRenovationCostResult {
  const items: { key: string; amount: number }[] = [
    { key: "civil", amount: Math.max(0, input.civil) },
    { key: "electrical", amount: Math.max(0, input.electrical) },
    { key: "plumbing", amount: Math.max(0, input.plumbing) },
    { key: "painting", amount: Math.max(0, input.painting) },
    { key: "furniture", amount: Math.max(0, input.furniture) },
    { key: "miscellaneous", amount: Math.max(0, input.miscellaneous) },
  ];
  const subtotal = items.reduce((s, i) => s + i.amount, 0);
  const contingencyPercent = Math.max(0, input.contingencyPercent);
  const contingencyAmount = (subtotal * contingencyPercent) / 100;
  return {
    mode: "cost",
    subtotal,
    contingencyAmount,
    contingencyPercent,
    total: subtotal + contingencyAmount,
    items,
  };
}

export function calculateHomeRenovationLoan(input: HomeRenovationLoanInput): HomeRenovationLoanResult {
  const loanAmount = Math.max(0, input.loanAmount);
  const annualRatePercent = Math.max(0, input.annualRatePercent);
  const tenureYears = Math.max(0, input.tenureYears);
  const months = Math.round(tenureYears * 12);

  if (loanAmount <= 0 || months <= 0) {
    return {
      mode: "loan",
      loanAmount,
      annualRatePercent,
      tenureYears,
      monthlyEmi: 0,
      totalPayment: 0,
      totalInterest: 0,
    };
  }

  const monthlyEmi = emi(loanAmount, annualRatePercent, months);
  const totalPayment = monthlyEmi * months;
  return {
    mode: "loan",
    loanAmount,
    annualRatePercent,
    tenureYears,
    monthlyEmi,
    totalPayment,
    totalInterest: Math.max(0, totalPayment - loanAmount),
  };
}
