import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Helper functions
const parseRenewablePercentage = (plan: any): number | null => {
  if (plan.renewable_percentage !== undefined && plan.renewable_percentage !== null) {
    return Number(plan.renewable_percentage);
  }

  if (plan.renewable_energy_id) {
    const percentage = Number(plan.renewable_energy_id);
    if (!isNaN(percentage)) {
      return percentage;
    }
  }

  if (plan.renewable_energy_description) {
    const match = plan.renewable_energy_description.match(/(\d+)%/);
    if (match) {
      return Number(match[1]);
    }
  }

  return null;
};

const makeRequest = async (url: string, method: string, headers: Record<string, string>) => {
  try {
    console.log("[Edge Function] Making request to:", url);
    console.log("[Edge Function] Request Method:", method);
    console.log("[Edge Function] Request Headers:", headers);

    const cleanUrl = url.replace(/[:\/]+$/, '');
    console.log("[Edge Function] Cleaned URL:", cleanUrl);
    
    const response = await fetch(cleanUrl, {
      method,
      headers,
    });

    console.log("[Edge Function] Response Status:", response.status);
    
    if (!response.ok) {
      throw new Error("Unable to fetch energy plans. Please try again later.");
    }

    // Read the response text once and store it
    const responseText = await response.text();
    console.log("[Edge Function] Response received");

    let data;
    try {
      data = JSON.parse(responseText);
      console.log("[Edge Function] Response parsed successfully");
    } catch (parseError) {
      console.error("[Edge Function] JSON parse error:", parseError);
      throw new Error("We're having trouble processing the energy plans data. Please try again later.");
    }

    if (data.error || (data.success === false)) {
      console.error("[Edge Function] API returned error:", data);
      throw new Error(data.message || "Unable to retrieve energy plans at this time. Please try again later.");
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
      throw new Error("We encountered an issue with the energy plans data format. Please try again later.");
    }

    console.log(`[Edge Function] Found ${plans.length} plans`);
    
    if (plans.length === 0) {
      throw new Error("No energy plans found for your area. Please try a different ZIP code.");
    }
    
    // Transform the plans to match our schema
    const transformedPlans = plans.map(plan => ({
      company_id: String(plan.company_id || ""),
      company_name: String(plan.company_name || ""),
      company_logo: plan.company_logo || null,
      company_tdu_name: plan.company_tdu_name || null,
      plan_name: String(plan.plan_name || ""),
      plan_type_name: String(plan.rate_type || "Fixed"),
      fact_sheet: plan.fact_sheet || null,
      go_to_plan: plan.enroll_plan_url || plan.go_to_plan || plan.enroll_now || null,
      minimum_usage: Boolean(plan.minimum_usage),
      new_customer: Boolean(plan.new_customer),
      plan_details: plan.special_terms || plan.plan_details || null,
      price_kwh: Number(plan.price_kwh || 0),
      price_kwh500: Number(plan.price_kwh500 || plan.rate500 || 0),
      price_kwh1000: Number(plan.price_kwh1000 || plan.rate1000 || 0),
      price_kwh2000: Number(plan.price_kwh2000 || plan.rate2000 || 0),
      base_charge: plan.base_charge ? Number(plan.base_charge) : null,
      contract_length: plan.term_value ? Number(plan.term_value) : null,
      prepaid: Boolean(plan.prepaid || false),
      timeofuse: Boolean(plan.timeofuse || false),
      renewable_percentage: parseRenewablePercentage(plan),
      pricing_details: plan.pricing_details || null,
      promotions: plan.promotions || null,
      enroll_phone: plan.enroll_phone || null,
      website: plan.website || null,
      terms_of_service: plan.terms_of_service || null,
      yrac_url: plan.yrac_url || null,
      detail_kwh500: plan.detail_kwh500 || null,
      detail_kwh1000: plan.detail_kwh1000 || null,
      detail_kwh2000: plan.detail_kwh2000 || null
    }));

    return transformedPlans;
  } catch (error) {
    console.error(`[Edge Function] Request failed:`, error);
    throw error;
  }
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { zipCode, estimatedUse } = await req.json();
    console.log(`[Edge Function] Received request with ZIP: ${zipCode}, Usage: ${estimatedUse}`);

    if (!zipCode) {
      throw new Error("Please enter a ZIP code to search for energy plans.");
    }

    const apiUrl = `http://api.powertochoose.org/api/PowerToChoose/plans?zip_code=${zipCode}${estimatedUse && estimatedUse !== "any" ? `&kWh=${estimatedUse}` : ''}`;
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
        message: error.message || "An unexpected error occurred while fetching energy plans. Please try again later."
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      }
    );
  }
});