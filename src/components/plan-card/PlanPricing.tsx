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
  
  // Create array of all prices with their usage levels
  const allPrices = [
    { usage: "500 kWh", price: priceKwh500, key: "500" },
    { usage: "1,000 kWh", price: priceKwh1000, key: "1000" },
    { usage: "2,000 kWh", price: priceKwh2000, key: "2000" }
  ];

  // Split prices into selected and non-selected
  const selectedPrice = allPrices.find(p => p.key === estimatedUse);
  const otherPrices = allPrices.filter(p => p.key !== estimatedUse);
  
  // Combine them with selected first, then others
  const orderedPrices = selectedPrice ? [selectedPrice, ...otherPrices] : allPrices;

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
        {orderedPrices.map(({ usage, price, key }) => (
          <PriceDisplay 
            key={key}
            usage={usage}
            price={price}
            isSelected={key === estimatedUse}
          />
        ))}
      </div>
      
      {baseCharge && (
        <div className="text-xs text-gray-500 border-t pt-2 mt-4">
          Base Charge: ${baseCharge}/month
        </div>
      )}
    </div>
  );
}