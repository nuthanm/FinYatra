/** Form 26AS TDS vs books TDS → difference (educational reconciliation). */

export type Form26asReconciliationInput = {
  /** TDS as per Form 26AS (₹). */
  tdsAsPer26as: number;
  /** TDS as per books / Form 16 / ledgers (₹). */
  tdsAsPerBooks: number;
};

export type Form26asReconciliationResult = {
  tdsAsPer26as: number;
  tdsAsPerBooks: number;
  /** 26AS − books. Positive = more credit in 26AS. */
  difference: number;
  status: "match" | "26as_higher" | "books_higher";
  absDifference: number;
};

export function calculateForm26asReconciliation(
  input: Form26asReconciliationInput,
): Form26asReconciliationResult {
  const tdsAsPer26as = Math.max(0, input.tdsAsPer26as);
  const tdsAsPerBooks = Math.max(0, input.tdsAsPerBooks);
  const difference = tdsAsPer26as - tdsAsPerBooks;
  const absDifference = Math.abs(difference);
  const status: Form26asReconciliationResult["status"] =
    absDifference < 1 ? "match" : difference > 0 ? "26as_higher" : "books_higher";

  return {
    tdsAsPer26as,
    tdsAsPerBooks,
    difference,
    status,
    absDifference,
  };
}
