import { Plan } from "@/lib/api";

export function filterPlans(
  plans: Plan[],
  {
    estimatedUse,
  }: {
    planType?: string;
    contractLength?: string;
    prepaidFilter?: string;
    timeOfUseFilter?: string;
    companyFilter?: string;
    sortOrder?: string;
    estimatedUse?: string;
  }
) {
  // Get the price for the selected kWh usage
  const getPriceForUsage = (plan: Plan): number => {
    switch (estimatedUse) {
      case "500":
        return plan.price_kwh500;
      case "1000":
        return plan.price_kwh1000;
      case "2000":
        return plan.price_kwh2000;
      default:
        return plan.price_kwh;
    }
  };

  // Sort plans based solely on price (lowest to highest)
  return [...plans].sort((a, b) => {
    const priceA = getPriceForUsage(a);
    const priceB = getPriceForUsage(b);
    return priceA - priceB;
  });
}