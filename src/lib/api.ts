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
    
    // Call our Supabase Edge Function instead of the API directly
    const response = await fetch('https://ucdahnlndirmiecyptkt.supabase.co/functions/v1/power-to-choose', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        zipCode,
        estimatedUse: estimatedUse !== 'any' ? estimatedUse : undefined
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[Frontend] API Error:', errorText);
      throw new Error(`API Error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log('[Frontend] API response:', data);

    if (data.error) {
      throw new Error(data.error);
    }

    // Transform and validate the plans
    const validatedPlans = data.map((plan: any, index: number) => {
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