import { TermsPage } from "@/components/pages/StaticPages";
import { pageMetadata } from "@/lib/seo/metadata";

export const metadata = pageMetadata("Page_Terms_PageTitle", "Page_Terms_Description");

export default function Page() {
  return <TermsPage />;
}
