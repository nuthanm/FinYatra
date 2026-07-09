import { PrivacyPage } from "@/components/pages/StaticPages";
import { pageMetadata } from "@/lib/seo/metadata";

export const metadata = pageMetadata("Page_Privacy_PageTitle", "Page_Privacy_Description");

export default function Page() {
  return <PrivacyPage />;
}
