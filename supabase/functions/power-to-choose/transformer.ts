import { logger } from './logger.ts';

export const transformPlan = (plan: any) => {
  logger.info(`Transforming plan ${plan.plan_id || 'unknown'}:`, plan);
  
  const isPrepaid = Boolean(plan.prepaid_plan || plan.is_prepaid || plan.prepaid || false);
  
  let renewablePercentage = 0;
  if (plan.renewable_energy_description) {
    const match = plan.renewable_energy_description.match(/(\d+)%/);
    if (match) {
      renewablePercentage = parseInt(match[1], 10);
    }
  }
  
  // Explicitly log the timeofuse value from the API
  logger.info(`Time of Use value for plan ${plan.plan_name}:`, {
    raw_value: plan.timeofuse,
    plan_id: plan.plan_id,
    plan_name: plan.plan_name
  });

  // Ensure timeofuse is explicitly converted to boolean
  const isTimeOfUse = Boolean(plan.timeofuse);
  
  const transformedPlan = {
    company_id: String(plan.company_id || ""),
    company_name: String(plan.company_name || ""),
    company_logo: plan.company_logo || null,
    plan_name: String(plan.plan_name || ""),
    plan_type_name: String(plan.rate_type || ""),
    fact_sheet: plan.fact_sheet || null,
    go_to_plan: plan.go_to_plan || plan.enroll_now || null,
    minimum_usage: Boolean(plan.minimum_usage),
    new_customer: Boolean(plan.new_customer),
    plan_details: String(plan.special_terms || ""),
    price_kwh: parseFloat(plan.price_kwh1000 || plan.rate1000 || 0),
    price_kwh500: parseFloat(plan.price_kwh500 || plan.rate500 || 0),
    price_kwh1000: parseFloat(plan.price_kwh1000 || plan.rate1000 || 0),
    price_kwh2000: parseFloat(plan.price_kwh2000 || plan.rate2000 || 0),
    base_charge: null,
    contract_length: plan.term_value ? parseInt(plan.term_value) : null,
    prepaid: isPrepaid,
    zip_code: String(plan.zip_code || ""),
    renewable_percentage: renewablePercentage,
    timeofuse: isTimeOfUse,
    jdp_rating: plan.jdp_rating ? parseFloat(plan.jdp_rating) : null,
    jdp_rating_year: plan.jdp_rating_year || null
  };

  // Log the transformed plan to verify timeofuse field
  logger.info(`Transformed plan ${plan.plan_name}:`, {
    plan_id: plan.plan_id,
    timeofuse: transformedPlan.timeofuse
  });

  return transformedPlan;
};