/**
 * Property registration charges: stamp % + registration % on property value (educational).
 * Can use custom rates or stamp-duty style state presets.
 */

import {
  calculateStampDuty,
  getStampDutyRates,
  type StampDutyStateId,
} from "@/lib/finance/stampDuty";

export type PropertyRegistrationInput = {
  propertyValue: number;
  /** If set, use state preset rates (ignores custom % unless state is other + customs provided). */
  stateId?: StampDutyStateId;
  stampPercent?: number;
  registrationPercent?: number;
  womenBuyer?: boolean;
};

export type PropertyRegistrationResult = {
  propertyValue: number;
  stampPercentApplied: number;
  registrationPercent: number;
  stampDuty: number;
  registration: number;
  totalCharges: number;
  concessionAmount: number;
  stateId: StampDutyStateId | "custom";
};

export function calculatePropertyRegistration(
  input: PropertyRegistrationInput,
): PropertyRegistrationResult {
  const value = Math.max(0, input.propertyValue);
  const womenBuyer = Boolean(input.womenBuyer);

  if (input.stateId) {
    const result = calculateStampDuty({
      propertyValue: value,
      stateId: input.stateId,
      womenBuyer,
    });
    return {
      propertyValue: value,
      stampPercentApplied: result.stampPercentApplied,
      registrationPercent: result.registrationPercent,
      stampDuty: result.stampDuty,
      registration: result.registration,
      totalCharges: result.totalCharges,
      concessionAmount: result.concessionAmount,
      stateId: input.stateId,
    };
  }

  const stampPercent = Math.min(15, Math.max(0, input.stampPercent ?? 5));
  const registrationPercent = Math.min(5, Math.max(0, input.registrationPercent ?? 1));
  const stampDuty = (value * stampPercent) / 100;
  const registration = (value * registrationPercent) / 100;

  return {
    propertyValue: value,
    stampPercentApplied: stampPercent,
    registrationPercent,
    stampDuty,
    registration,
    totalCharges: stampDuty + registration,
    concessionAmount: 0,
    stateId: "custom",
  };
}

export { getStampDutyRates, type StampDutyStateId };
