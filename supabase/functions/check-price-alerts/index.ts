import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const SUPABASE_URL = Deno.env.get('SUPABASE_URL') ?? '';
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY') ?? '';

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
    console.log('[check-price-alerts] Starting price alert check');
    
    // Get all active price alerts with user and plan information
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
          company_name,
          plan_name,
          go_to_plan
        )
      `)
      .eq('active', true);

    if (alertsError) throw alertsError;
    console.log(`[check-price-alerts] Found ${alerts?.length || 0} active alerts`);

    // Process each alert
    for (const alert of alerts) {
      console.log(`[check-price-alerts] Processing alert for plan: ${alert.energy_plans.plan_name}`);
      
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
        console.log(`[check-price-alerts] Current price: ${currentPrice}¢, Threshold: ${alert.price_threshold}¢`);
        
        if (currentPrice && currentPrice <= alert.price_threshold) {
          console.log(`[check-price-alerts] Alert triggered! Price dropped below threshold`);
          
          // Get user's email
          const { data: userData, error: userError } = await supabase.auth.admin.getUserById(
            alert.user_profiles.user_id
          );

          if (userError) {
            console.error('[check-price-alerts] Error fetching user:', userError);
            continue;
          }

          if (userData?.user?.email) {
            // Send email via Resend with proper sender configuration
            const emailResponse = await fetch('https://api.resend.com/emails', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${RESEND_API_KEY}`,
              },
              body: JSON.stringify({
                from: 'Power Saver TX <powersavertx@resend.dev>',  // Use resend.dev domain for now
                to: [userData.user.email],
                subject: `Price Alert: ${alert.energy_plans.plan_name} price has dropped!`,
                html: `
                  <h2>Good news! The price has dropped below your target.</h2>
                  <p>The ${alert.energy_plans.plan_name} plan from ${alert.energy_plans.company_name} 
                  is now ${currentPrice}¢/kWh for ${alert.kwh_usage}kWh usage.</p>
                  <p>Your target price was: ${alert.price_threshold}¢/kWh</p>
                  ${alert.energy_plans.go_to_plan ? 
                    `<p><a href="${alert.energy_plans.go_to_plan}">View the plan</a></p>` : 
                    ''
                  }
                `,
              }),
            });

            if (!emailResponse.ok) {
              const errorData = await emailResponse.text();
              console.error('[check-price-alerts] Error sending email:', errorData);
              continue;
            }

            console.log(`[check-price-alerts] Email notification sent to ${userData.user.email}`);

            // Deactivate the alert after successful notification
            const { error: updateError } = await supabase
              .from('user_plan_tracking')
              .update({ active: false })
              .eq('id', alert.id);

            if (updateError) {
              console.error('[check-price-alerts] Error deactivating alert:', updateError);
            }
          }
        }
      }
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('[check-price-alerts] Error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});