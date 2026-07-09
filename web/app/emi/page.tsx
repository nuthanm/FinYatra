import { EmiCalculator } from "@/components/calculators/EmiCalculator";
import { toolMetadata } from "@/lib/seo/metadata";

export const metadata = toolMetadata("Tool_emi_Title", "Tool_emi_Description");

export default function EmiPage() {
  return <EmiCalculator />;
}
