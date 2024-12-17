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

  const PriceBox = ({ usage, price, isSelected }: { usage: string; price: number; isSelected: boolean }) => (
    <div className={`
      rounded-2xl p-6 text-center
      ${isSelected ? 'bg-primary/10 border-2 border-primary' : 'bg-gray-50 border border-gray-200'}
    `}>
      <div className="text-lg text-gray-600 mb-2">{usage}</div>
      <div className="flex items-baseline justify-center">
        <span className="text-5xl font-bold">{formatPrice(price)}</span>
        <span className="text-2xl">¢</span>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-4">
        <PriceBox 
          usage="500 kWh" 
          price={priceKwh500} 
          isSelected={estimatedUse === "500"}
        />
        <PriceBox 
          usage="1,000 kWh" 
          price={priceKwh1000} 
          isSelected={estimatedUse === "1000"}
        />
        <PriceBox 
          usage="2,000 kWh" 
          price={priceKwh2000} 
          isSelected={estimatedUse === "2000"}
        />
      </div>
      
      {baseCharge && (
        <div className="text-sm text-muted-foreground text-center border-t pt-4">
          Base Charge: ${baseCharge}/month
        </div>
      )}
    </div>
  );
}