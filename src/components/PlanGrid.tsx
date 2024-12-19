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
        <Card 
          key={`${plan.company_id}-${plan.plan_name}`} 
          className="overflow-hidden hover:shadow-lg transition-shadow border-border/40"
        >
          <CardContent className="p-6">
            <div className="space-y-8">
              {/* Provider Section */}
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <img
                    src={plan.company_logo || "/placeholder.svg"}
                    alt={plan.company_name}
                    className="h-12 object-contain"
                  />
                  <h3 className="text-sm text-muted-foreground">{plan.company_name}</h3>
                </div>
                {plan.contract_length && (
                  <span className="text-xs font-medium text-primary bg-primary/10 px-3 py-1 rounded-full">
                    {plan.contract_length} {plan.contract_length === 1 ? 'month' : 'months'}
                  </span>
                )}
              </div>

              {/* Plan Name */}
              <div>
                <h4 className="text-xl font-semibold text-foreground tracking-tight">
                  {plan.plan_name}
                </h4>
              </div>

              {/* Price Section */}
              <div className="bg-muted/30 rounded-xl p-4">
                <PlanPricing
                  plan={plan}
                  estimatedUse={estimatedUse}
                />
              </div>

              {/* Features Section */}
              <PlanFeatures plan={plan} />

              {/* Actions Section */}
              <div className="space-y-3 pt-2 border-t">
                <div className="grid grid-cols-2 gap-3 pt-4">
                  {plan.go_to_plan && (
                    <Button variant="default" className="w-full" asChild>
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
                    onClick={() => onCompare(plan)}
                    className="w-full"
                  >
                    {comparedPlans.some(p => p.company_id === plan.company_id)
                      ? "Remove"
                      : "Compare"}
                  </Button>
                </div>
                <Button 
                  variant="ghost" 
                  onClick={() => setSelectedPlan(plan)}
                  className="w-full flex items-center justify-center gap-2 text-muted-foreground hover:text-primary"
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