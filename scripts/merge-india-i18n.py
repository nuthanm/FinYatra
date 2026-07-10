#!/usr/bin/env python3
"""Merge India catalog + calculator key batches into all locale JSON files."""

from __future__ import annotations

import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
MESSAGES = ROOT / "web" / "messages"
LOCALES = ("en", "hi", "te", "ta", "kn", "ml")
INDIA_I18N = ROOT / "web" / "lib" / "config" / "tools" / "india-i18n-en.json"
CALC_KEYS = ROOT / "scripts" / "i18n-new-calculator-keys.json"
BATCH_KEYS = [
    ROOT / "scripts" / "i18n-batch-ppf-fd-tax.json",
    ROOT / "scripts" / "i18n-batch-hra-gst-salary.json",
    ROOT / "scripts" / "i18n-batch-home-gratuity-nps.json",
    ROOT / "scripts" / "i18n-batch-rd-swp-elss.json",
    ROOT / "scripts" / "i18n-batch-epf-ssy-scss.json",
    ROOT / "scripts" / "i18n-batch-car-edu-stamp.json",
    ROOT / "scripts" / "i18n-batch-pt-tds-apy.json",
    ROOT / "scripts" / "i18n-batch-gold-cg-80c.json",
    ROOT / "scripts" / "i18n-batch-pl-bl-mf.json",
    ROOT / "scripts" / "i18n-batch-mis-flat-si.json",
    ROOT / "scripts" / "i18n-batch-leave-da-adv.json",
    ROOT / "scripts" / "i18n-batch-lap-2w-elig.json",
    ROOT / "scripts" / "i18n-batch-80d-nsc-tsfd.json",
    ROOT / "scripts" / "i18n-batch-ret-ef-hike.json",
    ROOT / "scripts" / "i18n-batch-hi-rent-prepay.json",
    ROOT / "scripts" / "i18n-batch-crypto-div-brok.json",
    ROOT / "scripts" / "i18n-batch-tcs-tdsprop-rent.json",
    ROOT / "scripts" / "i18n-batch-goalsip-stp-gold.json",
    ROOT / "scripts" / "i18n-batch-cc-emirate-bt.json",
    ROOT / "scripts" / "i18n-batch-age-forex-budget.json",
    ROOT / "scripts" / "i18n-batch-cii-kvp-etc.json",
    ROOT / "scripts" / "i18n-batch-renttax-xirr-etc.json",
    ROOT / "scripts" / "i18n-batch-carins-rentagr-etc.json",
    ROOT / "scripts" / "i18n-batch-nifty-re-lic.json",
    ROOT / "scripts" / "i18n-batch-ssy-salneg-etc.json",
    ROOT / "scripts" / "i18n-batch-presum-laf-etc.json",
    ROOT / "scripts" / "i18n-batch-water-sgb-etc.json",
    ROOT / "scripts" / "i18n-batch-hpi-234-etc.json",
    ROOT / "scripts" / "i18n-batch-gst-epfo-etc.json",
    ROOT / "scripts" / "i18n-batch-pension-ltcg-etc.json",
    ROOT / "scripts" / "i18n-batch-ups-itr-esi.json",
    ROOT / "scripts" / "i18n-batch-compound-crop-etc.json",
    ROOT / "scripts" / "i18n-batch-senior-pmay-etc.json",
    ROOT / "scripts" / "i18n-batch-pan-notice-etc.json",
    ROOT / "scripts" / "i18n-batch-mudra-eshtram-etc.json",
    ROOT / "scripts" / "i18n-batch-startup-yield-etc.json",
    ROOT / "scripts" / "i18n-batch-final-remaining.json",
    ROOT / "scripts" / "i18n-batch-80ccd-debt-etc.json",
    ROOT / "scripts" / "i18n-batch-vishwa-swp-etc.json",
]
OVERRIDES_DIR = ROOT / "scripts" / "i18n-locale-overrides"


def load_json(path: Path) -> dict[str, str]:
    if not path.is_file():
        return {}
    return json.loads(path.read_text(encoding="utf-8"))


def main() -> int:
    patches: dict[str, str] = {}
    patches.update(load_json(INDIA_I18N))
    patches.update(load_json(CALC_KEYS))
    for batch in BATCH_KEYS:
        patches.update(load_json(batch))

    # Fix known parser glitches / ensure titles
    patches["Tool_ppf_Title"] = patches.get("Tool_ppf_Title", "PPF Calculator")
    patches["Tool_ppf_Description"] = patches.get(
        "Tool_ppf_Description",
        "15-year Public Provident Fund maturity with yearly deposits and tax-free interest.",
    )
    patches["Tool_epf_Title"] = "EPF Calculator"
    patches["Tool_scss_Title"] = "SCSS Calculator"
    patches["Tool_scss_Description"] = (
        "Senior Citizen Savings Scheme returns at 8.2%. Quarterly payout and tax analysis."
    )
    patches["Tool_atal_pension_Title"] = "Atal Pension Calculator"
    patches["Tool_atal_pension_Description"] = (
        "APY contribution chart by age. Guaranteed ₹1,000–₹5,000/month pension."
    )
    patches["Tool_section_80c_Title"] = "Section 80C Calculator"
    patches["Tool_personal_loan_emi_Title"] = "Personal Loan EMI Calculator"
    patches["Tool_business_loan_emi_Title"] = "Business Loan EMI Calculator"
    patches["Tool_mutual_fund_returns_Title"] = "Mutual Fund Returns Calculator"
    patches["Tool_post_office_mis_Title"] = "Post Office MIS Calculator"
    patches["Tool_flat_vs_reducing_rate_Title"] = "Flat vs Reducing Rate Calculator"
    patches["Tool_simple_interest_Title"] = "Simple Interest Calculator"
    patches["Tool_leave_encashment_Title"] = "Leave Encashment Calculator"
    patches["Tool_da_Title"] = "DA Calculator"
    patches["Tool_advance_tax_Title"] = "Advance Tax Calculator"
    patches["Tool_loan_against_property_Title"] = "Loan Against Property Calculator"
    patches["Tool_two_wheeler_loan_Title"] = "Two-Wheeler Loan Calculator"
    patches["Tool_home_loan_eligibility_Title"] = "Home Loan Eligibility Calculator"
    patches["Tool_section_80d_Title"] = "Section 80D Calculator"
    patches["Tool_section_80d_Description"] = (
        "Health insurance premium tax benefit. Self + parents deduction up to ₹1 lakh."
    )
    patches["Tool_nsc_Title"] = "NSC Calculator"
    patches["Tool_tax_saving_fd_Title"] = "Tax Saving FD Calculator"
    patches["Tool_retirement_Title"] = "Retirement Calculator"
    patches["Tool_emergency_fund_Title"] = "Emergency Fund Calculator"
    patches["Tool_salary_hike_Title"] = "Salary Hike Calculator"
    patches["Tool_health_insurance_Title"] = "Health Insurance Calculator"
    patches["Tool_health_insurance_Description"] = (
        "Estimate how much health cover your family may need by age, members, and city tier — plus any gap vs current cover."
    )
    patches["Tool_rent_receipt_Title"] = "Rent Receipt Calculator"
    patches["Tool_rent_receipt_Description"] = (
        "Summarise monthly rent paid for HRA records — totals and a month-by-month table."
    )
    patches["Tool_home_loan_prepayment_Title"] = "Home Loan Prepayment Calculator"
    patches["Tool_home_loan_prepayment_Description"] = (
        "See interest saved if you prepay — compare reducing EMI vs reducing tenure."
    )
    patches["Tool_crypto_tax_Title"] = "Crypto Tax Calculator"
    patches["Tool_dividend_yield_Title"] = "Dividend Yield Calculator"
    patches["Tool_brokerage_Title"] = "Brokerage Calculator"
    patches["Tool_tcs_Title"] = "TCS Calculator"
    patches["Tool_tcs_Description"] = (
        "Tax Collected at Source on LRS remittance, sale of goods, and scrap — illustrative section-wise rates."
    )
    patches["Tool_tds_on_property_Title"] = "TDS on Property Calculator"
    patches["Tool_tds_on_property_Description"] = (
        "Section 194IA: 1% TDS when property consideration exceeds ₹50 lakh — with joint buyer share note."
    )
    patches["Tool_tds_on_rent_Title"] = "TDS on Rent Calculator"
    patches["Tool_tds_on_rent_Description"] = (
        "Section 194IB: 2% TDS when monthly rent exceeds ₹50,000 — annualise and Form 26QC note."
    )
    patches["Tool_goal_sip_Title"] = "Goal SIP Calculator"
    patches["Tool_stp_Title"] = "STP Calculator"
    patches["Tool_gold_investment_Title"] = "Gold Investment Calculator"
    patches["Tool_credit_card_emi_Title"] = "Credit Card EMI Calculator"
    patches["Tool_credit_card_emi_Description"] = (
        "Convert to EMI vs minimum payment trap. No-Cost EMI reality check."
    )
    patches["Tool_emi_to_rate_Title"] = "EMI to Rate Calculator"
    patches["Tool_emi_to_rate_Description"] = (
        "Find hidden interest rate in your EMI. No-cost EMI reality check."
    )
    patches["Tool_loan_balance_transfer_Title"] = "Loan Balance Transfer Calculator"
    patches["Tool_loan_balance_transfer_Description"] = (
        "Save by switching lender. Break-even months, top-up option, transfer verdict."
    )
    patches["Tool_age_Title"] = "Age Calculator"
    patches["Tool_forex_Title"] = "Forex Calculator"
    patches["Tool_monthly_budget_Title"] = "Monthly Budget Calculator"
    patches["Tool_net_worth_Title"] = "Net Worth Calculator"
    patches["Tool_child_education_Title"] = "Child Education Calculator"
    patches["Tool_80g_donation_Title"] = "80G Donation Calculator"
    patches["Tool_80g_donation_Description"] = (
        "Estimate Section 80G deduction and tax saving — 50% or 100%, with or without 10% income limit."
    )
    patches["Tool_cost_inflation_index_Title"] = "Cost Inflation Index Calculator"
    patches["Tool_cost_inflation_index_Description"] = (
        "Indexed cost for capital gains. Old vs new LTCG rule. Full CII table."
    )
    patches["Tool_kisan_vikas_patra_Title"] = "Kisan Vikas Patra Calculator"
    patches["Tool_kisan_vikas_patra_Description"] = (
        "KVP doubles your money in 115 months at 7.5%. After-tax returns and comparison with PPF."
    )
    patches["Tool_mahila_samman_Title"] = "Mahila Samman Calculator"
    patches["Tool_mahila_samman_Description"] = (
        "MSSC 7.5% quarterly for women. 2-year tenure, partial withdrawal, and FD comparison."
    )
    patches["Tool_annuity_Title"] = "Annuity Calculator"
    patches["Tool_annuity_Description"] = (
        "Monthly pension from retirement corpus. NPS 40% annuity split and fixed vs increasing comparison."
    )
    patches["Tool_interest_rate_converter_Title"] = "Interest Rate Converter Calculator"
    patches["Tool_interest_rate_converter_Description"] = (
        "Convert flat to reducing rate, nominal to effective. Compare loan offers on equal basis."
    )
    patches["Tool_lta_Title"] = "LTA Calculator"
    patches["Tool_lta_Description"] = (
        "Leave Travel Allowance exemption under Section 10(5). Block year tracker and family coverage."
    )
    patches["Tool_car_insurance_Title"] = "Car Insurance Calculator"
    patches["Tool_car_insurance_Description"] = (
        "Estimate car insurance premium. IDV, third-party, own damage, NCB discount, and GST."
    )
    patches["Tool_rent_agreement_Title"] = "Rent Agreement Calculator"
    patches["Tool_rent_agreement_Description"] = (
        "Stamp duty on rental agreement by state. Maharashtra, Delhi, Karnataka, Tamil Nadu, UP, Gujarat."
    )
    patches["Tool_compound_interest_Title"] = "Compound Interest Calculator"
    patches["Tool_compound_interest_Description"] = (
        "CI formula with quarterly, monthly, daily compounding. Rule of 72 and frequency comparison."
    )
    patches["Tool_ppf_withdrawal_Title"] = "PPF Withdrawal Calculator"
    patches["Tool_ppf_withdrawal_Description"] = (
        "Partial withdrawal from 7th FY, premature closure rules, and opportunity cost analysis."
    )
    patches["Tool_mf_overlap_Title"] = "MF Overlap Calculator"
    patches["Tool_mf_overlap_Description"] = (
        "Check if your mutual funds hold the same stocks. Pairwise overlap score and portfolio fix."
    )
    patches["Tool_pan_aadhaar_link_Title"] = "PAN-Aadhaar Link Checker"
    patches["Tool_pan_aadhaar_link_Description"] = (
        "Check PAN-Aadhaar link status. Consequences of inoperative PAN and how to link."
    )
    patches["Tool_electric_vehicle_Title"] = "Electric Vehicle Calculator"
    patches["Tool_ssy_withdrawal_Title"] = "SSY Withdrawal Calculator"
    patches["Tool_ssy_withdrawal_Description"] = (
        "When can you withdraw from SSY? Partial withdrawal at 18, maturity at 21 years, premature closure."
    )
    patches["Tool_salary_negotiation_Title"] = "Salary Negotiation Calculator"
    patches["Tool_salary_negotiation_Description"] = (
        "Compare current vs offer CTC, implied hike %, and a suggested counter."
    )
    patches["Tool_maternity_benefit_Title"] = "Maternity Benefit Calculator"
    patches["Tool_maternity_benefit_Description"] = (
        "26 weeks maternity leave and pay. Average daily wage × leave days (simplified)."
    )
    patches["Tool_post_office_td_Title"] = "Post Office TD Calculator"
    patches["Tool_post_office_td_Description"] = (
        "Post Office Time Deposit maturity at 6.9-7.5%. Tax impact and comparison with bank FD and NSC."
    )
    patches["Tool_home_renovation_Title"] = "Home Renovation Calculator"
    patches["Tool_home_renovation_Description"] = (
        "Renovation cost by category with contingency, or renovation loan EMI."
    )
    patches["Tool_section_80tta_Title"] = "Section 80TTA Calculator"
    patches["Tool_section_80tta_Description"] = (
        "Tax saving on savings account interest. ₹10K deduction (80TTA) and ₹50K for seniors (80TTB)."
    )
    patches["Tool_presumptive_tax_Title"] = "Presumptive Tax Calculator"
    patches["Tool_presumptive_tax_Description"] = (
        "Section 44AD (6%/8%) and 44ADA (50%) presumptive income with tax at your slab."
    )
    patches["Tool_loan_against_fd_Title"] = "Loan Against FD Calculator"
    patches["Tool_loan_against_fd_Description"] = (
        "Borrow against your FD at ~75–90% LTV. See max loan, EMI, and interest."
    )
    patches["Tool_da_arrears_Title"] = "DA Arrears Calculator"
    patches["Tool_da_arrears_Description"] = (
        "Dearness Allowance arrears when DA% is revised. Basic × ΔDA% × months."
    )
    patches["Tool_floating_rate_savings_bond_Title"] = "Floating Rate Savings Bond Calculator"
    patches["Tool_floating_rate_savings_bond_Description"] = (
        "RBI FRSB-style interest at ~8.05%. Half-yearly payout over 7 years."
    )
    patches["Tool_mutual_fund_tax_Title"] = "Mutual Fund Tax Calculator"
    patches["Tool_mutual_fund_tax_Description"] = (
        "Equity vs debt MF capital gains. STCG/LTCG simplified rates with holding period."
    )
    patches["Tool_income_tax_refund_Title"] = "Income Tax Refund Calculator"
    patches["Tool_income_tax_refund_Description"] = (
        "TDS + advance + self-assessment vs tax liability → refund or amount due."
    )
    patches["Tool_water_bill_Title"] = "Water Bill Calculator"
    patches["Tool_water_bill_Description"] = (
        "Estimate water charges with kl slabs and a fixed meter charge. Illustrative city tariff."
    )
    patches["Tool_savings_account_interest_Title"] = "Savings Account Interest Calculator"
    patches["Tool_savings_account_interest_Description"] = (
        "Estimate savings interest from balance, rate (~2.7–3%), and days — with Section 80TTA note."
    )
    patches["Tool_sovereign_gold_bond_Title"] = "Sovereign Gold Bond Calculator"
    patches["Tool_sovereign_gold_bond_Description"] = (
        "Estimate SGB returns: 2.5% annual interest on issue price plus capital gains at redemption (educational)."
    )
    patches["Tool_senior_citizen_fd_Title"] = "Senior Citizen FD Calculator"
    patches["Tool_senior_citizen_fd_Description"] = (
        "Senior FD maturity at higher rates with TDS note (₹50k threshold) and comparison vs regular FD."
    )
    patches["Tool_term_insurance_Title"] = "Term Insurance Calculator"
    patches["Tool_term_insurance_Description"] = (
        "Estimate life cover need via income×years or expense method — and the gap vs existing cover."
    )
    patches["Tool_nri_tax_Title"] = "NRI Tax Calculator"
    patches["Tool_nri_tax_Description"] = (
        "Rough tax note on India income by residential status (Resident / RNOR / NRI) — simplified slabs, educational."
    )
    patches["Tool_house_property_income_Title"] = "House Property Income Calculator"
    patches["Tool_house_property_income_Description"] = (
        "GAV minus municipal tax, 30% standard deduction, and interest → NAV and tax at your slab."
    )
    patches["Tool_interest_penalty_234_Title"] = "Interest & Penalty 234 Calculator"
    patches["Tool_interest_penalty_234_Description"] = (
        "Simplified 234A/B/C interest estimate from tax due, months late, and instalment shortfalls."
    )
    patches["Tool_agricultural_income_Title"] = "Agricultural Income Calculator"
    patches["Tool_agricultural_income_Description"] = (
        "Exempt agri income still affects tax rates — rough partial integration with other income."
    )
    patches["Tool_bonus_Title"] = "Bonus Calculator"
    patches["Tool_bonus_Description"] = (
        "Bonus from basic × % or a fixed amount, plus an optional tax tip at your slab."
    )
    patches["Tool_salary_arrears_relief_Title"] = "Salary Arrears Relief Calculator"
    patches["Tool_salary_arrears_relief_Description"] = (
        "Simplified Section 89(1) relief: tax if arrears are lumped vs spread over prior years."
    )
    patches["Tool_pay_commission_Title"] = "Pay Commission Calculator"
    patches["Tool_pay_commission_Description"] = (
        "7th CPC-style revised basic: current basic × fitment factor (e.g. 2.57)."
    )
    patches["Tool_gst_annual_return_Title"] = "GST Annual Return Calculator"
    patches["Tool_gst_annual_return_Description"] = (
        "Educational GSTR-9 style check: outward supplies × GST% vs tax paid — see excess or shortfall (not a filing tool)."
    )
    patches["Tool_epfo_passbook_Title"] = "EPFO Passbook Calculator"
    patches["Tool_epfo_passbook_Description"] = (
        "Project EPF closing balance from opening, monthly contributions, months, and interest rate — mini passbook style."
    )
    patches["Tool_leave_travel_allowance_Title"] = "Leave Travel Allowance Calculator"
    patches["Tool_leave_travel_allowance_Description"] = (
        "Section 10(5) LTA: claimed vs exempt limit and taxable excess — with 2 trips / 4-year block note."
    )
    patches["Tool_post_office_savings_Title"] = "Post Office Savings Calculator"
    patches["Tool_post_office_savings_Description"] = (
        "Post Office savings deposit with rate and compounding — see maturity and interest (educational)."
    )
    patches["Tool_central_govt_salary_slip_Title"] = "Central Govt Salary Slip Calculator"
    patches["Tool_central_govt_salary_slip_Description"] = (
        "7th CPC-style slip: basic, DA%, HRA%, allowances and deductions → gross and net pay."
    )
    patches["Tool_ssy_vs_ppf_Title"] = "SSY vs PPF Calculator"
    patches["Tool_ssy_vs_ppf_Description"] = (
        "Side-by-side Sukanya Samriddhi vs PPF maturity for the same annual deposit — rate and tenure advantage."
    )
    patches["Tool_pension_commutation_Title"] = "Pension Commutation Calculator"
    patches["Tool_pension_commutation_Description"] = (
        "Commute up to 40% pension for lump sum. Official commutation table, 15-year restoration, break-even."
    )
    patches["Tool_home_loan_tax_benefit_Title"] = "Home Loan Tax Benefit Calculator Section 24(b)"
    patches["Tool_home_loan_tax_benefit_Description"] = (
        "₹2L + 80C ₹1.5L deductions. Old vs new regime, joint loan benefit up to ₹7L."
    )
    patches["Tool_ltcg_Title"] = "LTCG Calculator"
    patches["Tool_ltcg_Description"] = (
        "Long-term capital gains at 12.5%. Equity ₹1.25L exempt, property indexation choice, Section 54/54EC."
    )
    patches["Tool_stcg_Title"] = "STCG Calculator"
    patches["Tool_stcg_Description"] = (
        "Short-term capital gains. Equity 20% (Budget 2024), property at slab rate. Wait vs sell analysis."
    )
    patches["Tool_tax_loss_harvesting_Title"] = "Tax Loss Harvesting Calculator"
    patches["Tool_tax_loss_harvesting_Description"] = (
        "Offset gains with losses. No wash sale rule in India. STCL/LTCL strategy, year-end planning."
    )
    patches["Tool_advance_tax_due_date_Title"] = "Advance Tax Due Date Calculator"
    patches["Tool_advance_tax_due_date_Description"] = (
        "Quarterly schedule 15 Jun/Sep/Dec/Mar. 234C penalty calculator, presumptive single instalment."
    )
    patches["Tool_ups_Title"] = "UPS Calculator"
    patches["Tool_ups_Description"] = (
        "Unified Pension Scheme educational estimate: contribution %, assured pension vs simplified NPS comparison."
    )
    patches["Tool_itr_form_Title"] = "ITR Form Selector"
    patches["Tool_itr_form_Description"] = (
        "Income sources checklist → suggest ITR-1 / 2 / 3 / 4 (educational, not filing advice)."
    )
    patches["Tool_gst_itc_Title"] = "GST ITC Calculator"
    patches["Tool_gst_itc_Description"] = (
        "Outward GST tax minus ITC available → net GST payable (educational)."
    )
    patches["Tool_esi_Title"] = "ESI Calculator"
    patches["Tool_esi_Description"] = (
        "Employee State Insurance: 0.75% employee + 3.25% employer on wages (₹21k ceiling note)."
    )
    patches["Tool_dividend_tax_Title"] = "Dividend Tax Calculator"
    patches["Tool_dividend_tax_Description"] = (
        "Tax on dividends at your slab (no DDT) with cess, TDS note, and simplified surcharge band."
    )
    patches["Tool_nps_tier_2_Title"] = "NPS Tier 2 Calculator"
    patches["Tool_nps_tier_2_Description"] = (
        "NPS Tier-II corpus from monthly contribution, return, and years — liquid, no lock-in (educational)."
    )
    patches["Tool_power_of_compounding_Title"] = "Power of Compounding Calculator"
    patches["Tool_power_of_compounding_Description"] = (
        "Visualize exponential growth. Cost of delay, rate comparison (PPF 7% vs equity 12% vs small cap 15%)."
    )
    patches["Tool_crop_insurance_Title"] = "Crop Insurance Calculator"
    patches["Tool_crop_insurance_Description"] = (
        "PMFBY premium: Kharif 2%, Rabi 1.5%. Claim estimation, govt subsidy breakdown, 5-year value analysis."
    )
    patches["Tool_ayushman_bharat_Title"] = "Ayushman Bharat Calculator PM-JAY"
    patches["Tool_ayushman_bharat_Description"] = (
        "₹5L/family/year. Eligibility check, 70+ universal cover, PMJAY vs private insurance."
    )
    patches["Tool_hra_vs_home_loan_Title"] = "HRA vs Home Loan Calculator"
    patches["Tool_hra_vs_home_loan_Description"] = (
        "Rent with HRA or buy with home loan? Tax comparison for the same housing cost (educational)."
    )
    patches["Tool_employee_compensation_Title"] = "Employee Compensation Calculator"
    patches["Tool_employee_compensation_Description"] = (
        "CTC breakup from employer side. PF, ESI, gratuity, EDLI costs. Employee in-hand vs employer total cost."
    )
    patches["Tool_sukanya_vs_lic_Title"] = "Sukanya vs LIC Calculator"
    patches["Tool_sukanya_vs_lic_Description"] = (
        "SSY 8.2% vs LIC endowment ~5% IRR. Same annual outlay maturity comparison (educational)."
    )
    patches["Tool_senior_citizen_tax_Title"] = "Senior Citizen Tax Calculator"
    patches["Tool_senior_citizen_tax_Description"] = (
        "Higher basic exemption for 60+/80+ and Section 87A rebate — compare vs regular taxpayer (educational)."
    )
    patches["Tool_nps_withdrawal_Title"] = "NPS Withdrawal Calculator"
    patches["Tool_nps_withdrawal_Description"] = (
        "At exit: lump up to 60% (tax-free) + annuity on the rest — see amounts and illustrative pension."
    )
    patches["Tool_pm_kisan_Title"] = "PM-Kisan Calculator"
    patches["Tool_pm_kisan_Description"] = (
        "₹6,000/year in 3 instalments of ₹2,000 — eligibility display for PM-Kisan Samman Nidhi."
    )
    patches["Tool_pmay_subsidy_Title"] = "PMAY Subsidy Calculator"
    patches["Tool_pmay_subsidy_Description"] = (
        "Simplified PMAY interest subsidy by EWS/LIG/MIG category — estimate on eligible loan amount."
    )
    patches["Tool_sip_vs_lumpsum_Title"] = "SIP vs Lumpsum Calculator"
    patches["Tool_sip_vs_lumpsum_Description"] = (
        "Same total invested via monthly SIP vs one-time lumpsum — compare future values at your return rate."
    )
    patches["Tool_home_insurance_Title"] = "Home Insurance Calculator"
    patches["Tool_home_insurance_Description"] = (
        "Estimate home insurance premium from property value and rate — structure cover educational estimate."
    )
    patches["Tool_pan_penalty_Title"] = "PAN Penalty Calculator"
    patches["Tool_pan_penalty_Description"] = (
        "Illustrative late Aadhaar–PAN link fees, 206AA higher TDS without PAN, and Section 272B-style amounts."
    )
    patches["Tool_income_tax_notice_Title"] = "Income Tax Notice Guide"
    patches["Tool_income_tax_notice_Description"] = (
        "Pick notice type (143/148/156/245) → meaning, checklist, and optional demand amount (educational)."
    )
    patches["Tool_tds_on_salary_Title"] = "TDS on Salary Calculator"
    patches["Tool_tds_on_salary_Description"] = (
        "Section 192-style estimate: annual tax under old/new regime ÷ 12 for monthly TDS."
    )
    patches["Tool_gst_reverse_charge_Title"] = "GST Reverse Charge Calculator"
    patches["Tool_gst_reverse_charge_Description"] = (
        "RCM GST from taxable value × rate — CGST+SGST or IGST split (educational)."
    )
    patches["Tool_apy_vs_nps_Title"] = "APY vs NPS Calculator"
    patches["Tool_apy_vs_nps_Description"] = (
        "Same monthly outlay: APY guaranteed pension chart vs NPS SIP corpus and illustrative pension."
    )
    patches["Tool_property_registration_Title"] = "Property Registration Calculator"
    patches["Tool_property_registration_Description"] = (
        "Stamp duty + registration on property value — state presets or custom stamp% and reg%."
    )
    patches["Tool_mudra_loan_Title"] = "MUDRA Loan Calculator"
    patches["Tool_mudra_loan_Description"] = (
        "Shishu ₹50K / Kishore ₹5L / Tarun ₹10L — see eligible amount and EMI. No collateral (educational)."
    )
    patches["Tool_gst_e_invoice_Title"] = "GST E-Invoice Calculator"
    patches["Tool_gst_e_invoice_Description"] = (
        "Check if turnover likely needs e-invoice (≈₹5 Cr+) and see sample invoice GST (educational)."
    )
    patches["Tool_nri_home_loan_Title"] = "NRI Home Loan Calculator"
    patches["Tool_nri_home_loan_Description"] = (
        "NRI home loan eligibility vs income, FOIR, rate, and EMI — educational estimate."
    )
    patches["Tool_property_capital_gains_Title"] = "Property Capital Gains Calculator"
    patches["Tool_property_capital_gains_Description"] = (
        "Property buy/sell → LTCG at ~12.5% with optional Sec 54/54EC exemption (educational)."
    )
    patches["Tool_form_26as_reconciliation_Title"] = "Form 26AS Reconciliation Calculator"
    patches["Tool_form_26as_reconciliation_Description"] = (
        "Compare TDS as per Form 26AS vs books / Form 16 — see the difference."
    )
    patches["Tool_e_shram_Title"] = "e-Shram Calculator"
    patches["Tool_e_shram_Description"] = (
        "e-Shram registration educational summary — PMSBY, PMJJBY, and PM-SYM benefit snapshot."
    )
    patches["Tool_epf_vs_ppf_Title"] = "EPF vs PPF Calculator"
    patches["Tool_epf_vs_ppf_Description"] = (
        "Compare EPF vs PPF for the same monthly contribution — with optional employer match."
    )
    patches["Tool_startup_tax_Title"] = "Startup Tax Calculator"
    patches["Tool_startup_tax_Description"] = (
        "DPIIT startup: Section 80-IAC profit deduction, angel tax note, and simple tax on profit."
    )
    patches["Tool_gratuity_vs_epf_Title"] = "Gratuity vs EPF Calculator"
    patches["Tool_gratuity_vs_epf_Description"] = (
        "Side-by-side projected gratuity vs EPF corpus for the same years of service."
    )
    patches["Tool_income_from_other_sources_Title"] = "Income from Other Sources Calculator"
    patches["Tool_income_from_other_sources_Description"] = (
        "Interest and other IFOS income taxed at your slab — with optional 80TTA/80TTB."
    )
    patches["Tool_nps_vs_ppf_Title"] = "NPS vs PPF Calculator"
    patches["Tool_nps_vs_ppf_Description"] = (
        "Compare maturity for the same annual contribution — NPS market return vs PPF guaranteed rate."
    )
    patches["Tool_tcs_on_foreign_remittance_Title"] = "TCS on Foreign Remittance Calculator"
    patches["Tool_tcs_on_foreign_remittance_Description"] = (
        "LRS remittance → TCS at 5% (≤ ₹7L) or 20% (above) — claim credit via ITR."
    )
    patches["Tool_rental_yield_Title"] = "Rental Yield Calculator"
    patches["Tool_rental_yield_Description"] = (
        "Gross and net rental yield: annual rent ÷ property value — with expense drag."
    )
    patches["Tool_pm_vishwakarma_Title"] = "PM Vishwakarma Calculator"
    patches["Tool_pm_vishwakarma_Description"] = (
        "₹15K toolkit grant + optional credit EMI at ~5%. Training stipend ₹500/day (educational)."
    )
    patches["Tool_stand_up_india_loan_Title"] = "Stand Up India Loan Calculator"
    patches["Tool_stand_up_india_loan_Description"] = (
        "₹10L–₹1Cr for SC/ST/women entrepreneurs — amount, rate, tenure → EMI (educational)."
    )
    patches["Tool_debt_mf_vs_fd_Title"] = "Debt MF vs FD Calculator"
    patches["Tool_debt_mf_vs_fd_Description"] = (
        "Same investment: compare post-tax debt MF vs FD returns at your slab (educational)."
    )
    patches["Tool_80e_education_loan_interest_Title"] = "80E Education Loan Interest Calculator"
    patches["Tool_80e_education_loan_interest_Description"] = (
        "Interest paid → full Section 80E deduction and tax saving at your slab (educational)."
    )
    patches["Tool_section_10_exemptions_Title"] = "Section 10 Exemptions Calculator"
    patches["Tool_section_10_exemptions_Description"] = (
        "HRA, LTA, leave encashment, gratuity and other → total exempt (educational cap)."
    )
    patches["Tool_gst_hsn_code_Title"] = "GST HSN Code Calculator"
    patches["Tool_gst_hsn_code_Description"] = (
        "Pick an illustrative HSN rate category → GST on amount with CGST/SGST or IGST (educational)."
    )
    patches["Tool_rent_increase_Title"] = "Rent Increase Calculator"
    patches["Tool_rent_increase_Description"] = (
        "Current rent, annual increase %, years → projected rent and total paid (educational)."
    )
    patches["Tool_nps_asset_allocation_Title"] = "NPS Asset Allocation Calculator"
    patches["Tool_nps_asset_allocation_Description"] = (
        "E/C/G % → validate sum 100 and blended expected return (educational)."
    )
    patches["Tool_health_insurance_port_Title"] = "Health Insurance Port Calculator"
    patches["Tool_health_insurance_port_Description"] = (
        "Waiting period leftover + sum-insured gap note when porting (educational)."
    )
    patches["Tool_variable_pay_tax_Title"] = "Variable Pay Tax Calculator"
    patches["Tool_variable_pay_tax_Description"] = (
        "Fixed + variable → tax with vs without variable at your slab (educational)."
    )
    patches["Tool_swp_tax_Title"] = "SWP Tax Calculator"
    patches["Tool_swp_tax_Description"] = (
        "Equity MF SWP withdrawal → rough capital gains tax on redeemed units (educational)."
    )
    patches["Tool_80ccd_nps_tax_benefit_Title"] = "80CCD NPS Tax Benefit Calculator"
    patches["Tool_80ccd_nps_tax_benefit_Description"] = (
        "Employee + employer NPS → 80CCD(1)/(1B)/(2) limits and estimated tax saving."
    )
    patches["Tool_80gg_rent_deduction_Title"] = "80GG Rent Deduction Calculator"
    patches["Tool_80gg_rent_deduction_Description"] = (
        "Section 80GG for tenants without HRA — least of ₹5K/mo, 25% ATI, or rent−10% ATI."
    )
    patches["Tool_in_hand_salary_Title"] = "In-Hand Salary Calculator"
    patches["Tool_in_hand_salary_Description"] = (
        "CTC to take-home with PF, PT, and tax — compare basic% and regime."
    )
    patches["Tool_debt_payoff_Title"] = "Debt Payoff Calculator"
    patches["Tool_debt_payoff_Description"] = (
        "One loan: months to clear with EMI + extra — snowball/avalanche label, interest saved."
    )
    patches["Tool_gold_etf_vs_sgb_Title"] = "Gold ETF vs SGB Calculator"
    patches["Tool_gold_etf_vs_sgb_Description"] = (
        "Same investment: SGB 2.5% interest + gold gain vs ETF after expense and LTCG."
    )
    patches["Tool_fd_ladder_Title"] = "FD Ladder Calculator"
    patches["Tool_fd_ladder_Description"] = (
        "Split a lump sum into N staggered FD rungs — maturity profile and average tenure."
    )
    patches["Tool_notice_period_buyout_Title"] = "Notice Period Buyout Calculator"
    patches["Tool_notice_period_buyout_Description"] = (
        "Remaining notice days × daily CTC → estimated buyout cost."
    )
    patches["Tool_nri_fd_Title"] = "NRI FD Calculator"
    patches["Tool_nri_fd_Description"] = (
        "NRE or NRO FD maturity from deposit, rate, and tenure — with NRO TDS note."
    )
    patches.setdefault(
        "Tool_fixed_deposit_Title",
        "FD Calculator",
    )
    patches.setdefault(
        "Tool_fixed_deposit_Description",
        "Fixed deposit maturity with compounding frequency and optional TDS estimate.",
    )

    for locale in LOCALES:
        path = MESSAGES / f"{locale}.json"
        data = load_json(path)
        data.update(patches)

        # Base locale overrides + batch-specific overrides
        for name in (
            f"{locale}.json",
            f"{locale}-batch-ppf-fd-tax.json",
            f"{locale}-batch-hra-gst-salary.json",
            f"{locale}-batch-home-gratuity-nps.json",
            f"{locale}-batch-rd-swp-elss.json",
            f"{locale}-batch-epf-ssy-scss.json",
            f"{locale}-batch-car-edu-stamp.json",
            f"{locale}-batch-pt-tds-apy.json",
            f"{locale}-batch-gold-cg-80c.json",
            f"{locale}-batch-pl-bl-mf.json",
            f"{locale}-batch-mis-flat-si.json",
            f"{locale}-batch-leave-da-adv.json",
            f"{locale}-batch-lap-2w-elig.json",
            f"{locale}-batch-80d-nsc-tsfd.json",
            f"{locale}-batch-ret-ef-hike.json",
            f"{locale}-batch-hi-rent-prepay.json",
            f"{locale}-batch-crypto-div-brok.json",
            f"{locale}-batch-tcs-tdsprop-rent.json",
            f"{locale}-batch-goalsip-stp-gold.json",
            f"{locale}-batch-cc-emirate-bt.json",
            f"{locale}-batch-age-forex-budget.json",
            f"{locale}-batch-cii-kvp-etc.json",
            f"{locale}-batch-renttax-xirr-etc.json",
            f"{locale}-batch-carins-rentagr-etc.json",
            f"{locale}-batch-nifty-re-lic.json",
            f"{locale}-batch-ssy-salneg-etc.json",
            f"{locale}-batch-presum-laf-etc.json",
            f"{locale}-batch-water-sgb-etc.json",
            f"{locale}-batch-hpi-234-etc.json",
            f"{locale}-batch-gst-epfo-etc.json",
            f"{locale}-batch-pension-ltcg-etc.json",
            f"{locale}-batch-ups-itr-esi.json",
            f"{locale}-batch-compound-crop-etc.json",
            f"{locale}-batch-senior-pmay-etc.json",
            f"{locale}-batch-pan-notice-etc.json",
            f"{locale}-batch-mudra-eshtram-etc.json",
            f"{locale}-batch-startup-yield-etc.json",
            f"{locale}-batch-80ccd-debt-etc.json",
            f"{locale}-batch-final-remaining.json",
            f"{locale}-batch-vishwa-swp-etc.json",
        ):
            override_path = OVERRIDES_DIR / name
            data.update(load_json(override_path))

        path.write_text(json.dumps(data, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
        print(f"Updated {locale}.json ({len(data)} keys)")

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
