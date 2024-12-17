import { Plan } from "@/lib/api";
import { PlanCard } from "@/components/PlanCard";

interface PlanGridProps {
  plans: Plan[];
  onCompare: (plan: Plan) => void;
  comparedPlans: Plan[];
  estimatedUse: string;
}

export function PlanGrid({ plans, onCompare, comparedPlans, estimatedUse }: PlanGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {plans.map((plan: Plan) => (
        <PlanCard 
          key={`${plan.company_id}-${plan.plan_name}`} 
          plan={plan}
          onCompare={onCompare}
          isCompared={comparedPlans.some(p => p.company_id === plan.company_id)}
          estimatedUse={estimatedUse}
        />
      ))}
    </div>
  );
}