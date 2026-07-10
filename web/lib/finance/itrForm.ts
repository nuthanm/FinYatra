/** Educational ITR form suggestion from income-source checklist (not filing advice). */

export type ItrFormSources = {
  salaryOrPension: boolean;
  oneHouseProperty: boolean;
  moreThanOneHouse: boolean;
  otherSourcesInterest: boolean;
  capitalGains: boolean;
  businessProfession: boolean;
  presumptiveBusiness: boolean;
  foreignIncomeOrAssets: boolean;
  directorOrUnlistedEquity: boolean;
  /** Total income roughly above ₹50 lakh (ITR-1 limit). */
  incomeAbove50L: boolean;
};

export type ItrFormCode = "ITR-1" | "ITR-2" | "ITR-3" | "ITR-4";

export type ItrFormResult = {
  suggested: ItrFormCode;
  reasons: string[];
  sources: ItrFormSources;
};

/**
 * Priority: ITR-3 (non-presumptive business) → ITR-4 (presumptive) →
 * ITR-2 (CG / multi-HP / foreign / director / >50L) → ITR-1 (simple salary path).
 */
export function suggestItrForm(sources: ItrFormSources): ItrFormResult {
  const reasons: string[] = [];

  if (sources.businessProfession && !sources.presumptiveBusiness) {
    reasons.push("business_non_presumptive");
    return { suggested: "ITR-3", reasons, sources };
  }

  if (sources.presumptiveBusiness) {
    reasons.push("presumptive");
    if (sources.capitalGains || sources.foreignIncomeOrAssets || sources.directorOrUnlistedEquity) {
      reasons.push("complex_with_presumptive");
      return { suggested: "ITR-3", reasons, sources };
    }
    return { suggested: "ITR-4", reasons, sources };
  }

  const needsItr2 =
    sources.capitalGains ||
    sources.moreThanOneHouse ||
    sources.foreignIncomeOrAssets ||
    sources.directorOrUnlistedEquity ||
    sources.incomeAbove50L;

  if (needsItr2) {
    if (sources.capitalGains) reasons.push("capital_gains");
    if (sources.moreThanOneHouse) reasons.push("multi_hp");
    if (sources.foreignIncomeOrAssets) reasons.push("foreign");
    if (sources.directorOrUnlistedEquity) reasons.push("director");
    if (sources.incomeAbove50L) reasons.push("above_50l");
    return { suggested: "ITR-2", reasons, sources };
  }

  if (sources.salaryOrPension || sources.oneHouseProperty || sources.otherSourcesInterest) {
    reasons.push("simple_salary_path");
    return { suggested: "ITR-1", reasons, sources };
  }

  reasons.push("default_itr2");
  return { suggested: "ITR-2", reasons, sources };
}
