/**
 * EDUCATIONAL only — illustrative late-link penalty estimator.
 * Does not call any government API or check real PAN–Aadhaar status.
 */

export type PanLinkStatus = "linked" | "not_linked" | "unknown";

export type PanAadhaarLinkInput = {
  status: PanLinkStatus;
  /** Whether the user considers linking after the illustrative grace deadline. */
  afterDeadline: boolean;
};

export type PanAadhaarLinkResult = {
  status: PanLinkStatus;
  afterDeadline: boolean;
  /** Illustrative fixed penalty (₹0 if linked / unknown). */
  estimatedPenalty: number;
  /** Educational consequence note key. */
  consequenceKey: "ok" | "inoperative" | "unknown";
};

/** Illustrative historical late fees (not current legal advice). */
export const PAN_PENALTY_BEFORE_DEADLINE = 500;
export const PAN_PENALTY_AFTER_DEADLINE = 1_000;

export function calculatePanAadhaarLink(input: PanAadhaarLinkInput): PanAadhaarLinkResult {
  const status = input.status;
  const afterDeadline = Boolean(input.afterDeadline);

  if (status === "linked") {
    return {
      status,
      afterDeadline,
      estimatedPenalty: 0,
      consequenceKey: "ok",
    };
  }

  if (status === "unknown") {
    return {
      status,
      afterDeadline,
      estimatedPenalty: 0,
      consequenceKey: "unknown",
    };
  }

  return {
    status,
    afterDeadline,
    estimatedPenalty: afterDeadline ? PAN_PENALTY_AFTER_DEADLINE : PAN_PENALTY_BEFORE_DEADLINE,
    consequenceKey: "inoperative",
  };
}
