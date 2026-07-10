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
                  : k === "ItDept"
                    ? "https://www.incometax.gov.in/"
                    : k === "Nsi"
                      ? "https://www.nsiindia.gov.in/"
                      : k === "Gst"
                        ? "https://www.gst.gov.in/"
                        : k === "Nps"
                          ? "https://www.npscra.nsdl.co.in/"
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

export const cagrInfo = (t: T) =>
  baseInfo(t, "Tool_cagr", ["Tool_cagr_Info_Goal_1", "Tool_cagr_Info_Goal_2", "Tool_cagr_Info_Goal_3"], ["Sip", "Lumpsum", "Xirr"], ["Sebi", "Amfi"], [
    { title: t("Tool_cagr_FormulaTitle"), code: "CAGR = (Ending / Beginning)^(1/years) - 1", steps: steps(t, "Tool_cagr_Step_1", "Tool_cagr_Step_2", "Tool_cagr_Step_3", "Tool_cagr_Step_4") },
  ]);

export const lumpsumInfo = (t: T) =>
  baseInfo(t, "Tool_lumpsum", ["Tool_lumpsum_Info_Goal_1", "Tool_lumpsum_Info_Goal_2", "Tool_lumpsum_Info_Goal_3"], ["Sip", "Fd", "Goal"], ["Sebi", "Amfi"], [
    { title: t("Tool_lumpsum_FormulaTitle"), code: "FV = PV × (1 + r)^years", steps: steps(t, "Tool_lumpsum_Step_1", "Tool_lumpsum_Step_2", "Tool_lumpsum_Step_3", "Tool_lumpsum_Step_4") },
  ]);

export const compoundInterestInfo = (t: T) =>
  baseInfo(t, "Tool_interest", ["Tool_interest_Info_Goal_1", "Tool_interest_Info_Goal_2", "Tool_interest_Info_Goal_3"], ["Fd", "Sip", "Rule72"], ["Rbi"], [
    { title: t("Tool_interest_FormulaTitle"), code: "A = P × (1 + r/n)^(n×t)", steps: steps(t, "Tool_interest_Step_1", "Tool_interest_Step_2", "Tool_interest_Step_3", "Tool_interest_Step_4") },
  ]);

export const mortgageInfo = (t: T) =>
  baseInfo(t, "Tool_mortgage", ["Tool_mortgage_Info_Goal_1", "Tool_mortgage_Info_Goal_2", "Tool_mortgage_Info_Goal_3"], ["Emi", "Rent", "Prepay"], ["Rbi"], [
    { title: t("Tool_mortgage_FormulaTitle"), code: "Loan = Price − Down payment\nEMI = P × r × (1+r)^n / ((1+r)^n − 1)", steps: steps(t, "Tool_mortgage_Step_1", "Tool_mortgage_Step_2", "Tool_mortgage_Step_3", "Tool_mortgage_Step_4") },
  ]);

export const ppfInfo = (t: T) =>
  baseInfo(t, "Tool_ppf", ["Tool_ppf_Info_Goal_1", "Tool_ppf_Info_Goal_2", "Tool_ppf_Info_Goal_3"], ["Fd", "Epf", "Nps"], ["Nsi"], [
    { title: t("Tool_ppf_FormulaTitle"), code: "Each year: balance += deposit; interest = balance × rate; balance += interest", steps: steps(t, "Tool_ppf_Step_1", "Tool_ppf_Step_2", "Tool_ppf_Step_3", "Tool_ppf_Step_4") },
  ]);

export const fixedDepositInfo = (t: T) =>
  baseInfo(t, "Tool_fixed_deposit", ["Tool_fixed_deposit_Info_Goal_1", "Tool_fixed_deposit_Info_Goal_2", "Tool_fixed_deposit_Info_Goal_3"], ["Ppf", "Rd", "Debt"], ["Rbi", "Dicgc"], [
    { title: t("Tool_fixed_deposit_FormulaTitle"), code: "A = P × (1 + r/n)^(n×t)", steps: steps(t, "Tool_fixed_deposit_Step_1", "Tool_fixed_deposit_Step_2", "Tool_fixed_deposit_Step_3", "Tool_fixed_deposit_Step_4") },
  ]);

export const incomeTaxInfo = (t: T) =>
  baseInfo(t, "Tool_income_tax", ["Tool_income_tax_Info_Goal_1", "Tool_income_tax_Info_Goal_2", "Tool_income_tax_Info_Goal_3"], ["Salary", "Hra", "80c"], ["ItDept"], [
    { title: t("Tool_income_tax_FormulaTitle"), code: "taxable = income − std − deductions\ntax = slabs(taxable) − 87A + 4% cess", steps: steps(t, "Tool_income_tax_Step_1", "Tool_income_tax_Step_2", "Tool_income_tax_Step_3", "Tool_income_tax_Step_4") },
  ]);

export const hraInfo = (t: T) =>
  baseInfo(t, "Tool_hra", ["Tool_hra_Info_Goal_1", "Tool_hra_Info_Goal_2", "Tool_hra_Info_Goal_3"], ["Salary", "80gg", "Rent"], ["ItDept"], [
    { title: t("Tool_hra_FormulaTitle"), code: "exemption = min(actual HRA, rent − 10% basic, 50%/40% basic)", steps: steps(t, "Tool_hra_Step_1", "Tool_hra_Step_2", "Tool_hra_Step_3", "Tool_hra_Step_4") },
  ]);

export const gstInfo = (t: T) =>
  baseInfo(t, "Tool_gst", ["Tool_gst_Info_Goal_1", "Tool_gst_Info_Goal_2", "Tool_gst_Info_Goal_3"], ["Invoice", "Composition", "Itc"], ["Gst"], [
    { title: t("Tool_gst_FormulaTitle"), code: "Exclusive: GST = amount × rate/100\nInclusive: base = amount / (1 + rate)", steps: steps(t, "Tool_gst_Step_1", "Tool_gst_Step_2", "Tool_gst_Step_3", "Tool_gst_Step_4") },
  ]);

export const salaryInfo = (t: T) =>
  baseInfo(t, "Tool_salary", ["Tool_salary_Info_Goal_1", "Tool_salary_Info_Goal_2", "Tool_salary_Info_Goal_3"], ["Tax", "Hra", "Epf"], ["ItDept"], [
    { title: t("Tool_salary_FormulaTitle"), code: "in-hand = gross − PF − PT − tax\ngross ≈ CTC − employer PF − gratuity", steps: steps(t, "Tool_salary_Step_1", "Tool_salary_Step_2", "Tool_salary_Step_3", "Tool_salary_Step_4") },
  ]);

export const homeLoanEmiInfo = (t: T) =>
  baseInfo(t, "Tool_home_loan_emi", ["Tool_home_loan_emi_Info_Goal_1", "Tool_home_loan_emi_Info_Goal_2", "Tool_home_loan_emi_Info_Goal_3"], ["Emi", "Prepay", "Tax"], ["Rbi"], [
    { title: t("Tool_home_loan_emi_FormulaTitle"), code: "EMI = P × r × (1+r)^n / ((1+r)^n − 1)", steps: steps(t, "Tool_home_loan_emi_Step_1", "Tool_home_loan_emi_Step_2", "Tool_home_loan_emi_Step_3", "Tool_home_loan_emi_Step_4") },
  ]);

export const gratuityInfo = (t: T) =>
  baseInfo(t, "Tool_gratuity", ["Tool_gratuity_Info_Goal_1", "Tool_gratuity_Info_Goal_2", "Tool_gratuity_Info_Goal_3"], ["Salary", "Epf", "Tax"], ["ItDept"], [
    { title: t("Tool_gratuity_FormulaTitle"), code: "Gratuity = (Salary × 15 × Years) / 26", steps: steps(t, "Tool_gratuity_Step_1", "Tool_gratuity_Step_2", "Tool_gratuity_Step_3", "Tool_gratuity_Step_4") },
  ]);

export const npsInfo = (t: T) =>
  baseInfo(t, "Tool_nps", ["Tool_nps_Info_Goal_1", "Tool_nps_Info_Goal_2", "Tool_nps_Info_Goal_3"], ["Ppf", "Epf", "Annuity"], ["Nps"], [
    { title: t("Tool_nps_FormulaTitle"), code: "Corpus = FV(existing) + FV(monthly SIP)\n60% lump + 40% annuity", steps: steps(t, "Tool_nps_Step_1", "Tool_nps_Step_2", "Tool_nps_Step_3", "Tool_nps_Step_4") },
  ]);

export const rdInfo = (t: T) =>
  baseInfo(t, "Tool_rd", ["Tool_rd_Info_Goal_1", "Tool_rd_Info_Goal_2", "Tool_rd_Info_Goal_3"], ["Fd", "Sip", "Ppf"], ["Rbi", "Dicgc"], [
    { title: t("Tool_rd_FormulaTitle"), code: "M = P × [((1+i)^n − 1) / (1 − (1+i)^(−1/3))]", steps: steps(t, "Tool_rd_Step_1", "Tool_rd_Step_2", "Tool_rd_Step_3", "Tool_rd_Step_4") },
  ]);

export const swpInfo = (t: T) =>
  baseInfo(t, "Tool_swp", ["Tool_swp_Info_Goal_1", "Tool_swp_Info_Goal_2", "Tool_swp_Info_Goal_3"], ["Sip", "Fd", "Pension"], ["Sebi", "Amfi"], [
    { title: t("Tool_swp_FormulaTitle"), code: "each month: corpus *= (1+r); corpus -= withdrawal", steps: steps(t, "Tool_swp_Step_1", "Tool_swp_Step_2", "Tool_swp_Step_3", "Tool_swp_Step_4") },
  ]);

export const elssInfo = (t: T) =>
  baseInfo(t, "Tool_elss", ["Tool_elss_Info_Goal_1", "Tool_elss_Info_Goal_2", "Tool_elss_Info_Goal_3"], ["Sip", "Ppf", "80c"], ["Sebi", "Amfi"], [
    { title: t("Tool_elss_FormulaTitle"), code: "FV = SIP annuity formula\nLTCG 12.5% above ₹1.25L", steps: steps(t, "Tool_elss_Step_1", "Tool_elss_Step_2", "Tool_elss_Step_3", "Tool_elss_Step_4") },
  ]);

export const epfInfo = (t: T) =>
  baseInfo(t, "Tool_epf", ["Tool_epf_Info_Goal_1", "Tool_epf_Info_Goal_2", "Tool_epf_Info_Goal_3"], ["Ppf", "Nps", "Salary"], ["Rbi"], [
    { title: t("Tool_epf_FormulaTitle"), code: "Employee 12% + Employer 3.67% → EPF corpus", steps: steps(t, "Tool_epf_Step_1", "Tool_epf_Step_2", "Tool_epf_Step_3", "Tool_epf_Step_4") },
  ]);

export const ssyInfo = (t: T) =>
  baseInfo(t, "Tool_sukanya_samriddhi", ["Tool_sukanya_samriddhi_Info_Goal_1", "Tool_sukanya_samriddhi_Info_Goal_2", "Tool_sukanya_samriddhi_Info_Goal_3"], ["Ppf", "Fd", "80c"], ["Nsi"], [
    { title: t("Tool_sukanya_samriddhi_FormulaTitle"), code: "Deposit 15 years; compound to year 21", steps: steps(t, "Tool_sukanya_samriddhi_Step_1", "Tool_sukanya_samriddhi_Step_2", "Tool_sukanya_samriddhi_Step_3", "Tool_sukanya_samriddhi_Step_4") },
  ]);

export const scssInfo = (t: T) =>
  baseInfo(t, "Tool_scss", ["Tool_scss_Info_Goal_1", "Tool_scss_Info_Goal_2", "Tool_scss_Info_Goal_3"], ["Fd", "Ppf", "Nps"], ["Nsi"], [
    { title: t("Tool_scss_FormulaTitle"), code: "Quarterly interest = Deposit × rate / 4", steps: steps(t, "Tool_scss_Step_1", "Tool_scss_Step_2", "Tool_scss_Step_3", "Tool_scss_Step_4") },
  ]);

export const carLoanEmiInfo = (t: T) =>
  baseInfo(t, "Tool_car_loan_emi", ["Tool_car_loan_emi_Info_Goal_1", "Tool_car_loan_emi_Info_Goal_2", "Tool_car_loan_emi_Info_Goal_3"], ["Emi", "Home", "Fd"], ["Rbi"], [
    { title: t("Tool_car_loan_emi_FormulaTitle"), code: "Loan = Price − Down + Insurance\nEMI standard reducing-balance", steps: steps(t, "Tool_car_loan_emi_Step_1", "Tool_car_loan_emi_Step_2", "Tool_car_loan_emi_Step_3", "Tool_car_loan_emi_Step_4") },
  ]);

export const educationLoanInfo = (t: T) =>
  baseInfo(t, "Tool_education_loan", ["Tool_education_loan_Info_Goal_1", "Tool_education_loan_Info_Goal_2", "Tool_education_loan_Info_Goal_3"], ["Emi", "80c", "Salary"], ["ItDept"], [
    { title: t("Tool_education_loan_FormulaTitle"), code: "Capitalise moratorium interest → EMI\n80E on interest (old regime)", steps: steps(t, "Tool_education_loan_Step_1", "Tool_education_loan_Step_2", "Tool_education_loan_Step_3", "Tool_education_loan_Step_4") },
  ]);

export const stampDutyInfo = (t: T) =>
  baseInfo(t, "Tool_stamp_duty", ["Tool_stamp_duty_Info_Goal_1", "Tool_stamp_duty_Info_Goal_2", "Tool_stamp_duty_Info_Goal_3"], ["Home", "Emi", "Fd"], ["Rbi"], [
    { title: t("Tool_stamp_duty_FormulaTitle"), code: "Stamp + Registration on property value", steps: steps(t, "Tool_stamp_duty_Step_1", "Tool_stamp_duty_Step_2", "Tool_stamp_duty_Step_3", "Tool_stamp_duty_Step_4") },
  ]);

export const professionalTaxInfo = (t: T) =>
  baseInfo(t, "Tool_professional_tax", ["Tool_professional_tax_Info_Goal_1", "Tool_professional_tax_Info_Goal_2", "Tool_professional_tax_Info_Goal_3"], ["Salary", "Tds", "Tax"], ["Rbi"], [
    { title: t("Tool_professional_tax_FormulaTitle"), code: "Monthly PT from state slab; annual may be capped", steps: steps(t, "Tool_professional_tax_Step_1", "Tool_professional_tax_Step_2", "Tool_professional_tax_Step_3", "Tool_professional_tax_Step_4") },
  ]);

export const tdsInfo = (t: T) =>
  baseInfo(t, "Tool_tds", ["Tool_tds_Info_Goal_1", "Tool_tds_Info_Goal_2", "Tool_tds_Info_Goal_3"], ["Tax", "Salary", "Fd"], ["ItDept"], [
    { title: t("Tool_tds_FormulaTitle"), code: "TDS = amount × section rate (if above threshold)", steps: steps(t, "Tool_tds_Step_1", "Tool_tds_Step_2", "Tool_tds_Step_3", "Tool_tds_Step_4") },
  ]);

export const atalPensionInfo = (t: T) =>
  baseInfo(t, "Tool_atal_pension", ["Tool_atal_pension_Info_Goal_1", "Tool_atal_pension_Info_Goal_2", "Tool_atal_pension_Info_Goal_3"], ["Nps", "Epf", "Scss"], ["Nps"], [
    { title: t("Tool_atal_pension_FormulaTitle"), code: "Contribution from APY age × pension chart", steps: steps(t, "Tool_atal_pension_Step_1", "Tool_atal_pension_Step_2", "Tool_atal_pension_Step_3", "Tool_atal_pension_Step_4") },
  ]);

export const goldLoanInfo = (t: T) =>
  baseInfo(t, "Tool_gold_loan", ["Tool_gold_loan_Info_Goal_1", "Tool_gold_loan_Info_Goal_2", "Tool_gold_loan_Info_Goal_3"], ["Emi", "Home", "Car"], ["Rbi"], [
    { title: t("Tool_gold_loan_FormulaTitle"), code: "Max loan = gold value × LTV → EMI", steps: steps(t, "Tool_gold_loan_Step_1", "Tool_gold_loan_Step_2", "Tool_gold_loan_Step_3", "Tool_gold_loan_Step_4") },
  ]);

export const capitalGainsTaxInfo = (t: T) =>
  baseInfo(t, "Tool_capital_gains_tax", ["Tool_capital_gains_tax_Info_Goal_1", "Tool_capital_gains_tax_Info_Goal_2", "Tool_capital_gains_tax_Info_Goal_3"], ["Tax", "80c", "Fd"], ["ItDept"], [
    { title: t("Tool_capital_gains_tax_FormulaTitle"), code: "Gain = Sell − Buy; LTCG/STCG by asset & holding", steps: steps(t, "Tool_capital_gains_tax_Step_1", "Tool_capital_gains_tax_Step_2", "Tool_capital_gains_tax_Step_3", "Tool_capital_gains_tax_Step_4") },
  ]);

export const section80cInfo = (t: T) =>
  baseInfo(t, "Tool_section_80c", ["Tool_section_80c_Info_Goal_1", "Tool_section_80c_Info_Goal_2", "Tool_section_80c_Info_Goal_3"], ["Elss", "Ppf", "Tax"], ["ItDept"], [
    { title: t("Tool_section_80c_FormulaTitle"), code: "Eligible = min(Σ 80C, ₹1.5L); saving ≈ Eligible × slab", steps: steps(t, "Tool_section_80c_Step_1", "Tool_section_80c_Step_2", "Tool_section_80c_Step_3", "Tool_section_80c_Step_4") },
  ]);

export const personalLoanEmiInfo = (t: T) =>
  baseInfo(t, "Tool_personal_loan_emi", ["Tool_personal_loan_emi_Info_Goal_1", "Tool_personal_loan_emi_Info_Goal_2", "Tool_personal_loan_emi_Info_Goal_3"], ["Emi", "Home", "Car"], ["Rbi"], [
    { title: t("Tool_personal_loan_emi_FormulaTitle"), code: "EMI standard reducing-balance\nEffective cost ≈ EMI×n + processing fee", steps: steps(t, "Tool_personal_loan_emi_Step_1", "Tool_personal_loan_emi_Step_2", "Tool_personal_loan_emi_Step_3", "Tool_personal_loan_emi_Step_4") },
  ]);

export const businessLoanEmiInfo = (t: T) =>
  baseInfo(t, "Tool_business_loan_emi", ["Tool_business_loan_emi_Info_Goal_1", "Tool_business_loan_emi_Info_Goal_2", "Tool_business_loan_emi_Info_Goal_3"], ["Emi", "Home", "Gold"], ["Rbi"], [
    { title: t("Tool_business_loan_emi_FormulaTitle"), code: "Capitalise moratorium interest → EMI", steps: steps(t, "Tool_business_loan_emi_Step_1", "Tool_business_loan_emi_Step_2", "Tool_business_loan_emi_Step_3", "Tool_business_loan_emi_Step_4") },
  ]);

export const mutualFundReturnsInfo = (t: T) =>
  baseInfo(t, "Tool_mutual_fund_returns", ["Tool_mutual_fund_returns_Info_Goal_1", "Tool_mutual_fund_returns_Info_Goal_2", "Tool_mutual_fund_returns_Info_Goal_3"], ["Sip", "Lumpsum", "Elss"], ["Sebi", "Amfi"], [
    { title: t("Tool_mutual_fund_returns_FormulaTitle"), code: "Lumpsum FV or SIP FV at assumed CAGR", steps: steps(t, "Tool_mutual_fund_returns_Step_1", "Tool_mutual_fund_returns_Step_2", "Tool_mutual_fund_returns_Step_3", "Tool_mutual_fund_returns_Step_4") },
  ]);

export const postOfficeMisInfo = (t: T) =>
  baseInfo(t, "Tool_post_office_mis", ["Tool_post_office_mis_Info_Goal_1", "Tool_post_office_mis_Info_Goal_2", "Tool_post_office_mis_Info_Goal_3"], ["Scss", "Fd", "Ppf"], ["Nsi"], [
    { title: t("Tool_post_office_mis_FormulaTitle"), code: "Monthly interest = Deposit × rate / 12", steps: steps(t, "Tool_post_office_mis_Step_1", "Tool_post_office_mis_Step_2", "Tool_post_office_mis_Step_3", "Tool_post_office_mis_Step_4") },
  ]);

export const flatVsReducingRateInfo = (t: T) =>
  baseInfo(t, "Tool_flat_vs_reducing_rate", ["Tool_flat_vs_reducing_rate_Info_Goal_1", "Tool_flat_vs_reducing_rate_Info_Goal_2", "Tool_flat_vs_reducing_rate_Info_Goal_3"], ["Emi", "Car", "Home"], ["Rbi"], [
    { title: t("Tool_flat_vs_reducing_rate_FormulaTitle"), code: "Flat: TI = P×r×y; EMI = (P+TI)/n\nReducing: standard EMI", steps: steps(t, "Tool_flat_vs_reducing_rate_Step_1", "Tool_flat_vs_reducing_rate_Step_2", "Tool_flat_vs_reducing_rate_Step_3", "Tool_flat_vs_reducing_rate_Step_4") },
  ]);

export const simpleInterestInfo = (t: T) =>
  baseInfo(t, "Tool_simple_interest", ["Tool_simple_interest_Info_Goal_1", "Tool_simple_interest_Info_Goal_2", "Tool_simple_interest_Info_Goal_3"], ["Interest", "Fd", "Emi"], ["Rbi"], [
    { title: t("Tool_simple_interest_FormulaTitle"), code: "SI = P × R × T / 100\nAmount = P + SI", steps: steps(t, "Tool_simple_interest_Step_1", "Tool_simple_interest_Step_2", "Tool_simple_interest_Step_3", "Tool_simple_interest_Step_4") },
  ]);

export const leaveEncashmentInfo = (t: T) =>
  baseInfo(t, "Tool_leave_encashment", ["Tool_leave_encashment_Info_Goal_1", "Tool_leave_encashment_Info_Goal_2", "Tool_leave_encashment_Info_Goal_3"], ["Salary", "Gratuity", "Tax"], ["ItDept"], [
    { title: t("Tool_leave_encashment_FormulaTitle"), code: "Amount = (Basic+DA)/30 × days\nTaxable = max(0, Amount − exemption)", steps: steps(t, "Tool_leave_encashment_Step_1", "Tool_leave_encashment_Step_2", "Tool_leave_encashment_Step_3", "Tool_leave_encashment_Step_4") },
  ]);

export const daInfo = (t: T) =>
  baseInfo(t, "Tool_da", ["Tool_da_Info_Goal_1", "Tool_da_Info_Goal_2", "Tool_da_Info_Goal_3"], ["Salary", "Hra", "Gratuity"], ["ItDept"], [
    { title: t("Tool_da_FormulaTitle"), code: "DA = Basic × DA% / 100\nTotal = Basic + DA", steps: steps(t, "Tool_da_Step_1", "Tool_da_Step_2", "Tool_da_Step_3", "Tool_da_Step_4") },
  ]);

export const advanceTaxInfo = (t: T) =>
  baseInfo(t, "Tool_advance_tax", ["Tool_advance_tax_Info_Goal_1", "Tool_advance_tax_Info_Goal_2", "Tool_advance_tax_Info_Goal_3"], ["Tax", "Tds", "Salary"], ["ItDept"], [
    { title: t("Tool_advance_tax_FormulaTitle"), code: "Jun 15% · Sep 45% · Dec 75% · Mar 100%\nShortfall = required − paid", steps: steps(t, "Tool_advance_tax_Step_1", "Tool_advance_tax_Step_2", "Tool_advance_tax_Step_3", "Tool_advance_tax_Step_4") },
  ]);

export const loanAgainstPropertyInfo = (t: T) =>
  baseInfo(t, "Tool_loan_against_property", ["Tool_loan_against_property_Info_Goal_1", "Tool_loan_against_property_Info_Goal_2", "Tool_loan_against_property_Info_Goal_3"], ["Gold", "Home", "Personal"], ["Rbi"], [
    { title: t("Tool_loan_against_property_FormulaTitle"), code: "Max loan = Property × LTV → EMI", steps: steps(t, "Tool_loan_against_property_Step_1", "Tool_loan_against_property_Step_2", "Tool_loan_against_property_Step_3", "Tool_loan_against_property_Step_4") },
  ]);

export const twoWheelerLoanInfo = (t: T) =>
  baseInfo(t, "Tool_two_wheeler_loan", ["Tool_two_wheeler_loan_Info_Goal_1", "Tool_two_wheeler_loan_Info_Goal_2", "Tool_two_wheeler_loan_Info_Goal_3"], ["Car", "Emi", "Personal"], ["Rbi"], [
    { title: t("Tool_two_wheeler_loan_FormulaTitle"), code: "Loan = On-road − Down → EMI", steps: steps(t, "Tool_two_wheeler_loan_Step_1", "Tool_two_wheeler_loan_Step_2", "Tool_two_wheeler_loan_Step_3", "Tool_two_wheeler_loan_Step_4") },
  ]);

export const homeLoanEligibilityInfo = (t: T) =>
  baseInfo(t, "Tool_home_loan_eligibility", ["Tool_home_loan_eligibility_Info_Goal_1", "Tool_home_loan_eligibility_Info_Goal_2", "Tool_home_loan_eligibility_Info_Goal_3"], ["Home", "Emi", "Salary"], ["Rbi"], [
    { title: t("Tool_home_loan_eligibility_FormulaTitle"), code: "Eligible EMI = Income × FOIR − Existing\nP from reverse EMI", steps: steps(t, "Tool_home_loan_eligibility_Step_1", "Tool_home_loan_eligibility_Step_2", "Tool_home_loan_eligibility_Step_3", "Tool_home_loan_eligibility_Step_4") },
  ]);

export const retirementInfo = (t: T) =>
  baseInfo(t, "Tool_retirement", ["Tool_retirement_Info_Goal_1", "Tool_retirement_Info_Goal_2", "Tool_retirement_Info_Goal_3"], ["Fire", "Nps", "Epf"], ["Sebi", "Nps"], [
    { title: t("Tool_retirement_FormulaTitle"), code: "futureMonthly = expense × (1+inf)^years\ncorpus = futureMonthly × 12 × multiplier\nSIP = sipRequired(gap, return, months)", steps: steps(t, "Tool_retirement_Step_1", "Tool_retirement_Step_2", "Tool_retirement_Step_3", "Tool_retirement_Step_4") },
  ]);

export const emergencyFundInfo = (t: T) =>
  baseInfo(t, "Tool_emergency_fund", ["Tool_emergency_fund_Info_Goal_1", "Tool_emergency_fund_Info_Goal_2", "Tool_emergency_fund_Info_Goal_3"], ["Goal", "Fd", "Sip"], ["Rbi"], [
    { title: t("Tool_emergency_fund_FormulaTitle"), code: "target = expense × months\nmonthsToReach = ceil(gap ÷ monthlySavings)", steps: steps(t, "Tool_emergency_fund_Step_1", "Tool_emergency_fund_Step_2", "Tool_emergency_fund_Step_3", "Tool_emergency_fund_Step_4") },
  ]);

export const salaryHikeInfo = (t: T) =>
  baseInfo(t, "Tool_salary_hike", ["Tool_salary_hike_Info_Goal_1", "Tool_salary_hike_Info_Goal_2", "Tool_salary_hike_Info_Goal_3"], ["Salary", "Tax", "Hra"], ["ItDept"], [
    { title: t("Tool_salary_hike_FormulaTitle"), code: "newCTC = current × (1 + hike%/100)\nmonthlyIncrease = (new − current) / 12", steps: steps(t, "Tool_salary_hike_Step_1", "Tool_salary_hike_Step_2", "Tool_salary_hike_Step_3", "Tool_salary_hike_Step_4") },
  ]);

export const section80dInfo = (t: T) =>
  baseInfo(t, "Tool_section_80d", ["Tool_section_80d_Info_Goal_1", "Tool_section_80d_Info_Goal_2", "Tool_section_80d_Info_Goal_3"], ["80c", "Hra", "Tax"], ["ItDept"], [
    { title: t("Tool_section_80d_FormulaTitle"), code: "Self ≤ ₹25k/₹50k · Parents ≤ ₹25k/₹50k\nPreventive ≤ ₹5k inside self · Saving ≈ Eligible × slab", steps: steps(t, "Tool_section_80d_Step_1", "Tool_section_80d_Step_2", "Tool_section_80d_Step_3", "Tool_section_80d_Step_4") },
  ]);

export const nscInfo = (t: T) =>
  baseInfo(t, "Tool_nsc", ["Tool_nsc_Info_Goal_1", "Tool_nsc_Info_Goal_2", "Tool_nsc_Info_Goal_3"], ["Ppf", "Fd", "80c"], ["Nsi"], [
    { title: t("Tool_nsc_FormulaTitle"), code: "Maturity = P × (1 + r)^5\nInterest reinvested annually", steps: steps(t, "Tool_nsc_Step_1", "Tool_nsc_Step_2", "Tool_nsc_Step_3", "Tool_nsc_Step_4") },
  ]);

export const taxSavingFdInfo = (t: T) =>
  baseInfo(t, "Tool_tax_saving_fd", ["Tool_tax_saving_fd_Info_Goal_1", "Tool_tax_saving_fd_Info_Goal_2", "Tool_tax_saving_fd_Info_Goal_3"], ["Ppf", "Elss", "Fd"], ["Rbi", "Dicgc"], [
    { title: t("Tool_tax_saving_fd_FormulaTitle"), code: "A = P × (1 + r/n)^(n×5)\n80C = min(P, ₹1.5L) × slab", steps: steps(t, "Tool_tax_saving_fd_Step_1", "Tool_tax_saving_fd_Step_2", "Tool_tax_saving_fd_Step_3", "Tool_tax_saving_fd_Step_4") },
  ]);

export const healthInsuranceInfo = (t: T) =>
  baseInfo(t, "Tool_health_insurance", ["Tool_health_insurance_Info_Goal_1", "Tool_health_insurance_Info_Goal_2", "Tool_health_insurance_Info_Goal_3"], ["80d", "Emergency", "Tax"], ["ItDept"], [
    { title: t("Tool_health_insurance_FormulaTitle"), code: "suggested = ₹5L + ₹2L×members + age + city\ngap = max(0, suggested − current)", steps: steps(t, "Tool_health_insurance_Step_1", "Tool_health_insurance_Step_2", "Tool_health_insurance_Step_3", "Tool_health_insurance_Step_4") },
  ]);

export const rentReceiptInfo = (t: T) =>
  baseInfo(t, "Tool_rent_receipt", ["Tool_rent_receipt_Info_Goal_1", "Tool_rent_receipt_Info_Goal_2", "Tool_rent_receipt_Info_Goal_3"], ["Hra", "Salary", "Tax"], ["ItDept"], [
    { title: t("Tool_rent_receipt_FormulaTitle"), code: "totalRent = monthlyRent × months", steps: steps(t, "Tool_rent_receipt_Step_1", "Tool_rent_receipt_Step_2", "Tool_rent_receipt_Step_3", "Tool_rent_receipt_Step_4") },
  ]);

export const homeLoanPrepaymentInfo = (t: T) =>
  baseInfo(t, "Tool_home_loan_prepayment", ["Tool_home_loan_prepayment_Info_Goal_1", "Tool_home_loan_prepayment_Info_Goal_2", "Tool_home_loan_prepayment_Info_Goal_3"], ["Emi", "Home", "Personal"], ["Rbi"], [
    { title: t("Tool_home_loan_prepayment_FormulaTitle"), code: "EMI = P × r × (1+r)^n / ((1+r)^n − 1)\nReduce EMI vs reduce tenure after prepay", steps: steps(t, "Tool_home_loan_prepayment_Step_1", "Tool_home_loan_prepayment_Step_2", "Tool_home_loan_prepayment_Step_3", "Tool_home_loan_prepayment_Step_4") },
  ]);

export const cryptoTaxInfo = (t: T) =>
  baseInfo(t, "Tool_crypto_tax", ["Tool_crypto_tax_Info_Goal_1", "Tool_crypto_tax_Info_Goal_2", "Tool_crypto_tax_Info_Goal_3"], ["Tax", "Tds", "Fd"], ["ItDept"], [
    { title: t("Tool_crypto_tax_FormulaTitle"), code: "Gain = Sell − Buy; Tax = max(0,Gain)×30%; TDS ≈ 1% of Sell", steps: steps(t, "Tool_crypto_tax_Step_1", "Tool_crypto_tax_Step_2", "Tool_crypto_tax_Step_3", "Tool_crypto_tax_Step_4") },
  ]);

export const dividendYieldInfo = (t: T) =>
  baseInfo(t, "Tool_dividend_yield", ["Tool_dividend_yield_Info_Goal_1", "Tool_dividend_yield_Info_Goal_2", "Tool_dividend_yield_Info_Goal_3"], ["Tax", "Sip", "Fd"], ["Sebi", "ItDept"], [
    { title: t("Tool_dividend_yield_FormulaTitle"), code: "Yield % = Annual dividend ÷ Price (or Total ÷ Investment)", steps: steps(t, "Tool_dividend_yield_Step_1", "Tool_dividend_yield_Step_2", "Tool_dividend_yield_Step_3", "Tool_dividend_yield_Step_4") },
  ]);

export const brokerageInfo = (t: T) =>
  baseInfo(t, "Tool_brokerage", ["Tool_brokerage_Info_Goal_1", "Tool_brokerage_Info_Goal_2", "Tool_brokerage_Info_Goal_3"], ["Tax", "Emi", "Sip"], ["Sebi"], [
    { title: t("Tool_brokerage_FormulaTitle"), code: "Charges = Brokerage + STT + Exchange + GST; Net = Trade − Charges", steps: steps(t, "Tool_brokerage_Step_1", "Tool_brokerage_Step_2", "Tool_brokerage_Step_3", "Tool_brokerage_Step_4") },
  ]);

export const goalSipInfo = (t: T) =>
  baseInfo(t, "Tool_goal_sip", ["Tool_goal_sip_Info_Goal_1", "Tool_goal_sip_Info_Goal_2", "Tool_goal_sip_Info_Goal_3"], ["Sip", "Goal", "Lumpsum"], ["Sebi", "Amfi"], [
    { title: t("Tool_goal_sip_FormulaTitle"), code: "SIP = target × r / ((1+r)^months − 1)", steps: steps(t, "Tool_goal_sip_Step_1", "Tool_goal_sip_Step_2", "Tool_goal_sip_Step_3", "Tool_goal_sip_Step_4") },
  ]);

export const stpInfo = (t: T) =>
  baseInfo(t, "Tool_stp", ["Tool_stp_Info_Goal_1", "Tool_stp_Info_Goal_2", "Tool_stp_Info_Goal_3"], ["Sip", "Swp", "Lumpsum"], ["Sebi", "Amfi"], [
    { title: t("Tool_stp_FormulaTitle"), code: "each month: grow debt & equity; transfer STP → equity", steps: steps(t, "Tool_stp_Step_1", "Tool_stp_Step_2", "Tool_stp_Step_3", "Tool_stp_Step_4") },
  ]);

export const goldInvestmentInfo = (t: T) =>
  baseInfo(t, "Tool_gold_investment", ["Tool_gold_investment_Info_Goal_1", "Tool_gold_investment_Info_Goal_2", "Tool_gold_investment_Info_Goal_3"], ["Sip", "Fd", "Elss"], ["Sebi", "Rbi"], [
    { title: t("Tool_gold_investment_FormulaTitle"), code: "Digital FV vs physical FV after making charges", steps: steps(t, "Tool_gold_investment_Step_1", "Tool_gold_investment_Step_2", "Tool_gold_investment_Step_3", "Tool_gold_investment_Step_4") },
  ]);

export const tcsInfo = (t: T) =>
  baseInfo(t, "Tool_tcs", ["Tool_tcs_Info_Goal_1", "Tool_tcs_Info_Goal_2", "Tool_tcs_Info_Goal_3"], ["Tds", "Tax", "Fd"], ["ItDept"], [
    { title: t("Tool_tcs_FormulaTitle"), code: "TCS = amount × nature rate (LRS 5%/20%; goods 0.1% above ₹50L)", steps: steps(t, "Tool_tcs_Step_1", "Tool_tcs_Step_2", "Tool_tcs_Step_3", "Tool_tcs_Step_4") },
  ]);

export const tdsOnPropertyInfo = (t: T) =>
  baseInfo(t, "Tool_tds_on_property", ["Tool_tds_on_property_Info_Goal_1", "Tool_tds_on_property_Info_Goal_2", "Tool_tds_on_property_Info_Goal_3"], ["Tds", "Tax", "Home"], ["ItDept"], [
    { title: t("Tool_tds_on_property_FormulaTitle"), code: "If consideration > ₹50L → TDS = consideration × 1%", steps: steps(t, "Tool_tds_on_property_Step_1", "Tool_tds_on_property_Step_2", "Tool_tds_on_property_Step_3", "Tool_tds_on_property_Step_4") },
  ]);

export const tdsOnRentInfo = (t: T) =>
  baseInfo(t, "Tool_tds_on_rent", ["Tool_tds_on_rent_Info_Goal_1", "Tool_tds_on_rent_Info_Goal_2", "Tool_tds_on_rent_Info_Goal_3"], ["Tds", "Tax", "Hra"], ["ItDept"], [
    { title: t("Tool_tds_on_rent_FormulaTitle"), code: "If monthly rent > ₹50k → TDS = rent × 2%; annualise ×12; Form 26QC", steps: steps(t, "Tool_tds_on_rent_Step_1", "Tool_tds_on_rent_Step_2", "Tool_tds_on_rent_Step_3", "Tool_tds_on_rent_Step_4") },
  ]);

export const creditCardEmiInfo = (t: T) =>
  baseInfo(t, "Tool_credit_card_emi", ["Tool_credit_card_emi_Info_Goal_1", "Tool_credit_card_emi_Info_Goal_2", "Tool_credit_card_emi_Info_Goal_3"], ["Flat", "Emi", "Personal"], ["Rbi"], [
    { title: t("Tool_credit_card_emi_FormulaTitle"), code: "EMI = P × r × (1+r)^n / ((1+r)^n − 1)\nFlat interest = P × rate × years", steps: steps(t, "Tool_credit_card_emi_Step_1", "Tool_credit_card_emi_Step_2", "Tool_credit_card_emi_Step_3", "Tool_credit_card_emi_Step_4") },
  ]);

export const emiToRateInfo = (t: T) =>
  baseInfo(t, "Tool_emi_to_rate", ["Tool_emi_to_rate_Info_Goal_1", "Tool_emi_to_rate_Info_Goal_2", "Tool_emi_to_rate_Info_Goal_3"], ["Emi", "Flat", "Cc"], ["Rbi"], [
    { title: t("Tool_emi_to_rate_FormulaTitle"), code: "Solve annual rate r so EMI(P, r, n) matches your EMI", steps: steps(t, "Tool_emi_to_rate_Step_1", "Tool_emi_to_rate_Step_2", "Tool_emi_to_rate_Step_3", "Tool_emi_to_rate_Step_4") },
  ]);

export const loanBalanceTransferInfo = (t: T) =>
  baseInfo(t, "Tool_loan_balance_transfer", ["Tool_loan_balance_transfer_Info_Goal_1", "Tool_loan_balance_transfer_Info_Goal_2", "Tool_loan_balance_transfer_Info_Goal_3"], ["Prepay", "Home", "Emi"], ["Rbi"], [
    { title: t("Tool_loan_balance_transfer_FormulaTitle"), code: "Net save = (I_old − I_new) − Fee\nBreak-even ≈ Fee / (EMI_old − EMI_new)", steps: steps(t, "Tool_loan_balance_transfer_Step_1", "Tool_loan_balance_transfer_Step_2", "Tool_loan_balance_transfer_Step_3", "Tool_loan_balance_transfer_Step_4") },
  ]);

export const ageInfo = (t: T) =>
  baseInfo(t, "Tool_age", ["Tool_age_Info_Goal_1", "Tool_age_Info_Goal_2", "Tool_age_Info_Goal_3"], ["Sip", "Goal", "Tax"], ["ItDept"], [
    { title: t("Tool_age_FormulaTitle"), code: "years, months, days = calendar diff(from → to)", steps: steps(t, "Tool_age_Step_1", "Tool_age_Step_2", "Tool_age_Step_3", "Tool_age_Step_4") },
  ]);

export const forexInfo = (t: T) =>
  baseInfo(t, "Tool_forex", ["Tool_forex_Info_Goal_1", "Tool_forex_Info_Goal_2", "Tool_forex_Info_Goal_3"], ["Tcs", "Tax", "Fd"], ["Rbi"], [
    { title: t("Tool_forex_FormulaTitle"), code: "converted = amount × rate\nnet = converted − fee%", steps: steps(t, "Tool_forex_Step_1", "Tool_forex_Step_2", "Tool_forex_Step_3", "Tool_forex_Step_4") },
  ]);

export const monthlyBudgetInfo = (t: T) =>
  baseInfo(t, "Tool_monthly_budget", ["Tool_monthly_budget_Info_Goal_1", "Tool_monthly_budget_Info_Goal_2", "Tool_monthly_budget_Info_Goal_3"], ["Emergency", "Goal", "Sip"], ["Rbi"], [
    { title: t("Tool_monthly_budget_FormulaTitle"), code: "surplus = income − (needs + wants + savings)\n50/30/20 suggestion", steps: steps(t, "Tool_monthly_budget_Step_1", "Tool_monthly_budget_Step_2", "Tool_monthly_budget_Step_3", "Tool_monthly_budget_Step_4") },
  ]);

export const netWorthInfo = (t: T) =>
  baseInfo(t, "Tool_net_worth", ["Tool_net_worth_Info_Goal_1", "Tool_net_worth_Info_Goal_2", "Tool_net_worth_Info_Goal_3"], ["Emergency", "Goal", "Home"], ["Sebi"], [
    { title: t("Tool_net_worth_FormulaTitle"), code: "netWorth = assets − liabilities", steps: steps(t, "Tool_net_worth_Step_1", "Tool_net_worth_Step_2", "Tool_net_worth_Step_3", "Tool_net_worth_Step_4") },
  ]);

export const childEducationInfo = (t: T) =>
  baseInfo(t, "Tool_child_education", ["Tool_child_education_Info_Goal_1", "Tool_child_education_Info_Goal_2", "Tool_child_education_Info_Goal_3"], ["Sip", "Goal", "Edu"], ["Sebi", "Amfi"], [
    { title: t("Tool_child_education_FormulaTitle"), code: "future = cost × (1+inf)^years\nSIP = sipRequired(future, return, months)", steps: steps(t, "Tool_child_education_Step_1", "Tool_child_education_Step_2", "Tool_child_education_Step_3", "Tool_child_education_Step_4") },
  ]);

export const section80gInfo = (t: T) =>
  baseInfo(t, "Tool_80g_donation", ["Tool_80g_donation_Info_Goal_1", "Tool_80g_donation_Info_Goal_2", "Tool_80g_donation_Info_Goal_3"], ["80c", "Tax", "80d"], ["ItDept"], [
    { title: t("Tool_80g_donation_FormulaTitle"), code: "base = min(donation, 10% income) if limited\ndeduction = base × 50%/100%; saving ≈ deduction × slab", steps: steps(t, "Tool_80g_donation_Step_1", "Tool_80g_donation_Step_2", "Tool_80g_donation_Step_3", "Tool_80g_donation_Step_4") },
  ]);

export const costInflationIndexInfo = (t: T) =>
  baseInfo(t, "Tool_cost_inflation_index", ["Tool_cost_inflation_index_Info_Goal_1", "Tool_cost_inflation_index_Info_Goal_2", "Tool_cost_inflation_index_Info_Goal_3"], ["Cg", "Tax", "Property"], ["ItDept"], [
    { title: t("Tool_cost_inflation_index_FormulaTitle"), code: "Indexed cost = Cost × (CII_sell / CII_buy)", steps: steps(t, "Tool_cost_inflation_index_Step_1", "Tool_cost_inflation_index_Step_2", "Tool_cost_inflation_index_Step_3", "Tool_cost_inflation_index_Step_4") },
  ]);

export const kisanVikasPatraInfo = (t: T) =>
  baseInfo(t, "Tool_kisan_vikas_patra", ["Tool_kisan_vikas_patra_Info_Goal_1", "Tool_kisan_vikas_patra_Info_Goal_2", "Tool_kisan_vikas_patra_Info_Goal_3"], ["Ppf", "Nsc", "Fd"], ["Nsi"], [
    { title: t("Tool_kisan_vikas_patra_FormulaTitle"), code: "Maturity = 2 × P\nTenure ≈ 115 months at 7.5%", steps: steps(t, "Tool_kisan_vikas_patra_Step_1", "Tool_kisan_vikas_patra_Step_2", "Tool_kisan_vikas_patra_Step_3", "Tool_kisan_vikas_patra_Step_4") },
  ]);

export const mahilaSammanInfo = (t: T) =>
  baseInfo(t, "Tool_mahila_samman", ["Tool_mahila_samman_Info_Goal_1", "Tool_mahila_samman_Info_Goal_2", "Tool_mahila_samman_Info_Goal_3"], ["Fd", "Scss", "Ppf"], ["Nsi"], [
    { title: t("Tool_mahila_samman_FormulaTitle"), code: "Interest = Deposit × rate × 2 years\nMax ₹2 lakh", steps: steps(t, "Tool_mahila_samman_Step_1", "Tool_mahila_samman_Step_2", "Tool_mahila_samman_Step_3", "Tool_mahila_samman_Step_4") },
  ]);

export const annuityInfo = (t: T) =>
  baseInfo(t, "Tool_annuity", ["Tool_annuity_Info_Goal_1", "Tool_annuity_Info_Goal_2", "Tool_annuity_Info_Goal_3"], ["Nps", "Retirement", "Swp"], ["Sebi", "Nps"], [
    { title: t("Tool_annuity_FormulaTitle"), code: "Forever: monthly ≈ corpus × r / 12\nFinite: annuity PMT formula", steps: steps(t, "Tool_annuity_Step_1", "Tool_annuity_Step_2", "Tool_annuity_Step_3", "Tool_annuity_Step_4") },
  ]);

export const interestRateConverterInfo = (t: T) =>
  baseInfo(t, "Tool_interest_rate_converter", ["Tool_interest_rate_converter_Info_Goal_1", "Tool_interest_rate_converter_Info_Goal_2", "Tool_interest_rate_converter_Info_Goal_3"], ["Emi", "Flat", "Fd"], ["Rbi"], [
    { title: t("Tool_interest_rate_converter_FormulaTitle"), code: "EAR = (1 + r/n)^n − 1\nMonthly = annual / 12", steps: steps(t, "Tool_interest_rate_converter_Step_1", "Tool_interest_rate_converter_Step_2", "Tool_interest_rate_converter_Step_3", "Tool_interest_rate_converter_Step_4") },
  ]);

export const ltaInfo = (t: T) =>
  baseInfo(t, "Tool_lta", ["Tool_lta_Info_Goal_1", "Tool_lta_Info_Goal_2", "Tool_lta_Info_Goal_3"], ["Hra", "Salary", "Tax"], ["ItDept"], [
    { title: t("Tool_lta_FormulaTitle"), code: "Exempt = min(claimed, limit)\nTaxable = max(0, claimed − exempt)", steps: steps(t, "Tool_lta_Step_1", "Tool_lta_Step_2", "Tool_lta_Step_3", "Tool_lta_Step_4") },
  ]);

export const carInsuranceInfo = (t: T) =>
  baseInfo(t, "Tool_car_insurance", ["Tool_car_insurance_Info_Goal_1", "Tool_car_insurance_Info_Goal_2", "Tool_car_insurance_Info_Goal_3"], ["Health", "Car", "Emi"], ["Rbi"], [
    { title: t("Tool_car_insurance_FormulaTitle"), code: "OD = IDV × rate%\nTotal ≈ OD + TP", steps: steps(t, "Tool_car_insurance_Step_1", "Tool_car_insurance_Step_2", "Tool_car_insurance_Step_3", "Tool_car_insurance_Step_4") },
  ]);

export const rentAgreementInfo = (t: T) =>
  baseInfo(t, "Tool_rent_agreement", ["Tool_rent_agreement_Info_Goal_1", "Tool_rent_agreement_Info_Goal_2", "Tool_rent_agreement_Info_Goal_3"], ["Stamp", "Hra", "Rent"], ["Rbi"], [
    { title: t("Tool_rent_agreement_FormulaTitle"), code: "Total rent = rent × months\nStamp ≈ total × stamp%\nUpfront ≈ costs + deposit", steps: steps(t, "Tool_rent_agreement_Step_1", "Tool_rent_agreement_Step_2", "Tool_rent_agreement_Step_3", "Tool_rent_agreement_Step_4") },
  ]);

export const indiaCompoundInterestInfo = (t: T) =>
  baseInfo(t, "Tool_compound_interest", ["Tool_compound_interest_Info_Goal_1", "Tool_compound_interest_Info_Goal_2", "Tool_compound_interest_Info_Goal_3"], ["Fd", "Sip", "Si"], ["Rbi"], [
    { title: t("Tool_compound_interest_FormulaTitle"), code: "A = P × (1 + r/n)^(n×t)", steps: steps(t, "Tool_compound_interest_Step_1", "Tool_compound_interest_Step_2", "Tool_compound_interest_Step_3", "Tool_compound_interest_Step_4") },
  ]);

export const ppfWithdrawalInfo = (t: T) =>
  baseInfo(t, "Tool_ppf_withdrawal", ["Tool_ppf_withdrawal_Info_Goal_1", "Tool_ppf_withdrawal_Info_Goal_2", "Tool_ppf_withdrawal_Info_Goal_3"], ["Ppf", "Epf", "Fd"], ["Nsi"], [
    { title: t("Tool_ppf_withdrawal_FormulaTitle"), code: "Loan Y3–6 ≈ 25%\nPartial Y7+ ≈ 50%", steps: steps(t, "Tool_ppf_withdrawal_Step_1", "Tool_ppf_withdrawal_Step_2", "Tool_ppf_withdrawal_Step_3", "Tool_ppf_withdrawal_Step_4") },
  ]);

export const mfOverlapInfo = (t: T) =>
  baseInfo(t, "Tool_mf_overlap", ["Tool_mf_overlap_Info_Goal_1", "Tool_mf_overlap_Info_Goal_2", "Tool_mf_overlap_Info_Goal_3"], ["Mf", "Sip", "Elss"], ["Sebi", "Amfi"], [
    { title: t("Tool_mf_overlap_FormulaTitle"), code: "Count: shared/union\nWeighted: Σ min(wA,wB)", steps: steps(t, "Tool_mf_overlap_Step_1", "Tool_mf_overlap_Step_2", "Tool_mf_overlap_Step_3", "Tool_mf_overlap_Step_4") },
  ]);

export const panAadhaarLinkInfo = (t: T) =>
  baseInfo(t, "Tool_pan_aadhaar_link", ["Tool_pan_aadhaar_link_Info_Goal_1", "Tool_pan_aadhaar_link_Info_Goal_2", "Tool_pan_aadhaar_link_Info_Goal_3"], ["Tax", "Tds", "Age"], ["ItDept"], [
    { title: t("Tool_pan_aadhaar_link_FormulaTitle"), code: "Illustrative fee ₹500 / ₹1,000\n(Not a live status check)", steps: steps(t, "Tool_pan_aadhaar_link_Step_1", "Tool_pan_aadhaar_link_Step_2", "Tool_pan_aadhaar_link_Step_3", "Tool_pan_aadhaar_link_Step_4") },
  ]);

export const rentalIncomeTaxInfo = (t: T) =>
  baseInfo(t, "Tool_rental_income_tax", ["Tool_rental_income_tax_Info_Goal_1", "Tool_rental_income_tax_Info_Goal_2", "Tool_rental_income_tax_Info_Goal_3"], ["Hra", "Tax", "Rent"], ["ItDept"], [
    { title: t("Tool_rental_income_tax_FormulaTitle"), code: "NAV = Rent − Municipal\nTaxable = NAV − 30%\nTax ≈ Taxable × slab", steps: steps(t, "Tool_rental_income_tax_Step_1", "Tool_rental_income_tax_Step_2", "Tool_rental_income_tax_Step_3", "Tool_rental_income_tax_Step_4") },
  ]);

export const epfWithdrawalInfo = (t: T) =>
  baseInfo(t, "Tool_epf_withdrawal", ["Tool_epf_withdrawal_Info_Goal_1", "Tool_epf_withdrawal_Info_Goal_2", "Tool_epf_withdrawal_Info_Goal_3"], ["Epf", "Tax", "Nps"], ["ItDept"], [
    { title: t("Tool_epf_withdrawal_FormulaTitle"), code: "≥ 5 yrs → tax-free\n< 5 yrs → interest taxable\nTax ≈ taxable × slab", steps: steps(t, "Tool_epf_withdrawal_Step_1", "Tool_epf_withdrawal_Step_2", "Tool_epf_withdrawal_Step_3", "Tool_epf_withdrawal_Step_4") },
  ]);

export const xirrInfo = (t: T) =>
  baseInfo(t, "Tool_xirr", ["Tool_xirr_Info_Goal_1", "Tool_xirr_Info_Goal_2", "Tool_xirr_Info_Goal_3"], ["Cagr", "Sip", "Mf"], ["Sebi", "Amfi"], [
    { title: t("Tool_xirr_FormulaTitle"), code: "Σ CFᵢ / (1+r)^(tᵢ) = 0\nNewton–Raphson for r", steps: steps(t, "Tool_xirr_Step_1", "Tool_xirr_Step_2", "Tool_xirr_Step_3", "Tool_xirr_Step_4") },
  ]);

export const electricityBillInfo = (t: T) =>
  baseInfo(t, "Tool_electricity_bill", ["Tool_electricity_bill_Info_Goal_1", "Tool_electricity_bill_Info_Goal_2", "Tool_electricity_bill_Info_Goal_3"], ["Budget", "Inflation", "Goal"], ["Rbi"], [
    { title: t("Tool_electricity_bill_FormulaTitle"), code: "Bill = Σ (slab units × rate) + fixed", steps: steps(t, "Tool_electricity_bill_Step_1", "Tool_electricity_bill_Step_2", "Tool_electricity_bill_Step_3", "Tool_electricity_bill_Step_4") },
  ]);

export const freelancerTaxInfo = (t: T) =>
  baseInfo(t, "Tool_freelancer_tax", ["Tool_freelancer_tax_Info_Goal_1", "Tool_freelancer_tax_Info_Goal_2", "Tool_freelancer_tax_Info_Goal_3"], ["Tax", "Gst", "Tds"], ["ItDept"], [
    { title: t("Tool_freelancer_tax_FormulaTitle"), code: "Profit = Receipts − Expenses\n44ADA: 50% of receipts\nTax ≈ Taxable × slab", steps: steps(t, "Tool_freelancer_tax_Step_1", "Tool_freelancer_tax_Step_2", "Tool_freelancer_tax_Step_3", "Tool_freelancer_tax_Step_4") },
  ]);

export const giftTaxInfo = (t: T) =>
  baseInfo(t, "Tool_gift_tax", ["Tool_gift_tax_Info_Goal_1", "Tool_gift_tax_Info_Goal_2", "Tool_gift_tax_Info_Goal_3"], ["Tax", "Hra", "80c"], ["ItDept"], [
    { title: t("Tool_gift_tax_FormulaTitle"), code: "Relative → exempt\nNon-relative > ₹50k → taxable\nTax ≈ amount × slab", steps: steps(t, "Tool_gift_tax_Step_1", "Tool_gift_tax_Step_2", "Tool_gift_tax_Step_3", "Tool_gift_tax_Step_4") },
  ]);

export const nifty50ReturnsInfo = (t: T) =>
  baseInfo(t, "Tool_nifty_50_returns", ["Tool_nifty_50_returns_Info_Goal_1", "Tool_nifty_50_returns_Info_Goal_2", "Tool_nifty_50_returns_Info_Goal_3"], ["Sip", "Lumpsum", "Cagr"], ["Sebi", "Amfi"], [
    { title: t("Tool_nifty_50_returns_FormulaTitle"), code: "Lumpsum: FV = P × (1+CAGR)^years\nSIP: FV = SIP × ((1+r_m)^n − 1) / r_m", steps: steps(t, "Tool_nifty_50_returns_Step_1", "Tool_nifty_50_returns_Step_2", "Tool_nifty_50_returns_Step_3", "Tool_nifty_50_returns_Step_4") },
  ]);

export const realEstateInfo = (t: T) =>
  baseInfo(t, "Tool_real_estate", ["Tool_real_estate_Info_Goal_1", "Tool_real_estate_Info_Goal_2", "Tool_real_estate_Info_Goal_3"], ["Home", "Emi", "Rent"], ["Rbi"], [
    { title: t("Tool_real_estate_FormulaTitle"), code: "equity ≈ FV − loan balance\nrent = price × yield% × years", steps: steps(t, "Tool_real_estate_Step_1", "Tool_real_estate_Step_2", "Tool_real_estate_Step_3", "Tool_real_estate_Step_4") },
  ]);

export const licPremiumInfo = (t: T) =>
  baseInfo(t, "Tool_lic_premium", ["Tool_lic_premium_Info_Goal_1", "Tool_lic_premium_Info_Goal_2", "Tool_lic_premium_Info_Goal_3"], ["Health", "80c", "Tax"], ["ItDept"], [
    { title: t("Tool_lic_premium_FormulaTitle"), code: "annual ≈ (sumAssured / 1000) × ratePerThousand", steps: steps(t, "Tool_lic_premium_Step_1", "Tool_lic_premium_Step_2", "Tool_lic_premium_Step_3", "Tool_lic_premium_Step_4") },
  ]);

export const npsVsOpsInfo = (t: T) =>
  baseInfo(t, "Tool_nps_vs_ops", ["Tool_nps_vs_ops_Info_Goal_1", "Tool_nps_vs_ops_Info_Goal_2", "Tool_nps_vs_ops_Info_Goal_3"], ["Nps", "Epf", "Annuity"], ["Nps"], [
    { title: t("Tool_nps_vs_ops_FormulaTitle"), code: "OPS ≈ 50% × last pay\nNPS pension ≈ (40% corpus × annuity%) / 12", steps: steps(t, "Tool_nps_vs_ops_Step_1", "Tool_nps_vs_ops_Step_2", "Tool_nps_vs_ops_Step_3", "Tool_nps_vs_ops_Step_4") },
  ]);

export const marriageBudgetInfo = (t: T) =>
  baseInfo(t, "Tool_marriage_budget", ["Tool_marriage_budget_Info_Goal_1", "Tool_marriage_budget_Info_Goal_2", "Tool_marriage_budget_Info_Goal_3"], ["Budget", "Goal", "Sip"], ["Rbi"], [
    { title: t("Tool_marriage_budget_FormulaTitle"), code: "total = Σ expenses × (1 + contingency%)", steps: steps(t, "Tool_marriage_budget_Step_1", "Tool_marriage_budget_Step_2", "Tool_marriage_budget_Step_3", "Tool_marriage_budget_Step_4") },
  ]);

export const electricVehicleInfo = (t: T) =>
  baseInfo(t, "Tool_electric_vehicle", ["Tool_electric_vehicle_Info_Goal_1", "Tool_electric_vehicle_Info_Goal_2", "Tool_electric_vehicle_Info_Goal_3"], ["Car", "Budget", "Emi"], ["Rbi"], [
    { title: t("Tool_electric_vehicle_FormulaTitle"), code: "cost = ₹/km × km/month × 12 × years\npayback = Δprice / annual save", steps: steps(t, "Tool_electric_vehicle_Step_1", "Tool_electric_vehicle_Step_2", "Tool_electric_vehicle_Step_3", "Tool_electric_vehicle_Step_4") },
  ]);

export const ssyWithdrawalInfo = (t: T) =>
  baseInfo(t, "Tool_ssy_withdrawal", ["Tool_ssy_withdrawal_Info_Goal_1", "Tool_ssy_withdrawal_Info_Goal_2", "Tool_ssy_withdrawal_Info_Goal_3"], ["Ssy", "Ppf", "Fd"], ["Nsi"], [
    { title: t("Tool_ssy_withdrawal_FormulaTitle"), code: "Partial (edu/marriage, age≥18): ≈ 50%\nPremature (year≥2): full (illustrative)\nMaturity age 21: full", steps: steps(t, "Tool_ssy_withdrawal_Step_1", "Tool_ssy_withdrawal_Step_2", "Tool_ssy_withdrawal_Step_3", "Tool_ssy_withdrawal_Step_4") },
  ]);

export const salaryNegotiationInfo = (t: T) =>
  baseInfo(t, "Tool_salary_negotiation", ["Tool_salary_negotiation_Info_Goal_1", "Tool_salary_negotiation_Info_Goal_2", "Tool_salary_negotiation_Info_Goal_3"], ["Hike", "Salary", "Tax"], ["Rbi"], [
    { title: t("Tool_salary_negotiation_FormulaTitle"), code: "offerHike% = (offer − current) / current × 100\ncounter = current × (1 + desired%/100)", steps: steps(t, "Tool_salary_negotiation_Step_1", "Tool_salary_negotiation_Step_2", "Tool_salary_negotiation_Step_3", "Tool_salary_negotiation_Step_4") },
  ]);

export const maternityBenefitInfo = (t: T) =>
  baseInfo(t, "Tool_maternity_benefit", ["Tool_maternity_benefit_Info_Goal_1", "Tool_maternity_benefit_Info_Goal_2", "Tool_maternity_benefit_Info_Goal_3"], ["Leave", "Salary", "Gratuity"], ["Rbi"], [
    { title: t("Tool_maternity_benefit_FormulaTitle"), code: "Benefit = avg daily wage × leave days\nDefault = 26 weeks (182 days)", steps: steps(t, "Tool_maternity_benefit_Step_1", "Tool_maternity_benefit_Step_2", "Tool_maternity_benefit_Step_3", "Tool_maternity_benefit_Step_4") },
  ]);

export const postOfficeTdInfo = (t: T) =>
  baseInfo(t, "Tool_post_office_td", ["Tool_post_office_td_Info_Goal_1", "Tool_post_office_td_Info_Goal_2", "Tool_post_office_td_Info_Goal_3"], ["Fd", "Mis", "Nsc"], ["Nsi"], [
    { title: t("Tool_post_office_td_FormulaTitle"), code: "A = P × (1 + r/4)^(4×t)", steps: steps(t, "Tool_post_office_td_Step_1", "Tool_post_office_td_Step_2", "Tool_post_office_td_Step_3", "Tool_post_office_td_Step_4") },
  ]);

export const homeRenovationInfo = (t: T) =>
  baseInfo(t, "Tool_home_renovation", ["Tool_home_renovation_Info_Goal_1", "Tool_home_renovation_Info_Goal_2", "Tool_home_renovation_Info_Goal_3"], ["Home", "Emi", "Budget"], ["Rbi"], [
    { title: t("Tool_home_renovation_FormulaTitle"), code: "total = Σ categories × (1 + contingency%)\nEMI on loan amount", steps: steps(t, "Tool_home_renovation_Step_1", "Tool_home_renovation_Step_2", "Tool_home_renovation_Step_3", "Tool_home_renovation_Step_4") },
  ]);

export const section80ttaInfo = (t: T) =>
  baseInfo(t, "Tool_section_80tta", ["Tool_section_80tta_Info_Goal_1", "Tool_section_80tta_Info_Goal_2", "Tool_section_80tta_Info_Goal_3"], ["80c", "Tax", "Fd"], ["ItDept"], [
    { title: t("Tool_section_80tta_FormulaTitle"), code: "eligible = min(interest, limit)\nlimit = ₹10k (80TTA) or ₹50k (80TTB)\nsaving ≈ eligible × slab%", steps: steps(t, "Tool_section_80tta_Step_1", "Tool_section_80tta_Step_2", "Tool_section_80tta_Step_3", "Tool_section_80tta_Step_4") },
  ]);

export const presumptiveTaxInfo = (t: T) =>
  baseInfo(t, "Tool_presumptive_tax", ["Tool_presumptive_tax_Info_Goal_1", "Tool_presumptive_tax_Info_Goal_2", "Tool_presumptive_tax_Info_Goal_3"], ["Freelancer", "Tax", "Gst"], ["ItDept"], [
    { title: t("Tool_presumptive_tax_FormulaTitle"), code: "income = turnover × rate%\n44AD 6%/8% · 44ADA 50%\ntax ≈ income × slab%", steps: steps(t, "Tool_presumptive_tax_Step_1", "Tool_presumptive_tax_Step_2", "Tool_presumptive_tax_Step_3", "Tool_presumptive_tax_Step_4") },
  ]);

export const loanAgainstFdInfo = (t: T) =>
  baseInfo(t, "Tool_loan_against_fd", ["Tool_loan_against_fd_Info_Goal_1", "Tool_loan_against_fd_Info_Goal_2", "Tool_loan_against_fd_Info_Goal_3"], ["Fd", "Emi", "Gold"], ["Rbi"], [
    { title: t("Tool_loan_against_fd_FormulaTitle"), code: "maxLoan = FD × LTV%\nEMI on maxLoan", steps: steps(t, "Tool_loan_against_fd_Step_1", "Tool_loan_against_fd_Step_2", "Tool_loan_against_fd_Step_3", "Tool_loan_against_fd_Step_4") },
  ]);

export const daArrearsInfo = (t: T) =>
  baseInfo(t, "Tool_da_arrears", ["Tool_da_arrears_Info_Goal_1", "Tool_da_arrears_Info_Goal_2", "Tool_da_arrears_Info_Goal_3"], ["Da", "Salary", "Tax"], ["ItDept"], [
    { title: t("Tool_da_arrears_FormulaTitle"), code: "monthly = basic × (new% − old%)\ntotal = monthly × months", steps: steps(t, "Tool_da_arrears_Step_1", "Tool_da_arrears_Step_2", "Tool_da_arrears_Step_3", "Tool_da_arrears_Step_4") },
  ]);

export const floatingRateSavingsBondInfo = (t: T) =>
  baseInfo(t, "Tool_floating_rate_savings_bond", ["Tool_floating_rate_savings_bond_Info_Goal_1", "Tool_floating_rate_savings_bond_Info_Goal_2", "Tool_floating_rate_savings_bond_Info_Goal_3"], ["Scss", "Ppf", "Fd"], ["Rbi"], [
    { title: t("Tool_floating_rate_savings_bond_FormulaTitle"), code: "half-yearly = deposit × rate% / 2\ntotal = annual × years", steps: steps(t, "Tool_floating_rate_savings_bond_Step_1", "Tool_floating_rate_savings_bond_Step_2", "Tool_floating_rate_savings_bond_Step_3", "Tool_floating_rate_savings_bond_Step_4") },
  ]);

export const mutualFundTaxInfo = (t: T) =>
  baseInfo(t, "Tool_mutual_fund_tax", ["Tool_mutual_fund_tax_Info_Goal_1", "Tool_mutual_fund_tax_Info_Goal_2", "Tool_mutual_fund_tax_Info_Goal_3"], ["Cg", "Elss", "Sip"], ["Sebi", "ItDept"], [
    { title: t("Tool_mutual_fund_tax_FormulaTitle"), code: "gain = sell − buy\nequity STCG/LTCG · debt at slab", steps: steps(t, "Tool_mutual_fund_tax_Step_1", "Tool_mutual_fund_tax_Step_2", "Tool_mutual_fund_tax_Step_3", "Tool_mutual_fund_tax_Step_4") },
  ]);

export const incomeTaxRefundInfo = (t: T) =>
  baseInfo(t, "Tool_income_tax_refund", ["Tool_income_tax_refund_Info_Goal_1", "Tool_income_tax_refund_Info_Goal_2", "Tool_income_tax_refund_Info_Goal_3"], ["Tax", "Tds", "Advance"], ["ItDept"], [
    { title: t("Tool_income_tax_refund_FormulaTitle"), code: "paid = TDS + advance + SA\nrefund / due = paid − liability", steps: steps(t, "Tool_income_tax_refund_Step_1", "Tool_income_tax_refund_Step_2", "Tool_income_tax_refund_Step_3", "Tool_income_tax_refund_Step_4") },
  ]);

export const waterBillInfo = (t: T) =>
  baseInfo(t, "Tool_water_bill", ["Tool_water_bill_Info_Goal_1", "Tool_water_bill_Info_Goal_2", "Tool_water_bill_Info_Goal_3"], ["Budget", "Inflation", "Goal"], ["Rbi"], [
    { title: t("Tool_water_bill_FormulaTitle"), code: "Bill = Σ (slab kl × rate) + fixed", steps: steps(t, "Tool_water_bill_Step_1", "Tool_water_bill_Step_2", "Tool_water_bill_Step_3", "Tool_water_bill_Step_4") },
  ]);

export const savingsAccountInterestInfo = (t: T) =>
  baseInfo(t, "Tool_savings_account_interest", ["Tool_savings_account_interest_Info_Goal_1", "Tool_savings_account_interest_Info_Goal_2", "Tool_savings_account_interest_Info_Goal_3"], ["Fd", "Budget", "Tax"], ["Rbi", "ItDept"], [
    { title: t("Tool_savings_account_interest_FormulaTitle"), code: "Interest = Balance × Rate% × Days / 365\n80TTA ≤ ₹10,000", steps: steps(t, "Tool_savings_account_interest_Step_1", "Tool_savings_account_interest_Step_2", "Tool_savings_account_interest_Step_3", "Tool_savings_account_interest_Step_4") },
  ]);

export const sovereignGoldBondInfo = (t: T) =>
  baseInfo(t, "Tool_sovereign_gold_bond", ["Tool_sovereign_gold_bond_Info_Goal_1", "Tool_sovereign_gold_bond_Info_Goal_2", "Tool_sovereign_gold_bond_Info_Goal_3"], ["Gold", "Fd", "Tax"], ["Rbi", "Sebi"], [
    { title: t("Tool_sovereign_gold_bond_FormulaTitle"), code: "Interest = Invested × 2.5% × years\nGain = grams × (redeem − issue)", steps: steps(t, "Tool_sovereign_gold_bond_Step_1", "Tool_sovereign_gold_bond_Step_2", "Tool_sovereign_gold_bond_Step_3", "Tool_sovereign_gold_bond_Step_4") },
  ]);

export const seniorCitizenFdInfo = (t: T) =>
  baseInfo(t, "Tool_senior_citizen_fd", ["Tool_senior_citizen_fd_Info_Goal_1", "Tool_senior_citizen_fd_Info_Goal_2", "Tool_senior_citizen_fd_Info_Goal_3"], ["Fd", "Scss", "Tax"], ["Rbi", "Dicgc"], [
    { title: t("Tool_senior_citizen_fd_FormulaTitle"), code: "M = P × (1+r/n)^(n×t)\nTDS if interest > ₹50k", steps: steps(t, "Tool_senior_citizen_fd_Step_1", "Tool_senior_citizen_fd_Step_2", "Tool_senior_citizen_fd_Step_3", "Tool_senior_citizen_fd_Step_4") },
  ]);

export const termInsuranceInfo = (t: T) =>
  baseInfo(t, "Tool_term_insurance", ["Tool_term_insurance_Info_Goal_1", "Tool_term_insurance_Info_Goal_2", "Tool_term_insurance_Info_Goal_3"], ["Health", "Budget", "Goal"], ["Rbi"], [
    { title: t("Tool_term_insurance_FormulaTitle"), code: "need = income×years + liabilities\nor expenses×years + liabilities\ngap = need − existing", steps: steps(t, "Tool_term_insurance_Step_1", "Tool_term_insurance_Step_2", "Tool_term_insurance_Step_3", "Tool_term_insurance_Step_4") },
  ]);

export const nriTaxInfo = (t: T) =>
  baseInfo(t, "Tool_nri_tax", ["Tool_nri_tax_Info_Goal_1", "Tool_nri_tax_Info_Goal_2", "Tool_nri_tax_Info_Goal_3"], ["Tax", "Tds", "Forex"], ["ItDept"], [
    { title: t("Tool_nri_tax_FormulaTitle"), code: "Status → tax scope\nTax ≈ slab(India income) + 4% cess", steps: steps(t, "Tool_nri_tax_Step_1", "Tool_nri_tax_Step_2", "Tool_nri_tax_Step_3", "Tool_nri_tax_Step_4") },
  ]);

export const housePropertyIncomeInfo = (t: T) =>
  baseInfo(t, "Tool_house_property_income", ["Tool_house_property_income_Info_Goal_1", "Tool_house_property_income_Info_Goal_2", "Tool_house_property_income_Info_Goal_3"], ["Rent", "Tax", "Home"], ["ItDept"], [
    { title: t("Tool_house_property_income_FormulaTitle"), code: "NAV = GAV − municipal − 30% − interest\ntax ≈ max(0,NAV) × slab%", steps: steps(t, "Tool_house_property_income_Step_1", "Tool_house_property_income_Step_2", "Tool_house_property_income_Step_3", "Tool_house_property_income_Step_4") },
  ]);

export const interestPenalty234Info = (t: T) =>
  baseInfo(t, "Tool_interest_penalty_234", ["Tool_interest_penalty_234_Info_Goal_1", "Tool_interest_penalty_234_Info_Goal_2", "Tool_interest_penalty_234_Info_Goal_3"], ["Tax", "Advance", "Tds"], ["ItDept"], [
    { title: t("Tool_interest_penalty_234_FormulaTitle"), code: "234A/B ≈ tax × 1% × months\n234C ≈ (tax/4) × 1% × shortfalls", steps: steps(t, "Tool_interest_penalty_234_Step_1", "Tool_interest_penalty_234_Step_2", "Tool_interest_penalty_234_Step_3", "Tool_interest_penalty_234_Step_4") },
  ]);

export const agriculturalIncomeInfo = (t: T) =>
  baseInfo(t, "Tool_agricultural_income", ["Tool_agricultural_income_Info_Goal_1", "Tool_agricultural_income_Info_Goal_2", "Tool_agricultural_income_Info_Goal_3"], ["Tax", "Budget", "Goal"], ["ItDept"], [
    { title: t("Tool_agricultural_income_FormulaTitle"), code: "extra ≈ tax(total) − tax(agri + exemption)", steps: steps(t, "Tool_agricultural_income_Step_1", "Tool_agricultural_income_Step_2", "Tool_agricultural_income_Step_3", "Tool_agricultural_income_Step_4") },
  ]);

export const bonusInfo = (t: T) =>
  baseInfo(t, "Tool_bonus", ["Tool_bonus_Info_Goal_1", "Tool_bonus_Info_Goal_2", "Tool_bonus_Info_Goal_3"], ["Salary", "Tax", "Hike"], ["ItDept"], [
    { title: t("Tool_bonus_FormulaTitle"), code: "bonus = amount OR basic × %\ntax tip ≈ bonus × slab%", steps: steps(t, "Tool_bonus_Step_1", "Tool_bonus_Step_2", "Tool_bonus_Step_3", "Tool_bonus_Step_4") },
  ]);

export const salaryArrearsReliefInfo = (t: T) =>
  baseInfo(t, "Tool_salary_arrears_relief", ["Tool_salary_arrears_relief_Info_Goal_1", "Tool_salary_arrears_relief_Info_Goal_2", "Tool_salary_arrears_relief_Info_Goal_3"], ["Salary", "Tax", "Da"], ["ItDept"], [
    { title: t("Tool_salary_arrears_relief_FormulaTitle"), code: "relief ≈ tax(lump) − tax(spread)", steps: steps(t, "Tool_salary_arrears_relief_Step_1", "Tool_salary_arrears_relief_Step_2", "Tool_salary_arrears_relief_Step_3", "Tool_salary_arrears_relief_Step_4") },
  ]);

export const payCommissionInfo = (t: T) =>
  baseInfo(t, "Tool_pay_commission", ["Tool_pay_commission_Info_Goal_1", "Tool_pay_commission_Info_Goal_2", "Tool_pay_commission_Info_Goal_3"], ["Da", "Salary", "Budget"], ["ItDept"], [
    { title: t("Tool_pay_commission_FormulaTitle"), code: "revised = basic × fitment\n7th CPC ≈ 2.57", steps: steps(t, "Tool_pay_commission_Step_1", "Tool_pay_commission_Step_2", "Tool_pay_commission_Step_3", "Tool_pay_commission_Step_4") },
  ]);

export const gstAnnualReturnInfo = (t: T) =>
  baseInfo(t, "Tool_gst_annual_return", ["Tool_gst_annual_return_Info_Goal_1", "Tool_gst_annual_return_Info_Goal_2", "Tool_gst_annual_return_Info_Goal_3"], ["Gst", "Tax", "Freelancer"], ["Gst"], [
    { title: t("Tool_gst_annual_return_FormulaTitle"), code: "liability = outward × GST%\ndifference = paid − liability", steps: steps(t, "Tool_gst_annual_return_Step_1", "Tool_gst_annual_return_Step_2", "Tool_gst_annual_return_Step_3", "Tool_gst_annual_return_Step_4") },
  ]);

export const epfoPassbookInfo = (t: T) =>
  baseInfo(t, "Tool_epfo_passbook", ["Tool_epfo_passbook_Info_Goal_1", "Tool_epfo_passbook_Info_Goal_2", "Tool_epfo_passbook_Info_Goal_3"], ["Epf", "Nps", "Ppf"], ["ItDept"], [
    { title: t("Tool_epfo_passbook_FormulaTitle"), code: "month: +contrib, +interest (rate/12)\nclosing = opening + contrib + interest", steps: steps(t, "Tool_epfo_passbook_Step_1", "Tool_epfo_passbook_Step_2", "Tool_epfo_passbook_Step_3", "Tool_epfo_passbook_Step_4") },
  ]);

export const leaveTravelAllowanceInfo = (t: T) =>
  baseInfo(t, "Tool_leave_travel_allowance", ["Tool_leave_travel_allowance_Info_Goal_1", "Tool_leave_travel_allowance_Info_Goal_2", "Tool_leave_travel_allowance_Info_Goal_3"], ["Hra", "Salary", "Tax"], ["ItDept"], [
    { title: t("Tool_leave_travel_allowance_FormulaTitle"), code: "Exempt = min(claimed, limit)\nTaxable = max(0, claimed − exempt)", steps: steps(t, "Tool_leave_travel_allowance_Step_1", "Tool_leave_travel_allowance_Step_2", "Tool_leave_travel_allowance_Step_3", "Tool_leave_travel_allowance_Step_4") },
  ]);

export const postOfficeSavingsInfo = (t: T) =>
  baseInfo(t, "Tool_post_office_savings", ["Tool_post_office_savings_Info_Goal_1", "Tool_post_office_savings_Info_Goal_2", "Tool_post_office_savings_Info_Goal_3"], ["Fd", "Mis", "Ppf"], ["Nsi"], [
    { title: t("Tool_post_office_savings_FormulaTitle"), code: "A = P × (1 + r/n)^(n×t)", steps: steps(t, "Tool_post_office_savings_Step_1", "Tool_post_office_savings_Step_2", "Tool_post_office_savings_Step_3", "Tool_post_office_savings_Step_4") },
  ]);

export const centralGovtSalarySlipInfo = (t: T) =>
  baseInfo(t, "Tool_central_govt_salary_slip", ["Tool_central_govt_salary_slip_Info_Goal_1", "Tool_central_govt_salary_slip_Info_Goal_2", "Tool_central_govt_salary_slip_Info_Goal_3"], ["Da", "Hra", "Salary"], ["ItDept"], [
    { title: t("Tool_central_govt_salary_slip_FormulaTitle"), code: "gross = basic + DA + HRA + other\nnet = gross − deductions", steps: steps(t, "Tool_central_govt_salary_slip_Step_1", "Tool_central_govt_salary_slip_Step_2", "Tool_central_govt_salary_slip_Step_3", "Tool_central_govt_salary_slip_Step_4") },
  ]);

export const ssyVsPpfInfo = (t: T) =>
  baseInfo(t, "Tool_ssy_vs_ppf", ["Tool_ssy_vs_ppf_Info_Goal_1", "Tool_ssy_vs_ppf_Info_Goal_2", "Tool_ssy_vs_ppf_Info_Goal_3"], ["Ssy", "Ppf", "Fd"], ["Nsi"], [
    { title: t("Tool_ssy_vs_ppf_FormulaTitle"), code: "Same annual deposit\nSSY mature yr 21 · PPF 15 yrs\ngap = SSY − PPF", steps: steps(t, "Tool_ssy_vs_ppf_Step_1", "Tool_ssy_vs_ppf_Step_2", "Tool_ssy_vs_ppf_Step_3", "Tool_ssy_vs_ppf_Step_4") },
  ]);

export const pensionCommutationInfo = (t: T) =>
  baseInfo(t, "Tool_pension_commutation", ["Tool_pension_commutation_Info_Goal_1", "Tool_pension_commutation_Info_Goal_2", "Tool_pension_commutation_Info_Goal_3"], ["Nps", "Annuity", "Tax"], ["ItDept"], [
    { title: t("Tool_pension_commutation_FormulaTitle"), code: "commuted = pension × %\nlump = commuted × 12 × factor\nreduced = pension − commuted", steps: steps(t, "Tool_pension_commutation_Step_1", "Tool_pension_commutation_Step_2", "Tool_pension_commutation_Step_3", "Tool_pension_commutation_Step_4") },
  ]);

export const homeLoanTaxBenefitInfo = (t: T) =>
  baseInfo(t, "Tool_home_loan_tax_benefit", ["Tool_home_loan_tax_benefit_Info_Goal_1", "Tool_home_loan_tax_benefit_Info_Goal_2", "Tool_home_loan_tax_benefit_Info_Goal_3"], ["Home", "80c", "Tax"], ["ItDept"], [
    { title: t("Tool_home_loan_tax_benefit_FormulaTitle"), code: "24(b) = min(interest, ₹2L) self-occupied\n80C = min(principal, ₹1.5L)\nsaving ≈ total × slab%", steps: steps(t, "Tool_home_loan_tax_benefit_Step_1", "Tool_home_loan_tax_benefit_Step_2", "Tool_home_loan_tax_benefit_Step_3", "Tool_home_loan_tax_benefit_Step_4") },
  ]);

export const ltcgInfo = (t: T) =>
  baseInfo(t, "Tool_ltcg", ["Tool_ltcg_Info_Goal_1", "Tool_ltcg_Info_Goal_2", "Tool_ltcg_Info_Goal_3"], ["Cg", "Tax", "Elss"], ["ItDept", "Sebi"], [
    { title: t("Tool_ltcg_FormulaTitle"), code: "gain = sell − buy\nequity −₹1.25L then 12.5%\nproperty 12.5% (−54/54EC)", steps: steps(t, "Tool_ltcg_Step_1", "Tool_ltcg_Step_2", "Tool_ltcg_Step_3", "Tool_ltcg_Step_4") },
  ]);

export const stcgInfo = (t: T) =>
  baseInfo(t, "Tool_stcg", ["Tool_stcg_Info_Goal_1", "Tool_stcg_Info_Goal_2", "Tool_stcg_Info_Goal_3"], ["Cg", "Tax", "Elss"], ["ItDept", "Sebi"], [
    { title: t("Tool_stcg_FormulaTitle"), code: "gain = sell − buy\nequity 20% · property at slab\ncompare wait for LTCG", steps: steps(t, "Tool_stcg_Step_1", "Tool_stcg_Step_2", "Tool_stcg_Step_3", "Tool_stcg_Step_4") },
  ]);

export const taxLossHarvestingInfo = (t: T) =>
  baseInfo(t, "Tool_tax_loss_harvesting", ["Tool_tax_loss_harvesting_Info_Goal_1", "Tool_tax_loss_harvesting_Info_Goal_2", "Tool_tax_loss_harvesting_Info_Goal_3"], ["Cg", "Tax", "Elss"], ["ItDept", "Sebi"], [
    { title: t("Tool_tax_loss_harvesting_FormulaTitle"), code: "STCL → STCG then LTCG\nLTCL → LTCG only\ntax on net gains", steps: steps(t, "Tool_tax_loss_harvesting_Step_1", "Tool_tax_loss_harvesting_Step_2", "Tool_tax_loss_harvesting_Step_3", "Tool_tax_loss_harvesting_Step_4") },
  ]);

export const advanceTaxDueDateInfo = (t: T) =>
  baseInfo(t, "Tool_advance_tax_due_date", ["Tool_advance_tax_due_date_Info_Goal_1", "Tool_advance_tax_due_date_Info_Goal_2", "Tool_advance_tax_due_date_Info_Goal_3"], ["Tax", "Tds", "Advance"], ["ItDept"], [
    { title: t("Tool_advance_tax_due_date_FormulaTitle"), code: "15 Jun 15% · 15 Sep 45%\n15 Dec 75% · 15 Mar 100%\nshortfall = required − paid", steps: steps(t, "Tool_advance_tax_due_date_Step_1", "Tool_advance_tax_due_date_Step_2", "Tool_advance_tax_due_date_Step_3", "Tool_advance_tax_due_date_Step_4") },
  ]);

export const upsInfo = (t: T) =>
  baseInfo(t, "Tool_ups", ["Tool_ups_Info_Goal_1", "Tool_ups_Info_Goal_2", "Tool_ups_Info_Goal_3"], ["Nps", "Pension", "Epf"], ["Nps", "ItDept"], [
    { title: t("Tool_ups_FormulaTitle"), code: "UPS% = min(50%, 50% × yrs/25)\npension = basic × UPS%\nNPS = SIP(emp+govt)", steps: steps(t, "Tool_ups_Step_1", "Tool_ups_Step_2", "Tool_ups_Step_3", "Tool_ups_Step_4") },
  ]);

export const itrFormInfo = (t: T) =>
  baseInfo(t, "Tool_itr_form", ["Tool_itr_form_Info_Goal_1", "Tool_itr_form_Info_Goal_2", "Tool_itr_form_Info_Goal_3"], ["Tax", "Presumptive", "Salary"], ["ItDept"], [
    { title: t("Tool_itr_form_FormulaTitle"), code: "Biz → ITR-3/4\nCG / multi-HP → ITR-2\nSimple salary → ITR-1", steps: steps(t, "Tool_itr_form_Step_1", "Tool_itr_form_Step_2", "Tool_itr_form_Step_3", "Tool_itr_form_Step_4") },
  ]);

export const gstItcInfo = (t: T) =>
  baseInfo(t, "Tool_gst_itc", ["Tool_gst_itc_Info_Goal_1", "Tool_gst_itc_Info_Goal_2", "Tool_gst_itc_Info_Goal_3"], ["Gst", "Tax", "Freelancer"], ["Gst"], [
    { title: t("Tool_gst_itc_FormulaTitle"), code: "net = max(0, outward − ITC)\nexcess = max(0, ITC − outward)", steps: steps(t, "Tool_gst_itc_Step_1", "Tool_gst_itc_Step_2", "Tool_gst_itc_Step_3", "Tool_gst_itc_Step_4") },
  ]);

export const esiInfo = (t: T) =>
  baseInfo(t, "Tool_esi", ["Tool_esi_Info_Goal_1", "Tool_esi_Info_Goal_2", "Tool_esi_Info_Goal_3"], ["Epf", "Salary", "Maternity"], ["ItDept"], [
    { title: t("Tool_esi_FormulaTitle"), code: "Employee 0.75% · Employer 3.25%\nCeiling ≈ ₹21,000/month", steps: steps(t, "Tool_esi_Step_1", "Tool_esi_Step_2", "Tool_esi_Step_3", "Tool_esi_Step_4") },
  ]);

export const dividendTaxInfo = (t: T) =>
  baseInfo(t, "Tool_dividend_tax", ["Tool_dividend_tax_Info_Goal_1", "Tool_dividend_tax_Info_Goal_2", "Tool_dividend_tax_Info_Goal_3"], ["Tax", "Tds", "Elss"], ["ItDept", "Sebi"], [
    { title: t("Tool_dividend_tax_FormulaTitle"), code: "tax = dividend × slab% × 1.04\nno DDT; TDS if > ₹10k", steps: steps(t, "Tool_dividend_tax_Step_1", "Tool_dividend_tax_Step_2", "Tool_dividend_tax_Step_3", "Tool_dividend_tax_Step_4") },
  ]);

export const npsTier2Info = (t: T) =>
  baseInfo(t, "Tool_nps_tier_2", ["Tool_nps_tier_2_Info_Goal_1", "Tool_nps_tier_2_Info_Goal_2", "Tool_nps_tier_2_Info_Goal_3"], ["Nps", "Fd", "Elss"], ["Nps"], [
    { title: t("Tool_nps_tier_2_FormulaTitle"), code: "corpus = existing grown + SIP FV\nTier-II: liquid, no lock-in", steps: steps(t, "Tool_nps_tier_2_Step_1", "Tool_nps_tier_2_Step_2", "Tool_nps_tier_2_Step_3", "Tool_nps_tier_2_Step_4") },
  ]);

export const powerOfCompoundingInfo = (t: T) =>
  baseInfo(t, "Tool_power_of_compounding", ["Tool_power_of_compounding_Info_Goal_1", "Tool_power_of_compounding_Info_Goal_2", "Tool_power_of_compounding_Info_Goal_3"], ["Sip", "Fd", "Ppf"], ["Rbi", "Sebi"], [
    { title: t("Tool_power_of_compounding_FormulaTitle"), code: "A = P × (1 + r)^n\nRule of 72 ≈ 72 / rate%", steps: steps(t, "Tool_power_of_compounding_Step_1", "Tool_power_of_compounding_Step_2", "Tool_power_of_compounding_Step_3", "Tool_power_of_compounding_Step_4") },
  ]);

export const cropInsuranceInfo = (t: T) =>
  baseInfo(t, "Tool_crop_insurance", ["Tool_crop_insurance_Info_Goal_1", "Tool_crop_insurance_Info_Goal_2", "Tool_crop_insurance_Info_Goal_3"], ["Agri", "Health", "Term"], ["Rbi"], [
    { title: t("Tool_crop_insurance_FormulaTitle"), code: "premium = sumInsured × rate%\nKharif ~2% · Rabi ~1.5%", steps: steps(t, "Tool_crop_insurance_Step_1", "Tool_crop_insurance_Step_2", "Tool_crop_insurance_Step_3", "Tool_crop_insurance_Step_4") },
  ]);

export const ayushmanBharatInfo = (t: T) =>
  baseInfo(t, "Tool_ayushman_bharat", ["Tool_ayushman_bharat_Info_Goal_1", "Tool_ayushman_bharat_Info_Goal_2", "Tool_ayushman_bharat_Info_Goal_3"], ["Health", "Term", "80d"], ["Rbi"], [
    { title: t("Tool_ayushman_bharat_FormulaTitle"), code: "PM-JAY = ₹5L / family / year\neligibility category → cover", steps: steps(t, "Tool_ayushman_bharat_Step_1", "Tool_ayushman_bharat_Step_2", "Tool_ayushman_bharat_Step_3", "Tool_ayushman_bharat_Step_4") },
  ]);

export const hraVsHomeLoanInfo = (t: T) =>
  baseInfo(t, "Tool_hra_vs_home_loan", ["Tool_hra_vs_home_loan_Info_Goal_1", "Tool_hra_vs_home_loan_Info_Goal_2", "Tool_hra_vs_home_loan_Info_Goal_3"], ["Hra", "Home", "Tax"], ["ItDept"], [
    { title: t("Tool_hra_vs_home_loan_FormulaTitle"), code: "HRA exempt vs 24(b)+80C\nsaving ≈ deduction × slab%", steps: steps(t, "Tool_hra_vs_home_loan_Step_1", "Tool_hra_vs_home_loan_Step_2", "Tool_hra_vs_home_loan_Step_3", "Tool_hra_vs_home_loan_Step_4") },
  ]);

export const employeeCompensationInfo = (t: T) =>
  baseInfo(t, "Tool_employee_compensation", ["Tool_employee_compensation_Info_Goal_1", "Tool_employee_compensation_Info_Goal_2", "Tool_employee_compensation_Info_Goal_3"], ["Salary", "Epf", "Tax"], ["ItDept"], [
    { title: t("Tool_employee_compensation_FormulaTitle"), code: "CTC ≈ gross + employer PF + gratuity\nin-hand ≈ gross − PF − tax", steps: steps(t, "Tool_employee_compensation_Step_1", "Tool_employee_compensation_Step_2", "Tool_employee_compensation_Step_3", "Tool_employee_compensation_Step_4") },
  ]);

export const sukanyaVsLicInfo = (t: T) =>
  baseInfo(t, "Tool_sukanya_vs_lic", ["Tool_sukanya_vs_lic_Info_Goal_1", "Tool_sukanya_vs_lic_Info_Goal_2", "Tool_sukanya_vs_lic_Info_Goal_3"], ["Ssy", "Lic", "Term"], ["Nsi"], [
    { title: t("Tool_sukanya_vs_lic_FormulaTitle"), code: "Same annual outlay\nSSY mature yr 21 · LIC @ IRR\ngap = SSY − LIC", steps: steps(t, "Tool_sukanya_vs_lic_Step_1", "Tool_sukanya_vs_lic_Step_2", "Tool_sukanya_vs_lic_Step_3", "Tool_sukanya_vs_lic_Step_4") },
  ]);

export const seniorCitizenTaxInfo = (t: T) =>
  baseInfo(t, "Tool_senior_citizen_tax", ["Tool_senior_citizen_tax_Info_Goal_1", "Tool_senior_citizen_tax_Info_Goal_2", "Tool_senior_citizen_tax_Info_Goal_3"], ["Tax", "80tta", "Scss"], ["ItDept"], [
    { title: t("Tool_senior_citizen_tax_FormulaTitle"), code: "Exemption: ₹2.5L / ₹3L / ₹5L\nTaxable = income − exemption\n87A if income ≤ ₹5L", steps: steps(t, "Tool_senior_citizen_tax_Step_1", "Tool_senior_citizen_tax_Step_2", "Tool_senior_citizen_tax_Step_3", "Tool_senior_citizen_tax_Step_4") },
  ]);

export const npsWithdrawalInfo = (t: T) =>
  baseInfo(t, "Tool_nps_withdrawal", ["Tool_nps_withdrawal_Info_Goal_1", "Tool_nps_withdrawal_Info_Goal_2", "Tool_nps_withdrawal_Info_Goal_3"], ["Nps", "Annuity", "Tax"], ["Nps", "ItDept"], [
    { title: t("Tool_nps_withdrawal_FormulaTitle"), code: "Lump ≤ 60% (tax-free at exit)\nAnnuity = corpus − lump\nPension ≈ annuity × rate%", steps: steps(t, "Tool_nps_withdrawal_Step_1", "Tool_nps_withdrawal_Step_2", "Tool_nps_withdrawal_Step_3", "Tool_nps_withdrawal_Step_4") },
  ]);

export const pmKisanInfo = (t: T) =>
  baseInfo(t, "Tool_pm_kisan", ["Tool_pm_kisan_Info_Goal_1", "Tool_pm_kisan_Info_Goal_2", "Tool_pm_kisan_Info_Goal_3"], ["Budget", "Tax", "Goal"], ["Rbi"], [
    { title: t("Tool_pm_kisan_FormulaTitle"), code: "If eligible → ₹6,000 / year\n3 × ₹2,000 instalments", steps: steps(t, "Tool_pm_kisan_Step_1", "Tool_pm_kisan_Step_2", "Tool_pm_kisan_Step_3", "Tool_pm_kisan_Step_4") },
  ]);

export const pmaySubsidyInfo = (t: T) =>
  baseInfo(t, "Tool_pmay_subsidy", ["Tool_pmay_subsidy_Info_Goal_1", "Tool_pmay_subsidy_Info_Goal_2", "Tool_pmay_subsidy_Info_Goal_3"], ["Home", "Emi", "Tax"], ["Rbi"], [
    { title: t("Tool_pmay_subsidy_FormulaTitle"), code: "EWS/LIG 6.5% ≤₹6L\nMIG-I 4% ≤₹9L · MIG-II 3% ≤₹12L\nSubsidy ≈ PV(rate × loan)", steps: steps(t, "Tool_pmay_subsidy_Step_1", "Tool_pmay_subsidy_Step_2", "Tool_pmay_subsidy_Step_3", "Tool_pmay_subsidy_Step_4") },
  ]);

export const sipVsLumpsumInfo = (t: T) =>
  baseInfo(t, "Tool_sip_vs_lumpsum", ["Tool_sip_vs_lumpsum_Info_Goal_1", "Tool_sip_vs_lumpsum_Info_Goal_2", "Tool_sip_vs_lumpsum_Info_Goal_3"], ["Sip", "Lumpsum", "Mf"], ["Sebi", "Amfi"], [
    { title: t("Tool_sip_vs_lumpsum_FormulaTitle"), code: "Invested = SIP × months\nSIP FV vs lumpsum FV\nof the same total", steps: steps(t, "Tool_sip_vs_lumpsum_Step_1", "Tool_sip_vs_lumpsum_Step_2", "Tool_sip_vs_lumpsum_Step_3", "Tool_sip_vs_lumpsum_Step_4") },
  ]);

export const homeInsuranceInfo = (t: T) =>
  baseInfo(t, "Tool_home_insurance", ["Tool_home_insurance_Info_Goal_1", "Tool_home_insurance_Info_Goal_2", "Tool_home_insurance_Info_Goal_3"], ["Health", "Car", "Budget"], ["Rbi"], [
    { title: t("Tool_home_insurance_FormulaTitle"), code: "Premium ≈ property × rate%\nDefault ≈ 0.1%", steps: steps(t, "Tool_home_insurance_Step_1", "Tool_home_insurance_Step_2", "Tool_home_insurance_Step_3", "Tool_home_insurance_Step_4") },
  ]);

export const panPenaltyInfo = (t: T) =>
  baseInfo(t, "Tool_pan_penalty", ["Tool_pan_penalty_Info_Goal_1", "Tool_pan_penalty_Info_Goal_2", "Tool_pan_penalty_Info_Goal_3"], ["Pan", "Tds", "Tax"], ["ItDept"], [
    { title: t("Tool_pan_penalty_FormulaTitle"), code: "Late link ₹500/₹1,000\n206AA = 20% TDS\n+ illustrative 272B", steps: steps(t, "Tool_pan_penalty_Step_1", "Tool_pan_penalty_Step_2", "Tool_pan_penalty_Step_3", "Tool_pan_penalty_Step_4") },
  ]);

export const incomeTaxNoticeInfo = (t: T) =>
  baseInfo(t, "Tool_income_tax_notice", ["Tool_income_tax_notice_Info_Goal_1", "Tool_income_tax_notice_Info_Goal_2", "Tool_income_tax_notice_Info_Goal_3"], ["Tax", "Itr", "Tds"], ["ItDept"], [
    { title: t("Tool_income_tax_notice_FormulaTitle"), code: "Notice type → meaning\n+ checklist + demand", steps: steps(t, "Tool_income_tax_notice_Step_1", "Tool_income_tax_notice_Step_2", "Tool_income_tax_notice_Step_3", "Tool_income_tax_notice_Step_4") },
  ]);

export const tdsOnSalaryInfo = (t: T) =>
  baseInfo(t, "Tool_tds_on_salary", ["Tool_tds_on_salary_Info_Goal_1", "Tool_tds_on_salary_Info_Goal_2", "Tool_tds_on_salary_Info_Goal_3"], ["Tax", "Salary", "Tds"], ["ItDept"], [
    { title: t("Tool_tds_on_salary_FormulaTitle"), code: "Annual tax (regime)\nMonthly TDS ≈ tax ÷ 12", steps: steps(t, "Tool_tds_on_salary_Step_1", "Tool_tds_on_salary_Step_2", "Tool_tds_on_salary_Step_3", "Tool_tds_on_salary_Step_4") },
  ]);

export const gstReverseChargeInfo = (t: T) =>
  baseInfo(t, "Tool_gst_reverse_charge", ["Tool_gst_reverse_charge_Info_Goal_1", "Tool_gst_reverse_charge_Info_Goal_2", "Tool_gst_reverse_charge_Info_Goal_3"], ["Gst", "Tax", "Freelancer"], ["Gst"], [
    { title: t("Tool_gst_reverse_charge_FormulaTitle"), code: "RCM = value × rate%\nCGST+SGST or IGST", steps: steps(t, "Tool_gst_reverse_charge_Step_1", "Tool_gst_reverse_charge_Step_2", "Tool_gst_reverse_charge_Step_3", "Tool_gst_reverse_charge_Step_4") },
  ]);

export const apyVsNpsInfo = (t: T) =>
  baseInfo(t, "Tool_apy_vs_nps", ["Tool_apy_vs_nps_Info_Goal_1", "Tool_apy_vs_nps_Info_Goal_2", "Tool_apy_vs_nps_Info_Goal_3"], ["Apy", "Nps", "Pension"], ["Nps"], [
    { title: t("Tool_apy_vs_nps_FormulaTitle"), code: "APY chart monthly\nSame ₹ → NPS SIP\nCompare pensions", steps: steps(t, "Tool_apy_vs_nps_Step_1", "Tool_apy_vs_nps_Step_2", "Tool_apy_vs_nps_Step_3", "Tool_apy_vs_nps_Step_4") },
  ]);

export const propertyRegistrationInfo = (t: T) =>
  baseInfo(t, "Tool_property_registration", ["Tool_property_registration_Info_Goal_1", "Tool_property_registration_Info_Goal_2", "Tool_property_registration_Info_Goal_3"], ["Stamp", "Home", "Tax"], ["Rbi"], [
    { title: t("Tool_property_registration_FormulaTitle"), code: "Stamp + Reg on value\nState preset or custom %", steps: steps(t, "Tool_property_registration_Step_1", "Tool_property_registration_Step_2", "Tool_property_registration_Step_3", "Tool_property_registration_Step_4") },
  ]);

export const mudraLoanInfo = (t: T) =>
  baseInfo(t, "Tool_mudra_loan", ["Tool_mudra_loan_Info_Goal_1", "Tool_mudra_loan_Info_Goal_2", "Tool_mudra_loan_Info_Goal_3"], ["Emi", "Home", "Gold"], ["Rbi"], [
    { title: t("Tool_mudra_loan_FormulaTitle"), code: "Shishu ≤ ₹50K · Kishore ≤ ₹5L · Tarun ≤ ₹10L\nEMI on min(amount, limit)", steps: steps(t, "Tool_mudra_loan_Step_1", "Tool_mudra_loan_Step_2", "Tool_mudra_loan_Step_3", "Tool_mudra_loan_Step_4") },
  ]);

export const gstEInvoiceInfo = (t: T) =>
  baseInfo(t, "Tool_gst_e_invoice", ["Tool_gst_e_invoice_Info_Goal_1", "Tool_gst_e_invoice_Info_Goal_2", "Tool_gst_e_invoice_Info_Goal_3"], ["Gst", "Tax", "Freelancer"], ["Gst"], [
    { title: t("Tool_gst_e_invoice_FormulaTitle"), code: "If turnover ≥ ₹5 Cr → e-invoice likely\nGST = taxable × rate%", steps: steps(t, "Tool_gst_e_invoice_Step_1", "Tool_gst_e_invoice_Step_2", "Tool_gst_e_invoice_Step_3", "Tool_gst_e_invoice_Step_4") },
  ]);

export const nriHomeLoanInfo = (t: T) =>
  baseInfo(t, "Tool_nri_home_loan", ["Tool_nri_home_loan_Info_Goal_1", "Tool_nri_home_loan_Info_Goal_2", "Tool_nri_home_loan_Info_Goal_3"], ["Home", "Emi", "Tax"], ["Rbi"], [
    { title: t("Tool_nri_home_loan_FormulaTitle"), code: "eligible EMI = income × FOIR% − existing\nmax loan from EMI", steps: steps(t, "Tool_nri_home_loan_Step_1", "Tool_nri_home_loan_Step_2", "Tool_nri_home_loan_Step_3", "Tool_nri_home_loan_Step_4") },
  ]);

export const propertyCapitalGainsInfo = (t: T) =>
  baseInfo(t, "Tool_property_capital_gains", ["Tool_property_capital_gains_Info_Goal_1", "Tool_property_capital_gains_Info_Goal_2", "Tool_property_capital_gains_Info_Goal_3"], ["Cg", "Tax", "Home"], ["ItDept"], [
    { title: t("Tool_property_capital_gains_FormulaTitle"), code: "gain = sell − buy\nLTCG ≥ 24 mo → ~12.5%\n− 54/54EC", steps: steps(t, "Tool_property_capital_gains_Step_1", "Tool_property_capital_gains_Step_2", "Tool_property_capital_gains_Step_3", "Tool_property_capital_gains_Step_4") },
  ]);

export const form26asReconciliationInfo = (t: T) =>
  baseInfo(t, "Tool_form_26as_reconciliation", ["Tool_form_26as_reconciliation_Info_Goal_1", "Tool_form_26as_reconciliation_Info_Goal_2", "Tool_form_26as_reconciliation_Info_Goal_3"], ["Tax", "Tds", "Advance"], ["ItDept"], [
    { title: t("Tool_form_26as_reconciliation_FormulaTitle"), code: "diff = TDS(26AS) − TDS(books)", steps: steps(t, "Tool_form_26as_reconciliation_Step_1", "Tool_form_26as_reconciliation_Step_2", "Tool_form_26as_reconciliation_Step_3", "Tool_form_26as_reconciliation_Step_4") },
  ]);

export const eShramInfo = (t: T) =>
  baseInfo(t, "Tool_e_shram", ["Tool_e_shram_Info_Goal_1", "Tool_e_shram_Info_Goal_2", "Tool_e_shram_Info_Goal_3"], ["Budget", "Health", "Term"], ["Rbi"], [
    { title: t("Tool_e_shram_FormulaTitle"), code: "PMSBY + PMJJBY premiums\nPM-SYM pension note", steps: steps(t, "Tool_e_shram_Step_1", "Tool_e_shram_Step_2", "Tool_e_shram_Step_3", "Tool_e_shram_Step_4") },
  ]);

export const epfVsPpfInfo = (t: T) =>
  baseInfo(t, "Tool_epf_vs_ppf", ["Tool_epf_vs_ppf_Info_Goal_1", "Tool_epf_vs_ppf_Info_Goal_2", "Tool_epf_vs_ppf_Info_Goal_3"], ["Epf", "Ppf", "Fd"], ["Nsi"], [
    { title: t("Tool_epf_vs_ppf_FormulaTitle"), code: "Same monthly outlay\nEPF (+ employer) vs PPF\ngap = EPF − PPF", steps: steps(t, "Tool_epf_vs_ppf_Step_1", "Tool_epf_vs_ppf_Step_2", "Tool_epf_vs_ppf_Step_3", "Tool_epf_vs_ppf_Step_4") },
  ]);

export const startupTaxInfo = (t: T) =>
  baseInfo(t, "Tool_startup_tax", ["Tool_startup_tax_Info_Goal_1", "Tool_startup_tax_Info_Goal_2", "Tool_startup_tax_Info_Goal_3"], ["Tax", "Presumptive", "Freelancer"], ["ItDept"], [
    { title: t("Tool_startup_tax_FormulaTitle"), code: "DPIIT → 80-IAC 100% (illustrative)\nElse tax = profit × slab% × 1.04\nAngel tax abolished (DPIIT)", steps: steps(t, "Tool_startup_tax_Step_1", "Tool_startup_tax_Step_2", "Tool_startup_tax_Step_3", "Tool_startup_tax_Step_4") },
  ]);

export const gratuityVsEpfInfo = (t: T) =>
  baseInfo(t, "Tool_gratuity_vs_epf", ["Tool_gratuity_vs_epf_Info_Goal_1", "Tool_gratuity_vs_epf_Info_Goal_2", "Tool_gratuity_vs_epf_Info_Goal_3"], ["Gratuity", "Epf", "Nps"], ["ItDept"], [
    { title: t("Tool_gratuity_vs_epf_FormulaTitle"), code: "Gratuity = salary × 15 × yrs / 26\nEPF corpus compounded\ngap = EPF − gratuity", steps: steps(t, "Tool_gratuity_vs_epf_Step_1", "Tool_gratuity_vs_epf_Step_2", "Tool_gratuity_vs_epf_Step_3", "Tool_gratuity_vs_epf_Step_4") },
  ]);

export const incomeFromOtherSourcesInfo = (t: T) =>
  baseInfo(t, "Tool_income_from_other_sources", ["Tool_income_from_other_sources_Info_Goal_1", "Tool_income_from_other_sources_Info_Goal_2", "Tool_income_from_other_sources_Info_Goal_3"], ["Tax", "80tta", "Fd"], ["ItDept"], [
    { title: t("Tool_income_from_other_sources_FormulaTitle"), code: "Gross = interest + other\nTaxable = gross − 80TTA/B\nTax = taxable × slab% × 1.04", steps: steps(t, "Tool_income_from_other_sources_Step_1", "Tool_income_from_other_sources_Step_2", "Tool_income_from_other_sources_Step_3", "Tool_income_from_other_sources_Step_4") },
  ]);

export const npsVsPpfInfo = (t: T) =>
  baseInfo(t, "Tool_nps_vs_ppf", ["Tool_nps_vs_ppf_Info_Goal_1", "Tool_nps_vs_ppf_Info_Goal_2", "Tool_nps_vs_ppf_Info_Goal_3"], ["Nps", "Ppf", "Epf"], ["Nps", "Nsi"], [
    { title: t("Tool_nps_vs_ppf_FormulaTitle"), code: "Same annual contribution\nNPS SIP FV vs PPF annual\ngap = NPS − PPF", steps: steps(t, "Tool_nps_vs_ppf_Step_1", "Tool_nps_vs_ppf_Step_2", "Tool_nps_vs_ppf_Step_3", "Tool_nps_vs_ppf_Step_4") },
  ]);

export const tcsOnForeignRemittanceInfo = (t: T) =>
  baseInfo(t, "Tool_tcs_on_foreign_remittance", ["Tool_tcs_on_foreign_remittance_Info_Goal_1", "Tool_tcs_on_foreign_remittance_Info_Goal_2", "Tool_tcs_on_foreign_remittance_Info_Goal_3"], ["Tcs", "Tds", "Forex"], ["ItDept", "Rbi"], [
    { title: t("Tool_tcs_on_foreign_remittance_FormulaTitle"), code: "LRS ≤ ₹7L → 5%\nLRS > ₹7L → 20%\nNet = amount − TCS", steps: steps(t, "Tool_tcs_on_foreign_remittance_Step_1", "Tool_tcs_on_foreign_remittance_Step_2", "Tool_tcs_on_foreign_remittance_Step_3", "Tool_tcs_on_foreign_remittance_Step_4") },
  ]);

export const rentalYieldInfo = (t: T) =>
  baseInfo(t, "Tool_rental_yield", ["Tool_rental_yield_Info_Goal_1", "Tool_rental_yield_Info_Goal_2", "Tool_rental_yield_Info_Goal_3"], ["Rent", "Home", "Fd"], ["Rbi"], [
    { title: t("Tool_rental_yield_FormulaTitle"), code: "Gross % = annual rent / value × 100\nNet % = (rent − expenses) / value × 100", steps: steps(t, "Tool_rental_yield_Step_1", "Tool_rental_yield_Step_2", "Tool_rental_yield_Step_3", "Tool_rental_yield_Step_4") },
  ]);

export const pmVishwakarmaInfo = (t: T) =>
  baseInfo(t, "Tool_pm_vishwakarma", ["Tool_pm_vishwakarma_Info_Goal_1", "Tool_pm_vishwakarma_Info_Goal_2", "Tool_pm_vishwakarma_Info_Goal_3"], ["Emi", "Mudra", "Budget"], ["Rbi"], [
    { title: t("Tool_pm_vishwakarma_FormulaTitle"), code: "Grant ₹15K + stipend ₹500/day\nCredit ≤ ₹3L @ ~5%\nEMI on capped credit", steps: steps(t, "Tool_pm_vishwakarma_Step_1", "Tool_pm_vishwakarma_Step_2", "Tool_pm_vishwakarma_Step_3", "Tool_pm_vishwakarma_Step_4") },
  ]);

export const standUpIndiaLoanInfo = (t: T) =>
  baseInfo(t, "Tool_stand_up_india_loan", ["Tool_stand_up_india_loan_Info_Goal_1", "Tool_stand_up_india_loan_Info_Goal_2", "Tool_stand_up_india_loan_Info_Goal_3"], ["Emi", "Mudra", "Home"], ["Rbi"], [
    { title: t("Tool_stand_up_india_loan_FormulaTitle"), code: "₹10L–₹1Cr SC/ST/women\neligible = clamp(amount)\nEMI on eligible", steps: steps(t, "Tool_stand_up_india_loan_Step_1", "Tool_stand_up_india_loan_Step_2", "Tool_stand_up_india_loan_Step_3", "Tool_stand_up_india_loan_Step_4") },
  ]);

export const debtMfVsFdInfo = (t: T) =>
  baseInfo(t, "Tool_debt_mf_vs_fd", ["Tool_debt_mf_vs_fd_Info_Goal_1", "Tool_debt_mf_vs_fd_Info_Goal_2", "Tool_debt_mf_vs_fd_Info_Goal_3"], ["Fd", "Mf", "Tax"], ["Sebi", "ItDept"], [
    { title: t("Tool_debt_mf_vs_fd_FormulaTitle"), code: "FV = P × (1+r)^n\nTax ≈ gain × slab%\nCompare post-tax nets", steps: steps(t, "Tool_debt_mf_vs_fd_Step_1", "Tool_debt_mf_vs_fd_Step_2", "Tool_debt_mf_vs_fd_Step_3", "Tool_debt_mf_vs_fd_Step_4") },
  ]);

export const section80eEducationLoanInfo = (t: T) =>
  baseInfo(t, "Tool_80e_education_loan_interest", ["Tool_80e_education_loan_interest_Info_Goal_1", "Tool_80e_education_loan_interest_Info_Goal_2", "Tool_80e_education_loan_interest_Info_Goal_3"], ["Tax", "Edu", "Emi"], ["ItDept"], [
    { title: t("Tool_80e_education_loan_interest_FormulaTitle"), code: "Deduction = full interest\nSaving = interest × slab%\n8-year window", steps: steps(t, "Tool_80e_education_loan_interest_Step_1", "Tool_80e_education_loan_interest_Step_2", "Tool_80e_education_loan_interest_Step_3", "Tool_80e_education_loan_interest_Step_4") },
  ]);

export const section10ExemptionsInfo = (t: T) =>
  baseInfo(t, "Tool_section_10_exemptions", ["Tool_section_10_exemptions_Info_Goal_1", "Tool_section_10_exemptions_Info_Goal_2", "Tool_section_10_exemptions_Info_Goal_3"], ["Hra", "Lta", "Tax"], ["ItDept"], [
    { title: t("Tool_section_10_exemptions_FormulaTitle"), code: "Total = HRA + LTA + leave + gratuity + other\nEducational cap ₹25L", steps: steps(t, "Tool_section_10_exemptions_Step_1", "Tool_section_10_exemptions_Step_2", "Tool_section_10_exemptions_Step_3", "Tool_section_10_exemptions_Step_4") },
  ]);

export const gstHsnCodeInfo = (t: T) =>
  baseInfo(t, "Tool_gst_hsn_code", ["Tool_gst_hsn_code_Info_Goal_1", "Tool_gst_hsn_code_Info_Goal_2", "Tool_gst_hsn_code_Info_Goal_3"], ["Gst", "Tax", "Invoice"], ["Gst"], [
    { title: t("Tool_gst_hsn_code_FormulaTitle"), code: "Category → rate\nGST = amount × rate%\nCGST+SGST or IGST", steps: steps(t, "Tool_gst_hsn_code_Step_1", "Tool_gst_hsn_code_Step_2", "Tool_gst_hsn_code_Step_3", "Tool_gst_hsn_code_Step_4") },
  ]);

export const rentIncreaseInfo = (t: T) =>
  baseInfo(t, "Tool_rent_increase", ["Tool_rent_increase_Info_Goal_1", "Tool_rent_increase_Info_Goal_2", "Tool_rent_increase_Info_Goal_3"], ["Rent", "Home", "Budget"], ["Rbi"], [
    { title: t("Tool_rent_increase_FormulaTitle"), code: "Year n = current × (1+%)^(n−1)\nSum annual rents", steps: steps(t, "Tool_rent_increase_Step_1", "Tool_rent_increase_Step_2", "Tool_rent_increase_Step_3", "Tool_rent_increase_Step_4") },
  ]);

export const npsAssetAllocationInfo = (t: T) =>
  baseInfo(t, "Tool_nps_asset_allocation", ["Tool_nps_asset_allocation_Info_Goal_1", "Tool_nps_asset_allocation_Info_Goal_2", "Tool_nps_asset_allocation_Info_Goal_3"], ["Nps", "Sip", "Fd"], ["Nps"], [
    { title: t("Tool_nps_asset_allocation_FormulaTitle"), code: "E% + C% + G% = 100\nBlend = Σ (weight × return)", steps: steps(t, "Tool_nps_asset_allocation_Step_1", "Tool_nps_asset_allocation_Step_2", "Tool_nps_asset_allocation_Step_3", "Tool_nps_asset_allocation_Step_4") },
  ]);

export const healthInsurancePortInfo = (t: T) =>
  baseInfo(t, "Tool_health_insurance_port", ["Tool_health_insurance_port_Info_Goal_1", "Tool_health_insurance_port_Info_Goal_2", "Tool_health_insurance_port_Info_Goal_3"], ["Health", "Term", "Budget"], ["Rbi"], [
    { title: t("Tool_health_insurance_port_FormulaTitle"), code: "Waiting left = original − completed\nGap = new SI − current SI", steps: steps(t, "Tool_health_insurance_port_Step_1", "Tool_health_insurance_port_Step_2", "Tool_health_insurance_port_Step_3", "Tool_health_insurance_port_Step_4") },
  ]);

export const variablePayTaxInfo = (t: T) =>
  baseInfo(t, "Tool_variable_pay_tax", ["Tool_variable_pay_tax_Info_Goal_1", "Tool_variable_pay_tax_Info_Goal_2", "Tool_variable_pay_tax_Info_Goal_3"], ["Tax", "Salary", "Bonus"], ["ItDept"], [
    { title: t("Tool_variable_pay_tax_FormulaTitle"), code: "Tax = income × slab% × 1.04\nExtra = tax(fixed+var) − tax(fixed)", steps: steps(t, "Tool_variable_pay_tax_Step_1", "Tool_variable_pay_tax_Step_2", "Tool_variable_pay_tax_Step_3", "Tool_variable_pay_tax_Step_4") },
  ]);

export const swpTaxInfo = (t: T) =>
  baseInfo(t, "Tool_swp_tax", ["Tool_swp_tax_Info_Goal_1", "Tool_swp_tax_Info_Goal_2", "Tool_swp_tax_Info_Goal_3"], ["Swp", "Tax", "Mf"], ["Sebi", "ItDept"], [
    { title: t("Tool_swp_tax_FormulaTitle"), code: "Units = withdrawal / NAV\nCost = units × cost/unit\nCG tax on gain", steps: steps(t, "Tool_swp_tax_Step_1", "Tool_swp_tax_Step_2", "Tool_swp_tax_Step_3", "Tool_swp_tax_Step_4") },
  ]);

export const npsTaxBenefit80ccdInfo = (t: T) =>
  baseInfo(t, "Tool_80ccd_nps_tax_benefit", ["Tool_80ccd_nps_tax_benefit_Info_Goal_1", "Tool_80ccd_nps_tax_benefit_Info_Goal_2", "Tool_80ccd_nps_tax_benefit_Info_Goal_3"], ["Nps", "Tax", "Salary"], ["Nps", "ItDept"], [
    { title: t("Tool_80ccd_nps_tax_benefit_FormulaTitle"), code: "80CCD(1) ≤ 80C room\n80CCD(1B) ≤ ₹50K\n80CCD(2) ≤ 10%/14% salary", steps: steps(t, "Tool_80ccd_nps_tax_benefit_Step_1", "Tool_80ccd_nps_tax_benefit_Step_2", "Tool_80ccd_nps_tax_benefit_Step_3", "Tool_80ccd_nps_tax_benefit_Step_4") },
  ]);

export const section80ggInfo = (t: T) =>
  baseInfo(t, "Tool_80gg_rent_deduction", ["Tool_80gg_rent_deduction_Info_Goal_1", "Tool_80gg_rent_deduction_Info_Goal_2", "Tool_80gg_rent_deduction_Info_Goal_3"], ["Hra", "Rent", "Tax"], ["ItDept"], [
    { title: t("Tool_80gg_rent_deduction_FormulaTitle"), code: "Least of ₹60K, 25% ATI,\nrent − 10% ATI", steps: steps(t, "Tool_80gg_rent_deduction_Step_1", "Tool_80gg_rent_deduction_Step_2", "Tool_80gg_rent_deduction_Step_3", "Tool_80gg_rent_deduction_Step_4") },
  ]);

export const inHandSalaryInfo = (t: T) =>
  baseInfo(t, "Tool_in_hand_salary", ["Tool_in_hand_salary_Info_Goal_1", "Tool_in_hand_salary_Info_Goal_2", "Tool_in_hand_salary_Info_Goal_3"], ["Salary", "Tax", "Epf"], ["ItDept"], [
    { title: t("Tool_in_hand_salary_FormulaTitle"), code: "In-hand = gross − PF − PT − tax\nMonthly = annual ÷ 12", steps: steps(t, "Tool_in_hand_salary_Step_1", "Tool_in_hand_salary_Step_2", "Tool_in_hand_salary_Step_3", "Tool_in_hand_salary_Step_4") },
  ]);

export const debtPayoffInfo = (t: T) =>
  baseInfo(t, "Tool_debt_payoff", ["Tool_debt_payoff_Info_Goal_1", "Tool_debt_payoff_Info_Goal_2", "Tool_debt_payoff_Info_Goal_3"], ["Emi", "Personal", "Budget"], ["Rbi"], [
    { title: t("Tool_debt_payoff_FormulaTitle"), code: "Pay EMI + extra each month\nuntil balance clears", steps: steps(t, "Tool_debt_payoff_Step_1", "Tool_debt_payoff_Step_2", "Tool_debt_payoff_Step_3", "Tool_debt_payoff_Step_4") },
  ]);

export const goldEtfVsSgbInfo = (t: T) =>
  baseInfo(t, "Tool_gold_etf_vs_sgb", ["Tool_gold_etf_vs_sgb_Info_Goal_1", "Tool_gold_etf_vs_sgb_Info_Goal_2", "Tool_gold_etf_vs_sgb_Info_Goal_3"], ["Gold", "Sgb", "Tax"], ["Rbi", "Sebi"], [
    { title: t("Tool_gold_etf_vs_sgb_FormulaTitle"), code: "SGB = gold + 2.5% interest\nETF = gold − expense − LTCG", steps: steps(t, "Tool_gold_etf_vs_sgb_Step_1", "Tool_gold_etf_vs_sgb_Step_2", "Tool_gold_etf_vs_sgb_Step_3", "Tool_gold_etf_vs_sgb_Step_4") },
  ]);

export const fdLadderInfo = (t: T) =>
  baseInfo(t, "Tool_fd_ladder", ["Tool_fd_ladder_Info_Goal_1", "Tool_fd_ladder_Info_Goal_2", "Tool_fd_ladder_Info_Goal_3"], ["Fd", "Rd", "Budget"], ["Rbi"], [
    { title: t("Tool_fd_ladder_FormulaTitle"), code: "Split total into N rungs\nstaggered tenures → avg maturity", steps: steps(t, "Tool_fd_ladder_Step_1", "Tool_fd_ladder_Step_2", "Tool_fd_ladder_Step_3", "Tool_fd_ladder_Step_4") },
  ]);

export const noticePeriodBuyoutInfo = (t: T) =>
  baseInfo(t, "Tool_notice_period_buyout", ["Tool_notice_period_buyout_Info_Goal_1", "Tool_notice_period_buyout_Info_Goal_2", "Tool_notice_period_buyout_Info_Goal_3"], ["Salary", "Hike", "Budget"], ["ItDept"], [
    { title: t("Tool_notice_period_buyout_FormulaTitle"), code: "Buyout = days × (CTC ÷ 365)", steps: steps(t, "Tool_notice_period_buyout_Step_1", "Tool_notice_period_buyout_Step_2", "Tool_notice_period_buyout_Step_3", "Tool_notice_period_buyout_Step_4") },
  ]);

export const nriFdInfo = (t: T) =>
  baseInfo(t, "Tool_nri_fd", ["Tool_nri_fd_Info_Goal_1", "Tool_nri_fd_Info_Goal_2", "Tool_nri_fd_Info_Goal_3"], ["Fd", "Tax", "Forex"], ["Rbi", "ItDept"], [
    { title: t("Tool_nri_fd_FormulaTitle"), code: "FD maturity compounding\nNRE tax-free / NRO TDS ~30%", steps: steps(t, "Tool_nri_fd_Step_1", "Tool_nri_fd_Step_2", "Tool_nri_fd_Step_3", "Tool_nri_fd_Step_4") },
  ]);


export const dtaaInfo = (t: T) =>
  baseInfo(t, "Tool_dtaa", ["Tool_dtaa_Info_Goal_1", "Tool_dtaa_Info_Goal_2", "Tool_dtaa_Info_Goal_3"], ["Tax", "Nri", "Tds"], ["ItDept"], [
    { title: t("Tool_dtaa_FormulaTitle"), code: "FTC = min(foreign, India)\nNet = India − FTC", steps: steps(t, "Tool_dtaa_Step_1", "Tool_dtaa_Step_2", "Tool_dtaa_Step_3", "Tool_dtaa_Step_4") },
  ]);

export const section80ddbInfo = (t: T) =>
  baseInfo(t, "Tool_80ddb_medical_expense", ["Tool_80ddb_medical_expense_Info_Goal_1", "Tool_80ddb_medical_expense_Info_Goal_2", "Tool_80ddb_medical_expense_Info_Goal_3"], ["Tax", "80d", "Health"], ["ItDept"], [
    { title: t("Tool_80ddb_medical_expense_FormulaTitle"), code: "Limit ₹40K / ₹1L\nDeduction = min(expense, limit)", steps: steps(t, "Tool_80ddb_medical_expense_Step_1", "Tool_80ddb_medical_expense_Step_2", "Tool_80ddb_medical_expense_Step_3", "Tool_80ddb_medical_expense_Step_4") },
  ]);

export const section80uInfo = (t: T) =>
  baseInfo(t, "Tool_80u_disability_deduction", ["Tool_80u_disability_deduction_Info_Goal_1", "Tool_80u_disability_deduction_Info_Goal_2", "Tool_80u_disability_deduction_Info_Goal_3"], ["Tax", "80d", "Health"], ["ItDept"], [
    { title: t("Tool_80u_disability_deduction_FormulaTitle"), code: "₹75K / ₹1.25L severe\nSaving ≈ deduction × slab%", steps: steps(t, "Tool_80u_disability_deduction_Step_1", "Tool_80u_disability_deduction_Step_2", "Tool_80u_disability_deduction_Step_3", "Tool_80u_disability_deduction_Step_4") },
  ]);

export const ulipSurrenderInfo = (t: T) =>
  baseInfo(t, "Tool_ulip_surrender", ["Tool_ulip_surrender_Info_Goal_1", "Tool_ulip_surrender_Info_Goal_2", "Tool_ulip_surrender_Info_Goal_3"], ["Tax", "Lic", "Fd"], ["ItDept"], [
    { title: t("Tool_ulip_surrender_FormulaTitle"), code: "Gain = surrender − premiums\nTax note if short hold", steps: steps(t, "Tool_ulip_surrender_Step_1", "Tool_ulip_surrender_Step_2", "Tool_ulip_surrender_Step_3", "Tool_ulip_surrender_Step_4") },
  ]);

export const motorInsuranceNcbInfo = (t: T) =>
  baseInfo(t, "Tool_motor_insurance_ncb", ["Tool_motor_insurance_ncb_Info_Goal_1", "Tool_motor_insurance_ncb_Info_Goal_2", "Tool_motor_insurance_ncb_Info_Goal_3"], ["Car", "Health", "Term"], ["Rbi"], [
    { title: t("Tool_motor_insurance_ncb_FormulaTitle"), code: "Discount = OD × NCB%\nTotal = OD after + TP", steps: steps(t, "Tool_motor_insurance_ncb_Step_1", "Tool_motor_insurance_ncb_Step_2", "Tool_motor_insurance_ncb_Step_3", "Tool_motor_insurance_ncb_Step_4") },
  ]);

export const underConstructionEmiInfo = (t: T) =>
  baseInfo(t, "Tool_under_construction_emi", ["Tool_under_construction_emi_Info_Goal_1", "Tool_under_construction_emi_Info_Goal_2", "Tool_under_construction_emi_Info_Goal_3"], ["Home", "Emi", "Tax"], ["Rbi"], [
    { title: t("Tool_under_construction_emi_FormulaTitle"), code: "Pre-int on disbursed\nEMI after possession", steps: steps(t, "Tool_under_construction_emi_Step_1", "Tool_under_construction_emi_Step_2", "Tool_under_construction_emi_Step_3", "Tool_under_construction_emi_Step_4") },
  ]);

export const creditScoreSimulatorInfo = (t: T) =>
  baseInfo(t, "Tool_credit_score_simulator", ["Tool_credit_score_simulator_Info_Goal_1", "Tool_credit_score_simulator_Info_Goal_2", "Tool_credit_score_simulator_Info_Goal_3"], ["Budget", "Emi", "Fd"], ["Rbi"], [
    { title: t("Tool_credit_score_simulator_FormulaTitle"), code: "Score ≈ base + factor deltas\nEducational only", steps: steps(t, "Tool_credit_score_simulator_Step_1", "Tool_credit_score_simulator_Step_2", "Tool_credit_score_simulator_Step_3", "Tool_credit_score_simulator_Step_4") },
  ]);

export const gstRegistrationThresholdInfo = (t: T) =>
  baseInfo(t, "Tool_gst_registration_threshold", ["Tool_gst_registration_threshold_Info_Goal_1", "Tool_gst_registration_threshold_Info_Goal_2", "Tool_gst_registration_threshold_Info_Goal_3"], ["Gst", "Tax", "Freelancer"], ["Gst"], [
    { title: t("Tool_gst_registration_threshold_FormulaTitle"), code: "20L / 40L / 10L\nRegister if turnover > threshold", steps: steps(t, "Tool_gst_registration_threshold_Step_1", "Tool_gst_registration_threshold_Step_2", "Tool_gst_registration_threshold_Step_3", "Tool_gst_registration_threshold_Step_4") },
  ]);

export const internationalEquityTaxInfo = (t: T) =>
  baseInfo(t, "Tool_international_equity_tax", ["Tool_international_equity_tax_Info_Goal_1", "Tool_international_equity_tax_Info_Goal_2", "Tool_international_equity_tax_Info_Goal_3"], ["Tax", "Cg", "Mf"], ["ItDept"], [
    { title: t("Tool_international_equity_tax_FormulaTitle"), code: "Gain = sale − cost\nTax ≈ gain × slab% + cess", steps: steps(t, "Tool_international_equity_tax_Step_1", "Tool_international_equity_tax_Step_2", "Tool_international_equity_tax_Step_3", "Tool_international_equity_tax_Step_4") },
  ]);

export const reitsInvitsTaxInfo = (t: T) =>
  baseInfo(t, "Tool_reits_invits_tax", ["Tool_reits_invits_tax_Info_Goal_1", "Tool_reits_invits_tax_Info_Goal_2", "Tool_reits_invits_tax_Info_Goal_3"], ["Tax", "Mf", "Fd"], ["Sebi", "ItDept"], [
    { title: t("Tool_reits_invits_tax_FormulaTitle"), code: "Tax components × slab%\nNet = distribution − tax", steps: steps(t, "Tool_reits_invits_tax_Step_1", "Tool_reits_invits_tax_Step_2", "Tool_reits_invits_tax_Step_3", "Tool_reits_invits_tax_Step_4") },
  ]);

export const partnershipFirmTaxInfo = (t: T) =>
  baseInfo(t, "Tool_partnership_firm_tax", ["Tool_partnership_firm_tax_Info_Goal_1", "Tool_partnership_firm_tax_Info_Goal_2", "Tool_partnership_firm_tax_Info_Goal_3"], ["Tax", "Presumptive", "Freelancer"], ["ItDept"], [
    { title: t("Tool_partnership_firm_tax_FormulaTitle"), code: "30% flat + surcharge + cess", steps: steps(t, "Tool_partnership_firm_tax_Step_1", "Tool_partnership_firm_tax_Step_2", "Tool_partnership_firm_tax_Step_3", "Tool_partnership_firm_tax_Step_4") },
  ]);

export const goalExampleSources = (t: T) => [
  { label: t("Tool_goal_Source_BusinessToday"), url: "https://www.businesstoday.in/personal-finance/investment/story/fixed-deposits-remain-a-safe-bet-in-july-2026-where-can-investors-earn-highest-interest-540136-2026-07-01" },
  { label: t("Tool_goal_Source_PolicyBazaar"), url: "https://www.policybazaar.com/fd-interest-rates/" },
  { label: t("Tool_goal_Source_BajajAmc"), url: "https://www.bajajamc.com/knowledge-centre/nifty-50-historical-returns" },
  { label: t("Tool_goal_Source_SumMoney"), url: "https://sum.money/in/nifty-returns-calculator/" },
];
