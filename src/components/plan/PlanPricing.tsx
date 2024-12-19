import { Plan } from "@/lib/api";
import { parseCancellationFee } from "@/lib/utils/parseCancellationFee";

interface PlanPricingProps {
  plan: Plan;
  estimatedUse: string;
}

export function PlanPricing({ plan, estimatedUse }: PlanPricingProps) {
  const cancellationFee = parseCancellationFee(plan.pricing_details);
  
  // Add debug logging
  console.log('Plan:', plan.plan_name);
  console.log('Raw pricing details:', plan.pricing_details);
  console.log('Parsed cancellation fee:', cancellationFee);

  return (
    <div className="space-y-3">
      {/* Price Breakdown */}
      <div className="space-y-2 text-sm">
        <div className="flex justify-between items-center py-1.5">
          <span className="text-muted-foreground">500 kWh Usage:</span>
          <span className="font-bold text-lg">{plan.price_kwh500.toFixed(1)}¢</span>
        </div>

        <div className="flex justify-between items-center py-1.5">
          <span className="text-muted-foreground">1,000 kWh Usage:</span>
          <span className="font-bold text-lg">{plan.price_kwh1000.toFixed(1)}¢</span>
        </div>

        <div className="flex justify-between items-center py-1.5">
          <span className="text-muted-foreground">2,000 kWh Usage:</span>
          <span className="font-bold text-lg">{plan.price_kwh2000.toFixed(1)}¢</span>
        </div>

        {plan.base_charge && (
          <div className="flex justify-between items-center pt-2 border-t border-border/40">
            <span className="text-muted-foreground">Base Charge:</span>
            <span className="font-medium">${plan.base_charge}/month</span>
          </div>
        )}

        {cancellationFee !== null && (
          <div className="flex justify-between items-center pt-2 border-t border-border/40">
            <span className="text-muted-foreground">Cancellation Fee:</span>
            <span className="font-medium">
              {cancellationFee === 0 ? 'No cancellation fee' : `$${cancellationFee}`}
            </span>
          </div>
        )}

        {plan.pricing_details && cancellationFee === null && (
          <p className="text-xs text-muted-foreground mt-2 pt-2 border-t border-border/40">
            {plan.pricing_details}
          </p>
        )}
      </div>
    </div>
  );
}