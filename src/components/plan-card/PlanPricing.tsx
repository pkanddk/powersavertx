interface PlanPricingProps {
  priceKwh: number;
  priceKwh500: number;
  priceKwh1000: number;
  priceKwh2000: number;
  baseCharge?: number;
  estimatedUse: string;
}

export function PlanPricing({ 
  priceKwh500, 
  priceKwh1000, 
  priceKwh2000, 
  baseCharge,
  estimatedUse
}: PlanPricingProps) {
  
  const formatPrice = (price: number) => {
    return (price * 100).toFixed(1) + "¢";
  };

  const isSelected = (usage: string) => {
    return estimatedUse === usage;
  };

  const getPriceClasses = (usage: string) => {
    return isSelected(usage) 
      ? "text-3xl font-bold text-primary" 
      : "text-xl font-semibold text-muted-foreground";
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-8">
        <div className="text-center">
          <div className="text-sm font-medium text-muted-foreground mb-1">500 kWh</div>
          <div className={getPriceClasses("500")}>
            {formatPrice(priceKwh500)}
          </div>
        </div>
        <div className="text-center">
          <div className="text-sm font-medium text-muted-foreground mb-1">1,000 kWh</div>
          <div className={getPriceClasses("1000")}>
            {formatPrice(priceKwh1000)}
          </div>
        </div>
        <div className="text-center">
          <div className="text-sm font-medium text-muted-foreground mb-1">2,000 kWh</div>
          <div className={getPriceClasses("2000")}>
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