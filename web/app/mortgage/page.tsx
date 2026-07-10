import { MortgageCalculator } from "@/components/calculators/MortgageCalculator";
import { toolMetadata } from "@/lib/seo/metadata";

export const metadata = toolMetadata("Tool_mortgage_Title", "Tool_mortgage_Description");

export default function MortgagePage() {
  return <MortgageCalculator />;
}
