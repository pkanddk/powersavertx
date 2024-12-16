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
    console.log("[Edge Function] Raw response:", responseText);

    let data;
    try {
      data = JSON.parse(responseText);
      console.log("[Edge Function] Parsed response:", data);
    } catch (parseError) {
      console.error("[Edge Function] JSON parse error:", parseError);
      throw new Error("Failed to parse API response as JSON");
    }

    if (data.error || (data.success === false)) {
      console.error("[Edge Function] API returned error:", data);
      throw new Error(data.message || "API returned an error");
    }

    let plans = [];
    if (Array.isArray(data)) {
      plans = data;
    } else if (data.data && Array.isArray(data.data)) {
      plans = data.data;
    } else if (data.plans && Array.isArray(data.plans)) {
      plans = data.plans;
    } else if (data.Results && Array.isArray(data.Results)) {
      plans = data.Results;
    } else {
      console.error("[Edge Function] Unexpected response structure:", data);
      throw new Error("Unexpected response structure from API");
    }

    console.log(`[Edge Function] Found ${plans.length} plans`);

    const transformedPlans = plans.map(plan => {
      // Log raw plan data for debugging
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

      // Helper function to parse rate strings and convert from cents to dollars
      const parseRate = (rate: string | number | null | undefined): number => {
        if (!rate) return 0;
        
        // Convert to string and remove any non-numeric characters except decimal points
        const cleanRate = String(rate).replace(/[^\d.]/g, '');
        const parsed = parseFloat(cleanRate);
        
        // Convert from cents to dollars (divide by 100)
        const result = isNaN(parsed) ? 0 : parsed / 100;
        console.log(`[Edge Function] Parsing rate: ${rate} -> ${cleanRate} -> ${parsed} -> ${result}`);
        return result;
      };

      // Try to get the rate from various possible fields, prioritizing price_kwh1000
      let price_kwh = 0;
      if (plan.price_kwh1000) {
        price_kwh = parseRate(plan.price_kwh1000);
        console.log(`[Edge Function] Using price_kwh1000: ${plan.price_kwh1000} -> ${price_kwh}`);
      } else if (plan.rate1000) {
        price_kwh = parseRate(plan.rate1000);
        console.log(`[Edge Function] Using rate1000: ${plan.rate1000} -> ${price_kwh}`);
      } else if (plan.avgprice) {
        price_kwh = parseRate(plan.avgprice);
        console.log(`[Edge Function] Using avgprice: ${plan.avgprice} -> ${price_kwh}`);
      } else if (plan.price) {
        price_kwh = parseRate(plan.price);
        console.log(`[Edge Function] Using price: ${plan.price} -> ${price_kwh}`);
      }

      console.log(`[Edge Function] Final price_kwh for plan ${plan.plan_name}: ${price_kwh}`);

      return {
        company_id: String(plan.company_id || ""),
        company_name: String(plan.company_name || ""),
        company_logo: plan.company_logo || null,
        plan_name: String(plan.plan_name || ""),
        plan_type_name: String(plan.plan_type || ""),
        fact_sheet: plan.fact_sheet || null,
        go_to_plan: plan.enroll_now || null,
        jdp_rating: plan.rating ? parseFloat(plan.rating) : null,
        jdp_rating_year: new Date().getFullYear().toString(),
        minimum_usage: Boolean(plan.minimum_usage),
        new_customer: Boolean(plan.new_customer),
        plan_details: String(plan.special_terms || ""),
        price_kwh: price_kwh,
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