import { Plan } from "@/lib/api";
import { Badge } from "@/components/ui/badge";
import { Leaf, Clock, Sparkles } from "lucide-react";

interface PlanDetailsBadgesProps {
  plan: Plan;
}

export function PlanDetailsBadges({ plan }: PlanDetailsBadgesProps) {
  return (
    <div className="flex flex-wrap gap-3 pt-4">
      {/* Plan Type Badge */}
      {plan.plan_type_name && (
        <Badge variant="outline" className="flex items-center gap-2 px-3 py-1">
          <Clock className="h-4 w-4" />
          {plan.plan_type_name}
        </Badge>
      )}
      
      {plan.renewable_percentage > 0 && (
        <Badge variant="outline" className="flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-600 border-emerald-200">
          <Leaf className="h-4 w-4" />
          {plan.renewable_percentage}% Renewable
        </Badge>
      )}
      
      {plan.new_customer && (
        <Badge variant="outline" className="flex items-center gap-2 px-3 py-1 bg-purple-50 text-purple-600 border-purple-200">
          <Sparkles className="h-4 w-4" />
          New Customer
        </Badge>
      )}
      
      {plan.timeofuse && (
        <Badge variant="outline" className="flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-600 border-blue-200">
          <Clock className="h-4 w-4" />
          Time of Use
        </Badge>
      )}
    </div>
  );
}