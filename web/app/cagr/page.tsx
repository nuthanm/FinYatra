import { CagrCalculator } from "@/components/calculators/CagrCalculator";
import { toolMetadata } from "@/lib/seo/metadata";

export const metadata = toolMetadata("Tool_cagr_Title", "Tool_cagr_Description");

export default function CagrPage() {
  return <CagrCalculator />;
}
