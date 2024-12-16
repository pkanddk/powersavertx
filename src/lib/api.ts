import { z } from "zod";

const API_BASE_URL = "https://cors-proxy.org/?url=https://www.powertochoose.org/en-us/service/v1";

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

// Mock data for development
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
    // For development, return mock data instead of making API call
    console.log('Searching plans for:', { zipCode, estimatedUse });
    return mockPlans;
    
    /* Real API call code kept for reference
    const response = await fetch(`${API_BASE_URL}/plans`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "Origin": window.location.origin,
        "X-Requested-With": "XMLHttpRequest"
      },
      body: JSON.stringify({
        zip_code: zipCode,
        estimated_use: estimatedUse || "Any Range",
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return z.array(PlanSchema).parse(data);
    */
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