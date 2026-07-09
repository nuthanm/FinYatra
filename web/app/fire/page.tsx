import { FireCalculator } from "@/components/calculators/FireCalculator";
import { toolMetadata } from "@/lib/seo/metadata";

export const metadata = toolMetadata("Tool_fire_Title", "Tool_fire_Description");

export default function FirePage() {
  return <FireCalculator />;
}
