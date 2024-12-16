// Follow Deno's deployment guidelines for Supabase Edge Functions
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const POWER_TO_CHOOSE_API = "https://www.powertochoose.org/en-us/service/v1";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (req.method !== 'POST') {
      throw new Error('Method not allowed');
    }

    const { zipCode, estimatedUse } = await req.json();
    console.log(`Processing request for ZIP: ${zipCode}, Usage: ${estimatedUse}`);

    if (!zipCode) {
      throw new Error('ZIP code is required');
    }

    // Format the request body according to the Power to Choose API requirements
    const requestBody = {
      zip_code: zipCode,
      // Include other required parameters
      product_id: "",
      promo_code: "",
      sort_by: "",
      sort_order: "",
      page_size: 100,
      page_number: 1,
      filter_by_contract_length: "",
      filter_by_kwh_usage: estimatedUse || "Any Range",
      filter_by_price: "",
      filter_by_renewable: "",
      filter_by_special_offer: "",
      filter_by_prepaid: "",
      filter_by_time_of_use: "",
      filter_by_spanish: "",
      filter_by_satisfaction: "",
      filter_by_jdp_rating: "",
      filter_by_company: "",
      filter_by_plan_type: "",
      filter_by_min_price: "",
      filter_by_max_price: "",
      filter_by_min_renewable: "",
      filter_by_max_renewable: "",
      filter_by_min_contract_length: "",
      filter_by_max_contract_length: "",
      filter_by_min_cancellation_fee: "",
      filter_by_max_cancellation_fee: "",
      filter_by_min_satisfaction: "",
      filter_by_max_satisfaction: "",
      filter_by_min_jdp_rating: "",
      filter_by_max_jdp_rating: "",
    };

    const response = await fetch(`${POWER_TO_CHOOSE_API}/plans`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      console.error(`API Error: ${response.status} ${response.statusText}`);
      const errorText = await response.text();
      console.error('Error response:', errorText);
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log(`Successfully retrieved ${data.length || 0} plans`);

    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in power-to-choose function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});