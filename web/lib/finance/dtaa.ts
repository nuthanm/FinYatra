/**
 * DTAA / foreign tax credit sketch — credit = min(foreign tax paid, India tax on same income).
 * Educational only; treaty rates and Form 67 rules vary by country.
 */

export type DtaaInput = {
  foreignIncome: number;
  /** Tax already paid abroad on that income. */
  foreignTaxPaid: number;
  /** Illustrative India tax on the same income (slab / treaty rate applied). */
  indiaTaxOnIncome: number;
};

export type DtaaResult = {
  foreignIncome: number;
  foreignTaxPaid: number;
  indiaTaxOnIncome: number;
  /** FTC = min(foreign, India). */
  foreignTaxCredit: number;
  /** India tax still payable after credit. */
  netIndiaTax: number;
  /** Foreign tax that could not be credited (excess). */
  uncreditedForeignTax: number;
};

export function calculateDtaa(input: DtaaInput): DtaaResult {
  const foreignIncome = Math.max(0, input.foreignIncome);
  const foreignTaxPaid = Math.max(0, input.foreignTaxPaid);
  const indiaTaxOnIncome = Math.max(0, input.indiaTaxOnIncome);
  const foreignTaxCredit = Math.min(foreignTaxPaid, indiaTaxOnIncome);
  const netIndiaTax = Math.max(0, indiaTaxOnIncome - foreignTaxCredit);
  const uncreditedForeignTax = Math.max(0, foreignTaxPaid - foreignTaxCredit);

  return {
    foreignIncome,
    foreignTaxPaid,
    indiaTaxOnIncome,
    foreignTaxCredit,
    netIndiaTax,
    uncreditedForeignTax,
  };
}
