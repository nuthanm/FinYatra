import { AboutPage } from "@/components/pages/StaticPages";
import { pageMetadata } from "@/lib/seo/metadata";

export const metadata = pageMetadata("Page_About_PageTitle", "Page_About_Description");

export default function Page() {
  return <AboutPage />;
}
