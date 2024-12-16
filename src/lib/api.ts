import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";

export const PlanSchema = z.object({
  company_id: z.string(),
  company_name: z.string(),
  company_logo: z.string(),
  plan_name: z.string(),
  plan_type_name: z.string(),
  fact_sheet: z.string(),
  go_to_plan: z.string(),
  jdp_rating: z.number(),
  jdp_rating_year: z.string(),
  minimum_usage: z.boolean(),
  new_customer: z.boolean(),
  plan_details: z.string(),
  price_kwh: z.number(),
  base_charge: z.number().optional(),
  contract_length: z.number()
});

export type Plan = z.infer<typeof PlanSchema>;

export const searchPlans = async (zipCode: string, estimatedUse?: string) => {
  try {
    console.log(`Searching plans for ZIP: ${zipCode}, Usage: ${estimatedUse}`);
    
    // First, trigger the Edge Function to fetch and store plans
    const { data: functionData, error: functionError } = await supabase.functions.invoke('power-to-choose', {
      body: { zipCode, estimatedUse },
    });

    if (functionError) {
      console.error('Error calling Edge Function:', functionError);
      throw functionError;
    }

    // Parse and validate the plans using Zod
    return z.array(PlanSchema).parse(functionData);
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