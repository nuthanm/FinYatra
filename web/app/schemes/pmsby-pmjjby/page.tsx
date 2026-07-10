import { SchemesPmsbyPmjjbyPage } from "@/components/pages/SchemesPmsbyPmjjbyPage";
import { pageMetadata } from "@/lib/seo/metadata";

export const metadata = pageMetadata(
  "Page_PmsbyPmjjby_PageTitle",
  "Page_PmsbyPmjjby_Description",
);

export default function Page() {
  return <SchemesPmsbyPmjjbyPage />;
}
