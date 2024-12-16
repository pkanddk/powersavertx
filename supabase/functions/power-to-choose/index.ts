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
    console.log(`Processing request for ZIP: ${zipCode}, Usage: ${estimatedUse}`);

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

    console.log('Sending request to Power to Choose API:', requestBody);

    const response = await fetch(`${POWER_TO_CHOOSE_API}/plans`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      console.error(`API Error: ${response.status} ${response.statusText}`);
      const errorText = await response.text();
      console.error('Error response:', errorText);
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    const rawData = await response.text();
    console.log('Raw API Response:', rawData);
    
    const data = JSON.parse(rawData);
    console.log('Parsed API Response:', data);

    // The API returns the plans directly in the response
    const apiPlans = Array.isArray(data) ? data : [];
    console.log(`Retrieved ${apiPlans.length} plans from API`);

    if (apiPlans.length === 0) {
      console.log('No plans found for the given ZIP code');
      return new Response(JSON.stringify([]), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Transform and store plans in Supabase
    const transformedPlans = apiPlans.map(plan => ({
      company_id: plan.company_id,
      company_name: plan.company_name,
      company_logo: plan.company_logo_name,
      plan_name: plan.plan_name,
      plan_type_name: plan.plan_type,
      fact_sheet: plan.fact_sheet,
      go_to_plan: plan.enroll_now,
      jdp_rating: plan.rating || 0,
      jdp_rating_year: new Date().getFullYear().toString(),
      minimum_usage: Boolean(plan.minimum_usage),
      new_customer: Boolean(plan.new_customer),
      plan_details: plan.special_terms || '',
      price_kwh: plan.price_kwh,
      base_charge: plan.base_charge || null,
      contract_length: plan.term_value || 0
    }));

    console.log(`Transformed ${transformedPlans.length} plans`);

    // Delete existing plans before inserting new ones
    const { error: deleteError } = await supabase
      .from('plans')
      .delete()
      .eq('company_id', transformedPlans[0]?.company_id);

    if (deleteError) {
      console.error('Error deleting existing plans:', deleteError);
    }

    // Insert new plans
    const { data: insertedPlans, error: insertError } = await supabase
      .from('plans')
      .insert(transformedPlans)
      .select();

    if (insertError) {
      console.error('Error inserting plans:', insertError);
      throw new Error('Failed to store plans in database');
    }

    console.log(`Successfully stored ${insertedPlans.length} plans in database`);

    // Return the transformed plans directly
    return new Response(JSON.stringify(transformedPlans), {
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