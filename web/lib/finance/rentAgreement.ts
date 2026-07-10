/** Illustrative rent-agreement stamp / registration costs by state (verify locally). */

export type RentAgreementStateId =
  | "mh"
  | "ka"
  | "dl"
  | "tn"
  | "tg"
  | "gj"
  | "up"
  | "other";

export type RentAgreementRates = {
  id: RentAgreementStateId;
  /** Stamp duty as % of total rent over the agreement period (simplified). */
  stampPercent: number;
  /** Registration as % of total rent (0 if often not required for short leases). */
  registrationPercent: number;
};

export const RENT_AGREEMENT_STATES: RentAgreementRates[] = [
  { id: "mh", stampPercent: 0.25, registrationPercent: 0.1 },
  { id: "ka", stampPercent: 0.5, registrationPercent: 0 },
  { id: "dl", stampPercent: 2, registrationPercent: 0 },
  { id: "tn", stampPercent: 1, registrationPercent: 0 },
  { id: "tg", stampPercent: 0.5, registrationPercent: 0 },
  { id: "gj", stampPercent: 1, registrationPercent: 0 },
  { id: "up", stampPercent: 2, registrationPercent: 0 },
  { id: "other", stampPercent: 1, registrationPercent: 0 },
];

export function getRentAgreementRates(id: RentAgreementStateId): RentAgreementRates {
  return RENT_AGREEMENT_STATES.find((s) => s.id === id) ?? RENT_AGREEMENT_STATES[RENT_AGREEMENT_STATES.length - 1]!;
}

export type RentAgreementInput = {
  monthlyRent: number;
  months: number;
  stateId: RentAgreementStateId;
  /** Security deposit in months of rent. */
  depositMonths: number;
};

export type RentAgreementResult = {
  monthlyRent: number;
  months: number;
  totalRent: number;
  stampPercent: number;
  registrationPercent: number;
  stampDuty: number;
  registration: number;
  agreementCosts: number;
  securityDeposit: number;
  upfrontTotal: number;
};

export function calculateRentAgreement(input: RentAgreementInput): RentAgreementResult {
  const monthlyRent = Math.max(0, input.monthlyRent);
  const months = Math.max(0, Math.round(input.months));
  const depositMonths = Math.max(0, input.depositMonths);
  const rates = getRentAgreementRates(input.stateId);
  const totalRent = monthlyRent * months;
  const stampDuty = (totalRent * rates.stampPercent) / 100;
  const registration = (totalRent * rates.registrationPercent) / 100;
  const agreementCosts = stampDuty + registration;
  const securityDeposit = monthlyRent * depositMonths;

  return {
    monthlyRent,
    months,
    totalRent,
    stampPercent: rates.stampPercent,
    registrationPercent: rates.registrationPercent,
    stampDuty,
    registration,
    agreementCosts,
    securityDeposit,
    upfrontTotal: agreementCosts + securityDeposit,
  };
}
