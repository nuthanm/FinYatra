import { FdLadderingCalculator } from "@/components/calculators/FdLadderingCalculator";
import { toolMetadata } from "@/lib/seo/metadata";

export const metadata = toolMetadata("Tool_fd_Title", "Tool_fd_Description");

export default function FdLadderingPage() {
  return <FdLadderingCalculator />;
}
