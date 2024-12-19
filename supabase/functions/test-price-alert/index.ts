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
    console.log('[test-price-alert] Starting test');
    console.log('[test-price-alert] RESEND_API_KEY present:', !!RESEND_API_KEY);
    
    if (!RESEND_API_KEY) {
      throw new Error('RESEND_API_KEY is not set');
    }
    
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
          plan_name,
          company_name
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

    // Send test email via Resend
    console.log('[test-price-alert] Sending test email to:', user.email);
    
    const emailResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: 'Power Saver TX <alerts@powersavertx.com>',
        to: [user.email],
        subject: 'Test Price Alert 💡',
        html: `
          <!DOCTYPE html>
          <html>
            <head>
              <style>
                body { 
                  font-family: Arial, sans-serif;
                  line-height: 1.6;
                  color: #333;
                  max-width: 600px;
                  margin: 0 auto;
                  padding: 20px;
                }
                .header {
                  background-color: #D6BCFA;
                  padding: 20px;
                  border-radius: 8px;
                  margin-bottom: 20px;
                  text-align: center;
                }
                .plan-card {
                  border: 1px solid #e2e8f0;
                  border-radius: 8px;
                  padding: 16px;
                  margin-bottom: 16px;
                  background-color: #fff;
                }
                .company-name {
                  font-size: 18px;
                  font-weight: bold;
                  color: #2d3748;
                }
                .plan-name {
                  color: #4a5568;
                  margin: 8px 0;
                }
                .price {
                  font-size: 16px;
                  color: #2d3748;
                  margin: 8px 0;
                }
                .info {
                  background-color: #f7fafc;
                  border: 1px solid #e2e8f0;
                  border-radius: 8px;
                  padding: 16px;
                  margin-top: 20px;
                }
              </style>
            </head>
            <body>
              <div class="header">
                <h2>🎯 Test Price Alert</h2>
                <p>Your price alerts are working!</p>
              </div>
              
              <div class="plan-card">
                <div class="company-name">${alerts.energy_plans.company_name}</div>
                <div class="plan-name">${alerts.energy_plans.plan_name}</div>
                <div class="price">
                  Alert set for: ${alerts.price_threshold}¢/kWh
                  <br>
                  Usage level: ${alerts.kwh_usage} kWh
                </div>
              </div>
              
              <div class="info">
                <p>✅ Your price alerts are properly configured</p>
                <p>You will receive notifications when prices match your criteria.</p>
                <p style="color: #666; font-size: 14px;">
                  Price alerts automatically expire after 30 days. You can manage your alerts in your profile settings.
                </p>
              </div>
            </body>
          </html>
        `,
      }),
    });

    const emailResponseText = await emailResponse.text();
    console.log('[test-price-alert] Resend API response:', emailResponseText);

    if (!emailResponse.ok) {
      console.error('[test-price-alert] Error from Resend API:', emailResponseText);
      throw new Error(`Failed to send email: ${emailResponseText}`);
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Test completed. Check your email for the price alert notification.',
        email: user.email
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