/**
 * Credit score simulator — educational factor deltas (not a real bureau score).
 */

export type CreditScoreSimulatorInput = {
  /** Starting illustrative score (300–900). */
  baseScore: number;
  /** On-time payment habit: -1 late, 0 mixed, 1 excellent. */
  paymentHabit: -1 | 0 | 1;
  /** Credit utilisation % (lower is better). */
  utilisationPercent: number;
  /** New hard enquiries in last year. */
  newEnquiries: number;
  /** Credit age in years. */
  creditAgeYears: number;
};

export type CreditScoreSimulatorResult = {
  baseScore: number;
  paymentDelta: number;
  utilisationDelta: number;
  enquiryDelta: number;
  ageDelta: number;
  totalDelta: number;
  simulatedScore: number;
  band: "poor" | "fair" | "good" | "excellent";
};

function clampScore(n: number): number {
  return Math.min(900, Math.max(300, Math.round(n)));
}

function bandFor(score: number): CreditScoreSimulatorResult["band"] {
  if (score >= 750) return "excellent";
  if (score >= 700) return "good";
  if (score >= 650) return "fair";
  return "poor";
}

export function calculateCreditScoreSimulator(input: CreditScoreSimulatorInput): CreditScoreSimulatorResult {
  const baseScore = clampScore(input.baseScore);
  const paymentDelta = input.paymentHabit === 1 ? 40 : input.paymentHabit === -1 ? -60 : 0;
  const util = Math.min(100, Math.max(0, input.utilisationPercent));
  const utilisationDelta = util <= 30 ? 25 : util <= 50 ? 5 : util <= 70 ? -20 : -45;
  const enquiries = Math.max(0, Math.floor(input.newEnquiries));
  const enquiryDelta = enquiries === 0 ? 10 : enquiries === 1 ? -5 : enquiries === 2 ? -15 : -30;
  const age = Math.max(0, input.creditAgeYears);
  const ageDelta = age >= 7 ? 20 : age >= 3 ? 10 : age >= 1 ? 0 : -15;
  const totalDelta = paymentDelta + utilisationDelta + enquiryDelta + ageDelta;
  const simulatedScore = clampScore(baseScore + totalDelta);

  return {
    baseScore,
    paymentDelta,
    utilisationDelta,
    enquiryDelta,
    ageDelta,
    totalDelta,
    simulatedScore,
    band: bandFor(simulatedScore),
  };
}
