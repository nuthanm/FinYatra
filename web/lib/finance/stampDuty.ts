/** Illustrative stamp duty + registration by state (rates change; verify locally). */

export type StampDutyStateId =
  | "mh"
  | "ka"
  | "dl"
  | "tn"
  | "tg"
  | "gj"
  | "up"
  | "wb"
  | "rj"
  | "kl"
  | "other";

export type StampDutyRates = {
  id: StampDutyStateId;
  /** Stamp duty % of property value (male / general). */
  stampPercent: number;
  /** Registration % of property value. */
  registrationPercent: number;
  /** Percentage-point reduction in stamp duty for women buyers (if any). */
  womenStampConcessionPp: number;
};

export const STAMP_DUTY_STATES: StampDutyRates[] = [
  { id: "mh", stampPercent: 5, registrationPercent: 1, womenStampConcessionPp: 1 },
  { id: "ka", stampPercent: 5, registrationPercent: 1, womenStampConcessionPp: 2 },
  { id: "dl", stampPercent: 6, registrationPercent: 1, womenStampConcessionPp: 2 },
  { id: "tn", stampPercent: 7, registrationPercent: 1, womenStampConcessionPp: 0 },
  { id: "tg", stampPercent: 5, registrationPercent: 0.5, womenStampConcessionPp: 0 },
  { id: "gj", stampPercent: 4.9, registrationPercent: 1, womenStampConcessionPp: 0 },
  { id: "up", stampPercent: 7, registrationPercent: 1, womenStampConcessionPp: 1 },
  { id: "wb", stampPercent: 6, registrationPercent: 1.1, womenStampConcessionPp: 0 },
  { id: "rj", stampPercent: 6, registrationPercent: 1, womenStampConcessionPp: 1 },
  { id: "kl", stampPercent: 8, registrationPercent: 2, womenStampConcessionPp: 0 },
  { id: "other", stampPercent: 5, registrationPercent: 1, womenStampConcessionPp: 0 },
];

export function getStampDutyRates(id: StampDutyStateId): StampDutyRates {
  return STAMP_DUTY_STATES.find((s) => s.id === id) ?? STAMP_DUTY_STATES[STAMP_DUTY_STATES.length - 1]!;
}

export type StampDutyInput = {
  propertyValue: number;
  stateId: StampDutyStateId;
  womenBuyer: boolean;
};

export type StampDutyResult = {
  stampPercentApplied: number;
  registrationPercent: number;
  stampDuty: number;
  registration: number;
  totalCharges: number;
  concessionAmount: number;
};

export function calculateStampDuty(input: StampDutyInput): StampDutyResult {
  const value = Math.max(0, input.propertyValue);
  const rates = getStampDutyRates(input.stateId);
  const baseStamp = rates.stampPercent;
  const appliedStamp =
    input.womenBuyer && rates.womenStampConcessionPp > 0
      ? Math.max(0, baseStamp - rates.womenStampConcessionPp)
      : baseStamp;
  const stampDuty = (value * appliedStamp) / 100;
  const registration = (value * rates.registrationPercent) / 100;
  const withoutConcession = (value * baseStamp) / 100;
  const concessionAmount = Math.max(0, withoutConcession - stampDuty);

  return {
    stampPercentApplied: appliedStamp,
    registrationPercent: rates.registrationPercent,
    stampDuty,
    registration,
    totalCharges: stampDuty + registration,
    concessionAmount,
  };
}
