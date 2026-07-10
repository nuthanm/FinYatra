import { cagr } from "@/lib/finance/compound";
import {
  calculateSovereignGoldBond,
  SGB_ANNUAL_INTEREST_PERCENT,
  SGB_DEFAULT_YEARS,
} from "@/lib/finance/sovereignGoldBond";

/** Compare same rupee investment in Gold ETF vs SGB (educational). */

export type GoldEtfVsSgbInput = {
  /** Amount invested (₹). */
  investment: number;
  /** Gold price at purchase ₹/gram (used to size SGB grams). */
  goldPricePerGram: number;
  /** Expected gold price at end ₹/gram. */
  endGoldPricePerGram: number;
  /** Holding years (SGB typically 8). */
  years?: number;
  /** Gold ETF expense ratio % p.a. (drag on gold return). */
  etfExpensePercent?: number;
  /** Assumed LTCG tax on ETF gains % (e.g. 12.5). SGB maturity gain tax-free for individuals. */
  etfLtcgPercent?: number;
};

export type GoldEtfVsSgbResult = {
  investment: number;
  years: number;
  grams: number;
  sgbTotalInterest: number;
  sgbRedemptionValue: number;
  sgbTotalReturn: number;
  sgbCagrPercent: number;
  etfGrossValue: number;
  etfExpenseDrag: number;
  etfPreTaxValue: number;
  etfTax: number;
  etfNetValue: number;
  etfCagrPercent: number;
  /** SGB total − ETF net. */
  advantageSgb: number;
  winner: "sgb" | "etf" | "tie";
};

export function calculateGoldEtfVsSgb(input: GoldEtfVsSgbInput): GoldEtfVsSgbResult {
  const investment = Math.max(0, input.investment);
  const price = Math.max(1, input.goldPricePerGram);
  const endPrice = Math.max(0, input.endGoldPricePerGram);
  const years = Math.max(0, input.years ?? SGB_DEFAULT_YEARS);
  const expensePct = Math.max(0, input.etfExpensePercent ?? 0.5);
  const ltcgPct = Math.max(0, input.etfLtcgPercent ?? 12.5);

  const grams = investment / price;
  const sgb = calculateSovereignGoldBond({
    grams,
    issuePricePerGram: price,
    years,
    annualInterestPercent: SGB_ANNUAL_INTEREST_PERCENT,
    redemptionPricePerGram: endPrice,
  });

  // ETF: gold appreciation minus annual expense drag (simplified compound)
  const goldGrowthFactor = price > 0 ? endPrice / price : 1;
  const expenseFactor = Math.pow(1 - expensePct / 100, years);
  const etfPreTaxValue = investment * goldGrowthFactor * expenseFactor;
  const etfExpenseDrag = investment * goldGrowthFactor - etfPreTaxValue;
  const etfGain = Math.max(0, etfPreTaxValue - investment);
  const etfTax = etfGain * (ltcgPct / 100);
  const etfNetValue = etfPreTaxValue - etfTax;

  const sgbCagrPercent = cagr(investment, sgb.totalReturn, years);
  const etfCagrPercent = cagr(investment, etfNetValue, years);
  const advantageSgb = sgb.totalReturn - etfNetValue;
  let winner: GoldEtfVsSgbResult["winner"] = "tie";
  if (advantageSgb > 1) winner = "sgb";
  else if (advantageSgb < -1) winner = "etf";

  return {
    investment,
    years,
    grams,
    sgbTotalInterest: sgb.totalInterest,
    sgbRedemptionValue: sgb.redemptionValue,
    sgbTotalReturn: sgb.totalReturn,
    sgbCagrPercent,
    etfGrossValue: investment * goldGrowthFactor,
    etfExpenseDrag,
    etfPreTaxValue,
    etfTax,
    etfNetValue,
    etfCagrPercent,
    advantageSgb,
    winner,
  };
}
