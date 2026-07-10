/** Wedding / marriage budget: sum major expense buckets + contingency. */

export type MarriageBudgetInput = {
  venue: number;
  catering: number;
  decor: number;
  attire: number;
  photography: number;
  jewellery: number;
  travel: number;
  miscellaneous: number;
  /** Contingency buffer as % of subtotal. */
  contingencyPercent: number;
};

export type MarriageBudgetResult = {
  subtotal: number;
  contingencyAmount: number;
  contingencyPercent: number;
  total: number;
  items: { key: string; amount: number }[];
};

export function calculateMarriageBudget(input: MarriageBudgetInput): MarriageBudgetResult {
  const items: { key: string; amount: number }[] = [
    { key: "venue", amount: Math.max(0, input.venue) },
    { key: "catering", amount: Math.max(0, input.catering) },
    { key: "decor", amount: Math.max(0, input.decor) },
    { key: "attire", amount: Math.max(0, input.attire) },
    { key: "photography", amount: Math.max(0, input.photography) },
    { key: "jewellery", amount: Math.max(0, input.jewellery) },
    { key: "travel", amount: Math.max(0, input.travel) },
    { key: "miscellaneous", amount: Math.max(0, input.miscellaneous) },
  ];
  const subtotal = items.reduce((s, i) => s + i.amount, 0);
  const contingencyPercent = Math.max(0, input.contingencyPercent);
  const contingencyAmount = (subtotal * contingencyPercent) / 100;
  return {
    subtotal,
    contingencyAmount,
    contingencyPercent,
    total: subtotal + contingencyAmount,
    items,
  };
}
