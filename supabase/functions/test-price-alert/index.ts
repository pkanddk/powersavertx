import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const SUPABASE_URL = Deno.env.get('SUPABASE_URL') ?? '';
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('[test-price-alert] Starting test');
    
    // Get the first active price alert
    const { data: alerts, error: alertsError } = await supabase
      .from('user_plan_tracking')
      .select(`
        *,
        user_profiles:user_id (
          user_id,
          zip_code
        ),
        energy_plans:plan_id (
          company_id,
          plan_name
        )
      `)
      .eq('active', true)
      .limit(1)
      .maybeSingle();

    if (alertsError) throw alertsError;
    
    if (!alerts) {
      return new Response(
        JSON.stringify({ error: 'No active price alerts found. Please create one first.' }), 
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`[test-price-alert] Found alert for plan: ${alerts.energy_plans.plan_name}`);

    // Get or create zip code record
    const zipCode = alerts.user_profiles.zip_code || '75001'; // Default to 75001 if no zip code
    const { data: existingZipCode, error: zipError } = await supabase
      .from('zip_codes')
      .select('id')
      .eq('zip_code', zipCode)
      .maybeSingle();

    if (zipError) throw zipError;

    let zipCodeId;
    if (existingZipCode) {
      zipCodeId = existingZipCode.id;
    } else {
      const { data: newZipCode, error: insertZipError } = await supabase
        .from('zip_codes')
        .insert({ zip_code: zipCode })
        .select('id')
        .single();

      if (insertZipError) throw insertZipError;
      zipCodeId = newZipCode.id;
    }

    // Insert a new record in api_history with a lower price
    const { error: insertError } = await supabase
      .from('api_history')
      .insert({
        zip_code_id: zipCodeId,
        company_id: alerts.energy_plans.company_id,
        company_name: 'Test Company',
        plan_name: alerts.energy_plans.plan_name,
        [`price_kwh${alerts.kwh_usage}`]: alerts.price_threshold - 0.1 // Set price just below threshold
      });

    if (insertError) throw insertError;

    // Manually trigger the check-price-alerts function
    const { data: checkResult, error: checkError } = await supabase.functions.invoke('check-price-alerts');
    if (checkError) throw checkError;

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Test completed. Check your email for the price alert notification.' 
      }), 
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('[test-price-alert] Error:', error);
    return new Response(
      JSON.stringify({ error: error.message }), 
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});