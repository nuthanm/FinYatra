import type { BreakdownColumn, FormulaBlock, ToolInfo } from "@/lib/types";
import type { TFn as T } from "@/lib/i18n";

function steps(t: T, ...keys: string[]): string[] {
  return keys.map((k) => t(k));
}

function alt(
  t: T,
  prefix: string,
  name: string,
): { name: string; whenToUse: string; example: string; pros: string; cons: string } {
  return {
    name: t(`${prefix}_Alt_${name}_Name`),
    whenToUse: t(`${prefix}_Alt_${name}_When`),
    example: t(`${prefix}_Alt_${name}_Example`),
    pros: t(`${prefix}_Alt_${name}_Pros`),
    cons: t(`${prefix}_Alt_${name}_Cons`),
  };
}

function baseInfo(t: T, prefix: string, goalKeys: string[], altNames: string[], linkKeys: string[], formulaBlocks: FormulaBlock[]): ToolInfo {
  return {
    abbreviation: t(`${prefix}_Info_Abbreviation`),
    purpose: t(`${prefix}_Info_Purpose`),
    whyKnowThis: t(`${prefix}_Info_WhyKnow`),
    realLifeUse: t(`${prefix}_Info_RealLife`),
    goals: steps(t, ...goalKeys),
    alternatives: altNames.map((n) => alt(t, `${prefix}_Info`, n)),
    officialLinks: linkKeys.map((k) => ({
      label: t(`${prefix}_Info_Link_${k}`),
      url:
        k === "Rbi"
          ? "https://www.rbi.org.in/"
          : k === "Sebi"
            ? "https://www.sebi.gov.in/"
            : k === "Amfi"
              ? "https://www.amfiindia.com/"
              : k === "Mospi"
                ? "https://www.mospi.gov.in/"
                : k === "Dicgc"
                  ? "https://www.dicgc.org.in/"
                  : "#",
    })),
    differentiation: t(`${prefix}_Info_Differentiation`),
    motto: t(`${prefix}_Info_Motto`),
    formulaBlocks,
  };
}

export function standardGrowthColumns(t: T): BreakdownColumn[] {
  return [
    { key: "year", header: t("Common_Year"), alignRight: false },
    { key: "invested", header: t("Common_Col_Invested") },
    { key: "value", header: t("Common_Col_EstValue") },
    { key: "gain", header: t("Common_Col_Gain") },
  ];
}

export const goalInfo = (t: T) =>
  baseInfo(t, "Tool_goal", ["Tool_goal_Info_Goal_1", "Tool_goal_Info_Goal_2", "Tool_goal_Info_Goal_3"], ["RdFd", "Sip", "Budget"], ["Rbi", "Sebi"], [
    { title: t("Tool_goal_FormulaInflationTitle"), code: "futureTarget = targetToday * (1 + inflationRate) ^ years", steps: steps(t, "Tool_goal_StepInflation_1", "Tool_goal_StepInflation_2", "Tool_goal_StepInflation_3", "Tool_goal_StepInflation_4") },
    { title: t("Tool_goal_FormulaSipTitle"), code: "r = annualReturn / 12\nsip = target * r / ((1 + r) ^ months - 1)", steps: steps(t, "Tool_goal_StepSip_1", "Tool_goal_StepSip_2", "Tool_goal_StepSip_3", "Tool_goal_StepSip_4") },
  ]);

export const fireInfo = (t: T) =>
  baseInfo(t, "Tool_fire", ["Tool_fire_Info_Goal_1", "Tool_fire_Info_Goal_2", "Tool_fire_Info_Goal_3"], ["Retirement", "Rule", "Goal"], ["Rbi", "Sebi"], [
    { title: t("Tool_fire_FormulaInflateTitle"), code: "futureMonthly = currentMonthly * (1 + inflationRate) ^ years", steps: steps(t, "Tool_fire_StepInflate_1", "Tool_fire_StepInflate_2", "Tool_fire_StepInflate_3") },
    { title: t("Tool_fire_FormulaCorpusTitle"), code: "annualExpense = futureMonthly * 12\ncorpus = annualExpense * 25", steps: steps(t, "Tool_fire_StepCorpus_1", "Tool_fire_StepCorpus_2") },
    { title: t("Tool_fire_FormulaSipTitle"), code: "r = annualReturn / 12\nmonths = years * 12\nSIP = corpus * r / ((1 + r)^months - 1)", steps: steps(t, "Tool_fire_StepSipCalc_1", "Tool_fire_StepSipCalc_2", "Tool_fire_StepSipCalc_3") },
  ]);

export const sipInfo = (t: T) =>
  baseInfo(t, "Tool_sip", ["Tool_sip_Info_Goal_1", "Tool_sip_Info_Goal_2", "Tool_sip_Info_Goal_3"], ["Rd", "Lumpsum", "Goal"], ["Sebi", "Amfi"], [
    { title: t("Tool_sip_FormulaFvTitle"), code: "r = annualReturn / 12\nn = years * 12\nFV = SIP * ((1 + r)^n - 1) / r", steps: steps(t, "Tool_sip_StepFv_1", "Tool_sip_StepFv_2", "Tool_sip_StepFv_3", "Tool_sip_StepFv_4", "Tool_sip_StepFv_5") },
  ]);

export const emiInfo = (t: T) =>
  baseInfo(t, "Tool_emi", ["Tool_emi_Info_Goal_1", "Tool_emi_Info_Goal_2", "Tool_emi_Info_Goal_3"], ["Bank", "Amort", "Afford"], ["Rbi"], [
    { title: t("Tool_emi_FormulaEmiTitle"), code: "monthlyRate = annualRate / 12\nEMI = P * monthlyRate * (1+monthlyRate)^n / ((1+monthlyRate)^n - 1)", steps: steps(t, "Tool_emi_StepEmi_1", "Tool_emi_StepEmi_2", "Tool_emi_StepEmi_3", "Tool_emi_StepEmi_4", "Tool_emi_StepEmi_5") },
  ]);

export const inflationInfo = (t: T) =>
  baseInfo(t, "Tool_inflation", ["Tool_inflation_Info_Goal_1", "Tool_inflation_Info_Goal_2", "Tool_inflation_Info_Goal_3"], ["Rule72", "Cpi", "Budget"], ["Rbi", "Mospi"], [
    { title: t("Tool_inflation_FormulaFutureTitle"), code: "futureCost = presentCost * (1 + inflationRate) ^ years", steps: steps(t, "Tool_inflation_StepFuture_1", "Tool_inflation_StepFuture_2", "Tool_inflation_StepFuture_3", "Tool_inflation_StepFuture_4", "Tool_inflation_StepFuture_5") },
  ]);

export const fdInfo = (t: T) =>
  baseInfo(t, "Tool_fd", ["Tool_fd_Info_Goal_1", "Tool_fd_Info_Goal_2", "Tool_fd_Info_Goal_3"], ["Single", "Mix", "Rd"], ["Rbi", "Dicgc"], [
    { title: t("Tool_fd_FormulaLadderTitle"), code: "perFd = totalAmount / count\nmaturity = perFd * (1 + rate) ^ tenureYears", steps: steps(t, "Tool_fd_StepLadder_1", "Tool_fd_StepLadder_2", "Tool_fd_StepLadder_3", "Tool_fd_StepLadder_4") },
  ]);

export const goalExampleSources = (t: T) => [
  { label: t("Tool_goal_Source_BusinessToday"), url: "https://www.businesstoday.in/personal-finance/investment/story/fixed-deposits-remain-a-safe-bet-in-july-2026-where-can-investors-earn-highest-interest-540136-2026-07-01" },
  { label: t("Tool_goal_Source_PolicyBazaar"), url: "https://www.policybazaar.com/fd-interest-rates/" },
  { label: t("Tool_goal_Source_BajajAmc"), url: "https://www.bajajamc.com/knowledge-centre/nifty-50-historical-returns" },
  { label: t("Tool_goal_Source_SumMoney"), url: "https://sum.money/in/nifty-returns-calculator/" },
];
