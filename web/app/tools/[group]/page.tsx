import { ToolsPage } from "@/components/pages/HomeTools";
import { pageMetadata } from "@/lib/seo/metadata";

export const metadata = pageMetadata("Tools_PageTitle", "Tools_Desc");

type Props = { params: Promise<{ group: string }> };

export default async function Page({ params }: Props) {
  const { group } = await params;
  return <ToolsPage group={group} />;
}
