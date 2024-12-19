import { Plan } from "@/lib/api";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { PlanHeader } from "./plan-card/PlanHeader";
import { PlanTitle } from "./plan-card/PlanTitle";
import { PlanPricing } from "./plan-card/PlanPricing";
import { PlanBadges } from "./plan-card/PlanBadges";
import { PlanDetails } from "./plan-card/PlanDetails";
import { PlanActions } from "./plan-card/PlanActions";

interface PlanCardProps {
  plan: Plan;
  onCompare?: (plan: Plan) => void;
  isCompared?: boolean;
  estimatedUse: string;
}

export function PlanCard({ plan, onCompare, isCompared, estimatedUse }: PlanCardProps) {
  console.log("Plan Data:", plan);
  console.log("Estimated Use:", estimatedUse);

  return (
    <Card className="flex flex-col h-full hover:shadow-lg transition-shadow animate-fade-in">
      <PlanHeader companyLogo={plan.company_logo} companyName={plan.company_name} />
      <CardContent className="flex-1 p-6">
        <PlanTitle 
          planName={plan.plan_name}
          companyName={plan.company_name}
        />
        
        <div className="space-y-4">
          <PlanPricing 
            priceKwh500={plan.price_kwh500}
            priceKwh1000={plan.price_kwh1000}
            priceKwh2000={plan.price_kwh2000}
            baseCharge={plan.base_charge}
            estimatedUse={estimatedUse}
          />
          
          <PlanBadges 
            planType={plan.plan_type_name}
            contractLength={plan.contract_length}
            minimumUsage={plan.minimum_usage}
            newCustomer={plan.new_customer}
          />
          
          {plan.plan_details && (
            <PlanDetails details={plan.plan_details} />
          )}
        </div>
      </CardContent>
      <CardFooter className="flex-none p-6 pt-0">
        <PlanActions 
          plan={plan}
          onCompare={onCompare}
          isCompared={isCompared}
        />
      </CardFooter>
    </Card>
  );
}