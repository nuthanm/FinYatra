/**
 * Educational income-tax notice guide — meaning + checklist + optional demand amount.
 * Not a response generator or legal advice.
 */

export type IncomeTaxNoticeType =
  | "143_1"
  | "143_2"
  | "148"
  | "156"
  | "245"
  | "other";

export type IncomeTaxNoticeInput = {
  noticeType: IncomeTaxNoticeType;
  /** Optional demand / mismatch amount shown on the notice (₹). */
  demandAmount?: number;
};

export type IncomeTaxNoticeResult = {
  noticeType: IncomeTaxNoticeType;
  /** i18n key suffix for meaning text. */
  meaningKey: IncomeTaxNoticeType;
  /** Checklist item key suffixes (Tool_income_tax_notice_Check_{id}). */
  checklistKeys: string[];
  /** Typical response window note key. */
  deadlineKey: string;
  demandAmount: number;
  hasDemand: boolean;
};

const CHECKLISTS: Record<IncomeTaxNoticeType, string[]> = {
  "143_1": ["verify_intimation", "match_form16", "check_refund", "respond_portal"],
  "143_2": ["read_questionnaire", "gather_docs", "file_response", "track_hearing"],
  "148": ["check_reasons", "consult_ca", "file_return", "preserve_records"],
  "156": ["verify_demand", "pay_or_rectify", "file_appeal_if", "update_challan"],
  "245": ["check_adjustment", "confirm_refund", "object_if_wrong", "track_status"],
  other: ["identify_section", "consult_ca", "respond_deadline", "keep_copies"],
};

const DEADLINES: Record<IncomeTaxNoticeType, string> = {
  "143_1": "intimation",
  "143_2": "scrutiny",
  "148": "reassessment",
  "156": "demand",
  "245": "adjustment",
  other: "generic",
};

export function analyzeIncomeTaxNotice(input: IncomeTaxNoticeInput): IncomeTaxNoticeResult {
  const noticeType = input.noticeType;
  const demandAmount = Math.max(0, input.demandAmount ?? 0);

  return {
    noticeType,
    meaningKey: noticeType,
    checklistKeys: CHECKLISTS[noticeType],
    deadlineKey: DEADLINES[noticeType],
    demandAmount,
    hasDemand: demandAmount > 0,
  };
}
