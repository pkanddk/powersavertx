import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { fetchPlans } from "./powerToChooseApi.ts";

// Define CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { zipCode, estimatedUse } = await req.json();
    console.log(`[Edge Function] Received request for ZIP: ${zipCode}, Usage: ${estimatedUse}`);

    const plans = await fetchPlans(zipCode, estimatedUse);
    if (!plans || plans.length === 0) {
      throw new Error("No plans found for the given ZIP code.");
    }

    const transformedPlans = plans.map(plan => {
      console.log(`[Edge Function] Processing plan: ${plan.plan_name}`);
      console.log(`[Edge Function] Raw rate data:`, {
        price_kwh500: plan.price_kwh500,
        price_kwh1000: plan.price_kwh1000,
        price_kwh2000: plan.price_kwh2000,
        rate500: plan.rate500,
        rate1000: plan.rate1000,
        rate2000: plan.rate2000,
        avgprice: plan.avgprice,
        price: plan.price
      });

      const parseRate = (rate: string | number | null | undefined): number => {
        if (!rate) return 0;
        const cleanRate = String(rate).replace(/[^\d.]/g, '');
        const parsed = parseFloat(cleanRate);
        const result = isNaN(parsed) ? 0 : parsed / 100;
        console.log(`[Edge Function] Parsing rate: ${rate} -> ${cleanRate} -> ${parsed} -> ${result}`);
        return result;
      };

      // Parse all three rate tiers
      const price_kwh500 = parseRate(plan.price_kwh500 || plan.rate500);
      const price_kwh1000 = parseRate(plan.price_kwh1000 || plan.rate1000);
      const price_kwh2000 = parseRate(plan.price_kwh2000 || plan.rate2000);

      // Default to 500 kWh rate if no usage specified
      const price_kwh = price_kwh500;

      console.log(`[Edge Function] Final rates for plan ${plan.plan_name}:`, {
        price_kwh500,
        price_kwh1000,
        price_kwh2000,
        selected_price: price_kwh
      });

      // Get the enrollment URL from various possible fields
      const go_to_plan = plan.enroll_url || plan.signup_url || plan.enrollment_url || null;
      console.log(`[Edge Function] Enrollment URL for plan ${plan.plan_name}:`, go_to_plan);

      return {
        company_id: String(plan.company_id || ""),
        company_name: String(plan.company_name || ""),
        company_logo: plan.company_logo || null,
        plan_name: String(plan.plan_name || ""),
        plan_type_name: String(plan.plan_type || ""),
        fact_sheet: plan.fact_sheet || null,
        go_to_plan: go_to_plan,
        jdp_rating: plan.rating ? parseFloat(plan.rating) : null,
        jdp_rating_year: plan.rating_year || null,
        minimum_usage: Boolean(plan.minimum_usage),
        new_customer: Boolean(plan.new_customer),
        plan_details: String(plan.special_terms || ""),
        price_kwh,
        price_kwh500,
        price_kwh1000,
        price_kwh2000,
        base_charge: plan.base_charge ? parseFloat(plan.base_charge) : null,
        contract_length: plan.term_value ? parseInt(plan.term_value) : null
      };
    });

    return new Response(JSON.stringify(transformedPlans), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("[Edge Function] Error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});