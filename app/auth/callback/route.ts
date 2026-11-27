import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'


const ALLOWED_REDIRECT_PREFIXES = ['/', '/duely', '/dashboard', '/pricing', '/reset-password']

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/'

  const safeNext = ALLOWED_REDIRECT_PREFIXES.some((p) => next.startsWith(p)) ? next : '/'

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      return NextResponse.redirect(`${origin}${safeNext}`)
    }
  }

  return NextResponse.redirect(
    `${origin}/login?error=${encodeURIComponent('Authentication failed. Please try again.')}`
  )
}