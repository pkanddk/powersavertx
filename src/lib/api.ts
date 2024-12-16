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

export const searchPlans = async (zipCode: string, estimatedUse?: string) => {
  try {
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
  } catch (error) {
    console.error("Error fetching plans:", error);
    throw error;
  }
};

export const getPlanTypes = async () => {
  const response = await fetch(`${API_BASE_URL}/plans/types`);
  if (!response.ok) throw new Error("Failed to fetch plan types");
  return await response.json();
};

export const getRenewableOptions = async () => {
  const response = await fetch(`${API_BASE_URL}/plans/renewable`);
  if (!response.ok) throw new Error("Failed to fetch renewable options");
  return await response.json();
};