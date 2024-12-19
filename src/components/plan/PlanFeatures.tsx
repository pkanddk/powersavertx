import { Check } from "lucide-react";
import { Plan } from "@/lib/api";

interface PlanFeaturesProps {
  plan: Plan;
}

export function PlanFeatures({ plan }: PlanFeaturesProps) {
  const formatPlanType = (planType: string) => {
    return planType.replace(/[0-9]/g, '').trim() || 'Fixed Rate';
  };

  return (
    <div className="space-y-2">
      {plan.plan_type_name && (
        <div className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
          {formatPlanType(plan.plan_type_name)}
        </div>
      )}
      <div className="space-y-1">
        {plan.renewable_percentage > 0 && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Check className="h-4 w-4 text-primary" />
            <span>{plan.renewable_percentage}% Renewable</span>
          </div>
        )}
        {plan.prepaid && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Check className="h-4 w-4 text-primary" />
            <span>Prepaid Plan</span>
          </div>
        )}
        {plan.timeofuse && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Check className="h-4 w-4 text-primary" />
            <span>Time of Use</span>
          </div>
        )}
        {plan.minimum_usage && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Check className="h-4 w-4 text-primary" />
            <span>Minimum Usage Required</span>
          </div>
        )}
        {plan.new_customer && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Check className="h-4 w-4 text-primary" />
            <span>New Customers Only</span>
          </div>
        )}
      </div>
    </div>
  );
}