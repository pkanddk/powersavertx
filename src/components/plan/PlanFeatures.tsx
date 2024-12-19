import { Plan } from "@/lib/api";
import { Badge } from "@/components/ui/badge";

interface PlanFeaturesProps {
  plan: Plan;
}

export function PlanFeatures({ plan }: PlanFeaturesProps) {
  return (
    <div className="space-y-2">
      {/* Primary Features Row */}
      <div className="flex flex-wrap justify-between gap-2">
        {plan.plan_type_name && (
          <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20">
            {plan.plan_type_name}
          </Badge>
        )}
      </div>
    </div>
  );
}