import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { cache } from 'react'
import { authConfig } from './auth.config'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'

export const createServerClient = cache(() =>
  createServerComponentClient({ cookies })
)

export type Session = {
  user: {
    id: string
    email?: string
    name?: string
    image?: string
  }
  expires: string
}

export type AuthUser = Session['user']

export async function auth(): Promise<Session | null> {
  const supabase = createServerClient()
  try {
    const { data: { session } } = await supabase.auth.getSession()
    
    if (!session) return null

    return {
      user: {
        id: session.user.id,
        email: session.user.email,
        name: session.user.user_metadata?.name,
        image: session.user.user_metadata?.avatar_url,
      },
      expires: new Date(session.expires_at!).toISOString(),
    }
  } catch (error) {
    console.error('Error:', error)
    return null
  }
}

export async function signIn(provider: string, options?: { callbackUrl: string }) {
  const supabase = createServerClient()
  
  if (provider === 'google') {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: options?.callbackUrl || `${window.location.origin}/auth/callback`,
      },
    })
    if (error) throw error
    return data
  }
  
  throw new Error(`Provider ${provider} not supported`)
}

export async function signOut() {
  const supabase = createServerClient()
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

export const { pages } = authConfig

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')

  if (code) {
    const supabase = createRouteHandlerClient({ cookies })
    await supabase.auth.exchangeCodeForSession(code)
  }

  // URL to redirect to after sign in process completes
  return NextResponse.redirect(requestUrl.origin)
}

export async function POST(request: Request) {
  const supabase = createRouteHandlerClient({ cookies })
  
  try {
    const { data: { session }, error } = await supabase.auth.getSession()
    
    if (error) throw error
    
    return NextResponse.json({ session })
  } catch (error) {
    console.error('Auth error:', error)
    return NextResponse.json({ error: 'Authentication failed' }, { status: 401 })
  }
}
