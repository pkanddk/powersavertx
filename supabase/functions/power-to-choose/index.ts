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

    console.log('[Edge Function] Request body to Power to Choose API:', JSON.stringify(requestBody, null, 2));

    // Function to make the API request with retries
    const makeRequest = async (retries = 3, baseDelay = 1000) => {
      for (let i = 0; i < retries; i++) {
        try {
          console.log(`[Edge Function] Attempt ${i + 1} of ${retries}`);
          
          const response = await fetch(`${POWER_TO_CHOOSE_API}/plans`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            },
            body: JSON.stringify(requestBody),
          });

          console.log('[Edge Function] Response status:', response.status);
          console.log('[Edge Function] Response headers:', Object.fromEntries(response.headers.entries()));
          
          if (response.status === 429) {
            console.log(`[Edge Function] Rate limited, attempt ${i + 1} of ${retries}`);
            if (i < retries - 1) {
              const delay = baseDelay * Math.pow(2, i);
              console.log(`[Edge Function] Waiting ${delay}ms before retry`);
              await new Promise(resolve => setTimeout(resolve, delay));
              continue;
            }
            throw new Error('Rate limit exceeded. Please try again later.');
          }

          if (!response.ok) {
            const errorText = await response.text();
            console.error('[Edge Function] API error response:', errorText);
            throw new Error(`API Error: ${response.status} ${response.statusText}\n${errorText}`);
          }

          // Get the raw response text and log it
          const rawText = await response.text();
          console.log('[Edge Function] Raw response:', rawText);

          try {
            return JSON.parse(rawText);
          } catch (parseError) {
            console.error('[Edge Function] JSON parse error:', parseError);
            console.error('[Edge Function] Raw text that failed to parse:', rawText);
            throw new Error('Failed to parse API response as JSON');
          }
        } catch (error) {
          console.error(`[Edge Function] Request attempt ${i + 1} failed:`, error);
          if (i === retries - 1) throw error;
          const delay = baseDelay * Math.pow(2, i);
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
    };

    const data = await makeRequest();
    console.log('[Edge Function] Parsed response data:', JSON.stringify(data, null, 2));

    if (!data) {
      console.error('[Edge Function] No data received from API');
      throw new Error('No data received from API');
    }

    // Extract plans from the response - handle both array and object structures
    let apiPlans;
    if (Array.isArray(data)) {
      apiPlans = data;
      console.log('[Edge Function] Data is an array with', data.length, 'items');
    } else if (data && typeof data === 'object') {
      console.log('[Edge Function] Data is an object with keys:', Object.keys(data));
      // Check various possible response structures
      if (Array.isArray(data.data)) {
        apiPlans = data.data;
        console.log('[Edge Function] Using data.data array with', data.data.length, 'items');
      } else if (data.plans && Array.isArray(data.plans)) {
        apiPlans = data.plans;
        console.log('[Edge Function] Using data.plans array with', data.plans.length, 'items');
      } else if (data.Results && Array.isArray(data.Results)) {
        apiPlans = data.Results;
        console.log('[Edge Function] Using data.Results array with', data.Results.length, 'items');
      } else {
        console.error('[Edge Function] Could not find plans array in response:', data);
        throw new Error('Invalid response structure: no plans array found');
      }
    } else {
      console.error('[Edge Function] Invalid response type:', typeof data);
      throw new Error('Invalid response type from API');
    }

    if (!apiPlans || !apiPlans.length) {
      console.log('[Edge Function] No plans found in response');
      return new Response(JSON.stringify([]), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log('[Edge Function] Sample plan data:', JSON.stringify(apiPlans[0], null, 2));

    // Transform plans with careful type handling
    const transformedPlans = apiPlans.map((plan, index) => {
      console.log(`[Edge Function] Transforming plan ${index + 1}:`, plan);
      
      const transformed = {
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
      };
      
      console.log(`[Edge Function] Transformed plan ${index + 1}:`, transformed);
      return transformed;
    });

    console.log(`[Edge Function] Successfully transformed ${transformedPlans.length} plans`);
    console.log('[Edge Function] First transformed plan:', JSON.stringify(transformedPlans[0], null, 2));

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