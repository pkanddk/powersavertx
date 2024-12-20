import { Plan } from "@/lib/api";
import { Card, CardContent } from "@/components/ui/card";
import { PlanFeatures } from "./PlanFeatures";
import { PlanPricing } from "./PlanPricing";
import { PlanCardHeader } from "./PlanCardHeader";
import { PlanCardActions } from "./PlanCardActions";

interface PlanCardProps {
  plan: Plan;
  onCompare: (plan: Plan) => void;
  isCompared: boolean;
  onShowDetails: (plan: Plan) => void;
  estimatedUse: string;
}

export function PlanCard({ 
  plan, 
  onCompare, 
  isCompared, 
  onShowDetails,
  estimatedUse 
}: PlanCardProps) {
  return (
    <Card 
      className={`group overflow-hidden transition-all duration-300 hover-card-effect
        ${isCompared 
          ? "ring-2 ring-primary shadow-lg bg-gradient-to-b from-primary/5 to-transparent" 
          : "hover:shadow-lg border-border/40 hover:border-primary/40 bg-gradient-to-b from-white to-gray-50/30"
        }`}
    >
      <CardContent className="p-4 md:p-5">
        <div className="space-y-4 md:space-y-5">
          <PlanCardHeader plan={plan} />
          
          <h4 className="text-base md:text-lg font-semibold text-foreground/90 tracking-tight group-hover:text-foreground transition-colors">
            {plan.plan_name}
          </h4>

          <div className="bg-muted/20 backdrop-blur-sm rounded-xl p-3 md:p-4">
            <PlanPricing
              plan={plan}
              estimatedUse={estimatedUse}
              onShowDetails={onShowDetails}
            />
          </div>

          <PlanFeatures plan={plan} />

          <PlanCardActions 
            plan={plan}
            onCompare={onCompare}
            isCompared={isCompared}
            onShowDetails={onShowDetails}
          />
        </div>
      </CardContent>
    </Card>
  );
}