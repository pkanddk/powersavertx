import { serve } from "https://deno.fresh.runtime.dev";

const POWER_TO_CHOOSE_API = "https://www.powertochoose.org/en-us/service/v1";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { zipCode, estimatedUse } = await req.json();

    if (!zipCode) {
      return new Response(
        JSON.stringify({ error: "ZIP code is required" }),
        { 
          status: 400,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    console.log(`Fetching plans for ZIP: ${zipCode}, Usage: ${estimatedUse}`);

    const response = await fetch(`${POWER_TO_CHOOSE_API}/plans`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      body: JSON.stringify({
        zip_code: zipCode,
        estimated_use: estimatedUse || "Any Range",
      }),
    });

    const data = await response.json();
    console.log(`Received ${data.length || 0} plans from API`);

    return new Response(
      JSON.stringify(data),
      { 
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Error in power-to-choose function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  }
});