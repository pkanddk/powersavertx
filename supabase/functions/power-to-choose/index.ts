import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { logger } from './logger.ts';
import { transformPlan } from './transformer.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

async function makeRequest(url: string, method: string, headers: Record<string, string>) {
  try {
    logger.info("🌐 Making request to URL:", url);
    
    const requestHeaders = {
      ...headers,
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    };
    
    logger.info("📤 Request headers:", requestHeaders);

    const response = await fetch(url, {
      method,
      headers: requestHeaders,
    });

    logger.info("📡 API Response Status:", response.status);
    logger.info("📡 API Response Headers:", Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      const errorText = await response.text();
      logger.error(`❌ API Error Response for ZIP ${url.split('zip_code=')[1]}:`, errorText);
      throw new Error(`HTTP Error ${response.status}: ${errorText}`);
    }

    const responseText = await response.text();
    logger.info(`📝 Raw API Response Text for ZIP ${url.split('zip_code=')[1]}:`, responseText);
    
    let data;
    try {
      data = JSON.parse(responseText);
      logger.info(`🔄 Parsed API Response for ZIP ${url.split('zip_code=')[1]}:`, data);
    } catch (parseError) {
      logger.error(`❌ JSON parse error for ZIP ${url.split('zip_code=')[1]}:`, parseError);
      throw new Error("Failed to parse API response as JSON");
    }

    if (!data) {
      logger.error(`❌ No data in API response for ZIP ${url.split('zip_code=')[1]}`);
      return [];
    }

    if (Array.isArray(data) && data.length === 0) {
      logger.info(`ℹ️ API returned empty array for ZIP ${url.split('zip_code=')[1]}`);
      return [];
    }

    let plans = [];
    if (Array.isArray(data)) {
      plans = data;
      logger.info(`📊 Found ${plans.length} plans in array format for ZIP ${url.split('zip_code=')[1]}`);
    } else if (data.data && Array.isArray(data.data)) {
      plans = data.data;
      logger.info(`📊 Found ${plans.length} plans in data.data format for ZIP ${url.split('zip_code=')[1]}`);
    } else if (data.Results && Array.isArray(data.Results)) {
      plans = data.Results;
      logger.info(`📊 Found ${plans.length} plans in Results format for ZIP ${url.split('zip_code=')[1]}`);
    } else {
      logger.error(`❌ Unexpected response structure for ZIP ${url.split('zip_code=')[1]}:`, data);
      throw new Error("Unexpected response structure from API");
    }

    logger.info(`🔍 Processing ${plans.length} plans for ZIP ${url.split('zip_code=')[1]}`);
    plans.forEach((plan, index) => {
      logger.info(`📋 Plan ${index + 1} details:`, {
        plan_id: plan.plan_id,
        plan_name: plan.plan_name,
        zip_code: plan.zip_code,
        timeofuse: plan.timeofuse
      });
    });

    const transformedPlans = plans.map(transformPlan);
    logger.info(`✨ Transformed ${transformedPlans.length} plans for ZIP ${url.split('zip_code=')[1]}:`, 
      transformedPlans.map(p => ({
        plan_name: p.plan_name,
        timeofuse: p.timeofuse,
        zip_code: p.zip_code
      }))
    );

    return transformedPlans;

  } catch (error) {
    logger.error(`❌ Request failed for URL ${url}:`, error);
    throw error;
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { zipCode, estimatedUse } = await req.json();
    logger.info("🔍 Starting search for:", { zipCode, estimatedUse });

    if (!zipCode) {
      throw new Error("ZIP code is required");
    }

    if (!/^\d{5}$/.test(zipCode)) {
      throw new Error("Invalid ZIP code format. Please enter a 5-digit ZIP code.");
    }

    // Validate that the ZIP code is in Texas
    const validTexasZipRanges = [
      [75001, 75999], // Dallas area
      [76001, 76999], // Fort Worth area
      [77001, 77999], // Houston area
      [78001, 78999], // San Antonio area
      [79001, 79999], // El Paso and West Texas
      [73301, 73399], // Austin area
      [88510, 88589], // El Paso additional ranges
    ];

    const zipNumeric = parseInt(zipCode, 10);
    const isTexasZip = validTexasZipRanges.some(([min, max]) => 
      zipNumeric >= min && zipNumeric <= max
    );

    if (!isTexasZip) {
      logger.error(`❌ Invalid Texas ZIP code: ${zipCode}`);
      return new Response(
        JSON.stringify({ error: "This ZIP code is not in Texas. Please enter a valid Texas ZIP code." }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400
        }
      );
    }

    let apiUrl = `http://api.powertochoose.org/api/PowerToChoose/plans?zip_code=${zipCode}`;
    if (estimatedUse && estimatedUse !== "any") {
      apiUrl += `&kWh=${estimatedUse}`;
    }

    logger.info("🔗 Constructed API URL:", apiUrl);

    const plans = await makeRequest(apiUrl, "GET", {
      "Accept": "application/json",
      "Content-Type": "application/json",
    });
    
    if (!plans || plans.length === 0) {
      logger.info("⚠️ No plans found for ZIP code:", zipCode);
      return new Response(
        JSON.stringify({ error: "No plans found for this ZIP code" }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 404
        }
      );
    }

    logger.success(`✅ Found ${plans.length} plans for ZIP code ${zipCode}`);

    // Create Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Delete existing plans for this ZIP code
    const { error: deleteError } = await supabaseClient
      .from('plans')
      .delete()
      .eq('zip_code', zipCode);

    if (deleteError) {
      logger.error(`❌ Error deleting existing plans for ZIP ${zipCode}:`, deleteError);
      throw new Error("Failed to update plans in database");
    }

    logger.info(`🗑️ Successfully deleted existing plans for ZIP code ${zipCode}`);

    // Insert new plans
    const { error: insertError } = await supabaseClient
      .from('plans')
      .insert(plans);

    if (insertError) {
      logger.error(`❌ Error inserting plans for ZIP ${zipCode}:`, insertError);
      throw new Error("Failed to store plans in database");
    }

    logger.success(`✅ Successfully stored ${plans.length} plans in database for ZIP ${zipCode}`);

    return new Response(JSON.stringify(plans), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200
    });

  } catch (error) {
    logger.error("❌ Error in request handler:", error);
    
    return new Response(
      JSON.stringify({
        error: true,
        message: error.message || "An unexpected error occurred",
        details: error.stack
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      }
    );
  }
});