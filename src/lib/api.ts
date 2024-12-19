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
    const { data: responseData, error: functionError } = await supabase.functions.invoke('power-to-choose', {
      body: { zipCode, estimatedUse },
    });

    console.log('[API] Edge Function raw response:', responseData);

    if (functionError) {
      console.error('[API] Error calling Edge Function:', functionError);
      throw functionError;
    }

    if (!responseData) {
      console.error('[API] No data received from Edge Function');
      throw new Error('No data received from Edge Function');
    }

    // If responseData is an error object, throw it
    if ('error' in responseData) {
      console.error('[API] Error from Edge Function:', responseData.error);
      throw new Error(responseData.error);
    }

    // Ensure we have an array to work with
    const plansArray = Array.isArray(responseData) ? responseData : [responseData];
    console.log('[API] Plans array before validation:', plansArray);

    // Parse and validate each plan individually to identify specific validation issues
    const validatedPlans = plansArray.map((plan, index) => {
      try {
        return PlanSchema.parse(plan);
      } catch (error) {
        console.error(`[API] Validation error for plan ${index}:`, error);
        console.error(`[API] Problem plan data:`, plan);
        throw error;
      }
    });

    console.log('[API] Validated plans:', validatedPlans);
    
    return validatedPlans;
  } catch (error) {
    console.error("[API] Error fetching plans:", error);
    throw error;
  }
};