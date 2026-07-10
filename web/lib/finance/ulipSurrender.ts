/**
 * ULIP surrender — premiums paid vs surrender value → gain and educational tax note.
 */

export type UlipSurrenderInput = {
  totalPremiumsPaid: number;
  surrenderValue: number;
  /** Policy years completed (illustrative tax treatment note). */
  yearsHeld: number;
};

export type UlipSurrenderResult = {
  totalPremiumsPaid: number;
  surrenderValue: number;
  yearsHeld: number;
  /** Max(0, surrender − premiums). */
  gain: number;
  /** Loss if surrender < premiums. */
  loss: number;
  /**
   * Educational: older rules often treated gains as capital gains / exempt if conditions met;
   * recent rules may tax ULIP proceeds differently — flag only.
   */
  mayBeTaxable: boolean;
  /** Rough educational tax at illustrative 20% on gain if flagged taxable. */
  illustrativeTaxAt20: number;
};

export function calculateUlipSurrender(input: UlipSurrenderInput): UlipSurrenderResult {
  const totalPremiumsPaid = Math.max(0, input.totalPremiumsPaid);
  const surrenderValue = Math.max(0, input.surrenderValue);
  const yearsHeld = Math.max(0, input.yearsHeld);
  const gain = Math.max(0, surrenderValue - totalPremiumsPaid);
  const loss = Math.max(0, totalPremiumsPaid - surrenderValue);
  /** Illustrative: short hold or high premium policies often need tax review. */
  const mayBeTaxable = gain > 0 && (yearsHeld < 5 || totalPremiumsPaid > 2_50_000);
  const illustrativeTaxAt20 = mayBeTaxable ? gain * 0.2 : 0;

  return {
    totalPremiumsPaid,
    surrenderValue,
    yearsHeld,
    gain,
    loss,
    mayBeTaxable,
    illustrativeTaxAt20,
  };
}
