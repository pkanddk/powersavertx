import { Plan } from "@/lib/api";
import { useState } from "react";
import { PlanDetails } from "./plan/PlanDetails";
import { PlanCard } from "./plan/PlanCard";

interface PlanGridProps {
  plans: Plan[];
  onCompare: (plan: Plan) => void;
  comparedPlans: Plan[];
  estimatedUse: string;
}

export function PlanGrid({ plans, onCompare, comparedPlans, estimatedUse }: PlanGridProps) {
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {plans.map((plan) => (
        <PlanCard
          key={`${plan.company_id}-${plan.plan_name}`}
          plan={plan}
          onCompare={onCompare}
          isCompared={comparedPlans.some(p => p.company_id === plan.company_id)}
          onShowDetails={(plan) => setSelectedPlan(plan)}
          estimatedUse={estimatedUse}
        />
      ))}

      {/* Plan Details Drawer */}
      {selectedPlan && (
        <PlanDetails
          plan={selectedPlan}
          isOpen={!!selectedPlan}
          onClose={() => setSelectedPlan(null)}
        />
      )}
    </div>
  );
}