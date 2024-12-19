import { Plan } from "@/lib/api";
import { Check, Leaf } from "lucide-react";

interface PlanFeaturesProps {
  plan: Plan;
}

export function PlanFeatures({ plan }: PlanFeaturesProps) {
  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2">
        {plan.plan_type_name && (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
            {plan.plan_type_name}
          </span>
        )}
        {plan.new_customer && (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
            New Customers
          </span>
        )}
        {plan.renewable_percentage > 0 && (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">
            <Leaf className="h-3 w-3" />
            {plan.renewable_percentage}% Renewable
          </span>
        )}
      </div>

      {plan.timeofuse && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Check className="h-4 w-4 text-primary" />
          <span>Time of Use Plan</span>
        </div>
      )}

      {plan.prepaid && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Check className="h-4 w-4 text-primary" />
          <span>Prepaid Plan</span>
        </div>
      )}
    </div>
  );
}