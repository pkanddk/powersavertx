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

    // Try to parse the response as JSON
    let data;
    try {
      data = JSON.parse(responseText);
      console.log("[Edge Function] Parsed response:", data);
    } catch (parseError) {
      console.error("[Edge Function] JSON parse error:", parseError);
      throw new Error("Failed to parse API response as JSON");
    }

    // Check if the response indicates an error
    if (data.error || (data.success === false)) {
      console.error("[Edge Function] API returned error:", data);
      throw new Error(data.message || "API returned an error");
    }

    // Extract plans from the response structure
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

    // Transform plans with proper price handling
    const transformedPlans = plans.map(plan => {
      // Extract and parse the price, handling different possible formats
      let price_kwh = 0;
      if (typeof plan.price_kwh === 'number') {
        price_kwh = plan.price_kwh;
      } else if (typeof plan.price === 'number') {
        price_kwh = plan.price;
      } else if (plan.rate1000) {
        // Try to parse rate1000 as it's commonly used
        const rate = parseFloat(plan.rate1000);
        if (!isNaN(rate)) {
          price_kwh = rate / 100; // Convert cents to dollars if needed
        }
      } else if (plan.rate500) {
        // Fallback to rate500
        const rate = parseFloat(plan.rate500);
        if (!isNaN(rate)) {
          price_kwh = rate / 100;
        }
      } else if (plan.rate2000) {
        // Fallback to rate2000
        const rate = parseFloat(plan.rate2000);
        if (!isNaN(rate)) {
          price_kwh = rate / 100;
        }
      }

      // Log the price extraction for debugging
      console.log(`[Edge Function] Extracted price for plan ${plan.plan_name}:`, {
        original: {
          price_kwh: plan.price_kwh,
          price: plan.price,
          rate500: plan.rate500,
          rate1000: plan.rate1000,
          rate2000: plan.rate2000
        },
        parsed: price_kwh
      });

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
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { zipCode, estimatedUse } = await req.json();
    console.log(`[Edge Function] Received request with ZIP: ${zipCode}, Usage: ${estimatedUse}`);

    if (!zipCode) {
      throw new Error("ZIP code is required");
    }

    // Construct the URL with query parameters
    let apiUrl = `http://api.powertochoose.org/api/PowerToChoose/plans?zip_code=${zipCode}`;
    
    // Add estimated usage parameter if provided
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