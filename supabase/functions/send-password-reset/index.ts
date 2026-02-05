import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

interface PasswordResetRequest {
  email: string;
  resetLink: string;
}

const handler = async (req: Request): Promise<Response> => {
  console.log("Password reset email function called");
  
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, resetLink }: PasswordResetRequest = await req.json();
    console.log("Sending password reset email to:", email);

    // Validate required fields
    if (!email || !resetLink) {
      console.error("Missing required fields:", { email: !!email, resetLink: !!resetLink });
      throw new Error("Missing required fields: email and resetLink are required");
    }

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

    console.log("Password reset email sent successfully:", emailResponse);

    return new Response(JSON.stringify({ success: true, data: emailResponse }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-password-reset function:", error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
