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
          user_id
        ),
        energy_plans:plan_id (
          company_id,
          plan_name
        )
      `)
      .eq('active', true)
      .limit(1);

    if (alertsError) throw alertsError;
    
    if (!alerts || alerts.length === 0) {
      return new Response(
        JSON.stringify({ error: 'No active price alerts found. Please create one first.' }), 
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const alert = alerts[0];
    console.log(`[test-price-alert] Found alert for plan: ${alert.energy_plans.plan_name}`);

    // Insert a new record in api_history with a lower price
    const { error: insertError } = await supabase
      .from('api_history')
      .insert({
        zip_code_id: '00000000-0000-0000-0000-000000000000', // Dummy ID
        company_id: alert.energy_plans.company_id,
        company_name: 'Test Company',
        plan_name: alert.energy_plans.plan_name,
        [`price_kwh${alert.kwh_usage}`]: alert.price_threshold - 0.1 // Set price just below threshold
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