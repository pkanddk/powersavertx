import { Plan } from "@/lib/api";

interface PlanPricingProps {
  plan: Plan;
  estimatedUse: string;
}

export function PlanPricing({ plan, estimatedUse }: PlanPricingProps) {
  // Direct price lookup based on usage
  const price = estimatedUse === "500" ? plan.price_kwh500 
              : estimatedUse === "2000" ? plan.price_kwh2000 
              : plan.price_kwh1000;

  // Direct usage display
  const usage = estimatedUse === "500" ? "500" 
              : estimatedUse === "2000" ? "2,000" 
              : "1,000";

  return (
    <div className="space-y-4">
      {/* Main Price Display */}
      <div className="bg-primary/5 p-4 rounded-lg">
        <div className="flex items-baseline gap-1">
          <span className="text-3xl font-bold text-gray-900">
            {price.toFixed(1)}
          </span>
          <span className="text-lg text-gray-900">¢</span>
          <span className="text-sm text-muted-foreground ml-2">
            at {usage} kWh
          </span>
        </div>
      </div>

      {/* All Available Prices */}
      <div className="space-y-2 text-sm">
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground">500 kWh Usage:</span>
          <span className="font-medium">{plan.price_kwh500.toFixed(1)}¢</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground">1,000 kWh Usage:</span>
          <span className="font-medium">{plan.price_kwh1000.toFixed(1)}¢</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground">2,000 kWh Usage:</span>
          <span className="font-medium">{plan.price_kwh2000.toFixed(1)}¢</span>
        </div>
        {plan.base_charge && (
          <div className="flex justify-between items-center pt-2 border-t">
            <span className="text-muted-foreground">Base Charge:</span>
            <span className="font-medium">${plan.base_charge}/month</span>
          </div>
        )}
        {plan.pricing_details && (
          <p className="text-xs text-muted-foreground mt-2 pt-2 border-t">
            {plan.pricing_details}
          </p>
        )}
      </div>
    </div>
  );
}