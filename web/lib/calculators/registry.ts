import type { ComponentType } from "react";
import { AdvanceTaxCalculator } from "@/components/calculators/AdvanceTaxCalculator";
import { AgeCalculator } from "@/components/calculators/AgeCalculator";
import { AnnuityCalculator } from "@/components/calculators/AnnuityCalculator";
import { AtalPensionCalculator } from "@/components/calculators/AtalPensionCalculator";
import { BusinessLoanEmiCalculator } from "@/components/calculators/BusinessLoanEmiCalculator";
import { BrokerageCalculator } from "@/components/calculators/BrokerageCalculator";
import { CapitalGainsTaxCalculator } from "@/components/calculators/CapitalGainsTaxCalculator";
import { CarInsuranceCalculator } from "@/components/calculators/CarInsuranceCalculator";
import { CarLoanEmiCalculator } from "@/components/calculators/CarLoanEmiCalculator";
import { ChildEducationCalculator } from "@/components/calculators/ChildEducationCalculator";
import { CostInflationIndexCalculator } from "@/components/calculators/CostInflationIndexCalculator";
import { CreditCardEmiCalculator } from "@/components/calculators/CreditCardEmiCalculator";
import { CryptoTaxCalculator } from "@/components/calculators/CryptoTaxCalculator";
import { DividendYieldCalculator } from "@/components/calculators/DividendYieldCalculator";
import { DaCalculator } from "@/components/calculators/DaCalculator";
import { ElssCalculator } from "@/components/calculators/ElssCalculator";
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
import { HealthInsuranceCalculator } from "@/components/calculators/HealthInsuranceCalculator";
import { HomeLoanEligibilityCalculator } from "@/components/calculators/HomeLoanEligibilityCalculator";
import { HomeLoanEmiCalculator } from "@/components/calculators/HomeLoanEmiCalculator";
import { HomeLoanPrepaymentCalculator } from "@/components/calculators/HomeLoanPrepaymentCalculator";
import { HraCalculator } from "@/components/calculators/HraCalculator";
import { IndiaCompoundInterestCalculator } from "@/components/calculators/IndiaCompoundInterestCalculator";
import { InterestRateConverterCalculator } from "@/components/calculators/InterestRateConverterCalculator";
import { RentReceiptCalculator } from "@/components/calculators/RentReceiptCalculator";
import { LoanAgainstPropertyCalculator } from "@/components/calculators/LoanAgainstPropertyCalculator";
import { LoanBalanceTransferCalculator } from "@/components/calculators/LoanBalanceTransferCalculator";
import { IncomeTaxCalculator } from "@/components/calculators/IncomeTaxCalculator";
import { InflationCalculator } from "@/components/calculators/InflationCalculator";
import { KisanVikasPatraCalculator } from "@/components/calculators/KisanVikasPatraCalculator";
import { LeaveEncashmentCalculator } from "@/components/calculators/LeaveEncashmentCalculator";
import { LicPremiumCalculator } from "@/components/calculators/LicPremiumCalculator";
import { LtaCalculator } from "@/components/calculators/LtaCalculator";
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
import { NpsVsOpsCalculator } from "@/components/calculators/NpsVsOpsCalculator";
import { PanAadhaarLinkCalculator } from "@/components/calculators/PanAadhaarLinkCalculator";
import { PersonalLoanEmiCalculator } from "@/components/calculators/PersonalLoanEmiCalculator";
import { PostOfficeMisCalculator } from "@/components/calculators/PostOfficeMisCalculator";
import { PpfCalculator } from "@/components/calculators/PpfCalculator";
import { PpfWithdrawalCalculator } from "@/components/calculators/PpfWithdrawalCalculator";
import { ProfessionalTaxCalculator } from "@/components/calculators/ProfessionalTaxCalculator";
import { RdCalculator } from "@/components/calculators/RdCalculator";
import { RealEstateCalculator } from "@/components/calculators/RealEstateCalculator";
import { RentAgreementCalculator } from "@/components/calculators/RentAgreementCalculator";
import { RentalIncomeTaxCalculator } from "@/components/calculators/RentalIncomeTaxCalculator";
import { RetirementCalculator } from "@/components/calculators/RetirementCalculator";
import { SalaryCalculator } from "@/components/calculators/SalaryCalculator";
import { SalaryHikeCalculator } from "@/components/calculators/SalaryHikeCalculator";
import { ScssCalculator } from "@/components/calculators/ScssCalculator";
import { Section80cCalculator } from "@/components/calculators/Section80cCalculator";
import { Section80dCalculator } from "@/components/calculators/Section80dCalculator";
import { Section80gDonationCalculator } from "@/components/calculators/Section80gDonationCalculator";
import { SimpleInterestCalculator } from "@/components/calculators/SimpleInterestCalculator";
import { SipCalculator } from "@/components/calculators/SipCalculator";
import { StampDutyCalculator } from "@/components/calculators/StampDutyCalculator";
import { StpCalculator } from "@/components/calculators/StpCalculator";
import { SukanyaSamriddhiCalculator } from "@/components/calculators/SukanyaSamriddhiCalculator";
import { SwpCalculator } from "@/components/calculators/SwpCalculator";
import { TaxSavingFdCalculator } from "@/components/calculators/TaxSavingFdCalculator";
import { TcsCalculator } from "@/components/calculators/TcsCalculator";
import { TdsCalculator } from "@/components/calculators/TdsCalculator";
import { TdsOnPropertyCalculator } from "@/components/calculators/TdsOnPropertyCalculator";
import { TdsOnRentCalculator } from "@/components/calculators/TdsOnRentCalculator";
import { TwoWheelerLoanCalculator } from "@/components/calculators/TwoWheelerLoanCalculator";
import { NscCalculator } from "@/components/calculators/NscCalculator";
import { CagrCalculator } from "@/components/calculators/CagrCalculator";
import { CompoundInterestCalculator } from "@/components/calculators/CompoundInterestCalculator";
import { EmiCalculator } from "@/components/calculators/EmiCalculator";
import { XirrCalculator } from "@/components/calculators/XirrCalculator";

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
};

export function getCalculatorComponent(key: string): CalculatorComponent | undefined {
  return LIVE_CALCULATORS[key];
}

export function liveCalculatorKeys(): string[] {
  return Object.keys(LIVE_CALCULATORS);
}
