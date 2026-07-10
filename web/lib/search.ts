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
  else if (q.includes("tax") || q.includes("gst") || q.includes("tds") || q.includes("hra")) hint = "Tax";
  else if (q.includes("ppf") || q.includes("nps") || q.includes("epf") || q.includes("gov")) hint = "Government";
  else if (q.includes("salary") || q.includes("bonus") || q.includes("ctc")) hint = "Salary";
  else if (q.includes("property") || q.includes("rent") || q.includes("stamp")) hint = "Property";
  else if (q.includes("insurance") || q.includes("lic") || q.includes("premium")) hint = "Insurance";
  else if (q.includes("goal") || q.includes("fire") || q.includes("fd") || q.includes("emergency") || q.includes("budget") || q.includes("retirement")) hint = "Planning";

  const baseList = TOOLS.filter((t) => !t.comingSoon);
  const pool = hint ? baseList.filter((t) => t.group === hint) : baseList;
  const exclude = new Set(results.map((r) => r.key.toLowerCase()));

  return pool.filter((t) => !exclude.has(t.key.toLowerCase())).slice(0, 6);
}

export function defaultSearchSuggestions(): ToolLink[] {
  return TOOLS.filter((t) => !t.comingSoon).slice(0, 6);
}
