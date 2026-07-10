export type SummaryCard = {
  label: string;
  value: string;
  footnote?: string;
  variant?: "default" | "primary" | "secure" | "volatile" | "worst" | "base" | "best";
};

export type ScenarioItem = {
  name: string;
  primaryLabel: string;
  primaryValue: string;
  secondaryLabel?: string;
  secondaryValue?: string;
  variant?: string;
};

export type BreakdownColumn = { key: string; header: string; alignRight?: boolean };
export type BreakdownRow = { cells: Record<string, string> };

export type OfficialLink = { label: string; url: string };
export type AlternativeTool = { name: string; whenToUse: string; example: string; pros: string; cons: string };
export type FormulaBlock = { title: string; code: string; steps: string[] };
export type ToolInfo = {
  abbreviation: string;
  purpose: string;
  whyKnowThis: string;
  realLifeUse: string;
  goals: string[];
  alternatives: AlternativeTool[];
  officialLinks: OfficialLink[];
  differentiation: string;
  motto: string;
  formulaBlocks: FormulaBlock[];
};

export type ToolGroup =
  | "Planning"
  | "Investing"
  | "Loans"
  | "Basics"
  | "Tax"
  | "Government"
  | "Salary"
  | "Property"
  | "Insurance";

export type ToolRegion = "global" | "in";

export type ToolLink = {
  key: string;
  titleKey: string;
  route: string;
  group: ToolGroup;
  descriptionKey: string;
  icon: string;
  comingSoon?: boolean;
  region?: ToolRegion;
};
