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
    
    // Check if it's email time (7 AM to 9 PM Central)
    const { data: isEmailTime } = await supabase.rpc('is_email_time');
    if (!isEmailTime) {
      console.log('[check-price-alerts] Outside email hours, skipping checks');
      return new Response(JSON.stringify({ message: 'Outside email hours' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Get all active price alerts and universal alerts
    const { data: profiles, error: profilesError } = await supabase
      .from('user_profiles')
      .select(`
        id,
        user_id,
        zip_code,
        universal_kwh_usage,
        universal_price_threshold
      `)
      .not('universal_kwh_usage', 'is', null)
      .not('universal_price_threshold', 'is', null);

    if (profilesError) {
      console.error('[check-price-alerts] Error fetching profiles:', profilesError);
      throw profilesError;
    }

    console.log(`[check-price-alerts] Found ${profiles?.length || 0} profiles with universal alerts`);

    // Process universal alerts
    for (const profile of profiles || []) {
      if (!profile.zip_code || !profile.universal_kwh_usage || !profile.universal_price_threshold) {
        continue;
      }

      console.log(`[check-price-alerts] Checking universal alert for profile: ${profile.id}`);

      // Get current plans for the zip code
      const { data: currentPlans, error: plansError } = await supabase
        .from('plans')
        .select('*')
        .eq('zip_code', profile.zip_code)
        .order('price_kwh' + profile.universal_kwh_usage);

      if (plansError) {
        console.error('[check-price-alerts] Error fetching plans:', plansError);
        continue;
      }

      // Filter plans below threshold
      const matchingPlans = currentPlans?.filter(plan => {
        const price = plan[`price_kwh${profile.universal_kwh_usage}`];
        return price && price <= profile.universal_price_threshold;
      });

      if (matchingPlans && matchingPlans.length > 0) {
        await sendUniversalAlert(profile, matchingPlans);
      }
    }

    // Get all active specific plan alerts
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
    
    console.log(`[check-price-alerts] Found ${alerts?.length || 0} active plan-specific alerts`);

    // Process each specific plan alert
    for (const alert of alerts || []) {
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
        console.error('[check-price-alerts] Error fetching prices:', pricesError);
        continue;
      }

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
        
        const currentPrice = currentPlan[`price_kwh${alert.kwh_usage}`];
        if (currentPrice && currentPrice <= alert.price_threshold) {
          await sendPlanAlert(alert, currentPrice);
        }
      } else {
        console.log('[check-price-alerts] Using prices from api_history:', latestPrices);
        const currentPrice = latestPrices[`price_kwh${alert.kwh_usage}`];
        if (currentPrice && currentPrice <= alert.price_threshold) {
          await sendPlanAlert(alert, currentPrice);
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

async function sendPlanAlert(alert: any, currentPrice: number) {
  console.log(`[check-price-alerts] Plan alert triggered! Price ${currentPrice}¢ is below threshold ${alert.price_threshold}¢`);
  
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

  console.log('[check-price-alerts] Sending plan alert email to:', userData.user.email);

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
        <p><a href="https://powersavertx.com/alerts">Manage your alerts</a></p>
      `,
    }),
  });

  if (!emailResponse.ok) {
    console.error('[check-price-alerts] Error sending email:', await emailResponse.text());
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

async function sendUniversalAlert(profile: any, matchingPlans: any[]) {
  console.log(`[check-price-alerts] Universal alert triggered for profile ${profile.id} with ${matchingPlans.length} matching plans`);
  
  const { data: userData, error: userError } = await supabase.auth.admin.getUserById(
    profile.user_id
  );

  if (userError) {
    console.error('[check-price-alerts] Error fetching user:', userError);
    return;
  }

  if (!userData?.user?.email) {
    console.error('[check-price-alerts] No email found for user:', profile.user_id);
    return;
  }

  console.log('[check-price-alerts] Sending universal alert email to:', userData.user.email);

  const plansHtml = matchingPlans
    .map(plan => `
      <div style="margin-bottom: 20px;">
        <h3>${plan.plan_name} by ${plan.company_name}</h3>
        <p>Price: ${plan[`price_kwh${profile.universal_kwh_usage}`]}¢/kWh at ${profile.universal_kwh_usage}kWh usage</p>
        ${plan.go_to_plan ? `<p><a href="${plan.go_to_plan}">View plan details</a></p>` : ''}
      </div>
    `)
    .join('');

  const emailResponse = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${RESEND_API_KEY}`,
    },
    body: JSON.stringify({
      from: 'Power Saver TX <alerts@powersavertx.com>',
      to: [userData.user.email],
      subject: `Price Alert: Found ${matchingPlans.length} plans matching your criteria!`,
      html: `
        <h2>Good news! We found plans matching your criteria.</h2>
        <p>Your criteria:</p>
        <ul>
          <li>Usage level: ${profile.universal_kwh_usage}kWh</li>
          <li>Price threshold: ${profile.universal_price_threshold}¢/kWh</li>
        </ul>
        <h3>Matching Plans:</h3>
        ${plansHtml}
        <p><a href="https://powersavertx.com/alerts">Manage your alerts</a></p>
      `,
    }),
  });

  if (!emailResponse.ok) {
    console.error('[check-price-alerts] Error sending universal alert email:', await emailResponse.text());
    return;
  }

  console.log(`[check-price-alerts] Universal alert email sent to ${userData.user.email}`);

  // Create alert history record
  const { error: historyError } = await supabase
    .from('alert_history')
    .insert({
      user_id: profile.id,
      zip_code: profile.zip_code,
      kwh_usage: profile.universal_kwh_usage,
      price_threshold: profile.universal_price_threshold,
      plans: matchingPlans,
      email_sent: true,
      email_sent_at: new Date().toISOString(),
    });

  if (historyError) {
    console.error('[check-price-alerts] Error creating alert history:', historyError);
  } else {
    console.log('[check-price-alerts] Alert history created successfully');
  }
}