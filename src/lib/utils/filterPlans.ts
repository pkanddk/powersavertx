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
    renewableFilter = "all",
    estimatedUse,
  }: {
    planType?: string;
    contractLength?: string;
    prepaidFilter?: string;
    timeOfUseFilter?: string;
    companyFilter?: string;
    sortOrder?: string;
    renewableFilter?: string;
    estimatedUse?: string;
  }
) {
  console.log('[filterPlans] Starting filtering with:', {
    planType,
    contractLength,
    prepaidFilter,
    timeOfUseFilter,
    companyFilter,
    sortOrder,
    renewableFilter,
    estimatedUse
  });

  let filteredPlans = [...plans];

  // Filter by plan type
  if (planType !== "all") {
    console.log('[filterPlans] Filtering by plan type:', planType);
    filteredPlans = filteredPlans.filter(plan => 
      plan.plan_type_name.toLowerCase().includes(planType.toLowerCase())
    );
  }

  // Filter by contract length
  if (contractLength !== "all") {
    console.log('[filterPlans] Filtering by contract length:', contractLength);
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
    console.log('[filterPlans] Filtering for prepaid plans only');
    filteredPlans = filteredPlans.filter(plan => plan.prepaid === true);
  } else if (prepaidFilter === "no-prepaid") {
    console.log('[filterPlans] Filtering out prepaid plans');
    filteredPlans = filteredPlans.filter(plan => plan.prepaid === false);
  }

  // Filter by time of use
  if (timeOfUseFilter === "tou-only") {
    console.log('[filterPlans] Filtering for time of use plans only');
    filteredPlans = filteredPlans.filter(plan => plan.timeofuse === true);
  } else if (timeOfUseFilter === "no-tou") {
    console.log('[filterPlans] Filtering out time of use plans');
    filteredPlans = filteredPlans.filter(plan => plan.timeofuse === false);
  }

  // Filter by company
  if (companyFilter !== "all") {
    console.log('[filterPlans] Filtering by company:', companyFilter);
    filteredPlans = filteredPlans.filter(plan => plan.company_id === companyFilter);
  }

  // Filter by renewable percentage
  if (renewableFilter !== "all") {
    console.log('[filterPlans] Filtering by renewable percentage:', renewableFilter);
    
    // Log all plans and their renewable percentages before filtering
    console.log('[filterPlans] All plans before renewable filtering:', 
      filteredPlans.map(plan => ({
        plan_name: plan.plan_name,
        renewable_percentage: plan.renewable_percentage
      }))
    );

    if (renewableFilter === "0-25") {
      // For "0-25%" option, show plans with 0-25% renewable energy
      filteredPlans = filteredPlans.filter(plan => {
        const isInRange = plan.renewable_percentage !== null && plan.renewable_percentage >= 0 && plan.renewable_percentage < 25;
        console.log(`[filterPlans] Plan ${plan.plan_name} renewable percentage: ${plan.renewable_percentage}, is in 0-25% range: ${isInRange}`);
        return isInRange;
      });
    } else {
      // For percentage thresholds (25, 50, 100), show plans with at least that percentage
      const percentage = parseInt(renewableFilter, 10);
      filteredPlans = filteredPlans.filter(plan => {
        const meetsThreshold = plan.renewable_percentage !== null && plan.renewable_percentage >= percentage;
        console.log(`[filterPlans] Plan ${plan.plan_name} renewable percentage: ${plan.renewable_percentage}, meets ${percentage}% threshold: ${meetsThreshold}`);
        return meetsThreshold;
      });
    }

    // Log the filtered plans
    console.log('[filterPlans] Plans after renewable filtering:', 
      filteredPlans.map(plan => ({
        plan_name: plan.plan_name,
        renewable_percentage: plan.renewable_percentage
      }))
    );
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
        return plan.price_kwh1000; // Default to 1000 kWh price
    }
  };

  // Always sort by price for the selected usage
  console.log('[filterPlans] Sorting plans by price for usage:', estimatedUse);
  filteredPlans.sort((a, b) => {
    // If sortOrder is price-desc, reverse the sort
    const multiplier = sortOrder === "price-desc" ? -1 : 1;
    return (getPriceForUsage(a) - getPriceForUsage(b)) * multiplier;
  });

  console.log(`[filterPlans] Returning ${filteredPlans.length} filtered plans`);
  return filteredPlans;
}