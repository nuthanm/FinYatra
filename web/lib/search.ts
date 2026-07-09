import type { ToolGroup, ToolLink } from "@/lib/types";
import { TOOLS } from "@/lib/config/tools";

export function searchTools(query: string, t: (key: string) => string): ToolLink[] {
  const q = query.trim();
  if (!q) return [];

  const lower = q.toLowerCase();
  return TOOLS.filter(
    (tool) =>
      tool.key.toLowerCase().includes(lower) ||
      t(tool.titleKey).toLowerCase().includes(lower) ||
      t(tool.descriptionKey).toLowerCase().includes(lower),
  );
}

export function buildSearchSuggestions(query: string, results: ToolLink[]): ToolLink[] {
  const q = query.toLowerCase();
  let hint: ToolGroup | null = null;

  if (q.includes("sip") || q.includes("invest") || q.includes("cagr") || q.includes("mf")) hint = "Investing";
  else if (q.includes("emi") || q.includes("loan") || q.includes("mortgage")) hint = "Loans";
  else if (q.includes("inflation") || q.includes("interest") || q.includes("compound")) hint = "Basics";
  else if (q.includes("goal") || q.includes("fire") || q.includes("fd")) hint = "Planning";

  const baseList = TOOLS.filter((t) => !t.comingSoon);
  const pool = hint ? baseList.filter((t) => t.group === hint) : baseList;
  const exclude = new Set(results.map((r) => r.key.toLowerCase()));

  return pool.filter((t) => !exclude.has(t.key.toLowerCase())).slice(0, 6);
}

export function defaultSearchSuggestions(): ToolLink[] {
  return TOOLS.filter((t) => !t.comingSoon).slice(0, 6);
}
