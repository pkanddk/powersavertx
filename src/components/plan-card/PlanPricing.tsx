interface PlanPricingProps {
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
    return (price * 100).toFixed(1);
  };

  const getSelectedPrice = () => {
    switch(estimatedUse) {
      case "500": return { usage: "500 kWh", price: priceKwh500 };
      case "1000": return { usage: "1,000 kWh", price: priceKwh1000 };
      case "2000": return { usage: "2,000 kWh", price: priceKwh2000 };
      default: return null;
    }
  };

  const selectedPrice = getSelectedPrice();

  return (
    <div className="space-y-6">
      {selectedPrice ? (
        // Selected price view
        <div className="text-center py-4 bg-primary/5 rounded-lg">
          <div className="text-sm font-medium text-primary mb-2">
            {selectedPrice.usage}
          </div>
          <div className="text-6xl font-bold text-primary tracking-tight">
            {formatPrice(selectedPrice.price)}
            <span className="text-2xl">¢</span>
          </div>
          <div className="text-sm text-primary/80 mt-1">per kWh</div>
        </div>
      ) : (
        // Default view showing all prices
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-2 rounded-lg hover:bg-primary/5 transition-colors">
            <div className="text-sm font-medium text-muted-foreground mb-1">500 kWh</div>
            <div className="text-2xl font-semibold">
              {formatPrice(priceKwh500)}¢
            </div>
          </div>
          <div className="text-center p-2 rounded-lg hover:bg-primary/5 transition-colors">
            <div className="text-sm font-medium text-muted-foreground mb-1">1,000 kWh</div>
            <div className="text-2xl font-semibold">
              {formatPrice(priceKwh1000)}¢
            </div>
          </div>
          <div className="text-center p-2 rounded-lg hover:bg-primary/5 transition-colors">
            <div className="text-sm font-medium text-muted-foreground mb-1">2,000 kWh</div>
            <div className="text-2xl font-semibold">
              {formatPrice(priceKwh2000)}¢
            </div>
          </div>
        </div>
      )}
      
      {baseCharge && (
        <div className="text-sm text-muted-foreground text-center border-t pt-4">
          Base Charge: ${baseCharge}/month
        </div>
      )}
    </div>
  );
}