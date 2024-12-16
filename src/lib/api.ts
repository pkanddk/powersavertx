import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";

export const PlanSchema = z.object({
  company_id: z.string(),
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

// Mock data for development and fallback
const mockPlans: Plan[] = [
  {
    company_id: "1",
    company_logo: "https://placehold.co/200x100?text=Energy+Co+1",
    plan_name: "Basic Energy Plan",
    plan_type_name: "Fixed Rate",
    fact_sheet: "https://example.com/factsheet1",
    go_to_plan: "https://example.com/signup1",
    jdp_rating: 4.5,
    jdp_rating_year: "2024",
    minimum_usage: false,
    new_customer: true,
    plan_details: "12-month fixed rate plan with no hidden fees",
    price_kwh: 0.089,
    base_charge: 9.95,
    contract_length: 12
  },
  {
    company_id: "2",
    company_logo: "https://placehold.co/200x100?text=Energy+Co+2",
    plan_name: "Green Energy Plus",
    plan_type_name: "Variable Rate",
    fact_sheet: "https://example.com/factsheet2",
    go_to_plan: "https://example.com/signup2",
    jdp_rating: 4.2,
    jdp_rating_year: "2024",
    minimum_usage: true,
    new_customer: false,
    plan_details: "100% renewable energy with monthly rate adjustments",
    price_kwh: 0.105,
    contract_length: 1
  },
  {
    company_id: "3",
    company_logo: "https://placehold.co/200x100?text=Energy+Co+3",
    plan_name: "Premium Power",
    plan_type_name: "Fixed Rate",
    fact_sheet: "https://example.com/factsheet3",
    go_to_plan: "https://example.com/signup3",
    jdp_rating: 4.8,
    jdp_rating_year: "2024",
    minimum_usage: false,
    new_customer: true,
    plan_details: "24-month fixed rate with free nights and weekends",
    price_kwh: 0.092,
    base_charge: 4.95,
    contract_length: 24
  },
  {
    company_id: "4",
    company_logo: "https://placehold.co/200x100?text=Energy+Co+4",
    plan_name: "Value Saver",
    plan_type_name: "Fixed Rate",
    fact_sheet: "https://example.com/factsheet4",
    go_to_plan: "https://example.com/signup4",
    jdp_rating: 4.3,
    jdp_rating_year: "2024",
    minimum_usage: true,
    new_customer: false,
    plan_details: "Low rate guaranteed for 6 months",
    price_kwh: 0.099,
    base_charge: 7.95,
    contract_length: 6
  },
  {
    company_id: "5",
    company_logo: "https://placehold.co/200x100?text=Energy+Co+5",
    plan_name: "Freedom Plan",
    plan_type_name: "Variable Rate",
    fact_sheet: "https://example.com/factsheet5",
    go_to_plan: "https://example.com/signup5",
    jdp_rating: 4.1,
    jdp_rating_year: "2024",
    minimum_usage: false,
    new_customer: false,
    plan_details: "No contract required, cancel anytime",
    price_kwh: 0.115,
    contract_length: 0
  }
];

export const searchPlans = async (zipCode: string, estimatedUse?: string) => {
  try {
    console.log(`Searching plans for ZIP: ${zipCode}, Usage: ${estimatedUse}`);
    
    const { data, error } = await supabase.functions.invoke('power-to-choose', {
      body: { zipCode, estimatedUse },
    });

    if (error) {
      console.error('Error calling Edge Function:', error);
      // Fallback to mock data in case of error
      return mockPlans;
    }

    if (!Array.isArray(data)) {
      console.error('Invalid response format:', data);
      return mockPlans;
    }

    return z.array(PlanSchema).parse(data);
  } catch (error) {
    console.error("Error fetching plans:", error);
    // Fallback to mock data in case of error
    return mockPlans;
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