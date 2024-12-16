import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";

export const PlanSchema = z.object({
  company_id: z.string(),
  company_name: z.string(),
  company_logo: z.string().nullable(),
  plan_name: z.string(),
  plan_type_name: z.string(),
  fact_sheet: z.string().nullable(),
  go_to_plan: z.string().nullable(),
  jdp_rating: z.number().nullable(),
  jdp_rating_year: z.string().nullable(),
  minimum_usage: z.boolean().nullable(),
  new_customer: z.boolean().nullable(),
  plan_details: z.string().nullable(),
  price_kwh: z.number(),
  base_charge: z.number().nullable(),
  contract_length: z.number().nullable()
});

export type Plan = z.infer<typeof PlanSchema>;

export const searchPlans = async (zipCode: string, estimatedUse?: string) => {
  try {
    console.log(`Searching plans for ZIP: ${zipCode}, Usage: ${estimatedUse}`);
    
    // Call the Edge Function
    const { data: responseData, error } = await supabase.functions.invoke('power-to-choose', {
      body: { zipCode, estimatedUse },
    });

    console.log('Raw Edge Function response:', responseData);

    if (error) {
      console.error('Error calling Edge Function:', error);
      throw error;
    }

    if (!responseData) {
      console.error('No data received from Edge Function');
      throw new Error('No data received from Edge Function');
    }

    // If responseData is an error object, throw it
    if ('error' in responseData) {
      console.error('Error from Edge Function:', responseData.error);
      throw new Error(responseData.error);
    }

    // Ensure we have an array to work with
    const plansArray = Array.isArray(responseData) ? responseData : [responseData];
    console.log('Plans array before validation:', plansArray);

    // Parse and validate the plans using Zod
    const validatedPlans = z.array(PlanSchema).parse(plansArray);
    console.log('Validated plans:', validatedPlans);

    return validatedPlans;
  } catch (error) {
    console.error("Error fetching plans:", error);
    throw error;
  }
};

export const getPlanTypes = async () => {
  // Mock response for plan types
  return ["Fixed Rate", "Variable Rate", "Indexed Rate"];
};

export const getRenewableOptions = async () => {
  // Mock response for renewable options
  return ["0%", "6%", "15%", "100%"];
};