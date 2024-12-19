import { Plan } from "@/lib/api";

interface PlanPricingProps {
  plan: Plan;
  estimatedUse: string;
}

export function PlanPricing({ plan, estimatedUse }: PlanPricingProps) {
  const isSelected = (usage: string) => {
    // Convert estimatedUse to match the format we're comparing against
    return estimatedUse === usage.split(" ")[0].replace(",", "");
  };

  return (
    <div className="space-y-4">
      {/* Price Breakdown */}
      <div className="space-y-2 text-sm">
        <div className={`flex justify-between items-center p-3 rounded-lg transition-colors ${
          isSelected("500") ? "bg-primary/20 ring-2 ring-primary" : "bg-primary/5"
        }`}>
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">500 kWh Usage:</span>
            {isSelected("500") && (
              <span className="text-xs font-medium text-primary">Selected Plan</span>
            )}
          </div>
          <span className="font-bold text-lg">{plan.price_kwh500.toFixed(1)}¢</span>
        </div>

        <div className={`flex justify-between items-center p-3 rounded-lg transition-colors ${
          isSelected("1000") ? "bg-primary/20 ring-2 ring-primary" : "bg-primary/5"
        }`}>
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">1,000 kWh Usage:</span>
            {isSelected("1000") && (
              <span className="text-xs font-medium text-primary">Selected Plan</span>
            )}
          </div>
          <span className="font-bold text-lg">{plan.price_kwh1000.toFixed(1)}¢</span>
        </div>

        <div className={`flex justify-between items-center p-3 rounded-lg transition-colors ${
          isSelected("2000") ? "bg-primary/20 ring-2 ring-primary" : "bg-primary/5"
        }`}>
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">2,000 kWh Usage:</span>
            {isSelected("2000") && (
              <span className="text-xs font-medium text-primary">Selected Plan</span>
            )}
          </div>
          <span className="font-bold text-lg">{plan.price_kwh2000.toFixed(1)}¢</span>
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