import { createClient } from 'npm:@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
}

const SITE_NAME = 'WattLog'
const SITE_URL = 'https://campuswattwatch.com'
const SENDER_DOMAIN = 'notify.campuswattwatch.com'
const FROM_DOMAIN = 'campuswattwatch.com'

type AuthEmailType = 'signup' | 'recovery'
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

function getResetRedirectUrl(req: Request): string {
  const origin = req.headers.get('origin')
  const safeOrigin = origin && allowedOrigins.has(origin) ? origin : SITE_URL
  return `${safeOrigin}/reset-password`
}

function escapeHtml(value: unknown): string {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
}

function renderAuthEmail(type: AuthEmailType, confirmationUrl: string, email: string, name?: string) {
  const title = type === 'recovery' ? 'Reset your WattLog password' : 'Confirm your WattLog email'
  const actionLabel = type === 'recovery' ? 'Reset Password' : 'Verify Email'
  const greeting = name ? `Hi ${escapeHtml(name)},` : 'Hi,'
  const message = type === 'recovery'
    ? 'Use the secure link below to reset your password.'
    : `Use the secure link below to verify ${escapeHtml(email)} and finish creating your account.`
  const safeUrl = escapeHtml(confirmationUrl)

  const html = `<!doctype html><html><body style="margin:0;background:#ffffff;font-family:Arial,sans-serif;color:#122018"><div style="max-width:560px;margin:0 auto;padding:32px 24px"><h1 style="margin:0 0 16px;color:#1f2937;font-size:24px">${title}</h1><p style="font-size:15px;line-height:1.6;color:#4b5563">${greeting}</p><p style="font-size:15px;line-height:1.6;color:#4b5563">${message}</p><a href="${safeUrl}" style="display:inline-block;background:#2f6b4f;color:#ffffff;text-decoration:none;border-radius:8px;padding:12px 20px;font-weight:700">${actionLabel}</a><p style="margin-top:28px;font-size:12px;line-height:1.5;color:#6b7280">If you didn't request this email, you can safely ignore it.</p></div></body></html>`
  const text = `${title}\n\n${greeting}\n\n${message}\n\n${confirmationUrl}`

  return { html, text, subject: title }
}

async function enqueueAuthEmail(
  supabase: any,
  type: AuthEmailType,
  email: string,
  confirmationUrl: string,
  name?: string,
) {
  const messageId = crypto.randomUUID()
  const { html, text, subject } = renderAuthEmail(type, confirmationUrl, email, name)

  await supabase.from('email_send_log').insert({
    message_id: messageId,
    template_name: type,
    recipient_email: email,
    status: 'pending',
  })

  const { error } = await supabase.rpc('enqueue_email', {
    queue_name: 'auth_emails',
    payload: {
      message_id: messageId,
      to: email,
      from: `${SITE_NAME} <noreply@${FROM_DOMAIN}>`,
      sender_domain: SENDER_DOMAIN,
      subject,
      html,
      text,
      purpose: 'transactional',
      label: type,
      idempotency_key: messageId,
      queued_at: new Date().toISOString(),
    },
  })

  if (error) {
    await supabase.from('email_send_log').insert({
      message_id: messageId,
      template_name: type,
      recipient_email: email,
      status: 'failed',
      error_message: 'Failed to enqueue email',
    })
    throw error
  }
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
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY') ?? Deno.env.get('SUPABASE_PUBLISHABLE_KEY')

    if (!supabaseUrl || !supabaseServiceKey || !supabaseAnonKey) {
      console.error('Missing required environment variables')
      return jsonResponse({ error: 'Server configuration error' }, 500)
    }

    const body = await req.json().catch(() => null)
    const action = body?.action === 'recovery' ? 'recovery' : 'signup'
    const email = typeof body?.email === 'string' ? body.email.trim().toLowerCase() : ''
    const password = typeof body?.password === 'string' ? body.password : ''
    const name = typeof body?.name === 'string' ? body.name.trim() : ''

    if (action === 'recovery') {
      if (!isValidEmail(email)) {
        return jsonResponse({ error: 'Please enter a valid email address.' }, 400)
      }

      const supabase = createClient(supabaseUrl, supabaseServiceKey) as any
      const { data, error } = await supabase.auth.admin.generateLink({
        type: 'recovery',
        email,
        options: { redirectTo: getResetRedirectUrl(req) },
      })

      if (error) {
        console.error('Recovery link generation failed', { message: error.message })
      } else if (data?.properties?.action_link) {
        await enqueueAuthEmail(supabase, 'recovery', email, data.properties.action_link)
      }

      return jsonResponse({
        success: true,
        message: 'If an account exists for this email, a password reset link has been sent.',
      })
    }

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

      if (alreadyRegistered) {
        const { data: resendData, error: resendError } = await supabase.auth.admin.generateLink({
          type: 'signup',
          email,
          password,
          options: { redirectTo, data: { name } },
        })

        if (resendError) {
          console.error('Signup confirmation resend failed', { message: resendError.message })
        } else if (resendData?.properties?.action_link) {
          await enqueueAuthEmail(supabase, 'signup', email, resendData.properties.action_link, name)
        }

        return jsonResponse({
          success: true,
          message: 'If this email needs confirmation, please check your inbox.',
        })
      }

      return jsonResponse({ error: error.message || 'Registration failed.' }, 400)
    }

    if (data?.properties?.action_link) {
      await enqueueAuthEmail(supabase, 'signup', email, data.properties.action_link, name)
    }

    const userId = data?.user?.id
    if (userId) {
      const { data: existingProfile } = await supabase
        .from('profiles')
        .select('id')
        .eq('user_id', userId)
        .maybeSingle()

      if (!existingProfile) {
        await supabase.from('profiles').insert({ user_id: userId, name, email })
      }

      const { data: existingRole } = await supabase
        .from('user_roles')
        .select('id')
        .eq('user_id', userId)
        .eq('role', 'user')
        .maybeSingle()

      if (!existingRole) {
        await supabase.from('user_roles').insert({ user_id: userId, role: 'user' })
      }
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
