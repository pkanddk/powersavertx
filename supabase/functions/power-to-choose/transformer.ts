import { logger } from './logger.ts';

export const transformPlan = (plan: any) => {
  logger.info(`Raw plan data from API for plan ${plan.plan_id}:`, {
    plan_id: plan.plan_id,
    plan_name: plan.plan_name,
    timeofuse: plan.timeofuse,
    raw_plan: plan
  });
  
  const isPrepaid = Boolean(plan.prepaid_plan || plan.is_prepaid || plan.prepaid || false);
  
  let renewablePercentage = 0;
  if (plan.renewable_energy_description) {
    const match = plan.renewable_energy_description.match(/(\d+)%/);
    if (match) {
      renewablePercentage = parseInt(match[1], 10);
    }
  }
  
  // Explicitly log the timeofuse value from the API
  logger.info(`Time of Use processing for plan ${plan.plan_name}:`, {
    plan_id: plan.plan_id,
    raw_timeofuse: plan.timeofuse,
    raw_type: typeof plan.timeofuse,
    plan_type: plan.plan_type,
    rate_type: plan.rate_type
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
    base_charge: null, // We'll update this if we find it in pricing_details
    contract_length: plan.term_value ? parseInt(plan.term_value) : null,
    prepaid: isPrepaid,
    zip_code: String(plan.zip_code || ""),
    renewable_percentage: renewablePercentage,
    timeofuse: isTimeOfUse,
    jdp_rating: plan.jdp_rating ? parseFloat(plan.jdp_rating) : null,
    jdp_rating_year: plan.jdp_rating_year || null,
    // Additional fields from the API
    pricing_details: plan.pricing_details || null,
    terms_of_service: plan.terms_of_service || null,
    yrac_url: plan.yrac_url || null,
    enroll_phone: plan.enroll_phone || null,
    company_tdu_name: plan.company_tdu_name || null,
    website: plan.website || null,
    promotions: plan.promotions || null,
    detail_kwh500: plan.detail_kwh500 || null,
    detail_kwh1000: plan.detail_kwh1000 || null,
    detail_kwh2000: plan.detail_kwh2000 || null
  };

  // Extract base charge from pricing_details if available
  if (plan.pricing_details) {
    const baseChargeMatch = plan.pricing_details.match(/Base Charge:\s*\$?(\d+\.?\d*)/i);
    if (baseChargeMatch) {
      transformedPlan.base_charge = parseFloat(baseChargeMatch[1]);
    }
  }

  // Log the transformed plan to verify all fields
  logger.info(`Transformed plan ${plan.plan_name}:`, {
    plan_id: plan.plan_id,
    timeofuse: transformedPlan.timeofuse,
    transformed_plan: transformedPlan
  });

  return transformedPlan;
};