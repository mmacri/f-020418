
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY') || '';

serve(async (req) => {
  // Handle CORS preflight request
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    // Get the request body
    const { email, name } = await req.json()

    if (!email) {
      return new Response(
        JSON.stringify({ error: 'Email is required' }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Send welcome email using Resend
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: 'Recovery Essentials <hello@recoveryessentials.com>',
        to: email,
        subject: 'Welcome to Recovery Essentials Community!',
        html: `
          <div style="font-family: 'Arial', sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h1 style="color: #4a5568; text-align: center;">Welcome to Recovery Essentials!</h1>
            <p style="font-size: 16px; line-height: 1.6;">
              Hello ${name || 'there'},
            </p>
            <p style="font-size: 16px; line-height: 1.6;">
              Welcome to our community! We're thrilled to have you join us in our journey toward better health and recovery. 
              This is a place to share experiences, discover new recovery tools, and connect with others.
            </p>
            <div style="margin: 30px 0; text-align: center;">
              <a href="https://recoveryessentials.com/profile" 
                 style="background-color: #3182ce; color: white; padding: 12px 20px; text-decoration: none; border-radius: 4px; font-weight: bold;">
                 Visit Your Profile
              </a>
            </div>
            <p style="font-size: 16px; line-height: 1.6;">
              Here's what you can do in our community:
            </p>
            <ul style="font-size: 16px; line-height: 1.6;">
              <li>Share your recovery experiences and wellness journey</li>
              <li>Connect with others who share similar interests</li>
              <li>Discover reviews and recommendations for recovery equipment</li>
              <li>Bookmark useful posts to refer back to later</li>
            </ul>
            <p style="font-size: 16px; line-height: 1.6;">
              If you have any questions, feel free to contact us anytime.
            </p>
            <p style="font-size: 16px; line-height: 1.6;">
              Best regards,<br>
              The Recovery Essentials Team
            </p>
          </div>
        `
      })
    })

    const result = await response.json()
    console.log('Email send result:', result)

    return new Response(
      JSON.stringify({ success: true, message: 'Welcome email sent successfully' }),
      { 
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  } catch (error) {
    console.error('Error sending welcome email:', error)
    
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})
