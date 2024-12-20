import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

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
    console.log("[send-bug-report] Starting to process bug report");
    
    if (!RESEND_API_KEY) {
      console.error("[send-bug-report] RESEND_API_KEY is not set");
      throw new Error("RESEND_API_KEY is not configured");
    }

    // Parse request body
    let description: string;
    try {
      const body = await req.json();
      description = body.description;
      console.log("[send-bug-report] Received description:", description);
      
      if (!description) {
        throw new Error("Description is required");
      }
    } catch (error) {
      console.error("[send-bug-report] Error parsing request body:", error);
      return new Response(
        JSON.stringify({ error: "Invalid request body" }),
        { 
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        }
      );
    }

    console.log("[send-bug-report] Sending email to pkshow@me.com");
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "Power Saver TX <bugs@powersavertx.com>",
        to: ["pkshow@me.com"],
        subject: "New Bug Report from Power Saver TX",
        html: `
          <div style="font-family: Arial, sans-serif; padding: 20px;">
            <h2 style="color: #333;">New Bug Report</h2>
            <div style="background: #f5f5f5; padding: 15px; border-radius: 5px; margin-top: 20px;">
              <p style="margin: 0; line-height: 1.6;">${description}</p>
            </div>
          </div>
        `,
      }),
    });

    const responseText = await res.text();
    console.log("[send-bug-report] Resend API response:", responseText);

    if (!res.ok) {
      console.error("[send-bug-report] Error from Resend API:", responseText);
      throw new Error(`Failed to send email: ${responseText}`);
    }

    return new Response(
      JSON.stringify({ success: true }),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error("[send-bug-report] Error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});