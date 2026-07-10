/**
 * REITs / InvITs tax — distribution split interest / dividend / other (educational).
 */

export type ReitsInvitsTaxInput = {
  interestComponent: number;
  dividendComponent: number;
  otherComponent: number;
  /** Slab for interest / other (taxable). */
  taxSlabPercent: number;
  /** Whether dividend is taxable in hands (illustrative toggle). */
  dividendTaxable?: boolean;
};

export type ReitsInvitsTaxResult = {
  interestComponent: number;
  dividendComponent: number;
  otherComponent: number;
  totalDistribution: number;
  taxOnInterest: number;
  taxOnDividend: number;
  taxOnOther: number;
  totalTax: number;
  /** After illustrative tax. */
  netDistribution: number;
};

export function calculateReitsInvitsTax(input: ReitsInvitsTaxInput): ReitsInvitsTaxResult {
  const interestComponent = Math.max(0, input.interestComponent);
  const dividendComponent = Math.max(0, input.dividendComponent);
  const otherComponent = Math.max(0, input.otherComponent);
  const slab = Math.min(42, Math.max(0, input.taxSlabPercent)) / 100;
  const dividendTaxable = input.dividendTaxable !== false;

  const taxOnInterest = interestComponent * slab;
  const taxOnDividend = dividendTaxable ? dividendComponent * slab : 0;
  const taxOnOther = otherComponent * slab;
  const totalTax = taxOnInterest + taxOnDividend + taxOnOther;
  const totalDistribution = interestComponent + dividendComponent + otherComponent;

  return {
    interestComponent,
    dividendComponent,
    otherComponent,
    totalDistribution,
    taxOnInterest,
    taxOnDividend,
    taxOnOther,
    totalTax,
    netDistribution: Math.max(0, totalDistribution - totalTax),
  };
}
