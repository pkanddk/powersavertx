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
    const { data, error } = await supabase.functions.invoke('power-to-choose', {
      body: { zipCode, estimatedUse },
    });

    if (error) {
      console.error('Error calling Edge Function:', error);
      throw error;
    }

    if (!data || !Array.isArray(data)) {
      console.error('Invalid response format:', data);
      throw new Error('Invalid response format from Edge Function');
    }

    console.log('Received plans from Edge Function:', data);

    // Parse and validate the plans using Zod
    return z.array(PlanSchema).parse(data);
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