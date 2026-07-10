/** Net worth = total assets − total liabilities. */

export type NetWorthInput = {
  cashAndBank: number;
  investments: number;
  property: number;
  otherAssets: number;
  homeLoan: number;
  otherLoans: number;
  creditCards: number;
  otherLiabilities: number;
};

export type NetWorthResult = {
  totalAssets: number;
  totalLiabilities: number;
  netWorth: number;
  assetBreakdown: { key: string; amount: number }[];
  liabilityBreakdown: { key: string; amount: number }[];
};

export function calculateNetWorth(input: NetWorthInput): NetWorthResult {
  const assets = [
    { key: "cashAndBank", amount: Math.max(0, input.cashAndBank) },
    { key: "investments", amount: Math.max(0, input.investments) },
    { key: "property", amount: Math.max(0, input.property) },
    { key: "otherAssets", amount: Math.max(0, input.otherAssets) },
  ];
  const liabilities = [
    { key: "homeLoan", amount: Math.max(0, input.homeLoan) },
    { key: "otherLoans", amount: Math.max(0, input.otherLoans) },
    { key: "creditCards", amount: Math.max(0, input.creditCards) },
    { key: "otherLiabilities", amount: Math.max(0, input.otherLiabilities) },
  ];
  const totalAssets = assets.reduce((s, a) => s + a.amount, 0);
  const totalLiabilities = liabilities.reduce((s, l) => s + l.amount, 0);
  return {
    totalAssets,
    totalLiabilities,
    netWorth: totalAssets - totalLiabilities,
    assetBreakdown: assets.filter((a) => a.amount > 0),
    liabilityBreakdown: liabilities.filter((l) => l.amount > 0),
  };
}
