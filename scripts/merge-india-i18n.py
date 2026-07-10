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
        ):
            override_path = OVERRIDES_DIR / name
            data.update(load_json(override_path))

        path.write_text(json.dumps(data, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
        print(f"Updated {locale}.json ({len(data)} keys)")

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
