import { createClient } from 'npm:@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
}

const SITE_NAME = 'WattLog'
const SITE_URL = 'https://campuswattwatch.com'
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

      const authClient = createClient(supabaseUrl, supabaseAnonKey, {
        auth: { persistSession: false, autoRefreshToken: false },
      }) as any
      const { error } = await authClient.auth.resetPasswordForEmail(email, {
        redirectTo: getResetRedirectUrl(req),
      })

      if (error) {
        console.error('Recovery link generation failed', { message: error.message })
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
        const { error: resendError } = await supabase.auth.resend({
          type: 'signup',
          email,
          options: { emailRedirectTo: redirectTo },
        })

        if (resendError) {
          console.error('Signup confirmation resend failed', { message: resendError.message })
        }
      }

      return jsonResponse({
        success: true,
        message: 'If this email needs confirmation, please check your inbox.',
      })
    }

    const confirmationUrl = data?.properties?.action_link
    if (!confirmationUrl) {
      console.error('Signup link generation returned no action link')
      return jsonResponse({ error: 'Unable to create confirmation link.' }, 500)
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

    try {
      await enqueueAuthEmail(supabase, 'signup', email, confirmationUrl)
    } catch (enqueueError) {
      console.error('Failed to enqueue signup confirmation', { error: enqueueError })
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
