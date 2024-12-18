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

  // Filter by time of use
  if (timeOfUseFilter && timeOfUseFilter !== "all") {
    console.log("[filterPlans] Filtering by Time of Use:", timeOfUseFilter);
    console.log("[filterPlans] Plans before TOU filter:", filteredPlans.length);
    console.log("[filterPlans] TOU Plans available:", filteredPlans.filter(plan => plan.timeofuse === true).length);
    
    filteredPlans = filteredPlans.filter(plan => {
      const isTimeOfUse = plan.timeofuse;
      console.log(`[filterPlans] Plan "${plan.plan_name}" timeofuse:`, isTimeOfUse);
      
      if (timeOfUseFilter === "tou-only") {
        return isTimeOfUse === true;
      } else if (timeOfUseFilter === "no-tou") {
        return isTimeOfUse === false;
      }
      return true;
    });

    console.log("[filterPlans] Plans after TOU filter:", filteredPlans.length);
  }

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

  // Filter by renewable percentage
  if (renewableFilter && renewableFilter !== "all") {
    filteredPlans = filteredPlans.filter(plan => {
      const renewablePercentage = plan.renewable_percentage || 0;
      switch (renewableFilter) {
        case "0-25":
          return renewablePercentage >= 0 && renewablePercentage <= 25;
        case "25-50":
          return renewablePercentage > 25 && renewablePercentage <= 50;
        case "50-75":
          return renewablePercentage > 50 && renewablePercentage <= 75;
        case "75-99":
          return renewablePercentage > 75 && renewablePercentage < 100;
        case "100":
          return renewablePercentage === 100;
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