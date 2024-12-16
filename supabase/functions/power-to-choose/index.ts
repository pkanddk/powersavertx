import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const POWER_TO_CHOOSE_API = "http://api.powertochoose.org/api/PowerToChoose";

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

    console.log('[Edge Function] Request body:', JSON.stringify(requestBody, null, 2));

    // Function to make the API request with retries
    const makeRequest = async (retries = 3, baseDelay = 1000) => {
      for (let i = 0; i < retries; i++) {
        try {
          console.log(`[Edge Function] Making request attempt ${i + 1} of ${retries}`);
          
          const response = await fetch(`${POWER_TO_CHOOSE_API}/plans`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            },
            body: JSON.stringify(requestBody),
          });

          console.log(`[Edge Function] Response status: ${response.status}`);
          
          // Get the raw response text first
          const rawText = await response.text();
          console.log('[Edge Function] Raw response:', rawText);

          // Check if the response is empty
          if (!rawText) {
            throw new Error('Empty response from API');
          }

          // Try to parse the response as JSON
          let data;
          try {
            data = JSON.parse(rawText);
          } catch (parseError) {
            console.error('[Edge Function] JSON parse error:', parseError);
            throw new Error('Failed to parse API response as JSON');
          }

          // Check if the response indicates an error
          if (data.error || (data.success === false)) {
            console.error('[Edge Function] API returned error:', data);
            throw new Error(data.message || 'API returned an error');
          }

          // Try different response formats
          let plans = null;
          if (Array.isArray(data)) {
            plans = data;
          } else if (data.data && Array.isArray(data.data)) {
            plans = data.data;
          } else if (data.plans && Array.isArray(data.plans)) {
            plans = data.plans;
          } else if (data.Results && Array.isArray(data.Results)) {
            plans = data.Results;
          }

          if (!plans) {
            console.log('[Edge Function] No plans array found in response');
            return [];
          }

          console.log(`[Edge Function] Found ${plans.length} plans`);

          // Transform plans
          const transformedPlans = plans.map(plan => ({
            company_id: String(plan.company_id || ''),
            company_name: String(plan.company_name || ''),
            company_logo: plan.company_logo_name || null,
            plan_name: String(plan.plan_name || ''),
            plan_type_name: String(plan.plan_type || ''),
            fact_sheet: plan.fact_sheet || null,
            go_to_plan: plan.enroll_now || null,
            jdp_rating: plan.rating ? parseFloat(plan.rating) : null,
            jdp_rating_year: new Date().getFullYear().toString(),
            minimum_usage: Boolean(plan.minimum_usage),
            new_customer: Boolean(plan.new_customer),
            plan_details: String(plan.special_terms || ''),
            price_kwh: parseFloat(plan.price_kwh || '0'),
            base_charge: plan.base_charge ? parseFloat(plan.base_charge) : null,
            contract_length: plan.term_value ? parseInt(plan.term_value) : null
          }));

          console.log(`[Edge Function] Successfully transformed ${transformedPlans.length} plans`);
          return transformedPlans;

        } catch (error) {
          console.error(`[Edge Function] Request attempt ${i + 1} failed:`, error);
          
          // If this is the last retry, throw the error
          if (i === retries - 1) {
            throw error;
          }
          
          // Otherwise wait and retry
          const delay = baseDelay * Math.pow(2, i);
          console.log(`[Edge Function] Waiting ${delay}ms before retry`);
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
    };

    const plans = await makeRequest();
    
    return new Response(JSON.stringify(plans), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200
    });

  } catch (error) {
    console.error('[Edge Function] Error:', error);
    
    return new Response(
      JSON.stringify({
        error: true,
        message: error.message || 'An unexpected error occurred',
        details: error.stack
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
