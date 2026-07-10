/**
 * Fixed + variable pay → tax with vs without variable at slab (educational).
 */

const CESS = 0.04;

export type VariablePayTaxInput = {
  fixedPay: number;
  variablePay: number;
  /** Marginal slab % applied to taxable income (simplified flat). */
  taxSlabPercent: number;
};

export type VariablePayTaxResult = {
  fixedPay: number;
  variablePay: number;
  totalCtc: number;
  taxSlabPercent: number;
  taxWithoutVariable: number;
  taxWithVariable: number;
  extraTaxOnVariable: number;
  effectiveRateOnVariablePercent: number;
};

function taxOn(amount: number, slab: number): number {
  return (Math.max(0, amount) * slab) / 100 * (1 + CESS);
}

export function calculateVariablePayTax(input: VariablePayTaxInput): VariablePayTaxResult {
  const fixedPay = Math.max(0, input.fixedPay);
  const variablePay = Math.max(0, input.variablePay);
  const slab = Math.min(42, Math.max(0, input.taxSlabPercent));
  const taxWithoutVariable = taxOn(fixedPay, slab);
  const taxWithVariable = taxOn(fixedPay + variablePay, slab);
  const extraTaxOnVariable = Math.max(0, taxWithVariable - taxWithoutVariable);
  const effectiveRateOnVariablePercent =
    variablePay > 0 ? (extraTaxOnVariable / variablePay) * 100 : 0;

  return {
    fixedPay,
    variablePay,
    totalCtc: fixedPay + variablePay,
    taxSlabPercent: slab,
    taxWithoutVariable,
    taxWithVariable,
    extraTaxOnVariable,
    effectiveRateOnVariablePercent,
  };
}
