import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const SUPABASE_URL = Deno.env.get('SUPABASE_URL') ?? '';
const SUPABASE_ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY') ?? '';
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

Deno.serve(async (req) => {
  try {
    // Get all active price alerts
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
      .eq('active', true);

    if (alertsError) throw alertsError;

    // Process each alert
    for (const alert of alerts) {
      const { data: latestPrices, error: pricesError } = await supabase
        .from('api_history')
        .select('*')
        .eq('company_id', alert.energy_plans.company_id)
        .eq('plan_name', alert.energy_plans.plan_name)
        .order('created_at', { ascending: false })
        .limit(1);

      if (pricesError) throw pricesError;

      if (latestPrices?.[0]) {
        const currentPrice = latestPrices[0][`price_kwh${alert.kwh_usage}`];
        
        if (currentPrice && currentPrice <= alert.price_threshold) {
          // Price has dropped below threshold - notify user
          // For now, we'll just log it
          console.log(`Alert triggered for user ${alert.user_id}: ${alert.energy_plans.plan_name} price (${currentPrice}¢) is below threshold (${alert.price_threshold}¢)`);
          
          // Deactivate the alert
          await supabase
            .from('user_plan_tracking')
            .update({ active: false })
            .eq('id', alert.id);
        }
      }
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error processing price alerts:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
});