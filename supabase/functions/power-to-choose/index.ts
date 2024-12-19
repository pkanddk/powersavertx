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

    const transformedPlans = plans.map(plan => ({
      company_id: String(plan.company_id || ""),
      company_name: String(plan.company_name || ""),
      company_logo: plan.company_logo || null,
      company_tdu_name: plan.company_tdu_name || null,
      plan_name: String(plan.plan_name || ""),
      plan_type_name: String(plan.plan_type || "Fixed"),
      fact_sheet: plan.fact_sheet || null,
      go_to_plan: plan.enroll_plan_url || plan.go_to_plan || plan.enroll_now || null,
      minimum_usage: Boolean(plan.minimum_usage),
      new_customer: Boolean(plan.new_customer),
      plan_details: String(plan.special_terms || plan.plan_details || ""),
      price_kwh: Number(plan.price_kwh || 0),
      price_kwh500: Number(plan.price_kwh500 || plan.rate500 || 0),
      price_kwh1000: Number(plan.price_kwh1000 || plan.rate1000 || 0),
      price_kwh2000: Number(plan.price_kwh2000 || plan.rate2000 || 0),
      base_charge: plan.base_charge ? Number(plan.base_charge) : null,
      contract_length: plan.term_value ? Number(plan.term_value) : null,
      prepaid: Boolean(plan.prepaid || false),
      timeofuse: Boolean(plan.timeofuse || false),
      renewable_percentage: Number(plan.renewable_percentage || 0),
      pricing_details: String(plan.pricing_details || ""),
      promotions: String(plan.promotions || ""),
      enroll_phone: String(plan.enroll_phone || ""),
      website: String(plan.website || "")
    }));

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
    
    if (estimatedUse && estimatedUse !== "any") {
      apiUrl += `&kWh=${estimatedUse}`;
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