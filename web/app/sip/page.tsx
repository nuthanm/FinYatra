import { SipCalculator } from "@/components/calculators/SipCalculator";
import { toolMetadata } from "@/lib/seo/metadata";

export const metadata = toolMetadata("Tool_sip_Title", "Tool_sip_Description");

export default function SipPage() {
  return <SipCalculator />;
}
