import { logger } from './logger.ts';

export const transformPlan = (plan: any) => {
  logger.info("Transforming plan", plan);
  
  const isPrepaid = Boolean(plan.prepaid_plan || plan.is_prepaid || plan.prepaid || false);
  
  let renewablePercentage = 0;
  if (plan.plan_details) {
    const details = plan.plan_details.toLowerCase();
    if (details.includes('100% clean renewable energy') || details.includes('100% renewable')) {
      renewablePercentage = 100;
    } else if (details.includes('renewable')) {
      renewablePercentage = 50;
    }
  }

  const rawTimeOfUse = plan.timeofuse || plan.time_of_use || plan.tou || false;
  let isTimeOfUse = Boolean(rawTimeOfUse);

  const planDetailsLower = (plan.plan_details || '').toLowerCase();
  const planNameLower = (plan.plan_name || '').toLowerCase();
  
  if (!isTimeOfUse) {
    isTimeOfUse = planDetailsLower.includes('time of use') || 
                  planDetailsLower.includes('time-of-use') ||
                  planDetailsLower.includes('tou') ||
                  planNameLower.includes('time of use') ||
                  planNameLower.includes('time-of-use') ||
                  planNameLower.includes('tou');
  }

  return {
    company_id: String(plan.company_id || ""),
    company_name: String(plan.company_name || ""),
    company_logo: plan.company_logo || null,
    plan_name: String(plan.plan_name || ""),
    plan_type_name: String(plan.plan_type || ""),
    fact_sheet: plan.fact_sheet || null,
    go_to_plan: plan.enroll_plan_url || plan.go_to_plan || plan.enroll_now || null,
    minimum_usage: Boolean(plan.minimum_usage),
    new_customer: Boolean(plan.new_customer),
    plan_details: String(plan.special_terms || ""),
    price_kwh: parseFloat(plan.price_kwh || plan.rate500 || 0),
    price_kwh500: parseFloat(plan.price_kwh500 || plan.rate500 || 0),
    price_kwh1000: parseFloat(plan.price_kwh1000 || plan.rate1000 || 0),
    price_kwh2000: parseFloat(plan.price_kwh2000 || plan.rate2000 || 0),
    base_charge: plan.base_charge ? parseFloat(plan.base_charge) : null,
    contract_length: plan.term_value ? parseInt(plan.term_value) : null,
    prepaid: isPrepaid,
    zip_code: String(plan.zip_code || ""),
    renewable_percentage: renewablePercentage,
    timeofuse: isTimeOfUse,
    jdp_rating: plan.jdp_rating ? parseFloat(plan.jdp_rating) : null,
    jdp_rating_year: plan.jdp_rating_year || null
  };
};