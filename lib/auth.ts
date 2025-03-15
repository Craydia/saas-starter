import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { cache } from 'react'

export const createServerSupabaseClient = cache(() =>
  createServerComponentClient({ cookies })
)

export async function getSession() {
  const supabase = createServerSupabaseClient()
  try {
    const {
      data: { session },
    } = await supabase.auth.getSession()
    return session
  } catch (error) {
    console.error('Error:', error)
    return null
  }
}

export async function getUser() {
  const supabase = createServerSupabaseClient()
  try {
    const { data: { user } } = await supabase.auth.getUser()
    return user
  } catch (error) {
    console.error('Error:', error)
    return null
  }
}

export async function requireAuth() {
  const session = await getSession()
  if (!session) {
    throw new Error('Not authenticated')
  }
  return session
} 