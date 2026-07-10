import { CalcToolPage } from "@/components/pages/CalcToolPage";
import { getTool } from "@/lib/config/tools";
import { toolMetadata } from "@/lib/seo/metadata";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { INDIA_TOOLS } from "@/lib/config/tools/india-catalog";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return INDIA_TOOLS.map((tool) => ({ slug: tool.key }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const tool = getTool(slug);
  if (!tool) return {};
  return toolMetadata(tool.titleKey, tool.descriptionKey);
}

export default async function CalcSlugPage({ params }: Props) {
  const { slug } = await params;
  const tool = getTool(slug);
  if (!tool || !tool.route.startsWith("/calc/")) notFound();
  return <CalcToolPage toolKey={slug} />;
}
