import { Plan } from "@/lib/api";

export function filterPlans(
  plans: Plan[],
  {
    ratingFilter,
    planType,
    contractLength,
    prepaidFilter,
    timeOfUseFilter,
    companyFilter,
    sortOrder,
  }: {
    ratingFilter: string;
    planType: string;
    contractLength: string;
    prepaidFilter: string;
    timeOfUseFilter: string;
    companyFilter: string;
    sortOrder: string;
  }
) {
  let filteredPlans = [...plans];

  // Apply company filter
  if (companyFilter !== 'all') {
    filteredPlans = filteredPlans.filter(plan => plan.company_id === companyFilter);
  }

  // Apply rating filter
  if (ratingFilter !== 'all') {
    filteredPlans = filteredPlans.filter(plan => {
      const rating = plan.jdp_rating;
      const hasValidRating = rating !== null && rating > 0 && plan.jdp_rating_year && plan.jdp_rating_year !== "";
      
      switch (ratingFilter) {
        case 'rated-only':
          return hasValidRating;
        case '4-plus':
          return hasValidRating && rating >= 4;
        case '3-plus':
          return hasValidRating && rating >= 3;
        default:
          return true;
      }
    });
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

  // Sort plans
  return filteredPlans.sort((a, b) => {
    switch (sortOrder) {
      case 'price-asc':
        return a.price_kwh - b.price_kwh;
      case 'price-desc':
        return b.price_kwh - a.price_kwh;
      case 'length-asc':
        return (a.contract_length || 0) - (b.contract_length || 0);
      case 'length-desc':
        return (b.contract_length || 0) - (a.contract_length || 0);
      case 'rating-desc':
        const ratingA = a.jdp_rating !== null && a.jdp_rating > 0 && a.jdp_rating_year ? a.jdp_rating : 0;
        const ratingB = b.jdp_rating !== null && b.jdp_rating > 0 && b.jdp_rating_year ? b.jdp_rating : 0;
        return ratingB - ratingA;
      case 'rating-asc':
        const ratingAsc1 = a.jdp_rating !== null && a.jdp_rating > 0 && a.jdp_rating_year ? a.jdp_rating : 0;
        const ratingAsc2 = b.jdp_rating !== null && b.jdp_rating > 0 && b.jdp_rating_year ? b.jdp_rating : 0;
        return ratingAsc1 - ratingAsc2;
      default:
        return 0;
    }
  });
}