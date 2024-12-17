import { Plan } from "@/lib/api";

export function filterPlans(
  plans: Plan[],
  {
    planType,
    contractLength,
    prepaidFilter,
    timeOfUseFilter,
    companyFilter,
    sortOrder,
    estimatedUse,
  }: {
    planType: string;
    contractLength: string;
    prepaidFilter: string;
    timeOfUseFilter: string;
    companyFilter: string;
    sortOrder: string;
    estimatedUse?: string;
  }
) {
  let filteredPlans = [...plans];

  // Apply company filter
  if (companyFilter !== 'all') {
    filteredPlans = filteredPlans.filter(plan => plan.company_id === companyFilter);
  }

  // Apply plan type filter
  if (planType !== 'all') {
    filteredPlans = filteredPlans.filter(plan => {
      if (planType === 'fixed') {
        return plan.plan_type_name === "Fixed Rate" || plan.plan_type_name === "1";
      } else if (planType === 'variable') {
        return plan.plan_type_name === "Variable Rate" || plan.plan_type_name === "";
      }
      return false;
    });
  }

  // Apply contract length filter
  if (contractLength !== 'all') {
    filteredPlans = filteredPlans.filter(plan => {
      const length = plan.contract_length || 0;
      switch (contractLength) {
        case '0-6': return length >= 0 && length <= 6;
        case '7-12': return length >= 7 && length <= 12;
        case '13+': return length >= 13;
        default: return true;
      }
    });
  }

  // Apply prepaid filter
  if (prepaidFilter !== 'all') {
    filteredPlans = filteredPlans.filter(plan => {
      const isPrepaid = plan.plan_type_name.toLowerCase().includes('prepaid');
      return prepaidFilter === 'prepaid-only' ? isPrepaid : !isPrepaid;
    });
  }

  // Apply time of use filter
  if (timeOfUseFilter !== 'all') {
    filteredPlans = filteredPlans.filter(plan => {
      const isTimeOfUse = plan.plan_type_name.toLowerCase().includes('time of use');
      return timeOfUseFilter === 'tou-only' ? isTimeOfUse : !isTimeOfUse;
    });
  }

  // Sort plans based on the selected kWh usage
  const getPriceForUsage = (plan: Plan) => {
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
  const sortedPlans = filteredPlans.sort((a, b) => {
    switch (sortOrder) {
      case 'price-asc':
        return getPriceForUsage(a) - getPriceForUsage(b);
      case 'price-desc':
        return getPriceForUsage(b) - getPriceForUsage(a);
      case 'length-asc':
        return (a.contract_length || 0) - (b.contract_length || 0);
      case 'length-desc':
        return (b.contract_length || 0) - (a.contract_length || 0);
      default:
        return 0;
    }
  });

  return sortedPlans;
}