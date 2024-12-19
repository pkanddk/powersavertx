import { Plan } from "@/lib/api";

interface PlanPricingProps {
  plan: Plan;
  estimatedUse: string;
  getPriceForUsage: (plan: Plan) => number;
}

export function PlanPricing({ plan, estimatedUse, getPriceForUsage }: PlanPricingProps) {
  return (
    <div className="space-y-4">
      {/* Highlighted Price based on selection */}
      <div className="bg-primary/5 p-4 rounded-lg">
        <div className="flex items-baseline gap-1">
          <span className="text-3xl font-bold text-gray-900">{getPriceForUsage(plan).toFixed(1)}</span>
          <span className="text-lg text-gray-900">¢</span>
          <span className="text-sm text-muted-foreground ml-2">
            at {estimatedUse === "any" ? "1,000" : estimatedUse} kWh
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