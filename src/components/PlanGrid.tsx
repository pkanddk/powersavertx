import { Plan } from "@/lib/api";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink, Phone, Info } from "lucide-react";
import { useState } from "react";
import { PlanFeatures } from "./plan/PlanFeatures";
import { PlanPricing } from "./plan/PlanPricing";
import { PlanDetails } from "./plan/PlanDetails";

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
        <Card key={`${plan.company_id}-${plan.plan_name}`} className="overflow-hidden hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="space-y-6">
              {/* Provider Section */}
              <div className="flex flex-col items-start gap-3">
                <img
                  src={plan.company_logo || "/placeholder.svg"}
                  alt={plan.company_name}
                  className="h-12 object-contain"
                />
                <h3 className="font-medium text-gray-900">{plan.company_name}</h3>
              </div>

              {/* Plan Details Section */}
              <div className="space-y-2">
                <h4 className="text-lg font-semibold text-gray-900">{plan.plan_name}</h4>
                {plan.contract_length && (
                  <p className="text-sm text-primary font-medium">
                    {plan.contract_length} {plan.contract_length === 1 ? 'month' : 'months'} contract
                  </p>
                )}
              </div>

              {/* Price Section */}
              <PlanPricing
                plan={plan}
                estimatedUse={estimatedUse}
              />

              {/* Features Section */}
              <PlanFeatures plan={plan} />

              {/* Actions Section */}
              <div className="space-y-3 pt-2">
                {plan.go_to_plan && (
                  <Button variant="default" size="lg" className="w-full" asChild>
                    <a
                      href={plan.go_to_plan}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2"
                    >
                      View Plan <ExternalLink className="h-4 w-4" />
                    </a>
                  </Button>
                )}
                <Button
                  variant={comparedPlans.some(p => p.company_id === plan.company_id) ? "destructive" : "outline"}
                  size="lg"
                  onClick={() => onCompare(plan)}
                  className="w-full"
                >
                  {comparedPlans.some(p => p.company_id === plan.company_id)
                    ? "Remove"
                    : "Compare"}
                </Button>
                <Button 
                  variant="ghost" 
                  size="lg"
                  onClick={() => setSelectedPlan(plan)}
                  className="w-full flex items-center justify-center gap-2"
                >
                  <Info className="h-4 w-4" />
                  Plan Details
                </Button>
                {plan.enroll_phone && (
                  <a
                    href={`tel:${plan.enroll_phone}`}
                    className="flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    <Phone className="h-4 w-4" /> {plan.enroll_phone}
                  </a>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
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