import { z } from "zod";

export const profileSchema = z.object({
  zip_code: z.string().min(5).max(10),
  current_kwh_usage: z.string().optional(),
  renewable_preference: z.boolean().default(false),
  universal_kwh_usage: z.string().optional(),
  universal_price_threshold: z.string().optional(),
});

export type ProfileFormData = z.infer<typeof profileSchema>;

export interface PriceAlert {
  id: string;
  plan_name: string;
  company_name: string;
  kwh_usage: string;
  price_threshold: number;
}