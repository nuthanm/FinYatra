import { ContactPage } from "@/components/pages/ContactPage";
import { pageMetadata } from "@/lib/seo/metadata";

export const metadata = pageMetadata("Page_Contact_PageTitle", "Page_Contact_Description");

export default function Page() {
  return <ContactPage />;
}
