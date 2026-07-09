import { ToolsPage } from "@/components/pages/HomeTools";
import { pageMetadata } from "@/lib/seo/metadata";

export const metadata = pageMetadata("Tools_PageTitle", "Tools_Desc");

export default function Page() {
  return <ToolsPage />;
}
