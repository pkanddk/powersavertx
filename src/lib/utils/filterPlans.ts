import { Plan } from "@/lib/api";

export function filterPlans(
  plans: Plan[],
  {
    planType,
    contractLength,
    timeOfUseFilter,
    companyFilter,
    sortOrder,
    estimatedUse,
    minUsageFilter,
    renewableFilter,
  }: {
    planType?: string;
    contractLength?: string;
    timeOfUseFilter?: string;
    companyFilter?: string;
    sortOrder?: string;
    estimatedUse?: string;
    minUsageFilter?: string;
    renewableFilter?: string;
  }
) {
  let filteredPlans = [...plans];

  // Filter by contract length
  if (contractLength && contractLength !== "all") {
    filteredPlans = filteredPlans.filter(plan => {
      const length = plan.contract_length || 0;
      switch (contractLength) {
        case "0-6":
          return length >= 0 && length <= 6;
        case "6-12":
          return length > 6 && length <= 12;
        case "12-24":
          return length > 12 && length <= 24;
        case "24+":
          return length > 24;
        default:
          return true;
      }
    });
  }

  // Filter by plan type
  if (planType && planType !== "all") {
    filteredPlans = filteredPlans.filter(plan => {
      const type = plan.plan_type_name.toLowerCase();
      return type.includes(planType.toLowerCase());
    });
  }

  // Filter by minimum usage
  if (minUsageFilter && minUsageFilter !== "all") {
    filteredPlans = filteredPlans.filter(plan => {
      switch (minUsageFilter) {
        case "no-minimum":
          return !plan.minimum_usage;
        default:
          return true;
      }
    });
  }

  // Filter by company
  if (companyFilter && companyFilter !== "all") {
    filteredPlans = filteredPlans.filter(plan => plan.company_id === companyFilter);
  }

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

  // Sort plans
  if (sortOrder) {
    filteredPlans.sort((a, b) => {
      switch (sortOrder) {
        case "price-asc":
          return getPriceForUsage(a) - getPriceForUsage(b);
        case "price-desc":
          return getPriceForUsage(b) - getPriceForUsage(a);
        case "length-asc":
          return (a.contract_length || 0) - (b.contract_length || 0);
        case "length-desc":
          return (b.contract_length || 0) - (a.contract_length || 0);
        default:
          return 0;
      }
    });
  }

  return filteredPlans;
}