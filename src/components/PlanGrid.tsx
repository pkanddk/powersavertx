import { Plan } from "@/lib/api";
import { useState } from "react";
import { PlanDetails } from "./plan/PlanDetails";
import { PlanCard } from "./plan/PlanCard";
import { Button } from "./ui/button";

interface PlanGridProps {
  plans: Plan[];
  onCompare: (plan: Plan) => void;
  comparedPlans: Plan[];
  estimatedUse: string;
}

export function PlanGrid({ plans, onCompare, comparedPlans, estimatedUse }: PlanGridProps) {
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const plansPerPage = 25;

  const indexOfLastPlan = currentPage * plansPerPage;
  const indexOfFirstPlan = indexOfLastPlan - plansPerPage;
  const currentPlans = plans.slice(indexOfFirstPlan, indexOfLastPlan);
  const totalPages = Math.ceil(plans.length / plansPerPage);

  return (
    <div className="space-y-6 mb-20">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {currentPlans.map((plan) => (
          <PlanCard
            key={`${plan.company_id}-${plan.plan_name}`}
            plan={plan}
            onCompare={onCompare}
            isCompared={comparedPlans.some(p => p.company_id === plan.company_id)}
            onShowDetails={(plan) => setSelectedPlan(plan)}
            estimatedUse={estimatedUse}
          />
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          <Button
            variant="outline"
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          <span className="py-2 px-4">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            variant="outline"
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
      )}

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