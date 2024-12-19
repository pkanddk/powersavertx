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
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('[check-price-alerts] Starting price alert check');
    console.log('[check-price-alerts] RESEND_API_KEY present:', !!RESEND_API_KEY);
    
    if (!RESEND_API_KEY) {
      throw new Error('RESEND_API_KEY is not set');
    }
    
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

    if (alertsError) {
      console.error('[check-price-alerts] Error fetching alerts:', alertsError);
      throw alertsError;
    }
    
    console.log(`[check-price-alerts] Found ${alerts?.length || 0} active alerts`);

    // Process each alert
    for (const alert of alerts) {
      console.log(`[check-price-alerts] Processing alert for plan: ${alert.energy_plans.plan_name}`);
      
      // First try to get latest price from api_history
      const { data: latestPrices, error: pricesError } = await supabase
        .from('api_history')
        .select('*')
        .eq('company_id', alert.energy_plans.company_id)
        .eq('plan_name', alert.energy_plans.plan_name)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (pricesError) {
        console.error('[check-price-alerts] Error fetching prices from api_history:', pricesError);
        continue;
      }

      // If no price found in api_history, try plans table
      if (!latestPrices) {
        console.log('[check-price-alerts] No prices found in api_history, checking plans table');
        const { data: currentPlan, error: planError } = await supabase
          .from('plans')
          .select('*')
          .eq('company_id', alert.energy_plans.company_id)
          .eq('plan_name', alert.energy_plans.plan_name)
          .maybeSingle();

        if (planError) {
          console.error('[check-price-alerts] Error fetching from plans table:', planError);
          continue;
        }

        if (!currentPlan) {
          console.log('[check-price-alerts] No plan found in either table');
          continue;
        }

        console.log('[check-price-alerts] Found current plan prices:', currentPlan);
        
        // Use the current plan's prices
        const currentPrice = currentPlan[`price_kwh${alert.kwh_usage}`];
        if (currentPrice && currentPrice <= alert.price_threshold) {
          await sendPriceAlert(alert, currentPrice);
        }
      } else {
        // Use the historical price from api_history
        console.log('[check-price-alerts] Using prices from api_history:', latestPrices);
        const currentPrice = latestPrices[`price_kwh${alert.kwh_usage}`];
        if (currentPrice && currentPrice <= alert.price_threshold) {
          await sendPriceAlert(alert, currentPrice);
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

async function sendPriceAlert(alert: any, currentPrice: number) {
  console.log(`[check-price-alerts] Alert triggered! Price ${currentPrice}¢ is below threshold ${alert.price_threshold}¢`);
  
  // Get user's email
  const { data: userData, error: userError } = await supabase.auth.admin.getUserById(
    alert.user_profiles.user_id
  );

  if (userError) {
    console.error('[check-price-alerts] Error fetching user:', userError);
    return;
  }

  if (!userData?.user?.email) {
    console.error('[check-price-alerts] No email found for user:', alert.user_profiles.user_id);
    return;
  }

  console.log('[check-price-alerts] Sending email to:', userData.user.email);

  // Send email via Resend
  const emailResponse = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${RESEND_API_KEY}`,
    },
    body: JSON.stringify({
      from: 'Power Saver TX <alerts@powersavertx.com>',
      to: [userData.user.email],
      subject: `Price Alert: ${alert.energy_plans.plan_name} price matches your target!`,
      html: `
        <h2>Good news! The price matches your criteria.</h2>
        <p>The ${alert.energy_plans.plan_name} plan from ${alert.energy_plans.company_name} 
        is currently ${currentPrice}¢/kWh for ${alert.kwh_usage}kWh usage.</p>
        <p>Your target price was: ${alert.price_threshold}¢/kWh</p>
        ${alert.energy_plans.go_to_plan ? 
          `<p><a href="${alert.energy_plans.go_to_plan}">View the plan</a></p>` : 
          ''
        }
      `,
    }),
  });

  const emailResponseText = await emailResponse.text();
  console.log('[check-price-alerts] Email API response:', emailResponseText);

  if (!emailResponse.ok) {
    console.error('[check-price-alerts] Error sending email:', emailResponseText);
    return;
  }

  console.log(`[check-price-alerts] Email notification sent to ${userData.user.email}`);

  // Deactivate the alert after successful notification
  const { error: updateError } = await supabase
    .from('user_plan_tracking')
    .update({ active: false })
    .eq('id', alert.id);

  if (updateError) {
    console.error('[check-price-alerts] Error deactivating alert:', updateError);
  } else {
    console.log('[check-price-alerts] Alert deactivated successfully');
  }
}