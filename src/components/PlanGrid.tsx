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
          className="group overflow-hidden hover:shadow-lg transition-all duration-300 border-border/40 hover:border-primary/40 bg-gradient-to-b from-white to-gray-50/30"
        >
          <CardContent className="p-6">
            <div className="space-y-8">
              {/* Provider Section */}
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <img
                    src={plan.company_logo || "/placeholder.svg"}
                    alt={plan.company_name}
                    className="h-12 object-contain opacity-90 group-hover:opacity-100 transition-opacity"
                  />
                  <h3 className="text-sm text-muted-foreground/80">{plan.company_name}</h3>
                </div>
                {plan.contract_length && (
                  <span className="text-xs font-medium text-primary bg-primary/5 px-3 py-1 rounded-full ring-1 ring-primary/10">
                    {plan.contract_length} {plan.contract_length === 1 ? 'month' : 'months'}
                  </span>
                )}
              </div>

              {/* Plan Name */}
              <div>
                <h4 className="text-xl font-semibold text-foreground/90 tracking-tight group-hover:text-foreground transition-colors">
                  {plan.plan_name}
                </h4>
              </div>

              {/* Price Section */}
              <div className="bg-muted/20 backdrop-blur-sm rounded-xl p-4 group-hover:bg-muted/30 transition-colors">
                <PlanPricing
                  plan={plan}
                  estimatedUse={estimatedUse}
                />
              </div>

              {/* Features Section */}
              <PlanFeatures plan={plan} />

              {/* Actions Section */}
              <div className="space-y-3 pt-2 border-t border-border/50">
                <div className="grid grid-cols-2 gap-3 pt-4">
                  {plan.go_to_plan && (
                    <Button 
                      variant="default" 
                      className="w-full bg-primary/90 hover:bg-primary transition-colors" 
                      asChild
                    >
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
                    className="w-full hover:border-primary/30"
                  >
                    {comparedPlans.some(p => p.company_id === plan.company_id)
                      ? "Remove"
                      : "Compare"}
                  </Button>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <Button 
                    variant="ghost" 
                    onClick={() => setSelectedPlan(plan)}
                    className="flex items-center justify-center gap-2 text-muted-foreground hover:text-primary transition-colors"
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