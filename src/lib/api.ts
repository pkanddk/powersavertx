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
  plan_details: z.string()
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
    plan_details: "12-month fixed rate plan with no hidden fees"
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
    plan_details: "100% renewable energy with monthly rate adjustments"
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
    plan_details: "24-month fixed rate with free nights and weekends"
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