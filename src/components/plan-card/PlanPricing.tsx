import { useSearchParams } from "react-router-dom";

interface PlanPricingProps {
  priceKwh: number;
  priceKwh500: number;
  priceKwh1000: number;
  priceKwh2000: number;
  baseCharge?: number;
}

export function PlanPricing({ 
  priceKwh500, 
  priceKwh1000, 
  priceKwh2000, 
  baseCharge 
}: PlanPricingProps) {
  const [searchParams] = useSearchParams();
  const estimatedUse = searchParams.get("estimatedUse") || "any";

  const formatPrice = (price: number) => {
    return (price * 100).toFixed(1) + "¢";
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-2 bg-secondary/20 rounded-lg p-3">
        <div className={`text-center p-2 rounded transition-colors ${estimatedUse === "500" || estimatedUse === "any" ? "bg-primary/20" : ""}`}>
          <div className="text-sm font-medium">500 kWh</div>
          <div className={`text-lg ${estimatedUse === "500" || estimatedUse === "any" ? "text-primary font-semibold" : "text-muted-foreground"}`}>
            {formatPrice(priceKwh500)}
          </div>
        </div>
        <div className={`text-center p-2 rounded transition-colors ${estimatedUse === "1000" ? "bg-primary/20" : ""}`}>
          <div className="text-sm font-medium">1,000 kWh</div>
          <div className={`text-lg ${estimatedUse === "1000" ? "text-primary font-semibold" : "text-muted-foreground"}`}>
            {formatPrice(priceKwh1000)}
          </div>
        </div>
        <div className={`text-center p-2 rounded transition-colors ${estimatedUse === "2000" ? "bg-primary/20" : ""}`}>
          <div className="text-sm font-medium">2,000 kWh</div>
          <div className={`text-lg ${estimatedUse === "2000" ? "text-primary font-semibold" : "text-muted-foreground"}`}>
            {formatPrice(priceKwh2000)}
          </div>
        </div>
      </div>
      
      {baseCharge && (
        <div className="text-sm text-muted-foreground text-center">
          Base Charge: ${baseCharge}/month
        </div>
      )}
    </div>
  );
}