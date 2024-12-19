import { Plan } from "@/lib/api";

export function filterPlans(
  plans: Plan[],
  {
    planType = "all",
    contractLength = "all",
    prepaidFilter = "all",
    timeOfUseFilter = "all",
    companyFilter = "all",
    sortOrder = "price-asc",
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
  let filteredPlans = [...plans];

  // Filter by plan type
  if (planType !== "all") {
    filteredPlans = filteredPlans.filter(plan => 
      plan.plan_type_name.toLowerCase().includes(planType.toLowerCase())
    );
  }

  // Filter by contract length
  if (contractLength !== "all") {
    if (contractLength === "0-6") {
      filteredPlans = filteredPlans.filter(plan => 
        plan.contract_length !== null && plan.contract_length <= 6
      );
    } else if (contractLength === "7-12") {
      filteredPlans = filteredPlans.filter(plan => 
        plan.contract_length !== null && 
        plan.contract_length > 6 && 
        plan.contract_length <= 12
      );
    } else if (contractLength === "13+") {
      filteredPlans = filteredPlans.filter(plan => 
        plan.contract_length !== null && plan.contract_length > 12
      );
    }
  }

  // Filter by prepaid
  if (prepaidFilter === "prepaid-only") {
    filteredPlans = filteredPlans.filter(plan => plan.prepaid === true);
  } else if (prepaidFilter === "no-prepaid") {
    filteredPlans = filteredPlans.filter(plan => plan.prepaid === false);
  }

  // Filter by time of use
  if (timeOfUseFilter === "tou-only") {
    filteredPlans = filteredPlans.filter(plan => plan.timeofuse === true);
  } else if (timeOfUseFilter === "no-tou") {
    filteredPlans = filteredPlans.filter(plan => plan.timeofuse === false);
  }

  // Filter by company
  if (companyFilter !== "all") {
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
  filteredPlans.sort((a, b) => {
    switch (sortOrder) {
      case "price-desc":
        return getPriceForUsage(b) - getPriceForUsage(a);
      case "length-asc":
        return (a.contract_length || 0) - (b.contract_length || 0);
      case "length-desc":
        return (b.contract_length || 0) - (a.contract_length || 0);
      case "price-asc":
      default:
        return getPriceForUsage(a) - getPriceForUsage(b);
    }
  });

  return filteredPlans;
}