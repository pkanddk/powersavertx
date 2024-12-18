import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("[Edge Function] Starting energy plans sync");
    
    // Initialize Supabase client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Fetch data from Power to Choose API
    const zipCode = "75001"; // Default ZIP code for testing
    const apiUrl = `http://api.powertochoose.org/api/PowerToChoose/plans?zip_code=${zipCode}`;
    
    console.log("[Edge Function] Fetching from API:", apiUrl);
    const response = await fetch(apiUrl);
    
    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`);
    }

    const data = await response.json();
    console.log(`[Edge Function] Received ${data.length} plans from API`);

    // Transform the data
    const transformedPlans = data.map((plan: any) => ({
      company_id: String(plan.company_id || ""),
      company_name: String(plan.company_name || ""),
      company_logo: plan.company_logo || null,
      plan_name: String(plan.plan_name || ""),
      plan_type_name: String(plan.plan_type || ""),
      fact_sheet: plan.fact_sheet || null,
      go_to_plan: plan.enroll_plan_url || plan.go_to_plan || plan.enroll_now || null,
      minimum_usage: Boolean(plan.minimum_usage),
      new_customer: Boolean(plan.new_customer),
      plan_details: String(plan.special_terms || ""),
      price_kwh: parseFloat(plan.price_kwh || plan.rate500 || 0),
      price_kwh500: parseFloat(plan.price_kwh500 || plan.rate500 || 0),
      price_kwh1000: parseFloat(plan.price_kwh1000 || plan.rate1000 || 0),
      price_kwh2000: parseFloat(plan.price_kwh2000 || plan.rate2000 || 0),
      base_charge: plan.base_charge ? parseFloat(plan.base_charge) : null,
      contract_length: plan.term_value ? parseInt(plan.term_value) : null,
      last_updated: new Date().toISOString()
    }));

    // Clear existing data and insert new data
    const { error: deleteError } = await supabase
      .from('energy_plans')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all records

    if (deleteError) {
      throw new Error(`Failed to clear existing data: ${deleteError.message}`);
    }

    const { error: insertError } = await supabase
      .from('energy_plans')
      .insert(transformedPlans);

    if (insertError) {
      throw new Error(`Failed to insert new data: ${insertError.message}`);
    }

    console.log("[Edge Function] Successfully synced energy plans");

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Energy plans synced successfully",
        count: transformedPlans.length
      }),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200 
      }
    );

  } catch (error) {
    console.error("[Edge Function] Error:", error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500
      }
    );
  }
});