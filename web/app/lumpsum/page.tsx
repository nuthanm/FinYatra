import { ComingSoonPage } from "@/components/pages/ComingSoonPage";
import { pageMetadata } from "@/lib/seo/metadata";

export const metadata = pageMetadata("Page_ComingSoon_PageTitle", "Page_ComingSoon_Description");

export default function LumpsumPage() {
  return <ComingSoonPage toolKey="lumpsum" />;
}
