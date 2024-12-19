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
      className={`group overflow-hidden transition-all duration-300 border-border/40 hover:border-primary/40 bg-gradient-to-b from-white to-gray-50/30 ${
        isCompared ? "ring-2 ring-primary shadow-lg" : "hover:shadow-lg"
      }`}
    >
      <CardContent className="p-4">
        <div className="space-y-4">
          <PlanCardHeader plan={plan} />
          
          {/* Plan Name */}
          <h4 className="text-lg font-semibold text-foreground/90 tracking-tight group-hover:text-foreground transition-colors -mt-1">
            {plan.plan_name}
          </h4>

          {/* Price Section */}
          <div className="bg-muted/20 backdrop-blur-sm rounded-lg p-3">
            <PlanPricing
              plan={plan}
              estimatedUse={estimatedUse}
              onShowDetails={onShowDetails}
            />
          </div>

          {/* Features Section */}
          <PlanFeatures plan={plan} />

          {/* Actions Section */}
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