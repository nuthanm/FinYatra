import type { ToolLink } from "@/lib/types";

/** Core FinYatra calculators (global + foundational). */
export const CORE_TOOLS: ToolLink[] = [
  { key: "goal", titleKey: "Tool_goal_Title", route: "/goal", group: "Planning", descriptionKey: "Tool_goal_Description", icon: "target" },
  { key: "fire", titleKey: "Tool_fire_Title", route: "/fire", group: "Planning", descriptionKey: "Tool_fire_Description", icon: "flame" },
  { key: "fd", titleKey: "Tool_fd_Title", route: "/fd-laddering", group: "Planning", descriptionKey: "Tool_fd_Description", icon: "layers" },
  { key: "sip", titleKey: "Tool_sip_Title", route: "/sip", group: "Investing", descriptionKey: "Tool_sip_Description", icon: "trending-up" },
  { key: "cagr", titleKey: "Tool_cagr_Title", route: "/cagr", group: "Investing", descriptionKey: "Tool_cagr_Description", icon: "percent" },
  { key: "lumpsum", titleKey: "Tool_lumpsum_Title", route: "/lumpsum", group: "Investing", descriptionKey: "Tool_lumpsum_Description", icon: "box" },
  { key: "emi", titleKey: "Tool_emi_Title", route: "/emi", group: "Loans", descriptionKey: "Tool_emi_Description", icon: "card" },
  { key: "mortgage", titleKey: "Tool_mortgage_Title", route: "/mortgage", group: "Loans", descriptionKey: "Tool_mortgage_Description", icon: "bank" },
  { key: "inflation", titleKey: "Tool_inflation_Title", route: "/inflation", group: "Basics", descriptionKey: "Tool_inflation_Description", icon: "clock" },
  { key: "interest", titleKey: "Tool_interest_Title", route: "/compound-interest", group: "Basics", descriptionKey: "Tool_interest_Description", icon: "refresh" },
];
