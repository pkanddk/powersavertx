interface PlanPricingProps {
  priceKwh500: number;
  priceKwh1000: number;
  priceKwh2000: number;
  baseCharge?: number;
  estimatedUse: string;
  pricingDetails?: string | null;
}

const formatPrice = (price: number) => {
  return (price * 100).toFixed(1);
};

export function PlanPricing({ 
  priceKwh500, 
  priceKwh1000, 
  priceKwh2000, 
  baseCharge,
  estimatedUse,
  pricingDetails
}: PlanPricingProps) {
  console.log("Current estimated use:", estimatedUse);
  
  const prices = [
    { id: "500", kwh: "500 kWh", price: priceKwh500 },
    { id: "1000", kwh: "1,000 kWh", price: priceKwh1000 },
    { id: "2000", kwh: "2,000 kWh", price: priceKwh2000 }
  ];

  return (
    <div className="space-y-4">
      <div className="text-sm font-medium text-gray-700 mb-2">Price per kWh</div>
      <div className="space-y-2">
        {prices.map((item) => {
          const isSelected = estimatedUse === item.id;
          console.log(`Checking ${item.id} against ${estimatedUse}: ${isSelected}`);
          
          return (
            <div 
              key={item.id}
              className={`
                flex items-center justify-between p-3 rounded-lg
                ${isSelected ? 'bg-primary/10 border border-primary' : 'bg-white'}
              `}
            >
              <span className={`text-sm ${isSelected ? 'text-primary font-medium' : 'text-gray-600'}`}>
                {item.kwh}
              </span>
              <div className="flex items-baseline gap-1">
                <span className={`text-lg font-medium ${isSelected ? 'text-primary' : 'text-gray-700'}`}>
                  {formatPrice(item.price)}¢
                </span>
                <span className={`text-xs ${isSelected ? 'text-primary' : 'text-gray-500'}`}>
                  per kWh
                </span>
              </div>
            </div>
          );
        })}
      </div>
      
      {baseCharge && (
        <div className="text-xs text-gray-500 border-t pt-2 mt-4">
          Base Charge: ${baseCharge}/month
        </div>
      )}

      {pricingDetails && (
        <div className="text-xs text-gray-500 border-t pt-2">
          {pricingDetails}
        </div>
      )}
    </div>
  );
}