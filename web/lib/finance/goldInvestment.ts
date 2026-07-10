import { futureValue, sipFutureValue } from "@/lib/finance/compound";

export type GoldMode = "sip" | "lumpsum";

export type GoldInvestmentInput = {
  mode: GoldMode;
  monthlySip: number;
  lumpsum: number;
  goldAppreciationPercent: number;
  years: number;
  /** Making charges % on physical gold purchase (one-time on invested amount). */
  makingChargesPercent?: number;
};

export type GoldInvestmentResult = {
  invested: number;
  digitalValue: number;
  physicalInvestedNet: number;
  physicalValue: number;
  makingCharges: number;
  gainDigital: number;
  months: number;
};

/**
 * Gold SIP or lumpsum at assumed appreciation.
 * Digital (ETF / digital gold): full amount invested.
 * Physical: making charges reduce the gold quantity bought (net invested).
 */
export function calculateGoldInvestment(input: GoldInvestmentInput): GoldInvestmentResult {
  const rate = Math.max(0, input.goldAppreciationPercent);
  const years = Math.max(0, input.years);
  const months = Math.round(years * 12);
  const makingPct = Math.max(0, input.makingChargesPercent ?? 8);

  if (years <= 0) {
    return {
      invested: 0,
      digitalValue: 0,
      physicalInvestedNet: 0,
      physicalValue: 0,
      makingCharges: 0,
      gainDigital: 0,
      months: 0,
    };
  }

  if (input.mode === "sip") {
    const monthly = Math.max(0, input.monthlySip);
    const invested = monthly * months;
    const digitalValue = sipFutureValue(monthly, rate, months);
    const netMonthly = monthly * (1 - makingPct / 100);
    const makingCharges = invested - netMonthly * months;
    const physicalValue = sipFutureValue(netMonthly, rate, months);
    return {
      invested,
      digitalValue,
      physicalInvestedNet: netMonthly * months,
      physicalValue,
      makingCharges,
      gainDigital: Math.max(0, digitalValue - invested),
      months,
    };
  }

  const principal = Math.max(0, input.lumpsum);
  const digitalValue = futureValue(principal, rate, years);
  const makingCharges = (principal * makingPct) / 100;
  const physicalNet = principal - makingCharges;
  const physicalValue = futureValue(physicalNet, rate, years);
  return {
    invested: principal,
    digitalValue,
    physicalInvestedNet: physicalNet,
    physicalValue,
    makingCharges,
    gainDigital: Math.max(0, digitalValue - principal),
    months,
  };
}
