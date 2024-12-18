import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

async function makeRequest(url: string, method: string, headers: Record<string, string>) {
  try {
    console.log("[Edge Function] Making request to:", url);
    console.log("[Edge Function] Request Method:", method);
    console.log("[Edge Function] Request Headers:", headers);

    const response = await fetch(url, {
      method,
      headers,
    });

    console.log("[Edge Function] Response Status:", response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error("[Edge Function] Error Response:", errorText);
      throw new Error(`HTTP Error ${response.status}: ${errorText}`);
    }

    const responseText = await response.text();
    console.log("[Edge Function] Raw response text:", responseText);

    let data;
    try {
      data = JSON.parse(responseText);
      console.log("[Edge Function] Parsed response data:", JSON.stringify(data, null, 2));
    } catch (parseError) {
      console.error("[Edge Function] JSON parse error:", parseError);
      throw new Error("Failed to parse API response as JSON");
    }

    // Handle empty responses
    if (!data || (Array.isArray(data) && data.length === 0)) {
      console.log("[Edge Function] No plans found in API response");
      return [];
    }

    // Extract plans from various response structures
    let plans = [];
    if (Array.isArray(data)) {
      plans = data;
    } else if (data.data && Array.isArray(data.data)) {
      plans = data.data;
    } else if (data.Results && Array.isArray(data.Results)) {
      plans = data.Results;
    } else {
      console.error("[Edge Function] Unexpected response structure:", data);
      throw new Error("Unexpected response structure from API");
    }

    console.log(`[Edge Function] Found ${plans.length} plans for ZIP code`);
    if (plans.length > 0) {
      console.log("[Edge Function] First plan sample:", JSON.stringify(plans[0], null, 2));
    }

    const transformedPlans = plans.map(plan => {
      console.log(`[Edge Function] Processing plan: ${plan.plan_name}`);

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

      return {
        company_id: String(plan.company_id || ""),
        company_name: String(plan.company_name || ""),
        company_logo: plan.company_logo || null,
        plan_name: String(plan.plan_name || ""),
        plan_type_name: String(plan.plan_type || ""),
        fact_sheet: plan.fact_sheet || null,
        go_to_plan: plan.enroll_plan_url || plan.go_to_plan || plan.enroll_now || null,
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

    console.log(`[Edge Function] Successfully transformed ${transformedPlans.length} plans`);
    return transformedPlans;

  } catch (error) {
    console.error(`[Edge Function] Request failed:`, error);
    throw error;
  }
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { zipCode, estimatedUse } = await req.json();
    console.log(`[Edge Function] Received request with ZIP: ${zipCode}, Usage: ${estimatedUse}`);

    if (!zipCode) {
      throw new Error("ZIP code is required");
    }

    let apiUrl = `http://api.powertochoose.org/api/PowerToChoose/plans?zip_code=${zipCode}`;
    
    if (estimatedUse && estimatedUse !== "Any Range") {
      const usageParam = estimatedUse === "between 500 and 1,000" ? "500-1000" :
                        estimatedUse === "between 1,001 and 2,000" ? "1001-2000" :
                        estimatedUse === "more than 2,000" ? "2001+" : null;
      if (usageParam) {
        apiUrl += `&kwh=${usageParam}`;
      }
    }

    console.log("[Edge Function] Making request to URL:", apiUrl);

    const plans = await makeRequest(apiUrl, "GET", {
      "Accept": "application/json",
      "Content-Type": "application/json"
    });
    
    return new Response(JSON.stringify(plans), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200
    });

  } catch (error) {
    console.error("[Edge Function] Error:", error);
    
    return new Response(
      JSON.stringify({
        error: true,
        message: error.message || "An unexpected error occurred",
        details: error.stack
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      }
    );
  }
});