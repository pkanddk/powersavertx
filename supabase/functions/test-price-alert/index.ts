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

    if (alertsError) {
      console.error('[test-price-alert] Error fetching alerts:', alertsError);
      throw alertsError;
    }
    
    if (!alerts) {
      console.log('[test-price-alert] No active alerts found');
      return new Response(
        JSON.stringify({ error: 'No active price alerts found. Please create one first.' }), 
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`[test-price-alert] Found alert for plan: ${alerts.energy_plans.plan_name}`);

    // Get user email
    const { data: { user }, error: userError } = await supabase.auth.admin.getUserById(
      alerts.user_profiles.user_id
    );

    if (userError) {
      console.error('[test-price-alert] Error fetching user:', userError);
      throw userError;
    }

    if (!user?.email) {
      console.error('[test-price-alert] No email found for user:', alerts.user_profiles.user_id);
      throw new Error('User email not found');
    }

    console.log('[test-price-alert] Found user email:', user.email);

    // Get or create zip code record
    const zipCode = alerts.user_profiles.zip_code || '75001';
    const { data: existingZipCode, error: zipError } = await supabase
      .from('zip_codes')
      .select('id')
      .eq('zip_code', zipCode)
      .maybeSingle();

    if (zipError) {
      console.error('[test-price-alert] Error fetching zip code:', zipError);
      throw zipError;
    }

    let zipCodeId;
    if (existingZipCode) {
      zipCodeId = existingZipCode.id;
    } else {
      const { data: newZipCode, error: insertZipError } = await supabase
        .from('zip_codes')
        .insert({ zip_code: zipCode })
        .select('id')
        .single();

      if (insertZipError) {
        console.error('[test-price-alert] Error inserting zip code:', insertZipError);
        throw insertZipError;
      }
      zipCodeId = newZipCode.id;
    }

    console.log('[test-price-alert] Using zip code ID:', zipCodeId);

    // Insert a new record in api_history with a lower price
    const { error: insertError } = await supabase
      .from('api_history')
      .insert({
        zip_code_id: zipCodeId,
        company_id: alerts.energy_plans.company_id,
        company_name: 'Test Company',
        plan_name: alerts.energy_plans.plan_name,
        [`price_kwh${alerts.kwh_usage}`]: Number(alerts.price_threshold) - 0.1
      });

    if (insertError) {
      console.error('[test-price-alert] Error inserting test price:', insertError);
      throw insertError;
    }

    console.log('[test-price-alert] Inserted test price record');

    // Manually trigger the check-price-alerts function
    console.log('[test-price-alert] Triggering check-price-alerts function');
    const { data: checkResult, error: checkError } = await supabase.functions.invoke('check-price-alerts');
    
    if (checkError) {
      console.error('[test-price-alert] Error invoking check-price-alerts:', checkError);
      throw checkError;
    }

    console.log('[test-price-alert] check-price-alerts response:', checkResult);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Test completed. Check your email for the price alert notification.',
        email: user.email // Include the email in the response for debugging
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