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
  return (
    <Card className="flex flex-col h-full hover:shadow-lg transition-shadow animate-fade-in">
      <PlanHeader companyLogo={plan.company_logo} companyName={plan.company_name} />
      
      <CardContent className="flex-1 p-6 space-y-6">
        <PlanTitle 
          planName={plan.plan_name}
          companyName={plan.company_name}
          companyTduName={plan.company_tdu_name}
        />
        
        <PlanPricing 
          priceKwh500={plan.price_kwh500}
          priceKwh1000={plan.price_kwh1000}
          priceKwh2000={plan.price_kwh2000}
          baseCharge={plan.base_charge}
          estimatedUse={estimatedUse}
          pricingDetails={plan.pricing_details}
        />
        
        <PlanBadges 
          planType={plan.plan_type_name}
          contractLength={plan.contract_length || 0}
          minimumUsage={plan.minimum_usage}
          newCustomer={plan.new_customer}
          prepaid={plan.prepaid}
          timeOfUse={plan.timeofuse}
          renewablePercentage={plan.renewable_percentage}
        />
        
        {(plan.plan_details || plan.promotions) && (
          <PlanDetails 
            details={plan.plan_details || ''} 
            promotions={plan.promotions}
          />
        )}
      </CardContent>
      
      <CardFooter className="p-6 pt-0">
        <PlanActions 
          plan={plan}
          onCompare={onCompare}
          isCompared={isCompared}
          enrollPhone={plan.enroll_phone}
          website={plan.website}
        />
      </CardFooter>
    </Card>
  );
}