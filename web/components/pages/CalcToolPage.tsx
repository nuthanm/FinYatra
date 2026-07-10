"use client";

import { ComingSoonPage } from "@/components/pages/ComingSoonPage";
import { getCalculatorComponent } from "@/lib/calculators/registry";
import { getTool } from "@/lib/config/tools";

type CalcToolPageProps = {
  toolKey: string;
};

export function CalcToolPage({ toolKey }: CalcToolPageProps) {
  const tool = getTool(toolKey);
  if (!tool) return null;

  const Calculator = getCalculatorComponent(toolKey);
  if (Calculator && !tool.comingSoon) return <Calculator />;

  return <ComingSoonPage toolKey={toolKey} />;
}
