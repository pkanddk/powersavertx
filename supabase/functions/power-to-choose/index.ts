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

// Add delay function for rate limiting
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { zipCode, estimatedUse } = await req.json();
    console.log(`[Edge Function] Processing request for ZIP: ${zipCode}, Usage: ${estimatedUse}`);

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

    console.log('[Edge Function] Request body to Power to Choose API:', JSON.stringify(requestBody, null, 2));

    // Function to make the API request with retries
    const makeRequest = async (retries = 3, delay = 1000) => {
      for (let i = 0; i < retries; i++) {
        try {
          const response = await fetch(`${POWER_TO_CHOOSE_API}/plans`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            },
            body: JSON.stringify(requestBody),
          });

          console.log('[Edge Function] Power to Choose API response status:', response.status);
          
          if (response.status === 429) {
            console.log(`[Edge Function] Rate limited, attempt ${i + 1} of ${retries}`);
            if (i < retries - 1) {
              await new Promise(resolve => setTimeout(resolve, delay * (i + 1))); // Exponential backoff
              continue;
            }
            throw new Error('Rate limit exceeded. Please try again later.');
          }

          if (!response.ok) {
            const errorText = await response.text();
            console.error('[Edge Function] Power to Choose API error response:', errorText);
            throw new Error(`API Error: ${response.status} ${response.statusText}\n${errorText}`);
          }

          return response;
        } catch (error) {
          if (i === retries - 1) throw error;
          await new Promise(resolve => setTimeout(resolve, delay * (i + 1)));
        }
      }
    };

    const response = await makeRequest();
    if (!response) throw new Error('Failed to get response from API');

    // Get the raw response text and log it
    const rawText = await response.text();
    console.log('[Edge Function] Power to Choose API raw response:', rawText);
    
    // Try to parse the response as JSON
    let data;
    try {
      data = JSON.parse(rawText);
      console.log('[Edge Function] Parsed response:', JSON.stringify(data, null, 2));
    } catch (error) {
      console.error('[Edge Function] Failed to parse response as JSON:', error);
      console.error('[Edge Function] Raw text that failed to parse:', rawText);
      throw new Error('Failed to parse API response as JSON');
    }

    // Extract plans from the response
    const apiPlans = Array.isArray(data) ? data : (data.data || []);
    console.log(`[Edge Function] Found ${apiPlans.length} plans in response`);

    if (!Array.isArray(apiPlans)) {
      console.error('[Edge Function] Plans is not an array:', apiPlans);
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

    console.log('[Edge Function] Sending transformed plans:', JSON.stringify(transformedPlans, null, 2));

    return new Response(JSON.stringify(transformedPlans), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('[Edge Function] Error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: error.message.includes('Rate limit') ? 429 : 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});