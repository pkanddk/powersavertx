import { serve } from "https://deno.fresh.runtime.dev";

const POWER_TO_CHOOSE_API = "https://www.powertochoose.org/en-us/service/v1";

serve(async (req) => {
  try {
    const url = new URL(req.url);
    const searchParams = new URLSearchParams(url.search);
    const zipCode = searchParams.get("zipCode");
    const estimatedUse = searchParams.get("estimatedUse");

    if (!zipCode) {
      return new Response(
        JSON.stringify({ error: "ZIP code is required" }),
        { 
          status: 400,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
        }
      );
    }

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

    return new Response(
      JSON.stringify(data),
      { 
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      }
    );
  }
});