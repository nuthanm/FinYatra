/** Compare current vs offer CTC and suggest a counter (educational). */

export type SalaryNegotiationInput = {
  currentCtc: number;
  offerCtc: number;
  /** Desired hike % over current CTC for counter suggestion. */
  desiredHikePercent: number;
};

export type SalaryNegotiationResult = {
  currentCtc: number;
  offerCtc: number;
  desiredHikePercent: number;
  offerHikePercent: number;
  offerHikeAmount: number;
  gapVsDesired: number;
  counterCtc: number;
  counterMonthly: number;
  offerMonthly: number;
  currentMonthly: number;
  verdict: "below" | "meets" | "above";
};

export function calculateSalaryNegotiation(input: SalaryNegotiationInput): SalaryNegotiationResult {
  const currentCtc = Math.max(0, input.currentCtc);
  const offerCtc = Math.max(0, input.offerCtc);
  const desiredHikePercent = Math.max(0, input.desiredHikePercent);

  const offerHikeAmount = offerCtc - currentCtc;
  const offerHikePercent = currentCtc > 0 ? (offerHikeAmount / currentCtc) * 100 : 0;
  const counterCtc = currentCtc * (1 + desiredHikePercent / 100);
  const gapVsDesired = offerCtc - counterCtc;

  let verdict: SalaryNegotiationResult["verdict"] = "meets";
  if (offerCtc < counterCtc * 0.98) verdict = "below";
  else if (offerCtc > counterCtc * 1.02) verdict = "above";

  return {
    currentCtc,
    offerCtc,
    desiredHikePercent,
    offerHikePercent,
    offerHikeAmount,
    gapVsDesired,
    counterCtc,
    counterMonthly: counterCtc / 12,
    offerMonthly: offerCtc / 12,
    currentMonthly: currentCtc / 12,
    verdict,
  };
}
