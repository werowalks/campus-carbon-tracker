import * as React from 'npm:react@18.3.1'
import { renderAsync } from 'npm:@react-email/components@0.0.22'
import { createClient } from 'npm:@supabase/supabase-js@2'
import { SignupEmail } from '../_shared/email-templates/signup.tsx'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
}

const SITE_NAME = 'WattLog'
const SITE_URL = 'https://campuswattwatch.com'
const SENDER_DOMAIN = 'notify.campuswattwatch.com'
const FROM_DOMAIN = 'campuswattwatch.com'

const allowedOrigins = new Set([
  'https://campuswattwatch.com',
  'https://www.campuswattwatch.com',
  'https://campus-green-view.lovable.app',
  'http://localhost:5173',
])

function jsonResponse(body: Record<string, unknown>, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  })
}

function isValidEmail(value: unknown): value is string {
  return typeof value === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())
}

function getRedirectUrl(req: Request): string {
  const origin = req.headers.get('origin')
  const safeOrigin = origin && allowedOrigins.has(origin) ? origin : SITE_URL
  return `${safeOrigin}/auth/callback`
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  if (req.method !== 'POST') {
    return jsonResponse({ error: 'Method not allowed' }, 405)
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

    if (!supabaseUrl || !supabaseServiceKey) {
      console.error('Missing required environment variables')
      return jsonResponse({ error: 'Server configuration error' }, 500)
    }

    const body = await req.json().catch(() => null)
    const email = typeof body?.email === 'string' ? body.email.trim().toLowerCase() : ''
    const password = typeof body?.password === 'string' ? body.password : ''
    const name = typeof body?.name === 'string' ? body.name.trim() : ''

    if (!name || name.length < 2 || name.length > 120) {
      return jsonResponse({ error: 'Name must be between 2 and 120 characters.' }, 400)
    }

    if (!isValidEmail(email)) {
      return jsonResponse({ error: 'Please enter a valid email address.' }, 400)
    }

    if (password.length < 6 || password.length > 128) {
      return jsonResponse({ error: 'Password must be between 6 and 128 characters.' }, 400)
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey) as any
    const redirectTo = getRedirectUrl(req)

    const { data, error } = await supabase.auth.admin.generateLink({
      type: 'signup',
      email,
      password,
      options: {
        redirectTo,
        data: { name },
      },
    })

    if (error) {
      console.error('Signup link generation failed', { message: error.message })
      const alreadyRegistered = /already|registered|exists/i.test(error.message)
      return jsonResponse({
        success: true,
        message: alreadyRegistered
          ? 'If this email needs confirmation, please check your inbox.'
          : 'Please check your email to confirm your account.',
      })
    }

    const confirmationUrl = data?.properties?.action_link
    if (!confirmationUrl) {
      console.error('Signup link generation returned no action link')
      return jsonResponse({ error: 'Unable to create confirmation link.' }, 500)
    }

    const templateProps = {
      siteName: SITE_NAME,
      siteUrl: SITE_URL,
      recipient: email,
      confirmationUrl,
    }

    const html = await renderAsync(React.createElement(SignupEmail, templateProps))
    const text = await renderAsync(React.createElement(SignupEmail, templateProps), {
      plainText: true,
    })

    const messageId = crypto.randomUUID()

    await supabase.from('email_send_log').insert({
      message_id: messageId,
      template_name: 'signup',
      recipient_email: email,
      status: 'pending',
    })

    const { error: enqueueError } = await supabase.rpc('enqueue_email', {
      queue_name: 'auth_emails',
      payload: {
        message_id: messageId,
        to: email,
        from: `${SITE_NAME} <noreply@${FROM_DOMAIN}>`,
        sender_domain: SENDER_DOMAIN,
        subject: 'Confirm your email - WattLog',
        html,
        text,
        purpose: 'transactional',
        label: 'signup',
        idempotency_key: `signup-${messageId}`,
        queued_at: new Date().toISOString(),
      },
    })

    if (enqueueError) {
      console.error('Failed to enqueue signup confirmation', { error: enqueueError })
      await supabase.from('email_send_log').insert({
        message_id: messageId,
        template_name: 'signup',
        recipient_email: email,
        status: 'failed',
        error_message: 'Failed to enqueue confirmation email',
      })
      return jsonResponse({ error: 'Unable to send confirmation email.' }, 500)
    }

    return jsonResponse({
      success: true,
      message: 'Please check your email to confirm your account.',
    })
  } catch (error) {
    console.error('Unexpected register-user error', error)
    return jsonResponse({ error: 'An unexpected error occurred.' }, 500)
  }
})
