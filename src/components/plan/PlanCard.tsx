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
      className="group overflow-hidden hover:shadow-lg transition-all duration-300 border-border/40 hover:border-primary/40 bg-gradient-to-b from-white to-gray-50/30"
    >
      <CardContent className="p-6">
        <div className="space-y-8">
          <PlanCardHeader plan={plan} />
          
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