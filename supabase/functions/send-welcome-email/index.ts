
// Follow this setup guide to integrate the Deno runtime into your application:
// https://deno.com/deploy/docs/getting-started

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { SmtpClient } from "https://deno.land/x/smtp@v0.7.0/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // This is needed to handle the preflight request
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // Parse the request body
    const { email, name } = await req.json();

    if (!email) {
      return new Response(
        JSON.stringify({
          error: "Email is required",
        }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Get the site URL from environment variables or use a default
    const siteUrl = Deno.env.get("SITE_URL") || "https://recovery-essentials.com";

    // Configure SMTP client (using fake SMTP details - replace with real ones)
    const client = new SmtpClient();

    const smtpHost = Deno.env.get("SMTP_HOST") || "smtp.example.com";
    const smtpPort = Number(Deno.env.get("SMTP_PORT")) || 587;
    const smtpUsername = Deno.env.get("SMTP_USERNAME") || "username";
    const smtpPassword = Deno.env.get("SMTP_PASSWORD") || "password";
    const fromEmail = Deno.env.get("FROM_EMAIL") || "welcome@recovery-essentials.com";

    const username = name || email.split("@")[0];

    try {
      await client.connectTLS({
        hostname: smtpHost,
        port: smtpPort,
        username: smtpUsername,
        password: smtpPassword,
      });

      // Prepare HTML content for the email
      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; }
            .container { padding: 20px; }
            .header { background-color: #4f46e5; padding: 20px; color: white; text-align: center; }
            .content { padding: 20px; }
            .button { display: inline-block; background-color: #4f46e5; color: white; text-decoration: none; padding: 10px 20px; margin: 20px 0; border-radius: 4px; }
            .footer { text-align: center; margin-top: 20px; font-size: 12px; color: #666; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Welcome to Recovery Essentials!</h1>
            </div>
            <div class="content">
              <p>Hello ${username},</p>
              <p>Welcome to our community! We're thrilled to have you join us on your wellness journey.</p>
              <p>At Recovery Essentials, we're dedicated to helping you find the best recovery equipment and techniques to support your active lifestyle.</p>
              <p>Here's what you can do now:</p>
              <ul>
                <li>Complete your profile</li>
                <li>Connect with other members</li>
                <li>Explore our product reviews and recommendations</li>
                <li>Share your own recovery experiences</li>
              </ul>
              <a href="${siteUrl}/profile" class="button">Visit Your Profile</a>
              <p>If you have any questions or need assistance, don't hesitate to reach out!</p>
              <p>Best regards,<br>The Recovery Essentials Team</p>
            </div>
            <div class="footer">
              <p>© ${new Date().getFullYear()} Recovery Essentials. All rights reserved.</p>
              <p>This email was sent to ${email} because you signed up for Recovery Essentials.</p>
            </div>
          </div>
        </body>
        </html>
      `;

      // Send email
      await client.send({
        from: fromEmail,
        to: email,
        subject: "Welcome to Recovery Essentials!",
        content: "Hello World!",
        html: htmlContent,
      });

      await client.close();

      console.log(`Welcome email sent to ${email}`);

      return new Response(
        JSON.stringify({
          success: true,
          message: "Welcome email sent successfully",
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        }
      );
    } catch (emailError) {
      console.error("Error sending email:", emailError);
      
      // In a real-world scenario, we might want to log this failure but not fail the entire signup process
      return new Response(
        JSON.stringify({
          success: false,
          message: "Failed to send welcome email, but user was created",
          error: emailError.message,
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 500,
        }
      );
    }
  } catch (error) {
    console.error("Error in send-welcome-email function:", error);
    
    return new Response(
      JSON.stringify({
        error: error.message,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
