/** Illustrative India equity trading charges (delivery vs intraday). */

export type BrokerageTradeType = "delivery" | "intraday";

export type BrokerageFeeMode = "percent" | "flat";

export type BrokerageInput = {
  tradeValue: number;
  tradeType: BrokerageTradeType;
  feeMode: BrokerageFeeMode;
  /** Brokerage % of trade value (when feeMode = percent). */
  brokeragePercent: number;
  /** Flat brokerage ₹ per side (when feeMode = flat). */
  brokerageFlat: number;
  /** Override STT %; if null, use stack default. */
  sttPercent: number | null;
  /** Override exchange txn %; if null, use stack default. */
  exchangePercent: number | null;
  /** GST % on (brokerage + exchange). Default 18. */
  gstPercent: number;
};

export type BrokerageStack = {
  sttPercent: number;
  exchangePercent: number;
  defaultBrokeragePercent: number;
  defaultBrokerageFlat: number;
};

/** Simplified one-side charge stacks (illustrative). */
export const BROKERAGE_STACKS: Record<BrokerageTradeType, BrokerageStack> = {
  delivery: {
    sttPercent: 0.1,
    exchangePercent: 0.003,
    defaultBrokeragePercent: 0,
    defaultBrokerageFlat: 0,
  },
  intraday: {
    sttPercent: 0.025,
    exchangePercent: 0.0035,
    defaultBrokeragePercent: 0.03,
    defaultBrokerageFlat: 20,
  },
};

export type BrokerageResult = {
  brokerage: number;
  stt: number;
  exchange: number;
  gst: number;
  totalCharges: number;
  netProceeds: number;
  sttPercentApplied: number;
  exchangePercentApplied: number;
  brokeragePercentEffective: number;
};

export function calculateBrokerage(input: BrokerageInput): BrokerageResult {
  const value = Math.max(0, input.tradeValue);
  const stack = BROKERAGE_STACKS[input.tradeType];
  const sttPct = input.sttPercent ?? stack.sttPercent;
  const exchPct = input.exchangePercent ?? stack.exchangePercent;
  const gstPct = Math.min(28, Math.max(0, input.gstPercent));

  let brokerage: number;
  let brokeragePercentEffective: number;
  if (input.feeMode === "flat") {
    brokerage = Math.max(0, input.brokerageFlat);
    brokeragePercentEffective = value > 0 ? (brokerage / value) * 100 : 0;
  } else {
    const pct = Math.max(0, input.brokeragePercent);
    brokerage = (value * pct) / 100;
    brokeragePercentEffective = pct;
  }

  const stt = (value * Math.max(0, sttPct)) / 100;
  const exchange = (value * Math.max(0, exchPct)) / 100;
  const gst = ((brokerage + exchange) * gstPct) / 100;
  const totalCharges = brokerage + stt + exchange + gst;
  const netProceeds = Math.max(0, value - totalCharges);

  return {
    brokerage,
    stt,
    exchange,
    gst,
    totalCharges,
    netProceeds,
    sttPercentApplied: sttPct,
    exchangePercentApplied: exchPct,
    brokeragePercentEffective,
  };
}
