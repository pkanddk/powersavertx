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
    logger.info("Making request to", url);
    
    const response = await fetch(url, {
      method,
      headers,
    });

    if (!response.ok) {
      const errorText = await response.text();
      logger.error("Error Response", errorText);
      throw new Error(`HTTP Error ${response.status}: ${errorText}`);
    }

    const responseText = await response.text();
    
    let data;
    try {
      data = JSON.parse(responseText);
      logger.raw(data);
    } catch (parseError) {
      logger.error("JSON parse error", parseError);
      throw new Error("Failed to parse API response as JSON");
    }

    if (!data || (Array.isArray(data) && data.length === 0)) {
      logger.info("No plans found in API response");
      return [];
    }

    let plans = [];
    if (Array.isArray(data)) {
      plans = data;
    } else if (data.data && Array.isArray(data.data)) {
      plans = data.data;
    } else if (data.Results && Array.isArray(data.Results)) {
      plans = data.Results;
    } else {
      logger.error("Unexpected response structure", data);
      throw new Error("Unexpected response structure from API");
    }

    logger.success(`Found ${plans.length} plans`);
    return plans.map(transformPlan);

  } catch (error) {
    logger.error("Request failed", error);
    throw error;
  }
}

serve(async (req) => {
  const supabaseClient = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
  );

  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { zipCode, estimatedUse } = await req.json();
    logger.info("Starting search", { zipCode, estimatedUse });

    if (!zipCode) {
      throw new Error("ZIP code is required");
    }

    if (!/^\d{5}$/.test(zipCode)) {
      throw new Error("Invalid ZIP code format. Please enter a 5-digit ZIP code.");
    }

    let apiUrl = `http://api.powertochoose.org/api/PowerToChoose/plans?zip_code=${zipCode}`;
    if (estimatedUse && estimatedUse !== "any") {
      apiUrl += `&kWh=${estimatedUse}`;
    }

    const plans = await makeRequest(apiUrl, "GET", {
      "Accept": "application/json",
      "Content-Type": "application/json"
    });
    
    if (!plans || plans.length === 0) {
      return new Response(
        JSON.stringify({ error: "No plans found for this ZIP code" }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 404
        }
      );
    }

    // Delete existing plans for this ZIP code
    const { error: deleteError } = await supabaseClient
      .from('plans')
      .delete()
      .eq('zip_code', zipCode);

    if (deleteError) {
      logger.error("Error deleting existing plans", deleteError);
      throw new Error("Failed to update plans in database");
    }

    // Insert new plans
    const { error: insertError } = await supabaseClient
      .from('plans')
      .insert(plans);

    if (insertError) {
      logger.error("Error inserting plans", insertError);
      throw new Error("Failed to store plans in database");
    }

    logger.success(`Successfully stored ${plans.length} plans in database`);

    return new Response(JSON.stringify(plans), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200
    });

  } catch (error) {
    logger.error("Error in request handler", error);
    
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