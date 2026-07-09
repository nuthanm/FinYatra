import { GoalPlanner } from "@/components/calculators/GoalPlanner";
import { toolMetadata } from "@/lib/seo/metadata";

export const metadata = toolMetadata("Tool_goal_Title", "Tool_goal_Description");

export default function GoalPage() {
  return <GoalPlanner />;
}
