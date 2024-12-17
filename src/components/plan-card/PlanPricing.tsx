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
  const estimatedUse = searchParams.get("estimatedUse") || "500";

  const formatPrice = (price: number) => {
    return (price * 100).toFixed(1) + "¢";
  };

  const getSelectedPrice = () => {
    switch (estimatedUse) {
      case "500":
        return priceKwh500;
      case "1000":
        return priceKwh1000;
      case "2000":
        return priceKwh2000;
      default:
        return priceKwh500;
    }
  };

  return (
    <div className="space-y-4">
      <div className="text-center">
        <div className="text-4xl font-bold text-primary mb-2">
          {formatPrice(getSelectedPrice())}
          <span className="text-sm text-muted-foreground ml-1">per kWh</span>
        </div>
      </div>
      
      <div className="grid grid-cols-3 gap-2 bg-secondary/20 rounded-lg p-3">
        <div className={`text-center p-2 rounded ${estimatedUse === "500" ? "bg-primary/20" : ""}`}>
          <div className="text-sm font-medium">500 kWh</div>
          <div className={`${estimatedUse === "500" ? "text-primary font-semibold" : "text-muted-foreground"}`}>
            {formatPrice(priceKwh500)}
          </div>
        </div>
        <div className={`text-center p-2 rounded ${estimatedUse === "1000" ? "bg-primary/20" : ""}`}>
          <div className="text-sm font-medium">1,000 kWh</div>
          <div className={`${estimatedUse === "1000" ? "text-primary font-semibold" : "text-muted-foreground"}`}>
            {formatPrice(priceKwh1000)}
          </div>
        </div>
        <div className={`text-center p-2 rounded ${estimatedUse === "2000" ? "bg-primary/20" : ""}`}>
          <div className="text-sm font-medium">2,000 kWh</div>
          <div className={`${estimatedUse === "2000" ? "text-primary font-semibold" : "text-muted-foreground"}`}>
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