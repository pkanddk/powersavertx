import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";

export const PlanSchema = z.object({
  company_id: z.string(),
  company_name: z.string(),
  company_logo: z.string().nullable(),
  company_tdu_name: z.string().nullable(),
  plan_name: z.string(),
  plan_type_name: z.string(),
  fact_sheet: z.string().nullable(),
  go_to_plan: z.string().nullable(),
  minimum_usage: z.boolean().default(false),
  new_customer: z.boolean().default(false),
  plan_details: z.string().nullable(),
  price_kwh: z.number(),
  price_kwh500: z.number(),
  price_kwh1000: z.number(),
  price_kwh2000: z.number(),
  base_charge: z.number().nullable(),
  contract_length: z.number().nullable(),
  prepaid: z.boolean().default(false),
  timeofuse: z.boolean().default(false),
  renewable_percentage: z.number().nullable(),
  pricing_details: z.string().nullable(),
  promotions: z.string().nullable(),
  enroll_phone: z.string().nullable(),
  website: z.string().nullable(),
  terms_of_service: z.string().nullable(),
  yrac_url: z.string().nullable(),
  detail_kwh500: z.string().nullable(),
  detail_kwh1000: z.string().nullable(),
  detail_kwh2000: z.string().nullable()
});

export type Plan = z.infer<typeof PlanSchema>;

export const searchPlans = async (zipCode: string, estimatedUse?: string) => {
  try {
    console.log(`[API] Searching plans for ZIP: ${zipCode}, Usage: ${estimatedUse}`);
    
    // Call the Edge Function
    console.log('[API] Calling Edge Function with params:', { zipCode, estimatedUse });
    const { data, error } = await supabase.functions.invoke('power-to-choose', {
      body: { zipCode, estimatedUse },
    });

    console.log('[API] Edge Function response:', data);

    if (error) {
      console.error('[API] Error from Edge Function:', error);
      throw new Error(error.message || 'Unable to fetch energy plans. Please try again later.');
    }

    if (!data) {
      console.error('[API] No data received from Edge Function');
      throw new Error('No energy plans found. Please try a different ZIP code.');
    }

    // If the response contains an error message, throw it
    if ('error' in data && typeof data.message === 'string') {
      console.error('[API] Error message in response:', data.message);
      throw new Error(data.message);
    }

    // Ensure we have an array to work with
    const plansArray = Array.isArray(data) ? data : [data];
    console.log('[API] Plans array before validation:', plansArray);

    // Parse and validate each plan individually
    const validatedPlans = plansArray.map((plan, index) => {
      try {
        return PlanSchema.parse(plan);
      } catch (error) {
        console.error(`[API] Validation error for plan ${index}:`, error);
        console.error(`[API] Problem plan data:`, plan);
        throw new Error('We encountered an issue processing the energy plans. Please try again.');
      }
    });

    console.log('[API] Validated plans:', validatedPlans);
    return validatedPlans;
  } catch (error) {
    console.error("[API] Error fetching plans:", error);
    // Ensure we always return a user-friendly error message
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error('Unable to fetch energy plans. Please try again later.');
  }
};