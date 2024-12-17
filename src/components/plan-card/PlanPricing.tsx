interface PlanPricingProps {
  priceKwh: number;
  priceKwh500: number;
  priceKwh1000: number;
  priceKwh2000: number;
  baseCharge?: number;
}

export function PlanPricing({ priceKwh, priceKwh500, priceKwh1000, priceKwh2000, baseCharge }: PlanPricingProps) {
  const formatPrice = (price: number) => {
    return (price * 100).toFixed(1) + "¢";
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <div className="flex justify-between items-baseline">
          <span className="text-3xl font-bold text-primary">
            {formatPrice(priceKwh)}
          </span>
          <span className="text-sm text-muted-foreground">per kWh</span>
        </div>
        <div className="text-sm text-muted-foreground space-y-1">
          <div>500 kWh: {formatPrice(priceKwh500)}</div>
          <div>1,000 kWh: {formatPrice(priceKwh1000)}</div>
          <div>2,000 kWh: {formatPrice(priceKwh2000)}</div>
        </div>
      </div>
      
      {baseCharge && (
        <div className="text-sm text-muted-foreground">
          Base Charge: ${baseCharge}/month
        </div>
      )}
    </div>
  );
}