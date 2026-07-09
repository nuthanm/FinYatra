import { InflationCalculator } from "@/components/calculators/InflationCalculator";
import { toolMetadata } from "@/lib/seo/metadata";

export const metadata = toolMetadata("Tool_inflation_Title", "Tool_inflation_Description");

export default function InflationPage() {
  return <InflationCalculator />;
}
