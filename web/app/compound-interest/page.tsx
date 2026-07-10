import { CompoundInterestCalculator } from "@/components/calculators/CompoundInterestCalculator";
import { toolMetadata } from "@/lib/seo/metadata";

export const metadata = toolMetadata("Tool_interest_Title", "Tool_interest_Description");

export default function CompoundInterestPage() {
  return <CompoundInterestCalculator />;
}
