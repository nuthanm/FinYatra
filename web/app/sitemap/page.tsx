import { SitemapPage } from "@/components/pages/StaticPages";
import { pageMetadata } from "@/lib/seo/metadata";

export const metadata = pageMetadata("Page_Sitemap_PageTitle", "Page_Sitemap_Description");

export default function Page() {
  return <SitemapPage />;
}
