import { CORE_TOOLS } from "@/lib/config/tools/core-catalog";
import { INDIA_TOOLS } from "@/lib/config/tools/india-catalog";
import type { ToolGroup, ToolLink } from "@/lib/types";

export const TOOLS: ToolLink[] = [...CORE_TOOLS, ...INDIA_TOOLS];

export function toolsByGroup(group: ToolGroup): ToolLink[] {
  return TOOLS.filter((t) => t.group === group);
}

export const TOOL_GROUPS: ToolGroup[] = [
  "Planning",
  "Investing",
  "Loans",
  "Basics",
  "Tax",
  "Government",
  "Salary",
  "Property",
  "Insurance",
];

export function groupLabelKey(group: ToolGroup): string {
  const map: Record<ToolGroup, string> = {
    Planning: "Group_Planning",
    Investing: "Group_Investing",
    Loans: "Group_Loans",
    Basics: "Group_Basics",
    Tax: "Group_Tax",
    Government: "Group_Government",
    Salary: "Group_Salary",
    Property: "Group_Property",
    Insurance: "Group_Insurance",
  };
  return map[group];
}

export function getTool(key: string): ToolLink | undefined {
  return TOOLS.find((t) => t.key === key);
}

export function getToolByRoute(route: string): ToolLink | undefined {
  return TOOLS.find((t) => t.route === route);
}

/** Sidebar shows a capped preview per group; full list lives on /tools. */
export const SIDEBAR_GROUP_PREVIEW = 4;

export function sidebarToolsForGroup(group: ToolGroup): ToolLink[] {
  return toolsByGroup(group)
    .filter((t) => !t.comingSoon)
    .slice(0, SIDEBAR_GROUP_PREVIEW);
}

export { CORE_TOOLS, INDIA_TOOLS };
