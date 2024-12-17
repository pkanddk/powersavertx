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
        // Selected price view with MUCH more prominence
        <div className="relative">
          {/* Main selected price display */}
          <div className="text-center py-8 bg-primary/10 rounded-xl border-2 border-primary shadow-lg transform hover:scale-105 transition-all">
            <div className="text-lg font-semibold text-primary mb-2">
              {selectedPrice.usage}
            </div>
            <div className="text-7xl font-black text-primary tracking-tight">
              {formatPrice(selectedPrice.price)}
              <span className="text-3xl">¢</span>
            </div>
            <div className="text-base font-medium text-primary/80 mt-2">per kWh</div>
          </div>
          
          {/* Other prices shown very small */}
          <div className="mt-4 flex justify-center gap-6 text-xs text-muted-foreground">
            {estimatedUse !== "500" && (
              <div>500 kWh: {formatPrice(priceKwh500)}¢</div>
            )}
            {estimatedUse !== "1000" && (
              <div>1,000 kWh: {formatPrice(priceKwh1000)}¢</div>
            )}
            {estimatedUse !== "2000" && (
              <div>2,000 kWh: {formatPrice(priceKwh2000)}¢</div>
            )}
          </div>
        </div>
      ) : (
        // Default view with all prices, but with better visual hierarchy
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div 
              className="text-center p-4 rounded-xl border hover:border-primary/50 hover:bg-primary/5 transition-all cursor-pointer"
              onClick={() => console.log("500 kWh selected")}
            >
              <div className="text-sm font-medium text-muted-foreground mb-2">500 kWh</div>
              <div className="text-3xl font-bold text-foreground">
                {formatPrice(priceKwh500)}
                <span className="text-lg">¢</span>
              </div>
            </div>
            <div 
              className="text-center p-4 rounded-xl border hover:border-primary/50 hover:bg-primary/5 transition-all cursor-pointer"
              onClick={() => console.log("1000 kWh selected")}
            >
              <div className="text-sm font-medium text-muted-foreground mb-2">1,000 kWh</div>
              <div className="text-3xl font-bold text-foreground">
                {formatPrice(priceKwh1000)}
                <span className="text-lg">¢</span>
              </div>
            </div>
            <div 
              className="text-center p-4 rounded-xl border hover:border-primary/50 hover:bg-primary/5 transition-all cursor-pointer"
              onClick={() => console.log("2000 kWh selected")}
            >
              <div className="text-sm font-medium text-muted-foreground mb-2">2,000 kWh</div>
              <div className="text-3xl font-bold text-foreground">
                {formatPrice(priceKwh2000)}
                <span className="text-lg">¢</span>
              </div>
            </div>
          </div>
          <div className="text-center text-sm text-muted-foreground">
            Select a usage level to see detailed pricing
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
