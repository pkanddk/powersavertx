import { Plan } from "@/lib/api";

interface PlanPricingProps {
  plan: Plan;
  estimatedUse: string;
  getPriceForUsage: (plan: Plan) => number;
}

export function PlanPricing({ plan, estimatedUse, getPriceForUsage }: PlanPricingProps) {
  // Simple function to get the display text based on estimatedUse
  const getUsageDisplay = () => {
    if (estimatedUse === "500") return "500";
    if (estimatedUse === "2000") return "2,000";
    return "1,000"; // Default or when "any" is selected
  };

  // Simple function to get the current price based on usage
  const getCurrentPrice = () => {
    if (estimatedUse === "500") return plan.price_kwh500;
    if (estimatedUse === "2000") return plan.price_kwh2000;
    return plan.price_kwh1000; // Default or when "any" is selected
  };

  return (
    <div className="space-y-4">
      {/* Main Price Display */}
      <div className="bg-primary/5 p-4 rounded-lg">
        <div className="flex items-baseline gap-1">
          <span className="text-3xl font-bold text-gray-900">
            {getCurrentPrice().toFixed(1)}
          </span>
          <span className="text-lg text-gray-900">¢</span>
          <span className="text-sm text-muted-foreground ml-2">
            at {getUsageDisplay()} kWh
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