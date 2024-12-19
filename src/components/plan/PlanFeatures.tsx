import { Plan } from "@/lib/api";

interface PlanFeaturesProps {
  plan: Plan;
}

export function PlanFeatures({ plan }: PlanFeaturesProps) {
  return (
    <div className="space-y-2">
      {/* Primary Features Row - Intentionally empty now that badges are moved to drawer */}
      <div className="flex flex-wrap justify-between gap-2">
      </div>
    </div>
  );
}