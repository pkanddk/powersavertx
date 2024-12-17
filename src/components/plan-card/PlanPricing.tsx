interface PlanPricingProps {
  priceKwh500: number;
  priceKwh1000: number;
  priceKwh2000: number;
  baseCharge?: number;
  estimatedUse: string;
}

const formatPrice = (price: number) => {
  return (price * 100).toFixed(1);
};

export function PlanPricing({ 
  priceKwh500, 
  priceKwh1000, 
  priceKwh2000, 
  baseCharge,
  estimatedUse
}: PlanPricingProps) {
  
  const getSelectedPrice = () => {
    switch(estimatedUse) {
      case "500": return { usage: "500 kWh", price: priceKwh500 };
      case "1000": return { usage: "1,000 kWh", price: priceKwh1000 };
      case "2000": return { usage: "2,000 kWh", price: priceKwh2000 };
      default: return null;
    }
  };

  const selectedPrice = getSelectedPrice();

  const PriceDisplay = ({ usage, price, isSelected }: { usage: string; price: number; isSelected: boolean }) => (
    <div 
      className={`
        flex items-center justify-between p-3 rounded-lg
        ${isSelected ? 'bg-primary/10 border border-primary' : 'hover:bg-gray-50'}
      `}
    >
      <span className="text-sm text-gray-600">{usage}</span>
      <div className="flex items-baseline">
        <span className={`font-medium ${isSelected ? 'text-primary' : 'text-gray-700'}`}>
          {formatPrice(price)}¢
        </span>
        <span className="text-xs text-gray-500 ml-1">per kWh</span>
      </div>
    </div>
  );

  return (
    <div className="space-y-4">
      <div className="text-sm font-medium text-gray-700 mb-2">Price per kWh</div>
      <div className="space-y-2">
        <PriceDisplay 
          usage="500 kWh" 
          price={priceKwh500} 
          isSelected={estimatedUse === "500"}
        />
        <PriceDisplay 
          usage="1,000 kWh" 
          price={priceKwh1000} 
          isSelected={estimatedUse === "1000"}
        />
        <PriceDisplay 
          usage="2,000 kWh" 
          price={priceKwh2000} 
          isSelected={estimatedUse === "2000"}
        />
      </div>
      
      {baseCharge && (
        <div className="text-xs text-gray-500 border-t pt-2 mt-4">
          Base Charge: ${baseCharge}/month
        </div>
      )}
    </div>
  );
}