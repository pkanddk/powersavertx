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
  
  console.log("[PlanPricing] Current estimatedUse:", estimatedUse);

  const formatPrice = (price: number) => {
    return (price * 100).toFixed(1) + "¢";
  };

  const getSelectedPrice = () => {
    switch(estimatedUse) {
      case "500": return priceKwh500;
      case "1000": return priceKwh1000;
      case "2000": return priceKwh2000;
      default: return null;
    }
  };

  const selectedPrice = getSelectedPrice();

  return (
    <div className="space-y-4">
      {selectedPrice && (
        <div className="text-center mb-4 p-4 bg-primary/10 rounded-lg">
          <div className="text-sm font-medium text-primary">Selected Usage: {estimatedUse} kWh</div>
          <div className="text-3xl font-bold text-primary mt-1">
            {formatPrice(selectedPrice)}
          </div>
        </div>
      )}
      
      <div className="grid grid-cols-3 gap-2 bg-secondary/20 rounded-lg p-3">
        <div className="text-center p-2">
          <div className="text-sm font-medium text-muted-foreground">500 kWh</div>
          <div className="text-sm text-muted-foreground">
            {formatPrice(priceKwh500)}
          </div>
        </div>
        <div className="text-center p-2">
          <div className="text-sm font-medium text-muted-foreground">1,000 kWh</div>
          <div className="text-sm text-muted-foreground">
            {formatPrice(priceKwh1000)}
          </div>
        </div>
        <div className="text-center p-2">
          <div className="text-sm font-medium text-muted-foreground">2,000 kWh</div>
          <div className="text-sm text-muted-foreground">
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