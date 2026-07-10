/**
 * Educational PAN-related penalty estimator.
 * Illustrative late Aadhaar–PAN link fees and 206AA / 272B-style amounts — not legal advice.
 */

export type PanPenaltyIssue = "late_link" | "no_pan" | "both";

export type PanPenaltyInput = {
  issue: PanPenaltyIssue;
  /** Linking after the illustrative grace deadline → higher late fee. */
  afterDeadline: boolean;
  /**
   * Payment / receipt amount where PAN is missing (for 206AA higher TDS illustration).
   * Used when issue is no_pan or both.
   */
  paymentWithoutPan?: number;
  /** Normal TDS % if PAN were quoted (default 10). */
  normalTdsPercent?: number;
};

export type PanPenaltyResult = {
  issue: PanPenaltyIssue;
  afterDeadline: boolean;
  /** Late Aadhaar–PAN link fee (₹0 if issue is no_pan only). */
  lateLinkPenalty: number;
  /** Illustrative Section 272B-style fixed penalty when PAN not furnished. */
  section272bPenalty: number;
  /** Extra TDS under 206AA-style 20% vs normal rate on paymentWithoutPan. */
  extraTds206aa: number;
  normalTds: number;
  higherTds: number;
  /** Sum of late link + 272B + extra TDS (illustrative total exposure). */
  totalIllustrative: number;
};

export const PAN_LATE_LINK_BEFORE = 500;
export const PAN_LATE_LINK_AFTER = 1_000;
/** Illustrative fixed penalty for failure to quote PAN (educational). */
export const PAN_272B_PENALTY = 10_000;
export const PAN_206AA_RATE = 20;

export function calculatePanPenalty(input: PanPenaltyInput): PanPenaltyResult {
  const issue = input.issue;
  const afterDeadline = Boolean(input.afterDeadline);
  const payment = Math.max(0, input.paymentWithoutPan ?? 0);
  const normalPct = Math.min(30, Math.max(0, input.normalTdsPercent ?? 10)) / 100;
  const higherPct = PAN_206AA_RATE / 100;

  const needsLink = issue === "late_link" || issue === "both";
  const needsNoPan = issue === "no_pan" || issue === "both";

  const lateLinkPenalty = needsLink
    ? afterDeadline
      ? PAN_LATE_LINK_AFTER
      : PAN_LATE_LINK_BEFORE
    : 0;

  const section272bPenalty = needsNoPan ? PAN_272B_PENALTY : 0;
  const normalTds = needsNoPan ? payment * normalPct : 0;
  const higherTds = needsNoPan ? payment * higherPct : 0;
  const extraTds206aa = Math.max(0, higherTds - normalTds);

  return {
    issue,
    afterDeadline,
    lateLinkPenalty,
    section272bPenalty,
    extraTds206aa,
    normalTds,
    higherTds,
    totalIllustrative: lateLinkPenalty + section272bPenalty + extraTds206aa,
  };
}
