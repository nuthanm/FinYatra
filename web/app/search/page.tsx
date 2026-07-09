import { Suspense } from "react";
import { SearchPage } from "@/components/pages/StaticPages";
import { pageMetadata } from "@/lib/seo/metadata";

export const metadata = pageMetadata("Page_Search_PageTitle", "Page_Search_Description");

export default function Page() {
  return (
    <Suspense>
      <SearchPage />
    </Suspense>
  );
}
