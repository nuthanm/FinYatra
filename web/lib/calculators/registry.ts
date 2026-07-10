import type { ComponentType } from "react";
import { AdvanceTaxCalculator } from "@/components/calculators/AdvanceTaxCalculator";
import { AdvanceTaxDueDateCalculator } from "@/components/calculators/AdvanceTaxDueDateCalculator";
import { AgeCalculator } from "@/components/calculators/AgeCalculator";
import { HomeInsuranceCalculator } from "@/components/calculators/HomeInsuranceCalculator";
import { GratuityVsEpfCalculator } from "@/components/calculators/GratuityVsEpfCalculator";
import { IncomeFromOtherSourcesCalculator } from "@/components/calculators/IncomeFromOtherSourcesCalculator";
import { NpsVsPpfCalculator } from "@/components/calculators/NpsVsPpfCalculator";
import { NpsWithdrawalCalculator } from "@/components/calculators/NpsWithdrawalCalculator";
import { PmKisanCalculator } from "@/components/calculators/PmKisanCalculator";
import { PmaySubsidyCalculator } from "@/components/calculators/PmaySubsidyCalculator";
import { RentalYieldCalculator } from "@/components/calculators/RentalYieldCalculator";
import { RentIncreaseCalculator } from "@/components/calculators/RentIncreaseCalculator";
import { Section10ExemptionsCalculator } from "@/components/calculators/Section10ExemptionsCalculator";
import { Section80eEducationLoanCalculator } from "@/components/calculators/Section80eEducationLoanCalculator";
import { SeniorCitizenTaxCalculator } from "@/components/calculators/SeniorCitizenTaxCalculator";
import { SipVsLumpsumCalculator } from "@/components/calculators/SipVsLumpsumCalculator";
import { StandUpIndiaLoanCalculator } from "@/components/calculators/StandUpIndiaLoanCalculator";
import { StartupTaxCalculator } from "@/components/calculators/StartupTaxCalculator";
import { SwpTaxCalculator } from "@/components/calculators/SwpTaxCalculator";
import { TcsOnForeignRemittanceCalculator } from "@/components/calculators/TcsOnForeignRemittanceCalculator";
import { VariablePayTaxCalculator } from "@/components/calculators/VariablePayTaxCalculator";
import { DebtMfVsFdCalculator } from "@/components/calculators/DebtMfVsFdCalculator";
import { GstHsnCodeCalculator } from "@/components/calculators/GstHsnCodeCalculator";
import { HealthInsurancePortCalculator } from "@/components/calculators/HealthInsurancePortCalculator";
import { NpsAssetAllocationCalculator } from "@/components/calculators/NpsAssetAllocationCalculator";
import { PmVishwakarmaCalculator } from "@/components/calculators/PmVishwakarmaCalculator";
import { AgriculturalIncomeCalculator } from "@/components/calculators/AgriculturalIncomeCalculator";
import { AnnuityCalculator } from "@/components/calculators/AnnuityCalculator";
import { ApyVsNpsCalculator } from "@/components/calculators/ApyVsNpsCalculator";
import { AtalPensionCalculator } from "@/components/calculators/AtalPensionCalculator";
import { BonusCalculator } from "@/components/calculators/BonusCalculator";
import { BusinessLoanEmiCalculator } from "@/components/calculators/BusinessLoanEmiCalculator";
import { BrokerageCalculator } from "@/components/calculators/BrokerageCalculator";
import { CapitalGainsTaxCalculator } from "@/components/calculators/CapitalGainsTaxCalculator";
import { CarInsuranceCalculator } from "@/components/calculators/CarInsuranceCalculator";
import { CarLoanEmiCalculator } from "@/components/calculators/CarLoanEmiCalculator";
import { ChildEducationCalculator } from "@/components/calculators/ChildEducationCalculator";
import { CostInflationIndexCalculator } from "@/components/calculators/CostInflationIndexCalculator";
import { CreditCardEmiCalculator } from "@/components/calculators/CreditCardEmiCalculator";
import { CryptoTaxCalculator } from "@/components/calculators/CryptoTaxCalculator";
import { DividendTaxCalculator } from "@/components/calculators/DividendTaxCalculator";
import { DividendYieldCalculator } from "@/components/calculators/DividendYieldCalculator";
import { DaCalculator } from "@/components/calculators/DaCalculator";
import { DaArrearsCalculator } from "@/components/calculators/DaArrearsCalculator";
import { ElssCalculator } from "@/components/calculators/ElssCalculator";
import { EsiCalculator } from "@/components/calculators/EsiCalculator";
import { FloatingRateSavingsBondCalculator } from "@/components/calculators/FloatingRateSavingsBondCalculator";
import { IncomeTaxRefundCalculator } from "@/components/calculators/IncomeTaxRefundCalculator";
import { LoanAgainstFdCalculator } from "@/components/calculators/LoanAgainstFdCalculator";
import { MutualFundTaxCalculator } from "@/components/calculators/MutualFundTaxCalculator";
import { PresumptiveTaxCalculator } from "@/components/calculators/PresumptiveTaxCalculator";
import { EducationLoanCalculator } from "@/components/calculators/EducationLoanCalculator";
import { ElectricityBillCalculator } from "@/components/calculators/ElectricityBillCalculator";
import { ElectricVehicleCalculator } from "@/components/calculators/ElectricVehicleCalculator";
import { EmergencyFundCalculator } from "@/components/calculators/EmergencyFundCalculator";
import { EmiToRateCalculator } from "@/components/calculators/EmiToRateCalculator";
import { EpfCalculator } from "@/components/calculators/EpfCalculator";
import { EpfWithdrawalCalculator } from "@/components/calculators/EpfWithdrawalCalculator";
import { FdLadderingCalculator } from "@/components/calculators/FdLadderingCalculator";
import { FireCalculator } from "@/components/calculators/FireCalculator";
import { FixedDepositCalculator } from "@/components/calculators/FixedDepositCalculator";
import { FlatVsReducingRateCalculator } from "@/components/calculators/FlatVsReducingRateCalculator";
import { ForexCalculator } from "@/components/calculators/ForexCalculator";
import { FreelancerTaxCalculator } from "@/components/calculators/FreelancerTaxCalculator";
import { GiftTaxCalculator } from "@/components/calculators/GiftTaxCalculator";
import { GoalPlanner } from "@/components/calculators/GoalPlanner";
import { GoalSipCalculator } from "@/components/calculators/GoalSipCalculator";
import { GoldInvestmentCalculator } from "@/components/calculators/GoldInvestmentCalculator";
import { GoldLoanCalculator } from "@/components/calculators/GoldLoanCalculator";
import { GratuityCalculator } from "@/components/calculators/GratuityCalculator";
import { GstCalculator } from "@/components/calculators/GstCalculator";
import { GstItcCalculator } from "@/components/calculators/GstItcCalculator";
import { GstReverseChargeCalculator } from "@/components/calculators/GstReverseChargeCalculator";
import { HealthInsuranceCalculator } from "@/components/calculators/HealthInsuranceCalculator";
import { HomeLoanEligibilityCalculator } from "@/components/calculators/HomeLoanEligibilityCalculator";
import { HomeLoanEmiCalculator } from "@/components/calculators/HomeLoanEmiCalculator";
import { HomeLoanPrepaymentCalculator } from "@/components/calculators/HomeLoanPrepaymentCalculator";
import { HomeLoanTaxBenefitCalculator } from "@/components/calculators/HomeLoanTaxBenefitCalculator";
import { HousePropertyIncomeCalculator } from "@/components/calculators/HousePropertyIncomeCalculator";
import { HraCalculator } from "@/components/calculators/HraCalculator";
import { IndiaCompoundInterestCalculator } from "@/components/calculators/IndiaCompoundInterestCalculator";
import { InterestPenalty234Calculator } from "@/components/calculators/InterestPenalty234Calculator";
import { InterestRateConverterCalculator } from "@/components/calculators/InterestRateConverterCalculator";
import { ItrFormCalculator } from "@/components/calculators/ItrFormCalculator";
import { RentReceiptCalculator } from "@/components/calculators/RentReceiptCalculator";
import { LoanAgainstPropertyCalculator } from "@/components/calculators/LoanAgainstPropertyCalculator";
import { LoanBalanceTransferCalculator } from "@/components/calculators/LoanBalanceTransferCalculator";
import { IncomeTaxCalculator } from "@/components/calculators/IncomeTaxCalculator";
import { IncomeTaxNoticeCalculator } from "@/components/calculators/IncomeTaxNoticeCalculator";
import { InflationCalculator } from "@/components/calculators/InflationCalculator";
import { KisanVikasPatraCalculator } from "@/components/calculators/KisanVikasPatraCalculator";
import { LeaveEncashmentCalculator } from "@/components/calculators/LeaveEncashmentCalculator";
import { LicPremiumCalculator } from "@/components/calculators/LicPremiumCalculator";
import { LtaCalculator } from "@/components/calculators/LtaCalculator";
import { LtcgCalculator } from "@/components/calculators/LtcgCalculator";
import { LumpsumCalculator } from "@/components/calculators/LumpsumCalculator";
import { MahilaSammanCalculator } from "@/components/calculators/MahilaSammanCalculator";
import { MarriageBudgetCalculator } from "@/components/calculators/MarriageBudgetCalculator";
import { MfOverlapCalculator } from "@/components/calculators/MfOverlapCalculator";
import { MonthlyBudgetCalculator } from "@/components/calculators/MonthlyBudgetCalculator";
import { MortgageCalculator } from "@/components/calculators/MortgageCalculator";
import { MutualFundReturnsCalculator } from "@/components/calculators/MutualFundReturnsCalculator";
import { NetWorthCalculator } from "@/components/calculators/NetWorthCalculator";
import { Nifty50ReturnsCalculator } from "@/components/calculators/Nifty50ReturnsCalculator";
import { NpsCalculator } from "@/components/calculators/NpsCalculator";
import { NpsTier2Calculator } from "@/components/calculators/NpsTier2Calculator";
import { NpsVsOpsCalculator } from "@/components/calculators/NpsVsOpsCalculator";
import { NriTaxCalculator } from "@/components/calculators/NriTaxCalculator";
import { PanAadhaarLinkCalculator } from "@/components/calculators/PanAadhaarLinkCalculator";
import { PanPenaltyCalculator } from "@/components/calculators/PanPenaltyCalculator";
import { PartnershipFirmTaxCalculator } from "@/components/calculators/PartnershipFirmTaxCalculator";
import { PayCommissionCalculator } from "@/components/calculators/PayCommissionCalculator";
import { PensionCommutationCalculator } from "@/components/calculators/PensionCommutationCalculator";
import { PersonalLoanEmiCalculator } from "@/components/calculators/PersonalLoanEmiCalculator";
import { PostOfficeMisCalculator } from "@/components/calculators/PostOfficeMisCalculator";
import { PpfCalculator } from "@/components/calculators/PpfCalculator";
import { PpfWithdrawalCalculator } from "@/components/calculators/PpfWithdrawalCalculator";
import { ProfessionalTaxCalculator } from "@/components/calculators/ProfessionalTaxCalculator";
import { PropertyRegistrationCalculator } from "@/components/calculators/PropertyRegistrationCalculator";
import { RdCalculator } from "@/components/calculators/RdCalculator";
import { RealEstateCalculator } from "@/components/calculators/RealEstateCalculator";
import { ReitsInvitsTaxCalculator } from "@/components/calculators/ReitsInvitsTaxCalculator";
import { RentAgreementCalculator } from "@/components/calculators/RentAgreementCalculator";
import { RentalIncomeTaxCalculator } from "@/components/calculators/RentalIncomeTaxCalculator";
import { RetirementCalculator } from "@/components/calculators/RetirementCalculator";
import { SalaryArrearsReliefCalculator } from "@/components/calculators/SalaryArrearsReliefCalculator";
import { SalaryCalculator } from "@/components/calculators/SalaryCalculator";
import { SalaryHikeCalculator } from "@/components/calculators/SalaryHikeCalculator";
import { SavingsAccountInterestCalculator } from "@/components/calculators/SavingsAccountInterestCalculator";
import { ScssCalculator } from "@/components/calculators/ScssCalculator";
import { SeniorCitizenFdCalculator } from "@/components/calculators/SeniorCitizenFdCalculator";
import { SovereignGoldBondCalculator } from "@/components/calculators/SovereignGoldBondCalculator";
import { Section80cCalculator } from "@/components/calculators/Section80cCalculator";
import { Section80dCalculator } from "@/components/calculators/Section80dCalculator";
import { Section80ddbCalculator } from "@/components/calculators/Section80ddbCalculator";
import { Section80gDonationCalculator } from "@/components/calculators/Section80gDonationCalculator";
import { Section80ttaCalculator } from "@/components/calculators/Section80ttaCalculator";
import { Section80uCalculator } from "@/components/calculators/Section80uCalculator";
import { SimpleInterestCalculator } from "@/components/calculators/SimpleInterestCalculator";
import { SipCalculator } from "@/components/calculators/SipCalculator";
import { StampDutyCalculator } from "@/components/calculators/StampDutyCalculator";
import { StcgCalculator } from "@/components/calculators/StcgCalculator";
import { StpCalculator } from "@/components/calculators/StpCalculator";
import { SukanyaSamriddhiCalculator } from "@/components/calculators/SukanyaSamriddhiCalculator";
import { SsyWithdrawalCalculator } from "@/components/calculators/SsyWithdrawalCalculator";
import { SalaryNegotiationCalculator } from "@/components/calculators/SalaryNegotiationCalculator";
import { MaternityBenefitCalculator } from "@/components/calculators/MaternityBenefitCalculator";
import { MotorInsuranceNcbCalculator } from "@/components/calculators/MotorInsuranceNcbCalculator";
import { PostOfficeTdCalculator } from "@/components/calculators/PostOfficeTdCalculator";
import { HomeRenovationCalculator } from "@/components/calculators/HomeRenovationCalculator";
import { InternationalEquityTaxCalculator } from "@/components/calculators/InternationalEquityTaxCalculator";
import { SwpCalculator } from "@/components/calculators/SwpCalculator";
import { TaxSavingFdCalculator } from "@/components/calculators/TaxSavingFdCalculator";
import { TaxLossHarvestingCalculator } from "@/components/calculators/TaxLossHarvestingCalculator";
import { TcsCalculator } from "@/components/calculators/TcsCalculator";
import { UlipSurrenderCalculator } from "@/components/calculators/UlipSurrenderCalculator";
import { UnderConstructionEmiCalculator } from "@/components/calculators/UnderConstructionEmiCalculator";
import { DtaaCalculator } from "@/components/calculators/DtaaCalculator";
import { CreditScoreSimulatorCalculator } from "@/components/calculators/CreditScoreSimulatorCalculator";
import { GstRegistrationThresholdCalculator } from "@/components/calculators/GstRegistrationThresholdCalculator";
import { TdsCalculator } from "@/components/calculators/TdsCalculator";
import { TdsOnPropertyCalculator } from "@/components/calculators/TdsOnPropertyCalculator";
import { TdsOnRentCalculator } from "@/components/calculators/TdsOnRentCalculator";
import { TdsOnSalaryCalculator } from "@/components/calculators/TdsOnSalaryCalculator";
import { TermInsuranceCalculator } from "@/components/calculators/TermInsuranceCalculator";
import { TwoWheelerLoanCalculator } from "@/components/calculators/TwoWheelerLoanCalculator";
import { UpsCalculator } from "@/components/calculators/UpsCalculator";
import { WaterBillCalculator } from "@/components/calculators/WaterBillCalculator";
import { GstAnnualReturnCalculator } from "@/components/calculators/GstAnnualReturnCalculator";
import { EpfoPassbookCalculator } from "@/components/calculators/EpfoPassbookCalculator";
import { LeaveTravelAllowanceCalculator } from "@/components/calculators/LeaveTravelAllowanceCalculator";
import { PostOfficeSavingsCalculator } from "@/components/calculators/PostOfficeSavingsCalculator";
import { CentralGovtSalarySlipCalculator } from "@/components/calculators/CentralGovtSalarySlipCalculator";
import { SsyVsPpfCalculator } from "@/components/calculators/SsyVsPpfCalculator";
import { PowerOfCompoundingCalculator } from "@/components/calculators/PowerOfCompoundingCalculator";
import { CropInsuranceCalculator } from "@/components/calculators/CropInsuranceCalculator";
import { AyushmanBharatCalculator } from "@/components/calculators/AyushmanBharatCalculator";
import { HraVsHomeLoanCalculator } from "@/components/calculators/HraVsHomeLoanCalculator";
import { EmployeeCompensationCalculator } from "@/components/calculators/EmployeeCompensationCalculator";
import { SukanyaVsLicCalculator } from "@/components/calculators/SukanyaVsLicCalculator";
import { NscCalculator } from "@/components/calculators/NscCalculator";
import { CagrCalculator } from "@/components/calculators/CagrCalculator";
import { CompoundInterestCalculator } from "@/components/calculators/CompoundInterestCalculator";
import { EmiCalculator } from "@/components/calculators/EmiCalculator";
import { XirrCalculator } from "@/components/calculators/XirrCalculator";
import { MudraLoanCalculator } from "@/components/calculators/MudraLoanCalculator";
import { GstEInvoiceCalculator } from "@/components/calculators/GstEInvoiceCalculator";
import { NriHomeLoanCalculator } from "@/components/calculators/NriHomeLoanCalculator";
import { PropertyCapitalGainsCalculator } from "@/components/calculators/PropertyCapitalGainsCalculator";
import { Form26asReconciliationCalculator } from "@/components/calculators/Form26asReconciliationCalculator";
import { EShramCalculator } from "@/components/calculators/EShramCalculator";
import { EpfVsPpfCalculator } from "@/components/calculators/EpfVsPpfCalculator";
import { NpsTaxBenefit80ccdCalculator } from "@/components/calculators/NpsTaxBenefit80ccdCalculator";
import { Section80ggCalculator } from "@/components/calculators/Section80ggCalculator";
import { InHandSalaryCalculator } from "@/components/calculators/InHandSalaryCalculator";
import { DebtPayoffCalculator } from "@/components/calculators/DebtPayoffCalculator";
import { GoldEtfVsSgbCalculator } from "@/components/calculators/GoldEtfVsSgbCalculator";
import { FdLadderCalculator } from "@/components/calculators/FdLadderCalculator";
import { NoticePeriodBuyoutCalculator } from "@/components/calculators/NoticePeriodBuyoutCalculator";
import { NriFdCalculator } from "@/components/calculators/NriFdCalculator";

export type CalculatorComponent = ComponentType;

const LIVE_CALCULATORS: Record<string, CalculatorComponent> = {
  goal: GoalPlanner,
  fire: FireCalculator,
  fd: FdLadderingCalculator,
  sip: SipCalculator,
  cagr: CagrCalculator,
  lumpsum: LumpsumCalculator,
  emi: EmiCalculator,
  mortgage: MortgageCalculator,
  inflation: InflationCalculator,
  interest: CompoundInterestCalculator,
  ppf: PpfCalculator,
  "fixed-deposit": FixedDepositCalculator,
  "income-tax": IncomeTaxCalculator,
  hra: HraCalculator,
  gst: GstCalculator,
  salary: SalaryCalculator,
  "home-loan-emi": HomeLoanEmiCalculator,
  gratuity: GratuityCalculator,
  nps: NpsCalculator,
  rd: RdCalculator,
  swp: SwpCalculator,
  elss: ElssCalculator,
  epf: EpfCalculator,
  "sukanya-samriddhi": SukanyaSamriddhiCalculator,
  scss: ScssCalculator,
  "car-loan-emi": CarLoanEmiCalculator,
  "education-loan": EducationLoanCalculator,
  "stamp-duty": StampDutyCalculator,
  "professional-tax": ProfessionalTaxCalculator,
  tds: TdsCalculator,
  tcs: TcsCalculator,
  "tds-on-property": TdsOnPropertyCalculator,
  "tds-on-rent": TdsOnRentCalculator,
  "atal-pension": AtalPensionCalculator,
  "goal-sip": GoalSipCalculator,
  "gold-investment": GoldInvestmentCalculator,
  "gold-loan": GoldLoanCalculator,
  stp: StpCalculator,
  "capital-gains-tax": CapitalGainsTaxCalculator,
  "crypto-tax": CryptoTaxCalculator,
  "dividend-yield": DividendYieldCalculator,
  brokerage: BrokerageCalculator,
  "section-80c": Section80cCalculator,
  "section-80d": Section80dCalculator,
  nsc: NscCalculator,
  "tax-saving-fd": TaxSavingFdCalculator,
  "personal-loan-emi": PersonalLoanEmiCalculator,
  "business-loan-emi": BusinessLoanEmiCalculator,
  "mutual-fund-returns": MutualFundReturnsCalculator,
  "post-office-mis": PostOfficeMisCalculator,
  "flat-vs-reducing-rate": FlatVsReducingRateCalculator,
  "simple-interest": SimpleInterestCalculator,
  "leave-encashment": LeaveEncashmentCalculator,
  da: DaCalculator,
  "advance-tax": AdvanceTaxCalculator,
  "loan-against-property": LoanAgainstPropertyCalculator,
  "two-wheeler-loan": TwoWheelerLoanCalculator,
  "home-loan-eligibility": HomeLoanEligibilityCalculator,
  retirement: RetirementCalculator,
  "emergency-fund": EmergencyFundCalculator,
  "salary-hike": SalaryHikeCalculator,
  "health-insurance": HealthInsuranceCalculator,
  "rent-receipt": RentReceiptCalculator,
  "home-loan-prepayment": HomeLoanPrepaymentCalculator,
  "credit-card-emi": CreditCardEmiCalculator,
  "emi-to-rate": EmiToRateCalculator,
  "loan-balance-transfer": LoanBalanceTransferCalculator,
  age: AgeCalculator,
  forex: ForexCalculator,
  "monthly-budget": MonthlyBudgetCalculator,
  "net-worth": NetWorthCalculator,
  "child-education": ChildEducationCalculator,
  "80g-donation": Section80gDonationCalculator,
  "cost-inflation-index": CostInflationIndexCalculator,
  "kisan-vikas-patra": KisanVikasPatraCalculator,
  "mahila-samman": MahilaSammanCalculator,
  annuity: AnnuityCalculator,
  "interest-rate-converter": InterestRateConverterCalculator,
  lta: LtaCalculator,
  "car-insurance": CarInsuranceCalculator,
  "rent-agreement": RentAgreementCalculator,
  "compound-interest": IndiaCompoundInterestCalculator,
  "ppf-withdrawal": PpfWithdrawalCalculator,
  "mf-overlap": MfOverlapCalculator,
  "pan-aadhaar-link": PanAadhaarLinkCalculator,
  "rental-income-tax": RentalIncomeTaxCalculator,
  "epf-withdrawal": EpfWithdrawalCalculator,
  xirr: XirrCalculator,
  "electricity-bill": ElectricityBillCalculator,
  "freelancer-tax": FreelancerTaxCalculator,
  "gift-tax": GiftTaxCalculator,
  "nifty-50-returns": Nifty50ReturnsCalculator,
  "real-estate": RealEstateCalculator,
  "lic-premium": LicPremiumCalculator,
  "nps-vs-ops": NpsVsOpsCalculator,
  "marriage-budget": MarriageBudgetCalculator,
  "electric-vehicle": ElectricVehicleCalculator,
  "ssy-withdrawal": SsyWithdrawalCalculator,
  "salary-negotiation": SalaryNegotiationCalculator,
  "maternity-benefit": MaternityBenefitCalculator,
  "post-office-td": PostOfficeTdCalculator,
  "home-renovation": HomeRenovationCalculator,
  "section-80tta": Section80ttaCalculator,
  "presumptive-tax": PresumptiveTaxCalculator,
  "loan-against-fd": LoanAgainstFdCalculator,
  "da-arrears": DaArrearsCalculator,
  "floating-rate-savings-bond": FloatingRateSavingsBondCalculator,
  "mutual-fund-tax": MutualFundTaxCalculator,
  "income-tax-refund": IncomeTaxRefundCalculator,
  "water-bill": WaterBillCalculator,
  "savings-account-interest": SavingsAccountInterestCalculator,
  "sovereign-gold-bond": SovereignGoldBondCalculator,
  "senior-citizen-fd": SeniorCitizenFdCalculator,
  "term-insurance": TermInsuranceCalculator,
  "nri-tax": NriTaxCalculator,
  "house-property-income": HousePropertyIncomeCalculator,
  "interest-penalty-234": InterestPenalty234Calculator,
  "agricultural-income": AgriculturalIncomeCalculator,
  bonus: BonusCalculator,
  "salary-arrears-relief": SalaryArrearsReliefCalculator,
  "pay-commission": PayCommissionCalculator,
  "gst-annual-return": GstAnnualReturnCalculator,
  "epfo-passbook": EpfoPassbookCalculator,
  "leave-travel-allowance": LeaveTravelAllowanceCalculator,
  "post-office-savings": PostOfficeSavingsCalculator,
  "central-govt-salary-slip": CentralGovtSalarySlipCalculator,
  "ssy-vs-ppf": SsyVsPpfCalculator,
  "pension-commutation": PensionCommutationCalculator,
  "home-loan-tax-benefit": HomeLoanTaxBenefitCalculator,
  ltcg: LtcgCalculator,
  stcg: StcgCalculator,
  "tax-loss-harvesting": TaxLossHarvestingCalculator,
  "advance-tax-due-date": AdvanceTaxDueDateCalculator,
  ups: UpsCalculator,
  "itr-form": ItrFormCalculator,
  "gst-itc": GstItcCalculator,
  esi: EsiCalculator,
  "dividend-tax": DividendTaxCalculator,
  "nps-tier-2": NpsTier2Calculator,
  "power-of-compounding": PowerOfCompoundingCalculator,
  "crop-insurance": CropInsuranceCalculator,
  "ayushman-bharat": AyushmanBharatCalculator,
  "hra-vs-home-loan": HraVsHomeLoanCalculator,
  "employee-compensation": EmployeeCompensationCalculator,
  "sukanya-vs-lic": SukanyaVsLicCalculator,
  "senior-citizen-tax": SeniorCitizenTaxCalculator,
  "nps-withdrawal": NpsWithdrawalCalculator,
  "pm-kisan": PmKisanCalculator,
  "pmay-subsidy": PmaySubsidyCalculator,
  "sip-vs-lumpsum": SipVsLumpsumCalculator,
  "home-insurance": HomeInsuranceCalculator,
  "pan-penalty": PanPenaltyCalculator,
  "income-tax-notice": IncomeTaxNoticeCalculator,
  "tds-on-salary": TdsOnSalaryCalculator,
  "gst-reverse-charge": GstReverseChargeCalculator,
  "apy-vs-nps": ApyVsNpsCalculator,
  "property-registration": PropertyRegistrationCalculator,
  "mudra-loan": MudraLoanCalculator,
  "gst-e-invoice": GstEInvoiceCalculator,
  "nri-home-loan": NriHomeLoanCalculator,
  "property-capital-gains": PropertyCapitalGainsCalculator,
  "form-26as-reconciliation": Form26asReconciliationCalculator,
  "e-shram": EShramCalculator,
  "epf-vs-ppf": EpfVsPpfCalculator,
  "startup-tax": StartupTaxCalculator,
  "gratuity-vs-epf": GratuityVsEpfCalculator,
  "income-from-other-sources": IncomeFromOtherSourcesCalculator,
  "nps-vs-ppf": NpsVsPpfCalculator,
  "tcs-on-foreign-remittance": TcsOnForeignRemittanceCalculator,
  "rental-yield": RentalYieldCalculator,
  "pm-vishwakarma": PmVishwakarmaCalculator,
  "stand-up-india-loan": StandUpIndiaLoanCalculator,
  "debt-mf-vs-fd": DebtMfVsFdCalculator,
  "80e-education-loan-interest": Section80eEducationLoanCalculator,
  "section-10-exemptions": Section10ExemptionsCalculator,
  "gst-hsn-code": GstHsnCodeCalculator,
  "rent-increase": RentIncreaseCalculator,
  "nps-asset-allocation": NpsAssetAllocationCalculator,
  "health-insurance-port": HealthInsurancePortCalculator,
  "variable-pay-tax": VariablePayTaxCalculator,
  "swp-tax": SwpTaxCalculator,
  "80ccd-nps-tax-benefit": NpsTaxBenefit80ccdCalculator,
  "80gg-rent-deduction": Section80ggCalculator,
  "in-hand-salary": InHandSalaryCalculator,
  "debt-payoff": DebtPayoffCalculator,
  "gold-etf-vs-sgb": GoldEtfVsSgbCalculator,
  "fd-ladder": FdLadderCalculator,
  "notice-period-buyout": NoticePeriodBuyoutCalculator,
  "nri-fd": NriFdCalculator,
  dtaa: DtaaCalculator,
  "80ddb-medical-expense": Section80ddbCalculator,
  "80u-disability-deduction": Section80uCalculator,
  "ulip-surrender": UlipSurrenderCalculator,
  "motor-insurance-ncb": MotorInsuranceNcbCalculator,
  "under-construction-emi": UnderConstructionEmiCalculator,
  "credit-score-simulator": CreditScoreSimulatorCalculator,
  "gst-registration-threshold": GstRegistrationThresholdCalculator,
  "international-equity-tax": InternationalEquityTaxCalculator,
  "reits-invits-tax": ReitsInvitsTaxCalculator,
  "partnership-firm-tax": PartnershipFirmTaxCalculator,
};

export function getCalculatorComponent(key: string): CalculatorComponent | undefined {
  return LIVE_CALCULATORS[key];
}

export function liveCalculatorKeys(): string[] {
  return Object.keys(LIVE_CALCULATORS);
}
