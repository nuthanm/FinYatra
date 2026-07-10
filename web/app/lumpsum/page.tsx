import { LumpsumCalculator } from "@/components/calculators/LumpsumCalculator";
import { toolMetadata } from "@/lib/seo/metadata";

export const metadata = toolMetadata("Tool_lumpsum_Title", "Tool_lumpsum_Description");

export default function LumpsumPage() {
  return <LumpsumCalculator />;
}
