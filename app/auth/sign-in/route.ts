import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const requestUrl = new URL(request.url)
  const formData = await request.formData()
  const email = String(formData.get('email'))
  const password = String(formData.get('password'))
  const supabase = createRouteHandlerClient({ cookies })

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }

  return NextResponse.redirect(new URL('/', requestUrl.origin), {
    status: 301,
  })
}

// Handle OAuth sign in
export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const provider = requestUrl.searchParams.get('provider')
  
  if (!provider) {
    return NextResponse.json(
      { error: 'Provider is required' },
      { status: 400 }
    )
  }

  const supabase = createRouteHandlerClient({ cookies })
  
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: provider as any,
    options: {
      redirectTo: `${requestUrl.origin}/auth/callback`,
    },
  })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }

  return NextResponse.redirect(data.url)
} 