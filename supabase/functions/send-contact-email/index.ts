import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@2.0.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Rate limiting: max 100 requests per IP per 10 minutes
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000; // 10 minutes
const MAX_REQUESTS_PER_WINDOW = 100;
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(ip);

  if (!record || now > record.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW_MS });
    return true;
  }

  if (record.count >= MAX_REQUESTS_PER_WINDOW) {
    return false;
  }

  record.count++;
  return true;
}

// Clean up old entries periodically
setInterval(() => {
  const now = Date.now();
  for (const [ip, record] of rateLimitMap.entries()) {
    if (now > record.resetTime) {
      rateLimitMap.delete(ip);
    }
  }
}, 60000); // Clean every minute

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get client IP for rate limiting
    const clientIP = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || 
                     req.headers.get("x-real-ip") || 
                     "unknown";

    // Check rate limit
    if (!checkRateLimit(clientIP)) {
      console.log(`Rate limit exceeded for IP: ${clientIP}`);
      return new Response(
        JSON.stringify({ error: "Too many requests. Please try again later." }),
        {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    if (!resendApiKey) {
      throw new Error("RESEND_API_KEY is not configured");
    }

    const { name, email, message } = await req.json();

    // Server-side validation
    if (!name || typeof name !== 'string' || name.trim().length < 2 || name.trim().length > 100) {
      throw new Error("Invalid name");
    }
    if (!email || typeof email !== 'string' || !email.includes('@') || email.length > 255) {
      throw new Error("Invalid email");
    }
    if (!message || typeof message !== 'string' || message.trim().length < 10 || message.trim().length > 1000) {
      throw new Error("Invalid message");
    }

    const sanitizedName = name.trim().replace(/[<>]/g, '');
    const sanitizedEmail = email.trim();
    const sanitizedMessage = message.trim().replace(/[<>]/g, '');

    const resend = new Resend(resendApiKey);

    // Send notification to support email
    const { error: notifyError } = await resend.emails.send({
      from: "CarbonTrack <onboarding@resend.dev>",
      to: ["campuswattwatch@gmail.com"],
      subject: `New Contact Form Submission from ${sanitizedName}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f4f4f5; margin: 0; padding: 20px;">
          <div style="max-width: 600px; margin: 0 auto; background-color: white; border-radius: 12px; padding: 32px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
            <div style="text-align: center; margin-bottom: 24px;">
              <h1 style="color: #16a34a; margin: 0;">New Contact Form Submission</h1>
            </div>
            
            <div style="background-color: #f0fdf4; border-radius: 8px; padding: 20px; margin-bottom: 24px;">
              <p style="margin: 0 0 12px 0;"><strong>From:</strong> ${sanitizedName}</p>
              <p style="margin: 0 0 12px 0;"><strong>Email:</strong> <a href="mailto:${sanitizedEmail}">${sanitizedEmail}</a></p>
            </div>
            
            <div style="background-color: #f4f4f5; border-radius: 8px; padding: 20px;">
              <p style="margin: 0 0 8px 0;"><strong>Message:</strong></p>
              <p style="margin: 0; white-space: pre-wrap;">${sanitizedMessage}</p>
            </div>
            
            <hr style="border: none; border-top: 1px solid #e4e4e7; margin: 24px 0;">
            <p style="color: #71717a; font-size: 12px; text-align: center; margin: 0;">
              This email was sent from the CarbonTrack contact form.
            </p>
          </div>
        </body>
        </html>
      `,
    });

    if (notifyError) {
      console.error("Failed to send notification email:", notifyError);
      throw new Error("Failed to send message");
    }

    // Send confirmation to user
    await resend.emails.send({
      from: "CarbonTrack <onboarding@resend.dev>",
      to: [sanitizedEmail],
      subject: "We received your message - CarbonTrack",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f4f4f5; margin: 0; padding: 20px;">
          <div style="max-width: 600px; margin: 0 auto; background-color: white; border-radius: 12px; padding: 32px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
            <div style="text-align: center; margin-bottom: 24px;">
              <h1 style="color: #16a34a; margin: 0;">Thank You!</h1>
            </div>
            
            <p style="color: #3f3f46; line-height: 1.6;">
              Hi ${sanitizedName},
            </p>
            <p style="color: #3f3f46; line-height: 1.6;">
              We've received your message and will get back to you as soon as possible. Our team typically responds within 24-48 hours.
            </p>
            
            <div style="background-color: #f4f4f5; border-radius: 8px; padding: 16px; margin: 24px 0;">
              <p style="margin: 0; font-size: 14px; color: #71717a;"><strong>Your message:</strong></p>
              <p style="margin: 8px 0 0 0; color: #3f3f46; white-space: pre-wrap;">${sanitizedMessage}</p>
            </div>
            
            <hr style="border: none; border-top: 1px solid #e4e4e7; margin: 24px 0;">
            <p style="color: #71717a; font-size: 12px; text-align: center; margin: 0;">
              CarbonTrack - Sustainable Campus Initiative
            </p>
          </div>
        </body>
        </html>
      `,
    });

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: unknown) {
    console.error("Error in send-contact-email function:", error);
    const errorMessage = error instanceof Error ? error.message : "Failed to send message";
    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
