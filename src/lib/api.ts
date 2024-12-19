import { z } from "zod";

export const PlanSchema = z.object({
  company_id: z.string(),
  company_name: z.string(),
  company_logo: z.string().nullable(),
  company_tdu_name: z.string().nullable(),
  plan_name: z.string(),
  plan_type_name: z.string(),
  fact_sheet: z.string().nullable(),
  go_to_plan: z.string().nullable(),
  minimum_usage: z.boolean().nullable(),
  new_customer: z.boolean().nullable(),
  plan_details: z.string().nullable(),
  price_kwh: z.number(),
  price_kwh500: z.number(),
  price_kwh1000: z.number(),
  price_kwh2000: z.number(),
  detail_kwh500: z.string().nullable(),
  detail_kwh1000: z.string().nullable(),
  detail_kwh2000: z.string().nullable(),
  base_charge: z.number().nullable(),
  contract_length: z.number().nullable(),
  jdp_rating: z.number().nullable(),
  jdp_rating_year: z.string().nullable(),
  prepaid: z.boolean().nullable(),
  renewable_percentage: z.number().nullable(),
  timeofuse: z.boolean().nullable(),
  pricing_details: z.string().nullable(),
  terms_of_service: z.string().nullable(),
  yrac_url: z.string().nullable(),
  enroll_phone: z.string().nullable(),
  website: z.string().nullable()
});

export type Plan = z.infer<typeof PlanSchema>;

export const searchPlans = async (zipCode: string, estimatedUse?: string) => {
  try {
    console.log(`[Frontend] Searching plans for ZIP: ${zipCode}, Usage: ${estimatedUse}`);
    
    // Construct API URL
    let apiUrl = `http://api.powertochoose.org/api/PowerToChoose/plans?zip_code=${zipCode}`;
    if (estimatedUse && estimatedUse !== "any") {
      apiUrl += `&kWh=${estimatedUse}`;
    }

    console.log('[Frontend] Calling API with URL:', apiUrl);
    
    const response = await fetch(apiUrl, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[Frontend] API Error:', errorText);
      throw new Error(`API Error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log('[Frontend] Raw API response:', data);

    // Handle different response formats
    let plans = [];
    if (Array.isArray(data)) {
      plans = data;
    } else if (data.data && Array.isArray(data.data)) {
      plans = data.data;
    } else if (data.Results && Array.isArray(data.Results)) {
      plans = data.Results;
    } else {
      console.error('[Frontend] Unexpected response structure:', data);
      throw new Error("Unexpected response structure from API");
    }

    // Transform the data to match our schema
    const transformedPlans = plans.map(plan => ({
      company_id: String(plan.company_id || ""),
      company_name: String(plan.company_name || ""),
      company_logo: plan.company_logo || null,
      company_tdu_name: plan.company_tdu_name || null,
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
      detail_kwh500: plan.detail_kwh500 || null,
      detail_kwh1000: plan.detail_kwh1000 || null,
      detail_kwh2000: plan.detail_kwh2000 || null,
      base_charge: null, // We'll update this if we find it in pricing_details
      contract_length: plan.term_value ? parseInt(plan.term_value) : null,
      jdp_rating: plan.jdp_rating ? parseFloat(plan.jdp_rating) : null,
      jdp_rating_year: plan.jdp_rating_year || null,
      prepaid: Boolean(plan.prepaid_plan || plan.is_prepaid || plan.prepaid || false),
      renewable_percentage: plan.renewable_energy_description ? 
        parseInt(plan.renewable_energy_description.match(/(\d+)%/)?.[1] || "0") : 0,
      timeofuse: Boolean(plan.timeofuse),
      pricing_details: plan.pricing_details || null,
      terms_of_service: plan.terms_of_service || null,
      yrac_url: plan.yrac_url || null,
      enroll_phone: plan.enroll_phone || null,
      website: plan.website || null
    }));

    // Parse and validate each plan
    const validatedPlans = transformedPlans.map((plan, index) => {
      try {
        return PlanSchema.parse(plan);
      } catch (error) {
        console.error(`[Frontend] Validation error for plan ${index}:`, error);
        console.error(`[Frontend] Problem plan data:`, plan);
        throw error;
      }
    });

    console.log('[Frontend] Validated plans:', validatedPlans);
    return validatedPlans;

  } catch (error) {
    console.error("[Frontend] Error fetching plans:", error);
    throw error;
  }
};

export const getPlanTypes = async () => {
  return ["Fixed Rate", "Variable Rate", "Indexed Rate"];
};

export const getRenewableOptions = async () => {
  return ["0%", "6%", "15%", "100%"];
};