import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

interface Plan {
  plan_name: string;
  company_name: string;
  price_kwh: number;
  go_to_plan?: string;
}

interface EmailRequest {
  to: string[];
  plans: Plan[];
  kwh_usage: string;
  price_threshold: number;
}

const formatPrice = (price: number) => {
  return `${(price * 100).toFixed(1)}¢`;
};

const generateEmailHTML = (plans: Plan[], kwh_usage: string, price_threshold: number) => {
  const threshold = formatPrice(price_threshold);
  
  return `
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
          .button {
            display: inline-block;
            background-color: #805AD5;
            color: white;
            padding: 8px 16px;
            border-radius: 4px;
            text-decoration: none;
            margin-top: 8px;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h2>Price Alert Match Found! 🎉</h2>
          <p>We found plans matching your criteria for ${kwh_usage} kWh usage below ${threshold}/kWh</p>
        </div>
        
        ${plans.map(plan => `
          <div class="plan-card">
            <div class="company-name">${plan.company_name}</div>
            <div class="plan-name">${plan.plan_name}</div>
            <div class="price">Price: ${formatPrice(plan.price_kwh)}/kWh</div>
            ${plan.go_to_plan ? `
              <a href="${plan.go_to_plan}" class="button">View Plan</a>
            ` : ''}
          </div>
        `).join('')}
        
        <p style="color: #666; font-size: 14px; margin-top: 20px;">
          This alert will automatically expire in 30 days. You can manage your alerts in your profile settings.
        </p>
      </body>
    </html>
  `;
};

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const emailRequest: EmailRequest = await req.json();
    
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "Power to Choose <alerts@powertochoose.com>",
        to: emailRequest.to,
        subject: "Price Alert Match Found! 💡",
        html: generateEmailHTML(
          emailRequest.plans,
          emailRequest.kwh_usage,
          emailRequest.price_threshold
        ),
      }),
    });

    if (res.ok) {
      const data = await res.json();
      return new Response(JSON.stringify(data), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    } else {
      const error = await res.text();
      return new Response(JSON.stringify({ error }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
};

serve(handler);