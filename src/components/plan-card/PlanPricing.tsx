import { formatPrice } from "@/lib/utils/formatPrice";

interface PlanPricingProps {
  priceKwh500: number;
  priceKwh1000: number;
  priceKwh2000: number;
  baseCharge: number | null;
  estimatedUse: string;
  detailKwh500?: string | null;
  detailKwh1000?: string | null;
  detailKwh2000?: string | null;
}

export function PlanPricing({ 
  priceKwh500, 
  priceKwh1000, 
  priceKwh2000, 
  baseCharge,
  estimatedUse,
  detailKwh500,
  detailKwh1000,
  detailKwh2000
}: PlanPricingProps) {
  const getHighlightedPrice = () => {
    switch (estimatedUse) {
      case "500":
        return { price: priceKwh500, detail: detailKwh500 };
      case "1000":
        return { price: priceKwh1000, detail: detailKwh1000 };
      case "2000":
        return { price: priceKwh2000, detail: detailKwh2000 };
      default:
        return { price: priceKwh1000, detail: detailKwh1000 };
    }
  };

  const highlightedPrice = getHighlightedPrice();

  return (
    <div className="space-y-2">
      <div className="text-3xl font-bold">
        {formatPrice(highlightedPrice.price)}<span className="text-base font-normal">/kWh</span>
      </div>
      
      {highlightedPrice.detail && (
        <p className="text-sm text-muted-foreground">
          {highlightedPrice.detail}
        </p>
      )}

      <div className="text-sm space-y-1">
        <div className="flex justify-between">
          <span>500 kWh</span>
          <span>{formatPrice(priceKwh500)}/kWh</span>
        </div>
        <div className="flex justify-between">
          <span>1000 kWh</span>
          <span>{formatPrice(priceKwh1000)}/kWh</span>
        </div>
        <div className="flex justify-between">
          <span>2000 kWh</span>
          <span>{formatPrice(priceKwh2000)}/kWh</span>
        </div>
        {baseCharge && (
          <div className="flex justify-between text-muted-foreground">
            <span>Base Charge</span>
            <span>${baseCharge}/month</span>
          </div>
        )}
      </div>
    </div>
  );
}