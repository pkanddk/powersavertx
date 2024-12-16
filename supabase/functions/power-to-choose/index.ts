import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const POWER_TO_CHOOSE_API = "http://api.powertochoose.org/api/PowerToChoose";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { zipCode, estimatedUse } = await req.json();
    console.log(`[Request] Processing request for ZIP: ${zipCode}, Usage: ${estimatedUse}`);

    if (!zipCode) {
      throw new Error('ZIP code is required');
    }

    // Format the request body according to the Power to Choose API requirements
    const requestBody = {
      zip_code: zipCode,
      estimated_use: estimatedUse || null,
      renewable: null,
      plan_type: null,
      page_size: 200,
      page_number: 1
    };

    console.log('[API Request] Sending request to Power to Choose API:', JSON.stringify(requestBody, null, 2));

    const response = await fetch(`${POWER_TO_CHOOSE_API}/plans`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(requestBody),
    });

    console.log('[API Response] Status:', response.status);
    console.log('[API Response] Status Text:', response.statusText);
    console.log('[API Response] Headers:', Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[API Error] Response:', errorText);
      throw new Error(`API Error: ${response.status} ${response.statusText}\n${errorText}`);
    }

    // Get the raw response text and log it
    const rawText = await response.text();
    console.log('[API Response] Raw text:', rawText);
    
    // Try to parse the response as JSON
    let data;
    try {
      data = JSON.parse(rawText);
      console.log('[API Response] Parsed JSON:', JSON.stringify(data, null, 2));
    } catch (error) {
      console.error('[Parse Error] Failed to parse response as JSON:', error);
      console.error('[Parse Error] Raw text that failed to parse:', rawText);
      throw new Error('Failed to parse API response as JSON');
    }

    // Extract plans from the response
    const apiPlans = Array.isArray(data) ? data : (data.data || []);
    console.log(`[Processing] Found ${apiPlans.length} plans in response`);
    console.log('[Processing] Plans:', JSON.stringify(apiPlans, null, 2));

    if (!Array.isArray(apiPlans)) {
      console.error('[Validation Error] Plans is not an array:', apiPlans);
      throw new Error('Invalid plans format: expected array');
    }

    // Transform plans
    const transformedPlans = apiPlans.map(plan => ({
      company_id: plan.company_id,
      company_name: plan.company_name,
      company_logo: plan.company_logo_name,
      plan_name: plan.plan_name,
      plan_type_name: plan.plan_type,
      fact_sheet: plan.fact_sheet,
      go_to_plan: plan.enroll_now,
      jdp_rating: plan.rating || null,
      jdp_rating_year: new Date().getFullYear().toString(),
      minimum_usage: Boolean(plan.minimum_usage),
      new_customer: Boolean(plan.new_customer),
      plan_details: plan.special_terms || '',
      price_kwh: plan.price_kwh,
      base_charge: plan.base_charge || null,
      contract_length: plan.term_value || null
    }));

    console.log('[Response] Sending transformed plans:', JSON.stringify(transformedPlans, null, 2));

    return new Response(JSON.stringify(transformedPlans), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('[Error] Edge function error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});