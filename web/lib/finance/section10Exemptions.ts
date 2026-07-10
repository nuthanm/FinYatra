/**
 * Section 10 exemptions — sum of common salary exemptions (educational, capped).
 * Not a full exemption matrix; soft educational cap on total.
 */

export const SECTION_10_EDUCATIONAL_CAP = 25_00_000;

export type Section10ExemptionsInput = {
  hraExempt: number;
  ltaExempt: number;
  leaveEncashmentExempt: number;
  gratuityExempt: number;
  otherExempt: number;
};

export type Section10ExemptionsResult = {
  hraExempt: number;
  ltaExempt: number;
  leaveEncashmentExempt: number;
  gratuityExempt: number;
  otherExempt: number;
  rawTotal: number;
  totalExempt: number;
  capped: boolean;
  educationalCap: number;
};

export function calculateSection10Exemptions(
  input: Section10ExemptionsInput,
): Section10ExemptionsResult {
  const hraExempt = Math.max(0, input.hraExempt);
  const ltaExempt = Math.max(0, input.ltaExempt);
  const leaveEncashmentExempt = Math.max(0, input.leaveEncashmentExempt);
  const gratuityExempt = Math.max(0, input.gratuityExempt);
  const otherExempt = Math.max(0, input.otherExempt);
  const rawTotal =
    hraExempt + ltaExempt + leaveEncashmentExempt + gratuityExempt + otherExempt;
  const totalExempt = Math.min(rawTotal, SECTION_10_EDUCATIONAL_CAP);
  const capped = rawTotal > SECTION_10_EDUCATIONAL_CAP;

  return {
    hraExempt,
    ltaExempt,
    leaveEncashmentExempt,
    gratuityExempt,
    otherExempt,
    rawTotal,
    totalExempt,
    capped,
    educationalCap: SECTION_10_EDUCATIONAL_CAP,
  };
}
