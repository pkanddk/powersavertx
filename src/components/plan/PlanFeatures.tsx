import { Plan } from "@/lib/api";
import { Leaf, Clock, Sparkles } from "lucide-react";
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
        {plan.new_customer && (
          <Badge variant="outline" className="bg-purple-50 text-purple-600 border-purple-200">
            New Customers
          </Badge>
        )}
      </div>

      {/* Secondary Features Row */}
      <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
        {plan.renewable_percentage > 0 && (
          <div className="flex items-center gap-2 text-sm text-emerald-600">
            <Leaf className="h-4 w-4" />
            <span>{plan.renewable_percentage}%</span>
          </div>
        )}

        {plan.timeofuse && (
          <div className="flex items-center gap-2 text-sm text-blue-600">
            <Clock className="h-4 w-4" />
            <span>Time of Use</span>
          </div>
        )}

        {plan.prepaid && (
          <div className="flex items-center gap-2 text-sm text-amber-600">
            <Sparkles className="h-4 w-4" />
            <span>Prepaid</span>
          </div>
        )}
      </div>
    </div>
  );
}