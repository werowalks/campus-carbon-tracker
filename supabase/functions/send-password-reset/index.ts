import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

// Rate limiting: 3 requests per 10 minutes per IP
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const MAX_REQUESTS_PER_WINDOW = 3;
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (entry && now < entry.resetTime) {
    if (entry.count >= MAX_REQUESTS_PER_WINDOW) {
      return false;
    }
    entry.count++;
  } else {
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW_MS });
  }
  return true;
}

// Allowed domains for reset links
const ALLOWED_HOSTNAMES = [
  "localhost",
  "campus-green-view.lovable.app",
  "id-preview--ad520d2f-cdb1-49bf-a686-a5f42fc927f7.lovable.app",
];

function isAllowedResetLink(link: string): boolean {
  try {
    const url = new URL(link);
    return ALLOWED_HOSTNAMES.some(
      (h) => url.hostname === h || url.hostname.endsWith(`.${h}`)
    );
  } catch {
    return false;
  }
}

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface PasswordResetRequest {
  email: string;
  resetLink: string;
}

const handler = async (req: Request): Promise<Response> => {
  console.log("Password reset email function called");

  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Rate limiting
    const clientIp =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      req.headers.get("x-real-ip") ||
      "unknown";

    if (!checkRateLimit(clientIp)) {
      console.warn("Rate limit exceeded for IP:", clientIp);
      return new Response(
        JSON.stringify({ success: false, error: "Too many requests. Please try again later." }),
        { status: 429, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const { email, resetLink }: PasswordResetRequest = await req.json();

    // Validate email
    if (!email || typeof email !== "string" || !emailRegex.test(email) || email.length > 255) {
      return new Response(
        JSON.stringify({ success: false, error: "Invalid email address" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Validate resetLink domain
    if (!resetLink || typeof resetLink !== "string" || !isAllowedResetLink(resetLink)) {
      console.error("Rejected invalid reset link domain:", resetLink);
      return new Response(
        JSON.stringify({ success: false, error: "Invalid reset link" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    console.log("Sending password reset email to:", email.substring(0, 3) + "***");

    const emailResponse = await resend.emails.send({
      from: "Carbon Footprint Dashboard <onboarding@resend.dev>",
      to: [email],
      subject: "Reset your password - Carbon Footprint Dashboard",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 20px;">
          <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
            <div style="background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%); padding: 30px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 24px;">🌱 Carbon Footprint Dashboard</h1>
            </div>
            <div style="padding: 40px 30px;">
              <h2 style="color: #333333; margin-top: 0;">Password Reset Request</h2>
              <p style="color: #666666; line-height: 1.6;">
                You requested to reset your password for your Carbon Footprint Dashboard account. 
                Click the button below to set a new password:
              </p>
              <div style="text-align: center; margin: 30px 0;">
                <a href="${resetLink}" style="display: inline-block; background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%); color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 6px; font-weight: 600; font-size: 16px;">
                  Reset Password
                </a>
              </div>
              <p style="color: #666666; line-height: 1.6; font-size: 14px;">
                If the button doesn't work, copy and paste this link into your browser:
              </p>
              <p style="color: #22c55e; word-break: break-all; font-size: 14px;">
                ${resetLink}
              </p>
              <hr style="border: none; border-top: 1px solid #eeeeee; margin: 30px 0;">
              <p style="color: #999999; font-size: 13px; line-height: 1.5;">
                If you didn't request this password reset, you can safely ignore this email. 
                This link will expire in 1 hour for your security.
              </p>
            </div>
            <div style="background-color: #f9f9f9; padding: 20px 30px; text-align: center;">
              <p style="color: #999999; font-size: 12px; margin: 0;">
                Sustainable Campus Initiative
              </p>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    console.log("Password reset email sent successfully");

    return new Response(JSON.stringify({ success: true, data: emailResponse }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("Error in send-password-reset function:", error);
    return new Response(
      JSON.stringify({ success: false, error: "An error occurred processing your request." }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

serve(handler);
