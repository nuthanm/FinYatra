/**
 * PM-Kisan Samman Nidhi — ₹6,000/year in 3 instalments (educational eligibility display).
 */

export const PM_KISAN_ANNUAL = 6_000;
export const PM_KISAN_INSTALLMENTS = 3;
export const PM_KISAN_PER_INSTALLMENT = PM_KISAN_ANNUAL / PM_KISAN_INSTALLMENTS;

export type PmKisanInput = {
  /** Whether the farmer meets simplified eligibility. */
  eligible: boolean;
};

export type PmKisanInstallment = {
  index: number;
  amount: number;
  label: string;
};

export type PmKisanResult = {
  eligible: boolean;
  annualBenefit: number;
  installmentAmount: number;
  installmentCount: number;
  installments: PmKisanInstallment[];
};

export function calculatePmKisan(input: PmKisanInput): PmKisanResult {
  const eligible = Boolean(input.eligible);
  const annualBenefit = eligible ? PM_KISAN_ANNUAL : 0;
  const installmentAmount = eligible ? PM_KISAN_PER_INSTALLMENT : 0;
  const installments: PmKisanInstallment[] = [1, 2, 3].map((index) => ({
    index,
    amount: installmentAmount,
    label: `Installment ${index}`,
  }));

  return {
    eligible,
    annualBenefit,
    installmentAmount,
    installmentCount: PM_KISAN_INSTALLMENTS,
    installments,
  };
}
