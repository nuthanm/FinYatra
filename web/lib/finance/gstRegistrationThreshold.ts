/**
 * GST registration threshold — turnover vs 20L / 40L / 10L (educational).
 */

export type GstRegistrationCategory = "goods" | "services" | "special_category";

export type GstRegistrationThresholdInput = {
  annualTurnover: number;
  category: GstRegistrationCategory;
};

export type GstRegistrationThresholdResult = {
  annualTurnover: number;
  category: GstRegistrationCategory;
  threshold: number;
  registrationNeeded: boolean;
  /** How far above/below threshold. */
  gapToThreshold: number;
  thresholdLabel: "20L" | "40L" | "10L";
};

export const GST_THRESHOLD_GOODS = 40_00_000;
export const GST_THRESHOLD_SERVICES = 20_00_000;
export const GST_THRESHOLD_SPECIAL = 10_00_000;

export function gstThresholdFor(category: GstRegistrationCategory): {
  threshold: number;
  label: GstRegistrationThresholdResult["thresholdLabel"];
} {
  if (category === "goods") return { threshold: GST_THRESHOLD_GOODS, label: "40L" };
  if (category === "special_category") return { threshold: GST_THRESHOLD_SPECIAL, label: "10L" };
  return { threshold: GST_THRESHOLD_SERVICES, label: "20L" };
}

export function calculateGstRegistrationThreshold(
  input: GstRegistrationThresholdInput,
): GstRegistrationThresholdResult {
  const annualTurnover = Math.max(0, input.annualTurnover);
  const { threshold, label } = gstThresholdFor(input.category);
  const registrationNeeded = annualTurnover > threshold;
  const gapToThreshold = annualTurnover - threshold;

  return {
    annualTurnover,
    category: input.category,
    threshold,
    registrationNeeded,
    gapToThreshold,
    thresholdLabel: label,
  };
}
